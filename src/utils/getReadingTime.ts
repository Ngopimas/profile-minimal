export default function getReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const clean = content.replace(/```[\s\S]*?```/g, ""); // remove code blocks
  const words = clean.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
