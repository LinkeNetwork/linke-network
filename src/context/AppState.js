import networks from './networks'

const state = {
  networks,
  hasCreateProflie: false,
  currentNetworkInfo: {},
  hasCreateRoom: false,
  groupLists: [],
  tokenId: '',
  profileAvatar: '',
  profileId: '',
  currentProfileAddress: '',
  showShareContent: false,
  hasClickPlace: false,
  currentTabIndex: '',
  hasQuitRoom: false,
  currentAddress: '',
  showConnectNetwork: false,
  accounts: null,
  isJumpToProfile: false,
  clientInfo: null,
  showHeader: true,
  currentTokenBalance: '',
  giveAwayAddress: '0x8281236725980eFA2E26e0a12Dc2F28F689f8e58',
  currentChain: '',
  showOpen: false,
  showReceiveBtn: true,
  currentChatInfo: {}
}

export default state
