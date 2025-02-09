import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Power, Clock, Settings, Bell, Calendar } from "lucide-react";

const Routines = () => {
  const [user, setUser] = useState(null);
  const [routineTime, setRoutineTime] = useState("23:00");
  const [showAlert, setShowAlert] = useState(false);
  const [activeTab, setActiveTab] = useState("schedule");
  const [deviceStates, setDeviceStates] = useState({});
  const [deviceStatus, setDeviceStatus] = useState({
    turning: false,
    success: false,
    error: null,
  });

  const userId = 0;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://jagannath-45cbd-default-rtdb.firebaseio.com/users/${userId}.json`
        );
        const data = await response.json();
        setUser(data);

        if (!data.rooms || !Array.isArray(data.rooms)) {
          console.error("Rooms data is invalid:", data.rooms);
          return;
        }

        const states = data.rooms.reduce((acc, room) => {
          if (!room.devices || !Array.isArray(room.devices)) return acc;
          room.devices.forEach((device) => {
            acc[`${room.id}-${device.id}`] = device.status === "on";
          });
          return acc;
        }, {});

        setDeviceStates(states);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const checkRoutine = () => {
      const currentTime = new Date().toTimeString().slice(0, 5);
      if (currentTime === routineTime) {
        turnOffAllDevices();
      } else if (currentTime === subtractMinutes(routineTime, 5)) {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 30000);
      }
    };

    const interval = setInterval(checkRoutine, 60000);
    return () => clearInterval(interval);
  }, [routineTime]);

  const updateDeviceAlert = async (roomId, deviceId, status) => {
    try {
      const response = await fetch(
        `https://jagannath-45cbd-default-rtdb.firebaseio.com/rooms/${roomId}/devices/${deviceId}.json`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: status ? "on" : "off" }),
        }
      );

      if (!response.ok) throw new Error("Failed to update device status");
      return await response.json();
    } catch (error) {
      console.error(
        Error ` updating device ${deviceId} in room ${roomId}:`,error
      );
      throw error;
    }
  };

  const turnOffAllDevices = async () => {
    if (!user?.rooms) return;
    setDeviceStatus({ turning: true, success: false, error: null });

    try {
      for (const room of user.rooms) {
        if (!room.devices || !Array.isArray(room.devices)) continue;
        for (const device of room.devices) {
          if (deviceStates[`${room.id}-${device.id}`]) {
            await updateDeviceAlert(room.id, device.id, false);
          }
        }
      }

      const response = await fetch(
       ` https://jagannath-45cbd-default-rtdb.firebaseio.com/users/${userId}.json`
      );
      const updatedUser = await response.json();
      setUser(updatedUser);

      setDeviceStatus({ turning: false, success: true, error: null });

      setTimeout(
        () => setDeviceStatus({ turning: false, success: false, error: null }),
        3000
      );
    } catch (error) {
      console.error("Error in turnOffAllDevices:", error);
      setDeviceStatus({
        turning: false,
        success: false,
        error: "Failed to turn off devices. Please try again.",
      });
    }
  };

  const subtractMinutes = (time, minutes) => {
    const [hours, mins] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, mins - minutes);
    return date.toTimeString().slice(0, 5);
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <Card className="max-w-2xl mx-auto border shadow-md">
        <CardHeader className="space-y-1 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Smart Routines
              </h2>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <Tabs defaultValue="schedule" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-gray-50">
              <TabsTrigger
                value="schedule"
                className="space-x-2 data-[state=active]:bg-white"
              >
                <Clock className="h-4 w-4" />
                <span>Schedule</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="space-x-2 data-[state=active]:bg-white"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Shutdown Time
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-1">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="time"
                        value={routineTime}
                        onChange={(e) => setRoutineTime(e.target.value)}
                        className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <Button
                      variant={deviceStatus.turning ? "outline" : "default"}
                      onClick={turnOffAllDevices}
                      disabled={deviceStatus.turning}
                      className="min-w-[140px] space-x-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <Power className="h-4 w-4" />
                      <span>
                        {deviceStatus.turning
                          ? "Turning Off..."
                          : "Turn Off Now"}
                      </span>
                    </Button>
                  </div>
                </div>

                {showAlert && (
                  <Alert className="bg-amber-50 border-amber-200">
                    <Bell className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      All devices will turn off in 5 minutes!
                    </AlertDescription>
                  </Alert>
                )}

                {deviceStatus.success && (
                  <Alert className="bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">
                      All devices have been turned off successfully.
                    </AlertDescription>
                  </Alert>
                )}

                {deviceStatus.error && (
                  <Alert variant="destructive">
                    <AlertDescription>{deviceStatus.error}</AlertDescription>
                  </Alert>
                )}

                <div className="rounded-lg bg-gray-50 p-4 space-y-3 border">
                  <h3 className="font-medium text-gray-900">
                    Next Scheduled Actions
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="text-gray-600">
                          All devices shutdown
                        </span>
                      </span>
                      <span className="text-gray-500">{routineTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium text-gray-900">
                      Notification Alerts
                    </div>
                    <div className="text-sm text-gray-500">
                      Receive alerts before scheduled actions
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-blue-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium text-gray-900">
                      Auto-Schedule
                    </div>
                    <div className="text-sm text-gray-500">
                      Automatically schedule based on usage patterns
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-blue-600" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium text-gray-900">
                      Power Saving Mode
                    </div>
                    <div className="text-sm text-gray-500">
                      Optimize device schedules for energy efficiency
                    </div>
                  </div>
                  <Switch className="data-[state=checked]:bg-blue-600" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Routines;