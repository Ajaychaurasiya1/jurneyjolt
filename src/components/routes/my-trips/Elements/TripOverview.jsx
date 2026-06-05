import { LogInContext } from "@/Context/LogInContext/Login";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useContext } from "react";

function StatCard({ icon, label, value }) {
  return (
    <Card className="border-foreground/20 bg-foreground/5">
      <CardContent className="p-4 text-center">
        <div className="text-2xl mb-1">{icon}</div>
        <p className="text-xs uppercase tracking-wide opacity-70">{label}</p>
        <p className="font-bold text-sm md:text-base mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}

function TripOverview() {
  const { trip } = useContext(LogInContext);
  const data = trip?.tripData;
  if (!data) return null;

  const totalPlaces = data.itinerary?.reduce(
    (sum, day) => sum + (day.places?.length || 0),
    0
  );

  return (
    <section className="my-10 md:my-16">
      <h2 className="text-2xl md:text-4xl font-black text-center mb-2 bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
        Trip Overview
      </h2>
      <p className="text-center opacity-80 max-w-2xl mx-auto mb-8 text-sm md:text-base">
        {data.overview}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard icon="📆" label="Duration" value={`${data.duration} Days`} />
        <StatCard icon="📍" label="Places" value={`${totalPlaces} Spots`} />
        <StatCard icon="🏨" label="Hotels" value={`${data.hotels?.length || 0} Options`} />
        <StatCard icon="💵" label="Daily Budget" value={data.estimatedDailyBudget || data.budget} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-foreground/20">
          <CardHeader>
            <CardTitle className="text-lg">🌤️ Best Time to Visit</CardTitle>
          </CardHeader>
          <CardContent className="opacity-90 text-sm md:text-base">
            {data.bestTimeToVisit}
          </CardContent>
        </Card>
        <Card className="border-foreground/20">
          <CardHeader>
            <CardTitle className="text-lg">🚗 Getting Around</CardTitle>
          </CardHeader>
          <CardContent className="opacity-90 text-sm md:text-base space-y-2">
            <p>{data.transportation?.gettingAround}</p>
            <p>{data.transportation?.airport}</p>
            <p className="text-primary/70">{data.transportation?.localTip}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default TripOverview;
