"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { courseApi } from "@/lib/api/course";
import { certificateApi } from "@/lib/api/certificate";
import { useAuthStore } from "@/lib/store/auth";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import {
  ArrowLeft,
  Award,
  Download,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const { data: progress } = useQuery({
    queryKey: ["course-progress", id],
    queryFn: () => courseApi.getProgress(id),
  });

  const { data: course } = useQuery({
    queryKey: ["course", id],
    queryFn: () => courseApi.getByID(id),
  });

  const { data: myCerts } = useQuery({
    queryKey: ["my-certificates"],
    queryFn: certificateApi.getMyCertificates,
  });

  const existingCert = myCerts?.find((c) => c.course_id === id);

  const { mutate: generateCert, isPending: isGenerating } = useMutation({
    mutationFn: () => certificateApi.generate(id),
    onSuccess: (blob) => {
      setError(null);
      downloadBlob(blob, `schomora-certificate-${id}.pdf`);
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data instanceof Blob
          ? "Make sure all modules are completed and average score is ≥ 70%"
          : err?.response?.data?.error || "Failed to generate certificate";
      setError(msg);
    },
  });

  const { mutate: downloadCert, isPending: isDownloading } = useMutation({
    mutationFn: () => certificateApi.download(existingCert!.id),
    onSuccess: (blob) => {
      downloadBlob(blob, `schomora-certificate-${existingCert!.id}.pdf`);
    },
  });

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const isComplete = progress?.is_completed;

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm cursor-pointer text-gray-500 hover:text-gray-900 w-fit"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <Card padding="lg" className="flex flex-col gap-6">
        <div className="text-center">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              isComplete ? "bg-amber-100" : "bg-gray-100"
            }`}
          >
            <Award
              size={36}
              className={isComplete ? "text-amber-600" : "text-gray-400"}
            />
          </div>
          <h1 className="text-xl font-medium text-gray-900">
            Certificate of Completion
          </h1>
          <p className="text-sm text-gray-500 mt-1">{course?.title}</p>
        </div>

        <div className="flex flex-col gap-2 bg-gray-50 rounded-lg p-4">
          <p className="text-xs font-semibold text-gray-600 mb-1">
            Requirements to get certificate:
          </p>
          <div className="flex items-center gap-2 text-sm">
            {progress?.completed_modules === progress?.total_modules &&
            progress?.total_modules > 0 ? (
              <CheckCircle size={16} className="text-green-500 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-gray-300 shrink-0" />
            )}
            <span
              className={
                progress?.completed_modules === progress?.total_modules
                  ? "text-green-700"
                  : "text-gray-500"
              }
            >
              All modules completed ({progress?.completed_modules || 0}/
              {progress?.total_modules || 0})
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {isComplete ? (
              <CheckCircle size={16} className="text-green-500 shrink-0" />
            ) : (
              <AlertCircle size={16} className="text-gray-300 shrink-0" />
            )}
            <span className={isComplete ? "text-green-700" : "text-gray-500"}>
              Average quiz score ≥ 70%
            </span>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {existingCert && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium mb-1">
              Certificate has been issued
            </p>
            <p className="text-xs text-green-600">
              Issued on:{" "}
              {new Date(existingCert.issued_at).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-green-600">
              Average score: {existingCert.average_score}%
            </p>
            <a
              href={`/verify/${existingCert.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-700 underline flex items-center gap-1 mt-1 w-fit"
            >
              Verify certificate <ExternalLink size={10} />
            </a>
          </div>
        )}

        {existingCert ? (
          <Button
            size="lg"
            className="w-full"
            isLoading={isDownloading}
            onClick={() => downloadCert()}
          >
            <Download size={16} /> Download certificate
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full cursor-pointer"
            isLoading={isGenerating}
            disabled={!isComplete}
            onClick={() => generateCert()}
          >
            <Award size={16} />
            {isComplete ? "Generate certificate" : "Complete course first"}
          </Button>
        )}
      </Card>
    </div>
  );
}
