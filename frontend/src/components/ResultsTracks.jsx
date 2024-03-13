import React from "react";
import TrackCard from "./TrackCard";

export function ResultsTracks({ tracks, onCheck, checkboxes }) {
    return tracks?.map(function (track) {
        return (
            <TrackCard
                key={track.uri}
                track={track}
                onChange={onCheck}
                checked={checkboxes[track.uri]}
            />
        );
    });
}
