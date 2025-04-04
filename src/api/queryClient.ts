import { QueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      onError: (error) =>
        isAxiosError(error)
          ? console.table(error.response?.data.message)
          : console.error(error.message),
    },
  },
});

export default queryClient;
