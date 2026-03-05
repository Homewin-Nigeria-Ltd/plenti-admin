import { create } from "zustand";
import api from "@/lib/api";

export interface LeaderboardMember {
  rank: number;
  id: number;
  name: string;
  email: string;
  avatar_url: string;
  position: string;
  total_achieved: number;
  target_amount: number;
  current_month_achieved: number;
  change_percent_vs_prev_month: number;
  target_status: "Completed" | "In Progress" | "Surpassed" | "Under Performing";
}

export interface LeaderboardResponse {
  status: string;
  message: string;
  data: {
    data: LeaderboardMember[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

interface LeaderboardStore {
  members: LeaderboardMember[];
  loading: boolean;
  error: string | null;
  pagination: LeaderboardResponse["data"] | null;
  fetchLeaderboard: (
    page?: number,
    perPage?: number,
    search?: string,
    statusFilter?: string,
  ) => Promise<void>;
}

export const useLeaderboardStore = create<LeaderboardStore>((set) => ({
  members: [],
  loading: false,
  error: null,
  pagination: null,
  fetchLeaderboard: async (page = 1, perPage = 15, search, statusFilter) => {
    set({ loading: true, error: null });
    try {
      const query = new URLSearchParams({
        per_page: String(perPage),
        page: String(page),
      });
      if (search && search.trim()) {
        query.set("search", search.trim());
      }
      if (statusFilter && statusFilter.trim()) {
        query.set("status_filter", statusFilter.trim());
      }
      const res = await api.get<LeaderboardResponse>(
        `/api/admin/sales/leaderboard?${query.toString()}`,
      );
      set({
        members: res.data.data.data,
        pagination: res.data.data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch leaderboard",
        loading: false,
      });
    }
  },
}));
