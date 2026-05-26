import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Dispute {
  id: number;
  booking_id: number;
  property_id: number;
  reason: string;
  status: string;
  created_at: string;
  verdict?: string;
}

export function useDisputes() {
  return useQuery<Dispute[]>({
    queryKey: ["disputes"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/disputes");
      return res.data;
    },
  });
}
