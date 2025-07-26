import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Settings,
  SunMoon,
  HelpCircle,
  Pencil,
  Gift,
  ArrowRight,
  ChevronDownIcon,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";

type Props = {
  projectId: string;
};
const ProjectMenu = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId })
  );
  const creditsLeft = 3;
  const creditsUsed = 7; // Example usage for progress bar

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="focus-visible:ring-0 ">
        <Button variant={"ghost"} className="self-start">
          {project?.name}

          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[280px] rounded-xl shadow-md backdrop-blur-sm bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-700">
        <DropdownMenuItem className="text-sm font-medium text-muted-foreground cursor-pointer">
          <Link href={"/"}>Go to Dashboard</Link>
        </DropdownMenuItem>

        <div className="px-4 py-2">
          <div className="text-sm font-semibold text-black dark:text-white">
            Credits
          </div>
          <div className="text-sm text-muted-foreground">
            {creditsLeft} left
          </div>
          <Progress
            value={(creditsUsed / (creditsUsed + creditsLeft)) * 100}
            className="mt-1 h-2 bg-muted"
          />
          <div className="text-xs text-muted-foreground mt-1">
            Daily credits used first
          </div>
        </div>

        <DropdownMenuItem className="gap-2">
          <Gift className="w-4 h-4" />
          Get free credits
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2">
          <Pencil className="w-4 h-4" />
          Rename project
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2">
          <SunMoon className="w-4 h-4" />
          Appearance
          <ArrowRight className="ml-auto w-4 h-4 opacity-50" />
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2">
          <HelpCircle className="w-4 h-4" />
          Help
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectMenu;
