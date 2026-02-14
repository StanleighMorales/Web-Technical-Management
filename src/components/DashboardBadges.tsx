import { Link } from "@tanstack/react-router";

type BadgesProps = {
  name: string;
  link: string;
  data: number | null;
};

export default function DashboardBadges({ name, link, data }: BadgesProps) {
  return (
    <Link
      to={link}
      className={`
        group
        flex flex-col flex-nowrap items-center justify-center
        p-8
        rounded-2xl
        bg-white/60 backdrop-blur-md
        border
        shadow-sm
        transition-all duration-300
        cursor-pointer
        w-full min-w-[140px] max-w-[350px]

        hover:shadow-lg hover:-translate-y-1

        border-[#e5e7eb] hover:border-[#2563eb]
      `}
    >
      <h2
        className={`
          text-base font-medium
          text-[#475569]
          transition-colors
        `}
      >
        {name}
      </h2>

      <p
        className={`
          mt-4 text-5xl font-extrabold tracking-tight
          text-[#2563eb]
          transition-colors
        `}
      >
        {data ?? 0}
      </p>
    </Link>
  );
}
