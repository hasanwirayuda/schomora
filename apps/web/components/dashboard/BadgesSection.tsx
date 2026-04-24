import { Award } from "lucide-react";
import Card from "@/components/ui/card";

interface UserBadge {
  id: string;
  badge: {
    icon: string;
    name: string;
    description: string;
  };
}

interface Props {
  badges: UserBadge[] | undefined;
}

export default function BadgesSection({ badges }: Props) {
  const isEmpty = !badges || badges.length === 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h2 className="text-lg font-medium text-gray-900 pb-2 -mt-1">Badges</h2>
      <Card bgColor="bg-slate-100" border={false}>
        {isEmpty ? (
          <div className="text-center py-8">
            <Award size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">
              Complete quizzes to earn badges!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {badges.map((ub) => (
              <div key={ub.id} className="flex items-center gap-3">
                <span className="text-2xl">{ub.badge.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {ub.badge.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ub.badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
