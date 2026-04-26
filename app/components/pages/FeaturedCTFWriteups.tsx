import Link from "next/link";
import Image from "next/legacy/image";
import { featuredCTFWriteupsQuery } from "@/lib/sanity.query";
import type { CTFWriteupType } from "@/types";
import { sanityFetch } from "@/lib/sanity.client";

const fallbackImage =
  "https://res.cloudinary.com/victoreke/image/upload/v1692636087/victoreke/blog.png";

export default async function FeaturedCTFWriteups({
  params,
}: {
  params?: string;
}) {
  const featuredWriteups: CTFWriteupType[] = await sanityFetch({
    query: featuredCTFWriteupsQuery,
    tags: ["ctfWriteup"],
  });

  return (
    <>
      {featuredWriteups.map((writeup) =>
        writeup.slug === params ? null : (
          <article key={writeup._id} className="mb-4">
            <Link
              href={`/ctf-writeups/${writeup.slug}`}
              className="flex flex-col gap-4 dark:bg-primary-bg bg-secondary-bg p-5 rounded-lg border dark:border-zinc-800 border-zinc-200"
            >
              <Image
                src={writeup.coverImage?.image || fallbackImage}
                className="dark:bg-zinc-800 bg-zinc-100 rounded-md object-cover"
                alt={writeup.coverImage?.alt || writeup.title}
                width={400}
                height={230}
                placeholder={writeup.coverImage ? "blur" : "empty"}
                blurDataURL={writeup.coverImage?.lqip || ""}
                quality={100}
                loading="lazy"
              />
              <div className="max-w-lg">
                <p className="text-xs uppercase tracking-[0.18em] dark:text-primary-color text-secondary-color mb-2">
                  {writeup.platform} / {writeup.category}
                </p>
                <h2 className="max-w-sm text-lg tracking-tight mb-4">
                  {writeup.title}
                </h2>
                <p className="dark:text-zinc-400 text-zinc-600 text-sm">
                  {writeup.description.slice(0, 80).padEnd(83, "...")}
                </p>
              </div>
            </Link>
          </article>
        )
      )}
    </>
  );
}
