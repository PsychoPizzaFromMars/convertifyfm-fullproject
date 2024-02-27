import React from "react";
import { ResultsButtons } from "./ResultsButtons";
import { ResultsTracks } from "./ResultsTracks";

export function SearchResults({
    onCheckAll,
    onUncheckAll,
    onCheck,
    tracks,
    checkboxes,
}) {
    return (
        <div className="search-results">
            {" "}
            <ResultsButtons
                onCheckAll={onCheckAll}
                onUncheckAll={onUncheckAll}
            />
            <ResultsTracks
                onCheck={onCheck}
                tracks={tracks}
                checkboxes={checkboxes}
            />
        </div>
    );
}
