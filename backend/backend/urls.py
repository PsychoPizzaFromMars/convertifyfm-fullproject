from django.urls import path
from . import views

urlpatterns = [
    path('login', views.spotify_login, name='spotify-login'),
    path('callback', views.spotify_callback, name='spotify-callback'),
    path('is-authenticated', views.is_authenticated,
         name='spotify-authenticated'),
    path('logout', views.spotify_logout, name='spotify-logout'),

    # Spotify API
    path('spotify/user_top_tracks', views.spotify_get_user_top_tracks,
         name='spotify-get-top-tracks'),
    path('spotify/current_user', views.spotify_get_current_user,
         name='spotify-get-current-user'),
    path('spotify/playlist', views.spotify_create_playlist,
         name='spotify-create-playlist'),
    path('spotify/search', views.spotify_search, name='spotify-search'),

    # LastFM API
    path('lastfm/user_top_tracks', views.lastfm_get_top_tracks,
         name='lastfm-user-top-tracks'),
    path('lastfm/user_weekly_charts', views.lastfm_get_weekly_top_tracks,
         name='lastfm-user-weekly-trackchart'),

]
