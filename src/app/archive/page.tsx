// src/app/archive/page.tsx

import Link from "next/link";
import Image from "next/image";
import { type SanityDocument } from "next-sanity";
import { client } from "../sanity/client";
import { Key } from "react";

export const metadata = {
  title: "DAW Archive",
  description: "Archive of all past DAW events",
};

const POSTS_QUERY = `*[
  _type == "event"
  && defined(slug.current)
]|order(eventDate desc)[0...12]{
  _id,
  title,
  slug,
  eventName,
  eventLineup,
  location,
  eventDate,
  eventImages[]{
    _key,
    asset->{
      _id,
      url
    },
    hotspot,
    crop
  },
  flyer[]{
    _key,
    asset->{
      _id,
      url
    }
  }
}`;

const options = { next: { revalidate: 60 } };

export default async function ArchivePage() {
  const events = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <main className="container mx-auto min-h-screen max-w-[1500px] p-8 my-10">
      <header className="flex items-center mb-8"></header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <Link
            key={event._id}
            href={`/archive/${event.slug.current}`}
            className="block"
          >
            <div className="transition-colors duration-300 ease-in-out hover:bg-hot-pink cursor-pointer p-4 border border-dotted border-gray">
              {/* Event Details */}
              {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                <div>
                  <span>{event.eventName}</span>
                </div>
                <div>
                  <span>{event.eventLineup.join(", ")}</span>
                </div>
                <div>
                  <span>{event.location}</span>
                </div>
                <div>
                  <span>
                    {new Date(event.eventDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div> */}
              <div className="flex justify-center px-2 py-4">
                {event.flyer && event.flyer.length > 0 ? (
                  event.flyer.map(
                    (image: {
                      _key: Key | null | undefined;
                      asset: { url: string };
                    }) => (
                      <Image
                        key={image._key}
                        src={image.asset.url}
                        alt={event.title || "Event Flyer"}
                        width={600}
                        height={300}
                      />
                    )
                  )
                ) : (
                  <span>Missing Flyer</span>
                )}
              </div>
              {/* <div className="flex justify-center space-x-5">
                <span>{event.eventName}</span>
                <span>
                  {new Date(event.eventDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div> */}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
