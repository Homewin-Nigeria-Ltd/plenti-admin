import { notFound } from "next/navigation";
import TeamMemberDetailsView from "@/components/sales/TeamMemberDetailsView";
import { teamMembersData } from "@/data/sales";

type TeamMemberDetailsPageProps = {
  params: Promise<{ memberIndex: string }>;
};

export default async function TeamMemberDetailsPage({
  params,
}: TeamMemberDetailsPageProps) {
  const { memberIndex } = await params;
  const parsedIndex = Number.parseInt(memberIndex, 10);

  if (!Number.isInteger(parsedIndex) || parsedIndex < 0) {
    notFound();
  }

  const member = teamMembersData[parsedIndex];
  if (!member) {
    notFound();
  }

  return <TeamMemberDetailsView member={member} />;
}
