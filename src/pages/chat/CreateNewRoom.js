import { useState } from "react"
import { create } from 'ipfs-http-client'
import styled from "styled-components"
import useGlobal from '../../hooks/useGlobal'
import useChain from '../../hooks/useChain'
import { getDaiWithSigner, getLocal } from '../../utils'
import { GROUP_FACTORY_ABI } from '../../abi'
import Loading from '../../component/Loading'
import multiavatar from '@beeprotocol/beemultiavatar/esm'
import {ethers} from "ethers";
import Select from 'react-select'
const client = create('https://ipfs.infura.io:5001')
export default function CreateNewRoom(props) {
  const { setState } = useGlobal()
  const { createNewRoom, hiddenCreateInfo} = props
  const { getChainInfo } = useChain()
  const [name, setName] = useState()
  const [shoMask, setShoMask] = useState(false)
  const [describe, setDescribe] = useState()
  const [currentGroup, setCurrentGroup] = useState()
  const [currentGroupType, setCurrentGroupType] = useState()
  const typeList = [
    {
      label: 'Public Group',
      value: 1
    },
    {
      label: 'Subscribe Group',
      value: 2
    },
  ]
  const changeNameInput = (e) => {
    setName(e.target.value)
  }
  const changeDescribeInput = (e) => {
    setDescribe(e.target.value)
  }
  const handleCreate = async() => {
    setShoMask(true)
    const avatar = getLocal('account') + name
    const info = await client.add(multiavatar(avatar))
    const avatarUrl = `https://infura-ipfs.io/ipfs/${info.path}`
    const network = await getChainInfo()
    console.log(avatarUrl, 'avatarUrl=====')
    const name_ = 'group'
    const symbol_ = 'GROUP'
    const params = ethers.utils.defaultAbiCoder.encode(["string", "string", "string", "string", "string"], [name, describe, avatarUrl, name_, symbol_]);
    const tx = await getDaiWithSigner(network?.GroupProfileAddress, GROUP_FACTORY_ABI).mint(currentGroupType, params)
    let callback = await tx.wait()
    hiddenCreateInfo()
    setState({
      hasCreateRoom: true
    })
    createNewRoom(callback.logs[0].address, name)
    console.log('callback', callback, callback.logs[0].address)
    console.log(tx)
  }
  const handleSelectChange = (val) => {
    console.log(val, 'handleSelectChange')
    setCurrentGroup(val)
    setCurrentGroupType(val.value)
  }
  return (
    <CreateNewRoomContainer>
      <div className="form-wrap">
        <legend className="name">Name
          <span>Required</span>
        </legend>
        <input
          type="text"
          placeholder=""
          className="form-control form-control-lg"
          value={name}
          onChange={val => changeNameInput(val)}
        />
      </div>
      <div className="form-wrap">
        <legend className="name">Describe
          <span>Required</span>
        </legend>
        <textarea
          type="text"
          className="form-control form-control-lg"
          placeholder=""
          value={describe}
          onChange={val => changeDescribeInput(val)}
        />
      </div>
      <div className="form-wrap">
        <legend className="name">Room Type
          <span>Required</span>
        </legend>
        <Select
          value={currentGroup}
          onChange={handleSelectChange}
          options={typeList}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: '#dee2e6',
              primary: '#333',
            },
          })}
        />
      </div>
      <button className="submit-btn btn btn-lg btn-primary" onClick={() => handleCreate()}>
        Create New RoomName
      </button>
      {
        shoMask &&
        <Loading />
      }
    </CreateNewRoomContainer>
  )
}
const CreateNewRoomContainer = styled.div`
padding-bottom: 20px;
.form-wrap {
  margin: 15px 0;
  .name {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    span {
      margin-left: 10px;
      background: rgba(0,0,0,.125);
      border-radius: 20px;
      padding: 0 0.5rem;
      font-size: 12px;
      font-weight: 500;
    }
  }
}
.submit-btn{
  width: 100%;
}
`