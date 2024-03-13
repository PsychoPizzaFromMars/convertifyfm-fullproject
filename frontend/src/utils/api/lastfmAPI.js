import { makeRequest } from "../fetch";

export const lastFM = {
    getTopTracks: async (body) => {
        return makeRequest({
            endpoint: "/lastfm/user_top_tracks",
            body,
            method: "POST",
        });
    },
    getWeeklyTrackchart: async (body) => {
        return makeRequest({
            endpoint: "/lastfm/user_weekly_charts",
            body,
            method: "POST",
        });
    },
};
