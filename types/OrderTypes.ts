export type OrderStatus =
  | "pending"
  | "processing"
  | "SUCCESSFUL"
  | "PENDING"
  | "PROCESSING"
  | "CANCELLED"
  | (string & {});

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: string;
  product_name: string;
  product?: { id: number; name: string; image_url?: string; description?: string };
};

export type OrderUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
};

export type RiderInfo = {
  rider_name?: string | null;
  assigned_at?: string | null;
  rider_phone?: string | null;
  vehicle_type?: string | null;
};

export type Order = {
  id: number;
  user_id: number;
  subtotal: string;
  tax: string;
  total: number;
  status: OrderStatus;
  payment_status: string;
  payment_method: string | null;
  payment_reference: string | null;
  payment_gateway_response?: { rider_info?: RiderInfo } | null;
  paid_at: string | null;
  shipping_address: string;
  phone_number: string;
  order_number: string;
  created_at: string;
  updated_at: string;
  user?: OrderUser;
  items?: OrderItem[];
  delivery_tracking?: string | null;
};

export type OrdersListResponse = {
  status: string;
  data: {
    current_page: number;
    data: Order[];
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type OrderState = {
  orders: Order[];
  singleOrder: Order | null;
  loading: boolean;
  loadingSingle: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalItems: number;
  lastQuery: { page: number; search: string };

  fetchOrders: (params?: { page?: number; search?: string }) => Promise<boolean>;
  fetchSingleOrders: (id: number) => Promise<boolean>;
  setSingleOrder: () => void;
};

export type OrderStatistics = {
  total_orders?: number;
  pending_orders: number;
  processing_orders: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  total_revenue?: number;
  average_order_value?: string;
  period?: string;
  start_date?: string;
};

export type OrderStat = {
  title: string;
  value: number;
  changePercent: number;
  increased: boolean;
};

export type OrderStatCardProps = {
  title: string;
  value: number;
  changePercent: number;
  increased?: boolean;
  changeLabel?: string;
  className?: string;
};

export type Rider = {
  id: number;
  name: string;
  phone: string;
  email: string;
  avatar_url: string | null;
  amount_spent: number;
  total_orders: number;
};

export type RidersResponse = {
  status: string;
  code: number;
  message: string;
  data: Rider[];
  timestamp: string;
};
