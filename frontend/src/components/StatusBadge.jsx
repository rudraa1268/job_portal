const STATUS_STYLES = {
  applied: 'bg-blue-100 text-blue-800',
  under_review: 'bg-yellow-100 text-yellow-800',
  shortlisted: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800',
  accepted: 'bg-green-100 text-green-800',
};

export default function StatusBadge({ status, label }) {
  const style = STATUS_STYLES[status] || 'bg-slate-100 text-slate-800';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>
      {label || status}
    </span>
  );
}
