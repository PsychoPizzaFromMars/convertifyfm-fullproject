const filterTracks = (obj, predicate) =>
    Object.keys(obj)
        .filter((key) => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), {});

const convertToUnixDate = (date) =>
    (new Date(date).getTime() / 1000).toString();

const dateNow = () => {
    let _dateNow = new Date();
    return _dateNow.toISOString().split("T")[0];
};

const convertSpotifyTracksToCheckboxesTable = (fetchedTracks) => {
    return fetchedTracks
        .map((track) => track.uri)
        .reduce((o, key) => ({ ...o, [key]: true }), {});
};

const convertYMDtoDMY = (YMDdate) =>
    YMDdate.replace(/^^(\d{4})-(\d{2})-(\d{2})$/, "$3.$2.$1");

const transformResponse = (response) => {
    if (!response || !Array.isArray(response.tracks)) {
        return [];
    }

    return response.tracks.reduce((acc, trackGroup) => {
        if (
            Array.isArray(trackGroup.results) &&
            trackGroup.results.length > 0
        ) {
            acc.push(trackGroup.results[0]);
        }
        return acc;
    }, []);
};
export {
    convertSpotifyTracksToCheckboxesTable,
    convertToUnixDate,
    convertYMDtoDMY,
    dateNow,
    filterTracks,
    transformResponse,
};
