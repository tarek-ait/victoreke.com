import Image from "next/legacy/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText, toPlainText } from "@portabletext/react";
import { BiChevronRight, BiSolidTime } from "react-icons/bi";
import { HiCalendar, HiChat } from "react-icons/hi";
import type { CTFWriteupType } from "@/types";
import { singleCTFWriteupQuery } from "@/lib/sanity.query";
import { CustomPortableText } from "@/app/components/shared/CustomPortableText";
import { formatDate } from "@/app/utils/date";
import SharePost from "@/app/components/shared/SharePost";
import FeaturedCTFWriteups from "@/app/components/pages/FeaturedCTFWriteups";
import { Slide } from "@/app/animation/Slide";
import Comments from "@/app/components/shared/Comments";
import { sanityFetch } from "@/lib/sanity.client";
import { readTime } from "@/app/utils/readTime";
import PageHeading from "@/app/components/shared/PageHeading";

type Props = {
  params: {
    writeup: string;
  };
};

const fallbackImage =
  "https://res.cloudinary.com/victoreke/image/upload/v1692636087/victoreke/blog.png";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const writeup: CTFWriteupType | null = await sanityFetch({
    query: singleCTFWriteupQuery,
    tags: ["ctfWriteup"],
    qParams: { slug: params.writeup },
  });

  if (!writeup || !writeup.isPublished) {
    notFound();
  }

  return {
    title: writeup.title,
    metadataBase: new URL(`https://victoreke.com/ctf-writeups/${writeup.slug}`),
    description: writeup.description,
    keywords: writeup.tags,
    openGraph: {
      images: writeup.coverImage?.image || fallbackImage,
      url: `https://victoreke.com/ctf-writeups/${writeup.slug}`,
      title: writeup.title,
      description: writeup.description,
      type: "article",
      siteName: "victoreke.com",
      tags: writeup.tags,
      publishedTime: writeup.date || writeup._createdAt,
      modifiedTime: writeup._updatedAt || "",
    },
    twitter: {
      title: writeup.title,
      description: writeup.description,
      images: writeup.coverImage?.image || fallbackImage,
      card: "summary_large_image",
    },
  };
}

