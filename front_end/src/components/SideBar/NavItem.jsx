import { Link } from "react-router-dom";

export default function NavItem({ currentPath, linkPath, linkText, children }) {
  const active = "nav-link";
  const inActive = "nav-link grayscale hover:grayscale-0";

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
