import React from 'react'
import logo from '../assets/images/favicon.ico'
import styled from 'styled-components'
import PageContainer from './PageContainer'

export default function PageLoading() {
  return (
    <PageContainer>
      <PageInto className="page-load">
        <div className="page-loading img" style={{ backgroundImage: `url(${logo})` }} />
      </PageInto>
    </PageContainer>
  )
}
const PageInto = styled.div`
  height:100vh
`