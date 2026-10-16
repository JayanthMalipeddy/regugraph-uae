"""Document parsing and table-aware chunking for CBUAE regulations and loan contracts."""
import re
from pathlib import Path
from typing import List, Dict, Any
from dataclasses import dataclass

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from .config import REGULATIONS_DIR, CHUNK_SIZE, CHUNK_OVERLAP


@dataclass
class RegulatoryChunk:
    chunk_id: str
    content: str
    metadata: Dict[str, Any]


def extract_sections_and_tables(markdown_text: str, filename: str) -> List[Document]:
    """Parse markdown regulation text preserving headers, article markers, and tables."""
    docs = []
    
    # Identify circular title/ref
    title_match = re.search(r"^#\s+(.+)$", markdown_text, re.MULTILINE)
    doc_title = title_match.group(1).strip() if title_match else filename
    
    circular_match = re.search(r"(Circular No\.\s*[\w/]+|Notice No\.\s*[\w/]+)", markdown_text, re.IGNORECASE)
    circular_ref = circular_match.group(1).strip() if circular_match else filename

    # Split semantically by Article, Section 4.x, or Standardized Schedule
    sections = re.split(r"\n(?=#{2,3}\s+Article|#{2,3}\s+Standardized|#{3,4}\s+Section\s+4\.)", markdown_text)
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=150,
        separators=["\n\n", "\n", ". "]
    )

    for sec_idx, section in enumerate(sections):
        section_text = section.strip()
        if not section_text or len(section_text) < 100:
            continue
        
        # Check article header
        article_match = re.search(r"#{2,4}\s+([^\n]+)", section_text)
        article_header = article_match.group(1).strip() if article_match else f"Section {sec_idx + 1}"
        
        # Determine category tag
        sec_lower = section_text.lower()
        if "mortgage" in sec_lower or "ltv" in sec_lower:
            category = "mortgages"
        elif "personal loan" in sec_lower or "debt burden" in sec_lower or "dbr" in sec_lower:
            category = "personal_loans"
        elif "auto" in sec_lower or "car loan" in sec_lower or "vehicle" in sec_lower:
            category = "auto_loans"
        elif "early settlement" in sec_lower or "prepayment" in sec_lower:
            category = "early_settlement"
        elif "fee" in sec_lower or "processing" in sec_lower or "schedule" in sec_lower:
            category = "fees"
        else:
            category = "general_compliance"

        # Check if section contains a markdown table
        is_table = "|" in section_text and ("-|-" in section_text or ":---" in section_text or "--- |" in section_text)
        if is_table or len(section_text) <= 1300:
            # Keep intact as a single high-fidelity legal chunk
            enriched_text = f"[{circular_ref} - {article_header}]\n{section_text}"
            docs.append(Document(
                page_content=enriched_text,
                metadata={
                    "source": filename,
                    "doc_title": doc_title,
                    "circular_ref": circular_ref,
                    "article_header": article_header,
                    "category": category,
                    "is_table": is_table,
                    "chunk_id": f"{filename}_{sec_idx}"
                }
            ))
        else:
            # Sub-split long textual sections
            sub_chunks = text_splitter.split_text(section_text)
            for sub_idx, chunk_text in enumerate(sub_chunks):
                if len(chunk_text.strip()) < 80:
                    continue
                enriched_text = f"[{circular_ref} - {article_header}]\n{chunk_text}"
                docs.append(Document(
                    page_content=enriched_text,
                    metadata={
                        "source": filename,
                        "doc_title": doc_title,
                        "circular_ref": circular_ref,
                        "article_header": article_header,
                        "category": category,
                        "is_table": False,
                        "chunk_id": f"{filename}_{sec_idx}_{sub_idx}"
                    }
                ))

    return docs


def load_cbuae_corpus(regulations_dir: Path = REGULATIONS_DIR) -> List[Document]:
    """Ingest and chunk all CBUAE regulatory circulars."""
    all_docs = []
    reg_files = list(regulations_dir.glob("*.md"))
    
    for f in reg_files:
        content = f.read_text(encoding="utf-8")
        docs = extract_sections_and_tables(content, f.name)
        all_docs.extend(docs)

    return all_docs
