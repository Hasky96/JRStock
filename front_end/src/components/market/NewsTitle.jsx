import { useState } from "react";

export default function NewsTitle({ onCheckedAll, checked, titles }) {
  const paintTitles = titles.map((title, index) => (
    <th className="font-normal" key={index}>
      {title}
    </th>
  ));

  return (
    <thead className="bg-slate-100 h-12">
      <tr>{paintTitles}</tr>
    </thead>
  );
}
