// Suggested trait categories with emojis
// These are promoted defaults, but any string category is allowed
export const SUGGESTED_CATEGORIES: Record<
  string,
  { label: string; emoji: string }
> = {
  Background: { label: 'Background', emoji: '🖼️' },
  body: { label: 'Body', emoji: '🧸' },
  face: { label: 'Face', emoji: '😊' },
  eyes: { label: 'Eyes', emoji: '👀' },
  mouth: { label: 'Mouth', emoji: '👄' },
  ears: { label: 'Ears', emoji: '👂' },
  arms: { label: 'Arms', emoji: '💪' },
  tail: { label: 'Tail', emoji: '🐾' },
  hat: { label: 'Hat', emoji: '🎩' },
  misc: { label: 'Misc', emoji: '✨' },
};

// Get emoji for a category (case-insensitive lookup)
export const getCategoryEmoji = (category: string): string => {
  const normalized = category.toLowerCase();
  for (const [key, value] of Object.entries(SUGGESTED_CATEGORIES)) {
    if (key.toLowerCase() === normalized) {
      return value.emoji;
    }
  }
  return '🧬'; // Default emoji for unknown categories
};

// Get display label for a category (preserves original if not in suggestions)
export const getCategoryLabel = (category: string): string => {
  const normalized = category.toLowerCase();
  for (const [key, value] of Object.entries(SUGGESTED_CATEGORIES)) {
    if (key.toLowerCase() === normalized) {
      return value.label;
    }
  }
  // Capitalize first letter if not found
  return category.charAt(0).toUpperCase() + category.slice(1);
};

// Legacy export for backwards compatibility
export const TRAIT_CATEGORIES = SUGGESTED_CATEGORIES;
