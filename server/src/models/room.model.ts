import { Schema, model, Document } from 'mongoose';

export interface IQuestion {
    title: string;
    answerType: 'choices' | 'writing';
    choices: string[];
    answer: string;
    score: number;
    manualGrading: boolean;
}

export interface IRoom extends Document {
    roomId: string;
    name: string;
    description: string;
    ownerId: string;
    members: string[];
    createdAt: Date;
    question: IQuestion[];
}

const QuestionSchema = new Schema<IQuestion>({
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
        default: function (this: IQuestion) {
            return this.answerType === 'writing';
        }
    }
});

QuestionSchema.pre('save', function(next) {
    if (this.answerType === 'writing') {
        this.manualGrading = true;
    }
    next();
});

const RoomSchema = new Schema<IRoom>({
    roomId: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    ownerId: { type: String, required: true },
    members: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    question: [QuestionSchema],
});

RoomSchema.pre('save', function(next) {
    this.question.forEach(question => {
        if (question.answerType === 'writing') {
            question.manualGrading = true;
        }
    });
    next();
});


export const Room = model<IRoom>('Room', RoomSchema);