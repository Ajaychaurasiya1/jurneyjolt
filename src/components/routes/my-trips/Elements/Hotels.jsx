import React, { useContext } from "react";
import { LogInContext } from "@/Context/LogInContext/Login";
import Hotelcard from "./Hotelcard";

function Hotels() {
  const { trip } = useContext(LogInContext);
  const count = trip?.tripData?.hotels?.length || 0;

  return (
    <section className="my-10 md:my-16">
      <h2 className="text-2xl md:text-4xl font-black text-center mb-2 bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
        Where to Stay
      </h2>
      <p className="text-center opacity-80 mb-8 text-sm md:text-base">
        {count} handpicked hotels matching your {trip?.tripData?.budget || ""} budget
      </p>
      <Hotelcard />
    </section>
  );
}

export default Hotels;
