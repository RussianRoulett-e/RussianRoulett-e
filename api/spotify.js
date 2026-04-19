const client_id = process.env.e3775a8b821d449f960ccbf7b09c935a;
const client_secret = process.env.e3775a8b821d449f960ccbf7b09c935a;
const refresh_token = process.env.AQBJeDKRZgbZHY4bkOiatkbrGRRFSlbomdzCA9gQQKbkSWsZQfiLOAIPow4-WjPh71nHsiSyL4VPzWOCuqyj5Md0my_14Q49NWpaA79gXTz8Ox5RO1keCqMWPFN2VWheiKU;

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

  if (nowPlaying.status === 204 || nowPlaying.status > 400) {
    res.setHeader("Content-Type", "image/svg+xml");
    return res.send(`<svg width="400" height="120">
      <text x="10" y="60" fill="gray">Not playing anything</text>
    </svg>`);
  }

  const song = await nowPlaying.json();

  const title = song.item.name;
  const artist = song.item.artists.map(a => a.name).join(", ");
  const cover = song.item.album.images[0].url;

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(`
  <svg width="500" height="150" xmlns="http://www.w3.org/2000/svg">
    <style>
      .title { fill: #800000; font-size: 16px; font-weight: bold; }
      .artist { fill: #ccc; font-size: 14px; }
    </style>

    <!-- Cover -->
    <image href="${cover}" x="10" y="10" height="130" width="130"/>

    <!-- Text -->
    <text x="160" y="60" class="title">${title}</text>
    <text x="160" y="90" class="artist">${artist}</text>
  </svg>
  `);
    }
