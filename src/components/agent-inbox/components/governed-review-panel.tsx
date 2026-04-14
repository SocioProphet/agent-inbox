import React from "react";
import { GovernedThreadMetadata } from "../governed-types";

interface GovernedReviewPanelProps {
  governed?: GovernedThreadMetadata;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  );
}

export function GovernedReviewPanel({
  governed,
}: GovernedReviewPanelProps): React.ReactElement | null {
  if (!governed) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <Section title="Governed Request Summary">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <span className="font-medium text-gray-800">Primary intent:</span>{" "}
            {governed.primaryIntent || "—"}
          </div>
          <div>
            <span className="font-medium text-gray-800">Completeness:</span>{" "}
            {governed.completenessState || "—"}
          </div>
          <div>
            <span className="font-medium text-gray-800">Policy class:</span>{" "}
            {governed.decision?.policyClass || "—"}
          </div>
          <div>
            <span className="font-medium text-gray-800">Source:</span>{" "}
            {governed.source || "—"}
          </div>
        </div>
      </Section>

      {!!governed.missingFields?.length && (
        <Section title="Missing Fields">
          <ul className="list-disc space-y-1 pl-5">
            {governed.missingFields.map((field, index) => (
              <li key={`${field.field}-${index}`}>
                <span className="font-medium">{field.field}</span>
                {field.reason ? ` — ${field.reason}` : ""}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {!!governed.riskFlags?.length && (
        <Section title="Risk Flags">
          <ul className="list-disc space-y-1 pl-5">
            {governed.riskFlags.map((flag, index) => (
              <li key={`${flag}-${index}`}>{flag}</li>
            ))}
          </ul>
        </Section>
      )}

      {!!governed.suspicionFlags?.length && (
        <Section title="Suspicion Flags">
          <ul className="list-disc space-y-1 pl-5">
            {governed.suspicionFlags.map((flag, index) => (
              <li key={`${flag}-${index}`}>{flag}</li>
            ))}
          </ul>
        </Section>
      )}

      {!!governed.decision?.rationale?.length && (
        <Section title="Decision Rationale">
          <ul className="list-disc space-y-1 pl-5">
            {governed.decision.rationale.map((reason, index) => (
              <li key={`${reason}-${index}`}>{reason}</li>
            ))}
          </ul>
        </Section>
      )}

      {!!governed.evidenceRefs?.length && (
        <Section title="Evidence References">
          <ul className="list-disc space-y-1 pl-5">
            {governed.evidenceRefs.map((ref, index) => (
              <li key={`${ref}-${index}`} className="font-mono text-xs text-gray-700">
                {ref}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {!!governed.actionProposals?.length && (
        <Section title="Action Proposals">
          <div className="flex flex-col gap-3">
            {governed.actionProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="rounded-md border border-gray-200 bg-gray-50 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-gray-900">{proposal.title}</div>
                  <div className="text-xs uppercase tracking-wide text-gray-500">
                    {proposal.kind}
                  </div>
                </div>
                {proposal.summary && (
                  <p className="mt-2 text-sm text-gray-700">{proposal.summary}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                  <span>blocked: {proposal.blocked ? "yes" : "no"}</span>
                  <span>
                    auto-executable: {proposal.autoExecutable ? "yes" : "no"}
                  </span>
                  <span>
                    dry-run: {proposal.dryRunRequired ? "required" : "not required"}
                  </span>
                </div>
                {!!proposal.approvalsRequired?.length && (
                  <div className="mt-2 text-xs text-gray-700">
                    approvals: {proposal.approvalsRequired.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

export default GovernedReviewPanel;
