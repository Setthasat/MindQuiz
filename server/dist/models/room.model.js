"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const mongoose_1 = require("mongoose");
const QuestionSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    answerType: {
        type: String,
        enum: ['choices', 'writing'],
        required: true
    },
    choices: [{ type: String }],
    answer: { type: String },
    score: { type: Number, default: 0 },
    manualGrading: {
        type: Boolean,
        default: function () {
            return this.answerType === 'writing';
        }
    }
});
QuestionSchema.pre('save', function (next) {
    if (this.answerType === 'writing') {
        this.manualGrading = true;
    }
    next();
});
const RoomSchema = new mongoose_1.Schema({
    roomId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    ownerId: { type: String, required: true },
    members: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    question: [QuestionSchema],
});
RoomSchema.pre('save', function (next) {
    this.question.forEach(question => {
        if (question.answerType === 'writing') {
            question.manualGrading = true;
        }
    });
    next();
});
exports.Room = (0, mongoose_1.model)('Room', RoomSchema);
