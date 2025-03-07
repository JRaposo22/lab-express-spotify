require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


// require spotify-web-api-node package here:


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:
app.get('/', (req, res) => {

    res.render('home')

})

app.get('/artist-search',(req, res)  =>  {

  let {artist} = req.query
  spotifyApi
  .searchArtists(artist)
  .then(data => {
    //console.log('The received data from the API: ', data.body);
    
    let artistData = data.body.artists.items;
    //console.log(artistData[0].images)
    // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
   
    res.render('artist-search-results', {artistData})
})
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', (req, res) => {
    let id = req.params.id;

    spotifyApi.getArtistAlbums(id)
    .then(data => {
        let albumData = data.body.items
        console.log(albumData[0].artists[0].name)
        res.render('albums', {albumData});
    })
    .catch(err => console.log(err));
     
})

app.get('/tracks/:id', async (req, res) => {

    
    let id = req.params.id;
    try {
        let tracksData = await spotifyApi.getAlbumTracks(id);
        //console.log(tracksData);
        res.render('tracks', {albumTracks: tracksData.body.items});
    } catch (error) {
        console.log(error)
    }
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
