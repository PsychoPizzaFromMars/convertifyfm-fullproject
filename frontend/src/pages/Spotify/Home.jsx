import React, { useEffect } from "react";
import spotifyIcon from "../../images/spotify-icon.svg";

function Home(props) {
    return (
        <>
            <div className="welcome-hero">
                <h1 className="welcome-title">Welcome to ConvertifyFM</h1>
                <div className="welcome-desc">
                    <h3>Rediscover your music.</h3>
                    <h3>
                        Convert your LastFM charts of different time periods
                        into Spotify playlists.
                    </h3>
                    <h3>Create playlists of your top Spotify listenings.</h3>
                </div>
                {props.isSpotifyAuthenticated ? (
                    <div className="welcome-user">
                        Logged in as {props.userName}{" "}
                        <img
                            src={props.userIcon}
                            style={{
                                borderRadius: "50%",
                                height: "45px",
                                translate: "15% 35%",
                            }}
                            alt=""
                        />
                    </div>
                ) : (
                    props.loginURL && (
                        <button
                            className="login btn-spotify"
                            onClick={() =>
                                (window.location = `${props.loginURL}`)
                            }
                        >
                            <img src={spotifyIcon} alt="" /> Login
                        </button>
                    )
                )}
            </div>
        </>
    );
}

export default Home;
