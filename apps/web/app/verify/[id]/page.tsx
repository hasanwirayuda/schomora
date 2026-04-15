import {
  Award,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  BookOpen,
} from "lucide-react";
import Card from "@/components/ui/card";

async function getCertificate(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function VerifyPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getCertificate(params.id);
  const isValid = data?.valid && data?.certificate;
  const cert = data?.certificate;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Schomora branding */}
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-indigo-600">Schomora</h1>
          <p className="text-sm text-gray-500">Certificate Verification</p>
        </div>

        <Card padding="lg" className="flex flex-col gap-6">
          {/* Status */}
          <div className="text-center">
            {isValid ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h2 className="text-lg font-bold text-green-700">
                  Sertifikat Valid
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Sertifikat ini asli dan diterbitkan oleh Schomora
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <XCircle size={32} className="text-red-600" />
                </div>
                <h2 className="text-lg font-bold text-red-700">
                  Sertifikat Tidak Valid
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Sertifikat ini tidak ditemukan atau tidak valid
                </p>
              </>
            )}
          </div>

          {/* Certificate details */}
          {isValid && cert && (
            <div className="flex flex-col gap-3 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <Award size={16} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sertifikat</p>
                  <p className="text-sm font-semibold text-gray-900">
                    Certificate of Completion
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                  <User size={16} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Diberikan kepada</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {cert.user?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Kursus</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {cert.course?.title}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar size={16} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Diterbitkan pada</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(cert.issued_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-400">Certificate ID</p>
                <p className="text-xs font-mono text-gray-600 break-all">
                  {cert.id}
                </p>
              </div>
            </div>
          )}
        </Card>

        <p className="text-center text-xs text-gray-400">
          Powered by Schomora — Adaptive Learning Platform
        </p>
      </div>
    </div>
  );
}
