import { useEffect, useState } from "react";
import {
  Power, Trash2, Plus, Loader2, Thermometer, 
  ChevronUp, ChevronDown, Fan, Sun, 
  Lightbulb, LampFloor, SlidersHorizontal
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const DeviceIcon = ({ type = "", className = "h-6 w-6" }) => {
  const deviceType = type?.toLowerCase() ?? "";
  switch (deviceType) {
    case "thermostat": return <Thermometer className={className} />;
    case "fan": return <Fan className={className} />;
    case "spotlights": return <Sun className={className} />;
    case "floor lamp": return <LampFloor className={className} />;
    case "bar lamp": return <Lightbulb className={className} />;
    default: return <Lightbulb className={className} />;
  }
};

const DeviceControls = ({ device, onUpdateValue }) => {
  if (!device || !device.name) return null;

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

  const handleBrightnessChange = (value) => {
    setBrightness(value[0]);
    onUpdateValue("brightness", value[0]);
  };

  switch (device.name.toLowerCase()) {
    case "thermostat":
      return (
        <div className="space-y-2" role="group" aria-label="Temperature controls">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Temperature</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleTemperatureChange(-1)}
                aria-label="Decrease temperature"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium" aria-live="polite">
                {temperature}°C
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleTemperatureChange(1)}
                aria-label="Increase temperature"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      );

    case "fan":
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Fan Speed</span>
            <Select value={fanSpeed} onValueChange={handleFanSpeedChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "spotlights":
    case "floor lamp":
    case "bar lamp":
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Brightness</span>
            <span className="text-sm font-medium" aria-live="polite">
              {brightness}%
            </span>
          </div>
          <Slider
            value={[brightness]}
            onValueChange={handleBrightnessChange}
            max={100}
            step={1}
            className="w-full"
            aria-label="Brightness"
          />
        </div>
      );

    default:
      return null;
  }
};

const RoomDetail = ({ roomId = 0 }) => {
  const [deviceData, setDeviceData] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [singleDevice, setSingleDevice] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const userId = 0;

  // Keep all the existing fetch and handle functions
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

  const handleDeviceSelection = async (value) => {
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
    if (!singleDevice) return;
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
      const userResponse = await fetch(
        "https://jagannath-45cbd-default-rtdb.firebaseio.com/users.json"
      );
      const users = await userResponse.json();
      const firstUserKey = Object.keys(users)[0];
      const firstUser = users[firstUserKey];

      const updatedRooms = firstUser.rooms.map((room, index) =>
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
        `https://jagannath-45cbd-default-rtdb.firebaseio.com/users/${firstUserKey}.json`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...firstUser, rooms: updatedRooms }),
        }
      );

      fetchAllRoomAppliance();
      setSingleDevice(null);
      setSelectedDeviceId("");
    } catch (error) {
      console.error("Error adding device:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDevice = async (roomIndex, deviceIndex, currentStatus) => {
    const newStatus = currentStatus === "on" ? "off" : "on";

    setUserData((prev) => {
      const updated = { ...prev };
      updated.rooms[roomIndex].devices[deviceIndex].status = newStatus;
      return updated;
    });

    try {
      await fetch(
        `https://jagannath-45cbd-default-rtdb.firebaseio.com/users/${userId}/rooms/${roomIndex}/devices/${deviceIndex}/status.json`,
        {
          method: "PUT",
          body: JSON.stringify(newStatus),
        }
      );
    } catch (error) {
      setUserData((prev) => {
        const updated = { ...prev };
        updated.rooms[roomIndex].devices[deviceIndex].status = currentStatus;
        return updated;
      });
      console.error("Error toggling device:", error);
    }
  };

  const deleteDevice = async (roomIndex, deviceIndex) => {
    setIsDeleting(true);
    const previousUserData = { ...userData };

    setUserData((prev) => {
      const updated = { ...prev };
      updated.rooms[roomIndex].devices = updated.rooms[
        roomIndex
      ].devices.filter((_, index) => index !== deviceIndex);
      return updated;
    });

    try {
      await fetch(
        `https://jagannath-45cbd-default-rtdb.firebaseio.com/users/${userId}/rooms/${roomIndex}/devices/${deviceIndex}.json`,
        {
          method: "DELETE",
        }
      );
    } catch (error) {
      setUserData(previousUserData);
      console.error("Error deleting device:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchAllRoomAppliance = async () => {
    try {
      const res = await fetch(
        `https://jagannath-45cbd-default-rtdb.firebaseio.com/users/${userId}.json`
      );
      const data = await res.json();
      setUserData(data);
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
    <div className="container py-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Device</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedDeviceId} onValueChange={handleDeviceSelection}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent>
                {deviceData.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={addDevice} 
              disabled={!singleDevice || loading}
              className="min-w-[120px]"
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
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userData?.rooms?.map((room, roomIndex) =>
          room?.devices?.length > 0
            ? room?.devices?.map((device, deviceIndex) =>
                device ? (
                  <Card key={device.id || deviceIndex}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-secondary rounded-lg">
                            <DeviceIcon
                              type={device.name}
                              className="h-6 w-6 text-secondary-foreground"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{device.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(device.start_time).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={device.status === "on" ? "default" : "secondary"}
                            size="icon"
                            onClick={() => toggleDevice(roomIndex, deviceIndex, device.status)}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => deleteDevice(roomIndex, deviceIndex)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {device.status === "on" && (
                        <div className="border-t pt-4">
                          <DeviceControls
                            device={device}
                            onUpdateValue={(key, value) =>
                              handleDeviceValueUpdate(deviceIndex, key, value)
                            }
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : null
              )
            : null
        )}
      </div>
    </div>
  );
};

export default RoomDetail;