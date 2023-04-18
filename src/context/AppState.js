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
  giveAwayAddress: '0x71d17da8b8a90f94528a7557e34b30df041f278f',
  giveAwayAddressV2: '0x1ec08c106c85caa680a89f206501f227e2bde5a2',
  giveAwayAddressV3: '0x4c5da4d8a00289a2b8336926752f4c07721620ba',
  signInAddress: '0xD6425022DC33C6b5bf339AC873430b442d50D63b',
  currentChain: '',
  showOpen: false,
  getNewMsg: false,
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
  allowanceTotal: '',
  showOpenSignIcon: false,
  isGetGroupList: false
}

export default state
