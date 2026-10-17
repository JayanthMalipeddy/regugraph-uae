"""
ChromaDB Web Explorer & UI Service.
Provides a modern visual interface for ChromaDB vector collections on http://localhost:8090.
"""

import time
from typing import Optional, Dict, Any, List
import chromadb
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="ChromaDB Web UI",
    description="Dedicated Web UI and Inspector for ChromaDB Vector Collections",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CHROMA_HOST = "localhost"
CHROMA_PORT = 8081


def get_chroma_client():
    try:
        return chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Cannot connect to ChromaDB at {CHROMA_HOST}:{CHROMA_PORT}: {str(e)}")


class QueryRequest(BaseModel):
    collection: str
    query_text: str
    n_results: Optional[int] = 5


@app.get("/health")
def health_check():
    """Real-time health check endpoint for Diagnostics & Telemetry ping."""
    t0 = time.perf_counter()
    chroma_ok = False
    col_count = 0
    try:
        client = get_chroma_client()
        cols = client.list_collections()
        chroma_ok = True
        col_count = len(cols)
    except Exception:
        chroma_ok = False

    latency = round((time.perf_counter() - t0) * 1000, 2)
    return {
        "status": "online" if chroma_ok else "degraded",
        "service": "Chroma Web UI",
        "port": 8090,
        "chroma_backend": f"http://{CHROMA_HOST}:{CHROMA_PORT}",
        "chroma_connected": chroma_ok,
        "collections_count": col_count,
        "latency_ms": latency,
        "timestamp": time.time()
    }


@app.get("/api/collections")
def list_collections():
    """List all available Chroma collections with item counts."""
    client = get_chroma_client()
    collections = client.list_collections()
    result = []
    for col in collections:
        try:
            count = col.count()
        except Exception:
            count = 0
        result.append({
            "name": col.name,
            "id": str(col.id),
            "count": count,
            "metadata": col.metadata or {}
        })
    return {"collections": result}


@app.get("/api/collections/{name}")
def get_collection_data(name: str, limit: int = Query(50, ge=1, le=200)):
    """Fetch documents, metadata, and IDs from a specific collection."""
    client = get_chroma_client()
    try:
        col = client.get_collection(name)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Collection '{name}' not found: {str(e)}")

    data = col.get(limit=limit, include=["documents", "metadatas"])
    items = []
    ids = data.get("ids", [])
    docs = data.get("documents", [])
    metas = data.get("metadatas", [])

    for i in range(len(ids)):
        items.append({
            "id": ids[i] if i < len(ids) else f"item-{i}",
            "document": docs[i] if i < len(docs) else "",
            "metadata": metas[i] if (metas and i < len(metas)) else {}
        })

    return {
        "name": col.name,
        "id": str(col.id),
        "total_count": col.count(),
        "limit": limit,
        "metadata": col.metadata or {},
        "items": items
    }


@app.post("/api/query")
def query_collection(req: QueryRequest):
    """Run semantic vector similarity search against a collection."""
    client = get_chroma_client()
    try:
        col = client.get_collection(req.collection)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Collection '{req.collection}' not found: {str(e)}")

    t0 = time.perf_counter()
    results = col.query(
        query_texts=[req.query_text],
        n_results=req.n_results,
        include=["documents", "metadatas", "distances"]
    )
    latency = round((time.perf_counter() - t0) * 1000, 2)

    hits = []
    if results and results.get("ids") and results["ids"][0]:
        r_ids = results["ids"][0]
        r_docs = results.get("documents", [[]])[0]
        r_metas = results.get("metadatas", [[]])[0]
        r_dists = results.get("distances", [[]])[0]

        for i in range(len(r_ids)):
            hits.append({
                "id": r_ids[i],
                "document": r_docs[i] if i < len(r_docs) else "",
                "metadata": r_metas[i] if i < len(r_metas) else {},
                "distance": round(float(r_dists[i]), 4) if i < len(r_dists) else 0.0
            })

    return {
        "collection": req.collection,
        "query": req.query_text,
        "hits_count": len(hits),
        "latency_ms": latency,
        "hits": hits
    }


