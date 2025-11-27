"use client";

import dynamic from "next/dynamic";

// ✅ Dynamic import allowed here in client component
const SignatureMakerClient = dynamic(() => import("./SignatureMakerClient"), {
  ssr: false,
});

export default function SignatureMakerWrapper() {
  return <SignatureMakerClient />;
}
