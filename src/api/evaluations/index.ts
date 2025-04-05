import { useMutation, useQuery } from "@tanstack/react-query";

import { APIRoutes } from "../routes";
import type { Evaluation } from "../types";
import api from "../axios";
import {
  DirectorEvaluationValues,
  HREvaluationValues,
  SelfEvaluationValues,
  TeamLeadEvaluationValues,
} from "../../types/evaluation";

export const useEvaluations = () => {
  return useQuery<Evaluation[]>({
    queryKey: ["evaluations"],
    queryFn: async () => (await api.get("/evaluations/my-evaluations")).data,
  });
};

export const useEvaluation = (id: string) => {
  return useQuery<Evaluation>({
    queryKey: ["evaluations", id],
    queryFn: async () => (await api.get(`${APIRoutes.Evaluations}/${id}`)).data,
    enabled: id != "new",
  });
};

export const useCreateEvaluation = () => {
  return useMutation({
    mutationFn: async (data: Partial<Evaluation>) =>
      (await api.post("/evaluations/", data)).data,
  });
};

export const useSelfEvaluation = () => {
  return useMutation({
    mutationFn: async (data: SelfEvaluationValues) =>
      (await api.post("/evaluations/self/", data)).data,
  });
};

export const useLeadEvaluation = () => {
  return useMutation({
    mutationFn: async (data: Partial<TeamLeadEvaluationValues>) =>
      (await api.post("/evaluations/lead/", data)).data,
  });
};

export const useHREvaluation = () => {
  return useMutation({
    mutationFn: async (data: Partial<HREvaluationValues>) =>
      (await api.post("/evaluations/hr/", data)).data,
  });
};

export const useDirectorEvaluation = () => {
  return useMutation({
    mutationFn: async (data: DirectorEvaluationValues) =>
      (await api.post("/evaluations/director/", data)).data,
  });
};
