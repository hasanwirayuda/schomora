import api from "@/lib/axios";
import { Course, Module, Enrollment, ModuleProgress } from "@/lib/types";

export const courseApi = {
  getAll: async (): Promise<Course[]> => {
    const res = await api.get("/courses");
    return res.data;
  },

  getByID: async (id: string): Promise<Course> => {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  },

  getModules: async (courseID: string): Promise<Module[]> => {
    const res = await api.get(`/courses/${courseID}/modules`);
    return res.data;
  },

  enroll: async (courseID: string): Promise<Enrollment> => {
    const res = await api.post(`/courses/${courseID}/enroll`);
    return res.data;
  },

  getMyEnrollments: async (): Promise<Enrollment[]> => {
    const res = await api.get("/enrollments");
    return res.data;
  },

  getProgress: async (courseID: string): Promise<any> => {
    const res = await api.get(`/courses/${courseID}/progress`);
    return res.data;
  },

  getSkillMap: async (courseID: string): Promise<any[]> => {
    const res = await api.get(`/courses/${courseID}/skillmap`);
    return res.data;
  },

  markModuleComplete: async (moduleID: string): Promise<ModuleProgress> => {
    const res = await api.post(`/modules/${moduleID}/complete`);
    return res.data;
  },
};
