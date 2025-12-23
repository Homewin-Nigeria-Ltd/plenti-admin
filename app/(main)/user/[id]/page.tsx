import ViewUser from "@/components/user/ViewUser";

export const metadata = {
  title: "View User",
};

export default function ViewUserPage() {
  const dummyUser = {
    id: "1",
    dateCreated: "Apr 12, 2023 | 09:32AM",
    firstName: "Oluwanifemi",
    lastName: "Osunsanya",
    email: "oluwanifemi.motopay@gmail.com",
    phoneNumber: "0802345678910",
    orders: 20,
    amountSpent: 200000,
    status: "Active" as const,
    department: "Enjoyment",
    role: "Chairman",
    position: "Execuetive",
    createdBy: "Feyi Damilola",
    createdDate: "May 27th 1992",
  };

  return <ViewUser user={dummyUser} />;
}
