import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../axios";
import type { Evaluation } from "../types";
import { APIRoutes } from "../routes";

export const useEvaluations = () => {
  return useQuery<Evaluation[]>({
    queryKey: ["evaluations"],
    queryFn: async () => (await api.get("/evaluations")).data,
  });
};

export const useEvaluation = (id: string) => {
  return useQuery<Evaluation>({
    queryKey: ["evaluations", id],
    queryFn: async () => (await api.get(`${APIRoutes.Evaluations}${id}`)).data,
    enabled: !id || id != "new",
  });
};

export const useCreateEvaluation = () => {
  return useMutation({
    mutationFn: async (data: Partial<Evaluation>) =>
      (await api.post("/evaluations", data)).data,
  });
};
