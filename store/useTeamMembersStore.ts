import { create } from "zustand";
import api from "@/lib/api";
import type {
  TeamMember,
  TeamMembersResponse,
  TeamMemberDetailResponse,
} from "@/types/sales";
import { PAGE_SIZE } from "@/lib/constant";

interface TeamMembersStore {
  teamMembers: TeamMember[];
  loading: boolean;
  error: string | null;
  pagination: TeamMembersResponse["data"] | null;
  memberDetail: TeamMemberDetailResponse["data"] | null;
  detailLoading: boolean;
  detailError: string | null;
  fetchTeamMembers: (
    page?: number,
    perPage?: number,
    search?: string,
  ) => Promise<void>;
  fetchMemberDetail: (userId: number) => Promise<void>;
  clearMemberDetail: () => void;
}

export const useTeamMembersStore = create<TeamMembersStore>((set) => ({
  teamMembers: [],
  loading: false,
  error: null,
  pagination: null,
  memberDetail: null,
  detailLoading: false,
  detailError: null,
  fetchTeamMembers: async (page = 1, perPage = PAGE_SIZE, search = "") => {
    set({ loading: true, error: null });
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
      const res = await api.get<TeamMembersResponse>(
        `/api/admin/sales/team-members?per_page=${perPage}&page=${page}${searchParam}`,
      );
      set({
        teamMembers: res.data.data.data,
        pagination: res.data.data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch team members",
        loading: false,
      });
    }
  },
  fetchMemberDetail: async (userId: number) => {
    set({ detailLoading: true, detailError: null });
    try {
      const res = await api.get<TeamMemberDetailResponse>(
        `/api/admin/sales/member-detail/${userId}`,
      );
      set({
        memberDetail: res.data.data,
        detailLoading: false,
      });
    } catch (error: any) {
      set({
        detailError: error?.message || "Failed to fetch member details",
        detailLoading: false,
      });
    }
  },
  clearMemberDetail: () => {
    set({
      memberDetail: null,
      detailLoading: false,
      detailError: null,
    });
  },
}));
