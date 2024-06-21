"use client";
import { Example } from "@/components/Example";
import run  from "../utils/gemini"

  export default function Home() {
    run();
    return (
      <>
    <Example/>
    </>
  );
}
