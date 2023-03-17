import networks from './networks'

const state = {
  networks,
  hasCreateProflie: false,
  currentNetworkInfo: {},
  hasCreateRoom: false,
  groupLists: [],
  tokenId: '',
  profileAvatar: '',
  chainId: '',
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
  signInClientInfo: null,
  showHeader: true,
  currentTokenBalance: '',
  giveAwayAddress: '0x71d17da8b8a90F94528A7557E34b30Df041F278f',
  signInAddress: '0xD6425022DC33C6b5bf339AC873430b442d50D63b',
  currentChain: '',
  showOpen: false,
  showReceiveBtn: true,
  currentChatInfo: {},
  transactionRoomHash: '',
  groupType: '',
  nftAddress: '',
  hasOpenedSignIn: false
}

export default state
