import { db } from "@/Service/Firebase";
import { getLocalTripById } from "@/Service/TripStorage";
import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Locationinfo from "../Elements/Locationinfo";
import TripOverview from "../Elements/TripOverview";
import Hotels from "../Elements/Hotels";
import FoodGuide from "../Elements/FoodGuide";
import Places from "../Elements/Places";
import TripTips from "../Elements/TripTips";
import { LogInContext } from "@/Context/LogInContext/Login";

function Mytrips() {
  const { tripId } = useParams();
  const { trip, setTrip, user } = useContext(LogInContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!tripId) return;

    let cancelled = false;

    const loadTrip = async () => {
      const localTrip = getLocalTripById(user?.email, tripId);
      if (localTrip) {
        if (!cancelled) {
          setTrip(localTrip);
          setIsLoading(false);
        }
        return;
      }

      try {
        const docRef = doc(db, "Trips", tripId);
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 8000)
        );
        const docSnap = await Promise.race([getDoc(docRef), timeout]);

        if (cancelled) return;

        if (docSnap.exists()) {
          setTrip(docSnap.data());
        } else {
          toast.error("Trip not found");
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load trip:", error);
          toast.error("Could not load trip. Try again from My Trips.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    if (trip?.tripId === tripId && trip?.tripData) {
      setIsLoading(false);
      return;
    }

    loadTrip();

    return () => {
      cancelled = true;
    };
  }, [tripId, setTrip, user?.email]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center opacity-70">
        Loading your trip...
      </div>
    );
  }

  if (!trip?.tripData) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center opacity-70">
        Trip not available.
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4">
      <Locationinfo />
      <TripOverview />
      <Hotels />
      <FoodGuide />
      <Places />
      <TripTips />
    </div>
  );
}

export default Mytrips;
