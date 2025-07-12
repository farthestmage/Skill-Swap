const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createUser, getUserByEmail } = require("../Database/users.model");

dotenv.config();

const generateAccessToken = (user) => jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
const generateRefreshToken = (user) => jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "30d" });

const userSignup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const isUser = await getUserByEmail(email);
        if (isUser.length > 0) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const id = await createUser({ name, email, password: hashedPassword });

        const accessToken = generateAccessToken({ id: id, email: email, name: name });
        const refreshToken = generateRefreshToken({ id: id, email: email, name: name, password: password });

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ accessToken });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
};

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const isUser = await getUserByEmail(email);
        if (isUser.length === 0) return res.status(401).json({ message: "Invalid email" });
        const user = isUser[0];

        const isPasswordValid = await bcrypt.compare(password, user.user_password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

        const accessToken = generateAccessToken({ id: user.user_id, email: user.user_email, name: user.user_name });
        const refreshToken = generateRefreshToken({ id: user.user_id, email: user.user_email, name: user.user_name, password: user.user_password });

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ accessToken });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token, please login again" });

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(401).json({ message: "Invalid credentials" });
            const newAccessToken = generateAccessToken({ id: user.id, email: user.email, name: user.name });
            return res.status(200).json({ accessToken: newAccessToken });
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const userLogout = async (req, res) => {
    try {
        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "Strict" });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { userSignup, userLogin, refreshToken, userLogout }