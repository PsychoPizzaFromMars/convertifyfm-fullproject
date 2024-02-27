import React from "react";
import arrowDown from "../images/arrow-down-solid.svg";
import arrowUp from "../images/arrow-up-solid.svg";

export function ScrollButtons() {
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
    return (
        <div className="buttonsScroll-container">
            <button id="scroll-up" onClick={handleScrollUp}>
                <img src={arrowUp} alt="" />
            </button>
            <button id="scroll-down" onClick={handleScrollBottom}>
                <img src={arrowDown} alt="" />
            </button>
        </div>
    );
}
