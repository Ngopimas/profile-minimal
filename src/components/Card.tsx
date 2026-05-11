import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
  readingTime?: string;
}

export default function Card({
  href,
  frontmatter,
  secHeading = true,
  readingTime,
}: Props) {
  const { title, pubDatetime, modDatetime, description } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium text-skin-base group-hover:text-skin-accent transition-colors",
  };

  return (
    <article className="group py-8">
      <a href={href} className="block">
        <div className="flex items-center gap-3 text-sm text-skin-base/50 mb-3">
          <Datetime
            pubDatetime={pubDatetime}
            modDatetime={modDatetime}
            className=""
          />
          {readingTime && (
            <span>&middot; {readingTime}</span>
          )}
        </div>
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
        <p className="mt-2 text-skin-base/70 leading-relaxed max-w-2xl">{description}</p>
      </a>
    </article>
  );
}
