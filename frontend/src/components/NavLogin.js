import spotifyIcon from "../images/spotify-icon.svg";

export function NavLogin(props) {
    if (props.isLoggedIn) {
        return (
            <li
                className="nav-item nav-btn-spotify"
                title={`Logged in as ${props.user.userName} `}
                style={{ cursor: "pointer" }}
                onClick={props.onLogoutClick}
            >
                <img
                    style={{ borderRadius: "50%" }}
                    src={props.user.userIcon}
                    alt=""
                />{" "}
                Logout{" "}
            </li>
        );
    } else {
        if (props.loginURL) {
            return (
                <li
                    className="nav-item nav-btn-spotify"
                    style={{ cursor: "pointer" }}
                    onClick={props.onLoginClick}
                >
                    <img src={spotifyIcon} alt="" /> Login{" "}
                </li>
            );
        }
    }
}
