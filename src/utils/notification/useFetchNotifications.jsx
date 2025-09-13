import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { usePushNotification } from "./useNotifications";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../Configs/firebaseConfig";

export const useFetchNotification = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadDoc, setUnreadDoc] = useState([]);
  const { uid } = useAuth();
  const { notification } = usePushNotification();
  const debounceTimer = useRef(null);

  const fetchNotifications = async () => {
    if (!uid) return;
    setLoading(true);

    try {
      const q = query(
        collection(db, "user", uid, "notification"),
        orderBy("createdAt", "desc")
      );
      const snapShot = await getDocs(q);
      if (!snapShot.docs) return;
      const data = snapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() ?? null,
      }));
      const unreadDoc = data.filter((doc) => doc.unread === true);
      setNotifications(data);
      setUnreadDoc(unreadDoc);
    } catch (e) {
      console.log("error fetching notifications", e);
    } finally {
      setLoading(false);
    }
  };

  // initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [uid]);

  useEffect(() => {
    if (!notification) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      fetchNotifications();
    }, 800);
  }, [notification]);

  return { notifications, unreadDoc, loading, refetch: fetchNotifications };
};

export const useMarkAsRead = (unreadDoc) => {
  const { uid } = useAuth();
  const { refetch } = useFetchNotification();

  const markAsReadInDb = () => {
    if (unreadDoc.length === 0 || !uid) return;
    const unreadId = unreadDoc.map((item) => item.id);

    try {
      Promise.all(
        unreadId.map(async (id) => {
          const NotificationDocRef = doc(db, "user", uid, "notification", id);
          await updateDoc(NotificationDocRef, { unread: false });
        })
      );

      console.log("marked all notifications");
      refetch();
    } catch (e) {
      console.log("Error marking notifications as read");
    }
  };
  useEffect(() => {
    markAsReadInDb();
  }, [uid, unreadDoc]);
};
