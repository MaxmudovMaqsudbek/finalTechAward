export const DateInput = ({ label, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
      {label}
    </label>
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2 w-full rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);
