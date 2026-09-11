import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

export default function GoogleSignInButton({
  onSuccess,
  onError,
  disabled = false,
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (disabled) {
      return;
    }

    if (!window.google || !buttonRef.current) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

      callback: onSuccess,

      auto_select: false,
    });

    buttonRef.current.innerHTML = "";

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 360,
      text: "continue_with",
    });
  }, [onSuccess, disabled]);

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div
      ref={buttonRef}
      className={disabled ? "pointer-events-none opacity-50" : ""}
      aria-label="Continue with Google"
    />
  );
}

GoogleSignInButton.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func,
  disabled: PropTypes.bool,
};
