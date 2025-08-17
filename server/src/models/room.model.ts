import { Schema, model, Document } from 'mongoose';

interface IQuestion {
    title: string;
    answerType: 'choicesQuestion' | 'writingQuestion';
    choices: string[];
    answer: string;
    score: number;
    manualGrading: boolean;
}

interface IRoom extends Document {
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
    manualGrading: { type: Boolean, default: false }
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

export const Room = model<IRoom>('Room', RoomSchema);