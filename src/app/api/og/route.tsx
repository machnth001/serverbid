import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const slotId = searchParams.get("slot") || "01";
    const formattedSlot = slotId.startsWith("#")
      ? slotId
      : `#${slotId.padStart(2, "0")}`;
    const isMaster = formattedSlot === "#01";
    const company = searchParams.get("company") || (isMaster ? "MASTER NODE" : "HYPER-BLADE");
    const handle = searchParams.get("handle") || (isMaster ? "thearchitect" : "topfounder");
    const bid = searchParams.get("bid") || (isMaster ? "250.00" : "50.00");
    const logo = searchParams.get("logo") || "";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#07070a",
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(0, 212, 255, 0.15), transparent 60%), radial-gradient(circle at 10% 90%, rgba(255, 0, 85, 0.12), transparent 50%)",
            padding: "50px 60px",
            fontFamily: "sans-serif",
            color: "#ffffff",
            border: "12px solid #14141d",
            boxSizing: "border-box",
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: "#00ff66",
                  boxShadow: "0 0 16px #00ff66",
                }}
              />
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  color: "#f3f4f6",
                }}
              >
                bidserver.lol
              </span>
              <span
                style={{
                  fontSize: "18px",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(0, 212, 255, 0.15)",
                  color: "#00d4ff",
                  border: "1px solid rgba(0, 212, 255, 0.3)",
                  marginLeft: "8px",
                  fontWeight: 600,
                }}
              >
                LIVE RACK
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#9ca3af",
                fontSize: "18px",
              }}
            >
              <span>12 FINITE SLOTS</span>
              <span>•</span>
              <span style={{ color: "#00ff66" }}>LIVE REALTIME</span>
            </div>
          </div>

          {/* Center Card - Blade Replica */}
          <div
            style={{
              display: "flex",
              width: "100%",
              backgroundColor: "#0f0f17",
              borderRadius: "16px",
              border: isMaster
                ? "2px solid #ffd700"
                : "2px solid rgba(0, 212, 255, 0.4)",
              boxShadow: isMaster
                ? "0 0 35px rgba(255, 215, 0, 0.25)"
                : "0 0 35px rgba(0, 212, 255, 0.2)",
              padding: "36px 40px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
              {/* Slot Badge */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "120px",
                  height: "120px",
                  borderRadius: "14px",
                  backgroundColor: isMaster
                    ? "rgba(255, 215, 0, 0.12)"
                    : "rgba(0, 212, 255, 0.1)",
                  border: isMaster
                    ? "2px solid #ffd700"
                    : "2px solid #00d4ff",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    color: isMaster ? "#ffd700" : "#00d4ff",
                  }}
                >
                  {isMaster ? "MASTER" : "SLOT"}
                </span>
                <span
                  style={{
                    fontSize: "46px",
                    fontWeight: 900,
                    color: "#ffffff",
                    lineHeight: "1",
                  }}
                >
                  {formattedSlot}
                </span>
              </div>

              {/* Company & Handle info */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  {logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo}
                      alt={company}
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                  ) : null}
                  <span
                    style={{
                      fontSize: "42px",
                      fontWeight: 900,
                      color: "#ffffff",
                      letterSpacing: "-1px",
                    }}
                  >
                    {company}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    color: "#00d4ff",
                    fontWeight: 600,
                  }}
                >
                  @{handle.replace(/^@/, "")}
                </div>
              </div>
            </div>

            {/* Bid Amount Box */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "20px 28px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  color: "#9ca3af",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  marginBottom: "4px",
                }}
              >
                CURRENT RACK VALUATION
              </span>
              <span
                style={{
                  fontSize: "52px",
                  fontWeight: 900,
                  color: isMaster ? "#ffd700" : "#00ff66",
                  textShadow: isMaster
                    ? "0 0 20px rgba(255, 215, 0, 0.5)"
                    : "0 0 20px rgba(0, 255, 102, 0.5)",
                }}
              >
                ${bid.startsWith("$") ? bid.slice(1) : bid}
              </span>
            </div>
          </div>

          {/* Bottom Viral CTA */}
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "24px",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#e5e7eb",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              ⚡ Hot-swappable advertising on the world’s most contested server.
            </div>

            <div
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: "#ff0055",
                backgroundColor: "rgba(255, 0, 85, 0.1)",
                padding: "8px 18px",
                borderRadius: "8px",
                border: "1px solid rgba(255, 0, 85, 0.3)",
              }}
            >
              TRY TO PULL MY PLUG →
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("OG Image generation failed", e);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
