# ReguGraph-UAE measured benchmark

Run: `eval_20261024T034259_b3c572f1` | 2026-10-24 03:42:59 UTC
Scorer: `2.0` | Status: `completed`

10 measured modes; 17 cases each. Strict primary pass rate: 76.47%. Metrics are automated proxies, not legal certification.

## Scope and limitations

This is a small development regression set against the checked-in corpus, not a held-out evaluation or verification of current UAE law. Numeric support is a token-presence proxy, not claim-level faithfulness. Passing does not establish that every sentence is entailed. SQL/graph facts and derived calculations without returned passage evidence are conservatively marked unsupported. Latency is one sequential run including initialization; it is not a production SLA.

## Measured modes

| Mode | Passed | Errors | Evidence coverage@3 | Citation coverage | Answer completeness | Numeric support proxy | Refusal precision | Refusal recall | Mean ms | Diagnostic score |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1. Hybrid Search RAG | 13/17 | 0 | 95.38% | 76.92% | 85.90% | 100.00% | 100.00% | 100.00% | 17.99 | 90.41% |
| 10. Agentic RAG | 13/17 | 0 | 83.85% | 76.92% | 85.90% | 100.00% | 100.00% | 100.00% | 43.58 | 87.76% |
| 6. Knowledge Graph + Vector RAG (GraphRAG) | 12/17 | 0 | 83.85% | 76.92% | 91.03% | 85.00% | 100.00% | 100.00% | 48.08 | 87.79% |
| 8. Self-RAG | 12/17 | 0 | 76.15% | 69.23% | 82.05% | 92.31% | 100.00% | 100.00% | 1.33 | 82.76% |
| 2. Metadata-Filtered RAG | 11/17 | 0 | 62.31% | 57.69% | 73.08% | 100.00% | 100.00% | 100.00% | 47.30 | 74.88% |
| 4. Contextual Chunking RAG | 10/17 | 0 | 76.15% | 53.85% | 57.69% | 100.00% | 100.00% | 100.00% | 0.69 | 73.65% |
| 5. SQL + Vector RAG | 9/17 | 0 | 83.85% | 76.92% | 94.87% | 79.57% | 100.00% | 100.00% | 52.33 | 88.26% |
| 7. Corrective RAG (CRAG) | 4/17 | 0 | 91.54% | 76.92% | 85.90% | 74.71% | 100.00% | 100.00% | 1.41 | 87.60% |
| 3. Reranking RAG | 4/17 | 0 | 85.38% | 61.54% | 79.49% | 52.37% | 100.00% | 100.00% | 7.04 | 79.48% |
| 9. Multimodal RAG | 4/17 | 0 | 83.85% | 0.00% | 91.03% | 46.14% | 100.00% | 100.00% | 1.40 | 67.18% |

## Scoring rules

- Evidence coverage@3: required fact groups found under the expected instrument/article in only the first three returned passages. This is not document Recall@3.
- Citation coverage: each required instrument/article pair must be emitted in the citation field or one answer line and supported by its required evidence. Multi-hop cases require every authority.
- Answer completeness: all expected fact groups are checked; declared claim patterns and contradictions are additional pass gates.
- Numeric support: normalized number tokens must occur in returned passage content; no minimum score and no automatic credit for answers without numbers.
- Refusal precision = TP/(TP+FP); recall = TP/(TP+FN). A refusal requires a flag, explanatory text, and the expected category. In-scope false refusals are failures.
- Refusal cases have N/A retrieval, citation, answer and numeric metrics and are excluded from those denominators.
- Passing requires every applicable check. The diagnostic score uses 30% evidence, 30% citation, 30% answer completeness and 10% numeric support (renormalized if N/A). A high average cannot override a failed gate.
- Execution errors stay in the denominator and are recorded per case. Missing metrics remain N/A.

## Cases: 1. Hybrid Search RAG

| Case | Status | Score | Reasons |
| --- | --- | --- | --- |
| Q01 | PASS | 100.00% | All applicable automated checks passed |
| Q02 | PASS | 100.00% | All applicable automated checks passed |
| Q03 | PASS | 100.00% | All applicable automated checks passed |
| Q04 | PASS | 100.00% | All applicable automated checks passed |
| Q05 | FAIL | 50.00% | Missing or contradictory expected answer claims; Required instrument/article citation not emitted with supporting evidence |
| Q06 | PASS | 100.00% | All applicable automated checks passed |
| Q07 | PASS | 100.00% | All applicable automated checks passed |
| Q08 | FAIL | 70.00% | Missing or contradictory expected answer claims; Required instrument/article citation not emitted with supporting evidence |
| Q09 | FAIL | 67.00% | Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q10 | PASS | 100.00% | All applicable automated checks passed |
| Q11 | FAIL | 50.00% | Missing or contradictory expected answer claims; Required instrument/article citation not emitted with supporting evidence |
| Q12 | PASS | 100.00% | All applicable automated checks passed |
| Q13 | PASS | 100.00% | All applicable automated checks passed |
| Q14 | PASS | 100.00% | All applicable automated checks passed |
| Q15 | PASS | 100.00% | All applicable automated checks passed |
| Q16 | PASS | 100.00% | All applicable automated checks passed |
| Q17 | PASS | 100.00% | All applicable automated checks passed |

