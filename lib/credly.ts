import "server-only";

import { cache } from "react";
import type {
  CredlyBadge,
  CredlyBadgeActivity,
  CredlyProfile,
  CredlyRelatedBadge,
  CredlySkill,
  CredlySkillSummary,
} from "@/types";

const CREDLY_ORIGIN = "https://www.credly.com";
const DEFAULT_CREDLY_PROFILE_URL =
  "https://www.credly.com/users/ait_ahmed-tarek";
const CREDLY_REVALIDATE_SECONDS = 60 * 60 * 12;

type CredlyProfileIdentity = {
  profileUrl: string;
  badgesPageUrl: string;
  userId: string;
  displayName: string;
};

type CredlyResponseMetadata = {
  count?: number;
  current_page?: number;
  total_count?: number;
  total_pages?: number;
  per?: number;
  previous_page_url?: string | null;
  next_page_url?: string | null;
};

type CredlyRawSkill = {
  id: string;
  name: string;
  vanity_slug?: string;
  canonical?: boolean;
  faethm_id?: string;
};

type CredlyRawProfileSkill = {
  id: string;
  name: string;
  show: boolean;
  rank: number | null;
  has_badge: boolean;
  in_demand: boolean;
  future_proof: boolean;
  trending: boolean;
  evidence_count: number;
};

type CredlyRawEntity = {
  label?: string;
  primary?: boolean;
  entity?: {
    name?: string;
    vanity_url?: string;
    twitter_url?: string;
  };
};

type CredlyRawBadgeActivity = {
  id: string;
  activity_type: string;
  title: string;
  url: string | null;
};

type CredlyRawRelatedBadge = {
  id: string;
  name: string;
  image_url?: string;
  updated_at?: string;
  url: string;
};

type CredlyRawBadge = {
  id: string;
  expires_at_date: string | null;
  issued_at_date: string;
  issued_to: string;
  state: string;
  public: boolean;
  image_url?: string;
  issuer?: {
    entities?: CredlyRawEntity[];
  };
  badge_template: {
    name: string;
    description: string;
    url?: string;
    vanity_slug?: string;
    global_activity_url?: string | null;
    earn_this_badge_url?: string | null;
    type_category?: string | null;
    level?: string | null;
    image_url?: string;
    skills?: CredlyRawSkill[];
    badge_template_activities?: CredlyRawBadgeActivity[];
    issuer?: {
      entities?: CredlyRawEntity[];
    };
  };
  skills?: CredlyRawSkill[];
  related_badges?: CredlyRawRelatedBadge[];
  recommendations?: unknown[];
  printable?: boolean;
};

type CredlyPaginatedResponse<T> = {
  data: T[];
  metadata: CredlyResponseMetadata;
};

type CredlySingleResponse<T> = {
  data: T;
  metadata: Record<string, never>;
};

type CredlyCertificatesPageData = {
  profile: CredlyProfile;
  badges: CredlyBadge[];
  skills: CredlySkillSummary[];
};

function getCredlyProfileUrl() {
  return process.env.CREDLY_PROFILE_URL || DEFAULT_CREDLY_PROFILE_URL;
}

function makeCredlyUrl(pathOrUrl: string) {
  return new URL(pathOrUrl, CREDLY_ORIGIN).toString();
}

function getCredlyBadgesPageUrl(profileUrl: string) {
  const normalized = profileUrl.endsWith("/")
    ? profileUrl.slice(0, -1)
    : profileUrl;

  return normalized.endsWith("/badges")
    ? normalized
    : `${normalized}/badges`;
}

async function fetchCredlyText(url: string) {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; victoreke.com credly sync; +https://victoreke.com)",
    },
    next: {
      revalidate: CREDLY_REVALIDATE_SECONDS,
      tags: ["credly-profile"],
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Credly page: ${url}`);
  }

  return response.text();
}

async function fetchCredlyJson<T>(url: string, useAjaxHeaders = false) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(useAjaxHeaders ? { "X-Requested-With": "XMLHttpRequest" } : {}),
      "User-Agent":
        "Mozilla/5.0 (compatible; victoreke.com credly sync; +https://victoreke.com)",
    },
    next: {
      revalidate: CREDLY_REVALIDATE_SECONDS,
      tags: ["credly-profile"],
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Credly JSON: ${url}`);
  }

  return (await response.json()) as T;
}

