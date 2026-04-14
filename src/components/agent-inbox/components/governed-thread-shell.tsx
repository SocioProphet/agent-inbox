import React from "react";
import { ThreadData } from "../types";
import { useGovernedThreadData } from "../hooks/use-governed-thread-data";
import GovernedReviewPanel from "./governed-review-panel";

interface GovernedThreadShellProps<
  T extends Record<string, any> = Record<string, any>,
> {
  threadData?: ThreadData<T>;
  source?: unknown;
  children?: React.ReactNode;
  showGovernedPanel?: boolean;
}

export function GovernedThreadShell<
  T extends Record<string, any> = Record<string, any>,
>({
  threadData,
  source,
  children,
  showGovernedPanel = true,
}: GovernedThreadShellProps<T>): React.ReactElement {
  const governedThreadData = useGovernedThreadData(threadData, source);
  const governed = governedThreadData?.governed;

  return (
    <div className="flex flex-col gap-4 w-full">
      {children}
      {showGovernedPanel && governed ? (
        <GovernedReviewPanel governed={governed} />
      ) : null}
    </div>
  );
}

export default GovernedThreadShell;
