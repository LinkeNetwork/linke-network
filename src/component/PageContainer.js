import React from 'react'
import styled from 'styled-components'

const PageContainer = styled.div`
  min-height:calc(100vh - 180px);
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function Container({children,...rest}) {
  return (
    <PageContainer {...rest}>
      {children}
    </PageContainer>
  )
}
