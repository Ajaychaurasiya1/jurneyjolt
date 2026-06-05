import { LogInContext } from "@/Context/LogInContext/Login";
import { db } from "@/Service/Firebase";
import { getLocalTrips, mergeTrips } from "@/Service/TripStorage";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import AlltripsCard from "./AlltripsCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

function Alltrips() {
  const { user, authReady } = useContext(LogInContext);
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authReady) return;

    if (!user?.email) {
      setAllTrips([]);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadTrips = async () => {
      const localTrips = getLocalTrips(user.email);

      if (!cancelled) {
        setAllTrips(localTrips);
        setLoading(false);
      }

      try {
        const q = query(
          collection(db, "Trips"),
          where("userEmail", "==", user.email)
        );
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Firebase timeout")), 8000)
        );
        const snapshot = await Promise.race([getDocs(q), timeout]);

        const remoteTrips = [];
        snapshot.forEach((doc) => remoteTrips.push(doc.data()));

        if (!cancelled) {
          setAllTrips(mergeTrips(localTrips, remoteTrips));
        }
      } catch (error) {
        console.error("Failed to load trips from Firebase:", error);
        if (!cancelled) {
          if (localTrips.length > 0) {
            setAllTrips(localTrips);
          } else {
            toast.error("Could not load trips from cloud. Showing local trips only.");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadTrips();

    return () => {
      cancelled = true;
    };
  }, [authReady, user?.email]);

  return (
    <div className="mb-10 py-6">
      <h1 className="text-3xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
        My Trips
      </h1>
      <p className="text-center opacity-80 mb-8 text-sm md:text-base">
        {loading
          ? "Loading your adventures..."
          : allTrips.length > 0
            ? `${allTrips.length} saved trip${allTrips.length > 1 ? "s" : ""}`
            : "No trips yet — plan your first adventure!"}
      </p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl border bg-foreground/5 animate-pulse"
            />
          ))}
        </div>
      ) : allTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allTrips.map((trip) => (
            <Link key={trip.tripId} to={"/my-trips/" + trip.tripId}>
              <AlltripsCard trip={trip} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-foreground/20 rounded-xl">
          <p className="text-4xl mb-4">✈️</p>
          <h3 className="font-bold text-xl mb-2">No trips yet</h3>
          <p className="opacity-80 mb-6 text-sm">
            Plan your first trip and it will appear here.
          </p>
          <Link to="/plan-a-trip">
            <Button>Plan a Trip</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Alltrips;
