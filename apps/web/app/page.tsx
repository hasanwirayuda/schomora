import Link from "next/link";
import Button from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-5xl font-bold text-indigo-600 mb-3">Schomora</h1>
      <p className="text-xl text-gray-600 mb-2">Adaptive Learning Platform</p>
      <p className="text-gray-500 mb-10 max-w-md">
        Belajar lebih cerdas dengan quiz adaptif yang menyesuaikan kemampuanmu
        secara real-time.
      </p>
      <div className="flex gap-4">
        <Link href="/register">
          <Button size="lg">Mulai belajar gratis</Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="secondary">
            Masuk
          </Button>
        </Link>
      </div>
    </div>
  );
}
