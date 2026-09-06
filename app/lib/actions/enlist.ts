"use server";

import { createClient } from "@/app/lib/supabase/server";

export type EnlistResult = {
  success?: string;
  error?: string;
};

export type ApplicationStatus = {
  hasApplication: boolean;
  status?: string;
  createdAt?: string;
};

export async function getMyApplication(): Promise<ApplicationStatus> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { hasApplication: false };

  const { data } = await supabase
    .from("applications")
    .select("id, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (data && data.length > 0) {
    return {
      hasApplication: true,
      status: data[0].status,
      createdAt: data[0].created_at,
    };
  }

  return { hasApplication: false };
}

export async function submitApplication(formData: FormData): Promise<EnlistResult> {
  const supabase = await createClient();

  // Require authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to submit an application." };
  }

  // Check if user already has an application
  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  if (existing && existing.length > 0) {
    return { error: "You have already submitted an application." };
  }

  const billetId = (formData.get("billetId") as string) || null;

  const application = {
    user_id: user.id,
    callsign: formData.get("callsign") as string,
    age: parseInt(formData.get("age") as string, 10),
    discord_username: formData.get("discord") as string,
    timezone: formData.get("timezone") as string,
    arma_hours: formData.get("armaHours") as string,
    prior_units: (formData.get("priorUnits") as string) || null,
    mos_preference: formData.get("mosPreference") as string,
    availability: formData.getAll("availability") as string[],
    motivation: formData.get("motivation") as string,
    referred_by: (formData.get("referredBy") as string) || null,
    billet_id: billetId || null,
  };

  // Validate required fields
  if (!application.callsign || !application.discord_username || !application.motivation) {
    return { error: "Missing required fields." };
  }

  if (application.age < 16) {
    return { error: "Minimum age requirement not met." };
  }

  const { data: inserted, error } = await supabase
    .from("applications")
    .insert(application)
    .select("id")
    .single();

  if (error) {
    console.error("Application insert error:", error);
    return { error: "Failed to submit application. Try again later." };
  }

  // ── Discord webhook notification ──
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (webhookUrl) {
    const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-site.com"}/admin/applications/${inserted?.id}`;
    const availStr = application.availability?.length
      ? application.availability.join(", ")
      : "Not specified";

    const pingRoleId = process.env.DISCORD_PING_ROLE_ID;
    const payload = {
      ...(pingRoleId ? { content: `<@&${pingRoleId}>` } : {}),
      embeds: [
        {
          title: "📋 New Enlistment Application",
          color: 0xc9a128,
          fields: [
            { name: "Callsign",      value: application.callsign,                         inline: true  },
            { name: "Discord",       value: application.discord_username,                  inline: true  },
            { name: "Timezone",      value: application.timezone || "N/A",                 inline: true  },
            { name: "MOS Pref",      value: application.mos_preference || "Any",           inline: true  },
            { name: "Position Req", value: billetId ? `Billet: ${billetId}` : "No preference", inline: true },
            { name: "Arma Hours",  value: String(application.arma_hours ?? "N/A"),       inline: true  },
            { name: "Availability",  value: availStr,                                       inline: false },
            { name: "Motivation",    value: (application.motivation ?? "").slice(0, 300) + ((application.motivation?.length ?? 0) > 300 ? "…" : ""), inline: false },
          ],
          footer: { text: "ODA 2011, 20th SFG Recruiting" },
          timestamp: new Date().toISOString(),
          ...(inserted?.id ? { url: adminUrl } : {}),
        },
      ],
    };

    try {
      await fetch(webhookUrl, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });
    } catch (webhookErr) {
      // Non-fatal — application is already saved
      console.error("Discord webhook failed:", webhookErr);
    }
  }

  return { success: "Application submitted successfully. You will be contacted via Discord." };
}
