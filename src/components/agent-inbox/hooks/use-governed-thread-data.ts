import React from "react";
import { ThreadData } from "../types";
import {
  GovernedThreadData,
  attachGovernedToThreadData,
} from "../contexts/governed-thread";

export function useGovernedThreadData<
  T extends Record<string, any> = Record<string, any>,
>(
  threadData?: ThreadData<T>,
  source?: unknown
): GovernedThreadData<T> | undefined {
  return React.useMemo(() => {
    if (!threadData) {
      return undefined;
    }

    return attachGovernedToThreadData(threadData, source ?? threadData);
  }, [threadData, source]);
}

export function hasGovernedMetadata<
  T extends Record<string, any> = Record<string, any>,
>(threadData?: GovernedThreadData<T>): boolean {
  return !!threadData?.governed;
}
