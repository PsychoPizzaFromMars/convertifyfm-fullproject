import React from "react";

import PlaylistForm from "../../components/PlaylistForm";

import { ErrorMessage } from "../../components/ErrorMessage";
import { Loader } from "../../components/Loader";
import { PageDescription } from "../../components/PageDescription";
import { ScrollButtons } from "../../components/ScrollButtons";
import { SearchResults } from "../../components/SearchResults";

import BaseForm from "../../components/BaseForm";
import { useAuth } from "../../utils/AuthContext";
import { lastFM } from "../../utils/api/lastfmAPI";
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
        username: "",
        period: "overall",
        tracksNum: "50",
        page: "1",
    });
    const [playlistForm, setPlaylistForm, handlePlaylistFormChange] = useForm({
        playlistName: "ConvertifyFm",
        playlistDesc: "Generated by ConvertifyFm",
    });
    const fields = [
        {
            name: "username",
            label: "Last.fm username",
            type: "text",
            validation: { required: true },
        },
        {
            name: "period",
            label: "Time period",
            type: "select",
            options: [
                {
                    value: "overall",
                    label: "All time",
                },
                {
                    value: "7days",
                    label: "Last week",
                },
                {
                    value: "1month",
                    label: "Last month",
                },
                {
                    value: "3month",
                    label: "Last 3 months",
                },
                {
                    value: "6month",
                    label: "Last 6 months",
                },
                {
                    value: "12month",
                    label: "Last year",
                },
            ],
            required: true,
        },
        {
            name: "tracksNum",
            label: "Number of tracks",
            type: "number",
            validation: { required: true, min: "50", max: "1000" },
        },
        {
            name: "page",
            label: "Page",
            type: "number",
            validation: { required: true, min: "1" },
        },
    ];

    const setDefaultPlaylistDesc = () => {
        const lastfm_periods = {
            overall: "all time",
            "7day": "last week",
            "1month": "last month",
            "3month": "last 3 months",
            "6month": "last 6 months",
            "12month": "last year",
        };
        const playlistDesc = `${searchForm.username}'s LastFM top tracks for ${
            lastfm_periods[searchForm.period]
        } generated by ConvertifyFM.`;
        setPlaylistForm((prevState) => ({ ...prevState, playlistDesc }));
    };

    const handleSearchButtonClick = (event) => {
        event.preventDefault();
        const body = {
            user_id: searchForm.username,
            period: searchForm.period,
            limit: searchForm.tracksNum,
            page: searchForm.page,
        };

        setDefaultPlaylistDesc();

        lastFM
            .getTopTracks(body)
            .then((lastfmTracks) => {
                if (!lastfmTracks) {
                    throw new Error("Bad request");
                }
                const body = {
                    tracklist: lastfmTracks,
                };
                return fetchData(spotify.search, body, transformResponse).then(
                    (fetchedTracks) => {
                        setCheckboxes(
                            convertSpotifyTracksToCheckboxesTable(fetchedTracks)
                        );
                    }
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
                title="User's Top Tracks LastFM Chart"
                text="Make Spotify playlist of your best music for different time
            periods. This mode is different in that you can dig deeper
            into your charts to find more rarely heard tracks by
            specifying page of charts."
            />

            <BaseForm
                formData={searchForm}
                onInputChange={handleSearchFormChange}
                onSubmit={handleSearchButtonClick}
                fields={fields}
            />
            {results}
        </>
    );
}
