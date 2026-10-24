"""Measured RAG benchmarks, auditable JSON artifacts, and optional Chroma history."""
import hashlib
import json
import platform
import subprocess
import time
from datetime import datetime, timezone
from uuid import uuid4

from regugraph.config import CHROMA_DIR, CHROMA_HOST, CHROMA_PORT, EVALUATION_DIR, PROJECT_ROOT, REGULATIONS_DIR
from regugraph.evaluation_scoring import (
    SCORER_VERSION, aggregate_cases, evaluate_single_inquiry, validate_suite,
)

EVAL_COLLECTION_NAME = "cbuae_eval_runs"


def get_chroma_client():
    import chromadb
    try:
        client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
        client.heartbeat()
        return client
    except Exception:
        return chromadb.PersistentClient(path=str(CHROMA_DIR))


def execute_unified_rag(query, mode):
    from regugraph.rag.unified_rag import execute_unified_rag as execute
    return execute(query, mode=mode)


def mode_registry():
    from regugraph.rag.unified_rag import RAG_MODES_REGISTRY
    return RAG_MODES_REGISTRY


def evaluate_mode_suite(mode_id, test_queries, *, executor=None, registry=None, progress=None):
    validate_suite(test_queries)
    registry = mode_registry() if registry is None else registry
    if mode_id not in registry:
        raise ValueError(f"Unknown RAG mode: {mode_id}")
    executor = execute_unified_rag if executor is None else executor
    cases = []
    for q in test_queries:
        started = time.perf_counter()
        try:
            response = executor(q["query"], mode=mode_id)
            if not isinstance(response, dict):
                raise TypeError("RAG response must be a dictionary")
            response = dict(response)
        except Exception as exc:
            response = {"answer": "", "error": f"{type(exc).__name__}: {exc}"}
        response["latency_ms"] = round((time.perf_counter() - started) * 1000, 3)
        case = evaluate_single_inquiry(response, q)
        cases.append(case)
        if progress:
            progress(mode_id, case)
    info = registry[mode_id]
    metrics = aggregate_cases(cases)
    return {
        "id": mode_id, "name": info.get("name", mode_id), "concept": info.get("summary", ""),
        "tech_stack": info.get("tech_stack", ""), "badge": f"{metrics['passed_cases']}/{len(cases)} passed",
        "key_strength": "See measured case outcomes; capabilities are not independently certified.",
        "ideal_use_case": "Inspect case evidence before choosing a mode.",
        "status": "ERROR" if metrics["error_cases"] else ("PASS" if metrics["passed_cases"] == len(cases) else "FAIL"),
        **metrics, "cases": cases,
    }


