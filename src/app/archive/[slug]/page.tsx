import { type SanityDocument } from "next-sanity";
import { client } from "../../sanity/client";
import BackButton from "../../components/backButtonArchive"; //...
import ImageGallery from "../../components/ImageGallery"; //if for some reason these dont work then clear cache and restart dev env.

const POST_QUERY = `*[_type == "event" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  eventLineup,
  eventDate,
  location,
  eventName,
  eventImages[]{
    _key,
    asset->{
      _id,
      url,
      metadata { dimensions { width, height } }
    },
    hotspot,
    crop
  },
  flyer[]{
    _key,
    asset->{
      _id,
      url,
      metadata { dimensions { width, height } }
    },
    hotspot,
    crop
  }
}`;

const options = { next: { revalidate: 60 } };

export default async function EventPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await client.fetch<SanityDocument>(POST_QUERY, params, options);

  if (!event) {
    return <div>Something is wrong with event data.</div>;
  }

  return (
    <main className="container mx-auto min-h-screen max-w-full p-3 flex flex-col gap-10">
      <BackButton />
      <h1 className="text-4xl font-bold mb-4">
        {event.eventLineup.join(", ")}
      </h1>
      {event.eventImages && event.eventImages.length > 0 ? (
        <ImageGallery images={event.eventImages} eventTitle={event.title} />
      ) : (
        <span>No event images to show.</span>
      )}
    </main>
  );
}
