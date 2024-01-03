import Document from '../document'

export interface HasDocument {
  get data(): Document[]
  updateDocument(record: Document): void
  clearDocument(): void
}

export interface HasDocuments {
  get documents(): Document[]
  document(index: number): Document
  clearDocuments(): void
  addDocument(record: Document): void
  removeDocument(index: number): void
  setDocument(index: number, record: Document): void
}
