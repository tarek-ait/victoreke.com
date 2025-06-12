import { Slide } from "../animation/Slide";
import Image from "next/image";
import { Metadata } from "next";
import PageHeading from "@/app/components/shared/PageHeading";

const images = [
  // update this with the images in the drive
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1585618256754-241cfe4e8113?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=100",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1585619203238-70e7631cc672?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8OXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1585619443911-c2bb23fb2a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
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
      </figure>
    </main>
  );
}
