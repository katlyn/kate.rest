import { ComponentChildren } from "preact";

type NoticeTypes = "error" | "success";

export function Alert(
  { children, type }: { children: ComponentChildren; type?: NoticeTypes },
) {
  return (
    <div role="alert" class={`notice ${type ? `alert-${type}` : ""}`}>
      {children}
    </div>
  );
}
