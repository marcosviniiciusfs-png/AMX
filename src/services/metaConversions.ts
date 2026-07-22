import type { LeadWebhookData } from "@/services/leadWebhook";

const META_CAPI_URL = import.meta.env.VITE_META_CAPI_URL;

type MetaEventName = "PageView" | "Lead";

type BrowserUserData = {
  fbp?: string;
  fbc?: string;
};

type MetaEventPayload = {
  event_name: MetaEventName;
  event_id: string;
  event_source_url: string;
  user_data?: BrowserUserData & Record<string, string | undefined>;
  custom_data?: Record<string, unknown>;
  lead_data?: LeadWebhookData;
};

declare global {
  interface Window {
    fbq?: (
      command: "track",
      eventName: MetaEventName,
      parameters?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void;
  }
}

const readCookie = (name: string) => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, ...rest] = cookie.trim().split("=");
    if (cookieName === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return undefined;
};

const createEventId = (eventName: MetaEventName) => {
  const prefix = eventName.toLowerCase();
  if (crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const randomId = Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return `${prefix}_${randomId}`;
};

const getFbc = () => {
  const fbcCookie = readCookie("_fbc");
  if (fbcCookie) return fbcCookie;

  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return undefined;

  return `fb.1.${Date.now()}.${fbclid}`;
};

const getBrowserUserData = (): BrowserUserData => ({
  fbp: readCookie("_fbp"),
  fbc: getFbc(),
});

const trackBrowserPixel = (
  eventName: MetaEventName,
  eventId: string,
  parameters: Record<string, unknown> = {}
) => {
  if (typeof window.fbq !== "function") return;
  window.fbq("track", eventName, parameters, { eventID: eventId });
};

const readResponseBody = async (response: Response) => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const extractErrorMessage = (body: unknown, fallback: string) => {
  if (typeof body === "string") return body;
  if (body && typeof body === "object") {
    if ("error" in body) return String(body.error);
    if ("message" in body) return String(body.message);
  }
  return fallback;
};

const sendServerEvent = async (
  payload: MetaEventPayload,
  options: { requireSuccess?: boolean } = {}
) => {
  if (!META_CAPI_URL) {
    if (options.requireSuccess) {
      throw new Error("API de conversão da AMX não configurada.");
    }
    return;
  }

  try {
    const response = await fetch(META_CAPI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    const responseBody = await readResponseBody(response);

    if (!response.ok) {
      console.warn("Meta Conversions API retornou erro.", response.status);
      if (options.requireSuccess) {
        throw new Error(
          extractErrorMessage(
            responseBody,
            `Erro HTTP ${response.status} ao registrar o lead.`
          )
        );
      }
    }
  } catch (error) {
    console.warn("Falha ao enviar evento para Meta Conversions API.", error);
    if (options.requireSuccess) {
      throw error instanceof Error
        ? error
        : new Error("Falha ao registrar o lead.");
    }
  }
};

const parseCurrencyNumber = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  return numbers ? Number(numbers) / 100 : undefined;
};

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0],
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : undefined,
  };
};

export const trackPageView = async () => {
  const eventId = createEventId("PageView");
  const eventSourceUrl = window.location.href;

  trackBrowserPixel("PageView", eventId);

  await sendServerEvent({
    event_name: "PageView",
    event_id: eventId,
    event_source_url: eventSourceUrl,
    user_data: getBrowserUserData(),
    custom_data: {
      content_name: "AMX Simulador de Credito",
    },
  });
};

export const trackLead = async (leadData: LeadWebhookData) => {
  const eventId = createEventId("Lead");
  const eventSourceUrl = window.location.href;
  const { firstName, lastName } = splitName(leadData.fullName);

  trackBrowserPixel("Lead", eventId);

  await sendServerEvent({
    event_name: "Lead",
    event_id: eventId,
    event_source_url: eventSourceUrl,
    lead_data: leadData,
    user_data: {
      ...getBrowserUserData(),
      ph: leadData.whatsapp,
      fn: firstName,
      ln: lastName,
      ct: leadData.city,
    },
    custom_data: {
      content_name: "AMX Simulador de Credito",
      lead_type: "simulador_amx",
      property_type: leadData.propertyType,
      credit_amount: parseCurrencyNumber(leadData.creditAmount),
      monthly_payment: parseCurrencyNumber(leadData.monthlyPayment),
      has_down_payment: leadData.hasDownPayment,
      limited_conditions_interest: leadData.limitedConditionsInterest,
      acquisition_time: leadData.acquisitionTime,
    },
  }, { requireSuccess: true });
};
