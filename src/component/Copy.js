import React from 'react'
import useCopyClipboard from '../hooks/useCopyCilpboard'

export default function CopyHelper(props) {
  const [isCopied, setCopied] = useCopyClipboard()
  return (
    <div className="f-c button-link" onClick={() => setCopied(props.toCopy)}>
      {isCopied ? (
        <div>
          <i className="ico-check-circle" />
          Copied
        </div>
      ) : (
          <i className="iconfont icon-fuzhiwenjian" />
      )}
      {isCopied ? '' : props.children}
    </div>
  )
}
