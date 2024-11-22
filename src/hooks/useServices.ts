import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "../services";

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => fetchServices(),
  });
};
