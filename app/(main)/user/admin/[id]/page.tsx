export const metadata = {
  title: "Admin Details",
};

import AdminDetailsPageClient from "@/components/user/AdminDetailsPageClient";

export default async function AdminDetailsPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  return <AdminDetailsPageClient adminId={resolvedParams.id} />;
}
