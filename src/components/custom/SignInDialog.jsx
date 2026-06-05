import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LogInIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

function SignInDialog({ open, onOpenChange, onSignIn, isLoading }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem("User");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setName(parsed.name || "");
          setEmail(parsed.email || "");
          return;
        } catch {
          // ignore
        }
      }
      setName("");
      setEmail("");
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn(name.trim(), email.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
            Sign In to JourneyJolt
          </DialogTitle>
          <DialogDescription className="text-center">
            Enter your name and email to save and view your trips. No password
            needed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex gap-2 items-center justify-center"
          >
            Continue <LogInIcon className="h-4 w-4" />
          </Button>
        </form>

        <DialogFooter>
          <DialogClose className="w-full">
            <Button variant="outline" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SignInDialog;