def _sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run_benchmark_suite(*, queries_file=None, modes=None, executor=None, registry=None, progress=None):
    queries_file = queries_file or EVALUATION_DIR / "test_queries.json"
    queries = json.loads(queries_file.read_text(encoding="utf-8"))
    validate_suite(queries)
    registry = mode_registry() if registry is None else registry
    selected = list(registry) if modes is None else list(modes)
    if not selected or len(set(selected)) != len(selected) or set(selected) - set(registry):
        raise ValueError("Select at least one distinct registered mode")
    started = time.perf_counter()
    evaluations = [evaluate_mode_suite(m, queries, executor=executor, registry=registry, progress=progress) for m in selected]
    evaluations.sort(key=lambda m: (-m["pass_rate"], -m["overall_score"], m["avg_latency_ms"]))
    primary = next((m for m in evaluations if m["id"] == "hybrid"), evaluations[0])
    now = datetime.now(timezone.utc)
    try:
        revision = subprocess.run(["git", "rev-parse", "HEAD"], cwd=PROJECT_ROOT, capture_output=True, text=True, check=True).stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        revision = None
    source_files = sorted((PROJECT_ROOT / "src" / "regugraph").rglob("*.py"))
    return {
        "run_id": f"eval_{now.strftime('%Y%m%dT%H%M%S')}_{uuid4().hex[:8]}",
        "timestamp": now.strftime("%Y-%m-%d %H:%M:%S UTC"), "iso_timestamp": now.isoformat(),
        "scorer_version": SCORER_VERSION, "status": "completed_with_errors" if any(m["error_cases"] for m in evaluations) else "completed",
        "primary_mode": primary["id"], **aggregate_cases(primary["cases"]),
        "suite_duration_ms": round((time.perf_counter() - started) * 1000, 3),
        "summary_text": f"{len(evaluations)} measured modes; {len(queries)} cases each. Strict primary pass rate: {primary['pass_rate']}%. Metrics are automated proxies, not legal certification.",
        "mode_evaluations": evaluations, "cases": primary["cases"],
        "provenance": {
            "dataset_sha256": _sha256(queries_file), "dataset": queries_file.name, "test_queries": queries,
            "corpus_sha256": {p.name: _sha256(p) for p in sorted(REGULATIONS_DIR.glob('*.md'))},
            "source_sha256": {p.relative_to(PROJECT_ROOT).as_posix(): _sha256(p) for p in source_files},
            "git_revision": revision, "python": platform.python_version(), "platform": platform.platform(),
            "mode_order": selected, "repetitions": 1, "warmup": "none; includes initialization on first use",
            "runtime_note": "Local configured pipelines; Ollama may fall back to templates and hash embeddings. Do not interpret these timings as neural inference benchmarks.",
            "gold_status": "Local corpus regression expectations, not independently reviewed current legal ground truth",
        },
    }


def format_metric(value, suffix="%"):
    return "N/A" if value is None else f"{value:.2f}{suffix}"


def render_report(data):
    lines = ["# ReguGraph-UAE measured benchmark", "", f"Run: `{data['run_id']}` | {data['timestamp']}",
             f"Scorer: `{data['scorer_version']}` | Status: `{data['status']}`", "", data["summary_text"], "",
             "## Scope and limitations", "",
             "This is a small development regression set against the checked-in corpus, not a held-out evaluation or verification of current UAE law. "
             "Numeric support is a token-presence proxy, not claim-level faithfulness. Passing does not establish that every sentence is entailed. "
             "SQL/graph facts and derived calculations without returned passage evidence are conservatively marked unsupported. "
             "Latency is one sequential run including initialization; it is not a production SLA.", "",
             "## Measured modes", "",
             "| Mode | Passed | Errors | Evidence coverage@3 | Citation coverage | Answer completeness | Numeric support proxy | Refusal precision | Refusal recall | Mean ms | Diagnostic score |",
             "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |"]
    for m in data["mode_evaluations"]:
        values = [format_metric(m[k]) for k in ("recall_at_3", "citation_accuracy", "answer_completeness", "numeric_support", "refusal_precision", "refusal_recall")]
        lines.append(f"| {m['name']} | {m['passed_cases']}/{m['total_cases']} | {m['error_cases']} | " + " | ".join(values) + f" | {format_metric(m['avg_latency_ms'], '')} | {format_metric(m['overall_score'])} |")
    lines += ["", "## Scoring rules", "",
              "- Evidence coverage@3: required fact groups found under the expected instrument/article in only the first three returned passages. This is not document Recall@3.",
              "- Citation coverage: each required instrument/article pair must be emitted in the citation field or one answer line and supported by its required evidence. Multi-hop cases require every authority.",
              "- Answer completeness: all expected fact groups are checked; declared claim patterns and contradictions are additional pass gates.",
              "- Numeric support: normalized number tokens must occur in returned passage content; no minimum score and no automatic credit for answers without numbers.",
              "- Refusal precision = TP/(TP+FP); recall = TP/(TP+FN). A refusal requires a flag, explanatory text, and the expected category. In-scope false refusals are failures.",
              "- Refusal cases have N/A retrieval, citation, answer and numeric metrics and are excluded from those denominators.",
              "- Passing requires every applicable check. The diagnostic score uses 30% evidence, 30% citation, 30% answer completeness and 10% numeric support (renormalized if N/A). A high average cannot override a failed gate.",
              "- Execution errors stay in the denominator and are recorded per case. Missing metrics remain N/A.", ""]
    for m in data["mode_evaluations"]:
        lines += [f"## Cases: {m['name']}", "", "| Case | Status | Score | Reasons |", "| --- | --- | --- | --- |"]
        for c in m["cases"]:
            reasons = "; ".join(c["failure_reasons"]).replace("|", "\\|").replace("\n", " ") or "All applicable automated checks passed"
            lines.append(f"| {c['id']} | {c['status']} | {format_metric(c['score'])} | {reasons} |")
        lines += ["", f"Metric denominators: `{json.dumps(m['metric_denominators'])}`", ""]
    lines += ["## Reproducibility", "", f"Dataset SHA-256: `{data['provenance']['dataset_sha256']}`",
              f"Python: {data['provenance']['python']}; revision: `{data['provenance']['git_revision']}`.",
              "Source/corpus hashes, rubric snapshot, full answers, retrieval passages, per-check diagnostics and raw responses are in "
              f"[`runs/{data['run_id']}.json`](runs/{data['run_id']}.json).", ""]
    return "\n".join(lines)


