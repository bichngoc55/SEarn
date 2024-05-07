const axios = require("axios");
const querystring = require("querystring");
const User = require("../models/User");

const checkAccessToken = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const accessToken = user.accessToken;
  const expirationTime = user.expirationTime;

  if (Date.now() < expirationTime - 60000) {
    req.accessToken = accessToken;
    next();
  } else {
    try {
      const tokenResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        querystring.stringify({
          grant_type: "refresh_token",
          refresh_token: process.env.REFRESH_TOKEN_SECRET,
          client_id: process.env.SPOTIFY_CLIENTID,
          client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const newAccessToken = tokenResponse.data.access_token;
      const expiresIn = tokenResponse.data.expires_in;

      const expirationTime = Date.now() + expiresIn * 1000;
      await User.findByIdAndUpdate(req.user._id, {
        accessToken: newAccessToken,
        expirationTime: expirationTime,
      });

      req.accessToken = newAccessToken;
      next();
    } catch (error) {
      console.error("Error refreshing access token:", error.message);
      res.status(500).send("Failed to refresh access token");
    }
  }
};

module.exports = checkAccessToken;
