import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, Zap, Clock } from 'lucide-react';
import { useDeviceProfiles } from '@/hooks/useDeviceProfiles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { format } from 'date-fns';

const ProfileManagementPage = () => {
  const { profiles, saveProfile, deleteProfile } = useDeviceProfiles();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [formData, setFormData] = useState({
    device_name: '',
    charger_wattage: '',
    calibration_factor: '',
  });

  const handleOpenDialog = (profile = null) => {
    if (profile) {
      setEditingProfile(profile);
      setFormData({
        device_name: profile.device_name,
        charger_wattage: profile.charger_wattage,
        calibration_factor: profile.calibration_factor,
      });
    } else {
      setEditingProfile(null);
      setFormData({
        device_name: '',
        charger_wattage: '',
        calibration_factor: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProfile(null);
    setFormData({
      device_name: '',
      charger_wattage: '',
      calibration_factor: '',
    });
  };

  const handleSave = async () => {
    if (!formData.device_name || !formData.charger_wattage || !formData.calibration_factor) {
      toast.error('Missing information', {
        description: 'Please fill in all fields.',
      });
      return;
    }

    try {
      await saveProfile({
        id: editingProfile?.id,
        device_name: formData.device_name,
        charger_wattage: parseFloat(formData.charger_wattage),
        calibration_factor: parseFloat(formData.calibration_factor),
      });
      toast.success(editingProfile ? 'Profile updated' : 'Profile created', {
        description: 'Device profile has been saved successfully.',
      });
      handleCloseDialog();
    } catch (error) {
      toast.error('Failed to save profile', {
        description: error.message,
      });
    }
  };

  const handleDelete = async (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        await deleteProfile(profileId);
        toast.success('Profile deleted', {
          description: 'Device profile has been removed.',
        });
      } catch (error) {
        toast.error('Failed to delete profile', {
          description: error.message,
        });
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Device Profiles - ChargeTimer</title>
        <meta name="description" content="Manage your saved device charging profiles" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <div className="max-w-6xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">Device Profiles</h1>
                <p className="text-xl text-muted-foreground">
                  Manage your saved charging configurations
                </p>
              </div>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-primary hover:bg-primary/90"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                New Profile
              </Button>
            </div>

            {profiles.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center">
                <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h2 className="text-2xl font-bold mb-2">No profiles yet</h2>
                <p className="text-muted-foreground mb-6">
                  Create your first device profile to get started
                </p>
                <Button
                  onClick={() => handleOpenDialog()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Profile
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile, index) => (
                  <motion.div
                    key={profile.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="glass-card-hover rounded-2xl p-6 flex flex-col h-full"
                  >
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleOpenDialog(profile)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-white/5"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(profile.id)}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold mb-3">{profile.device_name}</h3>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Charger Wattage</span>
                          <span className="font-medium">{profile.charger_wattage}W</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Calibration Factor</span>
                          <span className="font-medium">{profile.calibration_factor}%</span>
                        </div>
                      </div>
                    </div>

                    {profile.last_used && (
                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        Last used {format(new Date(profile.last_used), 'MMM d, yyyy')}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="glass-card border-white/10">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {editingProfile ? 'Edit Profile' : 'New Profile'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="device_name">Device Nickname</Label>
                <Input
                  id="device_name"
                  value={formData.device_name}
                  onChange={(e) => setFormData({ ...formData, device_name: e.target.value })}
                  placeholder="My iPhone"
                  className="input-glass text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="charger_wattage">Charger Wattage (W)</Label>
                <Input
                  id="charger_wattage"
                  type="number"
                  value={formData.charger_wattage}
                  onChange={(e) => setFormData({ ...formData, charger_wattage: e.target.value })}
                  placeholder="20"
                  className="input-glass text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calibration_factor">5-Minute Calibration Factor (%)</Label>
                <Input
                  id="calibration_factor"
                  type="number"
                  step="0.1"
                  value={formData.calibration_factor}
                  onChange={(e) => setFormData({ ...formData, calibration_factor: e.target.value })}
                  placeholder="5.0"
                  className="input-glass text-foreground"
                />
                <p className="text-xs text-muted-foreground">
                  Charge for 5 minutes and note the battery percentage increase
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleCloseDialog}
                variant="outline"
                className="border-white/10 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90"
              >
                {editingProfile ? 'Update' : 'Create'} Profile
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ProfileManagementPage;