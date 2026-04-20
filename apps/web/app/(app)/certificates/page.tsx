"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { certificateApi } from "@/lib/api/certificate";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Award, Download, ExternalLink, Calendar } from "lucide-react";

export default function CertificatesPage() {
  const { data: certificates, isLoading } = useQuery({
    queryKey: ["my-certificates"],
    queryFn: certificateApi.getMyCertificates,
  });

  const { mutate: download, isPending } = useMutation({
    mutationFn: certificateApi.download,
    onSuccess: (blob, certID) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `schomora-certificate-${certID}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium text-gray-900">My Certificates</h1>
        <p className="text-gray-500 mt-1">
          A collection of certificates you have earned
        </p>
      </div>

      {!certificates || certificates.length === 0 ? (
        <Card className="text-center py-16">
          <Award size={40} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">No certificates yet</p>
          <p className="text-sm text-gray-400">
            Complete courses to earn certificates
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <Card key={cert.id} padding="md" className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Award size={24} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm leading-tight">
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

              {/* Date */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Calendar size={12} />
                Issued on{" "}
                {new Date(cert.issued_at).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>

              {/* Cert ID */}
              <p className="text-xs text-gray-400 font-mono truncate">
                ID: {cert.id}
              </p>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <Button
                  size="sm"
                  className="flex-1"
                  isLoading={isPending}
                  onClick={() => download(cert.id)}
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
          ))}
        </div>
      )}
    </div>
  );
}
