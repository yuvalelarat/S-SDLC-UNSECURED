interface PasswordComplexity {
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
  special_characters: boolean;
}

interface PasswordConfig {
  password_length: number;
  password_complexity: PasswordComplexity;
  password_history: number;
  dictionary_protection: string[];
  login_attempts: number;
}

export const passwordConfig: PasswordConfig = {
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
