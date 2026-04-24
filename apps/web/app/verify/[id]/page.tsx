import Card from "@/components/ui/card";
import VerifyStatus from "@/components/verify/VerifyStatus";
import CertificateDetail from "@/components/verify/CertificateDetail";

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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getCertificate(id);
  const isValid = data?.valid && data?.certificate;
  const cert = data?.certificate;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col gap-4">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-semibold text-primary">Schomora</h1>
          <p className="text-sm text-gray-500">Certificate Verification</p>
        </div>

        <Card padding="lg" className="flex flex-col gap-6">
          <VerifyStatus isValid={isValid} />
          {isValid && cert && <CertificateDetail certificate={cert} />}
        </Card>

        <p className="text-center text-xs text-gray-400">
          Powered by Schomora — Adaptive Learning Platform
        </p>
      </div>
    </div>
  );
}
