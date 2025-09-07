// import groupBy from "lodash/groupBy";

// export function getVariations(variations: object | undefined) {
//   if (!variations) return {};
//   return groupBy(variations, "attribute.slug");
// }

export function getVariations(variations: any) {
  if (!variations) return {};
  return variations; // colors and sizes are already grouped
}
