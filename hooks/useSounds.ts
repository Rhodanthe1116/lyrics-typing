import useSound from 'use-sound'
// import clickSoundFileUrl from '/click.wav'
// import beepSoundFileUrl from '/beep.wav'
// import hintSoundFileUrl from '/hint.wav'



export type PlayFunction = ReturnType<typeof useSound>[0]

export default function useKeySound(): [PlayFunction, PlayFunction, PlayFunction] {
  const [playClickSound] = useSound('/click.wav', {
    onPlayError: () => {
      console.error('Error occured!');
    },
    onend: () => {
        console.info('Sound ended!');
      },})
  const [playBeepSound] = useSound('/beep.wav' ,{
    onPlayError: () => {
      console.error('Error occured!');
    }})
  const [playErrorSound] = useSound('/hint.wav', {
    onPlayError: () => {
      console.error('Error occured!');
    }})
  return [playClickSound, playBeepSound, playErrorSound]
}
