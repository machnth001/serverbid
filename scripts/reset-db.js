const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function resetDatabase() {
  console.log("Resetting Supabase slots & bid_history...");

  // 1. Delete all bid history
  const { error: bidError } = await supabase
    .from("bid_history")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (bidError) {
    console.error("Error clearing bid_history:", bidError);
  } else {
    console.log("Cleared bid_history table.");
  }

  // 2. Delete pending bids
  const { error: pendingError } = await supabase
    .from("pending_bids")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (pendingError) {
    console.error("Error clearing pending_bids:", pendingError);
  } else {
    console.log("Cleared pending_bids table.");
  }

  // 3. Reset all 12 slots to empty
  for (let i = 1; i <= 12; i++) {
    const { error: slotError } = await supabase
      .from("slots")
      .upsert({
        id: i,
        tier: i === 1 ? "master" : "blade",
        current_bid: 0,
        current_holder: null,
        bid_deadline: null,
        status: "empty",
        updated_at: new Date().toISOString(),
      });

    if (slotError) {
      console.error(`Error resetting slot #${i}:`, slotError);
    }
  }

  console.log("SUCCESS: All 12 slots reset to empty in Supabase DB!");
}

resetDatabase();
