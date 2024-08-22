export function calcCPM(seconds, correctChar) {
  return Math.round((60 / seconds) * correctChar)
}
