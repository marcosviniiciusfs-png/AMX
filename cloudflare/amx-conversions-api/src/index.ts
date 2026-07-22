import type {} from "./worker-configuration";

const MAX_BODY_BYTES = 64 * 1024;
const ALLOWED_EVENT_NAMES = new Set(["PageView", "Lead"]);
const HASHED_USER_DATA_FIELDS = new Set([
  "em",
  "ph",
  "fn",
  "ln",
  "ge",
  "db",
  "ct",
  "st",
  "zp",
  "country",
  "external_id",
  "subscription_id",
]);

type ClientUserDataValue = string | number | boolean | Array<string | number | boolean>;

type ClientEventPayload = {
  event_name?: string;
  event_id?: string;
  event_source_url?: string;
  user_data?: Record<string, ClientUserDataValue | null | undefined>;
  custom_data?: Record<string, unknown>;
  lead_data?: LeadData;
};

type MetaUserData = Record<string, string | string[]>;

type MetaServerEvent = {
  event_name: string;
  event_time: number;
  action_source: "website";
  event_source_url?: string;
  event_id?: string;
  user_data: MetaUserData;
  custom_data?: Record<string, unknown>;
};

type LeadData = {
  fullName: string;
  whatsapp: string;
  creditAmount: string;
  limitedConditionsInterest: string;
  hasDownPayment: string;
  downPaymentAmount: string;
  monthlyPayment: string;
  city: string;
  acquisitionTime: string;
  propertyType: string;
};

type DeliveryResult = {
  ok: boolean;
  status: number;
  body: unknown;
};

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}

const jsonResponse = (
  body: unknown,
  status: number,
  headers: HeadersInit = {}
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...headers,
    },
  });

const parseAllowedOrigins = (env: Env) =>
  env.ALLOWED_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const getCorsHeaders = (request: Request, env: Env): HeadersInit => {
  const requestOrigin = request.headers.get("Origin") || "";
  const allowedOrigins = parseAllowedOrigins(env);
  const allowedOrigin = allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : allowedOrigins[0] || "";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
};

const isOriginAllowed = (request: Request, env: Env) => {
  const requestOrigin = request.headers.get("Origin");
  return !requestOrigin || parseAllowedOrigins(env).includes(requestOrigin);
};

const readLimitedText = async (request: Request) => {
  const contentLength = request.headers.get("Content-Length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    throw new HttpError(413, "Payload muito grande.");
  }

  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new HttpError(413, "Payload muito grande.");
    }
    chunks.push(value);
  }

  const body = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(body);
};

const readLimitedResponseBody = async (response: Response) => {
  if (!response.body) return null;

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;

    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      await reader.cancel();
      return "Resposta truncada por limite de tamanho.";
    }
    chunks.push(value);
  }

  const body = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const text = new TextDecoder().decode(body);
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const parseJsonPayload = async (request: Request): Promise<ClientEventPayload> => {
  const text = await readLimitedText(request);
  if (!text.trim()) {
    throw new HttpError(400, "Payload vazio.");
  }

  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new HttpError(400, "Payload invalido.");
    }
    return parsed as ClientEventPayload;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, "JSON invalido.");
  }
};

const normalizeValue = (field: string, value: string) => {
  if (field === "ph") {
    return value.replace(/\D/g, "");
  }
  return value.trim().toLowerCase();
};

const isSha256 = (value: string) => /^[a-f0-9]{64}$/i.test(value);

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const maybeHashUserData = async (field: string, rawValue: string) => {
  const normalized = normalizeValue(field, rawValue);
  if (!normalized) return null;
  if (isSha256(normalized)) return normalized.toLowerCase();
  return sha256(normalized);
};

const readCookie = (request: Request, name: string) => {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [cookieName, ...rest] = cookie.trim().split("=");
    if (cookieName === name) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return null;
};

