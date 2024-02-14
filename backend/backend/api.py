from requests import get, post
import json
from decouple import config
from urllib.parse import urlencode
import base64
import datetime


def _unixtimestamp_now():
    presentDate = datetime.datetime.now()
    unix_timestamp = int(datetime.datetime.timestamp(presentDate))
    return unix_timestamp


class LastFM_API:
    LASTFM_API_URL = "http://ws.audioscrobbler.com/2.0/"
    LASTFM_API_KEY = config("LASTFM_API_KEY")

    headers = {
        "User-Agent": "ConvertifyFM",
        "From": "convertifyfm@gmail.com",
    }

    @classmethod
    def get_top_tracks(
        cls, user_id="androw-go-go", period="overall", limit="1000", page="1"
    ):
        params = {
            "method": "user.gettoptracks",
            "user": user_id,
            "period": period,  # overall/7day/1month/3month/6month/12month
            "limit": limit,  # min=50, max=1000
            "page": page,  # default=1
            "api_key": cls.LASTFM_API_KEY,
            "format": "json",
        }

        response = get(cls.LASTFM_API_URL, params=params, headers=cls.headers)
        return response.json()

    @classmethod
    def get_weekly_trackchart(
        cls,
        user_id="androw-go-go",
        date_from=946674000,
        date_to=int(_unixtimestamp_now()),
        limit="200",
        page="1",
    ):
        params = {
            "method": "user.getWeeklyTrackChart",
            "user": user_id,
            "from": date_from,
            "to": date_to,
            "limit": limit,  # min=50, max=200
            "page": page,  # default=1
            "api_key": cls.LASTFM_API_KEY,
            "format": "json",
        }
        response = get(cls.LASTFM_API_URL, params=params, headers=cls.headers)
        return response.json()


class Spotify_API:
    SP_CLIENT_ID = config("SP_CLIENT_ID")
    SP_CLIENT_SECRET = config("SP_CLIENT_SECRET")
    API_URL = "https://api.spotify.com/v1/"
    AUTH_URL = "https://accounts.spotify.com/authorize"
    redirect_uri = config("SP_REDIRECT_URL")

    @classmethod
    def _url(cls, endpoint):
        return cls.API_URL + endpoint

    @classmethod
    def request_auth(cls):
        params = {
            "client_id": cls.SP_CLIENT_ID,
            "response_type": "code",
            "redirect_uri": cls.redirect_uri,
            "scope": "user-read-email user-library-read playlist-read-private user-top-read playlist-modify-private playlist-modify-public",
        }
        return f"{cls.AUTH_URL}?{urlencode(params)}"

    @classmethod
    def get_tokens(cls, code):
        precodedclient = cls.SP_CLIENT_ID + ":" + cls.SP_CLIENT_SECRET
        auth_header = base64.standard_b64encode(str(precodedclient).encode()).decode()
        header = {"Authorization": f"Basic {auth_header}"}
        body = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": cls.redirect_uri,
        }
        url = "https://accounts.spotify.com/api/token"
        response = post(url, headers=header, data=body)
        return response.json()

    @classmethod
    def refresh_access_token(cls, refresh_token):
        precodedclient = cls.SP_CLIENT_ID + ":" + cls.SP_CLIENT_SECRET
        auth_header = base64.standard_b64encode(str(precodedclient).encode()).decode()
        header = {"Authorization": f"Basic {auth_header}"}
        body = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
        }
        url = "https://accounts.spotify.com/api/token"
        response = post(url, headers=header, data=body)
        return response.json()

    @classmethod
    def get_current_user(cls, access_token):
        endpoint = "me"
        url = cls._url(endpoint)
        response = get(url, headers={"Authorization": f"Bearer {access_token}"})
        return response.json()

    @classmethod
    def get_users_top_tracks(
        cls, access_token, type="tracks", time_range="medium_term", limit=10, offset=0
    ):
        endpoint = f"me/top/{type}"
        url = cls._url(endpoint)
        params = {"limit": limit, "offset": offset, "time_range": time_range}
        response = get(
            url, headers={"Authorization": f"Bearer {access_token}"}, params=params
        )
        return response.json()

    @classmethod
    def create_playlist(cls, access_token, user_id, name, description, public=False):
        endpoint = f"users/{user_id}/playlists"
        url = cls._url(endpoint)
        request_body = json.dumps(
            {"name": name, "description": description, "public": public}
        )
        response = post(
            url,
            data=request_body,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
        )
        return response.json()

    @classmethod
    def add_tracks(cls, access_token, playlist_id, uris):
        endpoint = f"playlists/{playlist_id}/tracks"
        url = cls._url(endpoint)
        request_body = json.dumps({"uris": uris})
        response = post(
            url,
            data=request_body,
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json",
            },
        )
        return response.json()

    @classmethod
    def search(cls, access_token, query, type="track", limit=5, offset=0):
        endpoint = "search"
        url = cls._url(endpoint)
        params = {"q": query, "type": type, "limit": limit, "offset": offset}
        response = get(
            url, headers={"Authorization": f"Bearer {access_token}"}, params=params
        )
        return response.json()


