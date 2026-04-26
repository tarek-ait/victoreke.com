import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { certificatesQuery } from "@/lib/sanity.query";
import type { CertificateType } from "@/types";
import EmptyState from "../components/shared/EmptyState";
import { Slide } from "../animation/Slide";
import { sanityFetch } from "@/lib/sanity.client";
import PageHeading from "../components/shared/PageHeading";
import { formatDate } from "../utils/date";

export const metadata: Metadata = {
  title: "Certificates | Victor Eke",
  metadataBase: new URL("https://victoreke.com/certificates"),
  description: "Explore certificates earned by Victor Eke.",
  openGraph: {
    title: "Certificates | Victor Eke",
    url: "https://victoreke.com/certificates",
    description: "Explore certificates earned by Victor Eke.",
    images:
      "https://res.cloudinary.com/victoreke/image/upload/v1692636087/victoreke/projects.png",
  },
};

export default async function CertificatesPage() {
  const certificates: CertificateType[] = await sanityFetch({
    query: certificatesQuery,
    tags: ["certificate"],
  });

  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6">
      <PageHeading
        title="Certificates"
        description="A curated collection of certifications, training milestones, and verifiable credentials that map the skills and systems I keep sharpening."
      />

      <Slide delay={0.1}>
        {certificates.length > 0 ? (
          <section className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mb-12">
            {certificates.map((certificate) => (
              <Link
                href={`/certificates/${certificate.slug}`}
                key={certificate._id}
                className="dark:bg-primary-bg bg-zinc-50 border border-transparent dark:hover:border-zinc-700 hover:border-zinc-200 p-5 rounded-lg"
              >
                <div className="flex items-start gap-x-4 mb-4">
                  {certificate.logo ? (
                    <Image
                      src={certificate.logo}
                      width={60}
                      height={60}
                      alt={certificate.title}
                      className="dark:bg-zinc-800 bg-zinc-100 rounded-md p-2 object-cover"
                    />
                  ) : (
                    <div className="w-[60px] h-[60px] shrink-0 dark:bg-zinc-800 bg-zinc-100 rounded-md grid place-content-center text-2xl">
                      ✓
                    </div>
                  )}
                  <div>
                    <p className="text-sm dark:text-primary-color text-secondary-color mb-1">
                      {certificate.issuer}
                    </p>
                    <h2 className="text-lg tracking-wide">{certificate.title}</h2>
                  </div>
                </div>

                <p className="text-sm dark:text-zinc-400 text-zinc-600 mb-4">
                  {certificate.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] dark:text-zinc-500 text-zinc-500">
                  <span>{formatDate(certificate.issueDate)}</span>
                  {certificate.tags?.[0] ? (
                    <>
                      <span>/</span>
                      <span>{certificate.tags[0]}</span>
                    </>
                  ) : null}
                </div>
              </Link>
            ))}
          </section>
        ) : (
          <EmptyState value="Certificates" />
        )}
      </Slide>
    </main>
  );
}
