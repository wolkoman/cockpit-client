export function titlecase(value: string): string {
  return value
    .split(/[_\-]/)
    .map((sub) => sub.charAt(0).toUpperCase() + sub.slice(1))
    .join("")
    .replace(/!/g, "_")
    .replace(/ä/ig, "ae")
    .replace(/ü/ig, "ue")
    .replace(/ö/ig, "oe")
    .replace(/[^\x00-\x7F]+/g, "");
}