Metric denominators: `{"evidence_recall": 13, "citation_accuracy": 13, "answer_completeness": 13, "numeric_support": 13}`

## Cases: 10. Agentic RAG

| Case | Status | Score | Reasons |
| --- | --- | --- | --- |
| Q01 | PASS | 100.00% | All applicable automated checks passed |
| Q02 | PASS | 100.00% | All applicable automated checks passed |
| Q03 | PASS | 100.00% | All applicable automated checks passed |
| Q04 | PASS | 100.00% | All applicable automated checks passed |
| Q05 | FAIL | 50.00% | Missing or contradictory expected answer claims; Required instrument/article citation not emitted with supporting evidence |
| Q06 | PASS | 100.00% | All applicable automated checks passed |
| Q07 | PASS | 100.00% | All applicable automated checks passed |
| Q08 | FAIL | 55.00% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q09 | FAIL | 67.00% | Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q10 | PASS | 100.00% | All applicable automated checks passed |
| Q11 | FAIL | 20.00% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q12 | PASS | 100.00% | All applicable automated checks passed |
| Q13 | PASS | 100.00% | All applicable automated checks passed |
| Q14 | PASS | 100.00% | All applicable automated checks passed |
| Q15 | PASS | 100.00% | All applicable automated checks passed |
| Q16 | PASS | 100.00% | All applicable automated checks passed |
| Q17 | PASS | 100.00% | All applicable automated checks passed |

Metric denominators: `{"evidence_recall": 13, "citation_accuracy": 13, "answer_completeness": 13, "numeric_support": 13}`

## Cases: 6. Knowledge Graph + Vector RAG (GraphRAG)

| Case | Status | Score | Reasons |
| --- | --- | --- | --- |
| Q01 | PASS | 100.00% | All applicable automated checks passed |
| Q02 | PASS | 100.00% | All applicable automated checks passed |
| Q03 | PASS | 100.00% | All applicable automated checks passed |
| Q04 | PASS | 100.00% | All applicable automated checks passed |
| Q05 | FAIL | 67.50% | Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q06 | PASS | 100.00% | All applicable automated checks passed |
| Q07 | PASS | 100.00% | All applicable automated checks passed |
| Q08 | FAIL | 52.50% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q09 | FAIL | 62.00% | Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q10 | PASS | 100.00% | All applicable automated checks passed |
| Q11 | FAIL | 18.00% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q12 | FAIL | 92.50% | Unsupported numeric tokens in answer |
| Q13 | PASS | 100.00% | All applicable automated checks passed |
| Q14 | PASS | 100.00% | All applicable automated checks passed |
| Q15 | PASS | 100.00% | All applicable automated checks passed |
| Q16 | PASS | 100.00% | All applicable automated checks passed |
| Q17 | PASS | 100.00% | All applicable automated checks passed |

Metric denominators: `{"evidence_recall": 13, "citation_accuracy": 13, "answer_completeness": 13, "numeric_support": 13}`

## Cases: 8. Self-RAG

| Case | Status | Score | Reasons |
| --- | --- | --- | --- |
| Q01 | PASS | 100.00% | All applicable automated checks passed |
| Q02 | PASS | 100.00% | All applicable automated checks passed |
| Q03 | PASS | 100.00% | All applicable automated checks passed |
| Q04 | PASS | 100.00% | All applicable automated checks passed |
| Q05 | FAIL | 50.00% | Missing or contradictory expected answer claims; Required instrument/article citation not emitted with supporting evidence |
| Q06 | PASS | 100.00% | All applicable automated checks passed |
| Q07 | PASS | 100.00% | All applicable automated checks passed |
| Q08 | FAIL | 55.00% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q09 | FAIL | 67.00% | Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q10 | PASS | 100.00% | All applicable automated checks passed |
| Q11 | FAIL | 20.00% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q12 | PASS | 100.00% | All applicable automated checks passed |
| Q13 | PASS | 100.00% | All applicable automated checks passed |
| Q14 | PASS | 100.00% | All applicable automated checks passed |
| Q15 | PASS | 100.00% | All applicable automated checks passed |
| Q16 | FAIL | 15.00% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q17 | PASS | 100.00% | All applicable automated checks passed |

