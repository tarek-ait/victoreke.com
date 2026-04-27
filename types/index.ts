import { TableRow } from "@sanity/table";
import { PortableTextBlock } from "sanity";

export interface Table {
  rows?: TableRow[];
  title?: string;
}

export interface TableValueProps {
  table?: Table;
  caption?: string;
}

export interface QuizValueProps {
  _key: string;
  question: string;
  answer: string;
}

export type ProfileType = {
  _id: string;
  fullName: string;
  headline: string;
  profileImage: {
    image: string;
    lqip: string;
    alt: string;
  };
  shortBio: string;
  email: string;
  fullBio: PortableTextBlock[];
  location: string;
  resumeURL: string;
  og: string;
  usage: PortableTextBlock[];
};

export type JobType = {
  _id: string;
  name: string;
  jobTitle: string;
  logo: string;
  url: string;
  description: string;
  startDate: string;
  endDate: string;
};

export type ProjectType = {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  projectUrl: string;
  repository: string;
  logo: string;
  coverImage: {
    image: string;
    alt: string | null;
    lqip: string;
  };
  description: PortableTextBlock[];
};

export type CredlySkill = {
  id: string;
  name: string;
  vanitySlug: string;
  canonical: boolean;
  faethmId: string | null;
};

export type CredlySkillSummary = CredlySkill & {
  badgeCount: number;
  evidenceCount: number | null;
  hasBadge: boolean;
  inDemand: boolean;
  futureProof: boolean;
  trending: boolean;
};

export type CredlyBadgeActivity = {
  id: string;
  activityType: string;
  title: string;
  url: string | null;
};

export type CredlyRelatedBadge = {
  id: string;
  name: string;
  imageUrl: string;
  updatedAt: string | null;
  url: string;
};

export type CredlyBadgeListItem = {
  id: string;
  title: string;
  description: string;
  issuedAtDate: string;
  expiresAtDate: string | null;
  issuedTo: string;
  issuerName: string;
  issuerUrl: string | null;
  issuerTwitterUrl: string | null;
  imageUrl: string;
  badgeTemplateUrl: string | null;
  verifyUrl: string;
  learnMoreUrl: string | null;
  typeCategory: string | null;
  level: string | null;
  printable: boolean;
  public: boolean;
  state: string;
  skills: CredlySkill[];
};

export type CredlyBadge = CredlyBadgeListItem & {
  criteria: CredlyBadgeActivity[];
  relatedBadges: CredlyRelatedBadge[];
};

export type CredlyProfile = {
  userId: string;
  displayName: string;
  publicProfileUrl: string;
  badgesPageUrl: string;
  badgeCount: number;
};

export type PostType = {
  _id: string;
  _createdAt: string;
  _updatedAt?: string;
  title: string;
  slug: string;
  description: string;
  canonicalLink?: string;
  date?: string;
  coverImage: {
    image: string;
    lqip: string;
    alt: string | null;
  };
  tags: string[];
  author: {
    name: string;
    photo: {
      image: string;
      alt: string;
    };
    twitterUrl: string;
  };
  body: PortableTextBlock[];
  featured: boolean;
  isPublished: boolean;
};

export type CTFWriteupType = {
  _id: string;
  _createdAt: string;
  _updatedAt?: string;
  title: string;
  slug: string;
  description: string;
  date?: string;
  coverImage?: {
    image: string;
    lqip: string;
    alt: string | null;
  };
  platform: string;
  category: string;
  difficulty?: string;
  points?: number;
  tags: string[];
  body: PortableTextBlock[];
  featured: boolean;
  isPublished: boolean;
};

export type HeroeType = {
  _id: string;
  _createdAt: string;
  name: string;
  url: string;
  met: boolean;
};
