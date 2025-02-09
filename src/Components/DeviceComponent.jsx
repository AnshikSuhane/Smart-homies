/* eslint-disable react/prop-types */
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  AlertCircle, 
  Power, 
  Trash2, 
  Sun, 
  Fan, 
  Thermometer 
} from "lucide-react";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

const DeviceComponent = ({
  userData,
  userIndex,
  deleteDevice,
  toggleDeviceStatus,
  updateDeviceSetting,
}) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {userData?.rooms?.map((room, roomIndex) =>
        room?.devices?.length > 0
          ? room.devices.map((device, deviceIndex) =>
              device ? (
                <Card 
                  key={device.id || `${userIndex}-${roomIndex}-${deviceIndex}`} 
                  className="transition-all duration-300 hover:shadow-md"
                >
                  <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {device.name === "SpotLights" && <Sun className="w-4 h-4" />}
                        {device.name === "Fan" && <Fan className="w-4 h-4" />}
                        {device.name === "Thermostat" && <Thermometer className="w-4 h-4" />}
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                      </div>
                      <Badge 
                        variant={device.status === "on" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {device.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{room.name}</p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {device.name === "SpotLights" && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">Brightness</label>
                          <span className="text-sm text-muted-foreground">{device.brightness}%</span>
                        </div>
                        <Slider
                          defaultValue={[device.brightness]}
                          max={100}
                          step={1}
                          className="mt-2"
                          onValueChange={(value) =>
                            updateDeviceSetting(userIndex, roomIndex, deviceIndex, { brightness: value[0] })
                          }
                        />
                      </div>
                    )}

                    {device.name === "Fan" && (
                      <div className="grid grid-cols-3 gap-2">
                        {["Slow", "Medium", "Fast"].map((speed) => (
                          <Button
                            key={speed}
                            variant={device.speed === speed ? "default" : "outline"}
                            size="sm"
                            className="w-full"
                            onClick={() =>
                              updateDeviceSetting(userIndex, roomIndex, deviceIndex, { speed })
                            }
                          >
                            {speed}
                          </Button>
                        ))}
                      </div>
                    )}

                    {device.name === "Thermostat" && (
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-24 h-24 flex items-center justify-center text-2xl font-bold rounded-full border-2 bg-background">
                          {device.temperature}°C
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateDeviceSetting(userIndex, roomIndex, deviceIndex, {
                                temperature: device.temperature + 1,
                              })
                            }
                          >
                            +
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              updateDeviceSetting(userIndex, roomIndex, deviceIndex, {
                                temperature: device.temperature - 1,
                              })
                            }
                          >
                            -
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-muted-foreground">
                      Running time: {device.total_time}
                    </div>

                    {device.alert && (
                      <Alert variant="warning">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Alert condition detected!
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button
                      variant={device.status === "on" ? "default" : "secondary"}
                      onClick={() => toggleDeviceStatus(userIndex, roomIndex, deviceIndex, device.status)}
                      className="w-full mr-2"
                    >
                      <Power className="w-4 h-4 mr-2" />
                      {device.status === "on" ? "Turn Off" : "Turn On"}
                    </Button>
                    <Button 
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteDevice(userIndex, roomIndex, deviceIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <p key={`${userIndex}-${roomIndex}-${deviceIndex}`} className="text-muted-foreground">
                  Device is not added yet
                </p>
              )
            )
          : null
      )}
    </div>
  );
};

export default DeviceComponent;