import { ObjectId } from "mongodb";

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

// Update EventLabel interface to be consistent
export interface EventLabel {
  _id: string | ObjectId;
  name: string;
  color: string;
}

export interface Event {
  _id?: string | ObjectId;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  imageBase64?: string;
  link?: string;
  registrationLink?: string;
  showRegistrationButton: boolean;
  status: EventStatus;
  labels: string[];
  isActive: boolean;
  isPastEvent: boolean;
  pastEventAction?: 'thankYou' | 'viewRecap' | 'none' | 'both';
  pastEventMessage?: string;
  recapLink?: string;
  recapImages?: string[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  location: string;
  imageBase64: string;
  link: string;
  registrationLink: string;
  showRegistrationButton: boolean;
  status: EventStatus;
  labels: string[];
  isActive: boolean;
  isPastEvent: boolean;
  pastEventAction: 'thankYou' | 'viewRecap' | 'none' | 'both';
  pastEventMessage: string;
  recapLink: string;
  recapImages?: string[];
}
