import { Handlers, RouteContext } from "$fresh/server.ts";
import { ComponentChildren } from "preact";
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
    return await ctx.render({ notices: [handleReviewForm(form)] });
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
  const { _avg: { rating: avgRating } } = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
  });
  return (
    <>
      <h1>kate.rest</h1>
      <p>
        the peculiar floppy eared fox with an average rating of{" "}
        {Number(avgRating?.toFixed(2))} stars!! also available for{" "}
        <a href="/stimulus">realtime interactions</a>!
      </p>

      {data?.notices}

      <ReviewForm />

      <h2>Reviews</h2>
      {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
    </>
  );
}
