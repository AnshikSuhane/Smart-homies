/* eslint-disable react/prop-types */
const DeviceComponent = ({
    userData,
    userIndex,
    deleteDevice,
    toggleDeviceStatus,
    updateDeviceSetting,
  }) => {
    return (
      <div>
        {userData?.rooms?.map((room, roomIndex) =>
          room?.devices?.length > 0
            ? room.devices.map((device, deviceIndex) =>
                device ? (
                  <div
                    key={device.id || `${userIndex}-${roomIndex}-${deviceIndex}`}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {device.name}
                          </h3>
                          <p className="text-sm text-gray-500">{room.name}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {/* Toggle ON / OFF Button */}
                        <button
                          onClick={() =>
                            toggleDeviceStatus(
                              userIndex,
                              roomIndex,
                              deviceIndex,
                              device.status
                            )
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            device.status === "on"
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                        >
                          {device.status?.toUpperCase()}
                        </button>
  
                        {/* Delete Button */}
                        <button
                          onClick={() =>
                            deleteDevice(userIndex, roomIndex, deviceIndex)
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Delete device"
                        >
                          delete
                        </button>
                      </div>
                    </div>
  
                    {/* Spotlights */}
                    {device.name === "SpotLights" && (
                      <div className="mb-4">
                        <label className="block text-gray-700 text-sm mb-2">
                          Brightness
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={device.brightness}
                          onChange={(e) =>
                            updateDeviceSetting(
                              userIndex,
                              roomIndex,
                              deviceIndex,
                              {
                                brightness: parseInt(e.target.value),
                              }
                            )
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}
  
                    {/* Fans */}
                    {device.name === "Fan" && (
                      <div className="flex justify-center gap-2">
                        {["Slow", "Medium", "Fast"].map((speed) => (
                          <button
                            key={speed}
                            onClick={() =>
                              updateDeviceSetting(
                                userIndex,
                                roomIndex,
                                deviceIndex,
                                {
                                  speed,
                                }
                              )
                            }
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              device.speed === speed
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            }`}
                          >
                            {speed}
                          </button>
                        ))}
                      </div>
                    )}
  
                    {/* Thermostat */}
                    {device.name === "Thermostat" && (
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center text-2xl font-semibold text-blue-700 mb-3">
                          {device.temperature}°C
                        </div>
  
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              updateDeviceSetting(
                                userIndex,
                                roomIndex,
                                deviceIndex,
                                {
                                  temperature: device.temperature + 1,
                                }
                              )
                            }
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg text-xl font-semibold"
                          >
                            +
                          </button>
                          <button
                            onClick={() =>
                              updateDeviceSetting(
                                userIndex,
                                roomIndex,
                                deviceIndex,
                                {
                                  temperature: device.temperature - 1,
                                }
                              )
                            }
                            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg text-xl font-semibold"
                          >
                            -
                          </button>
                        </div>
                      </div>
                    )}
  
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center text-gray-600">
                        <span>Running time: {device.total_time}</span>
                      </div>
                      {device.alert && (
                        <div className="flex items-center text-yellow-500">
                          <span>Alert condition!</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <h4 key={`${userIndex}-${roomIndex}-${deviceIndex}`}>
                    Device is not added yet
                  </h4>
                )
              )
            : null
        )}
      </div>
    );
  };
  
  export default DeviceComponent;
  