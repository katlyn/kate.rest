import { Handlers, PageProps } from "$fresh/server.ts";
import { ComponentChildren } from "preact";
import {
  handleStimulusForm,
  StimulusForm,
} from "../components/StimulusForm.tsx";
import { Alert } from "../components/Alert.tsx";

interface IndexProps {
  notices?: ComponentChildren[];
}
export const handler: Handlers = {
  async GET(_req, ctx) {
    const notices: IndexProps["notices"] = [];
    return await ctx.render({ notices });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const notices: IndexProps["notices"] = [];

    const formType = form.get("form");

    switch (formType) {
      case "stimulus": {
        notices.push(await handleStimulusForm(form));
        break;
      }

      default: {
        notices.push(<Alert type="error">idk what you're trying to do!</Alert>);
      }
    }
    return await ctx.render({ notices });
  },
};

export default function Index({ data }: PageProps<IndexProps>) {
  return (
    <>
      <h1>kate.rest</h1>
      <p>zap kate or something idk o-o"</p>

      {data?.notices}

      <StimulusForm />
    </>
  );
}
