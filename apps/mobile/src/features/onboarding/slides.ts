import type { ComponentType } from 'react';
import type { SlideProps } from './types';
import { WelcomeSlide } from './components/WelcomeSlide';
import { ScheduleSlide } from './components/ScheduleSlide';
import { GeofencingSlide } from './components/GeofencingSlide';
import { WrappedSlide } from './components/WrappedSlide';

export type SlideId = 'welcome' | 'schedule' | 'geofencing' | 'wrapped';

export interface Slide {
  id: SlideId;
  component: ComponentType<SlideProps>;
}

export const SLIDES: Slide[] = [
  { id: 'welcome', component: WelcomeSlide },
  { id: 'schedule', component: ScheduleSlide },
  { id: 'geofencing', component: GeofencingSlide },
  { id: 'wrapped', component: WrappedSlide },
];
