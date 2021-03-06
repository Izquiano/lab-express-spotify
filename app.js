require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
var SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

// Our routes go here:
hbs.registerPartials(__dirname + "/views/partials");

app.get("/", (req, res) => res.render(__dirname + "/views/home.hbs"));

app.get("/artists", (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then((data) => {
      const arrayArtists = data.body.artists.items;
      res.render(__dirname + "/views/artist-search-results.hbs", {
        arrayArtists,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
   spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then((data) => {
      const albumsData = data.body.items;
      res.render(__dirname + "/views/albums.hbs", { albumsData });
      
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/tracks/:artistId", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.artistId)
    .then((data) => {
      const tracksData = data.body.items;
      res.render(__dirname + "/views/tracks.hbs", { tracksData });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
