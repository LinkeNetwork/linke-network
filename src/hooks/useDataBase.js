import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import useChain from './useChain'
import * as zango from "zangodb"
import { getLocal } from '../utils'
export default function useDataBase() {
  const history = useHistory()
  const { getChainInfo } = useChain()
  const setDataBase = async() => {
    const networkInfo = await getChainInfo()
    const currNetwork = networkInfo?.name
    const dbname = 'chats-'+ (currNetwork ? currNetwork : '') + '-' + getLocal('account')
    let db = new zango.Db(dbname, 2, {chatInfos:['id', 'room', 'block']})
    let collection = db.collection('chatInfos')
    console.log(collection, 'collection=====')
    return db
  }
  return { setDataBase }
}