import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NarBox Courier",
    short_name: "NarBox",
    description:
      "Servicio de courier de USA a Panamá – Maritime and air shipping",
    start_url: "/es",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1976D2",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
