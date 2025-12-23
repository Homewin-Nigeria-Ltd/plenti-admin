export type UserStatus = "Active" | "Inactive" | "Suspended";

export type User = {
  id: string;
  dateCreated: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  orders: number;
  amountSpent: number;
  status: UserStatus;
  avatar?: string;
  department?: string;
  role?: string;
  position?: string;
  createdBy?: string;
  createdDate?: string;
};

export const mockCustomers: User[] = [
  {
    id: "1",
    dateCreated: "Apr 12, 2023 | 09:32AM",
    firstName: "Uzoma",
    lastName: "Agu",
    email: "uzoma.agu@email.com",
    phoneNumber: "0802345678910",
    orders: 20,
    amountSpent: 200000,
    status: "Active",
  },
  {
    id: "2",
    dateCreated: "Apr 12, 2023 | 09:32AM",
    firstName: "Adebayo",
    lastName: "Olabode",
    email: "adebayo.olabode@email.com",
    phoneNumber: "0802345678910",
    orders: 21,
    amountSpent: 800000,
    status: "Active",
  },
  {
    id: "3",
    dateCreated: "Apr 12, 2023 | 09:32AM",
    firstName: "Rasheed",
    lastName: "Adebayo",
    email: "rasheed.adebayo@email.com",
    phoneNumber: "0802345678910",
    orders: 3,
    amountSpent: 150000,
    status: "Active",
  },
  {
    id: "4",
    dateCreated: "Apr 12, 2023 | 09:32AM",
    firstName: "Priscilla",
    lastName: "Adebayo",
    email: "priscilla.adebayo@email.com",
    phoneNumber: "0802345678910",
    orders: 12,
    amountSpent: 450000,
    status: "Active",
  },
  {
    id: "5",
    dateCreated: "Apr 12, 2023 | 09:32AM",
    firstName: "Simisola",
    lastName: "Kolapo",
    email: "simisola.kolapo@email.com",
    phoneNumber: "0802345678910",
    orders: 5,
    amountSpent: 120000,
    status: "Inactive",
  },
  {
    id: "6",
    dateCreated: "Apr 12, 2023 | 09:32AM",
    firstName: "Simisola",
    lastName: "Ojo",
    email: "simisola.ojo@email.com",
    phoneNumber: "0802345678910",
    orders: 8,
    amountSpent: 300000,
    status: "Active",
  },
  {
    id: "7",
    dateCreated: "Apr 12, 2023 | 09:32AM",
    firstName: "Tubo",
    lastName: "Tuma",
    email: "tubo.tuma@email.com",
    phoneNumber: "0802345678910",
    orders: 15,
    amountSpent: 600000,
    status: "Suspended",
  },
  {
    id: "8",
    dateCreated: "Apr 12, 2023 | 09:32AM",
    firstName: "Sade",
    lastName: "Adebayo",
    email: "sade.adebayo@email.com",
    phoneNumber: "0802345678910",
    orders: 7,
    amountSpent: 250000,
    status: "Suspended",
  },
  {
    id: "9",
    dateCreated: "Apr 12, 2023 | 09:32AM",
    firstName: "Aliyu",
    lastName: "Usman",
    email: "aliyu.usman@email.com",
    phoneNumber: "0802345678910",
    orders: 10,
    amountSpent: 400000,
    status: "Inactive",
  },
];

export const mockAdminUsers: User[] = [
  {
    id: "admin-1",
    dateCreated: "Apr 12, 2023 | 09:32AM",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    phoneNumber: "0802345678910",
    orders: 0,
    amountSpent: 0,
    status: "Active",
  },
];
