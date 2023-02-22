import "./App.css";
import logo from "./images/Logo.svg";
import barsIcon from "./images/bars-solid.svg";
import spotifyIcon from "./images/spotify-icon.svg";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TimePeriodTopChart from "./pages/Lastfm/TimePeriodChart";
import LastfmTopTracks from "./pages/Lastfm/TopTracks"
import SpotifyTopTracks from "./pages/Spotify/TopTracks"
import TextConverter from "./pages/Spotify/TextConverter"
import NotFound from "./pages/NotFound";
import "./App.css";
import Home from "./pages/Spotify/Home";
import { makeRequest } from "./services/fetchData";

function LoginControl(props) {
    if (props.isLoggedIn) {
        return (
            <li
                className="nav-item nav-btn-spotify"
                title={`Logged in as ${props.userName} `}
                style={{ cursor: "pointer" }}
                onClick={props.onLogoutClick}
            >
                <img
                    style={{ borderRadius: "50%" }}
                    src={props.userIcon}
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

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userIcon, setUserIcon] = useState("");
    const [userName, setUserName] = useState("");
    const [loginURL, setLoginURL] = useState("");
    let routes = [
        {
            name: "Home",
            ref: "/",
            elem: () => (
                <Home
                    loginURL={loginURL}
                    isSpotifyAuthenticated={isLoggedIn}
                    userName={userName}
                    userIcon={userIcon}
                />
            ),
        },
        {
            name: "LastFM Time Period Top Charts",
            ref: "/lastfm/time-period-charts",
            elem: () => (
                <TimePeriodTopChart
                    isSpotifyAuthenticated={isLoggedIn}
                    loginURL={loginURL}
                />
            ),
        },
        {
            name: "LastFM User's Top Tracks",
            ref: "/lastfm/users-top-tracks",
            elem: () => (
                <LastfmTopTracks
                    isSpotifyAuthenticated={isLoggedIn}
                    loginURL={loginURL}
                />
            ),
        },
        {
            name: "Spotify User's Top Tracks",
            ref: "/spotify/users-top-tracks",
            elem: () => (
                <SpotifyTopTracks
                    isSpotifyAuthenticated={isLoggedIn}
                    loginURL={loginURL}
                />
            ),
        },
        {
            name: "Text Converter",
            ref: "/spotify/text-to-tracks",
            elem: () => (
                <TextConverter
                    isSpotifyAuthenticated={isLoggedIn}
                    loginURL={loginURL}
                />
            ),
        },
    ];
    useEffect(() => {
        makeRequest({
            endpoint: "/is-authenticated",
            method: "GET",
            other: {
                mode: "cors",
                credentials: "include",
            },
        }).then((data) => {
            setIsLoggedIn(data.status);
            if (isLoggedIn) {
                makeRequest({
                    endpoint: "/spotify/current_user",
                    method: "GET",
                    other: {
                        mode: "cors",
                        credentials: "include",
                    },
                }).then((userdata) => {
                    setUserIcon(
                        userdata.images[0].url ??
                            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                    );
                    setUserName(userdata.display_name ?? "Unknown");
                });
            }
        });

        makeRequest({
            endpoint: "/login",
            other: {
                mode: "cors",
                include: "credentials",
            },
        }).then((data) => {
            setLoginURL(data.url);
        });
    }, [isLoggedIn]);

    const handleLoginClick = () => {
        window.location = loginURL;
        setIsLoggedIn(true);
    };

    const handleLogoutClick = () => {
        makeRequest({
            endpoint: "/logout",
            method: "DELETE",
            other: {
                mode: "cors",
                credentials: "include",
            },
        }).then(() => {
            setIsLoggedIn(false);
            window.location = "/";
        });
    };

    return (
        <Router>
            <nav
                onMouseLeave={() =>
                    document.querySelector(".menu").classList.remove("active")
                }
            >
                <div className="nav-titleBar">
                    <a className="nav-logo-link" href="/">
                        <img
                            className="nav-logo-img"
                            src={logo}
                            alt="vinyl disc"
                        />
                        <div className="nav-logo-text">ConvertifyFM</div>
                    </a>
                    <div
                        className="toggle"
                        onClick={(event) => {
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
                    <ul className="menu">
                        {routes.map(function (route) {
                            return (
                                <li className="nav-item">
                                    <Link to={route.ref}>{route.name}</Link>
                                </li>
                            );
                        })}

                        <LoginControl
                            isLoggedIn={isLoggedIn}
                            userIcon={userIcon}
                            userName={userName}
                            loginURL={loginURL}
                            onLoginClick={handleLoginClick}
                            onLogoutClick={handleLogoutClick}
                        />
                    </ul>
                </div>
            </nav>
            <main>
                <Routes>
                    {routes.map(function (route) {
                        return (
                            <Route
                                exact
                                path={route.ref}
                                element={route.elem()}
                            ></Route>
                        );
                    })}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </Router>
    );
}
