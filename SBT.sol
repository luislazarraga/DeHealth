// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

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

contract SBT is ERC721Enumerable  {
    uint256 private _currentTokenId = 0;

    mapping(uint256 => address[]) public _SBTApprovals;

    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {}

    function issue() external returns (uint256) {
        require(balanceOf(msg.sender) < 1, "Solo puedes tener un SBT");
        _currentTokenId++;
        uint256 newTokenId = _currentTokenId;
        _safeMint(msg.sender, newTokenId);
        return newTokenId;
    }

    function walletOfOwner(address _owner) public view returns (uint256) {
        uint256 _tokenId = 0;
        if(balanceOf(_owner) > 0)_tokenId = tokenOfOwnerByIndex(_owner, 0);
        return _tokenId;
    }

    function amIFam(address origin,uint256 trusterSBT) public view returns (bool) {
        for (uint256 i = 0; i < getApprovedSBT(trusterSBT).length; ++i) {
            if (origin == getApprovedSBT(trusterSBT)[i]) {
                return true;
            }
        }
        return false;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override {
        require(from == address(0), "Los SBT no son transferibles");
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function approveSBT(address to, uint256 tokenId) internal {
        _SBTApprovals[tokenId].push(to);
        emit Approval(ERC721.ownerOf(tokenId), to, tokenId);
    }

    function getApprovedSBT(uint256 tokenId)
        internal
        view
        returns (address[] memory)
    {
        _requireMinted(tokenId);
        return _SBTApprovals[tokenId];
    }

    function deleteFam(uint256 _soulBoundToken)
        public
        hasSBT(_soulBoundToken)
    {
        for (uint256 i = 0; i < getApprovedSBT(_soulBoundToken).length; i++) {
            _SBTApprovals[walletOfOwner(msg.sender)].pop();
        }
    }

    function trustYourFam(address _yourFriend, uint256 _soulBoundToken)
        public
        hasSBT(_soulBoundToken)
        returns (bool)
    {
        require(
            _SBTApprovals[walletOfOwner(msg.sender)].length <= 2,
            "Has concecido ya los dos permisos extraordinarios"
        );
        for (uint256 i; i< _SBTApprovals[walletOfOwner(msg.sender)].length; i++)
        {
            if (_SBTApprovals[walletOfOwner(msg.sender)][i] == _yourFriend)
            {
                return false;
            }
        }
        approveSBT(_yourFriend, walletOfOwner(msg.sender));
        return true;
    }

    modifier hasSBT(uint256 _soulBoundToken) {
        require(
            walletOfOwner(msg.sender) == _soulBoundToken,
            "No tienes ningun SBT en tu cartera"
        );
        _;
    }
}