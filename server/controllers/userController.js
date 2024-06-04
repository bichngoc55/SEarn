import request from "request";

const clientId = "4c8a2aaf84f14c8f85b3ca3b236c540a";
const clientSecret = "1e6a3fc7faa84c31b14feec91cd34bca";

let accessToken = null;
let expiresAt = null;

const refreshAccessToken = () => {
  console.log("Refreshing access token...");
  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer.from(clientId + ":" + clientSecret).toString("base64"),
    },
    form: {
      grant_type: "client_credentials",
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      accessToken = body.access_token;
      expiresAt = Date.now() + body.expires_in * 1000;
      const refreshInterval = (body.expires_in - 60) * 1000;
      console.log("Next refresh in", refreshInterval / 1000, "seconds");
      setTimeout(refreshAccessToken, refreshInterval);
    } else {
      console.error("Error refreshing access token:", error);
    }
  });
};

export const getAccessToken = async (req, res) => {
  if (accessToken && expiresAt && Date.now() < expiresAt) {
    return res.json({
      accessToken,
      expires_in: (expiresAt - Date.now()) / 1000,
    });
  } else {
    refreshAccessToken();
    console.log("access token cho ba noi spotìy : " + accessToken);
    return res.json({
      accessToken,
      expires_in: (expiresAt - Date.now()) / 1000,
    });
  }
};

refreshAccessToken();
