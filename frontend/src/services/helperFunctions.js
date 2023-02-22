const filterTracks = (obj, predicate) => 
    Object.keys(obj)
    .filter(key => predicate(obj[key]))
    .reduce((res, key) => (res[key] = obj[key], res), {});

const convertToUnixDate = (date) => 
    (new Date(date).getTime() / 1000).toString()

    export { filterTracks, convertToUnixDate }