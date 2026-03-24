export function slugify(value: string, maxLength?: number): string {
  const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return maxLength === undefined ? slug : slug.slice(0, maxLength);
}
