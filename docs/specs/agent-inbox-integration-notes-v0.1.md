# Agent Inbox Integration Notes v0.1

## What we found in `SocioProphet/agent-inbox`

The existing repository is a **Next.js LangGraph human-interrupt inbox UI**, not an email-ingestion service.

Key existing files:

- `README.md` — describes the repo as an Agent Inbox for LangGraph interrupts.
- `package.json` — Next.js + LangGraph UI application.
- `src/app/page.tsx` — mounts the `AgentInbox` component.
- `src/components/agent-inbox/index.tsx` — top-level inbox list/thread router.
- `src/components/agent-inbox/types.ts` — defines `HumanInterrupt`, `HumanResponse`, `ThreadData`, `AgentInbox`, and a thin `Email` shape.
- `src/components/agent-inbox/contexts/ThreadContext.tsx` — fetches threads from LangGraph deployments and sends human responses.
- `src/components/agent-inbox/contexts/utils.ts` — parses interrupt payloads and normalizes malformed interrupt shapes.

## What this means

We should **not** create a separate inbox UI repo for the governed email/request work.

Instead:

1. Keep this repository as the human review surface.
2. Add a governed upstream intake pipeline that converts email/request events into:
   - normalized request frames,
   - policy and authority decisions,
   - action bundles,
   - `HumanInterrupt` objects for review.
3. Extend the current thread values and side panels so the UI can display:
   - evidence references,
   - policy class,
   - missing fields,
   - approval requirements,
   - structured action proposals.

## Concrete merge seam

The merge seam is:

- **Upstream producer**: governed request pipeline
- **Existing UI contract**: `HumanInterrupt`, `HumanResponse`, `ThreadData`
- **Adapter layer**: `ActionBundle -> HumanInterrupt[]`

This lets existing LangGraph interrupt flows continue to work, while email/request intake becomes another first-class source of threads.

## First implementation targets

1. Extend `src/components/agent-inbox/types.ts` with governed refs and policy metadata.
2. Add an adapter in `src/components/agent-inbox/contexts/` that maps request/action state into `HumanInterrupt` objects.
3. Keep `ThreadContext.tsx` as the orchestration surface, but enrich thread payloads.
4. Ship outbound reply + internal task creation first.
5. Defer privileged external mutations until policy hardening is complete.

## Added specs

- `docs/specs/agent-inbox-schema-v0.1.yaml`
- `docs/specs/agent-inbox-pipeline-v0.1.yaml`

These two documents are the initial merge contract between the current UI repo and the broader governed inbox architecture.
