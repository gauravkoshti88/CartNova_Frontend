import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

const socialConfig = [
  {
    key: "facebook",
    icon: FaFacebookF,
    hover: "hover:bg-blue-600 hover:border-blue-600",
    label: "Facebook",
  },
  {
    key: "instagram",
    icon: FaInstagram,
    hover: "hover:bg-pink-600 hover:border-pink-600",
    label: "Instagram",
  },
  {
    key: "twitter",
    icon: FaXTwitter,
    hover: "hover:bg-black hover:border-black",
    label: "X",
  },
  {
    key: "linkedin",
    icon: FaLinkedinIn,
    hover: "hover:bg-blue-700 hover:border-blue-700",
    label: "LinkedIn",
  },
  {
    key: "youtube",
    icon: FaYoutube,
    hover: "hover:bg-red-600 hover:border-red-600",
    label: "YouTube",
  },
];

export default function FooterSocial({ social }) {
  const socialLinks = socialConfig.filter((item) => social?.[item.key]);

  if (!socialLinks.length) return null;

  return (
    <div className="mt-4">
      <h4
        className="
          mb-3
          text-xs
          font-semibold
          uppercase
          tracking-widest
          text-gray-700
          dark:text-gray-300
        "
      >
        Follow Us
      </h4>

      <div className="flex flex-wrap gap-2">
        {socialLinks.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.key}
              href={social[item.key]}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              title={item.label}
              className={`
                group
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-black/90
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
                ${item.hover}
              `}
            >
              <Icon
                size={17}
                className="
                  text-gray-50
                  transition
                  group-hover:scale-110
                  group-hover:text-white
                "
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
