import Layout from 'shared/components/Layout'

import dict from 'src/data/ko/dict.json'
import Game from 'pageComponents/learn/game'

const Learn = () => {
  return (
    <Layout displayBottomNav>
      <Game questions={dict} />
    </Layout>
  )
}

export default Learn
