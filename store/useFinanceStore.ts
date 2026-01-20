import api from "@/lib/api";
import { FinanceState } from "@/types/FinanceTypes";
import { AxiosError } from "axios";
import { create } from "zustand";

export const useFinanceStore = create<FinanceState>((set) => ({
  finance: [],
  refunds: [],
  refundPagination: {
    page: 0,
    pageSize: 0,
    totalCount: 0,
  },
  loadingRefunds: false,

  //   ENDPOINT TO GET THE LIST OF REFUNDS
  fetchRefunds: async (page: number): Promise<boolean> => {
    set({ loadingRefunds: true });

    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("size", "10");

    try {
      const { data } = await api.get<{
        data: {
          refunds: [];
          page: number;
          pageSize: number;
          totalCount: number;
        };
      }>("/api/admin/finance/refunds?" + params.toString());
      console.log("Refunds data =>", data.data);
      set({
        // refunds: data.data.refunds,
        refundPagination: {
          page: data.data.page,
          pageSize: data.data.pageSize,
          totalCount: data.data.totalCount,
        },
      });

      return true;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Axios Error =>", error);
      }
      return false;
    } finally {
      set({ loadingRefunds: false });
    }
  },
}));
