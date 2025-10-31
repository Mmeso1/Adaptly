import { LucideIcon } from "lucide-react";
import Image from "next/image";

interface SocialLink {
  icon: LucideIcon;
  href?: string;
  label: string;
}

interface TeamCardProps {
  name: string;
  role: string;
  bio: string;
  avatarGradient: string;
  socialLinks: SocialLink[];
  imageUrl?: string;
}

export default function TeamCard({
  name,
  role,
  bio,
  avatarGradient,
  socialLinks,
  imageUrl,
}: TeamCardProps) {
  return (
    <div className="group">
      <div className="p-8 rounded-2xl bg-[#111111] border border-white/5 hover:border-white/10 transition-all text-center space-y-4">
        {/* Avatar */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            className="w-24 h-24 rounded-2xl mx-auto object-cover"
          />
        ) : (
          <div className={`w-24 h-24 rounded-2xl ${avatarGradient} mx-auto`} />
        )}

        {/* Name & Role */}
        <div>
          <h3 className="text-lg font-medium">{name}</h3>
          <p className="text-sm text-white/40">{role}</p>
        </div>

        {/* Bio */}
        <p className="text-white/50 text-sm font-light leading-relaxed">
          {bio}
        </p>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {socialLinks.map((social, index) =>
            // <button
            //   key={index}
            //   className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
            //   aria-label={social.label}
            //   onClick={() => social.href && window.open(social.href, "_blank")}
            // >
            //   <social.icon className="w-4 h-4" />
            // </button>
            social.href ? (
              <a
                key={index}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                aria-label={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
