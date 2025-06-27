import { Slide } from "../animation/Slide";
import Image from "next/image";
import { Metadata } from "next";
import PageHeading from "@/app/components/shared/PageHeading";

const images = [
  // update this with the images in the drive
  {
    id: "1",
    src: "https://drive.google.com/uc?export=view&id=1FismgrvbTlJtYHPR58zLj4gM7THpc5Li",
  },
  {
    id: "2",
    src: "https://drive.google.com/uc?export=view&id=1HhNzaIY9S6uW4dUiTwtY6nkYtcHaznhX",
  },
  {
    id: "3",
    src: "https://drive.google.com/uc?export=view&id=1yZz611fWGy4zMC7BFLKvbqsx3qmbhOfD",
  },
  {
    id: "4",
    src: "https://drive.google.com/uc?export=view&id=1H_Rr-WDkxMgeS2KryWRFw3tdlpGpgC15",
  },
  {
    id: "5",
    src: "https://drive.google.com/uc?export=view&id=10iRxuBihvKeiE46eajknd7kOi14mLm46",
  },
  {
    id: "6",
    src: "https://drive.google.com/uc?export=view&id=1FDq3XUx0_XfZ4ZGGuAVwcpB68tuhAMLl",
  }
];

export const metadata: Metadata = {
  title: "Photos | Tarek Ait Ahmed",
  metadataBase: new URL("https://victoreke.com/photos"),
  description: "Explore photos taken by Tarek Ait Ahmed",
  openGraph: {
    title: "Photos | Tarek Ait Ahmed",
    url: "https://victoreke.com/photos",
    description: "Explore photos taken by Tarek Ait Ahmde",
    images:
      "https://res.cloudinary.com/victoreke/image/upload/v1692635149/victoreke/photos.png",
  },
};

export default function Photos() {
  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6 lg:mt-32 mt-20">
      <PageHeading
        title="Photos"
        // description="This page is still under construction..."
      />
      <figure className="my-6">
        <Slide delay={0.12} className="flex flex-wrap gap-2">
          {images.map((image) => (
            <Image
              key={image.id}
              src={image.src}
              alt=""
              width={350}
              height={800}
              className="dark:bg-primary-bg bg-secondary-bg"
            />
          ))}
        </Slide>
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          Photos taken by Tarek Ait Ahmed, check my instagram <span><a href="https://www.instagram.com/milquetoast77/">account</a></span> for more
          
        </figcaption>
      </figure>
    </main>
  );
}
