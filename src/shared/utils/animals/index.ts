import animalList from './animalList'

function getRandomAnimal() {
  return animalList[Math.floor(Math.random() * animalList.length)]
}

export function getAnimalByHash(s?: string) {
  if (!s) {
    return ''
  }

  const sum = s
    .slice(0, 5)
    .split('')
    .reduce((sum, c) => sum + c.charCodeAt(0), 0)

  const index: number = sum % animalList.length

  return animalList[index]
}

export default getRandomAnimal
