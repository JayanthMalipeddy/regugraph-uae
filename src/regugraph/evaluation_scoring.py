"""Versioned, deterministic benchmark checks. These are proxies, not legal verification.

Evidence coverage measures required facts in the first three returned passages.
Numeric support checks token presence, not semantic entailment of arbitrary prose.
"""
import re
from decimal import Decimal

SCORER_VERSION = "2.0"
CHUNK_KEYS = ("retrieved_chunks", "ranked_chunks", "matched_chunks",
              "top_reranked_chunks", "top_contextual_chunks", "vector_chunks", "narrative_chunks")


def normalize(text):
    text = str(text).lower().replace("\\%", "%")
    text = re.sub(r"[*_`#]", "", text)
    text = re.sub(r"(?<=\d),(?=\d{3}\b)", "", text)
    text = re.sub(r"\b(\d+)\.0+\b", r"\1", text)
    text = re.sub(r"\bno\.?\s+(?=\d)", "", text)
    text = re.sub(r"\b(\d+)\s+percent\b", r"\1%", text)
    text = re.sub(r"\((\d+%?)\)", r"\1", text)
    return re.sub(r"\s+", " ", text).strip()


def contains(text, term):
    """Whole phrase matching; 1% must not match 11%, Article 2 not Article 20."""
    term = normalize(term)
    return bool(term and re.search(r"(?<![\w.])" + re.escape(term) + r"(?!\w|\.\d)", normalize(text)))


def matches_group(text, group):
    return any(contains(text, term) for term in (group if isinstance(group, list) else [group]))


def chunks_from_result(result):
    for key in CHUNK_KEYS:
        # An explicitly empty canonical field must stay empty.
        if key in result and isinstance(result[key], list):
            return [dict(c, content=c.get("content", c.get("contextualized_content", "")))
                    for c in result[key] if isinstance(c, dict)]
    return []


def authority_matches(text, authority):
    return contains(text, authority["instrument"]) and contains(text, authority["article"])


def emitted_authority_matches(text, authority):
    """Do not borrow an article from the next instrument on the same line."""
    text = normalize(text)
    sections = re.split(r"(?=\b(?:circular|notice)\s+\d+/\d+)", text)
    return any(authority_matches(section, authority) for section in sections)


def numeric_tokens(text):
    """Exclude citation identifiers/list numbering; preserve amount and unit boundaries."""
    text = re.sub(r"(?im)^\s*(?:\d+\.)+\s+", "", str(text))
    text = normalize(text)
    text = re.sub(r"\b(?:circular|notice)(?:\s+no\.?)?\s+\d+/\d+", "", text)
    text = re.sub(r"\b(?:article|section|art)\s+\d+(?:\.\d+)*", "", text)
    return {str(Decimal(m.group(1)).normalize()) + (m.group(2) or "")
            for m in re.finditer(r"(?<![\w.])(\d+(?:\.\d+)?)(%?)(?![\w.])", text)}


def validate_suite(queries):
    if not isinstance(queries, list) or not queries:
        raise ValueError("Benchmark must contain at least one case")
    seen = set()
    for q in queries:
        if not q.get("id") or q["id"] in seen or not q.get("query", "").strip():
            raise ValueError("Each case requires a unique id and nonempty query")
        seen.add(q["id"])
        if not isinstance(q.get("is_refusal_expected"), bool):
            raise ValueError(f"{q['id']}: is_refusal_expected must be a boolean")
        if q["is_refusal_expected"]:
            if not q.get("expected_refusal_category"):
                raise ValueError(f"{q['id']}: missing expected refusal category")
        else:
            if not q.get("expected_answer_contains") or not q.get("expected_citations"):
                raise ValueError(f"{q['id']}: answer and citation requirements are mandatory")
            for authority in q["expected_citations"]:
                if not all(authority.get(k) for k in ("instrument", "article", "evidence_terms")):
                    raise ValueError(f"{q['id']}: incomplete evidence authority")
        for pattern in q.get("answer_claim_patterns", []) + q.get("forbidden_answer_patterns", []):
            re.compile(pattern)


