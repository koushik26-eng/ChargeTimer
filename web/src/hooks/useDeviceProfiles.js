import { useState, useEffect } from 'react';

const STORAGE_KEY = 'chargetimer_device_profiles';

export const useDeviceProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const localProfiles = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    setProfiles(localProfiles);
  };

  const saveProfile = (profileData) => {
    const profile = {
      ...profileData,
      last_used: new Date().toISOString(),
    };

    const localProfiles = [...profiles];
    if (profile.id) {
      const index = localProfiles.findIndex(p => p.id === profile.id);
      if (index !== -1) {
        localProfiles[index] = profile;
      }
    } else {
      profile.id = `local_${Date.now()}`;
      localProfiles.push(profile);
    }

    setProfiles(localProfiles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(localProfiles));

    return profile;
  };

  const deleteProfile = (profileId) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfiles));

    if (currentProfile?.id === profileId) {
      setCurrentProfile(null);
    }
  };

  const getProfiles = () => profiles;

  return {
    profiles,
    currentProfile,
    setCurrentProfile,
    saveProfile,
    deleteProfile,
    getProfiles,
    isOnline,
  };
};