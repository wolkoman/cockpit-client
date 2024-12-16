export function titlecase(value: string) {
  return value
    .split(/[_\-]/)
    .map((sub) => sub.substring(0, 1).toUpperCase() + sub.substring(1))
    .join("")
    .replace(/!/g, "_");
}
