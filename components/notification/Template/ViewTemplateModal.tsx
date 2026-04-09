import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NotificationTemplate } from "@/types/NotificationTypes";
import { Eye, X } from "lucide-react";
import { TAG_COLORS } from "./NotificationTemplates";
import { DialogTitle } from "@radix-ui/react-dialog";

interface Props {
  template: NotificationTemplate | null;
  onClose: () => void;
}

export const ViewTemplateModal = ({ template, onClose }: Props) => {
  if (!template) return null;

  return (
    <Dialog open={!!template} onOpenChange={onClose}>
      <DialogTitle className="sr-only">
        Template Details: {template.name}
      </DialogTitle>
      <DialogContent
        className="max-w-2xl p-8 rounded-[12px] border-none shadow-2xl"
        showCloseButton={false}
      >
        <button
          className="absolute top-7 right-5 bg-[#E8EEFF] rounded-full p-2"
          onClick={() => onClose()}
        >
          <X color="#0B1E66" strokeWidth={2} />
        </button>
        {/* Title */}
        <h2 className="text-3xl font-bold text-[#001533] mb-2">
          {template.name}
        </h2>

        {/* Tags */}
        <div className="flex gap-2 mb-2">
          <span
            className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${TAG_COLORS[template.type]}`}
          >
            {template.type}
          </span>
          <span
            className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${TAG_COLORS[template.channel]}`}
          >
            {template.channel}
          </span>
        </div>

        {/* Subject */}
        <div className="">
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block mb-2">
            Subject
          </span>
          <p className="text-lg font-semibold text-[#001533]">
            {template.title}
          </p>
        </div>

        {/* Body Container */}
        <div className="bg-[#F8FAFC] rounded-2xl p-6 mb-6 border border-gray-100">
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block mb-4">
            Body
          </span>
          <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {template.message}
          </div>
        </div>

        {/* Variables */}
        <div className="mb-8">
          <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest block mb-3">
            Variables ({template.variables.length})
          </span>
          <div className="flex flex-wrap gap-2">
            {template.variables.map((v) => (
              <span
                key={v}
                className="px-3 py-1.5 bg-[#FEFEEB] text-[#ADA605] text-xs rounded-lg font-mono"
              >
                {`{{${v}}}`}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Stats */}
        <div className="flex items-center gap-6 text-gray-400 text-xs font-medium pt-4">
          <div className="flex items-center gap-1.5">
            <Eye size={16} />
            {template.usage_count.toLocaleString()} uses
          </div>
          <div>Last: {template.last_used_at || "Never"}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
