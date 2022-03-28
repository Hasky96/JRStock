import { useState } from "react";
import styles from "./list.module.css";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ListTitle({ titles }) {
  const paintTitles = titles.map((title, index) => {
    if (index === 0) {
      return (
        <th className={styles.first} key={index}>
          {title}
        </th>
      );
    } else if (index === titles.length - 1) {
      return (
        <th className={styles.last} key={index}>
          {title}
        </th>
      );
    } else {
      return (
        <th className={styles.normal} key={index}>
          {title}
        </th>
      );
    }
  });

  return (
    <thead className={classNames("h-14")}>
      <tr className={classNames("bg-primary xl:text-base text-sm")}>
        {paintTitles}
      </tr>
    </thead>
  );
}
