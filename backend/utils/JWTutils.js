import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    return jwt.sign({ id: user.id, userName: user.userName, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

export const decodeToken = (token) => {
    return jwt.decode(token);
};

export const getTokenFromHeaders = (req) => {
    const token = req.headers.authorization.split(" ")[1];
    return token;
};