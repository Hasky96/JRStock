import ListHeader from "../components/ListHeader";
import PageContainer from "../components/PageContainer";
import Pagenation from "../components/Pagenation";

export default function Announcement() {
  return (
    <PageContainer>
      <ListHeader optionKind={["aaa", "bbb", "ccc"]} />
      <div>내용</div>
      <Pagenation itemCnt={25} pageCnt={4}></Pagenation>
    </PageContainer>
  );
}
