pragma solidity ^0.8.0;

import "./IERC5484.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SBTCode is ERC721, Ownable, IERC5484 {
    uint256 private _currentTokenId = 0;
    mapping (uint256 => BurnAuth) private _burnAuth;
    mapping (address => bool) private _hasSBT;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function issue(address to, BurnAuth burnAuth) external returns (uint256) {
        require(!_hasSBT[msg.sender], "You already have an SBT");
        _currentTokenId++;
        uint256 newTokenId = _currentTokenId;
        _safeMint(to, newTokenId);
        _burnAuth[newTokenId] = burnAuth.Both;
        _hasSBT[msg.sender] = true;

        emit Issued(owner(), to, newTokenId, BurnAuth.Both);

        return newTokenId;
    }

    function burnAuth(uint256 tokenId) external view override returns (BurnAuth) {
        require(_exists(tokenId), "Token does not exist");
        return _burnAuth[tokenId];
    }

    
}
