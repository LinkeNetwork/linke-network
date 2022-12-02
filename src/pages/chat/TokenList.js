import styled from "styled-components"
import axios from 'axios'
import { useEffect, useState } from "react"
import {List} from 'react-virtualized'
import UseTokenBalance from "../../hooks/UseTokenBalance"
export default function TokenList(props) {
  const { contentHeight } = props
  const [listHeight, setListHeight] = useState(450)
  const { getTokenBalance, tokenList } = UseTokenBalance()
  const listStyle = {
    'display': 'flex',
    'alignItems': 'center',
    'height': '60px',
    'padding': '0 24px 0 0',
    'justifyContent': 'space-between'
  }
  const tokenInfoStyle = {
    'display': 'flex',
    'alignItems': 'center',
  }
  const imgStyle = {
    'width': '24px',
    'height': '24px',
    'borderRadius': '50%',
    'marginRight': '10px',
    'lineHeight': '40px'
  }
  const symbolStyle = {
    'fontSize': '15px',
    'fontWeight': '800'
  }
  const tokenNameStyle = {
    'display': 'flex',
    'flexDirection': 'column'
  }
  const rowRenderer = ({
    key,
    index,
    style,
  }) => {
    return (
      <div key={key} style={style}>
        <div style={listStyle}>
          <div style={tokenInfoStyle}>
            <img src={tokenList[index].logoURI} alt="" style={imgStyle}/>
            <div style={tokenNameStyle}>
              <div style={symbolStyle}>{tokenList[index].symbol}</div>
              <div className="token-list-name">{tokenList[index].name}</div>
            </div>
          </div>
          <span className="token-balance">{tokenList[index].balance}</span>
        </div>
      </div>
    )
  }
  const formatList = (tempList) => {
    for(let i = 0; i < tempList.length; i++) {
      getTokenBalance(tempList[i], tempList, i)
    }
  }
  const getTokenList = () => {
    axios.get('https://tokens.etherfair.org/')
      .then(function (res) {
        formatList(res.data.tokens)
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  useEffect(() => {
    getTokenList()
  }, [])
  useEffect(() => {
    setListHeight(contentHeight)
  }, [contentHeight])
  return (
    <TokenListContainer>
      {
        tokenList?.length &&
        <List
          width={360}
          height={listHeight}
          rowCount={tokenList?.length}
          rowHeight={60}
          rowRenderer={rowRenderer}
        />
      }
    </TokenListContainer>
  )
}

const TokenListContainer = styled.div`

`