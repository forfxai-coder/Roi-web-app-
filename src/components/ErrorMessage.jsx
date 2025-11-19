export default function ErrorMessage({ message, onRetry = null }) {
  return (
    <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <p className="text-red-300 text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white text-xs"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

