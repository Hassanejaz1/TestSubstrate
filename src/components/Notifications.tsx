import { useEffect, useState } from "react";
import { db } from "../firebase/firebase-config";
import "../styles/index.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to mark notifications as read
  const markAsRead = async (id: string) => {
    try {
      await db.collection("notifications").doc(id).update({ read: true });
    } catch (error) {
      console.error("Error making notification as read:", error);
      alert("Failed to mark as read");
    }
  };

  // Fetching real-time notification data
  useEffect(() => {
    setLoading(true);
    const unsubscribe = db.collection("notifications").onSnapshot(
      (snapshot: any) => {
        setLoading(false);
        const notifs = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNotifications(notifs);
      },
      (err: Error) => {
        if (err instanceof Error) {
          setError("Failed to fetch notifications");
          console.error("Error fetching notifications", err);
          setLoading(false);
        }
      }
    );

    // Removing listener
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {notifications.length &&
        notifications.map((notif, index) => (
          <div key={notif?.id} onClick={() => markAsRead(notif?.id)}>
            <p>
              <span
                className={
                  notif?.read
                    ? "seen-notification-color"
                    : "unseen-notification-color"
                }
              >
                {notif?.message}
              </span>{" "}
              - Read: {notif?.read ? "Yes" : "No"}
            </p>
          </div>
        ))}
    </div>
  );
};

export default Notifications;
