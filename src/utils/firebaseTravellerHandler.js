import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../Configs/firebaseConfig";
import { useAuth } from "../Context/AuthContext";

export const useTravellerNames = (tripId) => {
  const [travellerNames, setTravellerNames] = useState([]);
  const [travellerLoading, setLoading] = useState(true);
  const [travellerError, setError] = useState(null);
  const { email, name, uid, user, isLoading: authLoading } = useAuth();

  const fetchTravellerNames = async () => {
    if (!tripId || authLoading) {
      setLoading(authLoading);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const tripDoc = await getDoc(doc(db, "trip", tripId));
      if (!tripDoc.exists()) {
        throw new Error("Trip not found");
      }
      const { travellers } = tripDoc.data();
      if (!travellers || travellers.length === 0) {
        setTravellerNames([]);
        setLoading(false);
        return;
      }
      // return current user when there is only 1 traveller
      const names = [];
      if (travellers.length === 1) {
        names.push({
          uid: uid || "Unknown User",
          name: name || "Unknown User",
          email: email || null,
          imageUrl: user?.photoURL,
        });
        setTravellerNames(names);
        setLoading(false);
        return;
      }

      // process in chunks of 10
      for (let i = 0; i < travellers.length; i += 10) {
        const batch = travellers.slice(i, i + 10);

        const usersQuery = query(
          collection(db, "user"),
          where(documentId(), "in", batch)
        );
        const querySnapshot = await getDocs(usersQuery);
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          names.push({
            uid: doc.id,
            name: userData.name || "Unknown User",
            email: userData.email || null,
            imageUrl: userData?.imgUrl || null,
          });
        });
      }
      setTravellerNames(names);
    } catch (e) {
      console.log("Error fetching traveller Names: ", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTravellerNames();
  }, [tripId, uid, authLoading]);

  return {
    travellerNames,
    travellerLoading,
    travellerError,
    refetchTraveller: fetchTravellerNames,
  };
};
