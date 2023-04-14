import { RED_PACKET, RED_PACKET_V2 } from '../abi'
const networks =  [
  {
    name: "ETHF",
    symbol: "ETHF",
    decimals: 18,
    chainId: 513100,
    rpcUrls: ["https://rpc.etherfair.org"],
    chainName: "Ethereum Fair",
    blockExplorerUrls: ["https://www.oklink.com/en/ethf"],
    ProfileAddress: "0x68A92c93807E8E07Ae1A89F59D7C0A5e877C57b0",
    GroupProfileAddress: "0x07B588De7Ba7415b033bdD2Ab6Bb286Aed016F7e",
    APIURL: "https://graph.etherfair.org/subgraphs/name/LinkeNetwork/linke-network-subgraph",
    signInGraphUrl: "https://graph.etherfair.org/subgraphs/name/LinkeNetwork/linke-network-plugins-subgraph",
    PrivateChatAddress: '0x55Ccf906741dF31a8663B8a5a2bA65FA9756468f',
    addressList: {
      '0x71d17da8b8a90f94528a7557e34b30df041f278f': {
        graphUrl: "https://graph.etherfair.org/subgraphs/name/LinkeNetwork/linke-network-subgraph",
        reaPacket: RED_PACKET,
        giveaway: 'giveaways',
        version: "v1",
        address: "0x71d17da8b8a90f94528a7557e34b30df041f278f"
      },
      '0x1ec08c106c85caa680a89f206501f227e2bde5a2': {
        graphUrl: "https://graph.etherfair.org/subgraphs/name/LinkeNetwork/linke-network-subgraph",
        reaPacket: RED_PACKET,
        giveaway: 'giveawayV2S',
        version: "v2",
        address: "0x1ec08c106c85caa680a89f206501f227e2bde5a2"
      },
      '0x4c5da4d8a00289a2b8336926752f4c07721620ba': {
        graphUrl: "https://graph.etherfair.org/subgraphs/name/LinkeNetwork/linke-network-plugins-subgraph",
        reaPacket: RED_PACKET_V2,
        giveaway: 'giveawayV2S',
        version: "v3",
        address: "0x4c5da4d8a00289a2b8336926752f4c07721620ba"
      }
    },
    versionList: {
      v1: {
        address: '0x71d17da8b8a90f94528a7557e34b30df041f278f',
        graphUrl: "https://graph.etherfair.org/subgraphs/name/LinkeNetwork/linke-network-subgraph",
        reaPacket: RED_PACKET,
        giveaway: 'giveaways',
        version: "v1",
      },
      v2: {
        address: '0x1ec08c106c85caa680a89f206501f227e2bde5a2',
        graphUrl: "https://graph.etherfair.org/subgraphs/name/LinkeNetwork/linke-network-subgraph",
        reaPacket: RED_PACKET_V2,
        giveaway: 'giveawayV2S',
        version: "v2",
      },
      v3: {
        address: '0x4c5da4d8a00289a2b8336926752f4c07721620ba',
        graphUrl: "https://graph.etherfair.org/subgraphs/name/LinkeNetwork/linke-network-plugins-subgraph",
        reaPacket: RED_PACKET_V2,
        giveaway: 'giveawayV2S',
        version: "v3"
      }
    }
  }
  // {
  //   name: "CZZ",
  //   symbol: "CZZ",
  //   decimals: 18,
  //   chainId: 2019,
  //   rpcUrls: ["https://node.classzz.com"],
  //   chainName: "ClassZZ Network",
  //   blockExplorerUrls: ["https://explorer.classzz.com/"],
  //   ProfileAddress: "0x717c7c5FC78E97d56edD8a28bB2cf85c66747DcC",
  //   GroupProfileAddress: "0x8281236725980eFA2E26e0a12Dc2F28F689f8e58",
  //   APIURL: "https://node.classzz.com/subgraphs/name/LinkeNetwork/linke-network-subgraph",
  //   PrivateChatAddress: '0xD6425022DC33C6b5bf339AC873430b442d50D63b'
  // },
  // {
  //   name: "REI",
  //   symbol: "REI",
  //   decimals: 18,
  //   chainId: 47805,
  //   rpcUrls: ["https://rpc.rei.network/"],
  //   chainName: "REI Network",
  //   blockExplorerUrls: ["https://scan.rei.network/"],
  //   ProfileAddress: "0xd31481d02212bA8341EbA8caA624923A3B360151",
  //   GroupProfileAddress: "0xdE0c6615C559dd8c055f2345F4D8151103c09543",
  //   APIURL: "https://linke.network/subgraphs/name/LinkeNetwork/linke-network-subgraph",
  //   PrivateChatAddress: '0x58Fd22715028A0365cC17e489579C6e4fD57cde4'
  // }
]

export default networks;
