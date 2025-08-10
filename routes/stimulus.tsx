import { Handlers, PageProps } from "$fresh/server.ts";
import { ComponentChildren } from "preact";
import {
  handleStimulusForm,
  StimulusForm,
} from "../components/forms/StimulusForm.tsx";

interface IndexProps {
  notices?: ComponentChildren[];
}

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();
    return await ctx.render({ notices: [await handleStimulusForm(form)] });
  },
};

export default function Stimulus(
  { data }: PageProps<IndexProps>,
) {
  return (
    <>
      <h1>kate.rest</h1>
      <h2>fops shocking department</h2>
      <p>
        yes this does actually send physical stimulation to her wrist mere
        seconds after you submit the form please be nice
      </p>

      {data?.notices}
      <StimulusForm />
      <p>want to shock a fops from the terminal? this should work :3</p>
      <code class="block">
        curl -F "type=zap" {"            \\\n     "}
        -F "strength=10" {"         \\\n     "}
        -F "message=hewwos :3" {"   \\\n     "}
        -F "sender=a cute entity" {"\\\n     "}
        https://kate.rest/stimulus
      </code>
      <p>
        Alternatively, interactions can also be sent over DNS! Just do a{" "}
        <code>TXT</code>lookup for{" "}
        <code>[strength].shock.kate.rest</code>, where <code>strength</code>
        {" "}
        is an optional integer.
      </p>
      <code class="block">
        $ drill TXT 50.shock.kate.rest{"\n"}
        ;;-&gt;&gt;HEADER&lt;&lt;- opcode: QUERY, rcode: NOERROR, id: 15769
        ;;flags: qr rd ; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 0 {"\n"}
        ;;QUESTION SECTION:{"\n"}
        ;; 100.shock.kate.rest.	IN	TXT{"\n"}
        {"\n"}
        ;; ANSWER SECTION:{"\n"}
        100.shock.kate.rest.	0	IN	TXT	"yip!" "&gt;////&lt;"{"\n"}
      </code>
    </>
  );
}
