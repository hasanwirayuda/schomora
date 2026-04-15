import api from "@/lib/axios";
import { Certificate } from "@/lib/types";

export const certificateApi = {
  generate: async (courseID: string): Promise<Blob> => {
    const res = await api.post(`/courses/${courseID}/certificate`, null, {
      responseType: "blob",
    });
    return res.data;
  },

  getMyCertificates: async (): Promise<Certificate[]> => {
    const res = await api.get("/me/certificates");
    return res.data;
  },

  download: async (certID: string): Promise<Blob> => {
    const res = await api.get(`/certificates/${certID}/download`, {
      responseType: "blob",
    });
    return res.data;
  },

  verify: async (
    certID: string,
  ): Promise<{ valid: boolean; certificate: Certificate }> => {
    const res = await api.get(`/verify/${certID}`);
    return res.data;
  },
};
