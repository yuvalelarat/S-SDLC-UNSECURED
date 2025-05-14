import crypto from 'crypto';
import { AppDataSource } from "../config/data-source.js";
import User from "../models/userModel.js";
import { generateToken } from "../utils/JWTutils.js";
import { validatePassword } from "../utils/validatePassword.js";
import { passwordConfig } from '../utils/passwordConfig.js';

export async function loginService(userName, password) {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const userWithoutPassCheck = await userRepository.findOne({ where: { userName } });
        const rawQuery = `SELECT * FROM public.users
                WHERE "userName" = '${userName}' AND "password" = '${password}'
                `;

        const userFromRawQuery = await userRepository.query(rawQuery);

        let user = userFromRawQuery.length === 0 ? userWithoutPassCheck : userFromRawQuery[0];

                console.log(userFromRawQuery);
                console.log(userWithoutPassCheck);
                console.log(user);

        const salt = userWithoutPassCheck.salt;
        const hmac = crypto.createHmac('sha256', salt);
        hmac.update(password);
        const hashedPassword = hmac.digest('hex');

        if (!user) {
            return { status: 404, message: "Invalid username or password" };
        }

        if (user.loginTimeOut <= new Date(Date.now() - 15 * 60 * 1000) && (user.loginAttempts >= passwordConfig.login_attempts)) {
            user.loginAttempts = 0;
            user.loginTimeOut = null;
            await userRepository.save(user);
        }

        if (user.loginAttempts >= passwordConfig.login_attempts) {
            return { status: 403, message: "you are blocked from login, you can try again later." }
        }


        if (hashedPassword !== user.password) {
            user.loginAttempts += 1;
            await userRepository.save(user);
            if (user.loginAttempts >= passwordConfig.login_attempts) {
                user.loginTimeOut = new Date();
                await userRepository.save(user);
                return { status: 403, message: "you are blocked from login, you can try again later." }
            }
            return { status: 400, message: "Invalid username or passwordd" };
        }

        const token = generateToken(user);

        user.loginAttempts = 0;
        user.loginTimeOut = null;
        await userRepository.save(user);
        return { status: 200, message: "Login successful" };

    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}

export async function registerService(userName, email, password) {
    try {
        const userRepository = AppDataSource.getRepository(User);

        const nonUniqueEmail = await userRepository.findOne({ where: { email } });

        if (nonUniqueEmail) {
            return { status: 400, message: "Email already exists" };
        }

        const nonUniqueUserName = await userRepository.findOne({ where: { userName } });

        if (nonUniqueUserName) {
            return { status: 400, message: "Username already exists" };
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hmac = crypto.createHmac('sha256', salt);
        hmac.update(password);
        const hashedPassword = hmac.digest('hex');

        const newUser = userRepository.create({
            userName,
            email,
            password: hashedPassword,
            salt,
        });

        await userRepository.save(newUser);

        return { status: 201, message: "User registered successfully" };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}

export async function resetPasswordService(userName, currentPassword, newPassword) {
    if (currentPassword === newPassword) {
        return { status: 400, message: "New password cannot be the same as the current password" };
    }

    const validationResult = validatePassword(newPassword);
    if (validationResult !== null) {
        return { status: 400, message: validationResult };
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { userName } });

        if (!user) {
            return { status: 404, message: "User not found" };
        }

        const passwordList = user.passwordList;

        const salt = crypto.randomBytes(16).toString('hex');
        const hmac = crypto.createHmac('sha256', salt);
        hmac.update(password);
        const hashedPassword = hmac.digest('hex');

        if (passwordList) {
            for (let i = 0; i < passwordConfig.password_history; i++) {
                if (passwordList[i]) {
                    const matchedPasswords = hashedPassword === passwordList[i].oldPass;
                    if (matchedPasswords) return { status: 400, message: "New password cannot be the same as old passwords" };
                }
            }
        }

        const movePassword = user.password

        if (passwordList) {
            passwordList.unshift({ oldPass: movePassword })
        } else {
            user.passwordList = [{ oldPass: movePassword }]
        }

        user.password = hashedPassword;
        user.salt = salt;
        user.tempPass = null;

        await userRepository.save(user);

        return { status: 200, message: "Password changed successfully" };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}

export async function resetPasswordNoTokenService(email, newPassword) {
    const validationResult = validatePassword(newPassword);
    if (validationResult !== null) {
        return { status: 400, message: validationResult };
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            return { status: 404, message: "User not found" };
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hmac = crypto.createHmac('sha256', salt);
        hmac.update(password);
        const hashedPassword = hmac.digest('hex');

        const isSamePassword = hashedPassword == user.password;

        if (isSamePassword) {
            return { status: 400, message: "New password cannot be the same as the current password" };
        }

        user.password = hashedPassword;
        user.salt = salt;
        user.tempPass = null;

        await userRepository.save(user);

        return { status: 200, message: "Password changed successfully" };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}

export async function saveTempPasswordService(tempPass, email) {
    if (tempPass === null || email === undefined) {
        return { status: 400, message: "fields cannot be null" };
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            return { status: 404, message: "User not found" };
        }

        user.tempPass = tempPass;

        await userRepository.save(user);

        return { status: 200, message: "Temp password saved successfully" };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}

export async function checkTempPasswordService(tempPass, email) {
    if (tempPass === null || email === null) {
        return { status: 400, message: "fields cannot be null" };
    }

    try {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { email } });

        if (!user) {
            return { status: 404, message: "User not found" };
        }

        if (user.tempPass !== tempPass) {
            return { status: 400, message: "Invalid temporary password" };
        }

        return { status: 200, message: "Temporary password is valid" };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error", error: error.message };
    }
}