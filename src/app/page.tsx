import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "DAW",
  description: "DAW Homepage",
};

export default function IndexPage() {
  return (
    <main className="container mx-auto max-w-[1200px] p-8 flex flex-col items-center justify-center min-h-screen">
      {/* DAW Logo */}
      <div>
        <Image
          src="/assets/dawlogocropped.png"
          alt="DAW Logo"
          width={1080} // This is the large DAW logo on the landing page.
          height={1080} // Problem with the logo being distorted upon refresh is still not fixed. How do we fix that?
          priority
        />
      </div>

      {/* Nav Menu */}
      <nav>
        <ul className="flex flex-wrap justify-center space-x-8 text-4xl p-5">
          <li>
            <Link href="/">Home</Link>
            {/* Add some styling to nav bar options. Underling
             text on hover or something like that. */}
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
