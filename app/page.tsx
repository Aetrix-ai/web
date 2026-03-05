"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { 
  ArrowRight, 
  Sparkles, 
  Code2, 
  Trophy, 
  MessageSquare, 
  Zap,
  Shield,
  Users,
  TrendingUp,
  Rocket,
  GitBranch,
  Brain,
  FileCode,
  CheckCircle2,
  Star,
  Share2,
  Container,
  Globe
} from "lucide-react";

export default function Home() {
  const [hasToken, setHasToken] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("token");
    }
    return false;
  });

  const stats = [
    { label: "React Projects", value: "10K+", icon: Rocket },
    { label: "Active Developers", value: "5K+", icon: Users },
    { label: "Sandboxes Created", value: "50K+", icon: Container },
    { label: "Shared Links", value: "25K+", icon: Share2 },
  ];

  const features = [
    {
      title: "AI-Powered React Assistant",
      description: "Get instant help building React apps with intelligent AI guidance and code generation",
      image: "https://github.com/Aetrix-ai/web/raw/main/public/screenshots/chat_example.png",
      icon: MessageSquare,
    },
    {
      title: "React Project Management",
      description: "Create, organize and manage your React projects with AI-powered tools",
      image: "https://github.com/Aetrix-ai/web/raw/main/public/screenshots/project_form.png",
      icon: Code2,
    },
    {
      title: "Achievement Tracking",
      description: "Celebrate your milestones and track your React development journey",
      image: "https://github.com/Aetrix-ai/web/raw/main/public/screenshots/achievemwnt_view.png",
      icon: Trophy,
    },
  ];

  const capabilities = [
    {
      icon: Brain,
      title: "AI-Powered React Development",
      description: "Leverage advanced AI models specialized for React. Get intelligent component suggestions, hooks help, and real-time code explanations.",
    },
    {
      icon: Container,
      title: "Secure Sandbox Environment",
      description: "Build and test React apps in isolated, secure sandbox environments. Your code runs safely with full npm package support.",
    },
    {
      icon: Share2,
      title: "Shareable Development Links",
      description: "Instantly share your work-in-progress with teammates or clients. Generate secure, live preview links for your React projects.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security protects your React code and projects. Sandboxed execution ensures safe development.",
    },
    {
      icon: Zap,
      title: "Lightning Fast HMR",
      description: "Hot module replacement and optimized build tools ensure instant feedback. See your React changes in real-time.",
    },
    {
      icon: GitBranch,
      title: "GitHub Integration",
      description: "Connect your GitHub repositories and deploy React projects directly. Seamless version control integration.",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Sign Up & Connect",
      description: "Create your account and optionally connect your GitHub for seamless React project management.",
      icon: Users,
    },
    {
      step: "02",
      title: "Create React Project",
      description: "Start a new React project in a secure sandbox with AI-powered scaffolding and setup.",
      icon: Code2,
    },
    {
      step: "03",
      title: "Build with AI",
      description: "Develop your React app with AI assistance, live previews, and instant shareable links.",
      icon: Rocket,
    },
    {
      step: "04",
      title: "Share & Deploy",
      description: "Generate shareable links for collaboration or deploy your React project directly to production.",
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">AI-Powered React Development Platform</span>
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Build React Apps with{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Aetrix AI
              </span>
            </h1>
            <p className="mb-10 text-lg leading-8 text-muted-foreground sm:text-xl">
              Your intelligent React development companion. Build in secure sandboxes, get AI-powered assistance, share live previews instantly, and manage your React projects effortlessly.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {hasToken ? (
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
                >
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
                  >
                    Get Started
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-8 py-3 text-base font-semibold text-foreground transition-all hover:bg-accent"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need for React development
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Powerful features designed specifically for React developers with AI assistance
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border-2 border-border bg-gradient-to-b from-card to-card/50 p-6 shadow-lg transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/5 transition-all duration-500 group-hover:bg-primary/10" />
                <div className="relative">
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-card-foreground transition-colors group-hover:text-primary">{feature.title}</h3>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                  <div className="relative overflow-hidden rounded-xl border-2 border-border shadow-xl transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={800}
                      height={600}
                      className="w-full transition-all duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Powerful Capabilities
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Everything you need in one integrated platform
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                    {capability.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{capability.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get started in minutes with our simple workflow
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="absolute -right-4 top-12 hidden h-0.5 w-8 bg-border lg:block" />
                )}
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {item.step}
                      </div>
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Examples */}
      <section className="bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              AI React Assistant in Action
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              See how our AI helps React developers build components, debug hooks, and solve real problems
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="group relative overflow-hidden rounded-3xl border-2 border-border bg-card shadow-2xl transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 transition-all duration-500 group-hover:bg-primary/10" />
              <div className="relative p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground">React Code Assistance</h3>
                    <p className="text-xs text-muted-foreground">Real-time AI help</p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl border-2 border-border shadow-xl transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-2xl">
                  <Image
                    src="https://github.com/Aetrix-ai/web/raw/main/public/screenshots/chat_example_2.png"
                    alt="Chat Example 2"
                    width={700}
                    height={500}
                    className="w-full transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-3xl border-2 border-border bg-card shadow-2xl transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 transition-all duration-500 group-hover:bg-primary/10" />
              <div className="relative p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-card-foreground">React Problem Solving</h3>
                    <p className="text-xs text-muted-foreground">Intelligent debugging</p>
                  </div>
                </div>
                <div className="overflow-hidden rounded-xl border-2 border-border shadow-xl transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-2xl">
                  <Image
                    src="https://github.com/Aetrix-ai/web/raw/main/public/screenshots/chat_exaple3.png"
                    alt="Chat Example 3"
                    width={700}
                    height={500}
                    className="w-full transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="group relative overflow-hidden rounded-3xl border-2 border-border bg-gradient-to-b from-card to-card/80 shadow-2xl transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20">
          <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/5 transition-all duration-700 group-hover:bg-primary/10" />
          <div className="absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-primary/5 transition-all duration-700 group-hover:bg-primary/10" />
          <div className="relative p-10">
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Feature Preview</span>
              </div>
              <h2 className="mb-4 text-4xl font-bold text-foreground">
                Your personalized dashboard
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Access all your React projects, AI chat history, and achievements in one beautiful interface
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border-2 border-border shadow-2xl transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <Image
                src="https://github.com/Aetrix-ai/web/raw/main/public/screenshots/dasbord_1.png"
                alt="Dashboard Preview"
                width={1400}
                height={900}
                className="w-full transition-transform duration-700 group-hover:scale-[1.02]"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why React Developers Choose Aetrix
              </h2>
              <div className="space-y-4">
                {[
                  "Build React apps in secure, isolated sandbox environments",
                  "Share live preview links instantly with anyone",
                  "Get AI-powered React component and hooks assistance",
                  "Manage multiple React projects effortlessly",
                  "Track achievements and celebrate development milestones",
                  "Deploy directly to production with GitHub integration",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary" />
                    <p className="text-muted-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-6">
              <div className="group relative overflow-hidden rounded-2xl border-2 border-border bg-gradient-to-br from-card to-card/80 p-8 shadow-xl transition-all duration-500 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
                <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary/5 transition-all duration-500 group-hover:bg-primary/10" />
                <div className="relative">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Star className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-card-foreground">Achievement System</div>
                      <div className="text-sm text-muted-foreground">Unlock badges & track growth</div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-xl border-2 border-border shadow-xl transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-2xl">
                    <Image
                      src="https://github.com/Aetrix-ai/web/raw/main/public/screenshots/achivement_form.png"
                      alt="Achievement Form"
                      width={600}
                      height={400}
                      className="w-full transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-8 py-16 shadow-2xl sm:px-16">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to supercharge your React development?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/90">
              Join thousands of React developers building faster with AI assistance, secure sandboxes, and instant sharing
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              {!hasToken && (
                <>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-lg bg-background px-8 py-3 text-base font-semibold text-foreground shadow-lg transition-all hover:bg-background/90 hover:shadow-xl"
                  >
                    Start Building Now
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-primary-foreground/20 bg-transparent px-8 py-3 text-base font-semibold text-primary-foreground transition-all hover:border-primary-foreground/40 hover:bg-primary-foreground/10"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Aetrix</span>
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                Your AI-powered React development companion. Build in secure sandboxes, share instantly, and get intelligent assistance for every React project.
              </p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/signup" className="hover:text-foreground">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-foreground">Sign In</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="hover:text-foreground cursor-pointer">Documentation</li>
                <li className="hover:text-foreground cursor-pointer">Tutorials</li>
                <li className="hover:text-foreground cursor-pointer">Support</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Aetrix. Building the future of development with AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
