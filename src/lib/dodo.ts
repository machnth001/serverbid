import DodoPayments from "dodopayments";

export function getDodoClient(): DodoPayments {
  const env =
    process.env.DODO_PAYMENTS_ENVIRONMENT === "test_mode"
      ? "test_mode"
      : "live_mode";

  return new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY || "",
    environment: env,
  });
}
