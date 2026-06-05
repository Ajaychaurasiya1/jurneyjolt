import React, { useContext } from "react";
import { useMediaQuery } from "react-responsive";
import { LogInContext } from "@/Context/LogInContext/Login";
import HotelCards from "../Cards/HotelCards";
import { useRefContext } from "@/Context/RefContext/RefContext";

function Hotelcard() {
  const isMobile = useMediaQuery({ query: "(max-width: 445px)" });
  const isSmall = useMediaQuery({ query: "(max-width: 640px)" });

  const { trip } = useContext(LogInContext);
  const city = trip?.tripData?.location;
  const hotels = trip?.tripData?.hotels;

  const { holetsRef } = useRefContext();

  return (
    <div ref={holetsRef} className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {hotels?.map((hotel, idx) => (
        <HotelCards key={idx} hotel={hotel} />
      ))}
    </div>
  );
}

export default Hotelcard;

// <React.Fragment key={idx}>
//   <HotelCards hotel={hotel} />
// </React.Fragment>
