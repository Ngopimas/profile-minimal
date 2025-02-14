import { slugifyStr } from "@utils/slugify";
import type { CollectionEntry } from "astro:content";

export interface Props {
  size?: "sm" | "lg";
  href?: string;
  frontmatter: CollectionEntry<"projects">["data"];
  secHeading?: boolean;
}

export default function ProjectCard({
  href,
  frontmatter,
  secHeading = true,
}: Props) {
  const { title, description, url, tags, repository } = frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium hover:underline",
  };

  return (
    <li className="my-6 flex flex-col gap-2">
      <a
        href={href}
        className="inline-block text-lg font-medium text-skin-accent underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
      >
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}
      </a>
      <ul className="flex flex-wrap gap-4 text-sm">
        {tags.map(tag => (
          <li>
            #<span>{tag}</span>
          </li>
        ))}
      </ul>
      <p>{description}</p>
      {url && (
        <a
          title={url}
          className="text-ellipsis hover:text-skin-accent hover:opacity-75"
          href={url}
        >
          <span className="underline underline-offset-4">Live</span>: {url}
        </a>
      )}
      {repository && (
        <a
          title={repository}
          className="text-ellipsis hover:text-skin-accent hover:opacity-75"
          href={repository}
        >
          <span className="underline underline-offset-4">Repository</span>:{" "}
          {repository}
        </a>
      )}
    </li>
  );
}
