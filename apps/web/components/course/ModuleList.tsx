import Card from "@/components/ui/card";
import ModuleCard from "./ModuleCard";

interface Module {
  id: string;
  title: string;
  description: string;
}

interface Props {
  modules: Module[];
  completedModuleIDs: Set<string>;
  isEnrolled: boolean;
  isOwner: boolean;
  onMarkComplete: (moduleId: string) => void;
}

export default function ModuleList({
  modules,
  completedModuleIDs,
  isEnrolled,
  isOwner,
  onMarkComplete,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-medium text-gray-900">
        Modules ({modules.length})
      </h2>

      {modules.length === 0 ? (
        <Card className="text-center py-10">
          <p className="text-gray-400 text-sm">No modules yet</p>
        </Card>
      ) : (
        modules.map((module, index) => (
          <ModuleCard
            key={module.id}
            module={module}
            index={index}
            isCompleted={completedModuleIDs.has(module.id)}
            isEnrolled={isEnrolled}
            isOwner={isOwner}
            onMarkComplete={onMarkComplete}
          />
        ))
      )}
    </div>
  );
}
