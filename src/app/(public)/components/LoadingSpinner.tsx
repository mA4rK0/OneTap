export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex justify-center items-center flex-col">
      <div className="spinner"></div>
      <p className="mt-4">Loading...</p>
    </div>
  );
}
