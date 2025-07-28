import { Review as ReviewType } from "../config/prisma.ts";

export function ReviewCard({ review }: { review: ReviewType }) {
  return (
    <div class="review-card" data-review-id={review.id}>
      <blockquote>
        <p>{review.message}</p>
      </blockquote>
      <p class="review-card-author">
        — {review.url
          ? <a href={review.url} target="_blank">{review.author}</a>
          : review.author}, {review.rating} stars
      </p>
    </div>
  );
}
