import { Award, User, BookOpen, Calendar, LucideIcon } from "lucide-react";

interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center shrink-0">
        <Icon size={16} className="text-primary" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

interface Certificate {
  id: string;
  issued_at: string;
  user?: { name: string };
  course?: { title: string };
}

interface Props {
  certificate: Certificate;
}

export default function CertificateDetail({ certificate: cert }: Props) {
  const issuedAt = new Date(cert.issued_at).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-3 bg-gray-50 rounded-lg p-4">
      <DetailRow
        icon={Award}
        label="Certificate"
        value="Certificate of Completion"
      />
      <DetailRow
        icon={User}
        label="Awarded to"
        value={cert.user?.name ?? "-"}
      />
      <DetailRow
        icon={BookOpen}
        label="Course"
        value={cert.course?.title ?? "-"}
      />
      <DetailRow icon={Calendar} label="Issued on" value={issuedAt} />
      <div className="pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-400">Certificate ID</p>
        <p className="text-xs font-mono text-gray-600 break-all">{cert.id}</p>
      </div>
    </div>
  );
}
