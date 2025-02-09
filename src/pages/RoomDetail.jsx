/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Power,
  Trash2,
  Plus,
  Loader2,
  Thermometer,
  ChevronUp,
  ChevronDown,
  Fan,
  Sun,
  Lightbulb,
  LampFloor,
  SlidersHorizontal,
  ArrowRightLeftIcon,
  ArrowRightIcon,
} from "lucide-react";

// Device Icon Component
const DeviceIcon = ({ type = "", className = "h-6 w-6" }) => {
  const deviceType = type?.toLowerCase() ?? "";

  switch (deviceType) {
    case "thermostat":
      return <Thermometer className={className} />;
    case "fan":
      return <Fan className={className} />;
    case "spotlights":
      return <Sun className={className} />;
    case "floor lamp":
      return <LampFloor className={className} />;
    case "bar lamp":
      return <Lightbulb className={className} />;
    default:
      return <Lightbulb className={className} />;
  }
};

// Device Controls Component
const DeviceControls = ({ device, onUpdateValue }) => {
  if (!device || !device.name) {
    return null;
  }

  const [temperature, setTemperature] = useState(22);
  const [fanSpeed, setFanSpeed] = useState("low");
  const [brightness, setBrightness] = useState(50);
  
  const handleTemperatureChange = (delta) => {
    const newTemp = temperature + delta;
    setTemperature(newTemp);
    onUpdateValue("temperature", newTemp);
  };

  const handleFanSpeedChange = () => {
    const speeds = ["low", "medium", "high"];
    const currentIndex = speeds.indexOf(fanSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setFanSpeed(speeds[nextIndex]);
    onUpdateValue("fanSpeed", speeds[nextIndex]);
  };

  const handleBrightnessChange = (newValue) => {
    setBrightness(newValue);
    onUpdateValue("brightness", newValue);
  };

  switch (device.name.toLowerCase()) {
    case "thermostat":
      return (
        <div
          className="flex items-center space-x-2"
          role="group"
          aria-label="Temperature controls"
        >
          <button
            onClick={() => handleTemperatureChange(-1)}
            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
            aria-label="Decrease temperature"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium" aria-live="polite">
            {temperature}°C
          </span>
          <button
            onClick={() => handleTemperatureChange(1)}
            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200"
            aria-label="Increase temperature"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      );

    case "fan":
      return (
        <button
          onClick={handleFanSpeedChange}
          className="px-3 py-1 text-sm rounded-md bg-gray-100 hover:bg-gray-200 capitalize"
          aria-label={`Fan speed : ${fanSpeed}`}
        >
          {fanSpeed}
        </button>
      );

    case "spotlights":
    case "floor lamp":
    case "bar lamp":
      return (
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-4 w-4" />
          <input
            type="range"
            min="0"
            max="100"
            value={brightness}
            onChange={(e) => handleBrightnessChange(parseInt(e.target.value))}
            className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            aria-label="Brightness"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={brightness}
          />
          <span className="text-sm" aria-live="polite">
            {brightness}%
          </span>
        </div>
      );

    default:
      return null;
  }
};

const RoomDetail = () => {
  const [deviceData, setDeviceData] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [singleDevice, setSingleDevice] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userKey, setUserKey] = useState(null);
  const navigate=useNavigate()
  useParams();

  const fetchDevicesData = async () => {
    try {
      const resp = await fetch(
        "https://jagannath-45cbd-default-rtdb.firebaseio.com/devices/devices_data.json"
      );
      const data = await resp.json();
      const devicesArray = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setDeviceData(devicesArray);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const handleDeviceSelection = async (e) => {
    const value = e.target.value;
    setSelectedDeviceId(value);

    try {
      const res = await fetch(
        `https://jagannath-45cbd-default-rtdb.firebaseio.com/devices/devices_data/${value}.json`
      );
      const data = await res.json();
      setSingleDevice(data);
    } catch (error) {
      console.error("Error fetching device details:", error);
    }
  };

  const addDevice = async () => {
    if (!singleDevice || !userKey) return;
    setLoading(true);

    const newDevice = {
      id: crypto.randomUUID(),
      name: singleDevice.name,
      status: "off",
      start_time: Date.now(),
      alert: false,
      total_time: "2 hours",
    };

    try {
      const updatedRooms = userData.rooms.map((room, index) =>
        index === 0
          ? {
              ...room,
              devices: Array.isArray(room.devices)
                ? [...room.devices, newDevice]
                : [newDevice],
            }
          : room
      );

      await fetch(
        `https://jagannath-45cbd-default-rtdb.firebaseio.com/users/${userKey}.json`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...userData, rooms: updatedRooms }),
        }
      );

      setUserData((prev) => ({
        ...prev,
        rooms: updatedRooms,
      }));
      setSingleDevice(null);
      setSelectedDeviceId("");
    } catch (error) {
      console.error("Error adding device:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDevice = async (roomIndex, deviceIndex, currentStatus) => {
    if (!userKey) {
      console.error("User key not found");
      return;
    }

    const newStatus = currentStatus === "on" ? "off" : "on";

    // Optimistic update
    setUserData((prev) => {
      const updated = { ...prev };
      updated.rooms[roomIndex].devices[deviceIndex].status = newStatus;
      return updated;
    });

    try {
      await fetch(
        `https://jagannath-45cbd-default-rtdb.firebaseio.com/users/${userKey}/rooms/${roomIndex}/devices/${deviceIndex}/status.json`,
        {
          method: "PUT",
          body: JSON.stringify(newStatus),
        }
      );
    } catch (error) {
      // Revert on error
      setUserData((prev) => {
        const updated = { ...prev };
        updated.rooms[roomIndex].devices[deviceIndex].status = currentStatus;
        return updated;
      });
      console.error("Error toggling device:", error);
    }
  };

  const deleteDevice = async (roomIndex, deviceIndex) => {
    if (!userKey) {
      console.error("User key not found");
      return;
    }

    setIsDeleting(true);

    // Store current state for rollback
    const previousUserData = { ...userData };

    try {
      // Create updated rooms array without the device
      const updatedRooms = userData.rooms.map((room, rIndex) => {
        if (rIndex === roomIndex) {
          const updatedDevices = room.devices.filter(
            (_, dIndex) => dIndex !== deviceIndex
          );
          return {
            ...room,
            devices: updatedDevices,
          };
        }
        return room;
      });

      // Update the entire user object in Firebase
      await fetch(
        `https://jagannath-45cbd-default-rtdb.firebaseio.com/users/${userKey}.json`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...userData,
            rooms: updatedRooms,
          }),
        }
      );

      // Update local state after successful Firebase update
      setUserData((prev) => ({
        ...prev,
        rooms: updatedRooms,
      }));
    } catch (error) {
      // Revert on error
      setUserData(previousUserData);
      console.error("Error deleting device:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchAllRoomAppliance = async () => {
    try {
      const userResponse = await fetch(
        "https://jagannath-45cbd-default-rtdb.firebaseio.com/users.json"
      );
      const users = await userResponse.json();
      const firstUserKey = Object.keys(users)[0];
      setUserKey(firstUserKey);
      setUserData(users[firstUserKey]);
    } catch (error) {
      console.error("Error fetching room appliances:", error);
    }
  };

  useEffect(() => {
    fetchDevicesData();
    fetchAllRoomAppliance();
  }, []);

  const handleDeviceValueUpdate = (deviceIndex, key, value) => {
    setUserData((prev) => {
      const updated = { ...prev };
      if (!updated.rooms[0].devices[deviceIndex].settings) {
        updated.rooms[0].devices[deviceIndex].settings = {};
      }
      updated.rooms[0].devices[deviceIndex].settings[key] = value;
      return updated;
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Add Device Section */}
      <div className="bg-white rounded-lg shadow-md mb-8 p-6">
      <span className="flex justify-end">
  <ArrowRightIcon className="h-11 w-11" onClick={() => navigate("/dashboard")} />
</span>
        <div className="mb-4">

          <h2 className="text-xl font-semibold text-gray-800">
            Add New Device
          </h2>
        </div>
        <div className="flex gap-4 items-center">
          <select
            className="flex-1 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedDeviceId}
            onChange={handleDeviceSelection}
          >
            <option value="">Select a device</option>
            {deviceData.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </select>
          <button
            onClick={addDevice}
            disabled={!singleDevice || loading}
            className={`min-w-[120px] h-10 px-4 rounded-md flex items-center justify-center text-sm font-medium transition-colors
              ${
                !singleDevice || loading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Device
              </>
            )}
          </button>
        </div>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userData?.rooms?.map((room, roomIndex) =>
          room?.devices?.length > 0
            ? room?.devices?.map((device, deviceIndex) =>
                device ? (
                  <div
                    key={device.id || deviceIndex}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <DeviceIcon
                          type={device.name}
                          className="h-6 w-6 text-gray-600"
                        />
                        <div className="flex flex-col">
                          <h3 className="font-semibold text-lg text-gray-800">
                            {device.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Added:{" "}
                            {new Date(device.start_time).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            toggleDevice(roomIndex, deviceIndex, device.status)
                          }
                          className={`p-2 rounded-md transition-colors ${
                            device.status === "on"
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                          }`}
                        >
                          <Power className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteDevice(roomIndex, deviceIndex)}
                          disabled={isDeleting}
                          className="p-2 rounded-md text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {device.status === "on" && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <DeviceControls
                          device={device}
                          onUpdateValue={(key, value) =>
                            handleDeviceValueUpdate(deviceIndex, key, value)
                          }
                        />
                      </div>
                    )}
                  </div>
                ) : null
              )
            : null
        )}
      </div>
    </div>
  );
};

export default RoomDetail;