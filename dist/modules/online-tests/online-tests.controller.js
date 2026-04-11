import { asyncHandler } from "../../utils/async-handler.js";
import { addOrUpdateQuestion, createTest, getTestDetail, listQuestionsForTest, listTestsForCandidate, listTestsForEmployer, removeQuestion, } from "./online-tests.service.js";
import { countExamQuestionsForTest, getExamQuestionMeta, getOnlineTestById, } from "./online-tests.repository.js";
export const onlineTestsController = {
    list: asyncHandler(async (req, res) => {
        const user = req.user;
        const items = user.role === "candidate"
            ? listTestsForCandidate()
            : listTestsForEmployer(user.id);
        res.set("Vary", "Authorization");
        res.json({ items });
    }),
    create: asyncHandler(async (req, res) => {
        const employerId = req.user.id;
        const created = createTest(employerId, req.body);
        res.status(201).json({ id: created.id });
    }),
    getOne: asyncHandler(async (req, res) => {
        const employerId = req.user.id;
        const detail = getTestDetail(employerId, req.params.id);
        res.json(detail);
    }),
    listQuestions: asyncHandler(async (req, res) => {
        const employerId = req.user.id;
        const result = listQuestionsForTest(employerId, req.params.id);
        res.json(result);
    }),
    saveQuestion: asyncHandler(async (req, res) => {
        const employerId = req.user.id;
        const testId = req.params.id;
        const body = req.body;
        if (!getOnlineTestById(testId)) {
            res.status(404).json({ error: "Online test not found", code: "NOT_FOUND" });
            return;
        }
        let sortOrder = body.sortOrder;
        if (sortOrder === undefined) {
            const existingQ = getExamQuestionMeta(body.id);
            if (existingQ && existingQ.online_test_id === testId) {
                sortOrder = existingQ.sort_order;
            }
            else {
                sortOrder = countExamQuestionsForTest(testId);
            }
        }
        const { sortOrder: _so, ...questionPayload } = body;
        const result = addOrUpdateQuestion(employerId, testId, questionPayload, sortOrder);
        res.status(201).json(result);
    }),
    deleteQuestion: asyncHandler(async (req, res) => {
        const employerId = req.user.id;
        removeQuestion(employerId, req.params.id, req.params.questionId);
        res.status(204).send();
    }),
};
//# sourceMappingURL=online-tests.controller.js.map