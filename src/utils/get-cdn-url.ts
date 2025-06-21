const origin_base_url = "https://mycomedytickets.nyc3.digitaloceanspaces.com";
const cdn_base_url = "https://jumpcomedy.b-cdn.net";

export default function getCdnUrl(url: string) {
  if (!url) {
    return "https://placehold.co/500x500";
  }
  return url.replace(origin_base_url, cdn_base_url);
}
