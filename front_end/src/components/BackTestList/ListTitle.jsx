import { useState } from "react";

export default function ListTitle({ onCheckedAll, checked, titles }) {
  const paintTitles = titles.map((title, index) => (
    <th key={index}>{title}</th>
  ));

  return (
    <thead className="bg-gray-200 h-12">
      <tr>
        <th className="pl-3">
          <input
            id="checkAll"
            name="checkAll"
            type="checkbox"
            className="h-4 w-4 text-amber-300 focus:ring-amber-500 border-gray-300 rounded"
            onChange={(e) => onCheckedAll(e)}
            checked={checked}
          />
        </th>
        {paintTitles}
      </tr>
    </thead>
  );
}
