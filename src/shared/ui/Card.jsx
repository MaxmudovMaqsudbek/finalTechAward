export const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition-colors duration-300 ${className}`}>
    {children}
  </div>
);