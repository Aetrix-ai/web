import { achievementSchema, projectSchema } from "@/lib/schema";
import { z } from "zod";
export type User = {
  name: string;
  email: string;
  role: string;
  bio?: string;
  avatar?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
};

export type Activity = {
  title: string;
  timestamp: string;
  status: "done" | "in-progress" | "draft";
};

export interface Project extends z.infer<typeof projectSchema> {
  id: number; 
};

export interface Achievement extends z.infer<typeof achievementSchema> {
  id: number;
}


export type SettingsItem = {
  title: string;
  description: string;
  enabled: boolean;
};

export type DashboardData = {
  user: User;
  activities: Activity[];
  projects: Project[];
  achievements: Achievement[];
  settings: SettingsItem[];
};
