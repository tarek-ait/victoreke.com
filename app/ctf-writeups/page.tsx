import { Metadata } from "next";
import { BiDetail } from "react-icons/bi";
import CTFWriteups from "../components/pages/CTFWriteups";
import { Slide } from "../animation/Slide";
import PageHeading from "@/app/components/shared/PageHeading";

export const metadata: Metadata = {
  title: "CTF Writeups | Victor Eke",
  metadataBase: new URL("https://victoreke.com/ctf-writeups"),
  description: "Challenge walkthroughs, notes, and lessons from CTF sessions.",
  openGraph: {
    title: "CTF Writeups | Victor Eke",
    url: "https://victoreke.com/ctf-writeups",
    description: "Challenge walkthroughs, notes, and lessons from CTF sessions.",
    images:
      "https://res.cloudinary.com/victoreke/image/upload/v1692636087/victoreke/blog.png",
  },
};

export default async function CTFWriteupsPage() {
  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6">
      <PageHeading
        title="CTF Writeups"
        description="A growing archive of challenge writeups, practical notes, and the exact problem-solving trails that made each flag click."
      />

      <Slide delay={0.1}>
        <div className="flex items-center gap-x-3 mb-8">
          <BiDetail />
          <h2 className="text-xl font-semibold tracking-tight">Explore All</h2>
        </div>
        <CTFWriteups />
      </Slide>
    </main>
  );
}
