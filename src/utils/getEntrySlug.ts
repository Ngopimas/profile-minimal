type EntryLike = {
  id: string;
  slug?: string;
  data?: {
    slug?: string;
  };
};

export default function getEntrySlug(entry: EntryLike): string {
  return (
    entry.data?.slug || entry.slug || entry.id.replace(/^(blog|projects)\//, "")
  );
}
