import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "@utils/slugify";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"projects">["data"];
  secHeading?: boolean;
}

export default function ProjectCard({
  href,
  frontmatter,
  secHeading = true,
}: Props) {
  const { title, tags, description, ogImage } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium text-skin-accent hover:opacity-80",
  };

  const imageUrl = typeof ogImage === "string" ? ogImage : ogImage?.src;

  return (
    <li className="card group">
      <a href={href} className="grid w-full gap-2">
        {imageUrl && (
          <div className="mb-4 overflow-hidden rounded-sm border border-skin-line">
            <img
              src={imageUrl}
              alt={title}
              className="h-48 w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        )}
        <ul className="flex flex-wrap gap-4 text-sm text-skin-base/70">
          {tags.map(tag => (
            <li>
              #<span>{tag}</span>
            </li>
          ))}
        </ul>
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
        <p className="text-skin-base/80">{description}</p>
      </a>
    </li>
  );
}
