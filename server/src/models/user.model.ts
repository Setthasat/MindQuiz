import { Schema, model } from 'mongoose';

interface IUser {
    userId: string;
    username: string;
    email: string;
    password: string;
    verified: boolean;
    verificationToken: string | null;
}

const userSchema = new Schema<IUser>({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String, default: '' }
}, {
    timestamps: true
});

const User = model<IUser>('User', userSchema);

export default User;