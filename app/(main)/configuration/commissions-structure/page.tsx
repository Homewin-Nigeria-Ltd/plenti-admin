import CommissionsStructure from "@/components/config/CommissionsStructure";

export const metadata = {
  title: "Commission Structure | System Configuration",
};

export default function CommissionsStructurePage() {
  return (
    <div className="space-y-6">
      <CommissionsStructure />
    </div>
  );
}
