"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { certificateApi } from "@/lib/api/certificate";
import Card from "@/components/ui/card";
import { Award } from "lucide-react";
import CertificateCard from "@/components/certificates/CertificateCard";

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
            <CertificateCard
              key={cert.id}
              certificate={cert}
              isDownloading={isPending}
              onDownload={download}
            />
          ))}
        </div>
      )}
    </div>
  );
}
