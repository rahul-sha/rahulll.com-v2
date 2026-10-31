/* Weather for the visitor's town, for the bar chip and the control centre.
   Vercel adds the visitor's approximate place (from their IP address) to each request as headers,
   so the browser never asks for location. Open-Meteo gives the reading; it needs no key.
   Locally (npm run build) there is no /api, and the desk falls back to "Weather". */
const CODES = [
  [[0], "Clear"], [[1], "Mostly clear"], [[2], "Partly cloudy"], [[3], "Cloudy"], [[45, 48], "Fog"],
  [[51, 53, 55, 56, 57], "Drizzle"], [[61, 63, 65, 66, 67, 80, 81, 82], "Rain"], [[71, 73, 75, 77, 85, 86], "Snow"], [[95, 96, 99], "Thunder"],
];
const sky = (c) => (CODES.find(([cs]) => cs.includes(c)) || [0, "Weather"])[1];

module.exports = async (req, res) => {
  const h = req.headers, lat = parseFloat(h["x-vercel-ip-latitude"]), lon = parseFloat(h["x-vercel-ip-longitude"]);
  let city = "";
  try { city = decodeURIComponent(h["x-vercel-ip-city"] || ""); } catch (_) {}
  res.setHeader("Cache-Control", "private, max-age=900");
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return res.status(204).end();
  /* Fahrenheit only where people use it day to day */
  const f = ["US", "LR", "MM", "BS", "BZ", "KY", "PW"].includes(h["x-vercel-ip-country"]);
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(2)}&longitude=${lon.toFixed(2)}&current=temperature_2m,weather_code,is_day&hourly=temperature_2m&forecast_hours=12&timezone=auto${f ? "&temperature_unit=fahrenheit" : ""}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!r.ok) throw new Error("open-meteo " + r.status);
    const d = await r.json();
    res.status(200).json({
      city: city.slice(0, 40),
      unit: f ? "°F" : "°C",
      temp: Math.round(d.current.temperature_2m * 10) / 10,
      sky: sky(d.current.weather_code),
      day: !!d.current.is_day,
      next: (d.hourly.temperature_2m || []).slice(0, 12).map((t) => Math.round(t * 10) / 10),
    });
  } catch (e) {
    res.status(502).json({ error: "weather unavailable" });
  }
};
