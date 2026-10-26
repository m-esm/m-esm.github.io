export function LoadingScreen({ station = false }: { station?: boolean }) {
  return (
    <div className="experience-loading" role="status">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="10" />
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="16"
          transform="rotate(-35 50 50)"
        />
        <ellipse cx="50" cy="50" rx="38" ry="16" transform="rotate(35 50 50)" />
      </svg>
      <p>Mohsen Esmaeili</p>
      <span>
        {station
          ? "Opening the orbital habitat"
          : "Bringing the systems to life"}
      </span>
      <a href="/reading.html">Open the reading version</a>
    </div>
  );
}
