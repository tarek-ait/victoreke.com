import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BiBadgeCheck, BiChevronRight, BiLinkExternal } from "react-icons/bi";
import { HiCalendar } from "react-icons/hi";
import { getCredlyBadgeDetail } from "@/lib/credly";
import { Slide } from "@/app/animation/Slide";
import { formatDate } from "@/app/utils/date";

type Props = {
  params: {
    certificate: string;
  };
};

const fallbackImage =
  "https://res.cloudinary.com/victoreke/image/upload/v1692636087/victoreke/projects.png";

export const revalidate = 60 * 60 * 12;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCredlyBadgeDetail(params.certificate);

  if (!data) {
    notFound();
  }

  const { badge } = data;

  return {
    title: `${badge.title} | Certificate`,
    metadataBase: new URL(
      `https://victoreke.com/certificates/${badge.id}`
    ),
    description: badge.description,
    openGraph: {
      title: `${badge.title} | Certificate`,
      url: `https://victoreke.com/certificates/${badge.id}`,
      description: badge.description,
      images: badge.imageUrl || fallbackImage,
    },
  };
}

export default async function Certificate({ params }: Props) {
  const data = await getCredlyBadgeDetail(params.certificate);

  if (!data) {
    notFound();
  }

  const { badge, profile } = data;

  return (
    <main className="max-w-6xl mx-auto lg:px-16 px-8">
      <header>
        <Slide className="relative flex items-center gap-x-2 border-b dark:border-zinc-800 border-zinc-200 pb-8 mb-10">
          <Link
            href="/certificates"
            className="whitespace-nowrap dark:text-zinc-400 text-zinc-400 hover:dark:text-white hover:text-zinc-700 text-sm border-b dark:border-zinc-700 border-zinc-200"
          >
            cd ..
          </Link>
          <BiChevronRight />
          <p className="text-zinc-400 text-sm truncate">{badge.title}</p>
        </Slide>
      </header>

      <Slide>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-start justify-between flex-wrap mb-4 gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] dark:text-primary-color text-secondary-color mb-3">
                {badge.issuerName}
              </p>
              <h1 className="font-incognito font-black tracking-tight sm:text-5xl text-3xl max-w-2xl">
                {badge.title}
              </h1>
            </div>

            <a
              href={badge.verifyUrl}
              rel="noreferrer noopener"
              target="_blank"
              className="flex items-center gap-x-2 dark:bg-primary-bg bg-secondary-bg dark:text-white text-zinc-700 border border-transparent rounded-md px-4 py-2 duration-200 cursor-pointer hover:dark:border-zinc-700 hover:border-zinc-200"
            >
              <BiLinkExternal aria-hidden="true" />
              Verify Credential
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-md mb-8 dark:text-zinc-400 text-zinc-600">
            <div className="flex items-center gap-x-2">
              <HiCalendar />
              <time dateTime={badge.issuedAtDate}>
                Issued {formatDate(badge.issuedAtDate)}
              </time>
            </div>
            {badge.expiresAtDate ? (
              <div className="flex items-center gap-x-2">
                <BiBadgeCheck />
                <span>Expires {formatDate(badge.expiresAtDate)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-x-2">
                <BiBadgeCheck />
                <span>Does not expire</span>
              </div>
            )}
          </div>

          <p className="max-w-2xl text-base dark:text-zinc-400 text-zinc-600 leading-relaxed mb-8">
            {badge.description}
          </p>

          <div className="relative w-full h-40 pt-[52.5%]">
            <Image
              className="rounded-xl border dark:border-zinc-800 border-zinc-100 object-cover"
              fill
              src={badge.imageUrl || fallbackImage}
              alt={badge.title}
              quality={100}
            />
          </div>

          <section className="grid sm:grid-cols-2 xl:grid-cols-4 grid-cols-1 gap-4 my-8">
            <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-4">
              <p className="text-sm dark:text-zinc-500 text-zinc-500 mb-2">
                Issuer
              </p>
              <p className="text-lg tracking-tight">{badge.issuerName}</p>
            </div>
            <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-4">
              <p className="text-sm dark:text-zinc-500 text-zinc-500 mb-2">
                Issued To
              </p>
              <p className="text-lg tracking-tight">{badge.issuedTo}</p>
            </div>
            <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-4">
              <p className="text-sm dark:text-zinc-500 text-zinc-500 mb-2">
                Type
              </p>
              <p className="text-lg tracking-tight">
                {badge.typeCategory || "Credential"}
              </p>
            </div>
            <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-4">
              <p className="text-sm dark:text-zinc-500 text-zinc-500 mb-2">
                Credential ID
              </p>
              <p className="text-lg tracking-tight break-all">{badge.id}</p>
            </div>
          </section>

          {badge.level ? (
            <section className="border-b dark:border-zinc-800 border-zinc-200 pb-8 mb-8">
              <h2 className="text-xl font-semibold tracking-tight mb-4">
                Level
              </h2>
              <div className="dark:bg-primary-bg bg-zinc-100 border dark:border-zinc-800 border-zinc-200 rounded-md px-3 py-2 inline-flex text-sm">
                {badge.level}
              </div>
            </section>
          ) : null}

          {badge.skills.length > 0 ? (
            <section className="border-b dark:border-zinc-800 border-zinc-200 pb-8 mb-8">
              <h2 className="text-xl font-semibold tracking-tight mb-4">
                Skills
              </h2>
              <ul className="flex flex-wrap items-center gap-2 tracking-tight">
                {badge.skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="dark:bg-primary-bg bg-zinc-100 border dark:border-zinc-800 border-zinc-200 rounded-md px-2 py-1 text-sm"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {badge.criteria.length > 0 ? (
            <section className="border-b dark:border-zinc-800 border-zinc-200 pb-8 mb-8">
              <h2 className="text-xl font-semibold tracking-tight mb-4">
                Earning Criteria
              </h2>
              <div className="space-y-3">
                {badge.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-4"
                  >
                    <p className="text-sm uppercase tracking-[0.16em] dark:text-primary-color text-secondary-color mb-2">
                      {criterion.activityType}
                    </p>
                    <p className="dark:text-zinc-400 text-zinc-600 leading-relaxed">
                      {criterion.title}
                    </p>
                    {criterion.url ? (
                      <a
                        href={criterion.url}
                        rel="noreferrer noopener"
                        target="_blank"
                        className="inline-flex items-center gap-x-2 mt-3 text-sm hover:underline"
                      >
                        <BiLinkExternal aria-hidden="true" />
                        Learn more
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {badge.relatedBadges.length > 0 ? (
            <section className="border-b dark:border-zinc-800 border-zinc-200 pb-8 mb-8">
              <h2 className="text-xl font-semibold tracking-tight mb-4">
                Related Badges
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {badge.relatedBadges.map((relatedBadge) => (
                  <a
                    key={relatedBadge.id}
                    href={relatedBadge.url}
                    rel="noreferrer noopener"
                    target="_blank"
                    className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-4 hover:dark:border-zinc-700 hover:border-zinc-300 duration-200"
                  >
                    <div className="flex items-center gap-x-4">
                      {relatedBadge.imageUrl ? (
                        <Image
                          src={relatedBadge.imageUrl}
                          width={52}
                          height={52}
                          alt={relatedBadge.name}
                          className="rounded-md object-cover"
                        />
                      ) : null}
                      <div>
                        <p className="font-medium tracking-tight">
                          {relatedBadge.name}
                        </p>
                        <div className="flex items-center gap-x-2 mt-2 text-sm dark:text-zinc-500 text-zinc-500">
                          <BiLinkExternal aria-hidden="true" />
                          <span>View on Credly</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          <section className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 rounded-lg p-5">
            <p className="text-sm uppercase tracking-[0.18em] dark:text-primary-color text-secondary-color mb-3">
              Source of truth
            </p>
            <h2 className="text-2xl font-incognito font-semibold tracking-tight mb-3">
              Open the original record on Credly
            </h2>
            <p className="dark:text-zinc-400 text-zinc-600 leading-relaxed mb-5">
              This certificate page is generated from {profile.displayName}
              &apos;s public Credly profile and stays in sync automatically.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={badge.verifyUrl}
                rel="noreferrer noopener"
                target="_blank"
                className="flex items-center gap-x-2 dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 rounded-md px-4 py-2"
              >
                <BiLinkExternal aria-hidden="true" />
                View badge on Credly
              </a>
              <a
                href={profile.publicProfileUrl}
                rel="noreferrer noopener"
                target="_blank"
                className="flex items-center gap-x-2 dark:bg-zinc-900 bg-white border dark:border-zinc-800 border-zinc-200 rounded-md px-4 py-2"
              >
                <BiLinkExternal aria-hidden="true" />
                View public profile
              </a>
            </div>
          </section>
        </div>
      </Slide>
    </main>
  );
}
