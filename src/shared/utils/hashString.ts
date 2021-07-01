export function hashString(s: string) {
  try {
    return s.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0)
  } catch (error) {
    return 0
  }
}
