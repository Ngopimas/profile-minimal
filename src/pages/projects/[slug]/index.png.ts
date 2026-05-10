import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { generateOgImageForPost } from "@utils/generateOgImages";
import getEntrySlug from "@utils/getEntrySlug";

export async function getStaticPaths() {
  const posts = await getCollection("projects").then(p =>
    p.filter(({ data }) => !data.draft && !data.ogImage)
  );

  return posts.map(post => ({
    params: { slug: getEntrySlug(post) },
    props: post,
  }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(
    await generateOgImageForPost(props as CollectionEntry<"projects">),
    {
      headers: { "Content-Type": "image/png" },
    }
  );
