export interface JsonHttpRequest {
  readonly headers: Record<string, string>;
  readonly body: unknown;
  readonly timeoutMs: number;
}

export interface JsonHttpClient {
  postJson(url: string, request: JsonHttpRequest): Promise<unknown>;
}

export class HttpJsonRequestError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpJsonRequestError";
  }
}

export class HttpJsonResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HttpJsonResponseError";
  }
}

export class HttpJsonNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HttpJsonNetworkError";
  }
}

export class FetchJsonHttpClient implements JsonHttpClient {
  async postJson(url: string, request: JsonHttpRequest): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), request.timeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: request.headers,
        body: JSON.stringify(request.body),
        signal: controller.signal,
      });
      const payload = await readJsonPayload(response);

      if (!response.ok) {
        throw new HttpJsonRequestError(
          response.status,
          readErrorMessage(payload),
        );
      }

      return payload;
    } catch (error) {
      if (
        error instanceof HttpJsonRequestError ||
        error instanceof HttpJsonResponseError
      ) {
        throw error;
      }
      if (error instanceof Error) {
        throw new HttpJsonNetworkError(error.message);
      }
      throw new HttpJsonNetworkError("HTTP 요청 중 알 수 없는 오류가 발생했습니다.");
    } finally {
      clearTimeout(timeout);
    }
  }
}

async function readJsonPayload(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text.trim().length === 0) {
    return {};
  }

  try {
    const payload: unknown = JSON.parse(text);
    return payload;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new HttpJsonResponseError("응답이 JSON 형식이 아닙니다.");
    }
    throw error;
  }
}

function readErrorMessage(payload: unknown): string {
  if (!isRecord(payload)) {
    return "OpenRouter 요청이 실패했습니다.";
  }

  const error = payload["error"];
  if (isRecord(error)) {
    const message = error["message"];
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  const message = payload["message"];
  if (typeof message === "string" && message.trim().length > 0) {
    return message;
  }

  return "OpenRouter 요청이 실패했습니다.";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
