const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const env = require("../config/env");

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const generateUniqueUsername = async (baseName) => {
  const normalizedBase =
    baseName
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 24) || "user";

  let username = normalizedBase;
  let counter = 1;

  while (await User.exists({ username })) {
    username = `${normalizedBase}${counter}`;
    counter += 1;
  }

  return username;
};

const authenticateWithGoogle = async (credential) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const { sub, email, email_verified, given_name, family_name } = payload;

  if (!sub || !email || !email_verified) {
    const error = new Error("Invalid Google account");
    error.status = 401;
    throw error;
  }

  // Existing Google account
  const existingGoogleUser = await User.findOne({
    "google.sub": sub,
  }).exec();

  if (existingGoogleUser) {
    return existingGoogleUser;
  }

  // Existing UniMember account using email/password
  const existingEmailUser = await User.findOne({
    email: email.toLowerCase(),
  }).exec();

  if (existingEmailUser) {
    const error = new Error(
      "An account with this email already exists. Sign in with your existing method before linking Google.",
    );

    error.status = 409;
    throw error;
  }

  const displayName =
    [given_name, family_name].filter(Boolean).join("") || email.split("@")[0];

  const username = await generateUniqueUsername(displayName);

  const user = await User.create({
    username,
    email: email.toLowerCase(),
    google: {
      sub,
    },
  });

  return user;
};

module.exports = {
  authenticateWithGoogle,
};
