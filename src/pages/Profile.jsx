import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db, storage, updateUserProfile } from "../Authentication/firebase";

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setName(user.displayName || "");
        setPhotoURL(user.photoURL || "");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleFileChange = (event) => {
    if (event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handlePasswordChange = (event) => {
    setPasswordForm({
      ...passwordForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      let updatedPhotoURL = photoURL;

      if (file) {
        const fileRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(fileRef, file);
        updatedPhotoURL = await getDownloadURL(fileRef);
        setPhotoURL(updatedPhotoURL);
      }

      // Update profile in Firebase Authentication
      await updateUserProfile(name, updatedPhotoURL);

      // Update profile in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        displayName: name,
        photoURL: updatedPhotoURL,
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 3, bgcolor: "white", boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom align="center">
        Profile
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar src={photoURL || "https://via.placeholder.com/150"} sx={{ width: 100, height: 100 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h6">{name}</Typography>
            <Typography color="textSecondary">{user?.email}</Typography>
          </Grid>
          <Grid item>
            <Button component="label" variant="outlined">
              Change Photo
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <TextField fullWidth label="Name" value={name} onChange={handleNameChange} margin="normal" />
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Security
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenPasswordDialog(true)}>
          Change Password
        </Button>
      </Paper>

      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Current Password"
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="New Password"
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      <Button fullWidth variant="contained" color="primary" onClick={handleUpdateProfile} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Update Profile"}
      </Button>
    </Box>
  );
};

export default Profile;