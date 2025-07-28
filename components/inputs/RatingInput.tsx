import { JSX } from "preact";
import { nanoid } from "@sitnik/nanoid";

export function RatingInput(
  props: JSX.HTMLAttributes<HTMLInputElement>,
) {
  const { children, name } = props;
  return (
    <>
      <span class="rating-input-label">{children}</span>
      <div class="rating-input">
        {[...Array(5)].map((_, idx, arr) => {
          const id = nanoid();
          const inputId = `input-${id}`;
          return (
            <>
              <input
                type="radio"
                key={idx}
                value={idx + 1}
                name={name}
                id={inputId}
                required
              />
              <label for={inputId} aria-label={`${idx + 1} stars`}>
                {idx + 1}
              </label>
            </>
          );
        })}
      </div>
    </>
  );
}
