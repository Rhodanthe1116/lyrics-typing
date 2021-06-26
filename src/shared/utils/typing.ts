export function calcCPM(time, correctChar) {
  return Math.round((60 / time) * correctChar)
}
