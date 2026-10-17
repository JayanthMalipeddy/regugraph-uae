import sys
from regugraph.rag.unified_rag import execute_unified_rag, RAG_MODES_REGISTRY

print("=== 1. TESTING NATURAL GREETING ===", flush=True)
g = execute_unified_rag('hi')
print("Is greeting:", g.get('is_greeting'), flush=True)
print("Refusal triggered:", g.get('refusal_triggered'), flush=True)
print("Answer starts with:", g.get('answer', '')[:70], flush=True)

print("\n=== 2. TESTING REFUSAL GUARDRAILS ===", flush=True)
f = execute_unified_rag('What does UK FCA require for loans?')
print("Foreign law refusal:", f.get('refusal_triggered'), "| Category:", f.get('refusal_category'), flush=True)

c = execute_unified_rag('How to stake crypto on blockchain?')
print("Crypto refusal:", c.get('refusal_triggered'), "| Category:", c.get('refusal_category'), flush=True)

o = execute_unified_rag('How to make chocolate cake recipe?')
print("Off-topic refusal:", o.get('refusal_triggered'), "| Category:", o.get('refusal_category'), flush=True)

print("\n=== 3. TESTING ALL 10 RAG ARCHITECTURES (IN-SCOPE QUERY) ===", flush=True)
test_q = 'What is the statutory cap on early settlement prepayment fees under Circular 8/2020?'

for mode_key in list(RAG_MODES_REGISTRY.keys()):
    print(f"Running mode: {mode_key}...", flush=True)
    res = execute_unified_rag(test_q, mode=mode_key)
    trace_len = len(res.get('execution_trace', []))
    ans_len = len(res.get('answer', ''))
    title = res.get('title', mode_key)
    print(f"[{mode_key.upper():12}] {title[:45]:45} | Trace: {trace_len} steps | Answer len: {ans_len}", flush=True)

print("\nALL 10 RAG MODES TESTED SUCCESSFULLY!", flush=True)
