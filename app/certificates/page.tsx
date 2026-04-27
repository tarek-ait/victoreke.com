import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { BiBadgeCheck, BiLinkExternal } from "react-icons/bi";
import { getCredlyCertificatesPageData } from "@/lib/credly";
import EmptyState from "../components/shared/EmptyState";
import { Slide } from "../animation/Slide";
import PageHeading from "../components/shared/PageHeading";
import { formatDate } from "../utils/date";

export const metadata: Metadata = {
  title: "Certificates | Tarek Ait Ahmed",
  metadataBase: new URL("https://victoreke.com/certificates"),
  description: "Explore public Credly badges, skills, and certificates earned by Tarek Ait Ahmed.",
  openGraph: {
    title: "Certificates | Tarek Ait Ahmed",
    url: "https://victoreke.com/certificates",
    description:
      "Explore public Credly badges, skills, and certificates earned by Tarek Ait Ahmed.",
    images:
      "https://res.cloudinary.com/victoreke/image/upload/v1692636087/victoreke/projects.png",
  },
};

export const revalidate = 60 * 60 * 12;

export default async function CertificatesPage() {
  const { badges, profile, skills } = await getCredlyCertificatesPageData();

  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6">
      <PageHeading
        title="Certificates"
        description={`A live Credly-powered view of ${profile.displayName}'s public badges, certifications, and the skills attached to each one.`}
      />

      <Slide delay={0.06}>
        <section className="grid lg:grid-cols-[1.1fr,0.9fr] gap-5 mb-8">
          <div className="dark:bg-primary-bg bg-zinc-50 border dark:border-zinc-800 border-zinc-200 rounded-lg p-5">
            <p className="text-sm uppercase tracking-[0.18em] dark:text-primary-color text-secondary-color mb-4">
              Credly Sync
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm dark:text-zinc-500 text-zinc-500 mb-1">
                  Public badges
                </p>
                <p className="text-3xl font-incognito font-semibold tracking-tight">
                  {badges.length}
                </p>
              </div>
              <div>
                <p className="text-sm dark:text-zinc-500 text-zinc-500 mb-1">
                  Skills mapped
                </p>
                <p className="text-3xl font-incognito font-semibold tracking-tight">
                  {skills.length}
                </p>
              </div>
              <div>
                <p className="text-sm dark:text-zinc-500 text-zinc-500 mb-1">
                  Source
                </p>
                <p className="text-lg tracking-tight">Credly</p>
              </div>
            </div>
          </div>

          <a
            href={profile.publicProfileUrl}
            rel="noreferrer noopener"
            target="_blank"
            className="dark:bg-primary-bg bg-zinc-50 border dark:border-zinc-800 border-zinc-200 rounded-lg p-5 flex flex-col justify-between hover:dark:border-zinc-700 hover:border-zinc-300 duration-200"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.18em] dark:text-primary-color text-secondary-color mb-4">
                Public Profile
              </p>
              <h2 className="text-2xl font-incognito font-semibold tracking-tight mb-3">
                View the full Credly profile
              </h2>
              <p className="dark:text-zinc-400 text-zinc-600 leading-relaxed">
                Open the live source profile, verify badge ownership, and browse the original credential pages directly on Credly.
              </p>
            </div>
            <div className="flex items-center gap-x-2 mt-6 text-sm">
              <BiLinkExternal aria-hidden="true" />
              <span>Open Credly</span>
            </div>
          </a>
        </section>
      </Slide>

      {skills.length > 0 ? (
        <Slide delay={0.08}>
          <section className="dark:bg-primary-bg bg-zinc-50 border dark:border-zinc-800 border-zinc-200 rounded-lg p-5 mb-10">
            <div className="flex items-center gap-x-3 mb-4">
              <BiBadgeCheck className="text-lg" />
              <h2 className="text-xl font-semibold tracking-tight">
                Skills Snapshot
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 rounded-md px-3 py-2"
                >
                  <p className="text-sm font-medium tracking-tight">
                    {skill.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs dark:text-zinc-500 text-zinc-500 uppercase tracking-[0.14em]">
                    <span>{skill.badgeCount} badge{skill.badgeCount > 1 ? "s" : ""}</span>
                    {skill.inDemand ? <span>In Demand</span> : null}
                    {skill.futureProof ? <span>Future Proof</span> : null}
                    {skill.trending ? <span>Trending</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Slide>
      ) : null}

      <Slide delay={0.1}>
        {badges.length > 0 ? (
          <section className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mb-12">
            {badges.map((badge) => (
              <Link
                href={`/certificates/${badge.id}`}
                key={badge.id}
                className="dark:bg-primary-bg bg-zinc-50 border border-transparent dark:hover:border-zinc-700 hover:border-zinc-200 p-5 rounded-lg"
              >
                <div className="flex items-start gap-x-4 mb-4">
                  {badge.imageUrl ? (
                    <Image
                      src={badge.imageUrl}
                      width={60}
                      height={60}
                      alt={badge.title}
                      className="dark:bg-zinc-800 bg-zinc-100 rounded-md p-2 object-cover"
                    />
                  ) : (
                    <div className="w-[60px] h-[60px] shrink-0 dark:bg-zinc-800 bg-zinc-100 rounded-md grid place-content-center text-2xl">
                      ✓
                    </div>
                  )}
                  <div>
                    <p className="text-sm dark:text-primary-color text-secondary-color mb-1">
                      {badge.issuerName}
                    </p>
                    <h2 className="text-lg tracking-wide">{badge.title}</h2>
                  </div>
                </div>

                <p className="text-sm dark:text-zinc-400 text-zinc-600 mb-4">
                  {badge.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] dark:text-zinc-500 text-zinc-500">
                  <span>{formatDate(badge.issuedAtDate)}</span>
                  {badge.typeCategory ? (
                    <>
                      <span>/</span>
                      <span>{badge.typeCategory}</span>
                    </>
                  ) : null}
                  {badge.level ? (
                    <>
                      <span>/</span>
                      <span>{badge.level}</span>
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
