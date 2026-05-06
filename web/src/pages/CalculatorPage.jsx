import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calculator, Zap } from 'lucide-react';
import { useDeviceProfiles } from '@/hooks/useDeviceProfiles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import Header from '@/components/Header';
import CountdownTimer from '@/components/CountdownTimer';

const CalculatorPage = () => {
  const { profiles, currentProfile, setCurrentProfile, saveProfile } = useDeviceProfiles();
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [calculatedTime, setCalculatedTime] = useState(null);

  const [formData, setFormData] = useState({
    deviceName: '',
    chargerWattage: '',
    currentBattery: 20,
    calibrationFactor: '',
    targetBattery: 80,
  });

  useEffect(() => {
    if (currentProfile) {
      setFormData({
        deviceName: currentProfile.device_name || '',
        chargerWattage: currentProfile.charger_wattage || '',
        currentBattery: 20,
        calibrationFactor: currentProfile.calibration_factor || '',
        targetBattery: 80,
      });
    }
  }, [currentProfile]);

  const handleProfileChange = (profileId) => {
    if (profileId === 'new') {
      setCurrentProfile(null);
      setFormData({
        deviceName: '',
        chargerWattage: '',
        currentBattery: 20,
        calibrationFactor: '',
        targetBattery: 80,
      });
    } else {
      const profile = profiles.find(p => p.id === profileId);
      setCurrentProfile(profile);
    }
  };

  const handleCurrentBatteryChange = (e) => {
    const raw = e.target.value;
    // Allow empty string while typing
    if (raw === '') {
      setFormData(prev => ({ ...prev, currentBattery: '' }));
      return;
    }
    const val = parseInt(raw, 10);
    if (!isNaN(val)) {
      setFormData(prev => ({ ...prev, currentBattery: Math.max(1, Math.min(100, val)) }));
    }
  };

  const handleCurrentBatteryBlur = () => {
    const val = parseInt(formData.currentBattery, 10);
    if (isNaN(val) || val < 1) {
      setFormData(prev => ({ ...prev, currentBattery: 1 }));
    } else if (val > 100) {
      setFormData(prev => ({ ...prev, currentBattery: 100 }));
    }
  };

  const calculateChargingTime = () => {
    const { currentBattery, targetBattery, calibrationFactor } = formData;

    if (!calibrationFactor || currentBattery >= targetBattery) {
      toast.error('Invalid input', {
        description: 'Please check your battery levels and calibration factor.',
      });
      return;
    }

    const ratePerMinute = parseFloat(calibrationFactor) / 5;
    const batteryDifference = targetBattery - currentBattery;
    let timeInMinutes = batteryDifference / ratePerMinute;

    if (targetBattery > 80) {
      timeInMinutes *= 1.15;
    }

    const hours = Math.floor(timeInMinutes / 60);
    const minutes = Math.round(timeInMinutes % 60);

    setCalculatedTime({ hours, minutes, totalSeconds: Math.round(timeInMinutes * 60) });
    toast.success('Time calculated', {
      description: `Estimated charging time: ${hours}h ${minutes}m`,
    });
  };

  const handleSaveProfile = async () => {
    if (!formData.deviceName || !formData.chargerWattage || !formData.calibrationFactor) {
      toast.error('Missing information', {
        description: 'Please fill in all device details.',
      });
      return;
    }

    try {
      await saveProfile({
        id: currentProfile?.id,
        device_name: formData.deviceName,
        charger_wattage: parseFloat(formData.chargerWattage),
        calibration_factor: parseFloat(formData.calibrationFactor),
      });
      toast.success('Profile saved', {
        description: 'Device profile has been saved successfully.',
      });
    } catch (error) {
      toast.error('Failed to save profile', {
        description: error.message,
      });
    }
  };

  const handleStartCharging = () => {
    if (!calculatedTime) {
      toast.error('Calculate time first', {
        description: 'Please calculate the charging time before starting the timer.',
      });
      return;
    }

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    setIsTimerActive(true);
  };

  const handleTimerComplete = () => {
    toast.success('Charging complete!', {
      description: 'Your device has reached the target battery level.',
    });
  };

  const handleCancelTimer = () => {
    setIsTimerActive(false);
    setCalculatedTime(null);
  };

  if (isTimerActive && calculatedTime) {
    return (
      <>
        <Helmet>
          <title>Charging Timer - ChargeTimer</title>
          <meta name="description" content="Active charging countdown timer" />
        </Helmet>

        <div className="min-h-screen bg-background">
          <Header />
          <div className="max-w-2xl mx-auto px-4 py-12">
            <CountdownTimer
              totalSeconds={calculatedTime.totalSeconds}
              onComplete={handleTimerComplete}
              onCancel={handleCancelTimer}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Calculator - ChargeTimer</title>
        <meta name="description" content="Calculate optimal charging times for your devices" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <div className="max-w-4xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Charging Calculator</h1>
              <p className="text-xl text-muted-foreground">
                Calculate precise charging times for your devices
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 mb-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profile">Device Profile</Label>
                  <Select
                    value={currentProfile?.id || 'new'}
                    onValueChange={handleProfileChange}
                  >
                    <SelectTrigger className="input-glass text-foreground">
                      <SelectValue placeholder="Select a device" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Device</SelectItem>
                      {profiles.map(profile => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.device_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="deviceName">Device Nickname</Label>
                    <Input
                      id="deviceName"
                      value={formData.deviceName}
                      onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                      placeholder="My iPhone"
                      className="input-glass text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chargerWattage">Charger Wattage (W)</Label>
                    <Input
                      id="chargerWattage"
                      type="number"
                      value={formData.chargerWattage}
                      onChange={(e) => setFormData({ ...formData, chargerWattage: e.target.value })}
                      placeholder="20"
                      className="input-glass text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="calibrationFactor">5-Minute Calibration Factor (%)</Label>
                  <Input
                    id="calibrationFactor"
                    type="number"
                    step="0.1"
                    value={formData.calibrationFactor}
                    onChange={(e) => setFormData({ ...formData, calibrationFactor: e.target.value })}
                    placeholder="5.0"
                    className="input-glass text-foreground"
                  />
                  <p className="text-xs text-muted-foreground">
                    Charge for 5 minutes and note the battery percentage increase
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="currentBattery">Current Battery Level</Label>
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-5xl font-bold gradient-text" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formData.currentBattery !== '' ? `${formData.currentBattery}%` : '—'}
                    </div>
                    <div className="w-full relative">
                      <Input
                        id="currentBattery"
                        type="number"
                        min={1}
                        max={100}
                        value={formData.currentBattery}
                        onChange={handleCurrentBatteryChange}
                        onBlur={handleCurrentBatteryBlur}
                        placeholder="Enter % (1–100)"
                        className="input-glass text-foreground text-center text-lg pr-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Enter a value between 1 and 100</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Target Battery Level</Label>
                    <span className="text-2xl font-bold text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {formData.targetBattery}%
                    </span>
                  </div>
                  <Slider
                    value={[formData.targetBattery]}
                    onValueChange={([value]) => setFormData({ ...formData, targetBattery: value })}
                    min={1}
                    max={100}
                    step={1}
                    className="py-4"
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 80% for optimal battery health
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={calculateChargingTime}
                    className="flex-1 bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Time
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    variant="outline"
                    size="lg"
                    className="border-white/10 hover:bg-white/5"
                  >
                    Save Profile
                  </Button>
                </div>
              </div>
            </div>

            {calculatedTime && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-8 text-center"
              >
                <h2 className="text-2xl font-bold mb-4">Estimated Charging Time</h2>
                <div className="text-6xl font-bold gradient-text mb-6" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {calculatedTime.hours}h {calculatedTime.minutes}m
                </div>
                <p className="text-muted-foreground mb-6">
                  From {formData.currentBattery}% to {formData.targetBattery}%
                  {formData.targetBattery > 80 && ' (includes 15% safety buffer)'}
                </p>
                <Button
                  onClick={handleStartCharging}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Charging Timer
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CalculatorPage;