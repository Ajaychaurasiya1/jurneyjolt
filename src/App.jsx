import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/custom/Header.jsx";
import Hero from "./components/custom/Hero.jsx";
import Features from "./components/custom/Features.jsx";
import HowItWorks from "./components/custom/HowItWorks.jsx";
import ProtectedRoute from "./components/custom/ProtectedRoute.jsx";
import CreateTrip from "./components/routes/plan-a-trip/CreateTrip.jsx";
import Mytrips from "./components/routes/my-trips/[tripId]/Mytrips.jsx";
import { useEffect, useRef } from "react";
import Footer from "./components/custom/Footer.jsx";
import Alltrips from "./components/routes/all-trips/Alltrips.jsx";
import gsap from "gsap";
import ProgressBar from "./components/constants/ProgressBar.jsx";
import { useRefContext } from "./Context/RefContext/RefContext.jsx";

function App() {
  const location = useLocation();

  const headerRef = useRef(null);
  const heroRef = useRef(null);
  const createTripPageRef = useRef(null);
  const footerRef = useRef(null);
  const { locationInfoRef } = useRefContext();

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "elastic.out(1,1)" } });

    // Header
    if (headerRef.current) {
      timeline.from(headerRef.current, { delay: 0.5, opacity: 0, y: -100 });
    }

    // Hero
    const heading = heroRef.current?.querySelector(".heading");
    const desc = heroRef.current?.querySelector(".desc");
    const buttons = heroRef.current?.querySelector(".buttons");
    const marquee = heroRef.current?.querySelector(".marquee");
    if (heading && desc && buttons && marquee) {
      timeline
        .from(heading, { opacity: 0, y: 100 })
        .from(desc, { opacity: 0, y: 100 }, "-=0.3")
        .from(buttons, { opacity: 0, y: 100 }, "-=0.3")
        .from(marquee, { y: 100, opacity: 0 }, "-=0.3");
    }

    // Create Trip Page
    const text = createTripPageRef.current?.querySelector(".text");
    const place = createTripPageRef.current?.querySelector(".place");
    const day = createTripPageRef.current?.querySelector(".day");
    const budget = createTripPageRef.current?.querySelector(".budget");
    const people = createTripPageRef.current?.querySelector(".people");
    const createTripBtn =
      createTripPageRef.current?.querySelector(".create-trip-btn");
    if (text && place && day && budget && people && createTripBtn) {
      timeline
        .from(text, { opacity: 0, y: 100 })
        .from(place, { opacity: 0, y: 100 }, "-=0.3")
        .from(day, { opacity: 0, y: 100 }, "-=0.3")
        .from(budget, { opacity: 0, y: 100 }, "-=0.3")
        .from(people, { opacity: 0, y: 100 }, "-=0.3")
        .from(createTripBtn, { opacity: 0, y: 100 }, "-=0.3");
    }

    // Location info
    const location = locationInfoRef?.current?.querySelector(".location");
    const carousel = locationInfoRef?.current?.querySelectorAll(".carousel");
    const locationInfo =
      locationInfoRef?.current?.querySelector(".location-info");
    if (location && carousel && locationInfo) {
      timeline
        .from(location, { opacity: 0, y: 100 })
        .from(carousel, { opacity: 0, y: 100 })
        .from(locationInfo, { opacity: 0, y: 100 });
    }

    // Footer
    if (footerRef.current) {
      timeline.from(footerRef.current, { opacity: 0, y: 100 });
    }

    return () => {
      timeline.kill();
    };
  }, [location.pathname]);

  return (
    <>
      <ProgressBar />
      <div className="app tracking-tighter min-w-[320px]">
        <Header headerRef={headerRef} />
        <div className="container max-w-[1024px] w-full min-w-[320px] h-auto">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero heroRef={heroRef} />
                  <Features />
                  <HowItWorks />
                </>
              }
            />
            <Route
              path="/plan-a-trip"
              element={<CreateTrip createTripPageRef={createTripPageRef} />}
            />
            <Route
              path="/my-trips/:tripId"
              element={
                <ProtectedRoute>
                  <Mytrips />
                </ProtectedRoute>
              }
            />
            <Route
              path="/all-trips"
              element={
                <ProtectedRoute>
                  <Alltrips />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer footerRef={footerRef} />
      </div>
    </>
  );
}

export default App;
