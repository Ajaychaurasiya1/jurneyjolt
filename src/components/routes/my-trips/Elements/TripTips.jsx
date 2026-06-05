import { LogInContext } from "@/Context/LogInContext/Login";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useContext } from "react";

function TripTips() {
  const { trip } = useContext(LogInContext);
  const data = trip?.tripData;
  if (!data) return null;

  return (
    <section className="my-10 md:my-16">
      <h2 className="text-2xl md:text-4xl font-black text-center mb-8 bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
        Travel Essentials
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-foreground/20">
          <CardHeader>
            <CardTitle>💡 Local Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(data.localTips || []).map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm md:text-base opacity-90">
                  <span className="text-blue-500 font-bold">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-foreground/20">
          <CardHeader>
            <CardTitle>🎒 Packing List</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(data.packingList || []).map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm md:text-base opacity-90 bg-foreground/5 rounded-md px-3 py-2"
                >
                  <span>✓</span> {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default TripTips;
