import { React } from "react";
import { spotify } from "../utils/api/spotifyAPI";
import { filterTracks } from "../utils/helpers";

function PlaylistForm({ onInputChange, formData, checkboxes }) {
    const handleSubmitPlaylist = (e) => {
        e.preventDefault();
        const selectedTracks = filterTracks(
            checkboxes,
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

        spotify
            .createPlaylist(body)
            .then(() => {
                window.location.reload(false);
            })
            .catch((error) => {
                throw error;
            });
    };
    return (
        <div className="form-container">
            <form
                id="playlist-submit-form"
                className="border-comic"
                onSubmit={(e) => handleSubmitPlaylist(e)}
            >
                <p>Playlist name</p>
                <div className="row-container">
                    <input
                        type="text"
                        name="playlistName"
                        id=""
                        value={formData.playlistName}
                        onChange={onInputChange}
                        required
                    />
                </div>
                <p>Description</p>
                <div className="row-container">
                    <input
                        type="text"
                        name="playlistDesc"
                        id=""
                        value={formData.playlistDesc}
                        onChange={onInputChange}
                        required
                    />
                </div>
                <button type="submit" id="submit-playlist">
                    Create Playlist
                </button>
            </form>
        </div>
    );
}

export default PlaylistForm;
