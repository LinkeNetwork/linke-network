import React, { Component, useEffect, useState } from 'react'
import { Picker } from 'emoji-mart'
import styled from "styled-components"
import emoji from 'emoji-mart/dist-es/components/emoji/emoji'
import { detectMobile } from '../../utils'
import useGlobal from '../../hooks/useGlobal'
export default function ChatInputBox(props) {
  const { startChat, clearChatInput, resetChatInputStatus, handleShowPlace, handleAwardBonus } = props
  const { setState } = useGlobal()
  const [clientHeight, setClientHeight] = useState()
  const [editorArea, setEditorArea] = useState(null)
  const [emoji, setEmoji] = useState()
  const [editorBacker, setEditorBacker] = useState(null)
  const [textCounter, setTextCounter] = useState(null)
  const [limitCnt, setLimitCnt] = useState(2048)
  const [isComposing, setIsComposing] = useState(false)
  const [chatText, setChatText] = useState()
  const [canSendMessage, setCanSendMessage] = useState(true)
  const [isClickSend, setIsClickSend] = useState(false)
  const [lastEditRange, setLastEditRange] = useState(null)
  const [showPicker, setShowPicker] = useState(false)

  const initTextArea = () => {
    var editorArea = document.querySelector('.editor-area')
    var editorBacker = document.querySelector('.editor-backer')
    var counter = document.querySelector('.counter')
    var limitCnt = 2048
    editorArea.addEventListener('compositionstart', () => {
      setIsComposing(true)
    })
    editorArea.addEventListener('compositionend', () => {
      setIsComposing(false)
      let text = getLength(editorArea.innerText)
      setCounter(limitCnt - text)
    })
    setEditorArea(editorArea)
    setEditorBacker(editorBacker)
    setTextCounter(counter)
  }

  const getLength = (val) => {
    var bytesCount = 0
    if (val && val.length > 0) {
      var str = String(val)
      for (var i = 0, n = str.length; i < n; i++) {
        var c = str.charCodeAt(i)
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
          bytesCount += 1
        } else {
          bytesCount += 2
        }
      }
    }
    return bytesCount
  }

  const setCounter = (cnt) => {
    textCounter.innerHTML = 'Characters left:' + cnt
    if (cnt < 0) {
      textCounter.classList.add('max-reached')
    } else {
      textCounter.classList.remove('max-reached')
      setCanSendMessage(true)
    }
  }

  const initClientHeight = () => {
    let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
    setClientHeight(clientHeight)
    window.addEventListener('resize', resize)
  }

  const resize = () => {
    let height = document.documentElement.clientHeight || document.body.clientHeight
    if (clientHeight > height) {
      inputClickHandle()
    }
  }

  const inputCompose = (e) => {
    setLastEditRange(window.getSelection().getRangeAt(0))
    if (editorArea.innerHTML === '<div><br></div>' ||
      editorArea.innerHTML === '<br>' ||
      editorArea.innerHTML === '') {
      editorArea.classList.add('is-showPlaceholder')
    } else {
      editorArea.classList.remove('is-showPlaceholder')
    }

    let currentCnt = getLength(editorArea.innerText.trim())
    let text = editorArea.innerText.trim()
    setChatText(text)
    let remainingCnt = limitCnt - currentCnt
    // debugger
    if (currentCnt > limitCnt) {
      setCanSendMessage(false)
      let allowedText = substr(text, limitCnt)
      var refusedText = text.substring(allowedText.length)
      editorBacker.innerHTML = allowedText + '<em>' + refusedText + '</em>'
    } else {
      editorBacker.innerHTML = ''
    }
    if (!isComposing) {
      setCounter(remainingCnt)
    }
  }
  const substr = (str, len) => {
    if (!str || !len) return ''
    var a = 0
    var i = 0
    var temp = ''
    for (i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 255) {
        a += 2
      } else {
        a++
      }
      if (a > len) return temp
      temp += str.charAt(i)
    }
    return str
  }
  const onClickPicker = () => {
    setShowPicker(!showPicker)
  }
  const getTextRange = (emoji) => {
    var edit = document.getElementById('contenteditablediv')
    edit.focus()
    var selection = getSelection()
    if (lastEditRange) {
      selection.removeAllRanges()
      selection.addRange(lastEditRange)
    }
    console.log(selection.anchorNode.nodeName, 'selection.anchorNode.nodeName===')
    if (selection.anchorNode.nodeName !== '#text') {
      var emojiText = document.createTextNode(emoji.native)
      if (edit.childNodes.length > 0) {
        for (var i = 0; i < edit.childNodes.length; i++) {
          if (i === selection.anchorOffset) {
            edit.insertBefore(emojiText, edit.childNodes[i])
          }
        }
      } else {
        edit.appendChild(emojiText)
      }
      let range = document.createRange()
      range.selectNodeContents(emojiText)
      range.setStart(emojiText, emojiText.length)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      let range = selection.getRangeAt(0)
      var textNode = range.startContainer;
      var rangeStartOffset = range.startOffset;
      textNode.insertData(rangeStartOffset, emoji.native)
      range.setStart(textNode, rangeStartOffset + emoji.native.length)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    setLastEditRange(selection.getRangeAt(0))
  }
  const addEmoji = (emoji) => {
    getTextRange(emoji)
    setEmoji(emoji.native)
    setChatText(chatText + '' + emoji.native)
  }

  const onKeyPress = (e) => {
    if (e.which === 13) {
      sendText()
    }
  }
  const sendText = () => {
    if (!canSendMessage) return
    setChatText('')
    setIsClickSend(true)
    startChat(chatText)
  }
  const inputClickHandle = () => {
    setShowPicker(false)
  }
  const clearInput = () => { 
    var editorArea = document.querySelector('.editor-area')
    var counter = document.querySelector('.counter')
    if (isClickSend) {
      editorArea.innerHTML = ''
      counter.innerHTML = 'Characters left:' + 2048
      setIsClickSend(false)
      resetChatInputStatus()
    }
  }
  const handlePlaceClick = () => {
    setState({
      hasClickPlace: true
    })
    handleShowPlace()
  }
  useEffect(() => {
    clearInput()
  }, [clearChatInput])
  useEffect(() => {
    initClientHeight()
    initTextArea()
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <ChatInputBoxContanier>
      <div className={`chat-bottom ${!detectMobile() ? 'chat-bottom-pc' : ''}`}>
        {
          showPicker &&
          <Picker onSelect={addEmoji} native={true} />
        }
        <div className='chat-bottom-icon' id="bottomChat">
          <div className='btn btn-icon btn-sm btn-light rounded-circle' id='buttonSmile' onClick={onClickPicker}>
            <span className='iconfont icon-smile' id="iconSmile"></span>
          </div>
          {/* <div className='btn btn-icon btn-sm btn-light rounded-circle' onClick={handlePlaceClick}>
            <span className='iconfont icon-yanse'></span>
          </div> */}
          <div className='btn btn-icon btn-sm btn-light rounded-circle' onClick={handleAwardBonus}>
            <span className='iconfont icon-hongbao'></span>
          </div>
        </div>
        <div className={`rich-editor chat-input ${!detectMobile() ? 'chat-input-pc' : 'chat-input-client'}`}>
          <div className={`wrapper ${!detectMobile() ? 'wrapper-pc' : 'wrapper-client'}`}>
            <div className="editor-area"
              id="contenteditablediv"
              contentEditable="true"
              onInput={inputCompose}
              onKeyPress={onKeyPress}
              onClick={inputClickHandle}
              suppressContentEditableWarning="true"
              placeholder={emoji ? '' : 'Your Message Goes in Here'}
            >
              {/* <span>{chatText}</span> */}
            </div>
            <div className="editor-backer"></div>
          </div>
        </div>
        <div className={`chat-bottom-send ${canSendMessage ? '' : 'not-send'}`} onClick={sendText}>
          <div className='btn btn-icon btn-sm btn-primary rounded-circle '>
            <span className='iconfont icon-navigation-2'></span>
          </div>
        </div>
        <div className='chat-tips counter'>
          Characters left: 2048
        </div>
      </div>
    </ChatInputBoxContanier>

  )
}
const ChatInputBoxContanier = styled.div`
position: relative;
.rich-editor {
  text-align: left;
  display: block;
  // width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee2e6;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0.375rem;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}
.chat-input {
  // height: 36px;
  overflow-y: auto;
  resize: none;
  margin-left: 7.6rem;
  // max-height: 12rem;
  padding: 0.375rem 2.5rem 0.375rem 1rem;
  border-radius: 1rem;
  // height: auto;
  &-client, &-pc {
    min-height: 22px;
    max-height: 211px;
    .editor-area, .editor-backer {
      min-height: 22px;
      max-height: 211px;
    }
  }
  // &-pc {
  //   min-height: 71px;
  //   max-height: 211px;
  //   .editor-area, .editor-backer {
  //     min-height: 71px;
  //     max-height: 211px;
  //   }
  // }
}
.wrapper {
  position: relative;
  width: 100%;
  z-index: 1;
  // &-pc {
  //   min-height: 80px;
  //   .editor-area {
  //     min-height: 80px;
  //   }
  // }
}
.editor-area, .editor-backer {
  width: 100%;
  height: auto;
  // min-height: 116px;

  font-size: 14px;
  line-height: 20px;
  word-wrap: break-word;
  word-break: break-all;
  background: transparent;
}
.editor-area {
  outline: none;
  border: none;

}
.editor-area.is-showPlaceholder[contenteditable=true]:before {
  content: attr(placeholder);
  color: #ccd6dd;
  position: absolute;
}
.editor-backer {
  position: absolute;
  left: 0;
  top: 0;
  color: transparent;
  z-index: -1;
}
.editor-backer em {
  background-color: rgb(251, 159, 168);
  font-style: normal;
  font-size: 14px;
  line-height: 20px;
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
}

.counter {
  float: right;
  color: #657786;
  font-size: 14px;
  line-height: 20px;
  text-align: right;
  user-select: none;
}
.counter.max-reached {
  color: rgb(244, 33, 46);
}
.chat-bottom {
  background-color: #FAFAFA;
  padding: 0.5rem 1rem 0rem 1rem;
  border-top: 1px solid #dee2e6;
  // position: relative;
  .chat-tips {
    font-size: 12px;
    color: #6c757d;
    margin: 10px 0;
    text-align: left;
    &-error {
      color: red;
    }
  }
  .emoji-mart {
    position: absolute;
    left: 20px;
    top: -420px;
  }
  &-pc {
    .chat-bottom-icon {
      top: 0.8rem;
    }
    .chat-bottom-send {
      bottom: 2.6rem;
    }
    .emoji-mart {
      bottom: 140px;
    }
  }
  ::-webkit-scrollbar-track {
    margin: 10px;
  }
  .chat-bottom-icon {
    position: absolute;
    left: 1.2rem;
    top: 0.6rem;
    display: flex;
    align-items: center;
    .btn-light {
      margin-right: 5px
    }
  }
  .chat-bottom-send {
    position: absolute;
    right: 1.2rem;
    bottom: 2.6rem;
    &.not-send {
      div {
        background-color: #dee2e6;
        border-color: #dee2e6;
        cursor: not-allowed;
      }
    }
  }
}

`