"""Adversarial scoring and orchestration tests; no model or database required."""
from copy import deepcopy
import json
from pathlib import Path

import pytest

from regugraph import eval_store
from regugraph.evaluation_scoring import (
    aggregate_cases, contains, evaluate_single_inquiry, numeric_tokens, validate_suite,
)


@pytest.fixture
def spec():
    return {"id": "T1", "query": "What is the fee cap?", "is_refusal_expected": False,
            "expected_answer_contains": ["1%", "AED 10,000", "whichever is lower"],
            "expected_citations": [{"instrument": "Circular No. 8/2020", "article": "Section 4.3",
                                    "evidence_terms": ["1%", "AED 10,000"]}]}


@pytest.fixture
def good():
    return {"answer": "The cap is 1% or AED 10,000, whichever is lower.",
            "citation": "Circular 8/2020 Section 4.3", "refusal_triggered": False,
            "retrieved_chunks": [{"chunk_id": "one", "circular_ref": "Circular No. 8/2020",
                                  "article_header": "Section 4.3", "content": "1.0% or AED 10,000, whichever is lower."}]}


def test_complete_supported_answer_passes(spec, good):
    assert evaluate_single_inquiry(good, spec)["status"] == "PASS"


@pytest.mark.parametrize("text,term", [("11%", "1%"), ("Article 20", "Article 2"),
                                     ("Article 2.1", "Article 2"), ("AED 1500", "150")])
def test_substrings_do_not_match(text, term):
    assert not contains(text, term)


def test_formatting_variations():
    assert contains("**1.0%**", "1%")
    assert contains("AED 10,000.", "AED 10000")
    assert contains("five (5) business days", "5 business days")
    assert numeric_tokens("AED 1,500,000 and 1.0%") == {"1.5E+6", "1%"}


def test_fourth_chunk_cannot_help_evidence_at_three(spec, good):
    irrelevant = {"content": "irrelevant", "circular_ref": "Other", "article_header": "Other"}
    good["retrieved_chunks"] = [irrelevant] * 3 + good["retrieved_chunks"]
    case = evaluate_single_inquiry(good, spec)
    assert case["evidence_recall"] == 0
    assert case["status"] == "FAIL"


def test_retrieved_citation_is_not_emitted_citation(spec, good):
    good["citation"] = ""
    assert evaluate_single_inquiry(good, spec)["citation_accuracy"] == 0


def test_wrong_instrument_cannot_borrow_article(spec, good):
    good["citation"] = "Circular 8/2020 Section 4.2; Notice 2011/23 Section 4.3"
    assert evaluate_single_inquiry(good, spec)["citation_accuracy"] == 0


def test_wrong_authority_cannot_supply_evidence(spec, good):
    good["retrieved_chunks"][0]["circular_ref"] = "Circular 31/2013"
    assert evaluate_single_inquiry(good, spec)["evidence_recall"] == 0


def test_missing_mandatory_answer_fails_even_with_high_score(spec, good):
    good["answer"] = "The cap is 1% or AED 10000."
    case = evaluate_single_inquiry(good, spec)
    assert case["score"] >= 80
    assert case["status"] == "FAIL"


@pytest.mark.parametrize("answer", ["", "This is an excellent bank.", "The fee is 99%."])
def test_empty_irrelevant_or_unsupported_answer_cannot_pass(spec, good, answer):
    good["answer"] = answer
    case = evaluate_single_inquiry(good, spec)
    assert case["status"] == "FAIL"
    assert case["numeric_support"] in (0, None)


def test_no_minimum_support_floor(spec, good):
    good["answer"] = "99%"
    assert evaluate_single_inquiry(good, spec)["numeric_support"] == 0


def test_multi_hop_requires_both_authorities(spec, good):
    spec["expected_citations"].append({"instrument": "Notice 2011/23", "article": "Article 5", "evidence_terms": ["60 months"]})
    case = evaluate_single_inquiry(good, spec)
    assert case["citation_accuracy"] == 50
    assert case["status"] == "FAIL"


def refusal_spec():
    return {"id": "R", "query": "What does FCA require?", "is_refusal_expected": True,
            "expected_refusal_category": "foreign_jurisdiction"}


def refused():
    return {"answer": "I cannot advise on foreign law.", "refusal_triggered": True,
            "refusal_category": "foreign_jurisdiction"}


def test_refusals_excluded_from_evidence_denominator(spec, good):
    good["retrieved_chunks"] = []
    c = evaluate_single_inquiry(refused(), refusal_spec())
    assert c["evidence_recall"] is None and c["faithfulness"] is None
    metrics = aggregate_cases([evaluate_single_inquiry(good, spec), c])
    assert metrics["recall_at_3"] == 0
    assert metrics["metric_denominators"]["evidence_recall"] == 1


