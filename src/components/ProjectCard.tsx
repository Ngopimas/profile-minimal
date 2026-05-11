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
    className: "text-lg font-medium text-skin-base group-hover:text-skin-accent transition-colors",
  };

  const imageUrl = typeof ogImage === "string" ? ogImage : ogImage?.src;

  return (
    <article className="group py-8">
      <a href={href} className="block">
        {imageUrl && (
          <div className="mb-5 overflow-hidden rounded-sm">
            <img
              src={imageUrl}
              alt={title}
              className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-skin-base/40 mb-3">
          {tags.slice(0, 4).map(tag => (
            <span key={tag}>{tag}</span>
          ))}
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
