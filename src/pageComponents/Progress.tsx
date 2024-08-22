export function Progress({ progress }: { progress: number }) {
  const h = 'h-1.5'

  return (
    <div className={'w-full  rounded-full dark:bg-gray-700 ' + h}>
      <div
        className={'bg-green-300 rounded-full ' + h}
        style={{
          width: `${progress}%`,
        }}
      ></div>
    </div>
  )
}
