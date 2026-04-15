import api from "@/lib/axios";
import { Quiz, QuizAttempt } from "@/lib/types";

export interface SubmitAnswerInput {
  question_id: string;
  answer: string;
  time_spent_ms: number;
}

export const quizApi = {
  getByModule: async (moduleID: string): Promise<Quiz> => {
    const res = await api.get(`/modules/${moduleID}/quiz`);
    return res.data;
  },

  start: async (
    quizID: string,
  ): Promise<{ attempt: QuizAttempt; questions: any[] }> => {
    const res = await api.post(`/quizzes/${quizID}/start`);
    return res.data;
  },

  submit: async (
    attemptID: string,
    answers: SubmitAnswerInput[],
  ): Promise<QuizAttempt> => {
    const res = await api.post(`/attempts/${attemptID}/submit`, { answers });
    return res.data;
  },

  getAttemptResult: async (attemptID: string): Promise<QuizAttempt> => {
    const res = await api.get(`/attempts/${attemptID}`);
    return res.data;
  },

  getMyAttempts: async (quizID: string): Promise<QuizAttempt[]> => {
    const res = await api.get(`/quizzes/${quizID}/attempts`);
    return res.data;
  },
};
