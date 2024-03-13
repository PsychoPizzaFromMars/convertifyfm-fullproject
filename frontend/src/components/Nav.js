import logo from "../images/Logo.svg";
import barsIcon from "../images/bars-solid.svg";

export function Nav(props) {
    return (
        <nav
            onMouseLeave={() =>
                document.querySelector(".menu").classList.remove("active")
            }
        >
            <div className="nav-titleBar">
                <a className="nav-logo-link" href="/">
                    <img className="nav-logo-img" src={logo} alt="vinyl disc" />
                    <div className="nav-logo-text">ConvertifyFM</div>
                </a>
                <div
                    className="toggle"
                    onClick={() => {
                        let menu = document.querySelector(".menu");
                        menu.classList.contains("active")
                            ? menu.classList.remove("active")
                            : menu.classList.add("active");
                    }}
                >
                    <img src={barsIcon} alt="" srcSet="" />
                </div>
            </div>
            <div className="menu-links">
                <ul className="menu">{props.children}</ul>
            </div>
        </nav>
    );
}
