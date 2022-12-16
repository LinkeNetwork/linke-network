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
  giveAwayAddress: '0x5413cDd5c8194774F4d7170d05598E29933240CD',
  currentChain: '',
  showOpen: false,
  showReceiveBtn: true,
  currentChatInfo: {}
}

export default state
