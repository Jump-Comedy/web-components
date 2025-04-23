export default function getEventThumbnail(event) {
  if (event.variants.length > 0 && event.variants[0].thumbnail) {
    return event.variants[0].thumbnail;
  } else {
    return event.thumbnail;
  }
}
