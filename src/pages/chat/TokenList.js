import styled from "styled-components"
import axios from 'axios'
import { useEffect, useState } from "react"
import { detectMobile } from "../../utils"
import UseTokenBalance from "../../hooks/UseTokenBalance"
import {List} from 'react-virtualized'
import intl from "react-intl-universal"
import { tokenListInfo } from '../../constant/tokenList'
import useGlobal from "../../hooks/useGlobal"
export default function TokenList(props) {
  const { selectToken, showBalance } = props
  const { currentTokenBalance } = useGlobal()
  const { getTokenBalance, tokenList } = UseTokenBalance()
  const [listHeight, setListHeight] = useState(450)
  const [contentHeight,setContentHeight] = useState(450)
  const [tokenInfo, setTokenInfo] = useState([])
  const [defaultList, setDefaultList] = useState()
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
        <div style={listStyle} onClick={() => selectToken(tokenInfo[index])}>
          <div style={tokenInfoStyle}>
            <img src={tokenInfo[index]?.logoURI} alt="" style={imgStyle}/>
            <div style={tokenNameStyle}>
              <div style={symbolStyle}>{tokenInfo[index]?.symbol}</div>
              <div className="token-list-name">{tokenInfo[index]?.name}</div>
            </div>
          </div>
          {
            showBalance && <span className="token-balance">{tokenInfo[index]?.balance}</span>
          }
          
        </div>
      </div>
    )
  }
  const getDefaultList = () => {
    const tempList = [...tokenListInfo]
    const result = tempList.filter(item => item.name !== "FREN")
    result[0].balance = Number(currentTokenBalance).toFixed(4)
    setDefaultList(result[0])
  }
  const formatList = () => {
    const tempList = [...tokenListInfo]
    const result = tempList.filter(item => item.name !== "FREN")
    result.shift()
    for(let i = 0; i < result.length; i++) {
      getTokenBalance(result[i], result, i)
    }
  }
  const handleSearch = (event) => {
    const value = event.target.value
    const list = [...tokenListInfo]
    const result = list.filter(item => item.name !== "FREN")
    var newList = result.filter(item => item.symbol.toUpperCase().includes(value.toUpperCase()) || item.address.toUpperCase().includes(value.toUpperCase()))
    setTokenInfo(newList)
  }
  const searchContent = () => {
    return(
      <div className="search-token">
          <span className="icon-search-wrapper">
            <i className="iconfont icon-search"></i>
          </span>
          {
            showBalance 
            ? <input
              className="search-input"
              onBlur={()=>setContentHeight(450)}
              onFocus={setHeight}
              placeholder={intl.get('SearchTokenPlaceholder')}
              onInput={handleSearch}
            />
            : <input
            className="search-input"
            placeholder={intl.get('SearchTokenPlaceholder')}
            onInput={handleSearch}
          />
          }
          
        </div>
    )
  }
  const setHeight = () => {
    setContentHeight(detectMobile() ? 200 : 450)
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
    getDefaultList()
    formatList()
    // getTokenList()
  }, [])
  useEffect(() => {
    setListHeight(contentHeight)
  }, [contentHeight])
  useEffect(() => {
    tokenList.unshift(defaultList)
    setTokenInfo(tokenList)
  }, [tokenList])
  return (
    <TokenListContainer>
      {
        searchContent()
      }
      {
        tokenInfo?.length &&
        <List
          width={360}
          height={listHeight}
          rowCount={tokenInfo?.length}
          rowHeight={60}
          rowRenderer={rowRenderer}
        />
      }
    </TokenListContainer>
  )
}

const TokenListContainer = styled.div`

`