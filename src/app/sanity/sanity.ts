import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: "mb06vmiz",
  dataset: "production",
  useCdn: true,
  apiVersion: "2023-10-10",
});

// needed for pre-loading.
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}
