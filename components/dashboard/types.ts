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

export type Project = {
  id?: number;
  title: string;
  description: string;
  techStack: string[];
  status?: "live" | "building" | "idea";
  repoLink?: string;
  demoLink?: string;
  image?: string;
  images: string[];
  videos: string[];
  additionalInfo?: string;
};

export type Achievement = {
  id?: number;
  title: string;
  description: string;
  date: string;
  images?: string[];
};

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
