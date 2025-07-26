import { JSX } from "preact";
import { nanoid } from "@sitnik/nanoid";

interface SelectInputOption {
  value: string;
  name?: string;
}

export function SelectInput(
  props: JSX.HTMLAttributes<HTMLSelectElement> & {
    options: SelectInputOption[];
  },
) {
  const id = nanoid();
  const inputId = `input-${id}`;
  const { children, options, ...inputProps } = props;
  return (
    <>
      <label for={inputId}>{children}</label>
      <select {...inputProps} id={inputId}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.name ?? opt.value}
          </option>
        ))}
      </select>
    </>
  );
}
