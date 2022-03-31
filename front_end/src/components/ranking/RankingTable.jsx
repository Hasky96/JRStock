import styles from "./list.module.css";
import RankItem from "./RankItem";
import ListTitle from "./ListTitle";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function RankingTable({ data }) {
  const rankList = () => {
    const list = [];
    data.forEach((el, idx) => {
      list.push(<RankItem item={el} index={idx} key={idx} />);
    });
    return list;
  };

  return (
    <table
      className={classNames(styles.table, "xl:min-w-[1200px] min-w-[800px]")}
    >
      <colgroup>
        <col span="1" style={{ width: 7 + "%" }} />
        <col span="1" style={{ width: 7 + "%" }} />
        <col span="1" style={{ width: 10 + "%" }} />
        <col span="1" style={{ width: 12 + "%" }} />
        <col span="1" style={{ width: 12 + "%" }} />
        <col span="1" style={{ width: 14 + "%" }} />
        <col span="1" style={{ width: 14 + "%" }} />
        <col span="1" style={{ width: 14 + "%" }} />
        <col span="1" style={{ width: 14 + "%" }} />
      </colgroup>
      <ListTitle
        titles={[
          "순위",
          "프로필",
          "이름",
          "테스트",
          "수익율(%)",
          "투자원금(원)",
          "총 손익(원)",
          "최종 자산(원)",
          "매매일수(일)",
        ]}
      />
      <tbody>{data && rankList()}</tbody>
    </table>
  );
}
