import { create } from "zustand";
import api from "@/lib/api";

export interface WithdrawalUser {
  id: number;
  name: string;
  email?: string;
}

export interface CommissionStat {
  amount: number;
  change_percent: number;
}

export interface CommissionStats {
  status: string;
  message: string;
  data: {
    user: WithdrawalUser;
    period: {
      current_month_start: string;
      current_month_end: string;
      previous_month_start: string;
      previous_month_end: string;
    };
    stats: {
      total_earned: CommissionStat;
      available_balance: CommissionStat;
      paid_out: CommissionStat;
    };
  };
}

export interface Withdrawal {
  id: number;
  user: WithdrawalUser;
  team: any;
  amount: string;
  description: string;
  status: string;
  approved_by: WithdrawalUser | null;
  rejected_by: WithdrawalUser | null;
  rejection_reason: string | null;
  approved_at: string | null;
  rejected_at: string | null;
}

export interface WithdrawalsResponse {
  status: string;
  code: number;
  message: string;
  data: {
    current_page: number;
    data: Withdrawal[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  timestamp: string;
}

interface WithdrawalsStore {
  withdrawals: Withdrawal[];
  loading: boolean;
  error: string | null;
  pagination: WithdrawalsResponse["data"] | null;
  withdrawalsRequestKey: string | null;
  commissionStats: CommissionStats["data"] | null;
  commissionStatsRequestKey: string | null;
  statsLoading: boolean;
  fetchWithdrawals: (
    page?: number,
    perPage?: number,
    userId?: number,
  ) => Promise<void>;
  fetchCommissionStats: (userId: number) => Promise<void>;
}

export const useWithdrawalsStore = create<WithdrawalsStore>((set) => ({
  withdrawals: [],
  loading: false,
  error: null,
  pagination: null,
  withdrawalsRequestKey: null,
  commissionStats: null,
  commissionStatsRequestKey: null,
  statsLoading: false,
  fetchWithdrawals: async (page = 1, perPage = 10, userId) => {
    const requestKey = `${typeof userId === "number" ? userId : "all"}|${page}|${perPage}`;
    let shouldSkip = false;
    set((state) => {
      if (
        state.withdrawalsRequestKey === requestKey &&
        (state.withdrawals.length > 0 || Boolean(state.pagination))
      ) {
        shouldSkip = true;
        return state;
      }
      return { loading: true, error: null };
    });
    if (shouldSkip) {
      return;
    }
    try {
      const query = new URLSearchParams({
        per_page: String(perPage),
        page: String(page),
      });
      if (typeof userId === "number") {
        query.set("user_id", String(userId));
      }
      const res = await api.get<WithdrawalsResponse>(
        `/api/admin/sales/withdrawals?${query.toString()}`,
      );
      set({
        withdrawals: res.data.data.data,
        pagination: res.data.data,
        withdrawalsRequestKey: requestKey,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch withdrawals",
        loading: false,
      });
    }
  },
  fetchCommissionStats: async (userId: number) => {
    const requestKey = String(userId);
    let shouldSkip = false;
    set((state) => {
      if (
        state.commissionStatsRequestKey === requestKey &&
        Boolean(state.commissionStats)
      ) {
        shouldSkip = true;
        return state;
      }
      return { statsLoading: true, error: null };
    });
    if (shouldSkip) {
      return;
    }
    try {
      const res = await api.get<CommissionStats>(
        `/api/admin/sales/member-detail/${userId}/commission-stats`,
      );
      set({
        commissionStats: res.data.data,
        commissionStatsRequestKey: requestKey,
        statsLoading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch commission stats",
        statsLoading: false,
      });
    }
  },
}));
