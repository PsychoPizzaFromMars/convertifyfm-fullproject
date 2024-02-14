def arr_split(arr, chunk_size):
    chunked_list = list()
    for i in range(0, len(arr), chunk_size):
        chunked_list.append(arr[i : i + chunk_size])
    return chunked_list


def formatted_spotify_track(track):
    return {
        "artist": track["artists"][0]["name"],
        "name": track["name"],
        "album_name": track["album"]["name"],
        "album_cover_320": track["album"]["images"][1]["url"],
        "album_cover_64": track["album"]["images"][2]["url"],
        "uri": track["uri"],
    }


def formatted_lastfm_weekly_chart(response):
    return [
        {
            "full_name": f"{elem['artist']['#text']} - {elem['name']}",
            "artist": elem["artist"]["#text"],
            "name": elem["name"],
        }
        for elem in response["weeklytrackchart"]["track"]
    ]


def formatted_lastfm_top_tracks(response):
    return [
        {
            "full_name": f"{elem['artist']['name']} - {elem['name']}",
            "artist": elem["artist"]["name"],
            "name": elem["name"],
        }
        for elem in response["toptracks"]["track"]
    ]
