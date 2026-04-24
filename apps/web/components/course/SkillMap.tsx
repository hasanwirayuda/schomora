import Card from "@/components/ui/card";

interface SkillItem {
  topic_tag: string;
  level: "strong" | "moderate" | "weak";
  accuracy_percent: number;
}

interface Props {
  skillMap: SkillItem[];
}

const levelConfig = {
  strong: {
    label: "Strong",
    bg: "bg-green-100",
    text: "text-green-700",
    bar: "bg-green-500",
  },
  moderate: {
    label: "Moderate",
    bg: "bg-amber-100",
    text: "text-amber-700",
    bar: "bg-amber-500",
  },
  weak: {
    label: "Weak",
    bg: "bg-red-100",
    text: "text-red-700",
    bar: "bg-red-500",
  },
};

export default function SkillMap({ skillMap }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-medium text-gray-900">Skill Map</h2>
      <Card>
        <div className="flex flex-col gap-3">
          {skillMap.map((item) => {
            const config = levelConfig[item.level];
            return (
              <div key={item.topic_tag}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-gray-700">
                    {item.topic_tag}
                  </p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.text}`}
                  >
                    {config.label}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${config.bar}`}
                    style={{ width: `${item.accuracy_percent}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-0.5 text-right">
                  {Math.round(item.accuracy_percent)}%
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
