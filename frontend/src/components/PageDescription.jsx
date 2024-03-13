import React from "react";

export function PageDescription({ title, text }) {
    return (
        <div className="use-description">
            <h1>{title}</h1>
            <p style={{ maxWidth: "450px", margin: "0 auto" }}>{text}</p>
        </div>
    );
}
