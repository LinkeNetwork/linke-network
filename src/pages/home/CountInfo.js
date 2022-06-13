import styled from "styled-components"
import dataImage from '../../assets/images/home-acount.png'
import {detectMobile, getLocal} from "../../utils"
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
                 style={{backgroundImage: `url(${dataImage})`}}>
              <div className="item-wrap">
                {
                  countList.map(item => {
                      return (
                          <div className="item">
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
    height: 500px;
    width: 70%;
    max-width: 1234px;
    min-width: 1160px;
    background-repeat: no-repeat;
    background-position: left;
    background-size: 72%;
    margin: 0 auto;
    margin-top: 120px;

    .item-wrap{
      margin-top: 50px;
      position: absolute;
      width: 100%;
    }
    .item {
      position: relative;
      height: 40px;
      margin-bottom: 37px;
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
      margin: 0 1rem;
      height: 260px;
      // background-size: 70%;
      background-size: 210px;
      padding-top: 50px;

      .item {
        height: 20px;
        margin-bottom: 10px;
        margin-left: -20px;

        .name, .count {
          top: 0;
          font-size: 13px;
        }
        .name {
          left: 65%;
          font-size: 12px;
          top: 12px;
        }
        .count {
          left: 184px;
          top: 10px;
        }
      }
    }
  }
  @media (max-width: 1450px) {
    .info-wrap {
      .item-wrap {
        margin-top: 75px;
        .item {
          height: 50px;
          margin-bottom: 43px;
          &:nth-child(2) {
            height: 48px;
            margin-bottom: 38px;
          }
          &:nth-child(4) {
            height: 45px;
            margin-bottom: 45px;
          }
          .count {
            top: 10px;
          }
          &:nth-child(1),&:nth-child(2),&:nth-child(3) {
            .count {
              top: 13px;
            }
          }
        }
      }
    }
   
  }
  @media (min-width: 1450px) {
    .info-wrap {
      .item-wrap {
        margin-top: 68px;
        .item {
          height: 50px;
          margin-bottom: 46px;
          .name {
            top: 8px;
          }
        }
      }
    }
  }
`