# HTML UI single page
HTML_PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChromaDB Vector Web UI | Port 8090</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        code, pre, .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
    
    <!-- Top Header -->
    <header class="h-20 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40">
        <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <div class="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400 font-bold text-lg">
                    ⚡
                </div>
            </div>
            <div>
                <div class="flex items-center gap-2">
                    <span class="text-base sm:text-lg font-extrabold text-white">ChromaDB Web Explorer</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        PORT 8090
                    </span>
                </div>
                <div class="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>Connected to:</span>
                    <span class="font-mono text-cyan-400" id="chroma-endpoint">http://localhost:8081</span>
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span class="text-emerald-400 font-semibold" id="chroma-status">Online</span>
                </div>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <a href="http://localhost:5174" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5">
                <span>← Diagnostics (5174)</span>
            </a>
            <a href="http://localhost:5173" class="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20 flex items-center gap-1.5">
                <span>Main Demo (5173) →</span>
            </a>
        </div>
    </header>

    <!-- Main Container -->
    <div class="flex-1 max-w-[1500px] w-full mx-auto p-6 sm:p-8 flex flex-col lg:flex-row gap-6">
        
        <!-- Left Sidebar: Collections List -->
        <aside class="w-full lg:w-80 shrink-0 space-y-4">
            <div class="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div class="flex items-center justify-between">
                    <h2 class="text-xs font-bold uppercase tracking-wider text-slate-400">Collections</h2>
                    <button onclick="loadCollections()" class="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer">
                        ↻ Refresh
                    </button>
                </div>
                
                <div id="collections-list" class="space-y-2">
                    <div class="text-xs text-slate-500 py-4 text-center">Loading collections...</div>
                </div>
            </div>

            <!-- Vector DB Quick Stats -->
            <div class="p-5 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-3 text-xs">
                <div class="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Database Metrics</div>
                <div class="flex justify-between text-slate-400">
                    <span>Embeddings Model:</span>
                    <span class="font-mono text-slate-200">all-MiniLM-L6-v2</span>
                </div>
                <div class="flex justify-between text-slate-400">
                    <span>Embedding Dim:</span>
                    <span class="font-mono text-cyan-400">384 Dimensions</span>
                </div>
                <div class="flex justify-between text-slate-400">
                    <span>Distance Metric:</span>
                    <span class="font-mono text-emerald-400">Cosine (HNSW)</span>
                </div>
                <div class="flex justify-between text-slate-400">
                    <span>Storage Engine:</span>
                    <span class="font-mono text-slate-200">DuckDB / Parquet</span>
                </div>
            </div>
        </aside>

        <!-- Right Content Area -->
        <main class="flex-1 space-y-6">
            
            <!-- Collection Overview & Search Header -->
            <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="h-2.5 w-2.5 rounded-full bg-cyan-400"></span>
                            <h1 id="active-collection-title" class="text-xl font-extrabold text-white font-mono">Select a Collection</h1>
                        </div>
                        <p class="text-xs text-slate-400 mt-1" id="active-collection-meta">Click a collection on the left to inspect its chunks and vectors.</p>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold" id="active-collection-count">
                            0 Chunks
                        </span>
                    </div>
                </div>

                <!-- Vector Similarity Search Bar -->
                <div class="space-y-2">
                    <label class="text-xs font-semibold text-slate-300 flex items-center justify-between">
                        <span>Semantic Vector Query Test</span>
                        <span class="text-[10px] text-slate-500 font-mono">Computes Cosine Similarity against all-MiniLM-L6-v2</span>
                    </label>
                    <div class="flex items-center gap-2">
                        <input type="text" id="query-input" placeholder="e.g. What is the statutory early settlement fee cap under Notice 3877/2019?"
                               class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500">
                        <button onclick="runQuery()" class="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md shadow-cyan-600/20 cursor-pointer">
                            Search Vectors
                        </button>
                    </div>
                </div>

                <!-- Search Results Container (Hidden by default) -->
                <div id="search-results-box" class="hidden pt-3 border-t border-slate-800 space-y-3">
                    <div class="flex items-center justify-between text-xs">
                        <span class="font-bold text-emerald-400" id="search-results-summary">Vector Search Results</span>
                        <button onclick="closeSearchResults()" class="text-slate-400 hover:text-white text-xs">✕ Close Search</button>
                    </div>
                    <div id="search-results-list" class="space-y-3"></div>
                </div>
            </div>

            <!-- Documents Explorer Table / Card Stack -->
            <div class="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                <div class="flex items-center justify-between">
                    <h2 class="text-sm font-bold text-white flex items-center gap-2">
                        <span>Stored Documents & Metadata</span>
                    </h2>
                    <div class="text-xs text-slate-400" id="showing-docs-count">
                        Showing documents
                    </div>
                </div>

                <div id="documents-container" class="space-y-3">
                    <div class="text-xs text-slate-500 py-12 text-center">Loading document chunks...</div>
                </div>
            </div>

        </main>
    </div>

    <!-- Script logic -->
    <script>
        let currentCollection = 'cbuae_regulations';

        async function loadCollections() {
            try {
                const res = await fetch('/api/collections');
                const data = await res.json();
                const container = document.getElementById('collections-list');
                container.innerHTML = '';

                data.collections.forEach(col => {
                    const isSelected = col.name === currentCollection;
                    const btn = document.createElement('button');
                    btn.className = `w-full text-left p-3.5 rounded-2xl transition-all border cursor-pointer ${
                        isSelected 
                            ? 'bg-cyan-950/60 border-cyan-500/50 text-white shadow-md' 
                            : 'bg-slate-950/40 hover:bg-slate-800/60 border-slate-800 text-slate-300'
                    }`;
                    btn.onclick = () => selectCollection(col.name);
                    btn.innerHTML = `
                        <div class="flex items-center justify-between">
                            <span class="font-mono font-bold text-xs truncate ${isSelected ? 'text-cyan-300' : 'text-slate-200'}">${col.name}</span>
                            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}">${col.count} chunks</span>
                        </div>
                    `;
                    container.appendChild(btn);
                });

                if (currentCollection) {
                    selectCollection(currentCollection);
                }
            } catch (err) {
                console.error(err);
                document.getElementById('collections-list').innerHTML = '<div class="text-xs text-rose-400">Failed to load collections</div>';
            }
        }

        async function selectCollection(name) {
            currentCollection = name;
            document.getElementById('active-collection-title').textContent = name;
            closeSearchResults();

            try {
                const res = await fetch(`/api/collections/${encodeURIComponent(name)}?limit=50`);
                const data = await res.json();

                document.getElementById('active-collection-count').textContent = `${data.total_count} Chunks`;
                document.getElementById('active-collection-meta').textContent = `Collection ID: ${data.id} · Indexed Corpus Chunks`;
                document.getElementById('showing-docs-count').textContent = `Displaying ${data.items.length} of ${data.total_count} indexed chunks`;

                const container = document.getElementById('documents-container');
                container.innerHTML = '';

                if (data.items.length === 0) {
                    container.innerHTML = '<div class="text-xs text-slate-500 py-8 text-center">Collection is empty.</div>';
                    return;
                }

                data.items.forEach((item, idx) => {
                    const card = document.createElement('div');
                    card.className = 'p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 hover:border-slate-700 transition-all';
                    
                    const metaBadges = Object.entries(item.metadata || {})
                        .map(([k, v]) => `<span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px]"><strong class="text-cyan-400">${k}:</strong> ${v}</span>`)
                        .join(' ');

                    card.innerHTML = `
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-mono text-cyan-400 font-bold">#${idx + 1} · ID: ${item.id}</span>
                            <span class="text-[10px] text-slate-500 font-mono">${(item.document || '').length} characters</span>
                        </div>
                        <div class="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap line-clamp-3 hover:line-clamp-none transition-all">
                            ${escapeHtml(item.document)}
                        </div>
                        <div class="pt-2 flex flex-wrap gap-1.5 border-t border-slate-900">
                            ${metaBadges || '<span class="text-[10px] text-slate-600 font-mono">No metadata</span>'}
                        </div>
                    `;
                    container.appendChild(card);
                });

            } catch (err) {
                console.error(err);
                document.getElementById('documents-container').innerHTML = '<div class="text-xs text-rose-400">Failed to load documents</div>';
            }
        }

        async function runQuery() {
            const query = document.getElementById('query-input').value.trim();
            if (!query) return;

            const box = document.getElementById('search-results-box');
            const list = document.getElementById('search-results-list');
            box.classList.remove('hidden');
            list.innerHTML = '<div class="text-xs text-cyan-400 py-3">Computing embedding & querying vector space...</div>';

            try {
                const res = await fetch('/api/query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ collection: currentCollection, query_text: query, n_results: 3 })
                });
                const data = await res.json();
                
                document.getElementById('search-results-summary').textContent = `Top ${data.hits_count} Vector Hits in ${data.latency_ms}ms (Cosine Distance)`;
                list.innerHTML = '';

                data.hits.forEach((hit, idx) => {
                    const scorePct = Math.max(0, Math.round((1 - hit.distance) * 100));
                    const hitCard = document.createElement('div');
                    hitCard.className = 'p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-2';
                    hitCard.innerHTML = `
                        <div class="flex items-center justify-between text-xs">
                            <span class="font-bold text-cyan-300 font-mono">Rank #${idx + 1} · Distance: ${hit.distance} (${scorePct}% Match)</span>
                            <span class="text-[10px] font-mono text-slate-400">ID: ${hit.id}</span>
                        </div>
                        <p class="text-xs text-slate-200 leading-relaxed">${escapeHtml(hit.document)}</p>
                    `;
                    list.appendChild(hitCard);
                });

            } catch (err) {
                list.innerHTML = `<div class="text-xs text-rose-400">Error executing vector search: ${err.message}</div>`;
            }
        }

        function closeSearchResults() {
            document.getElementById('search-results-box').classList.add('hidden');
        }

        function escapeHtml(str) {
            if (!str) return '';
            return str
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        // Initialize on load
        loadCollections();
    </script>
</body>
</html>
"""


@app.get("/", response_class=HTMLResponse)
def index_page():
    """Serve the interactive ChromaDB Web UI application."""
    return HTMLResponse(content=HTML_PAGE)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8090)
