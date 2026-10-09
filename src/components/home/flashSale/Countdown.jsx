import { Clock3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 26,
    seconds: 16,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;

          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;

            if (hours > 0) {
              hours--;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const Box = ({ value, label }) => (
    <div
      className="
        flex
        h-11
        w-11
        flex-col
        items-center
        justify-center
        rounded-lg
        bg-[#262626]

        sm:h-13
        sm:w-13
        sm:rounded-xl

        md:h-14
        md:w-14

        lg:h-15
        lg:w-15
      "
    >
      <span
        className="
          text-sm
          font-bold
          leading-none
          text-white

          sm:text-base
          md:text-lg
          lg:text-xl
        "
      >
        {String(value).padStart(2, "0")}
      </span>

      <span
        className="
          mt-1
          text-[8px]
          uppercase
          leading-none
          text-gray-400

          sm:text-[9px]
          md:text-[10px]
          lg:text-xs
        "
      >
        {label}
      </span>
    </div>
  );

  return (
    <div
      className="
        flex
        items-center
        gap-1.5

        sm:gap-2
        md:gap-2.5
        lg:gap-3
      "
    >
      <Clock3
        className="
          mr-0.5
          h-5
          w-5
          shrink-0
          text-emerald-400

          sm:h-6
          sm:w-6

          md:h-7
          md:w-7

          lg:h-7
          lg:w-7
        "
      />

      <Box value={timeLeft.hours} label="HRS" />

      <Box value={timeLeft.minutes} label="MIN" />

      <Box value={timeLeft.seconds} label="SEC" />
    </div>
  );
}
