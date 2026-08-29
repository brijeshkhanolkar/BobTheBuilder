export interface SavedAnalysis {
  jobTitle: string
  company: string
  score: number
  timestamp: string
}

const KEY = 'bobthebuilder_analyses'

export function saveAnalysis(a: SavedAnalysis) {
  const list = loadAnalyses()
  list.unshift(a)
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20)))
}

export function loadAnalyses(): SavedAnalysis[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}
