import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: "mb06vmiz",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-10-10",
});

// Needed for pre-loading
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: object) {
  return builder.image(source);
}
