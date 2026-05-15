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
  const { title, tags, description, ogImage, impact, role, type, status } =
    frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className:
      "text-lg font-medium text-skin-base group-hover:text-skin-accent transition-colors",
  };

  const imageUrl = typeof ogImage === "string" ? ogImage : ogImage?.src;
  const meta = [type, role, status].filter(Boolean).join(" · ");

  return (
    <article className="group py-8 -mx-4 px-4 rounded-lg transition-colors duration-300 hover:bg-skin-card">
      <a href={href} className="block">
        {imageUrl && (
          <div className="mb-5 overflow-hidden rounded-xl">
            <img
              src={imageUrl}
              alt={title}
              className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className="rounded border border-skin-line px-2 py-0.5 text-xs text-skin-base/60 transition-colors group-hover:border-skin-accent/50 group-hover:text-skin-accent"
            >
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="px-1 py-0.5 text-xs text-skin-base/40">
              +{tags.length - 4}
            </span>
          )}
        </div>
        {meta && (
          <div className="mb-2 text-sm font-medium text-skin-base/50">
            {meta}
          </div>
        )}
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
        <p className="mt-2 text-skin-base/70 leading-relaxed max-w-2xl">
          {description}
        </p>
        {impact && (
          <p className="mt-3 max-w-2xl text-sm font-medium text-skin-base/80">
            {impact}
          </p>
        )}
      </a>
    </article>
  );
}
