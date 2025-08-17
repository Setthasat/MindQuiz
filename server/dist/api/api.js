"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
const auth_utils_1 = require("../utils/auth.utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const user_model_1 = __importDefault(require("../models/user.model"));
class API {
    constructor() {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new BaseResponse();
            const { username, email, password } = req.body;
            if (!(0, auth_utils_1.isValidEmail)(email, 1, 100) || !(0, auth_utils_1.isValidString)(username, 1, 100) || !(0, auth_utils_1.isValidString)(password, 1, 100)) {
                baseResponseInst.setValue(400, "Invalid input", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            const isExistingEmail = yield user_model_1.default.findOne({ email });
            if (isExistingEmail) {
                baseResponseInst.setValue(400, "User already exists", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            try {
                const salt = yield bcryptjs_1.default.genSalt(10);
                const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
                const user = yield user_model_1.default.create({
                    userId: (0, uuid_1.v4)(),
                    username,
                    email,
                    password: hashedPassword,
                    verified: false,
                    verificationToken: (0, uuid_1.v4)()
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
            }
            catch (error) {
                console.error("User creation error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new BaseResponse();
            const { email, password } = req.body;
            if (!(0, auth_utils_1.isValidEmail)(email, 1, 100) || !(0, auth_utils_1.isValidString)(password, 1, 100)) {
                baseResponseInst.setValue(400, "Invalid input", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            try {
                const user = yield user_model_1.default.findOne({ email });
                if (!user) {
                    baseResponseInst.setValue(404, "User not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
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
            }
            catch (error) {
                console.error("Login error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
        this.verifyEmail = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new BaseResponse();
            const { token } = req.params;
            try {
                const user = yield user_model_1.default.findOne({ verificationToken: token });
                if (!user) {
                    baseResponseInst.setValue(400, "Invalid or expired token", null);
                    return res.status(400).json(baseResponseInst.buildResponse());
                }
                user.verified = true;
                user.verificationToken = null;
                yield user.save();
                baseResponseInst.setValue(200, "Email verified successfully", null);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Verify error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
    }
}
exports.API = API;
class BaseResponse {
    constructor(code = 200, description = "", data = null) {
        this.code = code;
        this.description = description;
        this.data = data;
    }
    buildResponse() {
        return {
            status: { code: this.code, description: this.description },
            data: this.data,
        };
    }
    setValue(code, description, data) {
        this.code = code;
        this.description = description;
        this.data = data;
    }
}
