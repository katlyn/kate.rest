import { Handlers, RouteContext } from "$fresh/server.ts";
import { ComponentChildren } from "preact";
import {
  handleStimulusForm,
  StimulusForm,
} from "../components/forms/StimulusForm.tsx";
import { Alert } from "../components/Alert.tsx";
import {
  handleReviewForm,
  ReviewForm,
} from "../components/forms/ReviewForm.tsx";
import prisma from "../config/prisma.ts";
import { ReviewCard } from "../components/ReviewCard.tsx";

interface IndexProps {
  notices?: ComponentChildren[];
}

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();
    const notices: IndexProps["notices"] = [];

    const formType = form.get("form");

    const forms = {
      stimulus: handleStimulusForm,
      review: handleReviewForm,
    };

    if (typeof formType === "string" && formType in forms) {
      notices.push(await forms[formType as keyof typeof forms](form));
    } else {
      notices.push(<Alert type="error">idk what you're trying to do!</Alert>);
    }
    return await ctx.render({ notices });
  },
};

export default async function Index(
  _req: Request,
  ctx: RouteContext<IndexProps>,
) {
  const { data } = ctx;
  const reviews = await prisma.review.findMany({
    orderBy: { created: "desc" },
  });
  return (
    <>
      <h1>kate.rest</h1>
      <p>zap kate or something idk o-o"</p>

      {data?.notices}

      <ReviewForm />
      <StimulusForm />

      <h2>Reviews</h2>
      {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
    </>
  );
}
