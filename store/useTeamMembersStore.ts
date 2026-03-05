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
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
  } | null;
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
      const res = await api.get<any>(
        `/api/admin/sales/team-members?per_page=${perPage}&page=${page}${searchParam}`,
      );

      // Handle both nested and flat response structures
      const responseData = res.data;
      const dataArray = Array.isArray(responseData.data)
        ? responseData.data
        : Array.isArray(responseData.data?.data)
          ? responseData.data.data
          : [];

      set({
        teamMembers: dataArray,
        pagination: {
          current_page:
            responseData.current_page ||
            responseData.data?.current_page ||
            page,
          per_page:
            responseData.per_page || responseData.data?.per_page || perPage,
          total: responseData.total || responseData.data?.total || 0,
        },
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error?.message || "Failed to fetch team members",
        loading: false,
        teamMembers: [],
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
