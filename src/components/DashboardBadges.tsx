import { Link } from "react-router-dom";

type BadgesProps = {
  name: string;
  link: string;
  data: number;
};

export default function DashboardBadges({ name, link, data }: BadgesProps) {
  return (
    <Link
      key={name}
      to={link}
      className="flex flex-col justify-center items-center p-8 rounded-2xl border shadow-md transition-all duration-200 hover:shadow-2xl hover:scale-105 bg-white/90 border-[#e0e7ef]"
    >
      <h2 className="mb-2 text-lg font-semibold text-[#64748b]">{name}</h2>
      <p className="text-4xl font-bold text-[#2563eb]">{data || 0}</p>
    </Link>
  );
}
