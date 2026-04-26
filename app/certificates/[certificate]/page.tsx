import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { BiBadgeCheck, BiLinkExternal } from "react-icons/bi";
import { HiCalendar } from "react-icons/hi";
import { singleCertificateQuery } from "@/lib/sanity.query";
import type { CertificateType } from "@/types";
import { CustomPortableText } from "@/app/components/shared/CustomPortableText";
import { Slide } from "@/app/animation/Slide";
import { sanityFetch } from "@/lib/sanity.client";
import { formatDate } from "@/app/utils/date";

type Props = {
  params: {
    certificate: string;
  };
};

const fallbackImage =
  "https://res.cloudinary.com/victoreke/image/upload/v1692636087/victoreke/projects.png";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const certificate: CertificateType | null = await sanityFetch({
    query: singleCertificateQuery,
    tags: ["certificate"],
    qParams: { slug: params.certificate },
  });

  if (!certificate) {
    notFound();
  }

  return {
    title: `${certificate.title} | Certificate`,
    metadataBase: new URL(
      `https://victoreke.com/certificates/${certificate.slug}`
    ),
    description: certificate.description,
    openGraph: {
      title: `${certificate.title} | Certificate`,
      url: `https://victoreke.com/certificates/${certificate.slug}`,
      description: certificate.description,
      images: certificate.coverImage?.image || fallbackImage,
    },
  };
}

export default async function Certificate({ params }: Props) {
  const certificate: CertificateType | null = await sanityFetch({
    query: singleCertificateQuery,
    tags: ["certificate"],
    qParams: { slug: params.certificate },
  });

  if (!certificate) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto lg:px-16 px-8">
      <Slide>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between flex-wrap mb-4 gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] dark:text-primary-color text-secondary-color mb-3">
                {certificate.issuer}
              </p>
              <h1 className="font-incognito font-black tracking-tight sm:text-5xl text-3xl max-w-2xl">
                {certificate.title}
              </h1>
            </div>

            <a
              href={certificate.credentialUrl}
              rel="noreferrer noopener"
              target="_blank"
              className={`flex items-center gap-x-2 dark:bg-primary-bg bg-secondary-bg dark:text-white text-zinc-700 border border-transparent rounded-md px-4 py-2 duration-200 ${
                !certificate.credentialUrl
                  ? "cursor-not-allowed opacity-80"
                  : "cursor-pointer hover:dark:border-zinc-700 hover:border-zinc-200"
              }`}
            >
              <BiLinkExternal aria-hidden="true" />
              {certificate.credentialUrl ? "Verify Credential" : "Verification Unavailable"}
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-md mb-8 dark:text-zinc-400 text-zinc-600">
            <div className="flex items-center gap-x-2">
              <HiCalendar />
              <time dateTime={certificate.issueDate}>
                Issued {formatDate(certificate.issueDate)}
              </time>
            </div>
            {certificate.expiryDate ? (
              <div className="flex items-center gap-x-2">
                <BiBadgeCheck />
                <span>Expires {formatDate(certificate.expiryDate)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                <BiBadgeCheck />
                <span>Does not expire</span>
              </div>
            )}
          </div>

          <p className="max-w-2xl text-base dark:text-zinc-400 text-zinc-600 leading-relaxed mb-8">
            {certificate.description}
          </p>

          <div className="relative w-full h-40 pt-[52.5%]">
            <Image
              className="rounded-xl border dark:border-zinc-800 border-zinc-100 object-cover"
              fill
              src={certificate.coverImage?.image || fallbackImage}
              alt={certificate.coverImage?.alt || certificate.title}
              quality={100}
              placeholder={certificate.coverImage?.lqip ? "blur" : "empty"}
              blurDataURL={certificate.coverImage?.lqip || ""}
            />
          </div>

          <section className="grid sm:grid-cols-2 grid-cols-1 gap-4 my-8">
            <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-4">
              <p className="text-sm dark:text-zinc-500 text-zinc-500 mb-2">
                Issuer
              </p>
              <p className="text-lg tracking-tight">{certificate.issuer}</p>
            </div>
            <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-4">
              <p className="text-sm dark:text-zinc-500 text-zinc-500 mb-2">
                Credential ID
              </p>
              <p className="text-lg tracking-tight">
                {certificate.credentialId || "Not provided"}
              </p>
            </div>
          </section>

          {certificate.tags && certificate.tags.length > 0 ? (
            <section className="border-b dark:border-zinc-800 border-zinc-200 pb-8 mb-8">
              <h2 className="text-xl font-semibold tracking-tight mb-4">Tags</h2>
              <ul className="flex flex-wrap items-center gap-2 tracking-tight">
                {certificate.tags.map((tag) => (
                  <li
                    key={tag}
                    className="dark:bg-primary-bg bg-zinc-100 border dark:border-zinc-800 border-zinc-200 rounded-md px-2 py-1 text-sm"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-8 dark:text-zinc-400 text-zinc-600 leading-relaxed">
            <PortableText
              value={certificate.body || []}
              components={CustomPortableText}
            />
          </div>
        </div>
      </Slide>
    </main>
  );
}
