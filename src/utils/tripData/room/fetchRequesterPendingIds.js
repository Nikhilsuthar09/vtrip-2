import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../../../Context/AuthContext";
import { useEffect, useState } from "react";
import { db } from "../../../Configs/firebaseConfig";

export const useRequesterPendingId = () => {
  const [ids, setIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const { uid } = useAuth();

  const fetchRequesterTripIds = async () => {
    setLoading(true);
    const docSnapshot = await getDocs(
      collection(db, "user", uid, "requestedIds")
    );
    const data = docSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() ?? null,
    }));
    setIds(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchRequesterTripIds();
  }, [uid]);
  return { ids, loading, refetch:fetchRequesterTripIds };
};
