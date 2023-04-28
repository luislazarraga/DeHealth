// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC5484.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CajaFuerteSalud.sol";

contract SBTCode is ERC721Enumerable, IERC5484 {
    uint256 private _currentTokenId = 0;
    mapping (uint256 => BurnAuth) private _burnAuth;

    CajaFuerteSalud private cajaFuerteContract;
    mapping (address => address[]) private famAndFriends;


    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function issue(address to) external hasSBT returns (uint256) {
        _currentTokenId++;
        uint256 newTokenId = _currentTokenId;
        _safeMint(to, newTokenId);
        _burnAuth[newTokenId] = BurnAuth.Both;
        return newTokenId;
    }

    function burnAuth(uint256 tokenId) external view override returns (BurnAuth) {
        require(_exists(tokenId), "Token does not exist");
        return _burnAuth[tokenId];
    }

    function walletOfOwner(address _owner) public view returns (uint256) {
        uint256 _tokenId = tokenOfOwnerByIndex(_owner, 0);
        return _tokenId;
    }

    function trustYourFam(address _yourFriend) public hasSBT{
        require(famAndFriends[msg.sender].length <= 2, "Has concecido ya los dos permisos extraordinarios");
        approve(_yourFriend, walletOfOwner(msg.sender));
        famAndFriends[msg.sender].push(_yourFriend);
    }     

    modifier hasSBT() {
        require(balanceOf(msg.sender) > 0 , "No tienes ningun SBT en tu cartera");
        _;
    }

}