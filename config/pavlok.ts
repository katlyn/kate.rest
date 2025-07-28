import env from "./env.ts";

interface PavlokClientOptions {
  token: string;
  apiRoot?: string;
}

interface PavlokStimulus {
  id: number;
  type: string;
  value: string;
  sentAt?: string;
  sentBy?: string;
  sentTo: string;
  createdAt: string;
  updatedAt: string;
  via?: string;
  message?: string;
  pushedAt?: string;
  failedAt?: string;
  failureMessage?: string;
  sentByApp?: number;
  reason?: string;
  pattern?: string;
  repeat?: number;
  deleted?: boolean;
  userDate?: string;
  recent?: boolean;
  meta?: string;
}

export const enum PavlokStimulusType {
  ZAP = "zap",
  BEEP = "beep",
  VIBE = "vibe",
}

interface PavlokStimulusCreateOptions {
  stimulusType: "zap" | "beep" | "vibe";
  stimulusValue: number;
  reason?: string;
}

interface PavlokStimulusCreateResponse {
  stimulus: PavlokStimulus;
}

interface PavlokGetAllStimulusResponse {
  stimulusList: PavlokStimulus[];
}

type PavlokApiError = string | { loc: string[]; msg: string; type: string };
export class PavlokError extends Error {
  errors: PavlokApiError[];
  constructor(
    response: {
      errors: PavlokApiError[];
    },
  ) {
    super(response.errors.join(", "));
    this.name = "PavlokError";
    this.errors = response.errors;
  }
}

const ROUTES = {
  stimulus: {
    create: "stimulus/send",
    list: "stimulus/sent/me",
  },
} as const;

class PavlokClient {
  #token: string;
  apiRoot: string;
  constructor(
    { token, apiRoot = "https://api.pavlok.com/api/v5/" }: PavlokClientOptions,
  ) {
    this.#token = token;
    this.apiRoot = apiRoot;
  }

  sendStimulus(
    stimulusType: PavlokStimulusCreateOptions["stimulusType"],
    stimulusValue: PavlokStimulusCreateOptions["stimulusValue"],
    reason: PavlokStimulusCreateOptions["reason"],
  ) {
    return this.#sendRequest<PavlokStimulusCreateResponse>(
      ROUTES.stimulus.create,
      "POST",
      {
        stimulus: {
          stimulusType,
          stimulusValue,
          reason,
        },
      },
    );
  }

  getAllStimulus() {
    return this.#sendRequest<PavlokGetAllStimulusResponse>(
      ROUTES.stimulus.list,
    );
  }

  async #sendRequest<T = unknown>(
    endpoint: string,
    method = "GET",
    body?: unknown,
  ): Promise<T> {
    const endpointUrl = new URL(endpoint, this.apiRoot);
    const request = await fetch(endpointUrl, {
      method,
      headers: {
        "authorization": `Bearer ${this.#token}`,
        "user-agent": "kate.rest/1.0 (https://kate.rest/)",
        "content-type": "application/json",
      },
      body: body !== null ? JSON.stringify(body) : null,
    });
    const response = await request.json();
    if (!request.ok) {
      if (response.errors !== null) {
        throw new PavlokError(response);
      } else {
        throw new Error("Unknown Pavlok error");
      }
    }
    return response as T;
  }
}

export default new PavlokClient({ token: env.pavlokToken.reveal() });
