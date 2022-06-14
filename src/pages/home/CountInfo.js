import styled from "styled-components"
import dataImage from '../../assets/images/home-acount.png'
import dataImageClient from '../../assets/images/home-acount-client.png'
import {detectMobile} from "../../utils"
import {createClient} from 'urql'
import {useEffect, useState} from "react"

const REIAPIURL = 'https://beeprotocol.xyz/subgraphs/name/Bee-Protocol/bee-subgraph'
const CZZAPIURL = 'https://node.classzz.com/subgraphs/name/Bee-Protocol/bee-subgraph'
export default function CountInfo() {
    const [countInfo, setCountInfo] = useState()
    const countList = [
        {
            name: 'Group Count',
            count: countInfo?.groupCount || 0
        },
        {
            name: 'Group Member Count',
            count: countInfo?.groupProfileCount || 0
        },
        {
            name: 'Profile Count',
            count: countInfo?.profileCount || 0
        },
        {
            name: 'Chat Count',
            count: countInfo?.sendCount || 0
        },
        {
            name: 'Follow Count',
            count: countInfo?.followCount || 0
        }
    ]

    useEffect(() => {
        getCountInfo()
    }, [])
    const getCountInfo = async () => {
        const countInfoQuery = `
      query {
        statisticalData(id:"StatisticalData"){
          id,
          groupCount,
          groupProfileCount,
          profileCount,
          sendCount,
          followCount
        }
      }
    `
        const url = [CZZAPIURL, REIAPIURL]
        const obj = {
            groupCount: 0,
            groupProfileCount: 0,
            profileCount: 0,
            sendCount: 0,
            followCount: 0
        }

        url.map(async (item) => {
            const client = createClient({
                url: item
            })
            const res = await client.query(countInfoQuery).toPromise()

            if (!res.data) return
            const {groupCount, groupProfileCount, profileCount, sendCount, followCount} = res?.data.statisticalData
            obj.groupCount += Number(groupCount)
            obj.groupProfileCount += Number(groupProfileCount)
            obj.profileCount += Number(profileCount)
            obj.sendCount += Number(sendCount)
            obj.followCount += Number(followCount)
        })
        setTimeout(() => {
            setCountInfo(obj)
        }, 1000)
    }
    return (
        <CountInfoContanier>
            <div className={`info-wrap ${detectMobile() ? 'info-wrap-client' : ''}`}
                 style={{backgroundImage: `url(${detectMobile() ? dataImageClient : dataImage})`}}>
              <div className="item-wrap">
                {
                  countList.map((item,index) => {
                    return (
                      <div className="item" key={index}>
                          <span className="name">{item.name}</span>
                          <span className="count">{item.count}</span>
                      </div>
                    )
                  })
                }
              </div>
            </div>
        </CountInfoContanier>
    )
}
const CountInfoContanier = styled.div`
  .info-wrap {
    position: relative;
    height: 420px;
    background-repeat: no-repeat;
    background-position: left;
    background-size: 72%;
    margin: 120px 50px 0;

    .item-wrap{
      margin-top: 53px;
      position: absolute;
      width: 100%;
    }
    .item {
      position: relative;
      height: 43px;
      margin-bottom: 38px;
    }

    .name {
      position: absolute;
      font-size: 20px;
      color: #231815;
      font-weight: bold;
      left: 75%;
      top: 6px
    }

    .count {
      position: absolute;
      font-size: 16px;
      font-weight: bold;
      color: #fff;
      left: 59%;
      top: 10px
    }

    &-client {
      margin: 50px 0;
      height: 212px;
      background-size: 100%;
      .item-wrap {
        .item {
          height: 22px;
          margin-bottom: 18px;
          margin-left: -20px;
  
          .name, .count {
            top: 0;
            font-size: 13px;
          }
          .name {
            left: 63%;
            font-size: 12px;
            top: -18px;
          }
          .count {
            left: 83%;
            top: 3px;
            font-size: 12px;
          }
        }
      }
    }
  }
  @media (min-width: 1450px) {
    .info-wrap {
      height: 520px;
      .item-wrap {
        margin-top: 66px;
        .item {
          height: 54px;
          margin-bottom: 46px;
          .name {
            top: 12px;
          }
          .count {
            top: 18px;
          }
        }
      }
    }
  }
  @media (max-width: 1280px) {
    .info-wrap {
      .item-wrap {
        margin-top: 53px;
      }
    }
  }
  @media (max-width: 768px) {
    .info-wrap {
      .item-wrap {
        margin-top: 28px;
      }
    }
  }
  @media (min-width: 1450px) and (max-width: 1680px) {
    .info-wrap {
      height: 490px;
      .item-wrap {
        margin-top: 63px;
        .item {
          height: 50px;
          margin-bottom: 44px;
        }
      }
    }
  }
`