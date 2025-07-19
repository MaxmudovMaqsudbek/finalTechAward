// export const CustomTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="p-2 bg-gray-700 text-white rounded-md border border-gray-600 shadow-lg text-sm">
//         <p className="label font-bold">{`${label}`}</p>
//         {payload.map((pld, index) => (
//           <div key={index} style={{ color: pld.color || pld.fill }}>{`${
//             pld.name
//           }: ${pld.value.toLocaleString()}`}</div>
//         ))}
//       </div>
//     );
//   }
//   return null;
// };
