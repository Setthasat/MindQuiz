"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submission = void 0;
const mongoose_1 = require("mongoose");
const AnswerSchema = new mongoose_1.Schema({
    questionIndex: { type: Number, required: true },
    userAnswer: { type: String, required: true },
    isCorrect: { type: Boolean },
    score: { type: Number, required: true, default: 0 },
    feedback: { type: String },
    gradedAt: { type: Date },
    gradedBy: { type: String }
});
const SubmissionSchema = new mongoose_1.Schema({
    submissionId: { type: String, required: true, unique: true },
    roomId: { type: String, required: true },
    userId: { type: String, required: true },
    answers: [AnswerSchema],
    totalScore: { type: Number, default: 0 },
    maxScore: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
    gradingStatus: {
        type: String,
        enum: ['pending', 'partial', 'completed'],
        default: 'pending'
    },
    autoGradedAt: { type: Date },
    manualGradingCompleted: { type: Boolean, default: false }
});
SubmissionSchema.index({ roomId: 1, userId: 1 });
SubmissionSchema.index({ roomId: 1, gradingStatus: 1 });
exports.Submission = (0, mongoose_1.model)('Submission', SubmissionSchema);
