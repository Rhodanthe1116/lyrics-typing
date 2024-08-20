import Layout from 'shared/components/Layout'

import ko from 'src/data/ko/dict.json'
import Game from 'pageComponents/learn/game'

const Learn = () => {
  return (
    <Layout displayBottomNav>
      <Game questions={ko} />
    </Layout>
  )
}

export default Learn
