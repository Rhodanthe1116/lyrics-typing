export function Button({
  variant = 'contained',
  ...rest
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { variant?: 'contained' | 'outlined' }) {
  const containedClassName = 'bg-pink-400 hover:bg-pink-700 text-white '
  const outlinedClassName = 'border border-pink-400 text-pink-400 '
  const variantClassName =
    variant === 'contained' ? containedClassName : outlinedClassName

  return (
    <button
      className={
        variantClassName +
        'font-bold py-2 px-4 rounded-3xl w-36 h-12 ' +
        rest.className
      }
      {...rest}
    />
  )
}
