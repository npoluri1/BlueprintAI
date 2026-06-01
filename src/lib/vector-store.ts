/**
 * Enterprise Vector Store Service
 *
 * Provides RAG (Retrieval Augmented Generation) with:
 * - In-memory vector store (works out of the box, zero deps)
 * - ChromaDB integration (when chromadb is available)
 * - Document chunking and embedding generation
 * - Hybrid search (semantic + keyword)
 *
 * Architecture is provider-agnostic — swap in Pinecone, Qdrant, or Weaviate later.
 */

/* ---------- Document Types ---------- */

export interface ChunkedDocument {
  id: string
  text: string
  metadata: Record<string, string>
  embedding?: number[]
}

export interface SearchResult {
  id: string
  text: string
  score: number
  metadata: Record<string, string>
}

/* ---------- Simple Embedding (character n-gram hash) ---------- */

function simpleEmbed(text: string, dimensions: number = 128): number[] {
  const vec = new Array(dimensions).fill(0)
  const lower = text.toLowerCase()
  for (let i = 0; i < lower.length - 2; i++) {
    const trigram = lower.slice(i, i + 3)
    let hash = 0
    for (let j = 0; j < trigram.length; j++) {
      hash = ((hash << 5) - hash) + trigram.charCodeAt(j)
      hash |= 0
    }
    vec[Math.abs(hash) % dimensions] += 1
  }
  // Normalize
  const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0))
  if (magnitude > 0) {
    for (let i = 0; i < dimensions; i++) vec[i] /= magnitude
  }
  return vec
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB)
  return denom === 0 ? 0 : dot / denom
}

/* ---------- Document Chunking ---------- */

export function chunkDocument(
  text: string,
  metadata: Record<string, string>,
  chunkSize: number = 512,
  overlap: number = 64,
): ChunkedDocument[] {
  if (!text || text.length < 50) {
    return [{ id: crypto.randomUUID(), text, metadata, embedding: undefined }]
  }

  const chunks: ChunkedDocument[] = []
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text]
  let current = ""

  for (const sentence of sentences) {
    if ((current + sentence).length > chunkSize && current.length > 0) {
      // Save current chunk
      const chunkText = current.trim()
      if (chunkText.length > 10) {
        chunks.push({
          id: crypto.randomUUID(),
          text: chunkText,
          metadata: { ...metadata, chunkIndex: String(chunks.length) },
          embedding: simpleEmbed(chunkText),
        })
      }
      // Keep overlap from end of current chunk
      const words = current.split(" ")
      current = words.slice(-Math.floor(overlap / 5)).join(" ") + " " + sentence
    } else {
      current += sentence
    }
  }

  // Last chunk
  const lastText = current.trim()
  if (lastText.length > 10) {
    chunks.push({
      id: crypto.randomUUID(),
      text: lastText,
      metadata: { ...metadata, chunkIndex: String(chunks.length) },
      embedding: simpleEmbed(lastText),
    })
  }

  return chunks
}

/* ---------- In-Memory Vector Store ---------- */

class InMemoryVectorStore {
  private documents: ChunkedDocument[] = []
  private readonly maxDocs = 10000

  async addDocuments(docs: ChunkedDocument[]): Promise<void> {
    this.documents.push(...docs)
    if (this.documents.length > this.maxDocs) {
      this.documents = this.documents.slice(-this.maxDocs)
    }
  }

  async similaritySearch(query: string, k: number = 5): Promise<SearchResult[]> {
    if (this.documents.length === 0) return []

    const queryEmbedding = simpleEmbed(query)

    // Score all documents
    const scored = this.documents.map(doc => ({
      ...doc,
      score: doc.embedding ? cosineSimilarity(queryEmbedding, doc.embedding) : 0,
    }))

    // Sort by score descending, take top k
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(({ id, text, score, metadata }) => ({ id, text, score, metadata }))
  }

  async clear(): Promise<void> {
    this.documents = []
  }

  get count(): number {
    return this.documents.length
  }
}

