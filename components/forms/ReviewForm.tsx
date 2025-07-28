import { ComponentChildren } from "preact";
import { FormInput } from "../inputs/FormInput.tsx";
import { Alert } from "../Alert.tsx";
import { RatingInput } from "../inputs/RatingInput.tsx";
import prisma from "../../config/prisma.ts";

const limits = {
  message: 512,
  author: 64,
};

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return ["http:", "https:"].includes(url.protocol);
  } catch (_) {
    return false;
  }
}

export async function handleReviewForm(
  form: FormData,
): Promise<ComponentChildren> {
  const rawRating = form.get("rating");
  const message = form.get("message");
  const author = form.get("author");
  const rawUrl = form.get("url");

  if (
    typeof rawRating !== "string" ||
    typeof message !== "string" ||
    typeof author !== "string" ||
    (rawUrl !== null && typeof rawUrl !== "string")
  ) {
    return <Alert type="error">ur missing something i think</Alert>;
  }

  const rating = Number(rawRating);
  if (isNaN(rating) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return <Alert type="error">invalid rating value</Alert>;
  }

  if (message.length > limits.message || author.length > limits.author) {
    return <Alert type="error">message or author too long</Alert>;
  }

  const url = rawUrl === "" ? null : rawUrl;
  if (url !== null && !isValidUrl(url)) {
    return <Alert type="error">that's not a valid url silly!</Alert>;
  }

  await prisma.review.create({
    data: {
      author,
      rating,
      message,
      url,
    },
  });

  return <Alert type="success">Submitted the fops review!!</Alert>;
}

export function ReviewForm() {
  return (
    <form method="post" encType="multipart/form-data">
      <input type="hidden" name="form" value="review" />
      <fieldset>
        <legend>Review a Fox</legend>
        <RatingInput name="rating">Rating</RatingInput>

        <FormInput
          type="text"
          name="message"
          placeholder="what scary things do entities have to say about me o-o&quot;"
          minlength={3}
          maxlength={limits.message}
          required
        >
          Review
        </FormInput>

        <FormInput
          type="text"
          name="author"
          placeholder="cutie"
          maxlength={limits.author}
          required
        >
          Name
        </FormInput>

        <FormInput
          type="url"
          name="url"
          placeholder="if you wanna link back to yourself :3"
        >
          URL
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
