"use client";

import {
  BiLogoTwitter,
  BiLogoLinkedinSquare,
  BiLogoFacebookSquare,
  BiLogoWhatsapp,
} from "react-icons/bi";

type props = {
  title: string;
  slug: string;
  description: string;
  baseUrl?: string;
  shareTitle?: string;
  twitterText?: string;
  whatsappText?: string;
};

export default function SharePost({
  title,
  slug,
  description,
  baseUrl = "https://victoreke.com/blog/",
  shareTitle = "Share Post",
  twitterText = "Thank you @victoreke for writing this post.",
  whatsappText = "Read this amazing article by Victor Eke",
}: props) {
  const shareUrl = encodeURIComponent(`${baseUrl}${slug}`);
  const options = [
    {
      icon: BiLogoTwitter,
      name: "Twitter",
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        twitterText
      )}.%0A%0A${title}%0A%0A${shareUrl}`,
    },
    {
      icon: BiLogoLinkedinSquare,
      name: "LinkedIn",
      shareUrl: `https://linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${title}&summary=${description}`,
    },
    {
      icon: BiLogoFacebookSquare,
      name: "Facebook",
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    },
    {
      icon: BiLogoWhatsapp,
      name: "WhatsApp",
      shareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        whatsappText
      )}.%0A%0A${title}%0A%0A${shareUrl}`,
    },
  ];

  const openPopup = (url: string) => {
    window.open(
      url,
      "Social Share",
      "width=600,height=600,resizable=yes,scrollbars=yes,status=yes"
    );
  };

  return (
    <section className="border-b dark:border-zinc-800 border-zinc-200 pb-10">
      <h3 className="text-xl font-semibold tracking-tight mb-4">
        {shareTitle}
      </h3>

      <div className="flex flex-wrap items-center gap-2 tracking-tight">
        {options.map((data, id) => (
          <button
            key={id}
            onClick={() => openPopup(data.shareUrl)}
            title={`Share to ${data.name}`}
            aria-label={`Share to ${data.name}`}
            className="w-12 h-12 p-2 grid place-content-center text-2xl dark:bg-primary-bg bg-zinc-100 border dark:border-zinc-800 border-zinc-200 rounded-md"
          >
            <data.icon aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
