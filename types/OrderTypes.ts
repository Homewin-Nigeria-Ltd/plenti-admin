export const ADMIN_ORDER_LIFECYCLE_STATUSES = [
  // "pending",
  // "processing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type AdminOrderLifecycleStatus =
  (typeof ADMIN_ORDER_LIFECYCLE_STATUSES)[number];

export type UpdateOrderStatusPayload = {
  status: AdminOrderLifecycleStatus;
  notes?: string;
};

export type OrderStatus =
  | "pending"
  | "processing"
  | "accepted"
  | "packed"
  | "in_transit"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refund_pending"
  | "refunded"
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
  product_name?: string;
  weight?: number | string | null;
  product?: {
    id: number;
    name: string;
    image_url?: string;
    image_urls?: string[];
    description?: string;
    weight?: number | string | null;
  };
};

export type OrderUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  total_orders?: number;
  amount_spent?: number | string;
};

export type OrderShipment = {
  id: number;
  order_id?: number;
  warehouse_id?: number | null;
  delivery_fee?: number;
  delivery_type?: string | null;
  delivery_provider?: string | null;
  pickup_address?: string | null;
};

export type OrderDeliveryFulfillment = {
  has_plenti_delivery?: boolean;
  plenti_delivery_id?: number | null;
  plenti_delivery_status?: string | null;
  plenti_rider_name?: string | null;
  plenti_rider_id?: number | null;
  plenti_is_broadcast?: boolean;
};

export type RiderInfo = {
  rider_id?: number | null;
  rider_name?: string | null;
  assigned_at?: string | null;
  rider_phone?: string | null;
  vehicle_type?: string | null;
};

export type PaymentCardDetails = {
  bin?: string | null;
  last4?: string | null;
  expYear?: string | null;
  bankCode?: string | null;
  bankName?: string | null;
  cardType?: string | null;
  expMonth?: string | null;
  maskedPan?: string | null;
};

export type PaymentGatewayResponse = {
  rider_info?: RiderInfo;
  gateway?: string | null;
  provider?: string | null;
  paidOn?: string | null;
  currency?: string | null;
  amountPaid?: string | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  paymentReference?: string | null;
  cardDetails?: PaymentCardDetails | null;
  customer?: { name?: string | null; email?: string | null } | null;
};

export type KwikPickupLocation = {
  id: number;
  name: string;
  location: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  is_primary: boolean;
  has_coordinates: boolean;
  kwik_ready: boolean;
};

export type KwikPickupLocationsResponse = {
  status: string;
  code?: number;
  message?: string;
  data: KwikPickupLocation[];
  timestamp?: string;
};

export type Order = {
  id: number;
  user_id: number;
  subtotal: string;
  discount?: number | string | null;
  tax: string;
  total: number;
  total_weight?: number | string | null;
  status: OrderStatus;
  /** Customer-facing label from API; use `status` for admin lifecycle truth */
  display_status?: string | null;
  payment_status: string;
  payment_method: string | null;
  payment_reference: string | null;
  payment_session?: {
    method?: string | null;
    status?: string | null;
    reason?: string | null;
    gateway?: string | null;
  } | null;
  payment_gateway_response?: PaymentGatewayResponse | null;
  paid_at: string | null;
  payment_date?: string | null;
  payment_time?: string | null;
  payment_confirmed_at?: string | null;
  checkout_date?: string | null;
  checkout_time?: string | null;
  assigned_to?: number | null;
  assigned_at?: string | null;
  accepted_at?: string | null;
  accepted_by?: string | number | null;
  declined_at?: string | null;
  in_transit_at?: string | null;
  refund_requested_at?: string | null;
  has_plenti_delivery?: boolean;
  is_broadcast?: boolean;
  pickup_code?: string | null;
  delivery_code?: string | null;
  shipping_address: string;
  phone_number?: string | null;
  shipping_details?: string | null;
  shippingDetails?: string | null;
  shipping_fee?: number | string;
  shippingFee?: number | string;
  delivery_type?: string | null;
  delivery_provider?: string | null;
  delivery_provider_label?: string | null;
  delivery_type_label?: string | null;
  plenti_delivery_id?: number | null;
  delivery_id?: number | null;
  order_assignment_id?: number | null;
  rider_id?: number | null;
  rider?: { id?: number; name?: string | null } | null;
  plenti_delivery?: {
    id?: number;
    rider_id?: number | null;
    rider_name?: string | null;
  } | null;
  can_broadcast_to_riders?: boolean;
  can_assign_rider?: boolean;
  order_assignment?: {
    id?: number;
    delivery_id?: number | null;
    rider_id?: number | null;
  } | null;
  assigned_rider_id?: number | null;
  delivery_selection?: {
    provider?: string;
    provider_stored?: string | null;
    provider_label?: string;
    type?: string;
    type_label?: string;
    is_kwik?: boolean;
    is_plenti?: boolean;
    is_plenti_intent?: boolean;
  } | null;
  delivery_fulfillment?: OrderDeliveryFulfillment | null;
  shipments?: OrderShipment[];
  delivery_economics?: {
    delivery_provider?: string;
    customer_delivery_charge?: number | null;
    delivery_margin?: number | null;
    provider_delivery_cost?: number | null;
    is_cost_known?: boolean;
    labels?: {
      customer_delivery_charge?: string;
      provider_delivery_cost?: string;
      delivery_margin?: string;
    };
  } | null;
  delivery_pricing_snapshot?: {
    kwik_provider_cost?: number;
    kwik_customer_fees?: {
      normal?: { margin?: number };
      express?: { margin?: number };
    };
  } | null;
  provider_delivery_cost_quote?: number | null;
  kwik_pickup_warehouse_id?: number | null;
  pickup_warehouse_id?: number | null;
  kwik_pickup_warehouse?: { id?: number; name?: string } | null;
  order_number: string;
  order_date?: string | null;
  order_time?: string | null;
  date_placed?: string | null;
  time_placed?: string | null;
  created_at: string;
  updated_at: string;
  user?: OrderUser;
  items?: OrderItem[];
  delivery_tracking?: string | null;
};

