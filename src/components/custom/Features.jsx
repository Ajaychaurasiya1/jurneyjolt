import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const features = [
  {
    icon: "🗺️",
    title: "Smart Itineraries",
    desc: "Get day-by-day plans with themed activities, timings, and local tips for every destination.",
  },
  {
    icon: "🏨",
    title: "Curated Hotels",
    desc: "Browse handpicked stays with ratings, amenities, pricing, and map links.",
  },
  {
    icon: "🍽️",
    title: "Food Guide",
    desc: "Discover must-try restaurants and local cuisine matched to your budget.",
  },
  {
    icon: "💡",
    title: "Travel Essentials",
    desc: "Packing lists, local tips, transport info, and budget estimates included.",
  },
  {
    icon: "📍",
    title: "Rich Place Details",
    desc: "Every attraction includes duration, category, pricing, photos, and directions.",
  },
  {
    icon: "☁️",
    title: "Save & Revisit",
    desc: "All your trips are saved so you can revisit and plan your next adventure anytime.",
  },
];

function Features() {
  return (
    <section className="w-full py-16 md:py-24 px-4">
      <h2 className="text-3xl md:text-5xl font-black text-center mb-3 bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
        Everything You Need to Travel
      </h2>
      <p className="text-center opacity-80 max-w-xl mx-auto mb-12 text-sm md:text-base">
        JourneyJolt gives you a complete travel guide — not just a list of places.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {features.map((f) => (
          <Card key={f.title} className="border-foreground/20 bg-foreground/5 hover:bg-foreground/10 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <span className="text-2xl">{f.icon}</span> {f.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm opacity-80">{f.desc}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default Features;
