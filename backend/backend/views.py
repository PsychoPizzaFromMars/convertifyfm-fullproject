from django.shortcuts import redirect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import (
    LastfmTopTracksSerializer,
    LastfmWeeklyChartsSerializer,
    SpotifyUserTopTracksSerializer,
)
from .api import LastFM_API, Spotify_API
from . import utils as ut
from .helpers import arr_split
from decouple import config


FRONTEND_URL = config("FRONTEND_URL")


unauthorized_response = Response(
    {
        "error": {
            "message": "User not logged in",
            "status_code": status.HTTP_401_UNAUTHORIZED,
        }
    },
    status=status.HTTP_401_UNAUTHORIZED,
)


def bad_request_response(error_details):
    return Response(
        {
            "error": {
                "message": "Invalid request",
                "status_code": status.HTTP_400_BAD_REQUEST,
                "details": error_details,
            }
        },
        status=status.HTTP_400_BAD_REQUEST,
    )


@api_view(["POST"])
def lastfm_get_top_tracks(request):
    serializer = LastfmTopTracksSerializer(data=request.data)
    if serializer.is_valid():
        response = LastFM_API.get_top_tracks(
            user_id=serializer.data.get("user_id"),
            period=serializer.data.get("period"),
            limit=serializer.data.get("limit"),
            page=serializer.data.get("page"),
        )
        if response:
            return Response(response)
    return bad_request_response(serializer.errors)


@api_view(["POST"])
def lastfm_get_weekly_top_tracks(request):
    serializer = LastfmWeeklyChartsSerializer(data=request.data)
    if serializer.is_valid():
        response = LastFM_API.get_weekly_trackchart(
            user_id=serializer.data.get("user_id"),
            date_from=serializer.data.get("date_from"),
            date_to=serializer.data.get("date_to"),
            limit=serializer.data.get("limit"),
        )
        return Response(response)
    return bad_request_response(serializer.errors)


@api_view(["GET"])
def spotify_login(request):
    return Response({"url": Spotify_API.request_auth()}, status=status.HTTP_200_OK)


@api_view(["GET"])
def spotify_callback(request):
    if not request.session.exists(request.session.session_key):
        request.session.create()
    code = request.GET.get("code", "")
    error = request.GET.get("error", "")

    if error:
        return bad_request_response(error)

    sp_tokens = Spotify_API.get_tokens(code)
    ut.update_or_create_user_tokens(
        session_id=request.session.session_key,
        access_token=sp_tokens.get("access_token", ""),
        token_type=sp_tokens.get("token_type", ""),
        expires_in=sp_tokens.get("expires_in", ""),
        refresh_token=sp_tokens.get("refresh_token", ""),
    )
    return redirect(FRONTEND_URL)


@api_view(["GET"])
def is_authenticated(request):
    is_authenticated = ut.is_spotify_authenticated(request.session.session_key)
    return Response({"status": is_authenticated}, status=status.HTTP_200_OK)


@api_view(["DELETE"])
def spotify_logout(request):
    user_session = request.session.session_key
    if not request.session.exists(user_session):
        return unauthorized_response
    user_deleted = ut.delete_user_tokens(user_session)
    if user_deleted:
        return Response({}, status=status.HTTP_204_NO_CONTENT)
    else:
        return unauthorized_response


@api_view(["GET"])
def spotify_get_current_user(request):
    user = ut.get_spotify_user(request)
    if not user:
        return unauthorized_response
    response = Spotify_API.get_current_user(access_token=user.access_token)
    return Response(response, status=status.HTTP_200_OK)


@api_view(["POST"])
def spotify_get_user_top_tracks(request):
    user = ut.get_spotify_user(request)
    if not user:
        return unauthorized_response
    serializer = SpotifyUserTopTracksSerializer(data=request.data)
    if not serializer.is_valid():
        return bad_request_response(serializer.errors)

    tracklist_spotify = [
        {
            "artist": ts["artists"][0]["name"],
            "name": ts["name"],
            "album_name": ts["album"]["name"],
            "album_cover_320": ts["album"]["images"][1]["url"],
            "album_cover_64": ts["album"]["images"][2]["url"],
            "uri": ts["uri"],
        }
        for ts in Spotify_API.get_users_top_tracks(
            access_token=user.access_token,
            time_range=serializer.data.get("time_range"),
            limit=serializer.data.get("limit"),
        )["items"]
    ]

    if not tracklist_spotify:
        return bad_request_response("Something went wrong")
    return Response({"tracks": tracklist_spotify}, status=status.HTTP_200_OK)


@api_view(["POST"])
def spotify_search(request):
    user = ut.get_spotify_user(request)
    if not user:
        return unauthorized_response
    tracklist_raw = request.data.get("tracklist")
    if not tracklist_raw:
        return bad_request_response("No tracks provided")
    tracklist_spotify = list()
    tracklist_missing = list()

    for track in tracklist_raw:
        try:
            ts = Spotify_API.search(access_token=user.access_token, query=track)[
                "tracks"
            ]["items"][0]

            tracklist_spotify.append(
                {
                    "artist": ts["artists"][0]["name"],
                    "name": ts["name"],
                    "album_name": ts["album"]["name"],
                    "album_cover_320": ts["album"]["images"][1]["url"],
                    "album_cover_64": ts["album"]["images"][2]["url"],
                    "uri": ts["uri"],
                }
            )
        except (IndexError, KeyError):
            tracklist_missing.append(track)
            continue
    return Response(
        {"tracks": tracklist_spotify, "missing": tracklist_missing},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def spotify_create_playlist(request):
    user = ut.get_spotify_user(request)
    if not user:
        return unauthorized_response
    if not request.data.get("tracks"):
        return bad_request_response("No tracks provided")

    playlist = Spotify_API.create_playlist(
        access_token=user.access_token,
        user_id=Spotify_API.get_current_user(user.access_token)["id"],
        name=request.data.get("playlist_name", "ConvertifyFM"),
        description=request.data.get(
            "playlist_desc", "Playlist generated by ConvertifyFM"
        ),
    )

    tracks_arr = arr_split(request.data.get("tracks"), 100)
    for arr_chunk in tracks_arr:
        response = Spotify_API.add_tracks(
            access_token=user.access_token,
            playlist_id=playlist["id"],
            uris=arr_chunk,
        )

    if "snapshot_id" in response:
        return Response(
            {"message": "Tracks successful added to playlist"},
            status=status.HTTP_200_OK,
        )
    error_details = (
        response.get("error").get("message")
        if response.get("error")
        else "Details not provided"
    )
    return bad_request_response(error_details)
