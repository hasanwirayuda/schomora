import { LucideIcon } from "lucide-react";
import Card from "@/components/ui/card";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

export default function OverviewCard({ icon: Icon, label, value }: Props) {
  return (
    <Card
      padding="sm"
      className="flex flex-col gap-1"
      bgColor="bg-slate-100"
      border={false}
    >
      <div className="bg-slate-200 w-fit p-1.5 rounded-md">
        <Icon size={16} className="text-primary" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <p className="text-lg font-medium text-primary">{value}</p>
      </div>
    </Card>
  );
}
