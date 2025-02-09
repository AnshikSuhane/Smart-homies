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

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

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
  }, []);

  const getRoomIcon = (roomName) => {
    const lowercaseName = roomName.toLowerCase();
    if (lowercaseName.includes("living")) return <Home className="w-6 h-6" />;
    if (lowercaseName.includes("bedroom")) return <Thermometer className="w-6 h-6" />;
    if (lowercaseName.includes("kitchen")) return <Lightbulb className="w-6 h-6" />;
    return <Cpu className="w-6 h-6" />;
  };

  const calculateTotalDevices = (rooms) => {
    return rooms
      ? rooms.reduce((total, room) => total + (room.devices?.length || 0), 0)
      : 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin">
          <Cpu className="w-12 h-12 text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-3xl">Smart Home Dashboard</CardTitle>
              <p className="text-muted-foreground">
                {userData?.rooms
                  ? `${userData.rooms.length} Rooms, ${calculateTotalDevices(
                      userData.rooms
                    )} Devices`
                  : "No Rooms Yet"}
              </p>
            </div>
            <Button onClick={() => setIsAddRoomModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Room
            </Button>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userData?.rooms ? (
            userData.rooms.map((room, index) => (
              <Card
                key={room.id || index}
                className="hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/room/${room.id}`)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      {getRoomIcon(room.roomName)}
                    </div>
                    <CardTitle>{room.roomName}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Power className="w-4 h-4 text-green-500" />
                      <span className="text-muted-foreground">
                        {room.devices?.length || 0} Devices
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">Active</span>
                    </div>
                  </div>
                  <Button variant="link" className="mt-4 w-full">
                    Manage Room
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
                <Alert>
                  <AlertDescription>
                    No rooms have been added yet. Create your first room to get started.
                  </AlertDescription>
                </Alert>
                <Button onClick={() => setIsAddRoomModalOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create First Room
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <Dialog open={isAddRoomModalOpen} onOpenChange={setIsAddRoomModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Enter Room Name (e.g., Living Room)"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddRoomModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addNewRoom}>Add Room</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;


