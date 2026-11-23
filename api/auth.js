/* Step 1 of signing in to the editor at /admin: send the sign-in window to GitHub.
   The editor opens this address in a small window. GITHUB_CLIENT_ID comes from the GitHub OAuth app, and is set
   in Vercel's environment variables (never in this repository). Step 2 is api/callback.js. */
const crypto = require("crypto");

module.exports = (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const id = process.env.GITHUB_CLIENT_ID;
  const back = (error) => res.redirect(302, "/admin/done#" + new URLSearchParams({ error }));
  if (!id || !process.env.GITHUB_CLIENT_SECRET) return back("Sign-in is not set up yet: GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are missing in Vercel.");
  if ((req.query.provider || "github") !== "github") return back("Only GitHub sign-in is supported.");
  /* a one-time value GitHub hands back, so a sign-in someone else started cannot be finished here */
  const state = crypto.randomBytes(16).toString("hex");
  res.setHeader("Set-Cookie", `cms_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=600`);
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  res.redirect(302, "https://github.com/login/oauth/authorize?" + new URLSearchParams({ client_id: id, scope: "repo,user", state, redirect_uri: `https://${host}/api/callback` }));
};
