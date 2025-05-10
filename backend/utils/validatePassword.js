import { passwordConfig } from "./passwordConfig.js";

export const validatePassword = (password) => {
  const { password_length, password_complexity, dictionary_protection } =
    passwordConfig;

  if (password.length < password_length) {
    return `Password must be at least ${password_length} characters long.`;
  }

  if (
    dictionary_protection.some((word) => password.toLowerCase().includes(word))
  ) {
    return "Password is too common.";
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password_complexity.uppercase && !hasUppercase)
    return "Password must include an uppercase letter.";
  if (password_complexity.lowercase && !hasLowercase)
    return "Password must include a lowercase letter.";
  if (password_complexity.digits && !hasDigit)
    return "Password must include a number.";
  if (password_complexity.special_characters && !hasSpecial)
    return "Password must include a special character.";

  return null;
};