function extractCredlyUserId(html: string) {
  const match = html.match(
    /<meta property="og:url" content="https:\/\/www\.credly\.com\/users\/([^"]+)"/i
  );

  return match?.[1] || null;
}

function extractCredlyDisplayName(html: string) {
  const firstName =
    html.match(/<meta property="profile:first_name" content="([^"]+)"/i)?.[1] ||
    "";
  const lastName =
    html.match(/<meta property="profile:last_name" content="([^"]+)"/i)?.[1] ||
    "";

  return `${firstName} ${lastName}`.replaceAll("_", " ").trim();
}

function normalizeSkill(skill: CredlyRawSkill): CredlySkill {
  return {
    id: skill.id,
    name: skill.name,
    vanitySlug: skill.vanity_slug || "",
    canonical: Boolean(skill.canonical),
    faethmId: skill.faethm_id || null,
  };
}

function normalizeActivities(
  activities: CredlyRawBadgeActivity[] | undefined
): CredlyBadgeActivity[] {
  return (activities || []).map((activity) => ({
    id: activity.id,
    activityType: activity.activity_type,
    title: activity.title,
    url: activity.url,
  }));
}

function normalizeRelatedBadges(
  badges: CredlyRawRelatedBadge[] | undefined
): CredlyRelatedBadge[] {
  return (badges || []).map((badge) => ({
    id: badge.id,
    name: badge.name,
    imageUrl: badge.image_url || "",
    updatedAt: badge.updated_at || null,
    url: badge.url,
  }));
}

function getIssuerDetails(rawBadge: CredlyRawBadge) {
  const issuerEntity =
    rawBadge.issuer?.entities?.find((entity) => entity.primary)?.entity ||
    rawBadge.badge_template?.issuer?.entities?.find((entity) => entity.primary)
      ?.entity;

  return {
    issuerName: issuerEntity?.name || "Credly Issuer",
    issuerUrl: issuerEntity?.vanity_url || null,
    issuerTwitterUrl: issuerEntity?.twitter_url || null,
  };
}

function normalizeBadge(rawBadge: CredlyRawBadge): CredlyBadge {
  const { issuerName, issuerUrl, issuerTwitterUrl } = getIssuerDetails(rawBadge);
  const rawSkills =
    rawBadge.skills && rawBadge.skills.length > 0
      ? rawBadge.skills
      : rawBadge.badge_template.skills || [];

  return {
    id: rawBadge.id,
    title: rawBadge.badge_template.name,
    description: rawBadge.badge_template.description,
    issuedAtDate: rawBadge.issued_at_date,
    expiresAtDate: rawBadge.expires_at_date,
    issuedTo: rawBadge.issued_to,
    issuerName,
    issuerUrl,
    issuerTwitterUrl,
    imageUrl: rawBadge.image_url || rawBadge.badge_template.image_url || "",
    badgeTemplateUrl: rawBadge.badge_template.url || null,
    verifyUrl: makeCredlyUrl(`/badges/${rawBadge.id}`),
    learnMoreUrl:
      rawBadge.badge_template.global_activity_url ||
      rawBadge.badge_template.earn_this_badge_url ||
      null,
    typeCategory: rawBadge.badge_template.type_category || null,
    level: rawBadge.badge_template.level || null,
    printable: Boolean(rawBadge.printable),
    public: Boolean(rawBadge.public),
    state: rawBadge.state,
    skills: rawSkills.map(normalizeSkill),
    criteria: normalizeActivities(rawBadge.badge_template.badge_template_activities),
    relatedBadges: normalizeRelatedBadges(rawBadge.related_badges),
  };
}

