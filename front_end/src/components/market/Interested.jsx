import { getInterest } from "../../api/stock";
import { useEffect } from "react";

export default function Interested() {
  const init = async () => {
    const res = await getInterest({ page: 1, size: 5 });
    console.log(res.data);
  };

  useEffect(() => {
    init();
  });
  
  return <div>관심종목</div>;
}
