import { LogInContext } from "@/Context/LogInContext/Login";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useContext } from "react";

function FoodGuide() {
  const { trip } = useContext(LogInContext);
  const foods = trip?.tripData?.foodRecommendations;
  if (!foods?.length) return null;

  return (
    <section className="my-10 md:my-16">
      <h2 className="text-2xl md:text-4xl font-black text-center mb-2 bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
        Food & Dining
      </h2>
      <p className="text-center opacity-80 mb-8 text-sm md:text-base">
        Must-try culinary experiences for your trip
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {foods.map((food, i) => (
          <Card key={i} className="border-foreground/20 overflow-hidden hover:scale-[1.02] transition-transform">
            <div className="h-40 overflow-hidden">
              <img
                src={food.image_url || "/logo.png"}
                alt={food.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{food.name}</CardTitle>
              <CardDescription>{food.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm opacity-90">
              🍽️ {food.cuisine} · 💵 {food.price}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default FoodGuide;
