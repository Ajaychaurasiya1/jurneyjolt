import { LogInContext } from "@/Context/LogInContext/Login";
import React, { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function ProtectedRoute({ children }) {
  const { isAuthenticated, authReady, openSignIn } = useContext(LogInContext);
  const location = useLocation();

  useEffect(() => {
    if (authReady && !isAuthenticated) {
      toast("Sign in to access your trips", { icon: "🔐" });
      openSignIn();
    }
  }, [authReady, isAuthenticated, openSignIn]);

  if (!authReady) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center opacity-70">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;
