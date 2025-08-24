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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizAPI = void 0;
const room_model_1 = require("../models/room.model");
const baseresponse_utils_1 = require("../utils/baseresponse.utils");
const auth_utils_1 = require("../utils/auth.utils");
class QuizAPI {
    constructor() {
        this.createQuiz = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new baseresponse_utils_1.BaseResponse();
            const { roomId, quizName, questions } = req.body;
            if (!(0, auth_utils_1.isValidString)(quizName, 1, 100) || !Array.isArray(questions) || questions.length === 0) {
                baseResponseInst.setValue(400, "Invalid quiz data. Quiz name must be 1-100 characters and questions array cannot be empty.", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            if (!(0, auth_utils_1.isValidString)(roomId, 1, 50)) {
                baseResponseInst.setValue(400, "Invalid room ID", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            for (let i = 0; i < questions.length; i++) {
                if (!this.validateQuestion(questions[i])) {
                    baseResponseInst.setValue(400, `Invalid question data at index ${i}. Please check question format.`, null);
                    return res.status(400).json(baseResponseInst.buildResponse());
                }
            }
            try {
                const room = yield room_model_1.Room.findOne({ roomId });
                if (!room) {
                    baseResponseInst.setValue(404, "Room not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                const processedQuestions = questions.map((q) => ({
                    title: q.title.trim(),
                    answerType: (q.answerType === 'choicesQuestion' ? 'choices' : 'writing'),
                    choices: q.answerType === 'choicesQuestion' ? (q.choices || []) : [],
                    answer: q.answer || '',
                    score: q.score || 0,
                    // Force manual grading for writing questions
                    manualGrading: q.answerType === 'writingQuestion' ? true : (q.manualGrading || false)
                }));
                room.question = processedQuestions;
                room.name = quizName;
                // Save the updated room
                const savedRoom = yield room.save();
                // Prepare response data
                const responseData = {
                    roomId: savedRoom.roomId,
                    quizName: savedRoom.name,
                    questionCount: savedRoom.question.length,
                    questions: savedRoom.question.map(q => ({
                        title: q.title,
                        answerType: q.answerType,
                        choiceCount: q.choices.length,
                        score: q.score,
                        manualGrading: q.manualGrading
                    })),
                    createdAt: savedRoom.createdAt
                };
                baseResponseInst.setValue(201, "Quiz created successfully", responseData);
                return res.status(201).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Create quiz error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
        this.getQuiz = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new baseresponse_utils_1.BaseResponse();
            const { roomId } = req.body;
            if (!(0, auth_utils_1.isValidString)(roomId, 1, 50)) {
                baseResponseInst.setValue(400, "Invalid room ID", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            try {
                const room = yield room_model_1.Room.findOne({ roomId }).select('roomId name question createdAt');
                if (!room) {
                    baseResponseInst.setValue(404, "Quiz not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                const quizData = {
                    roomId: room.roomId,
                    quizName: room.name,
                    questions: room.question,
                    createdAt: room.createdAt
                };
                baseResponseInst.setValue(200, "Quiz retrieved successfully", quizData);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Get quiz error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
        this.updateQuiz = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new baseresponse_utils_1.BaseResponse();
            const { roomId, quizName, questions } = req.body;
            if (!(0, auth_utils_1.isValidString)(quizName, 1, 100) || !Array.isArray(questions) || questions.length === 0) {
                baseResponseInst.setValue(400, "Invalid quiz data", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            if (!(0, auth_utils_1.isValidString)(roomId, 1, 50)) {
                baseResponseInst.setValue(400, "Invalid room ID", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            for (let i = 0; i < questions.length; i++) {
                if (!this.validateQuestion(questions[i])) {
                    baseResponseInst.setValue(400, `Invalid question data at index ${i}`, null);
                    return res.status(400).json(baseResponseInst.buildResponse());
                }
            }
            try {
                const room = yield room_model_1.Room.findOne({ roomId });
                if (!room) {
                    baseResponseInst.setValue(404, "Room not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                // Process questions to match schema format
                const processedQuestions = questions.map((q) => ({
                    title: q.title.trim(),
                    answerType: q.answerType === 'choicesQuestion' ? 'choices' : 'writing',
                    choices: q.answerType === 'choicesQuestion' ? q.choices || [] : [],
                    answer: q.answer || '',
                    score: q.score || 0,
                    // Force manual grading for writing questions
                    manualGrading: q.answerType === 'writingQuestion' ? true : (q.manualGrading || false)
                }));
                //@ts-ignore
                room.question = processedQuestions;
                room.name = quizName;
                const savedRoom = yield room.save();
                baseResponseInst.setValue(200, "Quiz updated successfully", {
                    roomId: savedRoom.roomId,
                    quizName: savedRoom.name,
                    questionCount: savedRoom.question.length
                });
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Update quiz error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
        this.deleteQuiz = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const baseResponseInst = new baseresponse_utils_1.BaseResponse();
            const { roomId } = req.body;
            if (!(0, auth_utils_1.isValidString)(roomId, 1, 50)) {
                baseResponseInst.setValue(400, "Invalid room ID", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }
            try {
                const room = yield room_model_1.Room.findOne({ roomId });
                if (!room) {
                    baseResponseInst.setValue(404, "Room not found", null);
                    return res.status(404).json(baseResponseInst.buildResponse());
                }
                room.question = [];
                yield room.save();
                baseResponseInst.setValue(200, "Quiz deleted successfully", null);
                return res.status(200).json(baseResponseInst.buildResponse());
            }
            catch (error) {
                console.error("Delete quiz error:", error);
                baseResponseInst.setValue(500, "Internal Server Error", null);
                return res.status(500).json(baseResponseInst.buildResponse());
            }
        });
    }
    validateQuestion(question) {
        if (!question || typeof question !== 'object') {
            return false;
        }
        const validTypes = ['choicesQuestion', 'writingQuestion'];
        if (!validTypes.includes(question.answerType)) {
            return false;
        }
        const hasScore = question.score !== undefined;
        if (hasScore) {
            const isValidScore = typeof question.score === 'number' && question.score >= 0;
            if (!isValidScore) {
                return false;
            }
        }
        const isChoiceQuestion = question.answerType === 'choicesQuestion';
        if (isChoiceQuestion) {
            if (question.choices === undefined || question.choices === null) {
                return false;
            }
            if (typeof question.choices !== 'object') {
                return false;
            }
            if (!Array.isArray(question.choices) || question.choices.length < 2) {
                return false;
            }
            for (let i = 0; i < question.choices.length; i++) {
                if (typeof question.choices[i] !== 'string') {
                    return false;
                }
                if (question.choices[i].trim().length === 0) {
                    return false;
                }
            }
            const hasAnswer = question.answer;
            if (hasAnswer) {
                const answerInChoices = question.choices.includes(question.answer);
                if (!answerInChoices) {
                    return false;
                }
            }
        }
        return true;
    }
}
exports.QuizAPI = QuizAPI;
