import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <Link to="market">
        <button>go to market</button>
      </Link>
    </div>
  );
}
