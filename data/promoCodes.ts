export type PromoCodeType = "Percentage" | "Fixed Amount";
export type PromoCodeStatus = "Approved" | "On Hold" | "Expired";

export type PromoCode = {
  id: string;
  createdDate: string;
  code: string;
  type: PromoCodeType;
  value: number; // Percentage or fixed amount
  minOrder: number | null; // null means no minimum order
  expiry: string;
  status: PromoCodeStatus;
};

export const mockPromoCodes: PromoCode[] = [
  {
    id: "1",
    createdDate: "Apr 12, 2023 | 09:32AM",
    code: "WELCOME10",
    type: "Percentage",
    value: 10,
    minOrder: null,
    expiry: "2025-12-31",
    status: "Approved",
  },
  {
    id: "2",
    createdDate: "Apr 12, 2023 | 09:32AM",
    code: "BULK20",
    type: "Percentage",
    value: 25,
    minOrder: 20000,
    expiry: "2025-12-31",
    status: "On Hold",
  },
  {
    id: "3",
    createdDate: "Apr 12, 2023 | 09:32AM",
    code: "FLASH5000",
    type: "Fixed Amount",
    value: 3000,
    minOrder: 25000,
    expiry: "2025-12-31",
    status: "Expired",
  },
  {
    id: "4",
    createdDate: "Apr 12, 2023 | 09:32AM",
    code: "SUMMER15",
    type: "Fixed Amount",
    value: 500,
    minOrder: null,
    expiry: "2025-12-31",
    status: "Approved",
  },
  {
    id: "5",
    createdDate: "Apr 12, 2023 | 09:32AM",
    code: "NEWUSER50",
    type: "Percentage",
    value: 50,
    minOrder: 5000,
    expiry: "2025-12-31",
    status: "Approved",
  },
  {
    id: "6",
    createdDate: "Apr 12, 2023 | 09:32AM",
    code: "FREESHIP",
    type: "Fixed Amount",
    value: 0,
    minOrder: 10000,
    expiry: "2025-12-31",
    status: "On Hold",
  },
  {
    id: "7",
    createdDate: "Apr 12, 2023 | 09:32AM",
    code: "WEEKEND20",
    type: "Percentage",
    value: 20,
    minOrder: null,
    expiry: "2025-12-31",
    status: "Expired",
  },
  {
    id: "8",
    createdDate: "Apr 12, 2023 | 09:32AM",
    code: "VIP1000",
    type: "Fixed Amount",
    value: 1000,
    minOrder: 15000,
    expiry: "2025-12-31",
    status: "Approved",
  },
];