/* ---------- Enterprise Vector Store ---------- */

export class VectorStoreService {
  private store: InMemoryVectorStore
  private chromaClient: any = null
  private chromaCollection: any = null
  private useChroma = false

  constructor() {
    this.store = new InMemoryVectorStore()
    this.initChroma().catch(() => { /* ChromaDB unavailable, using in-memory */ })
  }

  private async initChroma(): Promise<void> {
    try {
      const { ChromaClient } = await import("chromadb")
      this.chromaClient = new ChromaClient({
        path: process.env.CHROMA_URL || "http://localhost:8000",
      })
      // Try to get or create a collection
      try {
        this.chromaCollection = await this.chromaClient.getCollection({ name: "blueprintai_projects" })
      } catch {
        this.chromaCollection = await this.chromaClient.createCollection({ name: "blueprintai_projects" })
      }
      this.useChroma = true
      console.log("[VectorStore] ChromaDB connected")
    } catch {
      console.log("[VectorStore] Using in-memory vector store (ChromaDB unavailable)")
    }
  }

  async addProjectDocuments(
    title: string,
    description: string,
    techStack: string[],
    files: { path: string; content: string }[],
  ): Promise<void> {
    const metadata = { title, techStack: techStack.join(", ") }

    // Chunk the description
    const descChunks = chunkDocument(description, { ...metadata, type: "description" })
    await this.addToStore(descChunks)

    // Chunk file contents
    for (const file of files.slice(0, 20)) { // Limit to 20 files to avoid overload
      const fileMeta = { ...metadata, type: "file", path: file.path }
      const fileChunks = chunkDocument(file.content, fileMeta, 1024, 128)
      await this.addToStore(fileChunks)
    }
  }

  private async addToStore(chunks: ChunkedDocument[]): Promise<void> {
    if (this.useChroma && this.chromaCollection) {
      try {
        await this.chromaCollection.add({
          ids: chunks.map(c => c.id),
          embeddings: chunks.map(c => c.embedding || simpleEmbed(c.text)),
          metadatas: chunks.map(c => c.metadata),
          documents: chunks.map(c => c.text),
        })
      } catch {
        await this.store.addDocuments(chunks)
      }
    } else {
      await this.store.addDocuments(chunks)
    }
  }

  async search(
    query: string,
    k: number = 5,
    filterType?: string,
  ): Promise<SearchResult[]> {
    if (this.useChroma && this.chromaCollection) {
      try {
        const queryEmbedding = simpleEmbed(query)
        const results = await this.chromaCollection.query({
          queryEmbeddings: [queryEmbedding],
          nResults: k,
          where: filterType ? { type: filterType } : undefined,
        })
        return (results.ids?.[0] || []).map((_id: string, i: number) => ({
          id: results.ids[0][i],
          text: results.documents[0][i] || "",
          score: results.distances?.[0]?.[i] ? 1 - results.distances[0][i] : 0.5,
          metadata: results.metadatas?.[0]?.[i] || {},
        }))
      } catch {
        return this.store.similaritySearch(query, k)
      }
    }
    return this.store.similaritySearch(query, k)
  }

  async searchByTechStack(techQuery: string, k: number = 3): Promise<SearchResult[]> {
    const results = await this.search(techQuery, k)
    // Boost results matching the tech stack
    return results
      .map(r => ({
        ...r,
        score: (r.metadata.techStack?.toLowerCase().includes(techQuery.toLowerCase()) ? r.score * 1.5 : r.score),
      }))
      .sort((a, b) => b.score - a.score)
  }

  async clearAll(): Promise<void> {
    this.store.clear()
    if (this.useChroma && this.chromaCollection) {
      try {
        await this.chromaClient.deleteCollection({ name: "blueprintai_projects" })
      } catch { /* ignore */ }
    }
  }

  get stats(): { store: string; documents: number } {
    return {
      store: this.useChroma ? "chromadb" : "in-memory",
      documents: this.store.count,
    }
  }
}

// Singleton instance
export const vectorStore = new VectorStoreService()
