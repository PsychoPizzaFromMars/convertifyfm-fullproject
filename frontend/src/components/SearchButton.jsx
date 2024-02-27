import React from "react";
import spotifyIcon from "../images/spotify-icon.svg";
import { useAuth } from "../utils/AuthContext";

export function SearchButton() {
    const { isLoggedIn, loginURL } = useAuth();
    return isLoggedIn ? (
        <button type="submit" id="search">
            Search
        </button>
    ) : (
        loginURL && (
            <button
                className="login btn-spotify fwidth"
                onClick={() => (window.location = `${loginURL}`)}
            >
                {" "}
                <img src={spotifyIcon} alt="" /> Login
            </button>
        )
    );
}
