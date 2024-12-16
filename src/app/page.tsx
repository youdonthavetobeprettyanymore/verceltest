// src/app/page.tsx

import Link from "next/link";
import Image from "next/image";
import { type SanityDocument } from "next-sanity";
import { client } from "./sanity/client";

export const metadata = {
  title: "DAW",
  description: "DAW Homepage",
};

const POSTS_QUERY = `*[
  _type == "event"
  && defined(slug.current)
]|order(eventDate desc)[0...12]{
  _id,
  title,
  slug,
  eventLineup,
  eventDate,
  location,
  eventName,
  images[]{
    _key,
    asset->{
      _id,
      url
    }
  }
}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  // Fetch posts if needed
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <main className="container mx-auto max-w-[1200px] p-8 flex flex-col items-center justify-center min-h-screen">
      {/* DAW Logo */}
      <div>
        <Image
          src="/assets/dawlogocropped.png"
          alt="DAW Logo"
          width={1080}
          height={1080}
          priority
        />
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul className="flex flex-wrap justify-center space-x-8 text-4xl p-5">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/connect">Connect</Link>
          </li>
          <li>
            <Link href="/upcoming">Upcoming</Link>
          </li>
          <li>
            <Link href="/archive">Archive</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
