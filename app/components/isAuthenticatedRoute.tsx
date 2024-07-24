"use client";
import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use useRouter for redirection
import { UserContext } from "../context/userContext";

export default function isAuthenticatedRoute(Component: any) {
  return function IsAuth(props: any) {
    const { isUserAuthenticated, initializeUser } = useContext(UserContext);
    const router = useRouter();

    useEffect(() => {
      if (initializeUser && !isUserAuthenticated) {
        router.push("/login");
      }
    }, [isUserAuthenticated, initializeUser, router]);

    if (!initializeUser) {
      return <div>Loading...</div>; // Show loading until initialization is complete
    }

    if (!isUserAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
