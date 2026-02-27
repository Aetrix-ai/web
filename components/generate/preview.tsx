"use client";
import * as React from "react";

import { apiClient, apiClientWithAuth, cn, SANDBOX_REFRESH } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { SiriLoading } from "@/components/ui/siri-loading";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Code, Menu, GitBranch, GitCommit, Rocket, ChevronDown, RotateCcw } from "lucide-react";
import "./preview.css";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounced-search";
import { Spinner } from "../ui/spinner";

export function Preview({ className, iframeLoaded, setIframeLoaded }: {
  className?: string;
  iframeLoaded: boolean;
  setIframeLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [id, setID] = React.useState<string | null>(null);
  const [view, setView] = React.useState<8080 | 5173>(5173);

  // Dialog states
  const [saveToGitOpen, setSaveToGitOpen] = React.useState(false);
  const [addCommitOpen, setAddCommitOpen] = React.useState(false);
  const [deployOpen, setDeployOpen] = React.useState(false);

  // Form states for Save to Git
  const [repoName, setRepoName] = React.useState("");
  const [repoDescription, setRepoDescription] = React.useState("");
  const [gitCommitMessage, setGitCommitMessage] = React.useState("");
  const [isValidRepoName, setValidRepoName] = React.useState<boolean | null>(null);
  const [isCheckingRepo, setIsCheckingRepo] = React.useState(false);
  const debouncedRepoName = useDebounce(repoName, 1000);

  // Form states for Add Commit
  const [commitMessage, setCommitMessage] = React.useState("");

  // Form states for Deploy
  const [deployProjectName, setDeployProjectName] = React.useState("");
  const [deployEnvironment, setDeployEnvironment] = React.useState("");


  React.useEffect(() => {
    if (!debouncedRepoName.trim()) {
      setValidRepoName(null);
      return;
    }

    const validateRepo = async () => {
      try {
        setIsCheckingRepo(true)
        const res = await apiClientWithAuth().get(
          `git/validate/${debouncedRepoName}`
        );
        setValidRepoName(res.data.isAvialable);
        console.log(res.data)
      } catch (err) {
        console.error(err);
        setValidRepoName(null);
      } finally {
        setIsCheckingRepo(false);
      }
    };

    validateRepo();
  }, [debouncedRepoName]);


  function handleToggle() {
    setIframeLoaded(false);
    if (view === 5173) {
      setView(8080);
    } else {
      setView(5173);
    }
  }

  const [refresh , setRefresh] = React.useState(false)
  async function handleRefresh() {
     try{
      setRefresh(true)
      setIframeLoaded(false)
     
      const res = await apiClientWithAuth().get(SANDBOX_REFRESH)
      
      toast(res.data.message)
     }catch(e){
      console.log(e)
      toast("Unable to refresh")
     }finally{
      setRefresh(false)
      setIframeLoaded(true)
     }
  } 
  React.useEffect(() => {
    async function getSandboxUrl() {
      try {
        const token = localStorage.getItem("token");
        // intialize sandbox
        const response = await apiClient.get("/ai/sandbox", {
          headers: { Authorization: token },
        });
        sessionStorage.setItem("sandbox", response.data.sandbox);
        setID(response.data.sandbox);

        console.log("Sandbox ID:", response.data.sandbox);
      } catch (error) {
        console.error("Error fetching sandbox URL:", error);
        throw error;
      }
    }
    getSandboxUrl();
  }, []);

  return (
    <div className={cn("relative h-full", !iframeLoaded && id && "p-1")}>
      {(!iframeLoaded || !id) && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 via-blue-500 via-cyan-500 to-purple-500 rounded-lg animate-gradient-flow"></div>
      )}
      <Card className={cn("flex flex-col p-0 h-full overflow-hidden relative bg-background", className)}>
        <div className="flex gap-5 absolute top-5 right-5 z-50">
          <Button variant={"outline"} onClick={handleRefresh}>
           
            {refresh ? <Spinner/> :  <RotateCcw />}
          </Button>
          <Menubar className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer">
                <Menu className="h-4 w-4 mr-2" />
                Actions
                <ChevronDown className="h-3 w-3 ml-1" />
              </MenubarTrigger>
              <MenubarContent align="end">
                <MenubarItem onClick={handleToggle}>
                  <Code className="h-4 w-4 mr-2" />
                  {view === 5173 ? "Switch to Code Preview" : "Switch to React Sandbox"}
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => setSaveToGitOpen(true)}>
                  <GitBranch className="h-4 w-4 mr-2" />
                  Save to Github
                </MenubarItem>
                <MenubarItem onClick={() => setAddCommitOpen(true)}>
                  <GitCommit className="h-4 w-4 mr-2" />
                  Add Commit
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onClick={() => setDeployOpen(true)}>
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>

        {(!iframeLoaded || !id) && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-xl z-10">
            <SiriLoading />
          </div>
        )}
        {view === 5173
          ? id && (
            <iframe
              loading="eager"
              onLoad={() => setIframeLoaded(true)}
              src={`https://${5173}-${id}.e2b.app`}
              className="w-full h-full border-0"
            />
          )
          : id && (
            <iframe
              loading="eager"
              onLoad={() => setIframeLoaded(true)}
              src={`https://${8080}-${id}.e2b.app`}
              className="w-full h-full border-0"
            />
          )}
      </Card>

      {/* Save to Git Dialog */}
      <Dialog open={saveToGitOpen} onOpenChange={setSaveToGitOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Save to Git</DialogTitle>
            <DialogDescription>
              Create a new repository and save your code to GitHub.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="repoName">Repository Name</Label>
              <Input
                id="repoName"
                value={repoName}
                onChange={(e) => {
                  setRepoName(e.target.value)
                }}
                placeholder="my-awesome-project"
              />
              {isCheckingRepo && (
                <Label className="text-sm text-muted-foreground">Checking availability...</Label>
              )}
              {!isCheckingRepo && isValidRepoName !== null && (
                <Label
                  className={
                    "text-sm " +
                    (isValidRepoName === true ? "text-green-500" : "text-destructive")
                  }
                  htmlFor="repoName"
                >
                  {isValidRepoName === true ? "Available" : "Not available"}
                </Label>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="repoDescription">Description</Label>
              <Textarea
                id="repoDescription"
                value={repoDescription}
                onChange={(e) => setRepoDescription(e.target.value)}
                placeholder="A brief description of your project"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gitCommitMessage">Initial Commit Message</Label>
              <Input
                id="gitCommitMessage"
                value={gitCommitMessage}
                onChange={(e) => setGitCommitMessage(e.target.value)}
                placeholder="Initial commit"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveToGitOpen(false)}>
              Cancel
            </Button>
            <Button disabled={isValidRepoName !== true || isCheckingRepo} onClick={async () => {
              try {
                console.log({
                  repoName, repoDescription, gitCommitMessage
                })
                const res = await apiClientWithAuth().post('/git', {
                  name: repoName,
                  decription: repoDescription,
                  commit: gitCommitMessage,
                })
                toast(res.data.msg)
                setSaveToGitOpen(false);
              } catch (e) {
                console.log(e)
              }
            }}>
              Create Repository
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Commit Dialog */}
      <Dialog open={addCommitOpen} onOpenChange={setAddCommitOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Commit</DialogTitle>
            <DialogDescription>
              Commit your changes to the repository.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="commitMessage">Commit Message</Label>
              <Textarea
                id="commitMessage"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="feat: add new feature"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCommitOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Handle commit logic here
              console.log({ commitMessage });
              setAddCommitOpen(false);
            }}>
              Commit Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deploy Dialog */}
      <Dialog open={deployOpen} onOpenChange={setDeployOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deploy Project</DialogTitle>
            <DialogDescription>
              Deploy your project to a hosting platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="deployProjectName">Project Name</Label>
              <Input
                id="deployProjectName"
                value={deployProjectName}
                onChange={(e) => setDeployProjectName(e.target.value)}
                placeholder="my-project"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deployEnvironment">Environment</Label>
              <Input
                id="deployEnvironment"
                value={deployEnvironment}
                onChange={(e) => setDeployEnvironment(e.target.value)}
                placeholder="production"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeployOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Handle deploy logic here
              console.log({ deployProjectName, deployEnvironment });
              setDeployOpen(false);
            }}>
              Deploy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
