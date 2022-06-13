import React from 'react'
import styled from 'styled-components'
import useIntl from '../../hooks/useIntl'

export default function LanguageSwitch() {
const {localesList, lang, onChange } = useIntl()
return (
    <LanguageSwitchContainer>
      {
        localesList.map((item, index) => {
          return <div className={lang === item.value ? 'active' : ''} onClick={ ()=> onChange(item.value)} key={ index }>{ item.name }</div>
        })
      }
    </LanguageSwitchContainer>
  )
}
const LanguageSwitchContainer = styled.div`
  display: flex;
  margin-left: 20px;
  justify-content: space-around;
  align-items: center;
  div:first-child{
    border-right: 1px solid #888;
    content: "";
    right: 0;
    top: 0;
    bottom: 0;
  }
  div{
    cursor: pointer;
    font-size: 12px;
    padding: 0 6px;
    &.active {
      color: #FFCE00;
    }
  }
  @media (max-width: 767px) {
    display: none
  }
`