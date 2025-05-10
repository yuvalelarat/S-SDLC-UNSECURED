export const passwordConfig = {
  password_length: 10,
  password_complexity: {
    uppercase: true,
    lowercase: true,
    digits: true,
    special_characters: true,
  },
  password_history: 3,
  dictionary_protection: ["password", "123456", "qwerty"],
  login_attempts: 3,
};
