/* Step 2 of signing in to the editor: GitHub sends the sign-in window back here with a one-time code.
   This swaps the code for an access token, using GITHUB_CLIENT_SECRET from Vercel's environment variables,
   and passes the token to /admin/done after the #, where only the browser sees it. Nothing is stored here. */
module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const done = (o) => res.redirect(302, "/admin/done#" + new URLSearchParams(o));
  const { code, state, error_description: denied } = req.query;
  const cookie = ((req.headers.cookie || "").match(/(?:^|;\s*)cms_state=([a-f0-9]{32})/) || [])[1];
  res.setHeader("Set-Cookie", "cms_state=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0");
  if (denied) return done({ error: String(denied).slice(0, 200) });
  if (!code || !state || !cookie || state !== cookie) return done({ error: "Sign-in expired or did not start from the editor. Please try again." });
  try {
    const r = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, signal: AbortSignal.timeout(8000),
      body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code }),
    });
    const d = await r.json();
    if (!d.access_token) return done({ error: String(d.error_description || "GitHub did not return a token.").slice(0, 200) });
    done({ token: d.access_token });
  } catch (_) { done({ error: "Could not reach GitHub. Please try again." }); }
};