def save_evaluation_run(eval_data, *, persist_chroma=True):
    """Always write reviewable artifacts; propagate database failure without deleting history."""
    runs = EVALUATION_DIR / "runs"
    runs.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(eval_data, indent=2, ensure_ascii=False, allow_nan=False)
    report = render_report(eval_data)
    (runs / f"{eval_data['run_id']}.json").write_text(payload, encoding="utf-8")
    (EVALUATION_DIR / "EVALUATION_REPORT.md").write_text(report, encoding="utf-8")
    if persist_chroma:
        from regugraph.retriever import RobustEmbeddingFunction
        collection = get_chroma_client().get_or_create_collection(name=EVAL_COLLECTION_NAME)
        collection.upsert(ids=[eval_data["run_id"]], documents=[report],
                          embeddings=RobustEmbeddingFunction().embed_documents([report]),
                          metadatas=[{"scorer_version": SCORER_VERSION, "iso_timestamp": eval_data["iso_timestamp"], "payload_json": payload}])
    return eval_data["run_id"]


def empty_evaluation():
    return {"status": "not_evaluated", "scorer_version": SCORER_VERSION, "run_id": None, "timestamp": None,
            "overall_score": None, "passed_cases": None, "total_cases": None, "recall_at_3": None,
            "citation_accuracy": None, "refusal_precision": None, "refusal_recall": None,
            "rag_faithfulness": None, "numeric_support": None, "avg_latency_ms": None,
            "mode_evaluations": [], "cases": [], "summary_text": "No measured run for the current scorer. Run the benchmark."}


def _stored_runs():
    collection = get_chroma_client().get_or_create_collection(name=EVAL_COLLECTION_NAME)
    records = collection.get(include=["metadatas"])
    runs = []
    for meta in records.get("metadatas", []):
        if meta and meta.get("scorer_version") == SCORER_VERSION and meta.get("payload_json"):
            runs.append(json.loads(meta["payload_json"]))
    return sorted(runs, key=lambda r: r["iso_timestamp"], reverse=True)


def get_latest_evaluation_run():
    """Read only: legacy scores never become current results and GET never runs a suite."""
    runs = _stored_runs()
    return runs[0] if runs else empty_evaluation()


def get_evaluation_run_history():
    keys = ("run_id", "timestamp", "iso_timestamp", "scorer_version", "overall_score", "passed_cases", "total_cases", "avg_latency_ms")
    return [{k: r.get(k) for k in keys} for r in _stored_runs()]


def trigger_evaluation_and_persist():
    result = run_benchmark_suite()
    save_evaluation_run(result)
    return result
