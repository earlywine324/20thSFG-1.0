const TWITCH_API = "https://api.twitch.tv/helix";
const TWITCH_AUTH = "https://id.twitch.tv/oauth2/token";

// In-memory token cache (server-side, per cold start)
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAppToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token;
  }

  const res = await fetch(TWITCH_AUTH, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.TWITCH_CLIENT_ID!,
      client_secret: process.env.TWITCH_CLIENT_SECRET!,
      grant_type: "client_credentials",
    }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Twitch token error: ${res.status}`);
  const data = await res.json();

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.token;
}

export type TwitchStream = {
  user_login: string;
  user_name: string;
  title: string;
  game_name: string;
  viewer_count: number;
  thumbnail_url: string;
  started_at: string;
};

export type TwitchUser = {
  login: string;
  display_name: string;
  profile_image_url: string;
};

export async function fetchStreams(logins: string[]): Promise<TwitchStream[]> {
  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET || logins.length === 0) {
    return [];
  }

  try {
    const token = await getAppToken();
    const params = logins.map((l) => `user_login=${encodeURIComponent(l)}`).join("&");
    const res = await fetch(`${TWITCH_API}/streams?${params}&first=100`, {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data ?? []) as TwitchStream[];
  } catch {
    return [];
  }
}

export async function fetchUsers(logins: string[]): Promise<TwitchUser[]> {
  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET || logins.length === 0) {
    return [];
  }

  try {
    const token = await getAppToken();
    const params = logins.map((l) => `login=${encodeURIComponent(l)}`).join("&");
    const res = await fetch(`${TWITCH_API}/users?${params}`, {
      headers: {
        "Client-ID": process.env.TWITCH_CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data ?? []) as TwitchUser[];
  } catch {
    return [];
  }
}
