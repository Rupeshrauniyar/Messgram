import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Send, CheckCircle, Bell } from "lucide-react";

const Notification = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="max-w-md mx-auto mt-6 p-4  shadow-lg rounded-lg bg-black pb-18">
      {/* Header */}
      <div className="flex items-center mb-4">
        <Bell className="w-6 h-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-white">Notifications</h2>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {user.notification.map((noti, i) => {
          // Determine background and icon
          let bgColor = "bg-gray-100";
          let Icon = null;
          if (noti.message.includes("sent")) {
            bgColor = "bg-blue-100";
            Icon = Send;
          } else if (noti.message.includes("accepted")) {
            bgColor = "bg-green-100";
            Icon = CheckCircle;
          }

          return (
            <div
              key={i}
              className={`flex items-center p-3 rounded-lg ${bgColor} shadow-sm`}
            >
              {Icon && <Icon className="w-5 h-5 text-gray-700 mr-3" />}
              <p className="text-gray-800 text-sm">{noti.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notification;
