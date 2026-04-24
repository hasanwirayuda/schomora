import Button from "@/components/ui/button";

interface Props {
  title: string;
  description: string;
  authorName: string;
  isOwner: boolean;
  isEnrolled: boolean;
  isEnrolling: boolean;
  onEnroll: () => void;
}

export default function CourseHeader({
  title,
  description,
  authorName,
  isOwner,
  isEnrolled,
  isEnrolling,
  onEnroll,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium text-gray-900">{title}</h1>
        <p className="text-gray-500">{description}</p>
        <p className="text-sm text-gray-400">by {authorName}</p>
      </div>
      {!isOwner && !isEnrolled && (
        <Button isLoading={isEnrolling} onClick={onEnroll}>
          Enroll for free
        </Button>
      )}
    </div>
  );
}
