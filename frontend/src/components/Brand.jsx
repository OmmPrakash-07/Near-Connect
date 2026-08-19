export default function Brand({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand--compact" : ""}`}>
      <span className="brand__mark" aria-hidden="true"><i /><i /></span>
      <span>Near <strong>Connect</strong></span>
    </div>
  );
}
