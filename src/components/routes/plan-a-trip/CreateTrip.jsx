import { Input } from "@/components/ui/input";
import React, { useContext, useRef, useState } from "react";
import LocationAutocomplete from "@/components/ui/location-autocomplete";
import {
  SelectBudgetOptions,
  SelectNoOfPersons,
} from "../../constants/Options";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { LogInIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { planTrip } from "@/Service/TripPlanner";
import { saveLocalTrip } from "@/Service/TripStorage";
import { LogInContext } from "@/Context/LogInContext/Login";
import { db } from "@/Service/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function CreateTrip({ createTripPageRef }) {
  const [formData, setFormData] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signInName, setSignInName] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const pendingGenerateRef = useRef(false);
  const navigate = useNavigate();

  const { user, signIn, isAuthenticated, setTrip } = useContext(LogInContext);

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    const days = Number(formData?.noOfDays);

    if (!formData?.location || !formData?.People || !formData?.Budget || !days) {
      toast.error("Please fill out every field or select every option.");
      return false;
    }
    if (days > 5) {
      toast.error("Please enter Trip Days less than 5");
      return false;
    }
    if (days < 1) {
      toast.error("Invalid number of Days");
      return false;
    }
    return true;
  };

  const runTripGeneration = async (currentUser) => {
    if (!validateForm()) return;

    const tripInput = {
      location: formData.location,
      noOfDays: Number(formData.noOfDays),
      People: formData.People,
      Budget: formData.Budget,
    };

    const toastId = toast.loading("Building your trip...", { icon: "✈️" });
    setIsLoading(true);

    try {
      const { trip } = await planTrip(tripInput);

      const id = Date.now().toString();
      const tripDoc = {
        tripId: id,
        userSelection: formData,
        tripData: trip,
        userName: currentUser?.name,
        userEmail: currentUser?.email,
      };

      setTrip(tripDoc);
      saveLocalTrip(currentUser.email, tripDoc);

      toast.dismiss(toastId);
      toast.success("Trip created successfully!");

      navigate("/my-trips/" + id);

      setDoc(doc(db, "Trips", id), tripDoc).catch((error) => {
        console.error("Firebase save failed:", error);
        toast.error("Trip ready, but cloud save failed. Check Firebase.");
      });
    } catch (error) {
      console.error("Trip generation failed:", error);
      toast.dismiss(toastId);
      toast.error("Failed to generate trip. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateTrip = async () => {
    if (!isAuthenticated || !user) {
      pendingGenerateRef.current = true;
      toast("Sign in to save your trip", { icon: "🔐" });
      setIsDialogOpen(true);
      return;
    }
    await runTripGeneration(user);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const success = await signIn(signInName.trim(), signInEmail.trim());
    if (!success) return;

    setIsDialogOpen(false);
    setSignInName("");
    setSignInEmail("");

    if (pendingGenerateRef.current) {
      pendingGenerateRef.current = false;
      const signedInUser = JSON.parse(localStorage.getItem("User"));
      await runTripGeneration(signedInUser);
    }
  };

  return (
    <div ref={createTripPageRef} className="mt-10 text-center">
      <div className="text">
        <h2 className="text-3xl md:text-5xl font-bold mb-5 flex items-center justify-center">
          <span className="hidden md:block">🚀</span>{" "}
          <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
            Share Your Travel Preferences{" "}
          </span>{" "}
          <span className="hidden md:block">🚀</span>
        </h2>
        <p className="opacity-90 mx-auto text-center text-md md:text-xl font-medium tracking-tight text-primary/80">
          Embark on your dream adventure with just a few simple details. <br />
          <span className="bg-gradient-to-b text-2xl from-blue-400 to-blue-700 bg-clip-text text-center text-transparent">
            JourneyJolt
          </span>{" "}
          <br /> will curate a personalized itinerary, crafted to match your
          unique preferences!
        </p>
      </div>

      <div className="form mt-14 flex flex-col gap-16 md:gap-20 ">
        <div className="place">
          <h2 className="font-semibold text-lg md:text-xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              Where do you want to Explore?
            </span>{" "}
            🏖️
          </h2>
          <LocationAutocomplete
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-center"
            onSelect={(location) => {
              handleInputChange("location", location.label);
            }}
            placeholder="Enter a City"
          />
        </div>

        <div className="day">
          <h2 className="font-semibold text-lg md:text-xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              How long is your Trip?
            </span>{" "}
            🕜
          </h2>
          <Input
            className="text-center"
            placeholder="Ex: 2"
            type="number"
            min="1"
            max="5"
            name="noOfDays"
            required
            onChange={(day) => handleInputChange("noOfDays", day.target.value)}
          />
        </div>

        <div className="budget">
          <h2 className="font-semibold text-lg md:text-xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              What is your Budget?
            </span>{" "}
            💳
          </h2>
          <div className="options grid grid-cols-1 gap-5 md:grid-cols-3">
            {SelectBudgetOptions.map((item) => (
              <div
                onClick={() => handleInputChange("Budget", item.title)}
                key={item.id}
                className={`option cursor-pointer transition-all hover:scale-110 p-4 h-32 flex items-center justify-center flex-col border hover:shadow-foreground/10 hover:shadow-md rounded-lg
                  ${
                    formData?.Budget == item.title &&
                    "border border-foreground/80"
                  }`}
              >
                <h3 className="font-bold text-[15px] md:font-[18px]">
                  {item.icon}{" "}
                  <span
                    className={`${
                      formData?.Budget == item.title
                        ? "bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-center text-transparent"
                        : ""
                    }`}
                  >
                    {item.title}
                  </span>
                </h3>
                <p className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="people">
          <h2 className="font-semibold text-lg md:text-xl mb-3 ">
            <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              Who are you traveling with?
            </span>{" "}
            🚗
          </h2>
          <div className="options grid grid-cols-1 gap-5 md:grid-cols-3">
            {SelectNoOfPersons.map((item) => (
              <div
                onClick={() => handleInputChange("People", item.no)}
                key={item.id}
                className={`option cursor-pointer transition-all hover:scale-110 p-4 h-32 flex items-center justify-center flex-col border rounded-lg hover:shadow-foreground/10 hover:shadow-md
                  ${formData?.People == item.no && "border border-foreground/80"}`}
              >
                <h3 className="font-bold text-[15px] md:font-[18px]">
                  {item.icon}{" "}
                  <span
                    className={`${
                      formData?.People == item.no
                        ? "bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text text-center text-transparent"
                        : ""
                    }`}
                  >
                    {item.title}
                  </span>
                </h3>
                <p className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
                  {item.desc}
                </p>
                <p className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
                  {item.no}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="create-trip-btn w-full flex items-center justify-center h-32">
        <Button disabled={isLoading} onClick={generateTrip}>
          {isLoading ? (
            <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" />
          ) : (
            "Let's Go 🌏"
          )}
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
              Sign In to Continue
            </DialogTitle>
            <DialogDescription className="text-center opacity-90 tracking-tight text-primary/80">
              Enter your name and email to save your trip. Trip generation will
              start right after you sign in.
            </DialogDescription>
            <form onSubmit={handleSignIn} className="flex flex-col gap-3 mt-4">
              <Input
                placeholder="Your name"
                value={signInName}
                onChange={(e) => setSignInName(e.target.value)}
                required
                autoFocus
              />
              <Input
                type="email"
                placeholder="your@email.com"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-full flex gap-2 items-center justify-center"
              >
                Continue & Generate Trip <LogInIcon className="h-4 w-4" />
              </Button>
            </form>
          </DialogHeader>
          <DialogFooter>
            <DialogClose className="w-full">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  pendingGenerateRef.current = false;
                }}
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
