const STORAGE_KEY = "fortune_oracle_subscription_v2";

export function getSubscriptionData() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSubscriptionData({ email, subscriptionId, verifiedAt }) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    email,
    subscriptionId,
    verifiedAt: verifiedAt || Date.now(),
  }));
}

export function clearSubscriptionData() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function needsReverification(data) {
  if (!data || !data.verifiedAt) return true;
  const ONE_DAY = 24 * 60 * 60 * 1000;
  return Date.now() - data.verifiedAt > ONE_DAY;
}
