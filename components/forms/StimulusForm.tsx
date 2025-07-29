import { ComponentChildren } from "preact";
import { FormInput } from "../inputs/FormInput.tsx";
import { SelectInput } from "../inputs/SelectInput.tsx";
import { Alert } from "../Alert.tsx";
import pavlok, {
  PavlokError,
  PavlokStimulusType,
} from "../../config/pavlok.ts";

const stimulusOptions = [
  { value: PavlokStimulusType.ZAP, name: "shock" },
  { value: PavlokStimulusType.VIBE, name: "buzz" },
  { value: PavlokStimulusType.BEEP, name: "beep!" },
];

export async function handleStimulusForm(
  form: FormData,
): Promise<ComponentChildren> {
  const rawStrength = form.get("strength");
  const type = form.get("type");
  const message = form.get("message");
  const sender = form.get("sender");
  if (
    typeof rawStrength !== "string" ||
    typeof type !== "string" ||
    typeof message !== "string" ||
    (sender !== null && typeof sender !== "string")
  ) {
    return (
      <Alert type="error">
        idk what you're trying to do but something about it is wrong
        {" >.>"}
      </Alert>
    );
  }

  let strength = Number(rawStrength);
  if (isNaN(strength) || !Number.isInteger(strength)) {
    return (
      <Alert type="error">
        i don't really think that's a number i can use
      </Alert>
    );
  }

  if (stimulusOptions.findIndex((v) => v.value === type) === -1) {
    return (
      <Alert type="error">
        what the hecc are you tryna do to me? TwT
      </Alert>
    );
  }

  if (strength <= 0) strength = 0;
  else if (strength > 100) {
    return (
      <Alert type="error">
        {type === "zap"
          ? "you're gonna get a fried fots with that big of a shock!!"
          : "too much strength!!"}
      </Alert>
    );
  }

  try {
    await pavlok.sendStimulus(
      type as PavlokStimulusType,
      Math.floor(strength / 2), // scary amount of shock
      `${message}\nFrom ${sender || "unknown"}`,
    );

    return (
      <Alert type="success">
        {sender ? `hiya ${sender}! ` : null}stimulus sent! ^°^
      </Alert>
    );
  } catch (error) {
    console.error(error);
    if (error instanceof PavlokError) {
      return (
        <Alert type="error">
          there was a problem sending the notice to kate {">.<"}
        </Alert>
      );
    } else {
      return <Alert type="error">something went wrong! {">.<"}</Alert>;
    }
  }
}

export function StimulusForm() {
  return (
    <form method="post" encType="multipart/form-data">
      <input type="hidden" name="form" value="stimulus" />
      <fieldset>
        <legend>Shock a Fox</legend>
        <FormInput
          type="number"
          name="strength"
          value="50"
          min="0"
          max="100"
          autocomplete="off"
        >
          Strength
        </FormInput>
        <SelectInput
          name="type"
          value="buzz"
          options={stimulusOptions}
        >
          Type
        </SelectInput>
        <FormInput
          type="text"
          name="message"
          placeholder="please say something :<"
          value="cute fops!"
          required
        >
          Message
        </FormInput>

        <FormInput
          type="text"
          name="sender"
          placeholder="if you wanna let me know who you are :3"
        >
          Sender
        </FormInput>

        <div className="form-controls">
          <div className="controls-left">
          </div>
          <div className="controls-right">
            <button type="reset">Reset</button>
            <button type="submit">Send</button>
          </div>
        </div>
      </fieldset>
    </form>
  );
}