Metric denominators: `{"evidence_recall": 13, "citation_accuracy": 13, "answer_completeness": 13, "numeric_support": 13}`

## Cases: 2. Metadata-Filtered RAG

| Case | Status | Score | Reasons |
| --- | --- | --- | --- |
| Q01 | PASS | 100.00% | All applicable automated checks passed |
| Q02 | FAIL | 25.00% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q03 | PASS | 100.00% | All applicable automated checks passed |
| Q04 | PASS | 100.00% | All applicable automated checks passed |
| Q05 | PASS | 100.00% | All applicable automated checks passed |
| Q06 | PASS | 100.00% | All applicable automated checks passed |
| Q07 | PASS | 100.00% | All applicable automated checks passed |
| Q08 | FAIL | 55.00% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q09 | FAIL | 58.00% | Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q10 | FAIL | 10.00% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q11 | FAIL | 0.00% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q12 | PASS | 100.00% | All applicable automated checks passed |
| Q13 | PASS | 100.00% | All applicable automated checks passed |
| Q14 | PASS | 100.00% | All applicable automated checks passed |
| Q15 | PASS | 100.00% | All applicable automated checks passed |
| Q16 | FAIL | 25.00% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q17 | PASS | 100.00% | All applicable automated checks passed |

Metric denominators: `{"evidence_recall": 13, "citation_accuracy": 13, "answer_completeness": 13, "numeric_support": 12}`

## Cases: 4. Contextual Chunking RAG

| Case | Status | Score | Reasons |
| --- | --- | --- | --- |
| Q01 | PASS | 100.00% | All applicable automated checks passed |
| Q02 | PASS | 100.00% | All applicable automated checks passed |
| Q03 | PASS | 100.00% | All applicable automated checks passed |
| Q04 | PASS | 100.00% | All applicable automated checks passed |
| Q05 | FAIL | 10.00% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q06 | FAIL | 40.00% | Missing or contradictory expected answer claims; Required instrument/article citation not emitted with supporting evidence |
| Q07 | PASS | 100.00% | All applicable automated checks passed |
| Q08 | FAIL | 55.00% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q09 | FAIL | 67.00% | Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q10 | PASS | 100.00% | All applicable automated checks passed |
| Q11 | FAIL | 0.00% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q12 | FAIL | 40.00% | Missing or contradictory expected answer claims; Required instrument/article citation not emitted with supporting evidence |
| Q13 | PASS | 100.00% | All applicable automated checks passed |
| Q14 | PASS | 100.00% | All applicable automated checks passed |
| Q15 | PASS | 100.00% | All applicable automated checks passed |
| Q16 | FAIL | 40.00% | Missing or contradictory expected answer claims; Required instrument/article citation not emitted with supporting evidence |
| Q17 | PASS | 100.00% | All applicable automated checks passed |

Metric denominators: `{"evidence_recall": 13, "citation_accuracy": 13, "answer_completeness": 13, "numeric_support": 12}`

## Cases: 5. SQL + Vector RAG

| Case | Status | Score | Reasons |
| --- | --- | --- | --- |
| Q01 | PASS | 100.00% | All applicable automated checks passed |
| Q02 | PASS | 100.00% | All applicable automated checks passed |
| Q03 | FAIL | 98.00% | Unsupported numeric tokens in answer |
| Q04 | FAIL | 96.67% | Unsupported numeric tokens in answer |
| Q05 | FAIL | 67.78% | Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q06 | FAIL | 96.67% | Unsupported numeric tokens in answer |
| Q07 | PASS | 100.00% | All applicable automated checks passed |
| Q08 | FAIL | 66.00% | Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q09 | FAIL | 67.00% | Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence |
| Q10 | PASS | 100.00% | All applicable automated checks passed |
| Q11 | FAIL | 16.67% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q12 | FAIL | 91.67% | Unsupported numeric tokens in answer |
| Q13 | PASS | 100.00% | All applicable automated checks passed |
| Q14 | PASS | 100.00% | All applicable automated checks passed |
| Q15 | PASS | 100.00% | All applicable automated checks passed |
| Q16 | PASS | 100.00% | All applicable automated checks passed |
| Q17 | PASS | 100.00% | All applicable automated checks passed |

Metric denominators: `{"evidence_recall": 13, "citation_accuracy": 13, "answer_completeness": 13, "numeric_support": 13}`

## Cases: 7. Corrective RAG (CRAG)

