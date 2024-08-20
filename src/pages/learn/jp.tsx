import Layout from 'shared/components/Layout'

import jp from 'src/data/jp/data.json'
import Game from 'pageComponents/learn/game'

const Learn = () => {
  return (
    <Layout displayBottomNav>
      <Game questions={jp} />
    </Layout>
  )
}

export default Learn
