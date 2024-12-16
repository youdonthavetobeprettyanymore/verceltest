"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/archive"); // this code essentially brings you back to where you last scrolled within the archive landing page.
      // this is so that annoying thing doesn't happen when you go back to previous page and it tkaes you back to the top.
      // then u have to scroll down again...
    }
  };

  return (
    <button onClick={handleBack} className="hover:underline text-left text-2xl">
      &#10913; Back To Archive.
    </button>
  );
}
