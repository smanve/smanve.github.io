export type ContentHeading = {
  level: 2 | 3;
  slug: string;
  text: string;
};

function stripFrontmatter(source: string) {
  if (!source.startsWith("---")) {
    return source;
  }

  const end = source.indexOf("\n---", 3);
  if (end === -1) {
    return source;
  }

  return source.slice(end + 4);
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/[*_~]/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifyHeading(value: string) {
  return stripInlineMarkdown(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractHeadings(source: string): ContentHeading[] {
  const headings: ContentHeading[] = [];
  const counts = new Map<string, number>();
  let inCodeBlock = false;

  for (const rawLine of stripFrontmatter(source).split("\n")) {
    const line = rawLine.trim();

    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    const match = /^(##|###)\s+(.+)$/.exec(line);
    if (!match) {
      continue;
    }

    const level = match[1].length as 2 | 3;
    const text = stripInlineMarkdown(match[2]);
    const baseSlug = slugifyHeading(text);
    const seen = counts.get(baseSlug) ?? 0;
    counts.set(baseSlug, seen + 1);

    headings.push({
      level,
      slug: seen === 0 ? baseSlug : `${baseSlug}-${seen + 1}`,
      text,
    });
  }

  return headings;
}

export function estimateReadingTime(source: string) {
  const plainText = stripFrontmatter(source)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, " ")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = plainText ? plainText.split(" ").filter(Boolean).length : 0;
  return Math.max(1, Math.ceil(words / 220));
}
