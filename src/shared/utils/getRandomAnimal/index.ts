import animalList from './animalList'

function getRandomAnimal() {
  return animalList[Math.floor(Math.random() * animalList.length)]
}

export default getRandomAnimal
