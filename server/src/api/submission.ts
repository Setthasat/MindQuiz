import { Submission } from "../models/submission.model";
import { BaseResponse } from "../utils/baseresponse.utils";
import { isValidString } from "../utils/auth.utils";
import { Request, Response } from "express";
import { Room } from "../models/room.model";
import { v4 as uuidv4 } from "uuid";

export class SubmissionAPI {
    submitQuiz = async (req: Request, res: Response) => {
        const baseResponseInst = new BaseResponse();
        const { roomId, userId, answers } = req.body;

        if (!isValidString(roomId, 1, 50) || !isValidString(userId, 1, 50) || !Array.isArray(answers)) {
            baseResponseInst.setValue(400, "Invalid submission data", null);
            return res.status(400).json(baseResponseInst.buildResponse());
        }

        try {
            const room = await Room.findOne({ roomId });
            if (!room) {
                baseResponseInst.setValue(404, "Room not found", null);
                return res.status(404).json(baseResponseInst.buildResponse());
            }

            if (room.question.length !== answers.length) {
                baseResponseInst.setValue(400, "Answer count does not match question count", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }

            for (let i = 0; i < answers.length; i++) {
                const question = room.question[i];
                const answer = answers[i];

                if (question.answerType === 'choices' && !question.choices.includes(answer)) {
                    baseResponseInst.setValue(400, `Invalid answer for question ${i + 1}`, null);
                    return res.status(400).json(baseResponseInst.buildResponse());
                }

                if (question.answerType === 'writing' && typeof answer !== 'string') {
                    baseResponseInst.setValue(400, `Invalid answer type for writing question ${i + 1}`, null);
                    return res.status(400).json(baseResponseInst.buildResponse());
                }
            }

            const existingSubmission = await Submission.findOne({ roomId, userId });
            if (existingSubmission) {
                baseResponseInst.setValue(400, "User has already submitted this quiz", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }

            const processedAnswers = answers.map((userAnswer: string, index: number) => {
                const question = room.question[index];
                const answer: any = {
                    questionIndex: index,
                    userAnswer,
                    score: 0
                };

                if (question.answerType === 'choices') {
                    answer.isCorrect = userAnswer === question.answer;
                    answer.score = answer.isCorrect ? question.score : 0;
                    answer.gradedAt = new Date();
                }

                return answer;
            });

            const autoGradedScore = processedAnswers
                .filter(a => a.isCorrect !== undefined)
                .reduce((sum, a) => sum + a.score, 0);

            const maxScore = room.question.reduce((sum, q) => sum + q.score, 0);
            const hasWritingQuestions = room.question.some(q => q.answerType === 'writing');

            const submission = new Submission({
                submissionId: uuidv4(),
                roomId,
                userId,
                answers: processedAnswers,
                totalScore: autoGradedScore,
                maxScore,
                gradingStatus: hasWritingQuestions ? 'partial' : 'completed',
                autoGradedAt: new Date(),
                manualGradingCompleted: !hasWritingQuestions
            });

            await submission.save();

            baseResponseInst.setValue(201, "Quiz submitted successfully", {
                submissionId: submission.submissionId,
                roomId,
                userId,
                totalScore: autoGradedScore,
                maxScore,
                gradingStatus: submission.gradingStatus,
                submittedAt: submission.submittedAt
            });
            return res.status(201).json(baseResponseInst.buildResponse());

        } catch (error) {
            console.error("Submit quiz error:", error);
            baseResponseInst.setValue(500, "Internal Server Error", null);
            return res.status(500).json(baseResponseInst.buildResponse());
        }
    };

    gradeWritingQuestion = async (req: Request, res: Response) => {
        const baseResponseInst = new BaseResponse();
        const { submissionId, questionIndex, score, feedback, ownerId } = req.body;

        if (!isValidString(submissionId, 1, 50) || typeof questionIndex !== 'number' || typeof score !== 'number' || score < 0) {
            baseResponseInst.setValue(400, "Invalid grading data", null);
            return res.status(400).json(baseResponseInst.buildResponse());
        }

        try {
            const submission = await Submission.findOne({ submissionId });
            if (!submission) {
                baseResponseInst.setValue(404, "Submission not found", null);
                return res.status(404).json(baseResponseInst.buildResponse());
            }

            const room = await Room.findOne({ roomId: submission.roomId });
            if (!room) {
                baseResponseInst.setValue(404, "Room not found", null);
                return res.status(404).json(baseResponseInst.buildResponse());
            }

            if (room.ownerId !== ownerId) {
                baseResponseInst.setValue(403, "Only room owner can grade questions", null);
                return res.status(403).json(baseResponseInst.buildResponse());
            }

            if (questionIndex >= room.question.length || questionIndex < 0) {
                baseResponseInst.setValue(400, "Invalid question index", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }

            const question = room.question[questionIndex];
            if (question.answerType !== 'writing') {
                baseResponseInst.setValue(400, "Question is not a writing question", null);
                return res.status(400).json(baseResponseInst.buildResponse());
            }

            const answerIndex = submission.answers.findIndex(a => a.questionIndex === questionIndex);
            if (answerIndex === -1) {
                baseResponseInst.setValue(404, "Answer not found", null);
                return res.status(404).json(baseResponseInst.buildResponse());
            }

            submission.answers[answerIndex].score = Math.min(score, question.score);
            submission.answers[answerIndex].feedback = feedback || "";
            submission.answers[answerIndex].gradedAt = new Date();
            submission.answers[answerIndex].gradedBy = ownerId;

            submission.totalScore = submission.answers.reduce((sum, a) => sum + a.score, 0);

            const writingQuestionIndices = room.question.map((q, i) => ({ q, i })).filter(({ q }) => q.answerType === 'writing').map(({ i }) => i);

            const allWritingQuestionsGraded = writingQuestionIndices.every(
                index => submission.answers.find(a => a.questionIndex === index)?.gradedAt
            );

            if (allWritingQuestionsGraded) {
                submission.gradingStatus = 'completed';
                submission.manualGradingCompleted = true;
            } else {
                submission.gradingStatus = 'partial';
            }

            await submission.save();

            baseResponseInst.setValue(200, "Writing question graded successfully", {
                submissionId,
                questionIndex,
                score: submission.answers[answerIndex].score,
                feedback: submission.answers[answerIndex].feedback,
                totalScore: submission.totalScore,
                gradingStatus: submission.gradingStatus,
                gradedAt: submission.answers[answerIndex].gradedAt
            });
            return res.status(200).json(baseResponseInst.buildResponse());

        } catch (error) {
            console.error("Grade writing question error:", error);
            baseResponseInst.setValue(500, "Internal Server Error", null);
            return res.status(500).json(baseResponseInst.buildResponse());
        }
    };

    getSubmissions = async (req: Request, res: Response) => {
        const baseResponseInst = new BaseResponse();
        const { roomId, ownerId } = req.body;

        if (!isValidString(roomId, 1, 50) || !isValidString(ownerId as string, 1, 50)) {
            baseResponseInst.setValue(400, "Invalid parameters", null);
            return res.status(400).json(baseResponseInst.buildResponse());
        }

        try {
            const room = await Room.findOne({ roomId });
            if (!room) {
                baseResponseInst.setValue(404, "Room not found", null);
                return res.status(404).json(baseResponseInst.buildResponse());
            }

            if (room.ownerId !== ownerId) {
                baseResponseInst.setValue(403, "Only room owner can view submissions", null);
                return res.status(403).json(baseResponseInst.buildResponse());
            }

            const submissions = await Submission.find({ roomId }).sort({ submittedAt: -1 });

            const submissionData = submissions.map(sub => ({
                submissionId: sub.submissionId,
                userId: sub.userId,
                totalScore: sub.totalScore,
                maxScore: sub.maxScore,
                percentage: Math.round((sub.totalScore / sub.maxScore) * 100),
                gradingStatus: sub.gradingStatus,
                submittedAt: sub.submittedAt,
                needsGrading: sub.answers.filter(a =>
                    room.question[a.questionIndex].answerType === 'writing' && !a.gradedAt
                ).length
            }));

            baseResponseInst.setValue(200, "Submissions retrieved successfully", {
                roomId,
                totalSubmissions: submissions.length,
                submissions: submissionData
            });
            return res.status(200).json(baseResponseInst.buildResponse());

        } catch (error) {
            console.error("Get submissions error:", error);
            baseResponseInst.setValue(500, "Internal Server Error", null);
            return res.status(500).json(baseResponseInst.buildResponse());
        }
    };

    getSubmissionDetail = async (req: Request, res: Response) => {
        const baseResponseInst = new BaseResponse();
        const { submissionId, ownerId } = req.body;

        if (!isValidString(submissionId, 1, 50) || !isValidString(ownerId as string, 1, 50)) {
            baseResponseInst.setValue(400, "Invalid parameters", null);
            return res.status(400).json(baseResponseInst.buildResponse());
        }

        try {
            const submission = await Submission.findOne({ submissionId });
            if (!submission) {
                baseResponseInst.setValue(404, "Submission not found", null);
                return res.status(404).json(baseResponseInst.buildResponse());
            }

            const room = await Room.findOne({ roomId: submission.roomId });
            if (!room) {
                baseResponseInst.setValue(404, "Room not found", null);
                return res.status(404).json(baseResponseInst.buildResponse());
            }

            if (room.ownerId !== ownerId) {
                baseResponseInst.setValue(403, "Only room owner can view submission details", null);
                return res.status(403).json(baseResponseInst.buildResponse());
            }

            const detailedAnswers = submission.answers.map((answer, index) => {
                const question = room.question[answer.questionIndex];
                return {
                    questionIndex: answer.questionIndex,
                    questionTitle: question.title,
                    questionType: question.answerType,
                    correctAnswer: question.answer,
                    userAnswer: answer.userAnswer,
                    isCorrect: answer.isCorrect,
                    score: answer.score,
                    maxScore: question.score,
                    feedback: answer.feedback,
                    gradedAt: answer.gradedAt,
                    needsGrading: question.answerType === 'writing' && !answer.gradedAt,
                    choices: question.choices
                };
            });

            baseResponseInst.setValue(200, "Submission details retrieved successfully", {
                submissionId,
                userId: submission.userId,
                roomId: submission.roomId,
                quizName: room.name,
                totalScore: submission.totalScore,
                maxScore: submission.maxScore,
                gradingStatus: submission.gradingStatus,
                submittedAt: submission.submittedAt,
                answers: detailedAnswers
            });
            return res.status(200).json(baseResponseInst.buildResponse());

        } catch (error) {
            console.error("Get submission detail error:", error);
            baseResponseInst.setValue(500, "Internal Server Error", null);
            return res.status(500).json(baseResponseInst.buildResponse());
        }
    };

    getUserSubmission = async (req: Request, res: Response) => {
        const baseResponseInst = new BaseResponse();
        const { roomId, userId } = req.body;

        if (!isValidString(roomId, 1, 50) || !isValidString(userId, 1, 50)) {
            baseResponseInst.setValue(400, "Invalid parameters", null);
            return res.status(400).json(baseResponseInst.buildResponse());
        }

        try {
            const submission = await Submission.findOne({ roomId, userId });
            if (!submission) {
                baseResponseInst.setValue(404, "Submission not found", null);
                return res.status(404).json(baseResponseInst.buildResponse());
            }

            const room = await Room.findOne({ roomId });
            if (!room) {
                baseResponseInst.setValue(404, "Room not found", null);
                return res.status(404).json(baseResponseInst.buildResponse());
            }

            const showResults = submission.gradingStatus === 'completed' || submission.gradingStatus === 'partial';

            const responseData = {
                submissionId: submission.submissionId,
                roomId: submission.roomId,
                quizName: room.name,
                totalScore: showResults ? submission.totalScore : null,
                maxScore: submission.maxScore,
                percentage: showResults ? Math.round((submission.totalScore / submission.maxScore) * 100) : null,
                gradingStatus: submission.gradingStatus,
                submittedAt: submission.submittedAt,
                results: showResults ? submission.answers.map(answer => {
                    const question = room.question[answer.questionIndex];
                    return {
                        questionTitle: question.title,
                        userAnswer: answer.userAnswer,
                        correctAnswer: question.answerType === 'choices' ? question.answer : null,
                        isCorrect: answer.isCorrect,
                        score: answer.score,
                        maxScore: question.score,
                        feedback: answer.feedback
                    };
                }) : null
            };

            baseResponseInst.setValue(200, "User submission retrieved successfully", responseData);
            return res.status(200).json(baseResponseInst.buildResponse());

        } catch (error) {
            console.error("Get user submission error:", error);
            baseResponseInst.setValue(500, "Internal Server Error", null);
            return res.status(500).json(baseResponseInst.buildResponse());
        }
    };
}