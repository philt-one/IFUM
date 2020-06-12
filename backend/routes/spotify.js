// Spotify API calls

const express = require("express")
const User = require("../models/user");
const querystring = require("querystring");
const request = require("request");
const spotifyRouter = express.Router();
const bcrypt = require("bcrypt");
var SpotifyWebApi = require('spotify-web-api-node');

const stateKey = "spotify_auth_state";


spotifyRouter.get("/get-user-tracks", (req, res, next) => {
    // Get tracks in the signed in user's Your Music library
    User.findOne({ _id: req.user._id }, (err, user) => {
        const spotifyApi = new SpotifyWebApi({
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
          });
        spotifyApi.setAccessToken(user.accessToken);
        spotifyApi.getMySavedTracks({
            limit : 50,
            offset: 0
        })
        .then(function(data) {
            // const total = data.body.total;
            // let totalUserTracks = [data.body];
            // const promises = [];
            // let index = 49;
            // while (index < total) {
            //     promises.push(
            //         spotifyApi.getMySavedTracks({
            //             limit : 50,
            //             offset: index
            //         }).then((data) => {
            //             totalUserTracks.push(data.body);
            //         }));
            //     index = index + 50;
            // }
            // Promise.all(promises).then(function(){
            //     console.log(totalUserTracks.length);
            //     res.send(totalUserTracks);
            // }).catch(error => {
            //     console.error(error)
            //     res.send(error);
            //   });
            res.send(data.body);
        }, function(err) {
            res.send(err);
        });
    });

});

spotifyRouter.get("/get-user-playlists", (req, res, next) => {
    // Get tracks in the signed in user's Your Music library
    User.findOne({ _id: req.user._id }, (err, user) => {
        if (err) {() => console.log(err)};
        const authOptions = {
            url: "https://api.spotify.com/v1/me/playlists",
            headers: {
                Authorization: "Bearer " + user.accessToken
            },
            json: true
        };
        request.get(authOptions, (error, response, body) => {
            if (!error) {
                delete body.href;
                delete body.next;
                delete body.previous;
                res.send(body);
            }
            else {
                res.send(error);
            }
        });
    });

});



// Endpoint to initialise user authorisation
spotifyRouter.get("/auth", function(req, res, next) {

    // When a request is received, the JWT is verified and return the
    // user information. We then encrypt the user._id to generate a
    // hash using bcrypt. We will use that hash as a state in our 
    // OAuth2.0 call.
    // When the client is redirected to redirect_uri after giving 
    // authorisation, an AJAX call is made to the backend endpoint /callback.
    // The request will need to provide a JWT. The state value (hash)
    // returned by Spotify will be compared to the user._id to validate
    // the request.

    // Define the scope of authorisation you need
    const scope =
        "playlist-read-private user-library-read user-read-recently-played user-read-private user-read-email user-read-playback-state user-top-read";
    
    // Generate a hash with the user._id
    bcrypt.hash(req.user._id, 10, (err, hash) => {
        // Error Handling
        if (err) return next(err);
        
        // Store the hash as a cookie
        const state = hash;
        res.cookie(stateKey, state);

        // Return URL
        const redirectUrl =
            "https://accounts.spotify.com/authorize?" +
            querystring.stringify({
                response_type: "code",
                client_id: process.env.CLIENT_ID,
                scope,
                redirect_uri: process.env.REDIRECT_URI_AUTHORISE,
                state
            });
        res.send(redirectUrl);
    });
});

// Endpoint to manage callback from authorisation
spotifyRouter.post("/auth-callback", function (req, res, next) {

    const code = req.body.code || null;
    const state = req.body.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
    
    // Return 403 if state doesn't match cookie
    if (state === null || state !== storedState) {
        res.status(401).send();
    } else {
        // Compare the hash to the user._id
        bcrypt.compare(req.user._id, state, (error, isMatch) => {
            if (error) {
                next(error);
            }
            // Clear cookie in the client
            res.clearCookie(stateKey);


            // We will now exchange the code received in the first step
            // for an access & refresh token.
            const authOptions = {
                url: "https://accounts.spotify.com/api/token",
                form: {
                    code: code,
                    redirect_uri: process.env.REDIRECT_URI_AUTHORISE,
                    grant_type: "authorization_code"
                },
                headers: {
                    Authorization: "Basic " +
                        new Buffer.from(
                            process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
                        ).toString("base64")
                },
                json: true
            };
            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    const access_token = body.access_token;
                    const refresh_token = body.refresh_token;

                    // Match the user._id to a document in the database and
                    // store the tokens in the user document
                    //
                    // TODO:
                    // - Encrypt token
                    // 
                    User.findOneAndUpdate(
                        { _id: req.user._id },
                        { 
                            refreshToken: refresh_token,
                            accessToken: access_token
                         },
                        {upsert: true},
                        (err, user) => {
                                if (err) return res.send(500, {error: err});
                    });
                    const options = {
                        url: "https://api.spotify.com/v1/me",
                        headers: {
                            Authorization: "Bearer " + access_token
                        },
                        json: true
                    };

                    // use the access token to access the Spotify Web API
                    request.get(options, function (error, response, body) {
                        console.log(body);
                    });

                    // we can also pass the token to the browser to make requests from there
                    res.status(200).send()
                } else {
                    res.send(error);
                }
            });
        });
    }
});

module.exports = spotifyRouter;