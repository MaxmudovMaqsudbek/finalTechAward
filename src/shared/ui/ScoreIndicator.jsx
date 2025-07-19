const scoreColorMap = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
};

export const ScoreIndicator = ({ score }) => (
    <span className={`w-3 h-3 rounded-full ${scoreColorMap[score] || 'bg-gray-400'}`}></span>
);