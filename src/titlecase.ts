export function titlecase(value: string): string {
  return value
    .split(/[_\-]/)
    .map((sub) => sub.charAt(0).toUpperCase() + sub.slice(1))
    .join("")
    .replace(/!/g, "_");
}
