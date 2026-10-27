export function LoadingScreen({
  station = false,
  slow = false,
}: {
  station?: boolean;
  slow?: boolean;
}) {
  return (
    <div className="experience-loading" role="status">
      <svg viewBox="0 0 100 60" aria-hidden="true">
        <path d="M8 38V20h35v18ZM11 20l4-6h24l4 6M18 14V5h10" />
        <circle cx="16" cy="42" r="4" />
        <circle cx="27" cy="42" r="4" />
        <circle cx="38" cy="42" r="4" />
        <circle cx="74" cy="29" r="19" />
        <circle cx="74" cy="29" r="5" />
        <path d="M93 13v13L81 35" />
      </svg>
      <p>Mohsen Esmaeili</p>
      <span>
        {station ? "Loading the playable habitat…" : "Loading my portfolio…"}
      </span>
      {slow && (
        <p className="loading-note">
          The habitat is taking longer to prepare. You can keep waiting or open
          the reading version.
        </p>
      )}
      <a href="/reading.html">Open the reading version</a>
    </div>
  );
}
