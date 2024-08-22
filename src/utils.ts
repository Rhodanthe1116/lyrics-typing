export function textToFilename(sentence: string): string {
  // Define special characters that need to be encoded
  const specialChars = ['?', '!', '/', '&', '=', '+', '%', '#', '$', '@']

  // Encode only special characters
  const encodedSentence = sentence
    .split('')
    .map((char) =>
      specialChars.includes(char) ? encodeURIComponent(char) : char
    )
    .join('')

  return encodedSentence
}

export function toSeconds(milliseconds: number): string {
  return (milliseconds / 1000).toFixed(1)
}
