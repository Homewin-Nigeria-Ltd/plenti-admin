"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import TeamMemberDetailsView from "@/components/sales/TeamMemberDetailsView";
import { useTeamMembersStore } from "@/store/useTeamMembersStore";

type TeamMemberDetailsPageProps = {
  params: Promise<{ memberIndex: string }>;
};

export default function TeamMemberDetailsPage({
  params,
}: TeamMemberDetailsPageProps) {
  const [memberIdParam, setMemberIdParam] = useState<string>("");
  const { memberDetail, detailLoading, detailError, fetchMemberDetail } =
    useTeamMembersStore();

  useEffect(() => {
    params.then(({ memberIndex }) => {
      setMemberIdParam(memberIndex);
    });
  }, [params]);

  useEffect(() => {
    if (memberIdParam) {
      const parsedId = Number.parseInt(memberIdParam, 10);
      if (!Number.isInteger(parsedId) || parsedId < 0) {
        notFound();
      }
      fetchMemberDetail(parsedId);
    }
  }, [memberIdParam, fetchMemberDetail]);

  if (detailLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-gray-500">Loading member details...</p>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-sm text-red-500">Error: {detailError}</p>
      </div>
    );
  }

  if (!memberDetail) {
    return null;
  }

  console.log("Fetched member detail:", memberDetail);

  // Transform API data to match current component expectations
  const transformedMember = {
    dateCreated: memberDetail.user.created_at,
    name: memberDetail.user.name,
    email: memberDetail.user.email,
    initial: memberDetail.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
    role: memberDetail.user.position,
    createdBy: memberDetail.user.creator?.name ?? "N/A",
    createdByInitial: memberDetail.user.creator?.name
      ? memberDetail.user.creator.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "NA",
    status: memberDetail.user.status as any,
    location: undefined,
    dateJoined: memberDetail.user.created_at,
    lastActive: undefined,
  };

  return (
    <TeamMemberDetailsView
      member={transformedMember}
      memberDetail={memberDetail}
    />
  );
}
