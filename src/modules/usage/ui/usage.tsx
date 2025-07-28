import React from "react";
import { formatDuration, intervalToDuration } from "date-fns";
import { Button } from "@/components/ui/button";
import { CrownIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  points: number;
  nextCycleMilliseconds: number;
};
const Usage = ({ points, nextCycleMilliseconds }: Props) => {
  return (
    <div className=" rounded-t-lg bg-secondary border border-b-0 p-2.5 ">
      <div className="pl-3 flex gap-2.5 items-center justify-between">
        <div className="text-sm">
          <p>{points} credits remaining</p>
          <p className="text-muted-foreground">
            Reset in{" "}
            {formatDuration(
              intervalToDuration({
                start: new Date(),
                end: new Date(Date.now() + nextCycleMilliseconds),
              }),
              {
                format: ["months", "days", "hours"],
              }
            )}
          </p>
        </div>

        <Button asChild>
          <Link href={"/pricing"}>
            <CrownIcon />
            Upgrade
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Usage;
