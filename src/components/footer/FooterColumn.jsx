import { Link } from "react-router-dom";
export default function FooterColumn({ title, links }) {
  return (
    <div>
      <h3
        className="
          relative
          mb-4
          inline-block
          text-base
          font-semibold
          text-slate-700
          dark:text-gray-300
        "
      >
        {title}

        <span
          className="
            absolute
            -bottom-2
            left-0
            h-0.5
            w-10
            rounded-full
            bg-emerald-500
          "
        />
      </h3>

      <ul className="space-y-0.5">
        {links.map((item) => (
          <li key={item.title}>
            <Link
              to={item.path}
              className="
                group
                flex
                items-center
                rounded-lg
                px-2
                py-1.5
                text-sm
                text-gray-500
                transition-all
                duration-200
                hover:bg-gray-200/70
                hover:text-emerald-500
                dark:text-gray-300
                dark:hover:bg-white/5
              "
            >
              <span className="font-medium">{item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