export default async function CTFWriteup({ params }: Props) {
  const writeup: CTFWriteupType | null = await sanityFetch({
    query: singleCTFWriteupQuery,
    tags: ["ctfWriteup"],
    qParams: { slug: params.writeup },
  });

  if (!writeup || !writeup.isPublished) {
    notFound();
  }

  const words = toPlainText(writeup.body || []);

  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6">
      <header>
        <Slide className="relative flex items-center gap-x-2 border-b dark:border-zinc-800 border-zinc-200 pb-8">
          <Link
            href="/ctf-writeups"
            className="whitespace-nowrap dark:text-zinc-400 text-zinc-400 hover:dark:text-white hover:text-zinc-700 text-sm border-b dark:border-zinc-700 border-zinc-200"
          >
            cd ..
          </Link>
          <BiChevronRight />
          <p className="text-zinc-400 text-sm truncate">{writeup.title}</p>
        </Slide>
      </header>

      <article>
        <Slide
          className="grid lg:grid-cols-[75%,25%] grid-cols-1 relative"
          delay={0.1}
        >
          <div className="min-h-full lg:border-r border-r-0 dark:border-zinc-800 border-zinc-200 pt-10 pb-4 lg:pr-6 px-0">
            <div className="flex flex-wrap items-center gap-4 text-md mb-8 dark:text-zinc-400 text-zinc-600">
              <div className="flex items-center gap-x-2">
                <HiCalendar />
                <time dateTime={writeup.date ? writeup.date : writeup._createdAt}>
                  {writeup.date
                    ? formatDate(writeup.date)
                    : formatDate(writeup._createdAt)}
                </time>
              </div>
              <div className="flex items-center gap-x-2">
                <BiSolidTime />
                <div>{readTime(words)}</div>
              </div>
              <Link
                href="#comments"
                className="flex items-center gap-x-2 dark:text-primary-color text-tertiary-color"
              >
                <HiChat />
                <div>Comments</div>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] dark:text-primary-color text-secondary-color mb-4">
              <span>{writeup.platform}</span>
              <span>/</span>
              <span>{writeup.category}</span>
              {writeup.difficulty ? (
                <>
                  <span>/</span>
                  <span>{writeup.difficulty}</span>
                </>
              ) : null}
              {typeof writeup.points === "number" ? (
                <>
                  <span>/</span>
                  <span>{writeup.points} pts</span>
                </>
              ) : null}
            </div>

            <PageHeading title={writeup.title} description={writeup.description} />

            <div className="relative w-full h-40 pt-[52.5%]">
              <Image
                className="rounded-xl border dark:border-zinc-800 border-zinc-100 object-cover"
                layout="fill"
                src={writeup.coverImage?.image || fallbackImage}
                alt={writeup.coverImage?.alt || writeup.title}
                quality={100}
                placeholder={writeup.coverImage?.lqip ? "blur" : "empty"}
                blurDataURL={writeup.coverImage?.lqip || ""}
              />
            </div>

            <div className="mt-8 dark:text-zinc-400 text-zinc-600 leading-relaxed tracking-tight text-lg">
              <PortableText
                value={writeup.body || []}
                components={CustomPortableText}
              />
            </div>
          </div>

          <aside className="flex flex-col lg:max-h-full h-max gap-y-8 sticky top-2 bottom-auto right-0 py-10 lg:px-6 px-0">
            <section className="border-b dark:border-zinc-800 border-zinc-200 pb-10">
              <h3 className="text-xl font-semibold tracking-tight mb-4">
                Challenge Details
              </h3>
              <ul className="flex flex-col gap-y-3 dark:text-zinc-400 text-zinc-600">
                <li>
                  <span className="text-sm dark:text-zinc-500 text-zinc-500 block">
                    Platform
                  </span>
                  {writeup.platform}
                </li>
                <li>
                  <span className="text-sm dark:text-zinc-500 text-zinc-500 block">
                    Category
                  </span>
                  {writeup.category}
                </li>
                {writeup.difficulty ? (
                  <li>
                    <span className="text-sm dark:text-zinc-500 text-zinc-500 block">
                      Difficulty
                    </span>
                    {writeup.difficulty}
                  </li>
                ) : null}
                {typeof writeup.points === "number" ? (
                  <li>
                    <span className="text-sm dark:text-zinc-500 text-zinc-500 block">
                      Points
                    </span>
                    {writeup.points}
                  </li>
                ) : null}
              </ul>
            </section>

            <section className="border-b dark:border-zinc-800 border-zinc-200 pb-10">
              <h3 className="text-xl font-semibold tracking-tight mb-4">Tags</h3>
              <ul className="flex flex-wrap items-center gap-2 tracking-tight">
                {writeup.tags.map((tag) => (
                  <li
                    key={tag}
                    className="dark:bg-primary-bg bg-zinc-100 border dark:border-zinc-800 border-zinc-200 rounded-md px-2 py-1 text-sm"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </section>

            <SharePost
              title={writeup.title}
              slug={writeup.slug}
              description={writeup.description}
              baseUrl="https://victoreke.com/ctf-writeups/"
              shareTitle="Share Writeup"
              twitterText="Thank you @victoreke for sharing this CTF writeup."
              whatsappText="Read this CTF writeup by Victor Eke"
            />

            <section className="border-b dark:border-zinc-800 border-zinc-200 pb-10">
              <h3 className="text-xl font-semibold tracking-tight mb-4">
                Featured
              </h3>
              <FeaturedCTFWriteups params={params.writeup} />
            </section>
          </aside>
        </Slide>
      </article>

      <section
        id="comments"
        className="max-w-3xl mt-10 lg:border-t dark:border-zinc-800 border-zinc-200 lg:py-10 pt-0"
      >
        <h3 className="lg:text-4xl text-3xl font-semibold tracking-tight mb-8">
          Comments
        </h3>
        <Comments />
      </section>
    </main>
  );
}
