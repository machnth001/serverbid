import DodoPayments from "dodopayments";

export function getDodoClient(): DodoPayments {
  const env =
    process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
      ? "live_mode"
      : process.env.DODO_PAYMENTS_ENVIRONMENT === "test_mode"
      ? "test_mode"
      : process.env.DODO_PAYMENTS_API_KEY?.startsWith("live_")
      ? "live_mode"
      : "test_mode";

  return new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY || "",
    environment: env,
  });
}
