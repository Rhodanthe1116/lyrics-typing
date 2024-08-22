import Layout from 'shared/components/Layout'

import ko from 'src/data/ko/dict.json'
import Game from 'pageComponents/learn/game'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

const Learn = () => {
  const router = useRouter()
  const id: string = Array.isArray(router.query.id)
    ? router.query.id[0]
    : (router?.query?.id ?? '')

  const questions = useMemo(() => ko.filter((q) => q.topic === id), [id])

  return (
    <Layout displayBottomNav>
      <Game lang={'ko'} questions={questions} />
    </Layout>
  )
}

export default Learn
