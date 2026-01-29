export const ORDERS_API = {
  getOrders: "/api/admin/orders",
  getOrder: "/api/admin/orders",
  deleteOrder: "/api/admin/orders",
  getStatistics: "/api/admin/orders/statistics",
} as const;

/*
export const mockOrders = [
  {
    date: "Apr 12, 2023 | 09:32AM",
    id: 1,
    firstName: "Muhammad",
    lastName: "Lawan",
    customerEmail: "thekdfisher@email.com",
    value: 2300,
    qty: 30,
    status: "SUCCESSFUL",
  },
  {
    date: "Apr 12, 2023 | 09:32AM",
    id: "#0001",
    customerName: "Minabo Dokubo",
    customerEmail: "thekdfisher@email.com",
    value: 2300,
    qty: 1,
    status: "Processing",
  },
  {
    date: "Apr 12, 2023 | 09:32AM",
    id: "#0001",
    customerName: "Minabo Dokubo",
    customerEmail: "thekdfisher@email.com",
    value: 2300,
    qty: 2,
    status: "Cancelled",
  },
  {
    date: "Apr 12, 2023 | 09:32AM",
    id: "#0001",
    customerName: "Obinna Okafor",
    customerEmail: "thekdfisher@email.com",
    value: 2300,
    qty: 2,
    status: "Processing",
  },
  {
    date: "Apr 12, 2023 | 09:32AM",
    id: "#0001",
    customerName: "Chijioke Eze",
    customerEmail: "thekdfisher@email.com",
    value: 2300,
    qty: 1,
    status: "Successful",
  },
  {
    date: "Apr 12, 2023 | 09:32AM",
    id: "#0001",
    customerName: "Piraye Idamiebi",
    customerEmail: "thekdfisher@email.com",
    value: 2300,
    qty: 2,
    status: "Pending",
  },
  {
    date: "Apr 12, 2023 | 09:32AM",
    id: "#0001",
    customerName: "Perebuowei Ziworitin",
    customerEmail: "thekdfisher@email.com",
    value: 2300,
    qty: 4,
    status: "Successful",
  },
  {
    date: "Apr 12, 2023 | 09:32AM",
    id: "#0001",
    customerName: "Ummi Zubairu",
    customerEmail: "thekdfisher@email.com",
    value: 2300,
    qty: 2,
    status: "Pending",
  },
  {
    date: "Apr 12, 2023 | 09:32AM",
    id: "#0001",
    customerName: "Tobiloba Olanrewaju",
    customerEmail: "thekdfisher@email.com",
    value: 2300,
    qty: 4,
    status: "Successful",
  },
  {
    date: "Apr 12, 2023 | 09:32AM",
    id: "#0001",
    customerName: "Timothy Zubairu",
    customerEmail: "thekdfisher@email.com",
    value: 2300,
    qty: 2,
    status: "Pending",
  },
];
*/

import type { OrderStat } from "@/types/OrderTypes";

export const orderStats: OrderStat[] = [
  { title: "Pending Orders", value: 45823, changePercent: 10, increased: true },
  {
    title: "Processing Orders",
    value: 45823,
    changePercent: 10,
    increased: true,
  },
  {
    title: "In Transit Orders",
    value: 45823,
    changePercent: 10,
    increased: true,
  },
  {
    title: "Delivered Orders",
    value: 45823,
    changePercent: 10,
    increased: true,
  },
  {
    title: "Canceled Orders",
    value: 45823,
    changePercent: 10,
    increased: false,
  },
];
