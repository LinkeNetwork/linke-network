import * as zango from "zangodb"
import { getLocal } from '../utils'
export default function useDataBase() {
  const setDataBase = async() => {
    const currNetwork = getLocal('network')
    if(currNetwork && getLocal('account')) {
      const dbname = 'chats-'+ (currNetwork ? currNetwork : '') + '-' + getLocal('account')
      let db = new zango.Db(dbname, 2, {chatInfos:['id', 'room']})
      return db
    }
  }
  return { setDataBase }
}