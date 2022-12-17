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
  giveAwayAddress: '0x295DCc1F1DD3AB830cc648511D041f886b8dF25A',
  currentChain: '',
  showOpen: false,
  showReceiveBtn: true,
  currentChatInfo: {}
}

export default state
