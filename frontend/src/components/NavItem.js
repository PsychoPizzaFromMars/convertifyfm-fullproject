import { Link } from "react-router-dom";

export function NavItem({ route }) {
    return (
        <li className="nav-item">
            <Link to={route.ref}>{route.name}</Link>
        </li>
    );
}
