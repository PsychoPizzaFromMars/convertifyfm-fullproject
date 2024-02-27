import React from "react";

import PlaylistForm from "../../components/PlaylistForm";

import BaseForm from "../../components/BaseForm";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Loader } from "../../components/Loader";
import { PageDescription } from "../../components/PageDescription";
import { ScrollButtons } from "../../components/ScrollButtons";
import { SearchResults } from "../../components/SearchResults";
import { useAuth } from "../../utils/AuthContext";
import { spotify } from "../../utils/api/spotifyAPI";
import {
    convertSpotifyTracksToCheckboxesTable,
    transformResponse,
} from "../../utils/helpers";
import { useCheckboxes, useFetchTracks, useForm } from "../../utils/hooks";

export default function TimePeriodChart(props) {
    const { tracks, loading, error, setError, fetchData } = useFetchTracks();
    const {
        checkboxes,
        setCheckboxes,
        handleCheck,
        handleCheckAll,
        handleUncheckAll,
    } = useCheckboxes();
    const [searchForm, , handleSearchFormChange] = useForm({
        tracklist: "",
    });
    const [playlistForm, setPlaylistForm, handlePlaylistFormChange] = useForm({
        playlistName: "ConvertifyFm",
        playlistDesc: "Generated by ConvertifyFm",
    });
    const fields = [
        {
            name: "tracklist",
            type: "textarea",
            label: "Tracklist",
            placeholder: "Type tracknames separated by commas or enter",
            validation: {
                required: true,
            },
        },
    ];

    const setDefaultPlaylistDesc = () => {
        const playlistDesc = `Your custom playlist generated by ConvertifyFM.`;
        setPlaylistForm((prevState) => ({ ...prevState, playlistDesc }));
    };

    const handleSearchButtonClick = (event) => {
        event.preventDefault();
        const body = {
            tracklist: searchForm.tracklist.split(/[\n,]/),
        };
        setDefaultPlaylistDesc();

        fetchData(spotify.search, body, transformResponse)
            .then((fetchedTracks) => {
                setCheckboxes(
                    convertSpotifyTracksToCheckboxesTable(fetchedTracks)
                );
            })
            .catch((error) => {
                setError(error);
            });
    };

    const { isLoggedIn } = useAuth();
    let results;

    if (isLoggedIn) {
        if (error) {
            results = <ErrorMessage error={error} />;
        } else if (loading) {
            results = <Loader />;
        } else if (tracks.length > 0) {
            results = (
                <>
                    <SearchResults
                        onCheckAll={handleCheckAll}
                        onUncheckAll={handleUncheckAll}
                        onCheck={handleCheck}
                        tracks={tracks}
                        checkboxes={checkboxes}
                    />
                    <PlaylistForm
                        formData={playlistForm}
                        onInputChange={handlePlaylistFormChange}
                        checkboxes={checkboxes}
                    />
                    <ScrollButtons />
                </>
            );
        }
    }

    return (
        <>
            <PageDescription
                title="Text to Spotify Converter"
                text="Make custom playlist by just typing names of tracks."
            />

            <BaseForm
                formData={searchForm}
                onSubmit={handleSearchButtonClick}
                onInputChange={handleSearchFormChange}
                fields={fields}
            />

            {results}
        </>
    );
}
