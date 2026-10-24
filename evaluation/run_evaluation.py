"""Run every registered RAG mode and export measured, inspectable results."""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from regugraph.eval_store import format_metric, run_benchmark_suite, save_evaluation_run


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--modes", nargs="+", help="Subset of mode IDs; default: every registered mode")
    parser.add_argument("--queries", type=Path, help="Alternate benchmark JSON")
    parser.add_argument("--no-chroma", action="store_true", help="Export JSON/Markdown without storing Chroma history")
    parser.add_argument("--fail-on-failure", action="store_true", help="Exit 1 if any case fails (for CI)")
    args = parser.parse_args()
    def progress(mode, case):
        print(f"{mode:12} {case['id']:5} {case['status']:5} {case['latency_ms']:.1f} ms", flush=True)
    data = run_benchmark_suite(queries_file=args.queries, modes=args.modes, progress=progress)
    save_evaluation_run(data, persist_chroma=not args.no_chroma)
    print(f"\nRun {data['run_id']} ({data['scorer_version']}):")
    for mode in data["mode_evaluations"]:
        print(f"{mode['id']:12} passed {mode['passed_cases']}/{mode['total_cases']}; diagnostic score {format_metric(mode['overall_score'])}; errors {mode['error_cases']}")
    print("Full evidence: evaluation/runs/<run_id>.json; report: evaluation/EVALUATION_REPORT.md")
    return int(args.fail_on_failure and any(m["passed_cases"] != m["total_cases"] for m in data["mode_evaluations"]))


if __name__ == "__main__":
    raise SystemExit(main())
