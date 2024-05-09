import { db } from "../firebase/firebase-config";

const NotificationSystem = () => {
  // Create notification
  const sendNotification = async (type: string) => {
    try {
      const notification = {
        type,
        message: `Notification ${type}`,
        read: false,
      };
      await db.collection("notifications").add(notification);
    } catch (error) {
      console.error("Error sending notification", error);
      alert("Failed to send notification");
    }
  };
  return (
    <div>
      <button onClick={() => sendNotification("Type 1")}>Type 1</button>
      <button onClick={() => sendNotification("Type 2")}>Type 2</button>
      <button onClick={() => sendNotification("Type 3")}>Type 3</button>
    </div>
  );
};

export default NotificationSystem;
