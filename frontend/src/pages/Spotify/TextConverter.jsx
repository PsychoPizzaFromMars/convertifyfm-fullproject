import React, { useState, useEffect } from "react";
import SubmitPlaylistForm from "../../components/SubmitPlaylistForm";
import TrackCard from "../../components/TrackCard";
import { makeRequest } from "../../services/fetchData";
import { filterTracks } from "../../services/helperFunctions";
import arrowDown from "../../images/arrow-down-solid.svg";
import arrowUp from "../../images/arrow-up-solid.svg";
import spotifyIcon from "../../images/spotify-icon.svg";

export default function TimePeriodChart(props) {
    const [status, setStatus] = useState({
        error: null,
        isLoaded: true,
    });
    const [items, setItems] = useState([]);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [formData, setFormData] = useState({
        tracklist: "",
        playlistName: "ConvertifyFM",
        playlistDesc: "Generated by ConvertifyFM",
    });

    const handleScrollBottom = () => {
        window.scroll({
            top: document.body.offsetHeight,
            left: 0,
            behavior: "smooth",
        });
    };

    const handleScrollUp = () => {
        window.scroll({
            top: document.body.offsetHeight * -1,
            left: 0,
            behavior: "smooth",
        });
    };

    const handleInputChange = (event) => {
        setFormData((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
        setStatus((prev) => ({ ...prev, error: null }));
    };

    const handleSearchButtonClick = (event) => {
        event.preventDefault();
        const formData_ = formData;
        formData_.playlistDesc = `Your custom playlist generated by ConvertifyFM.`;

        setFormData(formData_);
        setStatus((prevState) => ({ ...prevState, isLoaded: false }));

        const body = {
            tracklist: formData_.tracklist.split(/[\n,]/),
        };

        makeRequest({
            endpoint: "/spotify/search",
            method: "POST",
            body,
            other: {
                mode: "cors",
                credentials: "include",
            },
        })
            .then((spotifyTracks) => {
                console.log(spotifyTracks);
                setStatus((prevState) => ({ ...prevState, isLoaded: true }));
                setItems(spotifyTracks?.tracks);
                setSelectedCheckboxes(
                    spotifyTracks.tracks
                        .map((track) => track.uri)
                        .reduce((o, key) => ({ ...o, [key]: true }), {})
                );
            })
            .catch((error) => {
                setStatus((prev) => ({ ...prev, error }));
                setItems(() => []);
            });
    };

    const handleCheckbox = (event) => {
        setSelectedCheckboxes((prevState) => ({
            ...prevState,
            [event.target.value]: event.target.checked,
        }));
    };

    const handleCheckAll = () => {
        setSelectedCheckboxes(
            Object.keys(selectedCheckboxes).reduce(
                (o, key) => ({ ...o, [key]: true }),
                {}
            )
        );
    };

    const handleUncheckAll = () => {
        setSelectedCheckboxes(
            Object.keys(selectedCheckboxes).reduce(
                (o, key) => ({ ...o, [key]: false }),
                {}
            )
        );
    };

    const handleSubmitPlaylist = (e) => {
        e.preventDefault();
        const selectedTracks = filterTracks(
            selectedCheckboxes,
            (value) => value == true
        );
        console.log(selectedTracks);
        const body = {
            tracks: Object.keys(selectedTracks),
            playlist_name: formData.playlistName,
            playlist_desc: formData.playlistDesc,
        };
        console.log("body", body);
        console.log(body.tracks);

        makeRequest({
            endpoint: "/spotify/playlist",
            method: "POST",
            other: {
                mode: "cors",
                credentials: "include",
            },
            body,
        }).then(() => {
            window.location.reload(false);
        });
    };

    useEffect(() => {
        console.log({ status, formData, items, selectedCheckboxes });
    }, [status, formData, items, selectedCheckboxes]);

    const { isLoaded, error } = status;
    let results;

    if (props.isSpotifyAuthenticated) {
        if (error) {
            results = (
                <div className="error-message search-results">
                    Error: {error.message || error}
                </div>
            );
        } else if (!isLoaded) {
            console.log("Loading results");
            results = <div className="loader"></div>;
        } else if (items.length > 0) {
            results = (
                <>
                    <div className="search-results">
                        <div className="buttonsContainer">
                            <button onClick={handleCheckAll}>Check All</button>
                            <button onClick={handleUncheckAll}>
                                Uncheck All
                            </button>
                            <button onClick={handleScrollBottom}>
                                Submit Tracks
                            </button>
                        </div>

                        {items?.map(function (item) {
                            return (
                                <TrackCard
                                    key={item.uri}
                                    track={item}
                                    onChange={handleCheckbox}
                                    checked={selectedCheckboxes[item.uri]}
                                />
                            );
                        })}
                    </div>
                    <SubmitPlaylistForm
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmitPlaylist}
                    />
                    <div className="buttonsScroll-container">
                        <button id="scroll-up" onClick={handleScrollUp}>
                            <img src={arrowUp} alt="" />
                        </button>
                        <button id="scroll-down" onClick={handleScrollBottom}>
                            <img src={arrowDown} alt="" />
                        </button>
                    </div>
                </>
            );
        }
    }

    return (
        <>
            <div className="use-description">
                <h1>Text to Spotify Converter</h1>
                <p style={{ maxWidth: "450px", margin: "0 auto" }}>
                    Make custom playlist by just typing names of tracks.
                </p>
            </div>

            <form className="border-comic" onSubmit={handleSearchButtonClick}>
                <p>Tracklist</p>
                <div className="row-container">
                    <textarea
                        name="tracklist"
                        id="tracklist"
                        value={formData.tracklist}
                        onChange={handleInputChange}
                        style={{ height: "200px", padding: "1rem" }}
                        placeholder="Type tracknames separated by commas or enter"
                        required
                    />
                </div>

                {props.isSpotifyAuthenticated ? (
                    <button type="submit" id="search">
                        Search
                    </button>
                ) : (
                    props.loginURL && (
                        <button
                            className="login btn-spotify fwidth"
                            onClick={() =>
                                (window.location = `${props.loginURL}`)
                            }
                        >
                            {" "}
                            <img src={spotifyIcon} alt="" /> Login
                        </button>
                    )
                )}
            </form>

            {results}
        </>
    );
}
