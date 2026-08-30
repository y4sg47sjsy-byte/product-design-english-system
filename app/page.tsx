import type { Metadata } from "next";
import LearningApp from "./LearningApp";

export const metadata: Metadata = {
  title: "Product Design English System",
  description: "Turn your product design knowledge into usable professional English.",
};

export default function Home() {
  return <LearningApp />;
}
