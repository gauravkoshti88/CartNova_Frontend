import { Link } from "react-router-dom";

export default function AdminFooterColumn({ title, links }) {
  return (
    <div>
      <h3
        className="
          relative
          mb-3
          inline-block
          text-sm
          font-semibold
          text-slate-700
          dark:text-gray-300
        "
      >
        {title}

        <span
          className="
            absolute
            -bottom-1.5
            left-0
            h-0.5
            w-8
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
                block
                rounded-md
                px-1.5
                py-1
                text-xs
                text-gray-500
                transition
                hover:bg-gray-200/70
                hover:text-emerald-500
                dark:text-gray-400
                dark:hover:bg-white/5
                dark:hover:text-emerald-400
              "
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