export type OrderStatusCounts = {
  all?: number;
  pending?: number;
  processing?: number;
  accepted?: number;
  packed?: number;
  in_transit?: number;
  delivered?: number;
  cancelled?: number;
  canceled?: number;
  refund_pending?: number;
  refunded?: number;
};

export type OrdersListResponse = {
  status: string;
  data: {
    current_page: number;
    data: Order[];
    last_page: number;
    per_page: number;
    total: number;
    status_counts?: OrderStatusCounts;
  };
};

export type OrderState = {
  orders: Order[];
  incomingOrders: Order[];
  singleOrder: Order | null;
  orderStats: OrderStatistics | null;
  statusCounts: OrderStatusCounts | null;
  loading: boolean;
  loadingIncoming: boolean;
  loadingSingle: boolean;
  loadingStats: boolean;
  exporting: boolean;
  error: string | null;
  incomingError: string | null;
  statsError: string | null;
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalItems: number;
  incomingPage: number;
  incomingLastPage: number;
  incomingPerPage: number;
  incomingTotal: number;
  lastQuery: {
    page: number;
    search: string;
    delivery_provider: string;
    status?: string;
    warehouse_id?: string;
    payment_method?: string;
    start_date?: string;
    end_date?: string;
  };
  lastIncomingQuery: { page: number; search: string; per_page: number };

  fetchOrders: (params?: {
    page?: number;
    search?: string;
    delivery_provider?: string;
    status?: string;
    warehouse_id?: string;
    payment_method?: string;
    start_date?: string;
    end_date?: string;
  }) => Promise<boolean>;
  fetchIncomingOrders: (params?: {
    page?: number;
    search?: string;
    per_page?: number;
  }) => Promise<boolean>;
  fetchSingleOrders: (
    id: number,
    options?: { silent?: boolean },
  ) => Promise<boolean>;
  fetchOrderStats: (params?: {
    start_date?: string;
    end_date?: string;
  }) => Promise<boolean>;
  exportOrders: (params?: {
    search?: string;
    delivery_provider?: string;
    status?: string;
    warehouse_id?: string;
    payment_method?: string;
    start_date?: string;
    end_date?: string;
  }) => Promise<boolean>;
  setSingleOrder: () => void;
};

export type OrderStatistics = {
  total_orders?: number;
  pending_orders: number;
  processing_orders: number;
  accepted_orders?: number;
  packed_orders?: number;
  in_transit_orders?: number;
  shipped_orders: number;
  delivered_orders: number;
  cancelled_orders: number;
  refund_pending_orders?: number;
  refunded_orders?: number;
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

export type { AdminRider as Rider } from "@/types/RiderTypes";

export type RidersResponse = {
  status: string;
  code: number;
  message: string;
  data: import("@/types/RiderTypes").AdminRider[];
  timestamp: string;
};
