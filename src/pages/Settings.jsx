
import { Box, Paper, Typography, Switch, FormControlLabel } from '@mui/material';
import { useThemeContext } from '../Theme/Theme';

 const Settings = () => {
  const { mode, toggleColorMode } = useThemeContext();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Appearance
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={mode === 'dark'}
              onChange={toggleColorMode}
            />
          }
          label="Dark Mode"
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Push Notifications"
        />
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Email Notifications"
        />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Privacy
        </Typography>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Share Usage Data"
        />
        <FormControlLabel
          control={<Switch />}
          label="Location Services"
        />
      </Paper>
    </Box>
  );
};
export default Settings;