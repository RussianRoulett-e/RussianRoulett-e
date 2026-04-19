const client_id = process.env.e3775a8b821d449f960ccbf7b09c935a;
const client_secret = process.env.eb3629c70e6042848358db9914476c01;
const refresh_token = process.env.AQAfWBa0w1waUmPPFz-25hjdkBVGmGasuOFlj5FtkF058ac4PcL8ALARbyoH8eLEKf1SlZePOQ1kCXfTrB9eFulT4wWVkpNgL1CM4TzuYpF1bxFd41AJ5N3Sx_LQaXCyFSU-S0aMHUGibOV4s2ifhO1YwD3SHMsPx42-jEmOaMIl5Zcmc6-e1e8Lj3N3YadByHooaTPacYXPvQu-ZcrAc;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";

async function getAccessToken() {
  return fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });
}

export default async function handler(req, res) {
  const response = await getAccessToken();
  const { access_token } = await response.json();

  const nowPlaying = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  const data = await nowPlaying.json();
  res.status(200).json(data);
      }
