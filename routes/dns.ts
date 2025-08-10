import { Handlers } from "$fresh/server.ts";
import pavlok, { PavlokStimulusType } from "../config/pavlok.ts";

const TXT_RECORD_TYPE = 16;
const NAME_BASE = ".kate.rest.";

const RESPONSES = [
  "wrraff!",
  "kjnskjdc,,",
  "arf!",
  "yip!",
  "awawawawawawa",
  "nsajknksj",
  "kjnjknskjakj",
  "msnsdmdskds",
];

export const handler: Handlers = {
  async GET(_req, ctx) {
    const name = ctx.url.searchParams.get("name");
    const type = ctx.url.searchParams.get("type");
    if (!name?.endsWith(NAME_BASE) || type !== TXT_RECORD_TYPE.toString()) {
      return errorResponse();
    }

    const shockArgs = name.slice(0, -NAME_BASE.length).split(".");
    let action: string, strength: number;
    if (shockArgs.length === 1) {
      strength = 50;
      action = shockArgs[0];
    } else if (shockArgs.length === 2) {
      strength = Number(shockArgs[0]);
      action = shockArgs[1];
    } else {
      return errorResponse();
    }

    if (action === "shock") {
      action = "zap";
    }

    if (
      !(Number.isInteger(strength) && strength > 0 && strength <= 100) ||
      !isStimulusType(action)
    ) {
      console.log(strength);
      return errorResponse();
    }

    try {
      await pavlok.sendStimulus(action, strength, "stimulus received over dns");
    } catch (err) {
      console.error(err);
      return new Response(JSON.stringify({
        RCODE: 0,
        Answer: [{
          name,
          type: TXT_RECORD_TYPE,
          TTL: 0,
          data: "couldn't send the stimulus ;~;",
        }],
      }));
    }
    return new Response(JSON.stringify({
      RCODE: 0,
      Answer: [{
        name,
        type: TXT_RECORD_TYPE,
        TTL: 0,
        data: RESPONSES[Math.floor(Math.random() * RESPONSES.length)] + " >" +
          "/".repeat(3 + Math.floor(Math.random() * 7)) + "<",
      }],
    }));
  },
};

function isStimulusType(str: string): str is PavlokStimulusType {
  return Object.values(PavlokStimulusType).includes(
    str as PavlokStimulusType,
  );
}

function errorResponse() {
  return new Response(JSON.stringify({ RCODE: 1 }));
}
