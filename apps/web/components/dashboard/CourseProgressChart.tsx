"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface CourseProgress {
  course_id: string;
  progress_percent: number;
  is_completed: boolean;
  completed_modules: number;
  total_modules: number;
}

interface Props {
  courseProgresses: CourseProgress[] | undefined;
}

const COLORS = {
  completed: "#22c55e",
  inProgress: "#3b5bdb",
  notStarted: "#d1d5db",
  notPassed: "#f59e0b",
};

export default function CourseProgressChart({ courseProgresses }: Props) {
  const total = courseProgresses?.length ?? 0;

  let completed = 0;
  let inProgress = 0;
  let notStarted = 0;
  let notPassed = 0;

  if (total > 0) {
    courseProgresses!.forEach((cp) => {
      if (cp.is_completed) {
        completed++;
      } else if (cp.progress_percent === 0) {
        notStarted++;
      } else if (cp.progress_percent > 0 && cp.progress_percent < 100) {
        inProgress++;
      } else {
        notPassed++;
      }
    });
  }

  const overallPercent =
    total > 0
      ? Math.round(
          courseProgresses!.reduce((sum, cp) => sum + cp.progress_percent, 0) /
            total,
        )
      : 0;

  const data =
    total === 0
      ? [{ name: "No Data", value: 1, color: "#e5e7eb" }]
      : [
          { name: "Completed", value: completed, color: COLORS.completed },
          { name: "In Progress", value: inProgress, color: COLORS.inProgress },
          { name: "Not Started", value: notStarted, color: COLORS.notStarted },
          { name: "Not Passed", value: notPassed, color: COLORS.notPassed },
        ].filter((d) => d.value > 0);

  const legend = [
    { name: "Completed", color: COLORS.completed },
    { name: "In Progress", color: COLORS.inProgress },
    { name: "Not Started", color: COLORS.notStarted },
    { name: "Not Passed", color: COLORS.notPassed },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full h-[160px]">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              dataKey="value"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${Number(value)} courses`,
                String(name),
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-gray-700">
            {overallPercent}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {legend.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-xs text-gray-600 font-medium">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
