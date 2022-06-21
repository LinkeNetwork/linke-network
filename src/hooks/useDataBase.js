import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import useChain from './useChain'
import * as zango from "zangodb"
export default function useDataBase() {
  const history = useHistory()
  const { getChainInfo } = useChain()
  const setDataBase = async() => {
    const networkInfo = await getChainInfo()
    const currNetwork = networkInfo?.name
    const address = history.location.pathname.split('/chat/')[1]
    console.log(address, 'address====/')
    const dbname = 'chats-'+ (currNetwork ? currNetwork : '') + '-' + address
    let db = new zango.Db(dbname, 2, {chatInfos:['id', 'room']})
    let collection = db.collection('chatInfos')
    console.log(collection, 'collection=====')
    return db
  }
  return { setDataBase }
}