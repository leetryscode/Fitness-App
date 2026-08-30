import React from 'react';
import Svg, { Rect, Ellipse, Circle } from 'react-native-svg';
import { MuscleRegion } from '../../types/muscles';
import { FatigueLevel, FATIGUE_COLORS } from '../../types/fatigue';

type Props = {
  fatigue: Record<MuscleRegion, FatigueLevel>;
};

function fillFor(
  fatigue: Record<MuscleRegion, FatigueLevel>,
  region: MuscleRegion
): string {
  return FATIGUE_COLORS[fatigue[region] ?? 'fresh'];
}

export function BodyFigureBack({ fatigue }: Props) {
  return (
    <Svg viewBox="0 0 120 280" width="100%" height="100%">
      {/* Head */}
      <Circle cx="60" cy="22" r="16" fill="#F9FAFB" stroke="#000" strokeWidth="1.5" />

      {/* Traps */}
      <Ellipse
        cx="60"
        cy="48"
        rx="20"
        ry="10"
        fill={fillFor(fatigue, 'traps')}
        stroke="#000"
        strokeWidth="1.5"
      />

      {/* Shoulders */}
      <Ellipse
        cx="60"
        cy="58"
        rx="38"
        ry="10"
        fill={fillFor(fatigue, 'shoulders')}
        stroke="#000"
        strokeWidth="1.5"
      />

      {/* Lats */}
      <Rect
        x="28"
        y="66"
        width="64"
        height="50"
        rx="6"
        fill={fillFor(fatigue, 'lats')}
        stroke="#000"
        strokeWidth="1.5"
      />

      {/* Forearms - left */}
      <Ellipse
        cx="16"
        cy="130"
        rx="8"
        ry="24"
        fill={fillFor(fatigue, 'forearms')}
        stroke="#000"
        strokeWidth="1.5"
      />
      {/* Forearms - right */}
      <Ellipse
        cx="104"
        cy="130"
        rx="8"
        ry="24"
        fill={fillFor(fatigue, 'forearms')}
        stroke="#000"
        strokeWidth="1.5"
      />

      {/* Glutes */}
      <Ellipse
        cx="60"
        cy="130"
        rx="28"
        ry="16"
        fill={fillFor(fatigue, 'glutes')}
        stroke="#000"
        strokeWidth="1.5"
      />

      {/* Hamstrings - left */}
      <Ellipse
        cx="44"
        cy="185"
        rx="14"
        ry="42"
        fill={fillFor(fatigue, 'hamstrings')}
        stroke="#000"
        strokeWidth="1.5"
      />
      {/* Hamstrings - right */}
      <Ellipse
        cx="76"
        cy="185"
        rx="14"
        ry="42"
        fill={fillFor(fatigue, 'hamstrings')}
        stroke="#000"
        strokeWidth="1.5"
      />

      {/* Calves - left */}
      <Ellipse
        cx="44"
        cy="248"
        rx="10"
        ry="28"
        fill={fillFor(fatigue, 'calves')}
        stroke="#000"
        strokeWidth="1.5"
      />
      {/* Calves - right */}
      <Ellipse
        cx="76"
        cy="248"
        rx="10"
        ry="28"
        fill={fillFor(fatigue, 'calves')}
        stroke="#000"
        strokeWidth="1.5"
      />
    </Svg>
  );
}
