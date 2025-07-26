import { JSX } from "preact";
import { nanoid } from "@sitnik/nanoid";

export function FormInput(
  props: JSX.HTMLAttributes<HTMLInputElement>,
) {
  const id = nanoid();
  const inputId = `input-${id}`;
  const { children, ...inputProps } = props;
  return (
    <>
      <label for={inputId}>{children}</label>
      <input {...inputProps} id={inputId} />
    </>
  );
}
