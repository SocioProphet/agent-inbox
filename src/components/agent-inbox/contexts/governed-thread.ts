import { ThreadData, HumanInterrupt } from "../types";
import { GovernedThreadMetadata } from "../governed-types";
import { governedThreadToHumanInterrupts } from "./governed-adapter";

type UnknownRecord = Record<string, any>;

export type GovernedThreadData<
  T extends Record<string, any> = Record<string, any>,
> = ThreadData<T> & {
  governed?: GovernedThreadMetadata;
};

function isObjectLike(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function maybeGovernedMetadata(
  value: unknown
): GovernedThreadMetadata | undefined {
  if (!isObjectLike(value)) {
    return undefined;
  }

  const candidate = value as UnknownRecord;
  if (
    candidate.primaryIntent !== undefined ||
    candidate.completenessState !== undefined ||
    candidate.actionProposals !== undefined ||
    candidate.decision !== undefined ||
    candidate.evidenceRefs !== undefined
  ) {
    return candidate as GovernedThreadMetadata;
  }

  return undefined;
}

export function extractGovernedThreadMetadata(
  source: unknown
): GovernedThreadMetadata | undefined {
  if (!isObjectLike(source)) {
    return undefined;
  }

  const record = source as UnknownRecord;

  return (
    maybeGovernedMetadata(record.governed) ||
    maybeGovernedMetadata(record.values?.governed) ||
    maybeGovernedMetadata(record.thread?.values?.governed) ||
    maybeGovernedMetadata(record.thread_state?.values?.governed) ||
    maybeGovernedMetadata(record.state?.values?.governed) ||
    maybeGovernedMetadata(record.metadata?.governed)
  );
}

export function mergeGovernedInterrupts(
  interrupts: HumanInterrupt[] | undefined,
  governed: GovernedThreadMetadata | undefined
): HumanInterrupt[] | undefined {
  if (!governed) {
    return interrupts;
  }

  const governedInterrupts = governedThreadToHumanInterrupts(governed);

  if (!interrupts?.length) {
    return governedInterrupts;
  }

  return [...interrupts, ...governedInterrupts];
}

export function attachGovernedToThreadData<
  T extends Record<string, any> = Record<string, any>,
>(
  threadData: ThreadData<T>,
  source?: unknown
): GovernedThreadData<T> {
  const governed = extractGovernedThreadMetadata(source ?? threadData);

  if (!governed) {
    return threadData as GovernedThreadData<T>;
  }

  const mergedInterrupts = mergeGovernedInterrupts(threadData.interrupts, governed);
  const shouldPromoteToInterrupted =
    threadData.status !== "interrupted" && !!mergedInterrupts?.length;

  return {
    ...threadData,
    status: shouldPromoteToInterrupted ? "interrupted" : threadData.status,
    governed,
    interrupts: mergedInterrupts,
  } as GovernedThreadData<T>;
}
