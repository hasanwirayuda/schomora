import { Award, Download, ExternalLink, Calendar } from "lucide-react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";

interface Certificate {
  id: string;
  average_score: number;
  issued_at: string;
  course?: { title: string };
}

interface Props {
  certificate: Certificate;
  isDownloading: boolean;
  onDownload: (id: string) => void;
}

export default function CertificateCard({
  certificate: cert,
  isDownloading,
  onDownload,
}: Props) {
  const issuedAt = new Date(cert.issued_at).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card padding="md" className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
          <Award size={24} className="text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm leading-tight">
            {cert.course?.title || "Course"}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Average score:{" "}
            <span className="font-medium text-primary">
              {cert.average_score}%
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Calendar size={12} />
        Issued on {issuedAt}
      </div>

      <p className="text-xs text-gray-400 font-mono truncate">ID: {cert.id}</p>

      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <Button
          size="sm"
          className="flex-1"
          isLoading={isDownloading}
          onClick={() => onDownload(cert.id)}
        >
          <Download size={14} /> Download
        </Button>
        <a
          href={`/verify/${cert.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Button variant="secondary" size="sm" className="w-full">
            <ExternalLink size={14} /> Verify
          </Button>
        </a>
      </div>
    </Card>
  );
}
