import { Github, Linkedin } from "lucide-react";
import TeamCard from "./TeamCard";

const teamMembers = [
  {
    name: "Mmesoma Anisiuba",
    role: "Founder & CEO",
    bio: "Just a girl who loves to code.",
    avatarGradient: "bg-gradient-to-br from-blue-500 to-emerald-500",
    socialLinks: [
      {
        icon: Github,
        href: "https://github.com/Mmeso1",
        label: "X",
      },
      {
        icon: Linkedin,
        href: "https://www.linkedin.com/in/mmesoma01/",
        label: "LinkedIn",
      },
    ],
  },
  {
    name: "Okpara Favour",
    role: "CTO",
    bio: "'Everywhere good' is my motto.",
    avatarGradient: "bg-gradient-to-br from-purple-500 to-pink-500",
    socialLinks: [
      {
        icon: Github,
        href: "https://github.com/OkparaFavour",
        label: "GitHub",
      },
      {
        icon: Linkedin,
        href: "https://linkedin.com/in/okparafavour",
        label: "LinkedIn",
      },
    ],
  },
];

export default function TeamGrid() {
  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
      {teamMembers.map((member, index) => (
        <TeamCard
          key={index}
          name={member.name}
          role={member.role}
          bio={member.bio}
          avatarGradient={member.avatarGradient}
          socialLinks={member.socialLinks}
        />
      ))}
    </div>
  );
}
