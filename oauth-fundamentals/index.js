import express from "express";
import "dotenv/config";
import axios from "axios";

const app = express();

let name, email;

app.get("/auth/github", (_, res) => {
  const redirectUri = "http://localhost:3000/auth/github/callback";
  const clientId = process.env.GITHUB_CLIENT_ID;

  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

  res.redirect(url);
});

app.get("/auth/github/callback", async (req, res) => {
  const code = req.query.code;
  const client_id = process.env.GITHUB_CLIENT_ID;
  const client_secret = process.env.GITHUB_CLIENT_SECRET;

  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id,
      client_secret,
      code,
    },
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  const accessToken = tokenRes.data.access_token;

  const userRes = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const emailRes = await axios.get("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  name = userRes.data.name;
  email = emailRes.data.find((e) => e.primary && e.verified)?.email;

  console.log(name, email);

  res.redirect("http://localhost:3000");
});

app.get("/", (req, res) => {
  res.json({ name: name, email: email });
});

app.listen(3000);
