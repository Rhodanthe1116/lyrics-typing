import Layout from 'shared/components/Layout'
import Link from 'next/link'

const Learn = () => {
  return (
    <Layout displayBottomNav>
      <div className="max-w-screen-lg m-auto ">
        <div className=" w-full flex gap-4 flex-wrap justify-center ">
          <UnitButton href="./ko/常用句-平語">
            <p className="font-bold">常用句 - 平語</p>
          </UnitButton>
          <UnitButton href="./ko/常用句">
            <p className="font-bold">常用句</p>
          </UnitButton>
          <UnitButton href="./ko/人物">
            <p className="font-bold">People</p>
          </UnitButton>
          <UnitButton href="./ko/地點">
            <p className="font-bold">Places</p>
          </UnitButton>
        </div>
      </div>
    </Layout>
  )
}
function UnitButton({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link href={href}>
      <button className="bg-slate-800 rounded-lg w-full min-w-60 max-w-64 min-h-48">
        <div>{children}</div>
      </button>
    </Link>
  )
}
export default Learn
