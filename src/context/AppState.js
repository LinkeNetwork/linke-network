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
  giveAwayAddressV2: '0x2B0093E03A4362615E01c251E5e0E697B0f0cdbC',
  signInAddress: '0xD6425022DC33C6b5bf339AC873430b442d50D63b',
  currentChain: '',
  showOpen: false,
  showReceiveBtn: true,
  currentChatInfo: {},
  transactionRoomHash: '',
  groupType: '',
  nftAddress: '',
  continueMint: false,
  canMint: false,
  hiddenCountDown: true,
  isCancelCheckIn: false,
  hasEndStack: false,
  canUnstake: false,
  stakedDays: 0,
  tokenAddress: '',
  allowanceTotal: ''
}

export default state
