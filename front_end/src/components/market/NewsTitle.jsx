import { useState } from "react";

export default function NewsTitle({ onCheckedAll, checked, titles }) {
  const paintTitles = titles.map((title, index) => (
    <th key={index}>{title}</th>
  ));

  return (
    <thead className="bg-gray-200 h-12">
      <tr>{paintTitles}</tr>
    </thead>
  );
}
