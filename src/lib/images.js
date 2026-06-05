export const PLACEHOLDER_IMAGE = "/images/main_img_placeholder.jpg";

export function placeholderImage(label = "Trip") {
  const text = encodeURIComponent(String(label).slice(0, 24));
  return `https://placehold.co/800x600/1e40af/ffffff/png?text=${text}`;
}

export function handleImageError(event) {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = "true";
  img.src = PLACEHOLDER_IMAGE;
}
