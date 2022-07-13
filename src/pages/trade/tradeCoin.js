import { Tabs } from 'antd-mobile'
import { useState } from 'react'
export default function TradeCoin() {
  const [activeIndex, setActiveIndex] = useState(0)
  const tradeCoinList = [
    {
      name: 'USDT',
      id: 'usdt'
    },
    {
      name: 'ETH',
      id: 'eth'
    },
    {
      name: 'BTC',
      id: 'btc'
    },
    {
      name: 'USD',
      id: 'usd'
    }
  ]
  const tradeInfo = () => {
    return (
      <div className='trade-pair-wrapper'>
        <div className='title-wrapper'>
          <div>Pair/24h volume</div>
          <div>Last Price/Change</div>
        </div>
      </div>
    )
  }
  const handleChange = (key) => {
    setActiveIndex(key)
    console.log(key, '====key')
  }
  return (
    <div>
      <Tabs activeKey={tradeCoinList[activeIndex].id} onChange={handleChange}>
        {
          tradeCoinList.map(item => {
            return (
              <Tabs.Tab title={item.name} key={item.id}>
              </Tabs.Tab>
            )
          })
        }
      </Tabs>
      {tradeInfo()}
    </div>
  )
}