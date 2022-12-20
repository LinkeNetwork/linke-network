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
  giveAwayAddress: '0x71d17da8b8a90F94528A7557E34b30Df041F278f',
  currentChain: '',
  showOpen: false,
  showReceiveBtn: true,
  currentChatInfo: {},
  transactionRoomHash: ''
}

export default state
