import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../Configs/firebaseConfig";

export const useItinerary = (tripId, dayName) => {
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!dayName) {
      setLoading(false);
      return;
    }
    const collectionRef = collection(db, "trip", tripId, dayName);

    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapShot) => {
        const itineraryItems = [];

        querySnapShot.forEach((doc) => {
          const data = doc.data();
          itineraryItems.push({
            id: doc.id,
            ...data,
            time: data.time?.toDate?.() ?? data.time ?? null,
            createdAt: data.createdAt?.toDate?.() ?? null,
            updatedAt: data.updatedAt?.toDate?.() ?? null,
          });
        });

        // sort by time
        itineraryItems.sort((a, b) => {
          if (a.time && b.time) {
            return new Date(a.time) - new Date(b.time);
          }
          return 0;
        });

        // Update state
        setItinerary(itineraryItems);
        setLoading(false);
        setError(null);
      },
      (error) => {
        // Handle errors
        console.error(`Error listening to ${dayName}:`, error);
        setError(error.message);
        setLoading(false);
      }
    );

    // Cleanup function - unsubscribe when component unmounts
    return () => unsubscribe();
  }, [tripId, dayName]);

  return { itinerary, loading, error };
};
