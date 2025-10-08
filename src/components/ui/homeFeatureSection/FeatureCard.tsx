import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: "blue" | "emerald" | "purple";
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = "blue",
}: FeatureCardProps) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      shadow: "hover:shadow-blue-500/5",
    },
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      shadow: "hover:shadow-emerald-500/5",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
      shadow: "hover:shadow-purple-500/5",
    },
  };

  const colors = colorClasses[iconColor];

  return (
    <div
      className={`group p-8 rounded-2xl bg-[#111111] border border-white/5 hover:border-white/10 transition-all hover:shadow-xl ${colors.shadow}`}
    >
      <div
        className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-6`}
      >
        <Icon className={`w-6 h-6 ${colors.text}`} />
      </div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-white/50 leading-relaxed font-light">{description}</p>
    </div>
  );
}
