export default function Toast({ message, show }) {
  if (!show) return null;

  return (
    <div
      className="position-fixed bottom-0 end-0 m-4 bg-success text-white px-4 py-2 rounded shadow"
      style={{ zIndex: 2000 }}
    >
      {message}
    </div>
  );
}
