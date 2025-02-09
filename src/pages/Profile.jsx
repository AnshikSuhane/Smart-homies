import { useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db, storage, updateUserProfile } from "../Authentication/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Camera, KeyRound, Loader2 } from "lucide-react";

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

      await updateUserProfile(name, updatedPhotoURL);

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
    <div className="container max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Manage your profile information and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photo Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={photoURL || ""} alt="Profile" />
              <AvatarFallback>
                <UserCircle className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">{name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Button variant="outline" className="mt-2" asChild>
                <label className="cursor-pointer">
                  <Camera className="mr-2 h-4 w-4" />
                  Change Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </Button>
            </div>
          </div>

          <Separator />

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
              />
            </div>
          </div>

          <Separator />

          {/* Security Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Security</h3>
            <Button
              variant="outline"
              onClick={() => setOpenPasswordDialog(true)}
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </div>

          {/* Update Profile Button */}
          <Button
            className="w-full"
            onClick={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Profile"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={openPasswordDialog} onOpenChange={setOpenPasswordDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new one
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenPasswordDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Change Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;