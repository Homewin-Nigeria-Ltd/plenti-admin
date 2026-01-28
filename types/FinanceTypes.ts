export type FinanceState = {
  // STATES
  finance: [];
  loadingRefunds: boolean;
  refunds: [];
  refundPagination: {
    page: number;
    pageSize: number;
    totalCount: number;
  };

  //   ACTIONS
  fetchRefunds: (page: number) => Promise<boolean>;
};
