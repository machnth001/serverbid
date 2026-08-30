import { getSlots, getRecentActivity } from "@/actions/bids";
import { ClientRackPage } from "@/components/ClientRackPage";
import { ActivityEvent } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const [slots, recentBids] = await Promise.all([
    getSlots(),
    getRecentActivity(30),
  ]);

  const initialActivities: ActivityEvent[] = recentBids.map((b) => ({
    id: b.id,
    slot_id: b.slot_id,
    bidder_name: b.bidder_name,
    bidder_handle: b.bidder_handle,
    amount: Number(b.amount) || 0,
    created_at: b.created_at,
  }));

  return (
    <ClientRackPage
      initialSlots={slots}
      initialActivities={initialActivities}
    />
  );
}
