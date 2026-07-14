// Reads the backend URL from Vite's env system. Set in .env.development
// for local work, .env.production for the built app, and — importantly —
// as an actual environment variable in Render's dashboard for the
// deployed frontend, since Vite bakes this in at BUILD time, not runtime.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.warn(
    "VITE_API_BASE_URL is not set — API calls will fail. Check your .env file."
  );
}
