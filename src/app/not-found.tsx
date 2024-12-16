import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* DAW Logo */}
      <div className="mb-8">
        <Image
          src="/assets/dawlogocropped.png"
          alt="DAW Logo"
          width={600} // Adjust size as needed
          height={400}
          priority // Ensures the image loads quickly
        />
      </div>

      {/* 404 Message */}
      <h1 className="text-4xl font-bold text-black mb-4">
        404 | Page Not Found
      </h1>

      {/* Navlink */}
      <Link href="/" className="text-hot-pink hover:underline">
        Go back home
      </Link>
    </div>
  );
}
