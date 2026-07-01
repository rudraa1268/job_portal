/**
 * Formats a salary number as Indian Rupee with lakh-style comma grouping.
 * e.g., 2300000 -> "₹23,00,000"
 */
export function formatSalary(value) {
  if (value === null || value === undefined || value === '') return '';
  const num = Number(value);
  if (isNaN(num)) return value;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Title cases job titles displayed in the UI.
 * e.g., "backend dev" -> "Backend Dev"
 */
export function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Deterministically generates a color from a company name (hash-based).
 */
export function getCompanyColor(companyName) {
  if (!companyName) return '#FF4D6D'; // Fallback to coral
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Predefined beautiful palettes that are dark enough for white text
  const colors = [
    '#FF4D6D', // coral
    '#3B82F6', // blue
    '#10B981', // emerald
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#F59E0B', // amber-ish dark
    '#14B8A6', // teal
    '#6366F1', // indigo
    '#EF4444', // red
    '#84CC16', // lime dark
  ];
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
