const User = require("./models/user");
const request = require("request");


const refreshAccessToken = (req) => {
    User.findOne({ _id: req.user._id }, (error, user) => {
        if (error) throw new Error(error);
        const refreshOptions = {
            url: "https://accounts.spotify.com/api/token",
            form: {
                grant_type: "refresh_token",
                refresh_token: user.refreshToken
            },
            headers: {
                Authorization: "Basic " +
                    new Buffer.from(
                        process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
                    ).toString("base64")
            },
            json: true
        };

        request.post(refreshOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const access_token = body.access_token;
                User.findOneAndUpdate(
                    { _id: user._id },
                    { 
                        accessToken: access_token
                     },
                    {upsert: true},
                    (err, user) => {
                            if (err) return res.send(500, {error: err});
                });
            }
            else {
                res.send(error);
            }

        });
    })
};