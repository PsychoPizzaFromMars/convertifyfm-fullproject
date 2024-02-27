import React from "react";

export function ResultsButtons({ onCheckAll, onUncheckAll }) {
    const handleScrollBottom = () => {
        window.scroll({
            top: document.body.offsetHeight,
            left: 0,
            behavior: "smooth",
        });
    };

    return (
        <div className="buttonsContainer">
            <button onClick={onCheckAll}>Check All</button>
            <button onClick={onUncheckAll}>Uncheck All</button>
            <button onClick={handleScrollBottom}>Submit Tracks</button>
        </div>
    );
}