def evaluate_single_inquiry(res, q_spec):
    expected_refusal = q_spec["is_refusal_expected"]
    refused = res.get("refusal_triggered") is True
    answer = res.get("answer", "") or ""
    chunks = chunks_from_result(res)
    failures = []
    error = res.get("error")
    missing_answer, evidence_checks, citation_checks = [], [], []
    unsupported = []
    evidence_score = citation_score = answer_score = numeric_score = None
    if error:
        failures.append(f"Execution error: {error}")

    if expected_refusal:
        explicit = bool(re.search(r"\b(?:cannot|can't|unable|refrain|outside|not found|out of scope|exclusively|do not|does not)\b", answer, re.I))
        refusal_pass = (refused and explicit and
                        res.get("refusal_category") == q_spec["expected_refusal_category"] and not error)
        # A flag alone, an empty answer, or an unrelated failure cannot pass.
        if not refusal_pass:
            failures.append("Expected an explicit refusal with the correct category")
        score = 100.0 if refusal_pass else 0.0
    else:
        refusal_pass = not refused and not error
        if not refusal_pass:
            failures.append("In-scope query refused or execution failed")
        missing_answer = [g for g in q_spec["expected_answer_contains"] if not matches_group(answer, g)]
        claim_failures = [p for p in q_spec.get("answer_claim_patterns", [])
                          if not re.search(p, normalize(answer), re.I)]
        contradictions = [p for p in q_spec.get("forbidden_answer_patterns", [])
                          if re.search(p, normalize(answer), re.I)]
        answer_score = 100 * (len(q_spec["expected_answer_contains"]) - len(missing_answer)) / len(q_spec["expected_answer_contains"])
        if missing_answer or claim_failures or contradictions:
            failures.append("Missing or contradictory expected answer claims")
        if not answer.strip():
            failures.append("Empty answer")
        # Check each authority and its facts together, never across unrelated passages.
        for authority in q_spec["expected_citations"]:
            supporting = [c for c in chunks[:3] if authority_matches(
                c.get("circular_ref", "") + " " + c.get("article_header", ""), authority)]
            matched = [g for g in authority["evidence_terms"]
                       if any(matches_group(c["content"], g) for c in supporting)]
            evidence_checks.append({"authority": authority, "matched_terms": matched,
                                    "required_count": len(authority["evidence_terms"]),
                                    "supporting_chunk_ids": [c.get("chunk_id") for c in supporting]})
            # The authority must be emitted to the user, not merely present in retrieval.
            # Keep instrument/article paired in a citation field or the same answer line.
            emitted_units = [res.get("citation", "")] + answer.splitlines()
            cited = any(emitted_authority_matches(unit, authority) for unit in emitted_units)
            grounded = bool(supporting) and len(matched) == len(authority["evidence_terms"])
            citation_checks.append({"authority": authority, "emitted": cited, "supported": grounded,
                                    "passed": cited and grounded})
        evidence_score = 100 * sum(len(e["matched_terms"]) for e in evidence_checks) / sum(e["required_count"] for e in evidence_checks)
        citation_score = 100 * sum(c["passed"] for c in citation_checks) / len(citation_checks)
        if evidence_score != 100:
            failures.append("Required evidence absent from the top three passages under the expected authority")
        if citation_score != 100:
            failures.append("Required instrument/article citation not emitted with supporting evidence")
        numbers = numeric_tokens(answer)
        supported_numbers = numeric_tokens("\n".join(c["content"] for c in chunks))
        # Query inputs are not regulatory evidence. Derived arithmetic needs separate validation.
        unsupported = sorted(numbers - supported_numbers)
        numeric_score = 100 * (len(numbers) - len(unsupported)) / len(numbers) if numbers else None
        if unsupported:
            failures.append("Unsupported numeric tokens in answer")
        if error or refused or not answer.strip():
            evidence_score = citation_score = answer_score = 0.0
            numeric_score = 0.0
        # Composite is diagnostic only; passing requires every applicable check.
        components = [(evidence_score, .3), (citation_score, .3), (answer_score, .3)]
        if numeric_score is not None:
            components.append((numeric_score, .1))
        score = sum(v * w for v, w in components) / sum(w for _, w in components)

    return {
        "id": q_spec["id"], "category": q_spec.get("category", "unknown"), "query": q_spec["query"],
        "expected_citation": q_spec.get("expected_citation", ""), "actual_citation": res.get("citation", ""),
        "refusal_expected": expected_refusal, "refusal_actual": refused, "refusal_pass": refusal_pass,
        "retrieval_hit": None if expected_refusal else evidence_score == 100,
        "citation_match": None if expected_refusal else citation_score == 100,
        "evidence_recall": evidence_score, "citation_accuracy": citation_score,
        "answer_completeness": answer_score, "numeric_support": numeric_score,
        "faithfulness": numeric_score,  # Legacy API key; explicitly labelled as a proxy in UI/report.
        "score": round(score, 2), "status": "ERROR" if error else ("FAIL" if failures else "PASS"),
        "latency_ms": res.get("latency_ms"), "answer": answer, "answer_preview": answer[:130],
        "failure_reasons": failures, "missing_answer_terms": missing_answer,
        "unsupported_numbers": unsupported, "evidence_checks": evidence_checks,
        "citation_checks": citation_checks, "retrieved_chunks": chunks,
        "raw_response": res, "error": error,
    }


def aggregate_cases(cases):
    if not cases:
        raise ValueError("Cannot aggregate an empty benchmark")
    def mean(key):
        values = [c[key] for c in cases if c.get(key) is not None]
        return round(sum(values) / len(values), 2) if values else None
    tp = sum(c["refusal_expected"] and c["refusal_pass"] for c in cases)
    fp = sum(not c["refusal_expected"] and c["refusal_actual"] for c in cases)
    fn = sum(c["refusal_expected"] and not c["refusal_pass"] for c in cases)
    return {
        "overall_score": mean("score"), "recall_at_3": mean("evidence_recall"),
        "citation_accuracy": mean("citation_accuracy"), "answer_completeness": mean("answer_completeness"),
        "numeric_support": mean("numeric_support"), "rag_faithfulness": mean("numeric_support"),
        "refusal_precision": round(100 * tp / (tp + fp), 2) if tp + fp else None,
        "refusal_recall": round(100 * tp / (tp + fn), 2) if tp + fn else None,
        "refusal_confusion": {"true_positive": tp, "false_positive": fp, "false_negative": fn},
        "metric_denominators": {k: sum(c.get(k) is not None for c in cases) for k in
                                ("evidence_recall", "citation_accuracy", "answer_completeness", "numeric_support")},
        "avg_latency_ms": mean("latency_ms"), "passed_cases": sum(c["status"] == "PASS" for c in cases),
        "error_cases": sum(c["status"] == "ERROR" for c in cases), "total_cases": len(cases),
        "pass_rate": round(100 * sum(c["status"] == "PASS" for c in cases) / len(cases), 2),
    }
