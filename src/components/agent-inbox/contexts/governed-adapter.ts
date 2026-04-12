import {
  GovernedActionProposal,
  GovernedThreadMetadata,
  PolicyClass,
} from "../governed-types";
import {
  ActionRequest,
  HumanInterrupt,
  HumanInterruptConfig,
} from "../types";

function policyClassToInterruptConfig(
  policyClass?: PolicyClass,
  blocked = false
): HumanInterruptConfig {
  if (blocked) {
    return {
      allow_ignore: true,
      allow_respond: true,
      allow_edit: false,
      allow_accept: false,
    };
  }

  switch (policyClass) {
    case "P0":
    case "P1":
      return {
        allow_ignore: true,
        allow_respond: true,
        allow_edit: false,
        allow_accept: false,
      };
    case "P2":
    case "P3":
      return {
        allow_ignore: true,
        allow_respond: true,
        allow_edit: true,
        allow_accept: true,
      };
    case "P4":
    case "P5":
      return {
        allow_ignore: true,
        allow_respond: true,
        allow_edit: true,
        allow_accept: false,
      };
    default:
      return {
        allow_ignore: true,
        allow_respond: true,
        allow_edit: true,
        allow_accept: false,
      };
  }
}

function buildDescription(
  proposal: GovernedActionProposal,
  governed: GovernedThreadMetadata
): string {
  const lines: string[] = [];

  if (proposal.summary) {
    lines.push(proposal.summary);
    lines.push("");
  }

  if (governed.primaryIntent) {
    lines.push(`**Primary intent:** ${governed.primaryIntent}`);
  }

  if (governed.completenessState) {
    lines.push(`**Completeness:** ${governed.completenessState}`);
  }

  if (governed.missingFields?.length) {
    lines.push("**Missing fields:**");
    governed.missingFields.forEach((field) => {
      lines.push(`- ${field.field}${field.reason ? ` — ${field.reason}` : ""}`);
    });
  }

  if (governed.riskFlags?.length) {
    lines.push("**Risk flags:**");
    governed.riskFlags.forEach((flag) => lines.push(`- ${flag}`));
  }

  if (governed.suspicionFlags?.length) {
    lines.push("**Suspicion flags:**");
    governed.suspicionFlags.forEach((flag) => lines.push(`- ${flag}`));
  }

  if (governed.decision?.rationale?.length) {
    lines.push("**Decision rationale:**");
    governed.decision.rationale.forEach((reason) => lines.push(`- ${reason}`));
  }

  if (governed.evidenceRefs?.length) {
    lines.push("**Evidence references:**");
    governed.evidenceRefs.forEach((ref) => lines.push(`- ${ref}`));
  }

  return lines.join("\n");
}

function buildActionRequest(
  proposal: GovernedActionProposal,
  governed: GovernedThreadMetadata
): ActionRequest {
  return {
    action: proposal.title,
    args: {
      proposal_id: proposal.id,
      proposal_kind: proposal.kind,
      auto_executable: proposal.autoExecutable ?? false,
      dry_run_required: proposal.dryRunRequired ?? false,
      blocked: proposal.blocked ?? false,
      approvals_required: proposal.approvalsRequired ?? [],
      payload: proposal.payload ?? {},
      primary_intent: governed.primaryIntent ?? null,
      policy_class: governed.decision?.policyClass ?? null,
      completeness_state: governed.completenessState ?? null,
      evidence_refs: governed.evidenceRefs ?? [],
    },
  };
}

export function proposalToHumanInterrupt(
  proposal: GovernedActionProposal,
  governed: GovernedThreadMetadata
): HumanInterrupt {
  return {
    action_request: buildActionRequest(proposal, governed),
    config: policyClassToInterruptConfig(
      governed.decision?.policyClass,
      proposal.blocked ?? false
    ),
    description: buildDescription(proposal, governed),
  };
}

export function governedThreadToHumanInterrupts(
  governed: GovernedThreadMetadata,
  fallbackAction = "Governed Request Review"
): HumanInterrupt[] {
  const proposals = governed.actionProposals ?? [];

  if (!proposals.length) {
    return [
      {
        action_request: {
          action: fallbackAction,
          args: {
            primary_intent: governed.primaryIntent ?? null,
            completeness_state: governed.completenessState ?? null,
            missing_fields: governed.missingFields ?? [],
            evidence_refs: governed.evidenceRefs ?? [],
          },
        },
        config: policyClassToInterruptConfig(governed.decision?.policyClass),
        description: buildDescription(
          {
            id: "fallback-review",
            kind: "reply_draft",
            title: fallbackAction,
            summary: "Governed request requires human review.",
          },
          governed
        ),
      },
    ];
  }

  return proposals.map((proposal) => proposalToHumanInterrupt(proposal, governed));
}
