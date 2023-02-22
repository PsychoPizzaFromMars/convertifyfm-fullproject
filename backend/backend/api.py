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
    def __init__(self) -> None:
        self.LASTFM_API_URL = "http://ws.audioscrobbler.com/2.0/"
        self.LASTFM_API_KEY = config("LASTFM_API_KEY")

        self.headers = {
            "User-Agent": "ConvertifyFM",
            "From": "teenagesatanworshipper13@gmail.com",
        }

    def get_top_tracks(
        self, user_id="androw-go-go", period="overall", limit="1000", page="1"
    ):
        params = {
            "method": "user.gettoptracks",
            "user": user_id,
            "period": period,  # overall/7day/1month/3month/6month/12month
            "limit": limit,  # min=50, max=1000
            "page": page,  # default=1
            "api_key": self.LASTFM_API_KEY,
            "format": "json",
        }

        response = get(self.LASTFM_API_URL, params=params, headers=self.headers).json()
        toptracks_list = [
            f"{elem['artist']['name']} - {elem['name']}"
            for elem in response["toptracks"]["track"]
        ]
        return toptracks_list

    def get_weekly_trackchart(
        self,
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
            "api_key": self.LASTFM_API_KEY,
            "format": "json",
        }
        response = get(self.LASTFM_API_URL, params=params, headers=self.headers).json()
        if "error" in response:
            return []
        tracklist = [
            f"{elem['artist']['#text']} - {elem['name']}"
            for elem in response["weeklytrackchart"]["track"]
        ]
        return tracklist


class Spotify_API:
    def __init__(self):
        self.SP_CLIENT_ID = config("SP_CLIENT_ID")
        self.SP_CLIENT_SECRET = config("SP_CLIENT_SECRET")
        self.API_URL = "https://api.spotify.com/v1/"
        self.AUTH_URL = "https://accounts.spotify.com/authorize"
        self.redirect_uri = config("SP_REDIRECT_URL")

    def _url(self, endpoint):
        return self.API_URL + endpoint

    def request_auth(self):
        params = {
            "client_id": self.SP_CLIENT_ID,
            "response_type": "code",
            "redirect_uri": self.redirect_uri,
            "scope": "user-read-email user-library-read playlist-read-private user-top-read playlist-modify-private playlist-modify-public",
        }
        return f"{self.AUTH_URL}?{urlencode(params)}"

    def get_tokens(self, code):
        precodedclient = self.SP_CLIENT_ID + ":" + self.SP_CLIENT_SECRET
        auth_header = base64.standard_b64encode(str(precodedclient).encode()).decode()
        header = {"Authorization": f"Basic {auth_header}"}
        body = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": self.redirect_uri,
        }
        url = "https://accounts.spotify.com/api/token"
        response = post(url, headers=header, data=body)
        return response.json()

    def refresh_access_token(self, refresh_token):
        precodedclient = self.SP_CLIENT_ID + ":" + self.SP_CLIENT_SECRET
        auth_header = base64.standard_b64encode(str(precodedclient).encode()).decode()
        header = {"Authorization": f"Basic {auth_header}"}
        body = {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
        }
        url = "https://accounts.spotify.com/api/token"
        response = post(url, headers=header, data=body)
        return response.json()

    def get_current_user(self, access_token):
        endpoint = "me"
        url = self._url(endpoint)
        response = get(url, headers={"Authorization": f"Bearer {access_token}"})
        return response.json()

    def get_users_top_tracks(
        self, access_token, type="tracks", time_range="medium_term", limit=10, offset=0
    ):
        endpoint = f"me/top/{type}"
        url = self._url(endpoint)
        params = {"limit": limit, "offset": offset, "time_range": time_range}
        response = get(
            url, headers={"Authorization": f"Bearer {access_token}"}, params=params
        )
        return response.json()

    def create_playlist(self, access_token, user_id, name, description, public=False):
        endpoint = f"users/{user_id}/playlists"
        url = self._url(endpoint)
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

    def add_tracks(self, access_token, playlist_id, uris):
        endpoint = f"playlists/{playlist_id}/tracks"
        url = self._url(endpoint)
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

    def search(self, access_token, query, type="track", limit=5, offset=0):
        endpoint = "search"
        url = self._url(endpoint)
        params = {"q": query, "type": type, "limit": limit, "offset": offset}
        response = get(
            url, headers={"Authorization": f"Bearer {access_token}"}, params=params
        )
        return response.json()
