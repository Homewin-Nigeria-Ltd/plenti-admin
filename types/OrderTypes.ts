export type OrderStatus = "SUCCESSFUL" | "PENDING" | "PROCESSING" | "CANCELLED";

export type Order = {
  id: number;
  orderNumber: string;
  customerId: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: string;
  deliveryStatus: string;
  deliveryAddress: string;
  riderId: null;
  createdAt: null;
  updatedAt: null;
  items: [];
};
export type OrderState = {
  orders: Order[];
  singleOrder: Order | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;

  //   STATES
  fetchOrders: () => Promise<boolean>;
  fetchSingleOrders: (id: number) => Promise<boolean>;
  setSingleOrder: () => void;
};
