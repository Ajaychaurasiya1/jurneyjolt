import React from "react";

const steps = [
  { step: "01", title: "Sign In", desc: "Enter your name and email — no password needed." },
  { step: "02", title: "Set Preferences", desc: "Pick your destination, trip length, budget, and travel group." },
  { step: "03", title: "Generate Plan", desc: "Get a full itinerary with hotels, food, tips, and daily activities." },
  { step: "04", title: "Explore & Save", desc: "Browse your trip guide and revisit it anytime from My Trips." },
];

function HowItWorks() {
  return (
    <section className="w-full py-16 md:py-20 px-4 bg-foreground/5 rounded-2xl my-8">
      <h2 className="text-3xl md:text-4xl font-black text-center mb-12 bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-transparent">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {steps.map((s) => (
          <div key={s.step} className="text-center">
            <div className="text-4xl font-black text-blue-500/30 mb-2">{s.step}</div>
            <h3 className="font-bold text-lg mb-2">{s.title}</h3>
            <p className="text-sm opacity-80">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
