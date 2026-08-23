import { permanentRedirect } from "next/navigation";

type FeedArticleProps = {
  params: Promise<{ slug: string }>;
};

async function page({ params }: FeedArticleProps) {
  const { slug } = await params;
  permanentRedirect(`/f/${slug}`);
}

export default page;
