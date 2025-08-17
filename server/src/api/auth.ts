import User from "../models/user.model";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { BaseResponse } from "../utils/baseresponse.utils";
import { isValidEmail, isValidString } from "../utils/auth.utils";


export class AuthAPI {
        register = async (req: Request, res: Response) => {
        const baseResponseInst = new BaseResponse();
        const { username, email, password } = req.body;

        if (!isValidEmail(email, 1, 100) || !isValidString(username, 1, 100) || !isValidString(password, 1, 100)) {
            baseResponseInst.setValue(400, "Invalid input", null);
            return res.status(400).json(baseResponseInst.buildResponse());
        }

        const isExistingEmail = await User.findOne({ email });
        if (isExistingEmail) {
            baseResponseInst.setValue(400, "User already exists", null);
            return res.status(400).json(baseResponseInst.buildResponse());
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await User.create({
                userId: uuidv4(),
                username,
                email,
                password: hashedPassword,
                verified: false,
                verificationToken: uuidv4()
            });
            const safeUser = {
                userId: user.userId,
                username: user.username,
                email: user.email,
                verified: user.verified,
                verificationToken: user.verificationToken
            };
            baseResponseInst.setValue(201, "User registered", safeUser);
            return res.status(201).json(baseResponseInst.buildResponse());

        } catch (error) {
            console.error("User creation error:", error);
            baseResponseInst.setValue(500, "Internal Server Error", null);
            return res.status(500).json(baseResponseInst.buildResponse());
        }
    };

    login = async (req: Request, res: Response) => {
        const baseResponseInst = new BaseResponse();
        const { email, password } = req.body;

        if (!isValidEmail(email, 1, 100) || !isValidString(password, 1, 100)) {
            baseResponseInst.setValue(400, "Invalid input", null);
            return res.status(400).json(baseResponseInst.buildResponse());
        }

        try {
            const user = await User.findOne({ email });
            if (!user) {
                baseResponseInst.setValue(404, "User not found", null);
                return res.status(404).json(baseResponseInst.buildResponse());
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                baseResponseInst.setValue(401, "Invalid password", null);
                return res.status(401).json(baseResponseInst.buildResponse());
            }

            const safeUser = {
                userId: user.userId,
                username: user.username,
                email: user.email,
                verified: user.verified,
                verificationToken: user.verificationToken
            };
            baseResponseInst.setValue(200, "Login successful", safeUser);
            return res.status(200).json(baseResponseInst.buildResponse());

        } catch (error) {
            console.error("Login error:", error);
            baseResponseInst.setValue(500, "Internal Server Error", null);
            return res.status(500).json(baseResponseInst.buildResponse());
        }
    };

    verifyEmail = async (req: Request, res: Response) => {
        const baseResponseInst = new BaseResponse();
        const { token } = req.params;

        try {
            const user = await User.findOne({ verificationToken: token });
            if (!user) {
                baseResponseInst.setValue(400, "Invalid or expired token", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }

            user.verified = true;
            user.verificationToken = null;
            await user.save();

            baseResponseInst.setValue(200, "Email verified successfully", null);
            return res.status(200).json(baseResponseInst.buildResponse());
        } catch (error) {
            console.error("Verify error:", error);
            baseResponseInst.setValue(500, "Internal Server Error", null);
            return res.status(500).json(baseResponseInst.buildResponse());
        }
    };
}