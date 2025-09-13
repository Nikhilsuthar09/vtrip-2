import { useCallback, useEffect, useState } from "react";
import { db } from "../Configs/firebaseConfig";
import {
  arrayUnion,
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

// hook to fetch user trips data
export const useUserTripsData = (uid) => {
  const [tripIds, setTripIds] = useState([]);
  const [tripsData, setTripsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTripsData = useCallback(async (ids) => {
    if (ids.length === 0) {
      setTripsData([]);
      return;
    }

    try {
      let trips = [];

      if (ids.length <= 10) {
        // Use 'in' query for 10 or fewer trips
        const tripsQuery = query(
          collection(db, "trip"),
          where(documentId(), "in", ids)
        );
        const querySnapshot = await getDocs(tripsQuery);
        querySnapshot.forEach((doc) => {
          trips.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      } else {
        // Use individual document fetches for more than 10 trips
        const tripPromises = ids.map(async (tripId) => {
          const tripDocRef = doc(db, "trip", tripId);
          const tripDoc = await getDoc(tripDocRef);
          
          return tripDoc.exists() 
            ? { id: tripDoc.id, ...tripDoc.data() }
            : null;
        });
        
        const results = await Promise.all(tripPromises);
        trips = results.filter(trip => trip !== null);
      }

      // Sort trips by start date
      trips.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      setTripsData(trips);
      setError(null);
    } catch (e) {
      console.error("Error fetching trips data:", e);
      setError(e.message);
      setTripsData([]);
    }
  }, []);

  // refetch trips
  const refetch = useCallback(() => {
    if (tripIds.length > 0) {
      fetchTripsData(tripIds);
    }
  }, [tripIds, fetchTripsData]);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      setTripIds([]);
      setTripsData([]);
      setError(null);
      return;
    }

    const userDocRef = doc(db, "user", uid);
    
    const unsubscribe = onSnapshot(
      userDocRef,
      async (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          const userTripIds = userData.tripIds || [];
          setTripIds(userTripIds);
          
          // Fetch trips data when tripIds change
          await fetchTripsData(userTripIds);
        } else {
          console.log("User document does not exist");
          setTripIds([]);
          setTripsData([]);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to user document:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [uid, fetchTripsData]);

  return {
    tripsData,
    loading,
    error,
    tripIds,
    refetch,
  };
};

// Function to add tripId to user's tripId array
export const AddTripToUser = async (tripId, uid) => {
  try {
    const userDocRef = doc(db, "user", uid);
    await updateDoc(userDocRef, {
      tripIds: arrayUnion(tripId),
    });
  } catch (e) {
    console.error("Error adding trip to user:", e);
    throw e;
  }
};

// Function to create user in firestore
export const addUserToDb = async (user) => {
  try {
    const userId = user?.uid;
    const email = user?.email;
    let name = user?.displayName?.trim().replace(/\s+/g, " ");
    const imgUrl = user?.photoURL;
    const userDocRef = doc(db, "user", userId);
    const userDetails = {
      name,
      email,
      imgUrl,
      tripIds: [],
    };
    await setDoc(userDocRef, userDetails);
    return true;
  } catch (e) {
    console.error("Error adding user to database:", e);
    throw e;
  }
};