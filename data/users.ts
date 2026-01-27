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
