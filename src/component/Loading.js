import React from 'react'
import styled from 'styled-components'
export default function Loading() {
  return (
    <LoadingContainer>
      <span className='iconfont icon-loading'></span>
    </LoadingContainer>
  )
}
const LoadingContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 9999;
  background-color: rgba(128, 128, 128, 0.7);
  .icon-loading {
    top: 50%;
    position: absolute;
    font-size: 40px;
    left: 50%;
  }
`