const appendUserDataValue = async (
  userData: MetaUserData,
  field: string,
  value: ClientUserDataValue
) => {
  const values = Array.isArray(value) ? value : [value];
  const preparedValues = (
    await Promise.all(
      values.map(async (item) => {
        const stringValue = String(item);
        if (HASHED_USER_DATA_FIELDS.has(field)) {
          return maybeHashUserData(field, stringValue);
        }
        const trimmed = stringValue.trim();
        return trimmed || null;
      })
    )
  ).filter((item): item is string => Boolean(item));

  if (!preparedValues.length) return;

  userData[field] = preparedValues.length === 1 ? preparedValues[0] : preparedValues;
};

const buildUserData = async (request: Request, payload: ClientEventPayload) => {
  const userData: MetaUserData = {};

  if (payload.user_data && typeof payload.user_data === "object") {
    for (const [field, value] of Object.entries(payload.user_data)) {
      if (value === null || value === undefined) continue;
      await appendUserDataValue(userData, field, value);
    }
  }

  const userAgent = request.headers.get("User-Agent");
  const ipAddress = request.headers.get("CF-Connecting-IP");
  const fbpCookie = readCookie(request, "_fbp");
  const fbcCookie = readCookie(request, "_fbc");

  if (!userData.client_user_agent && userAgent) {
    userData.client_user_agent = userAgent;
  }
  if (!userData.client_ip_address && ipAddress) {
    userData.client_ip_address = ipAddress;
  }
  if (!userData.fbp && fbpCookie) {
    userData.fbp = fbpCookie;
  }
  if (!userData.fbc && fbcCookie) {
    userData.fbc = fbcCookie;
  }

  return userData;
};

const buildMetaEvent = async (
  request: Request,
  payload: ClientEventPayload
): Promise<MetaServerEvent> => {
  if (!payload.event_name || !ALLOWED_EVENT_NAMES.has(payload.event_name)) {
    throw new HttpError(400, "Evento invalido.");
  }

  const eventSourceUrl =
    payload.event_source_url || request.headers.get("Referer") || undefined;

  return {
    event_name: payload.event_name,
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: eventSourceUrl,
    event_id: payload.event_id,
    user_data: await buildUserData(request, payload),
    custom_data: payload.custom_data,
  };
};

const sendToMeta = async (
  env: Env,
  event: MetaServerEvent
): Promise<DeliveryResult> => {
  if (!env.META_CAPI_ACCESS_TOKEN) {
    throw new HttpError(500, "Token da Conversions API nao configurado.");
  }

  const endpoint = new URL(
    `https://graph.facebook.com/${env.META_GRAPH_API_VERSION}/${env.META_PIXEL_ID}/events`
  );
  endpoint.searchParams.set("access_token", env.META_CAPI_ACCESS_TOKEN);

  const response = await fetch(endpoint.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: [event],
      partner_agent: "amx-cloudflare-worker",
    }),
  });

  return {
    ok: response.ok,
    status: response.status,
    body: await readLimitedResponseBody(response),
  };
};

const parseCurrencyNumber = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  return numbers ? Number(numbers) / 100 : null;
};

const validateLeadData = (data: LeadData) => {
  const requiredFields: Array<keyof LeadData> = [
    "fullName",
    "whatsapp",
    "creditAmount",
    "limitedConditionsInterest",
    "hasDownPayment",
    "monthlyPayment",
    "city",
    "acquisitionTime",
    "propertyType",
  ];

  for (const field of requiredFields) {
    const value = data[field];
    if (typeof value !== "string" || !value.trim()) {
      throw new HttpError(400, `Campo de lead ausente: ${field}.`);
    }
  }

  if (
    data.hasDownPayment === "Sim" &&
    (typeof data.downPaymentAmount !== "string" || !data.downPaymentAmount.trim())
  ) {
    throw new HttpError(400, "Campo de lead ausente: downPaymentAmount.");
  }

  if (data.whatsapp.replace(/\D/g, "").length < 10) {
    throw new HttpError(400, "WhatsApp do lead invalido.");
  }
};

