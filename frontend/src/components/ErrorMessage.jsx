import React from "react";

export function ErrorMessage({ error }) {
    return (
        <div className="error-message search-results">
            Error: {error.message || error}
        </div>
    );
}
