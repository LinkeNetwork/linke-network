import { useState } from "react";
import { getLocal } from "../utils";

export default function usePrivateMessage() {
  const [decryptedMessage, setDecryptedMessage] = useState()
  const getDecryptedMessage = (message) => {
    window.ethereum
    .request({
      method: 'eth_decrypt',
      params: [message, getLocal('account')],
    })
    .then((decryptedMessage) =>
      console.log('The decrypted message i====:', decryptedMessage)
    )
    .catch((error) => console.log(error.message));
  }
  return { getDecryptedMessage}
}