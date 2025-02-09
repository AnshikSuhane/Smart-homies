/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import { BatteryChargingFull, Power, Home, Bolt } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Energy = () => {
  // Initialize state for room data and summary statistics
  const [data, setData] = useState({
    roomData: [],
    summary: {
      totalPower: 0,
      activeDevices: 0,
      totalRooms: 0,
      avgPowerPerRoom: 0,
      highestConsumingRoom: "",
      totalDevices: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const userId = 0;
  const theme = useTheme();
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.info.main,
    theme.palette.warning.main,
  ];

  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          <Typography variant="subtitle2">{payload[0].name}</Typography>
          <Typography color="text.secondary">
            Power: {payload[0].value}W
            <br />
            Share:{" "}
            {((payload[0].value / data.summary.totalPower) * 100).toFixed(1)}%
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Fetch and process data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Fetch user data from Firebase
        const response = await fetch(
          `https://jagannath-45cbd-default-rtdb.firebaseio.com/users/${userId}.json  `
        );
        const userData = await response.json();

        if (!userData || !userData.rooms) {
          throw new Error("No data available");
        }

        // Step 2: Process room data
        const roomData = userData.rooms.map((room) => {
          // Handle both array and object device structures
          const devices = Array.isArray(room.devices)
            ? room.devices
            : room.devices
            ? Object.values(room.devices)
            : [];

          // Calculate device statistics
          const activeDevicesCount = devices.filter(
            (d) => d.status === "on"
          ).length;
          const totalDevicesCount = devices.length;

          // Calculate power consumption (100W per active device)
          const powerConsumption = activeDevicesCount * 100;

          return {
            id: room.id,
            name: room.roomName,
            type: room.type || "Standard",
            powerConsumption,
            activeDevices: activeDevicesCount,
            totalDevices: totalDevicesCount,
            devices,
            powerPerDevice: powerConsumption / (totalDevicesCount || 1),
          };
        });

        // Step 3: Calculate summary statistics
        const totalPower = roomData.reduce(
          (sum, room) => sum + room.powerConsumption,
          0
        );
        const totalActiveDevices = roomData.reduce(
          (sum, room) => sum + room.activeDevices,
          0
        );
        const totalDevices = roomData.reduce(
          (sum, room) => sum + room.totalDevices,
          0
        );
        const highestConsumingRoom = roomData.reduce((prev, current) =>
          prev.powerConsumption > current.powerConsumption ? prev : current
        );

        // Step 4: Update state with processed data
        setData({
          roomData,
          summary: {
            totalPower,
            activeDevices: totalActiveDevices,
            totalRooms: roomData.length,
            avgPowerPerRoom: totalPower / roomData.length,
            highestConsumingRoom: highestConsumingRoom.name,
            totalDevices,
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Component to display device list with status
  const RoomDevicesList = ({ devices }) => (
    <Box mt={2}>
      {devices.map((device) => (
        <Box
          key={device.id}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
          sx={{
            p: 1,
            borderRadius: 1,
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <Typography variant="body2">{device.name}</Typography>
          <Chip
            size="small"
            label={device.status}
            color={device.status === "on" ? "success" : "default"}
            sx={{ minWidth: 70 }}
          />
        </Box>
      ))}
    </Box>
  );

  // Loading state
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Main render
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Dashboard Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
          Energy Consumption Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last updated: {new Date().toLocaleString()}
        </Typography>
      </Box>

      {/* Summary Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Power
                  </Typography>
                  <Typography variant="h4">
                    {data.summary.totalPower.toLocaleString()}W
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg {data.summary.avgPowerPerRoom.toFixed(1)}W per room
                  </Typography>
                </Box>
                <Power sx={{ fontSize: 40, color: "primary.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Active Devices
                  </Typography>
                  <Typography variant="h4">
                    {data.summary.activeDevices}/{data.summary.totalDevices}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(
                      (data.summary.activeDevices / data.summary.totalDevices) *
                      100
                    ).toFixed(1)}
                    % active
                  </Typography>
                </Box>
                <BatteryChargingFull
                  sx={{ fontSize: 40, color: "success.main" }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Monitored Rooms
                  </Typography>
                  <Typography variant="h4">
                    {data.summary.totalRooms}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(
                      data.summary.totalDevices / data.summary.totalRooms
                    ).toFixed(1)}{" "}
                    devices/room
                  </Typography>
                </Box>
                <Home sx={{ fontSize: 40, color: "primary.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Highest Consumer
                  </Typography>
                  <Typography variant="h4" sx={{ fontSize: "1.8rem" }}>
                    {data.summary.highestConsumingRoom}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(
                      (data.roomData.find(
                        (r) => r.name === data.summary.highestConsumingRoom
                      )?.powerConsumption /
                        data.summary.totalPower) *
                      100
                    ).toFixed(1)}
                    % of total
                  </Typography>
                </Box>
                <Bolt sx={{ fontSize: 40, color: "warning.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Enhanced Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Power Consumption Bar Chart */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Power Consumption by Room
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.roomData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.palette.divider}
                  />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={`{
                      backgroundColor: theme.palette.background.paper,
                      border: 1px solid ${theme.palette.divider}
                    }`}
                  />
                  <Bar
                    dataKey="powerConsumption"
                    fill={theme.palette.primary.main}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Enhanced Pie Chart */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Power Distribution
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.roomData}
                    dataKey="powerConsumption"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    label={`({name, percent}) => ${name} (${(
                      percent * 100
                    ).toFixed(1)}%)`}
                  >
                    {data.roomData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Detailed Analysis Table */}
      <Paper sx={{ mb: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Detailed Room Analysis
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Power (W)</TableCell>
                <TableCell align="right">Active/Total Devices</TableCell>
                <TableCell align="right">Power per Device</TableCell>
                <TableCell align="right">% of Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.roomData.map((room) => (
                <TableRow key={room.id}>
                  <TableCell component="th" scope="row">
                    {room.name}
                  </TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell align="right">
                    {room.powerConsumption.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {room.activeDevices}/{room.totalDevices}
                  </TableCell>
                  <TableCell align="right">
                    {room.powerPerDevice.toFixed(1)}W
                  </TableCell>
                  <TableCell align="right">
                    {(
                      (room.powerConsumption / data.summary.totalPower) *
                      100
                    ).toFixed(1)}
                    %
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Room Details Cards */}
      <Grid container spacing={3}>
        {data.roomData.map((room) => (
          <Grid item xs={12} md={6} lg={4} key={room.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {room.name}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography color="text.secondary">
                      Power Consumption
                    </Typography>
                    <Typography>{room.powerConsumption}W</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography color="text.secondary">
                      Active Devices
                    </Typography>
                    <Typography>
                      {room.activeDevices}/{room.totalDevices}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography color="text.secondary">
                      Power per Device
                    </Typography>
                    <Typography>{room.powerPerDevice.toFixed(1)}W</Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Devices in {room.name}
                </Typography>
                <RoomDevicesList devices={room.devices} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Energy;
