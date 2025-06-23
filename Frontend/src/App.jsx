import React from "react";
import { Home, LandingPage, AuthenticationForm, Discover } from "./pages";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { APIS } from "../config/Config";
import { AnalyticsGrap, Navbar } from "./components/index";

function App() {
  // get the current active user
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      return await APIS.userWho();
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  if (isLoading) {
    return (
      <div className="bg-amber-600 w-full h-screen">
        Loading....................
      </div>
    );
  }

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {!currentUser?.data?.id ? (
            <>
              <Route
                path="/authentication/:mode"
                element={<AuthenticationForm />}
              />
              <Route path="/" element={<LandingPage />} />
            </>
          ) : (
            <Route path="/feed">
              <Route path="home" element={<Home />} />
              <Route path="discover" element={<Discover />} />
              <Route path="analytics" element={<AnalyticsGrap />} />
            </Route>
          )}

          <Route
            path="*"
            element={
              <Navigate to={currentUser?.data?.id ? "/feed/home" : "/"} />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
