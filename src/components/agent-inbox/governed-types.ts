export type PolicyClass = "P0" | "P1" | "P2" | "P3" | "P4" | "P5";

export type CompletenessState =
  | "syntactically_incomplete"
  | "semantically_incomplete"
  | "contextually_incomplete"
  | "execution_incomplete"
  | "complete_for_reply"
  | "complete_for_task"
  | "complete_for_execution";

export type GovernedActionKind =
  | "reply_draft"
  | "task_create"
  | "calendar_proposal"
  | "external_mutation"
  | "escalation";

export interface GovernedReference {
  id: string;
  kind: string;
  displayName?: string;
  confidence?: number;
  evidenceRefs?: string[];
}

export interface GovernedMissingField {
  field: string;
  reason?: string;
  requiredFor?: "reply" | "task" | "execution";
}

export interface GovernedActionProposal {
  id: string;
  kind: GovernedActionKind;
  title: string;
  summary?: string;
  payload?: Record<string, unknown>;
  autoExecutable?: boolean;
  dryRunRequired?: boolean;
  blocked?: boolean;
  approvalsRequired?: string[];
}

export interface GovernedDecisionSummary {
  policyClass?: PolicyClass;
  rationale?: string[];
  blockedActions?: string[];
  allowedActions?: string[];
}

export interface GovernedResolutionSummary {
  senderIdentity?: GovernedReference;
  senderOrg?: GovernedReference;
  subjectIdentities?: GovernedReference[];
  resourceRefs?: GovernedReference[];
  projectRefs?: GovernedReference[];
}

export interface GovernedThreadMetadata {
  source?: "email" | "request" | "artifact" | "other";
  primaryIntent?: string;
  completenessState?: CompletenessState;
  missingFields?: GovernedMissingField[];
  riskFlags?: string[];
  suspicionFlags?: string[];
  evidenceRefs?: string[];
  decision?: GovernedDecisionSummary;
  resolution?: GovernedResolutionSummary;
  actionProposals?: GovernedActionProposal[];
}
