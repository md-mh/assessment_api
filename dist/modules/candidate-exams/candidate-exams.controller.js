import { asyncHandler } from "../../utils/async-handler.js";
import { completeExam, getAttemptSummary, getQuestionAtIndex, markTimedOut, saveAnswer, startExamForCandidate, } from "./candidate-exams.service.js";
export const candidateExamsController = {
    start: asyncHandler(async (req, res) => {
        const candidateId = req.user.id;
        const result = startExamForCandidate(candidateId, req.params.testId);
        res.status(result.resumed ? 200 : 201).json(result);
    }),
    getAttempt: asyncHandler(async (req, res) => {
        const candidateId = req.user.id;
        const summary = getAttemptSummary(candidateId, req.params.attemptId);
        res.json(summary);
    }),
    getQuestion: asyncHandler(async (req, res) => {
        const candidateId = req.user.id;
        const idx = parseInt(req.params.questionIndex, 10);
        if (Number.isNaN(idx) || idx < 0) {
            res.status(400).json({ error: "Invalid index", code: "BAD_REQUEST" });
            return;
        }
        const data = getQuestionAtIndex(candidateId, req.params.attemptId, idx);
        res.json(data);
    }),
    postAnswer: asyncHandler(async (req, res) => {
        const candidateId = req.user.id;
        const result = saveAnswer(candidateId, req.params.attemptId, req.body);
        res.json(result);
    }),
    complete: asyncHandler(async (req, res) => {
        const candidateId = req.user.id;
        const result = completeExam(candidateId, req.params.attemptId);
        res.json(result);
    }),
    timeout: asyncHandler(async (req, res) => {
        const candidateId = req.user.id;
        markTimedOut(candidateId, req.params.attemptId);
        res.status(204).send();
    }),
};
//# sourceMappingURL=candidate-exams.controller.js.map