import { Schema, model, Document } from 'mongoose';

export interface IAnswer {
    questionIndex: number;
    userAnswer: string;
    isCorrect?: boolean;
    score: number;
    feedback?: string;
    gradedAt?: Date;
    gradedBy?: string;
}

export interface ISubmission extends Document {
    submissionId: string;
    roomId: string;
    userId: string;
    answers: IAnswer[];
    totalScore: number;
    maxScore: number;
    submittedAt: Date;
    gradingStatus: 'pending' | 'partial' | 'completed';
    autoGradedAt?: Date;
    manualGradingCompleted?: boolean;
}

const AnswerSchema = new Schema<IAnswer>({
    questionIndex: { type: Number, required: true },
    userAnswer: { type: String, required: true },
    isCorrect: { type: Boolean },
    score: { type: Number, required: true, default: 0 },
    feedback: { type: String },
    gradedAt: { type: Date },
    gradedBy: { type: String }
});

const SubmissionSchema = new Schema<ISubmission>({
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

export const Submission = model<ISubmission>('Submission', SubmissionSchema);