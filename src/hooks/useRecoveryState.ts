import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getAllEntries } from '../db/entries';
import { Entry } from '../types/entry';
import { MuscleRegion } from '../types/muscles';
import { FatigueLevel } from '../types/fatigue';
import { computeRegionFatigue } from '../domain/recovery';

export function useRecoveryState() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [fatigue, setFatigue] = useState<Record<MuscleRegion, FatigueLevel>>(
    {} as Record<MuscleRegion, FatigueLevel>
  );
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const allEntries = await getAllEntries();
    setEntries(allEntries);
    setFatigue(computeRegionFatigue(allEntries));
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setFatigue(computeRegionFatigue(entries));
    }, 60000);
    return () => clearInterval(interval);
  }, [entries]);

  return { entries, fatigue, loading, refresh };
}
