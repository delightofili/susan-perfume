function StatusBadge({ status = "Pending" }) {
  const cleanStatus = typeof status === "string" ? status : "Pending";

  const styles = {
    Completed: "bg-green-400/10 text-green-400 border-green-400/20",
    Pending: "bg-orange-400/10 text-orange-400 border-orange-400/20",
    Processing: "bg-blue-400/10 text-blue-400 border-blue-400/20",
    Shipped: "bg-purple-400/10 text-purple-400 border-purple-400/20",
    Refunded: "bg-red-400/10 text-red-400 border-red-400/20",
  };

  const dots = {
    Completed: "bg-green-400",
    Pending: "bg-orange-400",
    Processing: "bg-blue-400",
    Shipped: "bg-purple-400",
    Refunded: "bg-red-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-inter border ${
        styles[cleanStatus] ?? "bg-white/5 text-white/40 border-white/10"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          dots[cleanStatus] ?? "bg-white/30"
        }`}
      />
      {cleanStatus}
    </span>
  );
}

export default StatusBadge;
