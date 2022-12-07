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
  giveAwayAddress: '0xe9FE40002E008a72DA6c88d20dC9F38656dF4315',
  currentChain: '',
  currentChatInfo: {}
}

export default state
