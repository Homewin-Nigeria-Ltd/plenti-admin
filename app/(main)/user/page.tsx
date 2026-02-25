export const metadata = {
  title: "User Management",
};

import UserManagement from "@/components/user/UserManagement";
import { Suspense } from "react";

export default function UserPage() {
  return (
    <Suspense>
      <UserManagement />
    </Suspense>
  );
}
