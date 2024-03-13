import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import TimePeriodTopChart from "./pages/Lastfm/TimePeriodChart";
import LastfmTopTracks from "./pages/Lastfm/TopTracks";
import NotFound from "./pages/NotFound";
import Home from "./pages/Spotify/Home";
import TextConverter from "./pages/Spotify/TextConverter";
import SpotifyTopTracks from "./pages/Spotify/TopTracks";

import { Nav } from "./components/Nav";
import { NavItem } from "./components/NavItem";
import { NavLogin } from "./components/NavLogin";
import { useAuth } from "./utils/AuthContext";
import { spotify } from "./utils/api/spotifyAPI";

export default function App() {
    const { isLoggedIn, user, loginURL } = useAuth();

    let routes = [
        {
            name: "Home",
            ref: "/",
            elem: () => <Home />,
        },
        {
            name: "LastFM Time Period Top Charts",
            ref: "/lastfm/time-period-charts",
            elem: () => <TimePeriodTopChart />,
        },
        {
            name: "LastFM User's Top Tracks",
            ref: "/lastfm/users-top-tracks",
            elem: () => <LastfmTopTracks />,
        },
        {
            name: "Spotify User's Top Tracks",
            ref: "/spotify/users-top-tracks",
            elem: () => <SpotifyTopTracks />,
        },
        {
            name: "Text Converter",
            ref: "/spotify/text-to-tracks",
            elem: () => <TextConverter />,
        },
    ];

    const handleLoginClick = () => {
        window.location = loginURL;
    };

    const handleLogoutClick = () => {
        spotify.logout().then(() => {
            window.location = "/";
        });
    };

    return (
        <Router>
            <Nav>
                {routes.map(function (route) {
                    return <NavItem route={route} />;
                })}

                <NavLogin
                    isLoggedIn={isLoggedIn}
                    user={user}
                    loginURL={loginURL}
                    onLoginClick={handleLoginClick}
                    onLogoutClick={handleLogoutClick}
                />
            </Nav>
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
