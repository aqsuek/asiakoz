const COOKIE = "asiakoz_admin";

function expectedPassword() {
  return process.env.ADMIN_PASSWORD || "asiakoz";
}

function isAuthed(req) {
  const cookie = req.headers.cookie || "";
  return cookie.split(";").some((part) => part.trim() === `${COOKIE}=1`);
}

function loginHeaders() {
  return {
    "Set-Cookie": `${COOKIE}=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
  };
}

function logoutHeaders() {
  return {
    "Set-Cookie": `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  };
}

module.exports = { expectedPassword, isAuthed, loginHeaders, logoutHeaders };
