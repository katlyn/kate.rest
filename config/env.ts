import { secret, strictVerify } from "env-verifier";

const config = {
  pavlokToken: secret("PAVLOK_TOKEN"),
};

const env = strictVerify<typeof config>(config);

export default env;
