# Final verification — 24 October 2026

Measured run: `eval_20261024T034259_b3c572f1`, scorer `2.0`.

The benchmark executed 17 queries in each of the ten modes: 170 cases,
92 strict passes, 78 failed quality checks, and zero execution errors.
Failed quality checks remain visible; the benchmark is not claimed to pass 100%.

## Academy feedback addressed

| Feedback | Implemented behavior | Verification |
| --- | --- | --- |
| Ten-mode leaderboard used fixed values | Every mode executes the same queries; latency is measured around the actual call | 170 recorded responses in the run artifact |
| Checks were too loose | Required answer facts, top-three evidence, paired emitted citations, numeric support and refusal checks are separate pass gates | Adversarial tests cover missing answers, wrong citations, substring matches, fourth-ranked evidence, false refusals and unsupported numbers |
| Scores exceeded what the evidence supported | No score floors or perfect defaults; refused cases excluded from unrelated metrics; errors retain denominator weight | Full per-case checks, failures and metric denominators saved |
| Dashboard should show actual results | Diagnostics fetches the versioned persisted run; legacy/missing results have no invented score | FastAPI TestClient response from `/api/evaluations/latest` exactly equals the saved JSON and Chroma payload; history and benchmark endpoints agree on run ID/score |
| Claimed 100% was unreliable | README now links to measured results and states evaluation limitations | The report includes all failed cases and no unconditional success labels |

## Actual results

The diagnostic score is a weighted average. The pass count requires every
applicable check to succeed and is the stricter measure.

| Mode | Strict passes | Diagnostic score |
| --- | --- | --- |
| Hybrid | 13/17 | 90.41% |
| Agentic | 13/17 | 87.76% |
| Graph | 12/17 | 87.79% |
| Self-RAG | 12/17 | 82.76% |
| Metadata | 11/17 | 74.88% |
| Contextual | 10/17 | 73.65% |
| SQL | 9/17 | 88.26% |
| CRAG | 4/17 | 87.60% |
| Reranking | 4/17 | 79.48% |
| Multimodal | 4/17 | 67.18% |

Hybrid evidence coverage@3 is 95.38%, citation coverage is 76.92%, answer
completeness is 85.90%, and strict pass rate is 76.47%. Refusal precision
and recall are both 100% on this small set. Numeric token support is 100%;
this does not establish semantic faithfulness or legal correctness.

Hybrid fails Q05 (processing fees), Q08 (auto/personal tenure comparison),
Q09 (multi-authority prepayment explanation), and Q11 (balloon-payment
conditions). The full report explains which checks failed in every mode.

## Validation executed

- Python test suite: `python -m pytest tests -q -p no:cacheprovider` — 43 passed.
- Mode smoke script: `python test_rags.py` — greeting, refusal routes and all ten modes completed.
- Full benchmark: `python evaluation/run_evaluation.py` — 170 evaluated cases; report and JSON saved; Chroma persistence succeeded.
- Frontend: `npm run build` — TypeScript and Vite production build passed.
- Frontend: `npm run lint` — exit code 0, with 12 React/hook warnings remaining.
- API consistency: TestClient verified exact equality between the persisted run, JSON artifact and Diagnostics latest-run endpoint; history and `/api/benchmarks` agreed.
- Source snapshot: every Python source hash in the run artifact matched the files used for verification.
- `git diff --check` — passed.

The first sandboxed test/build attempts hit local temporary-directory and
child-process permission restrictions. Approved reruns outside the sandbox
passed. No application correctness test failure was suppressed.

## Remaining limitations and deployment handoff

This is a development regression set, not a held-out benchmark. Expectations
come from the local corpus and need independent legal/source review. Numeric
support checks token presence; telemetry values and tool-derived numbers can
be conservatively rejected if they lack returned passage evidence. Claim
entailment, calculation provenance and broader adversarial coverage remain
future evaluation work. One sequential timing sample is not a production SLA.

The Diagnostics source and API data path were verified; no browser interaction
test was run. The existing React lint warnings remain. Deployment was not
performed. On a new deployment, run the benchmark against the deployment's
database before expecting populated Diagnostics results.

Generated Chroma database binaries are local runtime state and are excluded
from the source commit. The full portable evidence artifact is committed:
[run JSON](runs/eval_20261024T034259_b3c572f1.json).

See [the full measured report](EVALUATION_REPORT.md) for all ten mode results.
