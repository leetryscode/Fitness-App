import React from 'react';
import Svg, { Rect, Ellipse, Circle } from 'react-native-svg';
import { MuscleRegion } from '../../types/muscles';
import { FatigueLevel } from '../../types/fatigue';
import { FATIGUE_COLORS } from '../../types/fatigue';

type Props = {
  fatigue: Record<MuscleRegion, FatigueLevel>;
};

function fillFor(
  fatigue: Record<MuscleRegion, FatigueLevel>,
  region: MuscleRegion
): string {
  return FATIGUE_COLORS[fatigue[region] ?? 'fresh'];
}

export function BodyFigureFront({ fatigue }: Props) {
  return (
    <Svg viewBox="0 0 120 280" width="100%" height="100%">
      {/* Head */}
      <Circle cx="60" cy="22" r="16" fill="#F9FAFB" stroke="#000" strokeWidth="1.5" />

      {/* Shoulders */}
      <Ellipse
        cx="60"
        cy="52"
        rx="38"
        ry="12"
        fill={fillFor(fatigue, 'shoulders')}
        stroke="#000"
        strokeWidth="1.5"
      />

      {/* Chest */}
      <Rect
        x="32"
        y="62"
        width="56"
        height="36"
        rx="6"
        fill={fillFor(fatigue, 'chest')}
        stroke="#000"
        strokeWidth="1.5"
      />

      {/* Biceps - left */}
      <Ellipse
        cx="18"
        cy="82"
        rx="10"
        ry="28"
        fill={fillFor(fatigue, 'biceps')}
        stroke="#000"
        strokeWidth="1.5"
      />
      {/* Biceps - right */}
      <Ellipse
        cx="102"
        cy="82"
        rx="10"
        ry="28"
        fill={fillFor(fatigue, 'biceps')}
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

      {/* Abs */}
      <Rect
        x="40"
        y="100"
        width="40"
        height="44"
        rx="4"
        fill={fillFor(fatigue, 'abs')}
        stroke="#000"
        strokeWidth="1.5"
      />

      {/* Quads - left */}
      <Ellipse
        cx="44"
        cy="185"
        rx="14"
        ry="42"
        fill={fillFor(fatigue, 'quads')}
        stroke="#000"
        strokeWidth="1.5"
      />
      {/* Quads - right */}
      <Ellipse
        cx="76"
        cy="185"
        rx="14"
        ry="42"
        fill={fillFor(fatigue, 'quads')}
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
