import UserDetailsContainer from "@/components/user/UserDetailsContainer";

export const metadata = {
  title: "View User",
};

export default async function ViewUserPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  return <UserDetailsContainer userId={resolvedParams.id} />;
}
