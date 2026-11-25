/** Up to two uppercase initials from a display name ("Nassim Farhat" -> "NF"). */
export function getInitials(name: string, maxLength = 2): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxLength)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