| Case | Status | Score | Reasons |
| --- | --- | --- | --- |
| Q01 | FAIL | 96.67% | Unsupported numeric tokens in answer |
| Q02 | FAIL | 97.50% | Unsupported numeric tokens in answer |
| Q03 | FAIL | 97.50% | Unsupported numeric tokens in answer |
| Q04 | FAIL | 98.00% | Unsupported numeric tokens in answer |
| Q05 | FAIL | 48.00% | Missing or contradictory expected answer claims; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q06 | FAIL | 98.00% | Unsupported numeric tokens in answer |
| Q07 | FAIL | 99.29% | Unsupported numeric tokens in answer |
| Q08 | FAIL | 52.50% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q09 | FAIL | 63.67% | Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q10 | FAIL | 97.50% | Unsupported numeric tokens in answer |
| Q11 | FAIL | 48.00% | Missing or contradictory expected answer claims; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q12 | FAIL | 95.00% | Unsupported numeric tokens in answer |
| Q13 | PASS | 100.00% | All applicable automated checks passed |
| Q14 | PASS | 100.00% | All applicable automated checks passed |
| Q15 | PASS | 100.00% | All applicable automated checks passed |
| Q16 | FAIL | 97.50% | Unsupported numeric tokens in answer |
| Q17 | PASS | 100.00% | All applicable automated checks passed |

Metric denominators: `{"evidence_recall": 13, "citation_accuracy": 13, "answer_completeness": 13, "numeric_support": 13}`

## Cases: 3. Reranking RAG

| Case | Status | Score | Reasons |
| --- | --- | --- | --- |
| Q01 | FAIL | 67.86% | Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q02 | FAIL | 94.29% | Unsupported numeric tokens in answer |
| Q03 | FAIL | 94.29% | Unsupported numeric tokens in answer |
| Q04 | FAIL | 95.00% | Unsupported numeric tokens in answer |
| Q05 | FAIL | 4.29% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q06 | FAIL | 95.00% | Unsupported numeric tokens in answer |
| Q07 | FAIL | 97.65% | Unsupported numeric tokens in answer |
| Q08 | FAIL | 19.29% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q09 | FAIL | 55.86% | Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q10 | FAIL | 94.29% | Unsupported numeric tokens in answer |
| Q11 | FAIL | 45.00% | Missing or contradictory expected answer claims; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q12 | FAIL | 94.00% | Unsupported numeric tokens in answer |
| Q13 | PASS | 100.00% | All applicable automated checks passed |
| Q14 | PASS | 100.00% | All applicable automated checks passed |
| Q15 | PASS | 100.00% | All applicable automated checks passed |
| Q16 | FAIL | 94.29% | Unsupported numeric tokens in answer |
| Q17 | PASS | 100.00% | All applicable automated checks passed |

Metric denominators: `{"evidence_recall": 13, "citation_accuracy": 13, "answer_completeness": 13, "numeric_support": 13}`

## Cases: 9. Multimodal RAG

| Case | Status | Score | Reasons |
| --- | --- | --- | --- |
| Q01 | FAIL | 65.00% | Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q02 | FAIL | 62.73% | Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q03 | FAIL | 64.29% | Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q04 | FAIL | 65.56% | Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q05 | FAIL | 67.50% | Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q06 | FAIL | 65.00% | Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q07 | FAIL | 67.65% | Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q08 | FAIL | 34.29% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q09 | FAIL | 45.00% | Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q10 | FAIL | 64.55% | Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q11 | FAIL | 15.71% | Missing or contradictory expected answer claims; Required evidence absent from the top three passages under the expected authority; Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q12 | FAIL | 62.00% | Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q13 | PASS | 100.00% | All applicable automated checks passed |
| Q14 | PASS | 100.00% | All applicable automated checks passed |
| Q15 | PASS | 100.00% | All applicable automated checks passed |
| Q16 | FAIL | 62.73% | Required instrument/article citation not emitted with supporting evidence; Unsupported numeric tokens in answer |
| Q17 | PASS | 100.00% | All applicable automated checks passed |

Metric denominators: `{"evidence_recall": 13, "citation_accuracy": 13, "answer_completeness": 13, "numeric_support": 13}`

## Reproducibility

Dataset SHA-256: `fa0f0bbf3665534e2cffb7f5ae8676d87206f66a5f949240badefb9b888f21d4`
Python: 3.12.14; revision: `025b4e380ac730ff59b390adccc0f06baaed5172`.
Source/corpus hashes, rubric snapshot, full answers, retrieval passages, per-check diagnostics and raw responses are in [`runs/eval_20261024T034259_b3c572f1.json`](runs/eval_20261024T034259_b3c572f1.json).
