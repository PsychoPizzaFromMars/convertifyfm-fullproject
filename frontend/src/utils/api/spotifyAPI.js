import { makeRequest } from "../fetch";

export const spotify = {
    login: async () => {
        return makeRequest({
            endpoint: "/login",
        });
    },
    logout: async () => {
        return makeRequest({
            endpoint: "/logout",
            method: "DELETE",
        });
    },
    isAuthenticated: async () => {
        return makeRequest({
            endpoint: "/is-authenticated",
        });
    },
    search: async (body) => {
        return makeRequest({
            endpoint: "/spotify/search",
            method: "POST",
            body,
        });
    },
    getCurrentUser: async () => {
        return makeRequest({
            endpoint: "/spotify/current_user",
        });
    },
    getUserTopTracks: async (body) => {
        return makeRequest({
            method: "POST",
            endpoint: "/spotify/user_top_tracks",
            body,
        });
    },
    createPlaylist: async (body) => {
        return makeRequest({
            method: "POST",
            endpoint: "/spotify/playlist",
            body,
        });
    },
};