const buildLeadDestinationPayload = (
  request: Request,
  env: Env,
  payload: ClientEventPayload
) => {
  const data = payload.lead_data;
  if (!data) {
    throw new HttpError(400, "Dados do lead ausentes.");
  }
  validateLeadData(data);

  const telefone = data.whatsapp.replace(/\D/g, "");
  const valorEntrada =
    data.hasDownPayment === "Sim" ? data.downPaymentAmount : "Não tem";
  const receivedAt = new Date();

  return {
    nome: data.fullName.trim(),
    telefone,
    whatsapp: data.whatsapp,
    tipo: "AMX_SIMULADOR",
    tipo_bem: data.propertyType,
    interesse_condicoes_limitadas: data.limitedConditionsInterest,
    valor_pretendido: data.creditAmount,
    valor_pretendido_numero: parseCurrencyNumber(data.creditAmount),
    possui_entrada: data.hasDownPayment,
    valor_entrada: valorEntrada,
    valor_entrada_numero:
      data.hasDownPayment === "Sim" ? parseCurrencyNumber(data.downPaymentAmount) : null,
    parcela_ideal: data.monthlyPayment,
    parcela_ideal_numero: parseCurrencyNumber(data.monthlyPayment),
    cidade: data.city.trim(),
    tempo_aquisicao: data.acquisitionTime,
    origem: "simulador_amx",
    data_entrada: receivedAt.toISOString().split("T")[0],
    received_at: receivedAt.toISOString(),
    source_url:
      payload.event_source_url || request.headers.get("Referer") || "",
    user_agent: request.headers.get("User-Agent") || "",
    event_id: payload.event_id,
    meta_pixel_id: env.META_PIXEL_ID,
    delivery_source: "amx_conversions_api_worker",
  };
};

const sendLeadDestinationWebhook = async (
  request: Request,
  env: Env,
  payload: ClientEventPayload
): Promise<DeliveryResult> => {
  if (!env.LEAD_DESTINATION_WEBHOOK_URL) {
    throw new HttpError(500, "Webhook de destino nao configurado.");
  }

  const response = await fetch(env.LEAD_DESTINATION_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildLeadDestinationPayload(request, env, payload)),
  });

  return {
    ok: response.ok,
    status: response.status,
    body: await readLimitedResponseBody(response),
  };
};

export default {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request, env);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (url.pathname === "/health" && request.method === "GET") {
      return jsonResponse(
        { ok: true, service: "amx-conversions-api" },
        200,
        corsHeaders
      );
    }

    if (url.pathname !== "/events" || request.method !== "POST") {
      return jsonResponse({ error: "Rota nao encontrada." }, 404, corsHeaders);
    }

    if (!isOriginAllowed(request, env)) {
      return jsonResponse({ error: "Origem nao permitida." }, 403, corsHeaders);
    }

    try {
      const payload = await parseJsonPayload(request);
      const event = await buildMetaEvent(request, payload);
      const leadWebhookResult =
        payload.event_name === "Lead"
          ? await sendLeadDestinationWebhook(request, env, payload)
          : null;
      let metaResult: DeliveryResult;

      try {
        metaResult = await sendToMeta(env, event);
      } catch (error) {
        metaResult = {
          ok: false,
          status: 0,
          body: {
            error:
              error instanceof Error
                ? error.message
                : "Falha ao enviar evento para a Meta.",
          },
        };
      }

      const leadDeliveryFailed =
        Boolean(leadWebhookResult) && !leadWebhookResult?.ok;
      const responseStatus = leadDeliveryFailed
        ? 502
        : payload.event_name === "Lead" || metaResult.ok
          ? 200
          : 502;

      return jsonResponse(
        {
          success: !leadDeliveryFailed && (payload.event_name === "Lead" || metaResult.ok),
          lead_webhook: leadWebhookResult
            ? {
                success: leadWebhookResult.ok,
                status: leadWebhookResult.status,
                response: leadWebhookResult.body,
              }
            : undefined,
          meta: {
            success: metaResult.ok,
            status: metaResult.status,
            response: metaResult.body,
          },
        },
        responseStatus,
        corsHeaders
      );
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500;
      const message =
        error instanceof Error ? error.message : "Erro desconhecido.";

      return jsonResponse(
        {
          success: false,
          error: message,
        },
        status,
        corsHeaders
      );
    }
  },
} satisfies ExportedHandler<Env>;
