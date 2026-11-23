/* The last step of signing in to the editor. /api/callback sends the sign-in window here with the result after the #,
   which never reaches a server or a log. This page hands it to the editor window that opened it, then closes. */
(() => {
  const p = new URLSearchParams(location.hash.slice(1)), token = p.get("token"), error = p.get("error");
  history.replaceState(null, "", location.pathname);
  const say = (t) => (document.getElementById("msg").textContent = t);
  if (!window.opener) return say(error || "Sign-in works from the editor. Open /admin and press the sign-in button there.");
  const result = token
    ? `authorization:github:success:${JSON.stringify({ token, provider: "github" })}`
    : `authorization:github:error:${JSON.stringify({ error: error || "Sign-in did not finish." })}`;
  /* the editor answers the first message, and only then gets the result; both windows must be on this site's address */
  addEventListener("message", (e) => {
    if (e.origin !== location.origin || e.data !== "authorizing:github") return;
    window.opener.postMessage(result, e.origin);
    say(token ? "Signed in. This window can be closed." : error || "Sign-in did not finish.");
  });
  window.opener.postMessage("authorizing:github", location.origin);
  if (error) say(error);
})();
