interface Props {
  title: string;
  value: string;
  subtitle?: string;
}

export default function DashboardCard({
  title,
  value,
  subtitle,
}: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
      <h3 className="text-sm text-slate-500">{title}</h3>
      <p className="text-2xl font-bold text-slate-800 mt-2">
        {value}
      </p>
      {subtitle && (
        <p className="text-xs text-slate-400 mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}