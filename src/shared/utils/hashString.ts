export function hashString(s: string) {
  return s.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0)
}
