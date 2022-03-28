import { Link } from "react-router-dom";

export default function NavItem({ currentPath, linkPath, linkText, children }) {
  const active = "nav-link";
  const inActive =
    "nav-link grayscale opacity-50 hover:grayscale-0 hover:opacity-100";
  // const inActive = "nav-link brightness-200 hover:brightness-100";
  // const inActive = "nav-link blur-sm hover:blur-none";

  return (
    <li className="nav-item hover:bg-indigo-50">
      <Link to={linkPath}>
        <div className={currentPath.includes(linkPath) ? active : inActive}>
          {children}
          <span className="link-text">{linkText}</span>
        </div>
      </Link>
    </li>
  );
}
