import Image from "next/legacy/image";
import Link from "next/link";
import { toPlainText } from "@portabletext/react";
import { BiSolidTime } from "react-icons/bi";
import { HiCalendar } from "react-icons/hi";
import { ctfWriteupsQuery } from "@/lib/sanity.query";
import type { CTFWriteupType } from "@/types";
import EmptyState from "../shared/EmptyState";
import { formatDate } from "@/app/utils/date";
import { readTime } from "@/app/utils/readTime";
import { sanityFetch } from "@/lib/sanity.client";

const fallbackImage =
  "https://res.cloudinary.com/victoreke/image/upload/v1692636087/victoreke/blog.png";

export default async function CTFWriteups() {
  const writeups: CTFWriteupType[] = await sanityFetch({
    query: ctfWriteupsQuery,
    tags: ["ctfWriteup"],
  });

  const publishedWriteups = writeups.filter((writeup) => writeup.isPublished);

  return (
    <section>
      {publishedWriteups.length > 0 ? (
        <div className="flex flex-col lg:max-w-[950px] max-w-full lg:gap-y-8 gap-y-12 mb-12">
          {publishedWriteups.map((writeup) => (
            <article key={writeup._id}>
              <Link
                href={`/ctf-writeups/${writeup.slug}`}
                className="flex lg:flex-row flex-col lg:items-center items-start gap-8 dark:bg-primary-bg bg-secondary-bg p-6 rounded-lg border dark:border-zinc-800 border-zinc-200 group"
              >
                <div className="relative lg:w-[450px] lg:h-52 w-full h-56 overflow-clip">
                  <Image
                    src={writeup.coverImage?.image || fallbackImage}
                    className="dark:bg-zinc-800 bg-zinc-100 rounded-md object-cover group-hover:scale-125 duration-300"
                    alt={writeup.coverImage?.alt || writeup.title}
                    layout="fill"
                    placeholder={writeup.coverImage ? "blur" : "empty"}
                    blurDataURL={writeup.coverImage?.lqip || ""}
                  />
                </div>
                <div className="max-w-lg">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] dark:text-primary-color text-secondary-color mb-3">
                    <span>{writeup.platform}</span>
                    <span>/</span>
                    <span>{writeup.category}</span>
                    {writeup.difficulty ? (
                      <>
                        <span>/</span>
                        <span>{writeup.difficulty}</span>
                      </>
                    ) : null}
                  </div>
                  <h2 className="max-w-sm text-2xl font-semibold tracking-tight mb-4">
                    {writeup.title}
                  </h2>
                  <p className="dark:text-zinc-400 text-zinc-600 text-[0.95rem]">
                    {writeup.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm">
                    <div className="flex items-center gap-x-2">
                      <HiCalendar />
                      <time
                        dateTime={writeup.date ? writeup.date : writeup._createdAt}
                      >
                        {writeup.date
                          ? formatDate(writeup.date)
                          : formatDate(writeup._createdAt)}
                      </time>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <BiSolidTime />
                      <div>{readTime(toPlainText(writeup.body || []))}</div>
                    </div>
                    {typeof writeup.points === "number" ? (
                      <div className="dark:text-zinc-500 text-zinc-500">
                        {writeup.points} pts
                      </div>
                    ) : null}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState value="CTF Writeups" />
      )}
    </section>
  );
}
