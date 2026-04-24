import { CheckCircle, XCircle } from "lucide-react";

interface Props {
  isValid: boolean;
}

export default function VerifyStatus({ isValid }: Props) {
  return (
    <div className="text-center">
      {isValid ? (
        <>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-lg font-medium text-green-700">
            Valid Certificate
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            This certificate is authentic and issued by Schomora
          </p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <XCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-lg font-medium text-red-700">
            Invalid Certificate
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            This certificate was not found or is invalid
          </p>
        </>
      )}
    </div>
  );
}
