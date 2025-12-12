"use client";

import { FolderGit2, LayoutDashboard, LifeBuoy, Loader2, Settings, Sparkles, Trophy, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Achievements } from "@/components/dashboard/achievements";
import { Navbar } from "@/components/dashboard/navbar";
import type { NavItem } from "@/components/dashboard/navbar";
import { Projects } from "@/components/dashboard/projects";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SettingsSection } from "@/components/dashboard/settings-section";
import { UserDetails } from "@/components/dashboard/user-details";
import type { DashboardData, User } from "@/components/dashboard/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      setData({
        user: {
          name: "Avery Collins",
          email: "avery.collins@campus.edu",
          role: "STUDENT",
          bio: "CS student focused on human-friendly AI tools. Loves reliable UX and clean systems.",
          avatar: "https://api.dicebear.com/8.x/thumbs/svg?seed=avery",
          github: "github.com/averycollins",
          linkedin: "linkedin.com/in/averycollins",
          twitter: "x.com/averycollins",
        },
        activities: [
          { title: "Generated AI cover letter", timestamp: "12m ago", status: "done" },
          { title: "Refined project brief", timestamp: "2h ago", status: "in-progress" },
          { title: "Booked mentor session", timestamp: "Yesterday", status: "draft" },
        ],
        projects: [
          {
            title: "Campus Compass",
            description: "Mobile companion to navigate campus and events.",
            techStack: ["Next.js", "Expo", "Maps"],
            status: "live",
            repoLink: "https://github.com/example/campus-compass",
            image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=800",
            sandbox: "https://codesandbox.io/s/campus-compass",
          },
          {
            title: "Study Buddy",
            description: "AI study planner that turns syllabi into sprints.",
            techStack: ["Next.js", "Prisma", "AI"],
            status: "building",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
          },
          {
            title: "GreenLedger",
            description: "Track and report carbon footprint for clubs.",
            techStack: ["TypeScript", "PostgreSQL"],
            status: "idea",
          },
        ],
        achievements: [
          { title: "Hackathon winner", description: "Real-time shuttle tracker.", date: "Oct 2024" },
          { title: "Research assistant", description: "LLM-assisted learning pathways.", date: "Jul 2024" },
          { title: "Open source", description: "Accessibility fixes for design system.", date: "May 2024" },
        ],
        settings: [
          { title: "Account protection", description: "Sign-in alerts and device approvals.", enabled: true },
          { title: "AI assist", description: "Use AI suggestions while drafting.", enabled: true },
          { title: "Privacy", description: "Limit profile visibility to cohort.", enabled: false },
        ],
      });
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return { data, loading };
}

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "achievements", label: "Achievements", icon: Trophy },
  { id: "activity", label: "Activity", icon: Sparkles },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function DashboardPage() {
  const { data, loading } = useDashboardData();
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  const placeholderUser = useMemo<User>(
    () => ({
      name: "Loading...",
      email: "",
      role: "",
      avatar: "https://api.dicebear.com/8.x/thumbs/svg?seed=placeholder",
    }),
    []
  );

  const user = data?.user ?? placeholderUser;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-[50vh] items-center justify-center">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="size-6 animate-spin" />
            <span className="text-lg">Loading your portfolio...</span>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">Total Projects</div>
                <div className="mt-2 text-3xl font-bold">{data?.projects.length || 0}</div>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">Achievements</div>
                <div className="mt-2 text-3xl font-bold">{data?.achievements.length || 0}</div>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">Deployed Sites</div>
                <div className="mt-2 text-3xl font-bold">12</div>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">Completion</div>
                <div className="mt-2 text-3xl font-bold">85%</div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <RecentActivity activities={data?.activities || []} />
              <div className="rounded-xl border bg-card p-6 shadow-sm h-full flex flex-col">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <Button
                    variant="outline"
                    className="h-full py-4 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary/20 transition-colors"
                  >
                    <FolderGit2 className="size-5 text-primary" />
                    <span>Add Project</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-full py-4 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary/20 transition-colors"
                  >
                    <Trophy className="size-5 text-primary" />
                    <span>Add Achievement</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-full py-4 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary/20 transition-colors"
                  >
                    <UserRound className="size-5 text-primary" />
                    <span>Edit Profile</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-full py-4 flex flex-col gap-2 hover:bg-primary/5 hover:border-primary/20 transition-colors"
                  >
                    <Settings className="size-5 text-primary" />
                    <span>Settings</span>
                  </Button>
                </div>
              </div>
            </div>

            <Button
              onClick={() => router.replace("/generate")}
              className="w-full py-8 text-lg font-semibold transition-all hover:shadow-md active:scale-[0.99]"
            >
              <Sparkles className="mr-2 size-6" />
              Create Website
            </Button>
          </div>
        );
      case "profile":
        return (
          <div className="mx-auto space-y-6 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UserDetails />
          </div>
        );
      case "projects":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Projects projects={data?.projects || []} />
          </div>
        );
      case "achievements":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Achievements achievements={data?.achievements || []} />
          </div>
        );
      case "activity":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RecentActivity activities={data?.activities || []} />
          </div>
        );
      case "settings":
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SettingsSection settings={data?.settings || []} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Navbar items={navItems} activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-y-auto h-screen">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight capitalize">{activeTab}</h1>
            <p className="text-sm text-muted-foreground">Manage your {activeTab} and portfolio data.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              View Public Profile
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary/10 border flex items-center justify-center text-xs font-medium text-primary">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-8 w-full">{renderContent()}</div>
      </main>
    </div>
  );
}
