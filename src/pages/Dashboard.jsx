import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Home,
  Plus,
  Cpu,
  Thermometer,
  Lightbulb,
  Power,
  Activity,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRoomName, setNewRoomName] = useState("");
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

  const userId = 0; // Replace with actual user authentication

  // fetch all user all rooms data
  const fetchAllRoomAppliance = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://jagannath-45cbd-default-rtdb.firebaseio.com/users/${userId}.json`
      );

      const data = res.data;
      if (data) {
        setUserData(data);
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // add new room
  const addNewRoom = async () => {
    if (!newRoomName.trim()) return;

    try {
      const newRoom = {
        roomName: newRoomName,
        id: Date.now().toString(),
        devices: [],
      };

      const updatedRooms = userData.rooms
        ? [...userData.rooms, newRoom]
        : [newRoom];

      await axios.patch(
        `https://jagannath-45cbd-default-rtdb.firebaseio.com/users/${userId}.json`,
        { rooms: updatedRooms }
      );

      setUserData((prev) => ({
        ...prev,
        rooms: updatedRooms,
      }));

      setNewRoomName("");
      setIsAddRoomModalOpen(false);
    } catch (error) {
      console.error("Error adding room:", error);
    }
  };

  useEffect(() => {
    fetchAllRoomAppliance();

    // Optional: Set up real-time updates
    // const intervalId = setInterval(fetchAllRoomAppliance, 30000);
    // return () => clearInterval(intervalId);
  }, []);

  const getRoomIcon = (roomName) => {
    const lowercaseName = roomName.toLowerCase();
    if (lowercaseName.includes("living")) return <Home className="w-6 h-6" />;
    if (lowercaseName.includes("bedroom"))
      return <Thermometer className="w-6 h-6" />;
    if (lowercaseName.includes("kitchen"))
      return <Lightbulb className="w-6 h-6" />;
    return <Cpu className="w-6 h-6" />;
  };

  //calculateTotalDevices
  const calculateTotalDevices = (rooms) => {
    return rooms
      ? rooms.reduce((total, room) => total + (room.devices?.length || 0), 0)
      : 0;
  };

  // loading
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin">
          <Cpu className="w-12 h-12 text-blue-600" />
        </div>
      </div>
    );
  }

  // // Alerts for Device Malfunctions function

  // async function fetchUserDataAndCheckMalfunctions() {
  //   try {
  //     const response = await fetch(
  //       `https://jagannath-45cbd-default-rtdb.firebaseio.com/users/${userId}.json`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch data");
  //     }

  //     const user = await response.json();
  //     checkDeviceMalfunctions(user);
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // }

  // function checkDeviceMalfunctions(user) {
  //   const currentTime = Date.now();
  //   // const threshold = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  //   const threshold = 60000; // 24 hours in milliseconds

  //   // Iterate through each room
  //   user.rooms.forEach((room) => {
  //     console.log(`🔹 Checking devices in room: ${room.roomName}`);

  //     // Iterate through each device in the room
  //     room.devices.forEach((device) => {
  //       if (device.status === "on") {
  //         const elapsedTime = currentTime - device.start_time;

  //         if (elapsedTime > threshold) {
  //           device.alert = true;
  //           console.log(
  //             `⚠️ ALERT: The device '${device.name}' in room '${room.roomName}' has been ON for more than 24 hours.`
  //           );
  //         }
  //       }
  //     });
  //   });
  // }

  // useEffect(() => {
  //   fetchUserDataAndCheckMalfunctions(); // Call function once
  //   const interval = setInterval(fetchUserDataAndCheckMalfunctions, 60000);

  //   return () => clearInterval(interval); // Cleanup
  // }, [fetchUserDataAndCheckMalfunctions]); // Ensure dependencies are correct

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Smart Home Dashboard
            </h1>
            <p className="text-gray-500">
              {userData?.rooms
                ? `${userData.rooms.length} Rooms, ${calculateTotalDevices(
                    userData.rooms
                  )} Devices`
                : "No Rooms Yet"}
            </p>
          </div>
          <button
            onClick={() => setIsAddRoomModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Room
          </button>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userData?.rooms ? (
            userData.rooms.map((room, index) => (
              <div
                key={room.id || index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/room/${room.id}`)}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      {getRoomIcon(room.roomName)}
                    </div>
                    <h3 className="text-xl font-semibold">{room.roomName}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Power className="w-5 h-5 text-green-500" />
                    <span className="text-gray-600">
                      {room.devices?.length || 0} Devices
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-600">Active</span>
                  </div>
                  <button className="text-blue-600 hover:underline">
                    Manage Room
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 mb-4">No rooms have been added yet</p>
              <button
                onClick={() => setIsAddRoomModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Create First Room
              </button>
            </div>
          )}
        </div>

        {/* Add Room Modal */}
        {isAddRoomModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Add New Room
              </h2>
              <input
                type="text"
                placeholder="Enter Room Name (e.g., Living Room)"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => setIsAddRoomModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewRoom}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Room
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
