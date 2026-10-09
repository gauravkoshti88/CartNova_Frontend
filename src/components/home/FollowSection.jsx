import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
} from "react-icons/fa6";

const getUrl = (value = "") => {
  const match = value.match(/\((.*?)\)/);
  return match ? match[1] : value;
};

export default function FollowSection({ social }) {
  const socialItems = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      url: getUrl(social?.facebook),
      bg: "bg-blue-600",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      url: getUrl(social?.instagram),
      bg: "bg-pink-600",
    },
    {
      name: "X",
      icon: FaXTwitter,
      url: getUrl(social?.twitter),
      bg: "bg-black",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedinIn,
      url: getUrl(social?.linkedin),
      bg: "bg-blue-700",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      url: getUrl(social?.youtube),
      bg: "bg-red-600",
    },
  ].filter((item) => item.url);

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <h2
            className="
              text-2xl
              font-bold
              text-gray-900
              sm:text-3xl
              md:text-4xl
              dark:text-gray-300
            "
          >
            Follow Us
          </h2>

          <p
            className="
              mx-auto
              mt-2
              max-w-xl
              text-xs
              leading-5
              text-gray-600
              sm:text-sm
              sm:leading-6
              md:text-base
              dark:text-gray-400
            "
          >
            Stay connected with us on social media.
          </p>
        </div>

        {/* Social Icons */}
        <div
          className="
            mt-6
            flex
            flex-wrap
            items-center
            justify-center
            gap-3
            sm:mt-8
            sm:gap-4
            md:gap-5
            lg:gap-6
          "
        >
          {socialItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.name}
                className={`
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-200
                  text-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:scale-110
                  hover:text-white

                  sm:h-13
                  sm:w-13

                  md:h-14
                  md:w-14

                  lg:h-16
                  lg:w-16

                  ${item.bg}
                `}
              >
                <Icon
                  className="
                    text-base
                    sm:text-lg
                    md:text-xl
                    lg:text-2xl
                  "
                />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
