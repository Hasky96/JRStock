export default function ListItem({ onChecked, checked, index, item }) {
  return (
    <li
      key={index}
      className="grid grid-cols-12 h-12 hover:bg-yellow-50 hover:cursor-pointer"
    >
      <div className="col-span-1 my-auto grid grid-cols-2">
        <div className="col-span-1">
          <input
            id="checkbox"
            name="checkbox"
            type="checkbox"
            className="h-4 w-4 text-amber-300 focus:ring-amber-500 border-gray-300 rounded"
            onChange={(e) => onChecked(e, index)}
            checked={checked}
          />
        </div>
        <p className="col-span-1">{index + 1}</p>
      </div>
      <p className="col-span-5 my-auto">{item.title}</p>
      <p className="col-span-3 my-auto">{item.created_at}</p>
      <p className="col-span-3 my-auto">{item.updated_at}</p>
    </li>
  );
}
