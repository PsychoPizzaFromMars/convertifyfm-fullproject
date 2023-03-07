# ConvertifyFM ([CS50W Final Project](https://cs50.harvard.edu/web/2020/projects/final/capstone/))
## Table of Contents
- [Description](#Description)  
    - [Idea](#Idea)
    - [Features](#Features)
    - [Technologies stack](#Technologies-stack)
- [Distinctiveness and Complexity](#Distinctiveness-and-Complexity)  
- [Usage](#Usage)  
    - [Setting up the environment](#setting-up-the-environment)
    - [Getting started with web app](#getting-started-with-web-app)
- [Code Tour](#Code-Tour)
- [Live Demo](#Live-Demo)
    - [Issues](#issues)

# Description
## Idea
The ConvertifyFM project was created out of a love for music and a constant desire to rediscover past favorites. Its purpose is to convert music playlists between various services, with LastFM and Spotify being the current options.

## Features
At current state app can create custom Spotify playlists from following sources:
- Any specified LastFM user's top charts
- Any specified LastFM user's time period charts
- Spotify user's personal top tracks
- Comma or newline separated text strings 

Users can choose which of found tracks to use in playlist, edit playlist's name and description.  
There are additional navigation buttons on right side of results page for quick long tracklists navigation.

## Technologies stack
Django REST Framework and React were chosen for the backend and frontend, respectively, due to their popularity and the methodology of separating data/business logic and interface ([Jamstack](https://jamstack.org/)).

Django DRF is an efficient way to assemble business logic, which can be reused as third-party APIs in other projects.

React is one of the most popular ways to create interactive interfaces. The main factors in choosing it were the presence of a large community, its prospects and flexibility.

# Distinctiveness and Complexity

Converting music playlists between different services requires interaction between their APIs. To accomplish this, I use Django REST Framework to construct a proxy API that makes requests to these services and then restructures responses to pass them to the client.

The app uses OAuth to authorize users through their Spotify accounts. Specifically, the Authorization Code Flow method is utilized to automatically log in users and keep their credentials up to date.

The client part of webapp is hosted on an individual server using React as a Single Page Application. For cross-domain requests to work, CORS HTTP-headers are set up.

Adaptive styles are written without any bootstrap libraries for study purposes.


# Usage 
## Setting up the environment
1. Create new app in [Spotify](https://developer.spotify.com/) and new API account in [LastFM](https://www.last.fm/api)

2. Create .env file in ./backend and populate with your credentials and parameters:
```
    LASTFM_API_KEY = Your_Lastfm_API_Key
    SP_CLIENT_ID = Your_Spotify_API_Client_ID
    SP_CLIENT_SECRET = Your_Spotify_API_Client_Secret
    SP_REDIRECT_URL = http://localhost:8000/callback
    FRONTEND_URL = http://localhost:3000
```
3. Run backend using **Poetry** dependency manager:
```
    cd ./backend  
    poetry install
    poetry run python manage.py collectstatic --no-input
    poetry run python manage.py migrate
    poetry run python manage.py runserver   // http://127.0.0.1:8000 or localhost:8000
```
or using **pip** in your virtual environment:
```
    cd ./backend  
    pip install --upgrade pip
    pip install -r requirements.txt
    python manage.py collectstatic --no-input
    python manage.py migrate
    python manage.py runserver      // http://127.0.0.1:8000 or localhost:8000
```
4. Start frontend:
```
    cd ./frontend
    npm start       // http://127.0.0.1:3000 or localhost:3000
```
## Getting started with web app
1. Browse to `localhost:3000` or `http://127.0.0.1:3000`
2. Click "Login" button and proceed with your Spotify credentials.
3. After redirection to Home page you can use all features, listed in sidemenu.
# Code Tour
## Backend
`backend/api.py` - classes for calling Spotify and LastFM APIs  
`backend/serializers.py` -  serializers for validating requests before sending  
`backend/services.py` - helper function for dividing arrays into smaller chunks to meet API requests requirements
`backend/utils.py` - helper functions to work with SpotifyToken model  
`backend/models.py` - SpotifyToken model for saving Spotify credentials for session  
`backend/views.py` - API endpoints   
`backend/urls.py` - API endpoints' routing   


## Frontend
`src/components/SubmitPlaylistForm.js` - react-component of form to edit playlist parameters and submit data  
`src/components/TrackCard.js` - react-component that shows track data and allows to add or remove it from current playlist  
`src/components/TrackCard.css` - styles for TrackCard component  

`src/images/` - icons  

`src/pages/` - markup, elements' logics and API requests for app's pages
`src/pages/NotFound.jsx` - page for 404 error  
`src/pages/Lastfm/TimePeriodChart.jsx` - page of LastFM user's time period charts feature  
`src/pages/Lastfm/TopTracks.jsx` - page of LastFM user's top tracks feature  
`src/pages/Spotify/Home.jsx` - homepage with Spotify login prompt  
`src/pages/Spotify/TextConverter.jsx` - page of Text to Spotify tracks converter feature  
`src/pages/Spotify/TopTracks.jsx` - page of Spotify user's top tracks feature  

`src/services/fetchData.js` - boilerplate function for requests to API  
`src/services/helperFunctions.js` - helper functions for data manipulation  

`src/App.js` - main react-component with navigation and states common for all pages; gathers pages in react-router    
`src/App.css` - general styles for app  
`src/index.js` - mounts App component into index.html



# [Live Demo](https://convertifyfm.onrender.com)

Production version is deployed on [Render](https://render.com) with Gunicorn and PostgreSQL.  
## Issues
There are some problems with connection speed due to free hosting plan.  
Also you have to enable 3rd party cookies in some browsers to be authorized properly.

## [Watch ConvertifyFM's demo video](https://youtu.be/EKwSif9rP0A)