function aggregateSkills(
  badges: CredlyBadge[],
  profileSkills: CredlyRawProfileSkill[]
): CredlySkillSummary[] {
  const skillsMap = new Map<string, CredlySkillSummary>();

  for (const badge of badges) {
    for (const skill of badge.skills) {
      const existing = skillsMap.get(skill.id);

      if (!existing) {
        skillsMap.set(skill.id, {
          ...skill,
          badgeCount: 1,
          evidenceCount: null,
          hasBadge: true,
          inDemand: false,
          futureProof: false,
          trending: false,
        });
        continue;
      }

      existing.badgeCount += 1;
    }
  }

  const profileSkillByName = new Map(
    profileSkills.map((skill) => [skill.name.toLowerCase(), skill])
  );

  for (const skill of Array.from(skillsMap.values())) {
    const matchedProfileSkill = profileSkillByName.get(skill.name.toLowerCase());

    if (!matchedProfileSkill) {
      continue;
    }

    skill.evidenceCount = matchedProfileSkill.evidence_count;
    skill.hasBadge = matchedProfileSkill.has_badge;
    skill.inDemand = matchedProfileSkill.in_demand;
    skill.futureProof = matchedProfileSkill.future_proof;
    skill.trending = matchedProfileSkill.trending;
  }

  return Array.from(skillsMap.values()).sort((left, right) => {
    if (right.badgeCount !== left.badgeCount) {
      return right.badgeCount - left.badgeCount;
    }

    return left.name.localeCompare(right.name);
  });
}

const getCredlyProfileIdentity = cache(async (): Promise<CredlyProfileIdentity> => {
  const profileUrl = getCredlyProfileUrl();
  const badgesPageUrl = getCredlyBadgesPageUrl(profileUrl);
  const html = await fetchCredlyText(badgesPageUrl);
  const userId = extractCredlyUserId(html);

  if (!userId) {
    throw new Error("Unable to resolve Credly user id from public profile");
  }

  return {
    profileUrl,
    badgesPageUrl,
    userId,
    displayName: extractCredlyDisplayName(html),
  };
});

const getCredlyProfileSkills = cache(async () => {
  const { userId } = await getCredlyProfileIdentity();
  const url = makeCredlyUrl(
    `/api/v1/users/${userId}/user_faethm_skills/public?filter%5Bname%5D=`
  );

  const response = await fetchCredlyJson<CredlyPaginatedResponse<CredlyRawProfileSkill>>(
    url
  );

  return response.data || [];
});

const getCredlyBadges = cache(async (): Promise<CredlyBadge[]> => {
  const { userId } = await getCredlyProfileIdentity();
  const badges: CredlyBadge[] = [];
  let nextPageUrl = makeCredlyUrl(`/users/${userId}/badges?page=1&page_size=48`);

  while (nextPageUrl) {
    const response = await fetchCredlyJson<CredlyPaginatedResponse<CredlyRawBadge>>(
      nextPageUrl,
      true
    );

    badges.push(...(response.data || []).map(normalizeBadge));
    nextPageUrl = response.metadata.next_page_url
      ? makeCredlyUrl(response.metadata.next_page_url)
      : "";
  }

  return badges.sort((left, right) =>
    right.issuedAtDate.localeCompare(left.issuedAtDate)
  );
});

export const getCredlyCertificatesPageData = cache(
  async (): Promise<CredlyCertificatesPageData> => {
    const [identity, badges, profileSkills] = await Promise.all([
      getCredlyProfileIdentity(),
      getCredlyBadges(),
      getCredlyProfileSkills(),
    ]);

    const profile: CredlyProfile = {
      userId: identity.userId,
      displayName: badges[0]?.issuedTo || identity.displayName || "Tarek Ait Ahmed",
      publicProfileUrl: identity.profileUrl,
      badgesPageUrl: identity.badgesPageUrl,
      badgeCount: badges.length,
    };

    return {
      profile,
      badges,
      skills: aggregateSkills(badges, profileSkills),
    };
  }
);

export const getCredlyBadgeDetail = cache(async (badgeId: string) => {
  const { badges, profile } = await getCredlyCertificatesPageData();
  const existingBadge = badges.find((badge) => badge.id === badgeId);

  if (!existingBadge) {
    return null;
  }

  try {
    const response = await fetchCredlyJson<CredlySingleResponse<CredlyRawBadge>>(
      makeCredlyUrl(
        `/api/v1/public_badges/${badgeId}?fields=recommendations:verbose,related_badges:basic`
      )
    );

    const badge = normalizeBadge(response.data);

    return {
      badge,
      profile,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(`/api/v1/public_badges/${badgeId}`)
    ) {
      return null;
    }

    throw error;
  }
});