def test_refusal_precision_counts_false_refusals(spec):
    metrics = aggregate_cases([evaluate_single_inquiry(refused(), refusal_spec()), evaluate_single_inquiry(refused(), spec)])
    assert metrics["refusal_precision"] == 50
    assert metrics["refusal_recall"] == 100


def test_absent_refusals_are_not_perfect(spec, good):
    metrics = aggregate_cases([evaluate_single_inquiry(good, spec), evaluate_single_inquiry(good, refusal_spec())])
    assert metrics["refusal_precision"] is None
    assert metrics["refusal_recall"] == 0


@pytest.mark.parametrize("change", [{"answer": ""}, {"refusal_category": "off_topic"}, {"error": "database down"}])
def test_refusal_flag_alone_is_not_success(change):
    response = refused() | change
    assert evaluate_single_inquiry(response, refusal_spec())["status"] != "PASS"


def test_claim_patterns_reject_swapped_values(spec, good):
    spec["expected_answer_contains"] = ["30%", "50%"]
    spec["answer_claim_patterns"] = [r"pensioner[^.]{0,30}30%"]
    good["answer"] = "The pensioner cap is 50%. Salaried cap is 30%."
    assert evaluate_single_inquiry(good, spec)["status"] == "FAIL"


@pytest.mark.parametrize("queries", [[], [{"id": "bad"}]])
def test_invalid_suite_rejected(queries):
    with pytest.raises(ValueError):
        validate_suite(queries)


def test_all_ten_modes_execute_every_query_and_errors_stay(tmp_path, spec, good):
    registry = {f"mode{i}": {"name": f"Mode {i}"} for i in range(10)}
    queries = [spec, dict(spec, id="T2", query="Another question")]
    path = tmp_path / "queries.json"
    path.write_text(json.dumps(queries), encoding="utf-8")
    calls = []
    def execute(query, mode):
        calls.append((query, mode))
        if mode == "mode3":
            raise RuntimeError("retrieval unavailable")
        return deepcopy(good)
    run = eval_store.run_benchmark_suite(queries_file=path, registry=registry, executor=execute)
    assert len(calls) == 20 and len(set(calls)) == 20
    assert len(run["mode_evaluations"]) == 10
    failed = next(m for m in run["mode_evaluations"] if m["id"] == "mode3")
    assert failed["error_cases"] == failed["total_cases"] == 2
    assert failed["overall_score"] == 0
    assert run["status"] == "completed_with_errors"
    assert all(c["latency_ms"] >= 0 for m in run["mode_evaluations"] for c in m["cases"])


def test_unknown_mode_does_not_silently_fallback(spec):
    with pytest.raises(ValueError, match="Unknown RAG mode"):
        eval_store.evaluate_mode_suite("typo", [spec], registry={})


def test_legacy_runs_not_presented_as_current(monkeypatch):
    class Collection:
        def get(self, **kwargs):
            return {"metadatas": [{"overall_score": 100}]}
    class Client:
        def get_or_create_collection(self, **kwargs):
            return Collection()
    monkeypatch.setattr(eval_store, "get_chroma_client", Client)
    result = eval_store.get_latest_evaluation_run()
    assert result["status"] == "not_evaluated"
    assert result["overall_score"] is None
    assert result["mode_evaluations"] == []


def test_json_artifact_roundtrip_and_no_success_labels(tmp_path, monkeypatch, spec, good):
    path = tmp_path / "queries.json"
    path.write_text(json.dumps([spec]), encoding="utf-8")
    good["answer"] = ""
    run = eval_store.run_benchmark_suite(queries_file=path, registry={"hybrid": {}}, executor=lambda *a, **k: good)
    monkeypatch.setattr(eval_store, "EVALUATION_DIR", tmp_path)
    eval_store.save_evaluation_run(run, persist_chroma=False)
    restored = json.loads((tmp_path / "runs" / f"{run['run_id']}.json").read_text(encoding="utf-8"))
    assert restored == run
    report = (tmp_path / "EVALUATION_REPORT.md").read_text(encoding="utf-8")
    assert "FLAWLESS" not in report and "OPTIMAL" not in report
    assert "FAIL" in report


def test_real_benchmark_rubric_is_valid():
    path = Path(__file__).resolve().parents[1] / "evaluation" / "test_queries.json"
    validate_suite(json.loads(path.read_text(encoding="utf-8")))
