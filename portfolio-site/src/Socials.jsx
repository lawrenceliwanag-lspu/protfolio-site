import { Twitter, Github, Facebook, Linkedin, Mail } from "lucide-react";

export default function SocialLinks({ 
  twitter, 
  github, 
  facebook, 
  linkedin,
  size = 24,
  strokeWidth = 1,
  className = ""
}) {
  const links = [
    { href: twitter, Icon: Twitter, label: "Twitter" },
    { href: github, Icon: Github, label: "GitHub" },
    { href: facebook, Icon: Facebook, label: "Facebook" },
    { href: linkedin, Icon: Linkedin, label: "LinkedIn" },
  ];

  return (
    <div className={`flex gap-3 ${className}`}>
      {links.map(({ href, Icon, label }) => 
        href ? (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-white transition-colors hover:bg-blue-400 rounded-full p-2"
            aria-label={label}
          >
            <Icon size={size} strokeWidth={strokeWidth} />
          </a>
        ) : null
      )}
    </div>
  );
}