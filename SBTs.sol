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
    mapping (address => bool) private _hasSBT;
    CajaFuerteSalud private cajaFuerteContract;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function issue(address to) external returns (uint256) {
        require(!_hasSBT[msg.sender], "You already have an SBT");
        _currentTokenId++;
        uint256 newTokenId = _currentTokenId;
        _safeMint(to, newTokenId);
        _burnAuth[newTokenId] = BurnAuth.Both;
        _hasSBT[msg.sender] = true;
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

    

    
}