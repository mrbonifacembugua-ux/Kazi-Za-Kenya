"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Provider = {
  id: string;
  name: string;
  service: string;
  area: string;
  road: string;
  km: string;
  price: string;
  rating: string;
  emoji: string;
  status: "AVAILABLE" | "TAKEN";
  about: string;
  lat: number;
  lng: number;
  photo: string;
  proofPhotos: string[];
};

type Job = {
  id: string;
  customerName: string;
  customerEmoji: string;
  service: string;
  area: string;
  road: string;
  km: string;
  budget: string;
  urgency: "TODAY" | "THIS WEEK" | "FLEXIBLE";
  status: "OPEN" | "WORKER FOUND";
  title: string;
  description: string;
  date: string;
  lat: number;
  lng: number;
  photo: string;
  jobPhotos: string[];
};

const providers: Provider[] = [
  {
    id: "john-mwangi",
    name: "John Mwangi",
    service: "TV & electronics repair",
    area: "Kilimani",
    road: "Near Ngong Road",
    km: "0.8 km",
    price: "From KSh 1,000",
    rating: "4.8",
    emoji: "📺",
    status: "AVAILABLE",
    about:
      "Experienced electronics technician helping households with TV, decoder and general electronics repairs.",
    lat: -1.2921,
    lng: 36.7854,
    photo:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
    proofPhotos: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1601944177325-f8867652837f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "mary-wanjiku",
    name: "Mary Wanjiku",
    service: "House cleaning & laundry",
    area: "Kileleshwa",
    road: "Near Kileleshwa Road",
    km: "1.4 km",
    price: "From KSh 1,500",
    rating: "4.9",
    emoji: "🧹",
    status: "AVAILABLE",
    about:
      "Reliable home cleaning and laundry services. Available for regular or one-time household work.",
    lat: -1.2874,
    lng: 36.7811,
    photo:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    proofPhotos: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "peter-otieno",
    name: "Peter Otieno",
    service: "Plumbing & repairs",
    area: "Lavington",
    road: "Near James Gichuru Road",
    km: "2.1 km",
    price: "From KSh 1,200",
    rating: "4.7",
    emoji: "🔧",
    status: "TAKEN",
    about:
      "Plumbing and household repair specialist handling leaks, fittings, maintenance and general repairs.",
    lat: -1.2778,
    lng: 36.7759,
    photo:
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80",
    proofPhotos: [
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "david-kamau",
    name: "David Kamau",
    service: "Moving & house help",
    area: "South B",
    road: "Near Likoni Road",
    km: "3.2 km",
    price: "From KSh 2,000",
    rating: "4.8",
    emoji: "🚚",
    status: "AVAILABLE",
    about:
      "Provides moving assistance, loading, unloading and general house-help services.",
    lat: -1.3098,
    lng: 36.8281,
    photo:
      "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=600&q=80",
    proofPhotos: [
      "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "grace-akinyi",
    name: "Grace Akinyi",
    service: "Electrical services",
    area: "Westlands",
    road: "Near Waiyaki Way",
    km: "4.0 km",
    price: "From KSh 1,000",
    rating: "4.9",
    emoji: "⚡",
    status: "AVAILABLE",
    about:
      "Electrical service provider for household installations, repairs and maintenance.",
    lat: -1.2646,
    lng: 36.8042,
    photo:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
    proofPhotos: [
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1555963966-b7ae5406b6a6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1565600223587-89a2a1f3c9f7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092919535-7146ff6e1a1a?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581093458791-9d42e3c7e8a8?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

const jobs: Job[] = [
  {
    id: "job-1",
    customerName: "Amina Hassan",
    customerEmoji: "👩🏽",
    service: "Plumbing",
    area: "Kilimani",
    road: "Near Yaya Centre",
    km: "0.9 km",
    budget: "KSh 2,000 - 4,000",
    urgency: "TODAY",
    status: "OPEN",
    title: "Kitchen sink is leaking",
    description:
      "The kitchen sink has started leaking underneath. I need someone to check the pipes, repair the leak and make sure everything is working properly.",
    date: "Today",
    lat: -1.2929,
    lng: 36.7878,
    photo:
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=80",
    jobPhotos: [
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "job-2",
    customerName: "Brian Otieno",
    customerEmoji: "👨🏾",
    service: "TV repair",
    area: "Lavington",
    road: "Near Valley Arcade",
    km: "1.8 km",
    budget: "KSh 1,000 - 2,500",
    urgency: "THIS WEEK",
    status: "OPEN",
    title: "TV turns on but has no picture",
    description:
      "My television powers on and I can hear sound, but the screen stays black. I would like a technician to diagnose the problem and give me a repair quote.",
    date: "This week",
    lat: -1.2815,
    lng: 36.7792,
    photo:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80",
    jobPhotos: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1601944177325-f8867652837f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "job-3",
    customerName: "Faith Njeri",
    customerEmoji: "👩🏽",
    service: "House cleaning",
    area: "Kileleshwa",
    road: "Near Oloitoktok Road",
    km: "1.5 km",
    budget: "KSh 1,500 - 2,500",
    urgency: "FLEXIBLE",
    status: "OPEN",
    title: "Deep cleaning for a 2-bedroom apartment",
    description:
      "I need a thorough cleaning of a two-bedroom apartment including the kitchen, bathrooms, floors, windows and general dusting.",
    date: "Flexible",
    lat: -1.2895,
    lng: 36.7829,
    photo:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
    jobPhotos: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "job-4",
    customerName: "Samuel Kamau",
    customerEmoji: "👨🏿",
    service: "Electrical",
    area: "Westlands",
    road: "Near Sarit Centre",
    km: "3.8 km",
    budget: "KSh 2,000 - 5,000",
    urgency: "THIS WEEK",
    status: "OPEN",
    title: "Install additional wall sockets",
    description:
      "I need an electrician to install several additional power sockets in my living room and home office. The work should be done safely and neatly.",
    date: "This week",
    lat: -1.2631,
    lng: 36.8035,
    photo:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
    jobPhotos: [
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1555963966-b7ae5406b6a6?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80",
    ],
  },
  {
    id: "job-5",
    customerName: "Lucy Wambui",
    customerEmoji: "👩🏾",
    service: "Moving",
    area: "South B",
    road: "Near Bellevue",
    km: "3.0 km",
    budget: "KSh 3,000 - 6,000",
    urgency: "THIS WEEK",
    status: "OPEN",
    title: "Help moving household items",
    description:
      "I am moving from one apartment to another nearby. I need help carrying furniture, boxes and household items and loading them into a vehicle.",
    date: "This week",
    lat: -1.3085,
    lng: 36.8269,
    photo:
      "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=900&q=80",
    jobPhotos: [
      "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    ],
  },
];

type ViewMode = "workers" | "jobs";

export default function Home() {
  const router = useRouter();

  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerLayerRef = useRef<any>(null);

  /*
   * IMPORTANT:
   * This remembers which image/pin was clicked.
   *
   * 1st click = zoom
   * 2nd click = zoom again
   * 3rd click = open profile
   */
  const lastClickedMarkerRef = useRef<string | null>(null);
  const markerClickCountRef = useRef<Record<string, number>>({});

  const [search, setSearch] = useState("");
  const [service, setService] = useState("");
  const [viewMode, setViewMode] =
    useState<ViewMode>("workers");

  const [area, setArea] = useState("Nairobi, Kenya");
  const [areaSearching, setAreaSearching] = useState(false);
  const [areaMessage, setAreaMessage] = useState("");

  const [selectedProvider, setSelectedProvider] =
    useState<Provider | null>(null);

  const [selectedJob, setSelectedJob] =
    useState<Job | null>(null);

  const [messageOpen, setMessageOpen] =
    useState(false);

  const [message, setMessage] = useState("");

  const filteredProviders = useMemo(() => {
    const cleanSearch = search.toLowerCase().trim();

    if (!cleanSearch) return providers;

    return providers.filter((provider) => {
      const query =
        `${provider.name} ${provider.service} ${provider.area} ${provider.road}`.toLowerCase();

      return query.includes(cleanSearch);
    });
  }, [search]);

  const filteredJobs = useMemo(() => {
    const cleanSearch = search.toLowerCase().trim();

    if (!cleanSearch) return jobs;

    return jobs.filter((job) => {
      const query =
        `${job.customerName} ${job.service} ${job.area} ${job.road} ${job.title} ${job.description}`.toLowerCase();

      return query.includes(cleanSearch);
    });
  }, [search]);

  /*
   * AREA SEARCH
   *
   * This uses OpenStreetMap's Nominatim service.
   *
   * Example:
   * "Kilimani"
   * "Westlands"
   * "Kileleshwa"
   * "South B"
   */
  async function searchArea() {
    const cleanArea = area.trim();

    if (!cleanArea) {
      setAreaMessage("Please type an area first.");
      return;
    }

    setAreaSearching(true);
    setAreaMessage("");

    try {
      const query = encodeURIComponent(
        `${cleanArea}, Nairobi, Kenya`
      );

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${query}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Area search failed");
      }

      const results = await response.json();

      if (!results || results.length === 0) {
        setAreaMessage(
          `We couldn't find "${cleanArea}". Try another area.`
        );
        return;
      }

      const latitude = Number(results[0].lat);
      const longitude = Number(results[0].lon);

      if (
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
      ) {
        throw new Error("Invalid location");
      }

      /*
       * Move the map to the searched area.
       */
      mapRef.current?.flyTo(
        [latitude, longitude],
        15,
        {
          animate: true,
          duration: 1,
        }
      );

      /*
       * Put a temporary search marker there.
       */
      const L = (window as any).L;

      if (L && mapRef.current) {
        const searchIcon = L.divIcon({
          className: "",
          html: `
            <div class="search-location-pin">
              <span>📍</span>
            </div>
          `,
          iconSize: [42, 42],
          iconAnchor: [21, 42],
        });

        L.marker(
          [latitude, longitude],
          {
            icon: searchIcon,
          }
        )
          .addTo(mapRef.current)
          .bindPopup(
            `<strong>${cleanArea}</strong><br/>Searched area`
          )
          .openPopup();
      }

      setAreaMessage(
        `Showing ${results[0].display_name || cleanArea}`
      );
    } catch (error) {
      console.error("Area search error:", error);

      setAreaMessage(
        "Something went wrong while searching. Please try again."
      );
    } finally {
      setAreaSearching(false);
    }
  }

  useEffect(() => {
    if (!mapElement.current) return;

    let cancelled = false;

    const loadLeaflet = async () => {
      try {
        if (!(window as any).L) {
          const css = document.createElement("link");

          css.rel = "stylesheet";
          css.href =
            "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";

          document.head.appendChild(css);

          await new Promise<void>((resolve, reject) => {
            const script =
              document.createElement("script");

            script.src =
              "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

            script.onload = () => resolve();

            script.onerror = () =>
              reject(
                new Error("Could not load Leaflet.")
              );

            document.body.appendChild(script);
          });
        }

        if (cancelled) return;

        const L = (window as any).L;

        if (!mapRef.current) {
          mapRef.current = L.map(
            mapElement.current
          ).setView(
            [-1.2921, 36.8219],
            12
          );

          L.control
            .zoom({
              position: "bottomright",
            })
            .addTo(mapRef.current);

          L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              maxZoom: 19,
              attribution:
                "© OpenStreetMap contributors",
            }
          ).addTo(mapRef.current);

          markerLayerRef.current =
            L.layerGroup().addTo(
              mapRef.current
            );
        }

        if (!markerLayerRef.current) return;

        markerLayerRef.current.clearLayers();

        if (viewMode === "workers") {
          filteredProviders.forEach(
            (provider) => {
              const pinColor =
                provider.status === "AVAILABLE"
                  ? "#16803d"
                  : "#d97706";

              const icon = L.divIcon({
                className: "",
                html: `
                  <div
                    class="pin"
                    style="background:${pinColor};"
                    title="${provider.name}"
                  >
                    <span>${provider.emoji}</span>
                  </div>
                `,
                iconSize: [34, 34],
                iconAnchor: [17, 34],
              });

              const marker = L.marker(
                [provider.lat, provider.lng],
                { icon }
              ).addTo(
                markerLayerRef.current
              );

              marker.on("click", () => {
                const id = provider.id;

                /*
                 * Start counting from zero for this image.
                 */
                if (
                  lastClickedMarkerRef.current !==
                  id
                ) {
                  lastClickedMarkerRef.current =
                    id;

                  markerClickCountRef.current = {
                    [id]: 1,
                  };
                } else {
                  markerClickCountRef.current[id] =
                    (markerClickCountRef.current[id] ||
                      0) + 1;
                }

                const clicks =
                  markerClickCountRef.current[id];

                /*
                 * CLICK 1
                 * Zoom closer.
                 */
                if (clicks === 1) {
                  setSelectedProvider(null);
                  setSelectedJob(null);
                  setMessageOpen(false);

                  mapRef.current?.flyTo(
                    [provider.lat, provider.lng],
                    14,
                    {
                      animate: true,
                      duration: 0.8,
                    }
                  );

                  return;
                }

                /*
                 * CLICK 2
                 * Zoom even closer.
                 */
                if (clicks === 2) {
                  setSelectedProvider(null);
                  setSelectedJob(null);
                  setMessageOpen(false);

                  mapRef.current?.flyTo(
                    [provider.lat, provider.lng],
                    17,
                    {
                      animate: true,
                      duration: 0.8,
                    }
                  );

                  return;
                }

                /*
                 * CLICK 3
                 * Finally open profile.
                 */
                setSelectedProvider(provider);
                setSelectedJob(null);
                setMessageOpen(false);
                setMessage("");

                /*
                 * Reset so the next time the same marker
                 * is clicked, the process starts again.
                 */
                markerClickCountRef.current[id] = 0;
                lastClickedMarkerRef.current = null;
              });
            }
          );
        } else {
          filteredJobs.forEach((job) => {
            const icon = L.divIcon({
              className: "",
              html: `
                <div
                  class="job-pin"
                  title="${job.title}"
                >
                  <span>🛠️</span>
                </div>
              `,
              iconSize: [38, 38],
              iconAnchor: [19, 38],
            });

            const marker = L.marker(
              [job.lat, job.lng],
              { icon }
            ).addTo(
              markerLayerRef.current
            );

            marker.on("click", () => {
              const id = job.id;

              if (
                lastClickedMarkerRef.current !==
                id
              ) {
                lastClickedMarkerRef.current =
                  id;

                markerClickCountRef.current = {
                  [id]: 1,
                };
              } else {
                markerClickCountRef.current[id] =
                  (markerClickCountRef.current[id] ||
                    0) + 1;
              }

              const clicks =
                markerClickCountRef.current[id];

              /*
               * CLICK 1
               */
              if (clicks === 1) {
                setSelectedProvider(null);
                setSelectedJob(null);
                setMessageOpen(false);

                mapRef.current?.flyTo(
                  [job.lat, job.lng],
                  14,
                  {
                    animate: true,
                    duration: 0.8,
                  }
                );

                return;
              }

              /*
               * CLICK 2
               */
              if (clicks === 2) {
                setSelectedProvider(null);
                setSelectedJob(null);
                setMessageOpen(false);

                mapRef.current?.flyTo(
                  [job.lat, job.lng],
                  17,
                  {
                    animate: true,
                    duration: 0.8,
                  }
                );

                return;
              }

              /*
               * CLICK 3
               */
              setSelectedJob(job);
              setSelectedProvider(null);
              setMessageOpen(false);
              setMessage("");

              markerClickCountRef.current[id] = 0;
              lastClickedMarkerRef.current = null;
            });
          });
        }

        setTimeout(() => {
          mapRef.current?.invalidateSize();
        }, 100);
      } catch (error) {
        console.error(
          "Map loading error:",
          error
        );
      }
    };

    loadLeaflet();

    return () => {
      cancelled = true;
    };
  }, [
    filteredProviders,
    filteredJobs,
    viewMode,
  ]);

  /*
   * Clicking a worker from the LEFT PANEL should
   * also zoom to them first.
   *
   * We don't immediately open the profile anymore.
   */
  function selectProvider(provider: Provider) {
    lastClickedMarkerRef.current =
      provider.id;

    markerClickCountRef.current[provider.id] = 1;

    mapRef.current?.flyTo(
      [provider.lat, provider.lng],
      14,
      {
        animate: true,
        duration: 0.8,
      }
    );

    setSelectedProvider(null);
    setSelectedJob(null);
    setMessageOpen(false);
    setMessage("");
  }

  function selectJob(job: Job) {
    lastClickedMarkerRef.current = job.id;

    markerClickCountRef.current[job.id] = 1;

    mapRef.current?.flyTo(
      [job.lat, job.lng],
      14,
      {
        animate: true,
        duration: 0.8,
      }
    );

    setSelectedJob(null);
    setSelectedProvider(null);
    setMessageOpen(false);
    setMessage("");
  }

  function chooseChip(value: string) {
    setService(value);
    setSearch(value);
  }

  function needSomething() {
    alert(
      "The job posting system will let you describe the work, add up to 5 photos, choose your location, set your budget and receive responses from nearby workers."
    );
  }

  function offerService() {
    alert(
      "Provider registration will allow you to create your profile, add your services, price, location, availability, up to 7 proof-of-work photos and work evidence."
    );
  }

  function goToLogin() {
    router.push("/login");
  }

  function openMessage() {
    setMessageOpen(true);
    setMessage("");
  }

  function sendMessage() {
    if (!message.trim()) return;

    const recipient =
      selectedProvider?.name ||
      selectedJob?.customerName ||
      "the user";

    alert(
      `Message to ${recipient} sent successfully.`
    );

    setMessage("");
  }

  function closeProfile() {
    setSelectedProvider(null);
    setSelectedJob(null);
    setMessageOpen(false);
    setMessage("");

    lastClickedMarkerRef.current = null;
    markerClickCountRef.current = {};
  }

  function switchView(mode: ViewMode) {
    setViewMode(mode);
    setSearch("");
    setService("");

    lastClickedMarkerRef.current = null;
    markerClickCountRef.current = {};

    setSelectedProvider(null);
    setSelectedJob(null);
    setMessageOpen(false);
  }

  return (
    <>
      <div className="app">
        <header className="topbar">
          <div className="brand">
            🇰🇪 Kazi za <span>Kenya</span>
          </div>

          <div className="search">
            🔎

            <input
              value={search}
              onChange={(e) => {
                const value = e.target.value;

                setSearch(value);
                setService(value);
              }}
              placeholder={
                viewMode === "workers"
                  ? "What do you need done? Try plumber, cleaner, TV repair..."
                  : "Find a job nearby... Try plumbing, cleaning, moving..."
              }
            />
          </div>

          <div className="actions">
            <button
              type="button"
              className="btn"
              onClick={goToLogin}
            >
              Log in
            </button>

            <button
              type="button"
              className="btn primary"
              onClick={offerService}
            >
              I offer a service
            </button>
          </div>
        </header>

        <main className="content">
          <div
            ref={mapElement}
            id="map"
            className="map"
          />

          <aside className="panel">
            <div className="hero">
              <h1>
                Find work. Get things done.
              </h1>

              <p>
                Kazi za Kenya connects people who
                need work done with people who can do
                it.
              </p>
            </div>

            <div className="main-tabs">
              <button
                type="button"
                className={
                  viewMode === "workers"
                    ? "main-tab active"
                    : "main-tab"
                }
                onClick={() =>
                  switchView("workers")
                }
              >
                👷 Find a worker
              </button>

              <button
                type="button"
                className={
                  viewMode === "jobs"
                    ? "main-tab active"
                    : "main-tab"
                }
                onClick={() =>
                  switchView("jobs")
                }
              >
                📋 Find jobs
              </button>
            </div>

            <div className="choice">
              <button
                type="button"
                className="selected"
                onClick={needSomething}
              >
                ➕ I need something
              </button>

              <button
                type="button"
                onClick={offerService}
              >
                🛠️ I offer a service
              </button>
            </div>

            {/* =========================
                AREA SEARCH
            ========================== */}

            <div className="field location-search-field">
              📍

              <input
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  setAreaMessage("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    searchArea();
                  }
                }}
                placeholder="Search your area"
                aria-label="Search area"
              />

              <button
                type="button"
                className="area-search-button"
                onClick={searchArea}
                disabled={areaSearching}
              >
                {areaSearching
                  ? "..."
                  : "Search"}
              </button>
            </div>

            {areaMessage && (
              <div
                className={
                  areaMessage.startsWith(
                    "We couldn't"
                  ) ||
                  areaMessage.startsWith(
                    "Something"
                  )
                    ? "area-message error"
                    : "area-message"
                }
              >
                {areaMessage}
              </div>
            )}

            <div className="field">
              🔎

              <input
                value={service}
                onChange={(e) => {
                  const value =
                    e.target.value;

                  setService(value);
                  setSearch(value);
                }}
                placeholder={
                  viewMode === "workers"
                    ? "Search a service"
                    : "Search jobs"
                }
              />
            </div>

            <div className="chips">
              {[
                "Plumbing",
                "Cleaning",
                "Electrician",
                "TV repair",
                "Moving",
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="chip"
                  onClick={() =>
                    chooseChip(chip)
                  }
                >
                  {chip}
                </button>
              ))}
            </div>

            {viewMode === "workers" ? (
              <>
                <div className="section-title">
                  People who can help around Nairobi
                </div>

                {filteredProviders.length ===
                0 ? (
                  <div className="empty">
                    No workers found for "
                    {search}".
                  </div>
                ) : (
                  filteredProviders.map(
                    (provider) => (
                      <button
                        type="button"
                        className="provider"
                        key={provider.id}
                        onClick={() =>
                          selectProvider(
                            provider
                          )
                        }
                      >
                        <div className="provider-top">
                          <div className="avatar photo-avatar">
                            <img
                              src={
                                provider.photo
                              }
                              alt={
                                provider.name
                              }
                            />
                          </div>

                          <div className="provider-info">
                            <div className="pname">
                              {
                                provider.name
                              }
                            </div>

                            <div className="meta">
                              {
                                provider.service
                              }
                            </div>

                            <div className="location">
                              📍{" "}
                              {
                                provider.area
                              }{" "}
                              ·{" "}
                              {
                                provider.road
                              }
                            </div>
                          </div>

                          <div
                            className={`status ${
                              provider.status ===
                              "AVAILABLE"
                                ? "available"
                                : "taken"
                            }`}
                          >
                            ●{" "}
                            {
                              provider.status
                            }
                          </div>
                        </div>

                        <div className="provider-bottom">
                          <span>
                            ⭐{" "}
                            {
                              provider.rating
                            }{" "}
                            ·{" "}
                            {
                              provider.km
                            }
                          </span>

                          <b>
                            {
                              provider.price
                            }
                          </b>
                        </div>

                        <div className="trusted">
                          ✓{" "}
                          {
                            provider
                              .proofPhotos
                              .length
                          }{" "}
                          proof-of-work photos
                          · View profile
                        </div>
                      </button>
                    )
                  )
                )}
              </>
            ) : (
              <>
                <div className="section-title">
                  Jobs people need done
                </div>

                {filteredJobs.length ===
                0 ? (
                  <div className="empty">
                    No jobs found for "
                    {search}".
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <button
                      type="button"
                      className="job-card"
                      key={job.id}
                      onClick={() =>
                        selectJob(job)
                      }
                    >
                      <div className="job-photo">
                        <img
                          src={job.photo}
                          alt={job.title}
                        />

                        <span
                          className={
                            job.status ===
                            "OPEN"
                              ? "job-status open"
                              : "job-status found"
                          }
                        >
                          {job.status}
                        </span>

                        <span className="photo-count">
                          📷{" "}
                          {
                            job.jobPhotos
                              .length
                          }
                        </span>
                      </div>

                      <div className="job-content">
                        <div className="job-title">
                          {job.title}
                        </div>

                        <div className="job-customer">
                          {
                            job.customerEmoji
                          }{" "}
                          {
                            job.customerName
                          }
                        </div>

                        <div className="job-location">
                          📍 {job.area} ·{" "}
                          {job.road}
                        </div>

                        <div className="job-details-row">
                          <span>
                            💰{" "}
                            {job.budget}
                          </span>

                          <span>
                            ⏰{" "}
                            {job.urgency}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </>
            )}

            <div className="section-title">
              Anything else?
            </div>

            <button
              type="button"
              className="btn primary post-button"
              onClick={needSomething}
            >
              {viewMode === "workers"
                ? "Post what I need"
                : "Post a service"}
            </button>
          </aside>

          {/* =========================
              PROVIDER PROFILE
          ========================== */}

          {selectedProvider && (
            <div
              className="profile-overlay"
              onClick={closeProfile}
            >
              <div
                className="profile-modal"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                <button
                  type="button"
                  className="close-button"
                  onClick={closeProfile}
                  aria-label="Close profile"
                >
                  ×
                </button>

                {!messageOpen ? (
                  <>
                    <div className="profile-header">
                      <div className="large-avatar photo-large-avatar">
                        <img
                          src={
                            selectedProvider.photo
                          }
                          alt={
                            selectedProvider.name
                          }
                        />
                      </div>

                      <div>
                        <h2>
                          {
                            selectedProvider.name
                          }
                        </h2>

                        <div className="profile-service">
                          {
                            selectedProvider.service
                          }
                        </div>

                        <div className="profile-status">
                          <span
                            className={
                              selectedProvider.status ===
                              "AVAILABLE"
                                ? "dot available-dot"
                                : "dot taken-dot"
                            }
                          />

                          {
                            selectedProvider.status
                          }
                        </div>
                      </div>
                    </div>

                    <div className="profile-rating">
                      <strong>
                        ⭐{" "}
                        {
                          selectedProvider.rating
                        }
                      </strong>

                      <span>
                        Trusted rating
                      </span>
                    </div>

                    <div className="profile-location">
                      <strong>
                        📍 Location
                      </strong>

                      <div>
                        {
                          selectedProvider.area
                        }{" "}
                        ·{" "}
                        {
                          selectedProvider.road
                        }
                      </div>

                      <small>
                        {
                          selectedProvider.km
                        }{" "}
                        away
                      </small>
                    </div>

                    <div className="profile-section">
                      <h3>About</h3>

                      <p>
                        {
                          selectedProvider.about
                        }
                      </p>
                    </div>

                    <div className="profile-section">
                      <h3>
                        Services & pricing
                      </h3>

                      <div className="service-box">
                        <span>
                          {
                            selectedProvider.service
                          }
                        </span>

                        <strong>
                          {
                            selectedProvider.price
                          }
                        </strong>
                      </div>
                    </div>

                    <div className="profile-section">
                      <div className="evidence-heading">
                        <div>
                          <h3>
                            Proof of previous
                            work
                          </h3>

                          <p>
                            See examples of
                            work completed by{" "}
                            {
                              selectedProvider.name.split(
                                " "
                              )[0]
                            }
                            .
                          </p>
                        </div>

                        <span className="evidence-count">
                          {
                            selectedProvider
                              .proofPhotos
                              .length
                          }
                          /7
                        </span>
                      </div>

                      <div className="evidence-photo-grid">
                        {selectedProvider.proofPhotos.map(
                          (
                            photo,
                            index
                          ) => (
                            <div
                              className="evidence-photo"
                              key={`${selectedProvider.id}-${index}`}
                            >
                              <img
                                src={photo}
                                alt={`Proof of work ${
                                  index +
                                  1
                                }`}
                              />

                              <span>
                                {
                                  index +
                                  1
                                }
                              </span>
                            </div>
                          )
                        )}
                      </div>

                      <div className="photo-limit-note">
                        📸 Workers can add up
                        to 7 photos showing
                        their previous work.
                      </div>
                    </div>

                    <div className="profile-section">
                      <h3>
                        Trust & ratings
                      </h3>

                      <div className="trust-box">
                        <div>
                          <strong>
                            ⭐{" "}
                            {
                              selectedProvider.rating
                            }
                          </strong>

                          <span>
                            Overall rating
                          </span>
                        </div>

                        <div>
                          <strong>✓</strong>

                          <span>
                            Profile verified
                          </span>
                        </div>

                        <div>
                          <strong>📷</strong>

                          <span>
                            {
                              selectedProvider
                                .proofPhotos
                                .length
                            }{" "}
                            work photos
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="profile-actions">
                      <button
                        type="button"
                        className="btn primary message-button"
                        onClick={
                          openMessage
                        }
                      >
                        💬 Message{" "}
                        {
                          selectedProvider.name.split(
                            " "
                          )[0]
                        }
                      </button>

                      <button
                        type="button"
                        className="btn"
                        onClick={
                          closeProfile
                        }
                      >
                        Back to map
                      </button>
                    </div>
                  </>
                ) : (
                  <MessagePanel
                    recipient={
                      selectedProvider.name
                    }
                    message={message}
                    setMessage={setMessage}
                    sendMessage={
                      sendMessage
                    }
                    goBack={() =>
                      setMessageOpen(
                        false
                      )
                    }
                  />
                )}
              </div>
            </div>
          )}

          {/* =========================
              JOB PROFILE
          ========================== */}

          {selectedJob && (
            <div
              className="profile-overlay"
              onClick={closeProfile}
            >
              <div
                className="profile-modal job-modal"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                <button
                  type="button"
                  className="close-button"
                  onClick={closeProfile}
                  aria-label="Close job"
                >
                  ×
                </button>

                {!messageOpen ? (
                  <>
                    <div className="job-detail-photo">
                      <img
                        src={
                          selectedJob.photo
                        }
                        alt={
                          selectedJob.title
                        }
                      />

                      <span className="large-job-status">
                        {
                          selectedJob.status
                        }
                      </span>

                      <span className="large-photo-count">
                        📷{" "}
                        {
                          selectedJob
                            .jobPhotos
                            .length
                        }{" "}
                        photos
                      </span>
                    </div>

                    <div className="job-detail-header">
                      <div className="customer-avatar">
                        {
                          selectedJob.customerEmoji
                        }
                      </div>

                      <div>
                        <h2>
                          {
                            selectedJob.title
                          }
                        </h2>

                        <div className="profile-service">
                          Posted by{" "}
                          {
                            selectedJob.customerName
                          }
                        </div>
                      </div>
                    </div>

                    <div className="job-info-grid">
                      <div>
                        <span>
                          📍 Location
                        </span>

                        <strong>
                          {
                            selectedJob.area
                          }
                        </strong>

                        <small>
                          {
                            selectedJob.road
                          }
                        </small>
                      </div>

                      <div>
                        <span>
                          💰 Budget
                        </span>

                        <strong>
                          {
                            selectedJob.budget
                          }
                        </strong>
                      </div>

                      <div>
                        <span>
                          🛠️ Service
                        </span>

                        <strong>
                          {
                            selectedJob.service
                          }
                        </strong>
                      </div>

                      <div>
                        <span>
                          ⏰ When
                        </span>

                        <strong>
                          {
                            selectedJob.date
                          }
                        </strong>
                      </div>
                    </div>

                    <div className="profile-section">
                      <h3>
                        What needs to be
                        done?
                      </h3>

                      <p>
                        {
                          selectedJob.description
                        }
                      </p>
                    </div>

                    <div className="profile-section">
                      <div className="evidence-heading">
                        <div>
                          <h3>
                            Photos of the
                            job
                          </h3>

                          <p>
                            These photos help
                            workers understand
                            what needs to be done
                            before contacting
                            the customer.
                          </p>
                        </div>

                        <span className="evidence-count">
                          {
                            selectedJob
                              .jobPhotos
                              .length
                          }
                          /5
                        </span>
                      </div>

                      <div className="job-photo-gallery">
                        {selectedJob.jobPhotos.map(
                          (
                            photo,
                            index
                          ) => (
                            <div
                              className="job-gallery-photo"
                              key={`${selectedJob.id}-${index}`}
                            >
                              <img
                                src={photo}
                                alt={`Job photo ${
                                  index +
                                  1
                                }`}
                              />

                              <span>
                                {
                                  index +
                                  1
                                }
                              </span>
                            </div>
                          )
                        )}
                      </div>

                      <div className="photo-limit-note">
                        📷 People posting jobs
                        can add up to 5 photos
                        to explain the work
                        that needs to be done.
                      </div>
                    </div>

                    <div className="profile-section">
                      <h3>
                        Job location
                      </h3>

                      <div className="job-location-box">
                        📍{" "}
                        {
                          selectedJob.area
                        }{" "}
                        ·{" "}
                        {
                          selectedJob.road
                        }

                        <small>
                          {
                            selectedJob.km
                          }{" "}
                          from Nairobi
                        </small>
                      </div>
                    </div>

                    <div className="profile-section">
                      <h3>
                        About the person
                        requesting help
                      </h3>

                      <div className="customer-profile-box">
                        <div className="customer-avatar large">
                          {
                            selectedJob.customerEmoji
                          }
                        </div>

                        <div>
                          <strong>
                            {
                              selectedJob.customerName
                            }
                          </strong>

                          <span>
                            Job requester
                          </span>

                          <small>
                            📍{" "}
                            {
                              selectedJob.area
                            }
                          </small>
                        </div>
                      </div>
                    </div>

                    <div className="profile-actions">
                      <button
                        type="button"
                        className="btn primary message-button"
                        onClick={
                          openMessage
                        }
                      >
                        💬 Message{" "}
                        {
                          selectedJob.customerName.split(
                            " "
                          )[0]
                        }
                      </button>

                      <button
                        type="button"
                        className="btn"
                        onClick={
                          closeProfile
                        }
                      >
                        Back to jobs
                      </button>
                    </div>
                  </>
                ) : (
                  <MessagePanel
                    recipient={
                      selectedJob.customerName
                    }
                    message={message}
                    setMessage={setMessage}
                    sendMessage={
                      sendMessage
                    }
                    goBack={() =>
                      setMessageOpen(
                        false
                      )
                    }
                  />
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          height: 100%;
          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          color: #17221b;
        }

        body {
          background: #eef1ed;
        }

        button,
        input,
        textarea {
          font: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        .app {
          height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .topbar {
          height: 68px;
          background: #fff;
          border-bottom: 1px solid #dfe5df;
          display: flex;
          align-items: center;
          padding: 0 22px;
          gap: 18px;
          z-index: 1000;
        }

        .brand {
          font-weight: 850;
          font-size: 21px;
          white-space: nowrap;
        }

        .brand span {
          color: #15803d;
        }

        .search {
          height: 44px;
          flex: 1;
          max-width: 650px;
          border: 1px solid #d8ded8;
          border-radius: 13px;
          background: #f8faf8;
          display: flex;
          align-items: center;
          padding: 0 14px;
          gap: 9px;
          color: #718078;
        }

        .search input {
          border: 0;
          outline: 0;
          background: transparent;
          width: 100%;
          font-size: 14px;
        }

        .actions {
          margin-left: auto;
          display: flex;
          gap: 9px;
        }

        .btn {
          border: 1px solid #d4dbd5;
          background: #fff;
          border-radius: 11px;
          padding: 10px 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn:hover {
          background: #f5f8f5;
        }

        .btn.primary {
          background: #16803d;
          color: white;
          border-color: #16803d;
        }

        .btn.primary:hover {
          background: #126b33;
        }

        .content {
          position: relative;
          flex: 1;
          min-height: 0;
        }

        .map {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .panel {
          position: absolute;
          left: 18px;
          top: 18px;
          width: 380px;
          max-height: calc(100% - 36px);
          overflow: auto;
          background: rgba(
            255,
            255,
            255,
            0.96
          );
          backdrop-filter: blur(10px);
          border: 1px solid #dce4dc;
          border-radius: 18px;
          box-shadow:
            0 12px 40px
              rgba(
                27,
                43,
                31,
                0.16
              );
          z-index: 900;
          padding: 18px;
        }

        .hero h1 {
          margin: 0 0 6px;
          font-size: 27px;
          letter-spacing: -0.7px;
        }

        .hero p {
          margin: 0 0 16px;
          color: #647169;
          font-size: 13px;
          line-height: 1.45;
        }

        .main-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
          padding: 4px;
          background: #eef3ef;
          border-radius: 12px;
          margin-bottom: 12px;
        }

        .main-tab {
          border: 0;
          background: transparent;
          border-radius: 9px;
          padding: 10px 7px;
          font-size: 12px;
          font-weight: 800;
          color: #647169;
          cursor: pointer;
        }

        .main-tab.active {
          background: white;
          color: #16803d;
          box-shadow:
            0 2px 8px
              rgba(
                0,
                0,
                0,
                0.08
              );
        }

        .choice {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-bottom: 14px;
        }

        .choice button {
          border: 1px solid #dce3dd;
          background: #f7faf7;
          border-radius: 12px;
          padding: 12px 8px;
          font-weight: 800;
          cursor: pointer;
        }

        .choice button.selected {
          background: #e9f7ee;
          border-color: #b9dfc6;
          color: #126b33;
        }

        .field {
          min-height: 43px;
          border: 1px solid #d8dfd9;
          border-radius: 11px;
          background: white;
          display: flex;
          align-items: center;
          padding: 0 8px 0 11px;
          margin-bottom: 9px;
          gap: 7px;
        }

        .field input {
          width: 100%;
          border: 0;
          outline: 0;
          font-size: 13px;
          min-width: 0;
        }

        .location-search-field {
          padding-right: 5px;
        }

        .area-search-button {
          border: 0;
          background: #16803d;
          color: white;
          border-radius: 8px;
          padding: 7px 10px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
        }

        .area-search-button:hover {
          background: #126b33;
        }

        .area-search-button:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .area-message {
          margin-top: -4px;
          margin-bottom: 9px;
          padding: 7px 9px;
          border-radius: 8px;
          background: #eef8f0;
          color: #287343;
          font-size: 10px;
          line-height: 1.4;
        }

        .area-message.error {
          background: #fff4f2;
          color: #b33b2f;
        }

        .chips {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          margin: 7px 0 15px;
        }

        .chip {
          border: 1px solid #dce3dd;
          border-radius: 99px;
          background: white;
          padding: 7px 10px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .chip:hover {
          background: #e9f7ee;
          border-color: #b9dfc6;
        }

        .section-title {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #758178;
          font-weight: 850;
          margin: 16px 0 9px;
        }

        .provider {
          display: block;
          width: 100%;
          text-align: left;
          border: 1px solid #e0e6e1;
          border-radius: 13px;
          padding: 11px;
          margin-bottom: 9px;
          background: white;
          cursor: pointer;
        }

        .provider:hover {
          border-color: #8cc49b;
          box-shadow:
            0 4px 16px
              rgba(
                20,
                100,
                45,
                0.1
              );
          transform: translateY(-1px);
        }

        .provider-top {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .provider-info {
          min-width: 0;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #dfece2;
          display: grid;
          place-items: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .avatar img,
        .large-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pname {
          font-weight: 800;
          font-size: 13px;
        }

        .meta {
          font-size: 11px;
          color: #69756d;
          margin-top: 2px;
        }

        .location {
          font-size: 10px;
          color: #68756d;
          margin-top: 3px;
        }

        .status {
          margin-left: auto;
          font-size: 10px;
          font-weight: 800;
          white-space: nowrap;
        }

        .status.available {
          color: #16803d;
        }

        .status.taken {
          color: #d97706;
        }

        .provider-bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 9px;
          font-size: 11px;
          color: #526057;
        }

        .trusted {
          margin-top: 8px;
          padding-top: 7px;
          border-top: 1px solid #edf0ed;
          font-size: 10px;
          color: #52705b;
        }

        .job-card {
          display: block;
          width: 100%;
          padding: 0;
          margin-bottom: 10px;
          text-align: left;
          background: white;
          border: 1px solid #e0e6e1;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
        }

        .job-card:hover {
          border-color: #8cc49b;
          box-shadow:
            0 5px 18px
              rgba(
                20,
                100,
                45,
                0.12
              );
          transform: translateY(-1px);
        }

        .job-photo {
          height: 125px;
          position: relative;
          overflow: hidden;
          background: #e9eee9;
        }

        .job-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .job-status {
          position: absolute;
          top: 9px;
          right: 9px;
          border-radius: 99px;
          padding: 5px 8px;
          font-size: 9px;
          font-weight: 900;
          background: white;
          box-shadow:
            0 2px 8px
              rgba(
                0,
                0,
                0,
                0.12
              );
        }

        .job-status.open {
          color: #16803d;
        }

        .job-status.found {
          color: #d97706;
        }

        .photo-count {
          position: absolute;
          bottom: 8px;
          right: 8px;
          background: rgba(
            0,
            0,
            0,
            0.68
          );
          color: white;
          padding: 5px 8px;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 800;
        }

        .job-content {
          padding: 11px;
        }

        .job-title {
          font-size: 14px;
          font-weight: 850;
          color: #17221b;
        }

        .job-customer {
          margin-top: 5px;
          font-size: 11px;
          color: #657168;
        }

        .job-location {
          margin-top: 4px;
          font-size: 10px;
          color: #68756d;
        }

        .job-details-row {
          display: flex;
          justify-content: space-between;
          gap: 5px;
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid #edf0ed;
          font-size: 10px;
          color: #526057;
        }

        .empty {
          font-size: 12px;
          color: #6b776f;
          padding: 8px 0;
        }

        .post-button {
          width: 100%;
        }

        .pin {
          width: 34px;
          height: 34px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid #fff;
          box-shadow:
            0 3px 12px
              #0003;
        }

        .pin span {
          display: block;
          transform: rotate(45deg);
          color: #fff;
          text-align: center;
          font-size: 16px;
          padding-top: 5px;
        }

        .job-pin {
          width: 38px;
          height: 38px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          background: #bb0000;
          border: 3px solid white;
          box-shadow:
            0 4px 14px
              rgba(
                0,
                0,
                0,
                0.3
              );
        }

        .job-pin span {
          display: block;
          transform: rotate(45deg);
          text-align: center;
          padding-top: 6px;
          font-size: 18px;
        }

        .search-location-pin {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #16803d;
          border: 4px solid white;
          box-shadow:
            0 4px 16px
              rgba(
                0,
                0,
                0,
                0.3
              );
          display: grid;
          place-items: center;
          font-size: 20px;
        }

        .profile-overlay {
          position: absolute;
          inset: 0;
          z-index: 2000;
          background: rgba(
            14,
            23,
            17,
            0.48
          );
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 25px;
        }

        .profile-modal {
          position: relative;
          width: min(620px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 20px;
          box-shadow:
            0 25px 80px
              rgba(
                0,
                0,
                0,
                0.28
              );
          padding: 25px;
        }

        .close-button {
          position: absolute;
          top: 14px;
          right: 15px;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid #dce3dd;
          background: white;
          font-size: 25px;
          line-height: 1;
          cursor: pointer;
          z-index: 3;
        }

        .profile-header {
          display: flex;
          gap: 16px;
          align-items: center;
          padding-right: 45px;
        }

        .large-avatar {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          background: #dfece2;
          display: grid;
          place-items: center;
          font-size: 34px;
          flex-shrink: 0;
          border: 4px solid #eef7f0;
          overflow: hidden;
        }

        .profile-header h2 {
          margin: 0;
          font-size: 24px;
        }

        .profile-service {
          color: #657168;
          font-size: 13px;
          margin-top: 4px;
        }

        .profile-status {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          font-size: 11px;
          font-weight: 800;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .available-dot {
          background: #16803d;
        }

        .taken-dot {
          background: #d97706;
        }

        .profile-rating {
          margin-top: 22px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f4faf5;
          border: 1px solid #dcebdd;
          border-radius: 12px;
          padding: 12px 14px;
        }

        .profile-rating strong {
          font-size: 18px;
        }

        .profile-rating span {
          color: #657168;
          font-size: 12px;
        }

        .profile-location {
          margin-top: 12px;
          border: 1px solid #e1e7e2;
          border-radius: 12px;
          padding: 13px;
          font-size: 13px;
        }

        .profile-location div {
          margin-top: 5px;
        }

        .profile-location small {
          display: block;
          color: #718078;
          margin-top: 4px;
        }

        .profile-section {
          margin-top: 22px;
        }

        .profile-section h3 {
          margin: 0 0 9px;
          font-size: 14px;
        }

        .profile-section p {
          margin: 0;
          color: #5f6d64;
          font-size: 13px;
          line-height: 1.55;
        }

        .service-box {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          border: 1px solid #e1e7e2;
          border-radius: 12px;
          padding: 13px;
          font-size: 13px;
        }

        .service-box strong {
          color: #16803d;
          white-space: nowrap;
        }

        .evidence-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 11px;
        }

        .evidence-heading h3 {
          margin-bottom: 4px;
        }

        .evidence-heading p {
          font-size: 11px;
        }

        .evidence-count {
          background: #e9f7ee;
          color: #126b33;
          border: 1px solid #c5e4ce;
          padding: 5px 8px;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 900;
          white-space: nowrap;
        }

        .evidence-photo-grid {
          display: grid;
          grid-template-columns: repeat(
            3,
            1fr
          );
          gap: 9px;
        }

        .evidence-photo {
          height: 125px;
          position: relative;
          overflow: hidden;
          border-radius: 11px;
          background: #edf1ed;
          border: 1px solid #dfe6df;
        }

        .evidence-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition:
            transform 0.2s ease;
        }

        .evidence-photo:hover img,
        .job-gallery-photo:hover img {
          transform: scale(1.04);
        }

        .evidence-photo span,
        .job-gallery-photo span {
          position: absolute;
          left: 7px;
          bottom: 7px;
          min-width: 23px;
          height: 23px;
          padding: 0 6px;
          border-radius: 99px;
          display: grid;
          place-items: center;
          background: rgba(
            0,
            0,
            0,
            0.7
          );
          color: white;
          font-size: 10px;
          font-weight: 900;
        }

        .photo-limit-note {
          margin-top: 9px;
          padding: 9px 10px;
          border-radius: 9px;
          background: #f7faf7;
          border: 1px solid #e1e7e2;
          color: #657168;
          font-size: 10px;
        }

        .trust-box {
          display: grid;
          grid-template-columns: repeat(
            3,
            1fr
          );
          gap: 8px;
        }

        .trust-box div {
          background: #f7faf7;
          border: 1px solid #e1e7e2;
          border-radius: 11px;
          padding: 11px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .trust-box strong {
          font-size: 16px;
        }

        .trust-box span {
          font-size: 10px;
          color: #68756d;
        }

        .profile-actions {
          display: flex;
          gap: 9px;
          margin-top: 24px;
        }

        .message-button {
          flex: 1;
        }

        .job-detail-photo {
          height: 230px;
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          margin: -4px 0 20px;
          background: #edf1ed;
        }

        .job-detail-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .large-job-status {
          position: absolute;
          top: 12px;
          left: 12px;
          background: white;
          color: #16803d;
          padding: 7px 11px;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 900;
          box-shadow:
            0 3px 12px
              rgba(
                0,
                0,
                0,
                0.14
              );
        }

        .large-photo-count {
          position: absolute;
          right: 12px;
          bottom: 12px;
          background: rgba(
            0,
            0,
            0,
            0.72
          );
          color: white;
          padding: 7px 10px;
          border-radius: 99px;
          font-size: 10px;
          font-weight: 900;
        }

        .job-detail-header {
          display: flex;
          gap: 13px;
          align-items: center;
          padding-right: 40px;
        }

        .job-detail-header h2 {
          margin: 0;
          font-size: 22px;
        }

        .customer-avatar {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: #eef3ef;
          font-size: 25px;
          flex-shrink: 0;
        }

        .customer-avatar.large {
          width: 60px;
          height: 60px;
          font-size: 29px;
        }

        .job-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 20px;
        }

        .job-info-grid > div {
          border: 1px solid #e1e7e2;
          background: #f8faf8;
          border-radius: 11px;
          padding: 11px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .job-info-grid span {
          font-size: 10px;
          color: #718078;
          font-weight: 700;
        }

        .job-info-grid strong {
          font-size: 12px;
        }

        .job-info-grid small {
          color: #718078;
          font-size: 10px;
        }

        .job-photo-gallery {
          display: grid;
          grid-template-columns: repeat(
            3,
            1fr
          );
          gap: 9px;
        }

        .job-gallery-photo {
          height: 125px;
          position: relative;
          overflow: hidden;
          border-radius: 11px;
          background: #edf1ed;
          border: 1px solid #dfe6df;
        }

        .job-gallery-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition:
            transform 0.2s ease;
        }

        .job-location-box {
          border: 1px solid #dce5dd;
          border-radius: 12px;
          background: #f5faf6;
          padding: 14px;
          font-size: 13px;
          font-weight: 700;
        }

        .job-location-box small {
          display: block;
          margin-top: 5px;
          color: #718078;
          font-size: 11px;
          font-weight: 400;
        }

        .customer-profile-box {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #e1e7e2;
          border-radius: 13px;
          padding: 12px;
        }

        .customer-profile-box div:last-child {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .customer-profile-box span,
        .customer-profile-box small {
          font-size: 11px;
          color: #718078;
        }

        .message-panel {
          min-height: 520px;
          display: flex;
          flex-direction: column;
        }

        .message-header {
          display: flex;
          gap: 12px;
          align-items: center;
          border-bottom: 1px solid #e5eae6;
          padding-bottom: 15px;
          padding-right: 35px;
        }

        .message-header h2 {
          margin: 0;
          font-size: 19px;
        }

        .message-header span {
          display: block;
          margin-top: 3px;
          color: #758178;
          font-size: 11px;
        }

        .back-button {
          border: 1px solid #dce3dd;
          background: white;
          border-radius: 9px;
          width: 38px;
          height: 38px;
          cursor: pointer;
          font-size: 20px;
        }

        .message-safety {
          margin-top: 14px;
          background: #f4faf5;
          border: 1px solid #dcebdd;
          border-radius: 10px;
          padding: 10px;
          font-size: 11px;
          color: #52705b;
        }

        .conversation {
          flex: 1;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .empty-conversation {
          text-align: center;
          max-width: 330px;
          color: #657168;
        }

        .empty-conversation > div {
          font-size: 35px;
          margin-bottom: 10px;
        }

        .empty-conversation strong {
          display: block;
          color: #26352b;
          margin-bottom: 5px;
        }

        .empty-conversation p {
          font-size: 12px;
          line-height: 1.5;
          margin: 0;
        }

        .message-composer {
          border-top: 1px solid #e5eae6;
          padding-top: 14px;
          display: flex;
          gap: 9px;
        }

        .message-composer textarea {
          flex: 1;
          resize: none;
          border: 1px solid #d8dfd9;
          border-radius: 10px;
          padding: 10px;
          outline: none;
          font-size: 13px;
        }

        .message-composer textarea:focus {
          border-color: #16803d;
        }

        @media (max-width: 800px) {
          .topbar {
            height: 62px;
            padding: 0 12px;
          }

          .brand {
            font-size: 18px;
          }

          .actions {
            display: none;
          }

          .search {
            max-width: none;
          }

          .panel {
            left: 10px;
            right: 10px;
            width: auto;
            top: auto;
            bottom: 10px;
            max-height: 58%;
            padding: 14px;
          }

          .hero h1 {
            font-size: 22px;
          }

          .profile-overlay {
            padding: 10px;
          }

          .profile-modal {
            max-height: 94vh;
            padding: 18px;
          }

          .evidence-photo-grid,
          .job-photo-gallery {
            grid-template-columns: 1fr 1fr;
          }

          .trust-box {
            grid-template-columns: 1fr;
          }

          .profile-actions {
            flex-direction: column;
          }

          .message-composer {
            flex-direction: column;
          }

          .job-info-grid {
            grid-template-columns: 1fr;
          }

          .location-search-field {
            gap: 5px;
          }

          .area-search-button {
            padding: 7px 8px;
            font-size: 10px;
          }
        }
      `}</style>
    </>
  );
}

function MessagePanel({
  recipient,
  message,
  setMessage,
  sendMessage,
  goBack,
}: {
  recipient: string;
  message: string;
  setMessage: (value: string) => void;
  sendMessage: () => void;
  goBack: () => void;
}) {
  return (
    <div className="message-panel">
      <div className="message-header">
        <button
          type="button"
          className="back-button"
          onClick={goBack}
        >
          ←
        </button>

        <div>
          <h2>
            Message {recipient}
          </h2>

          <span>
            Discuss the job before meeting
          </span>
        </div>
      </div>

      <div className="message-safety">
        🔒 Keep communication inside Kazi za
        Kenya until you are comfortable meeting.
      </div>

      <div className="conversation">
        <div className="empty-conversation">
          <div>💬</div>

          <strong>
            Start a conversation
          </strong>

          <p>
            Ask about price, availability,
            experience, location or the job
            requirements before agreeing to meet.
          </p>
        </div>
      </div>

      <div className="message-composer">
        <textarea
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Type your message..."
          rows={3}
        />

        <button
          type="button"
          className="btn primary"
          onClick={sendMessage}
        >
          Send message
        </button>
      </div>
    </div>
  );
}