const jwt = require("jsonwebtoken");
const { refreshCookieOptions } = require("../config/cookieOptions");
const env = require("../config/env");

const createSession = async (user, res) => {
  const roleNames = Object.entries(user.roles)
    .filter(([, value]) => value)
    .map(([role]) => role);

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: user._id,
        email: user.email,
        roles: roleNames,
        createdAt: user.createdAt,
      },
    },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    },
  );

  const refreshToken = jwt.sign(
    {
      email: user.email,
    },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    },
  );

  user.refreshToken = refreshToken;

  await user.save();

  res.cookie("jwt", refreshToken, refreshCookieOptions);

  return {
    accessToken,
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      roles: roleNames,
      createdAt: user.createdAt,
    },
  };
};

module.exports = {
  createSession,
};
