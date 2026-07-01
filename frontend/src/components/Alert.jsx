import LoadingSpinner from './LoadingSpinner';

export default function ErrorAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="mb-4 flex items-start justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} className="ml-4 font-bold hover:text-red-900">
          ×
        </button>
      )}
    </div>
  );
}

export function SuccessAlert({ message }) {
  if (!message) return null;
  return (
    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
      {message}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}
