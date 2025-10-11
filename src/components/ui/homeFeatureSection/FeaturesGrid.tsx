import { Globe, MessageCircle, FileCheck, Zap, Shield } from "lucide-react";
import FeatureCard from "./FeatureCard";

interface Feature {
  icon: any;
  title: string;
  description: string;
  iconColor: "blue" | "emerald" | "purple";
}

const features: Feature[] = [
  {
    icon: Globe,
    title: "Instant Understanding",
    description:
      "Upload any document and get a clear summary in your language. No more confusion or misunderstandings.",
    iconColor: "blue",
  },
  {
    icon: MessageCircle,
    title: "Contextual Chat",
    description:
      "Ask questions about your document and get instant, accurate answers with full context.",
    iconColor: "emerald",
  },
  {
    icon: FileCheck,
    title: "Action Guidance",
    description:
      "Get clear recommendations on what to do next, from replying to taking specific actions.",
    iconColor: "purple",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Get results in seconds, not minutes. Our AI processes documents instantly for immediate understanding.",
    iconColor: "blue",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your documents never leave your device — all AI processing happens locally in your browser.",
    iconColor: "emerald",
  },
  {
    icon: Globe,
    title: "40+ Languages",
    description:
      "Support for over 40 languages with auto-detection and translation so you can understand content across cultures.",
    iconColor: "purple",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-extralight mb-4">
          Powerful features
        </h2>
        <p className="text-white/50 text-lg font-light">
          Everything you need to navigate foreign languages
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            iconColor={feature.iconColor}
          />
        ))}
      </div>
    </section>
  );
}
