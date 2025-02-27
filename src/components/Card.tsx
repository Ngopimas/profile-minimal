import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, modDatetime, description } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium text-skin-accent hover:opacity-80",
  };

  return (
    <li className="card group">
      <a href={href} className="grid w-full gap-2">
        <Datetime
          pubDatetime={pubDatetime}
          modDatetime={modDatetime}
          className="text-sm text-skin-base/70"
        />
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
        <p className="mb-2 text-skin-base/80">{description}</p>
      </a>
    </li>
  );
}
