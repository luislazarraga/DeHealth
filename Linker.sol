pragma solidity ^0.8.0;

interface SBTCode {
    function authorize(address, uint256, bytes memory) external returns (bool);
}

interface CajaFuerteSalud {
    function SBTConfianza(address) external view returns (uint256);
    function setSBTConfianza(address, uint256) external;
    function isAuthorizedSBT(address) external view returns (bool);
    function authorizeSBT(address) external;
    function removeSBT(address) external;
}

contract LinkerCode {
    address public cajaFuerteSaludAddress;
    address public sbtCodeAddress;

    constructor(address _cajaFuerteSaludAddress, address _sbtCodeAddress) {
        cajaFuerteSaludAddress = _cajaFuerteSaludAddress;
        sbtCodeAddress = _sbtCodeAddress;
    }

    function authorizeSBT(address _sbtAddress, uint256 _amount, bytes memory _signature) external {
        bytes32 message = prefixed(keccak256(abi.encodePacked(msg.sender, _sbtAddress, _amount)));
        require(SBTCode(sbtCodeAddress).authorize(_sbtAddress, _amount, _signature), "Invalid SBT signature");
        require(CajaFuerteSalud(cajaFuerteSaludAddress).SBTConfianza(_sbtAddress) > 0, "SBT is not trusted");
        require(CajaFuerteSalud(cajaFuerteSaludAddress).isAuthorizedSBT(_sbtAddress), "SBT is not authorized for this service");
        CajaFuerteSalud(cajaFuerteSaludAddress).authorizeSBT(_sbtAddress);
    }

    function revokeSBT(address _sbtAddress) external {
        require(msg.sender == _sbtAddress || CajaFuerteSalud(cajaFuerteSaludAddress).SBTConfianza(_sbtAddress) == 0, "Unauthorized");
        CajaFuerteSalud(cajaFuerteSaludAddress).removeSBT(_sbtAddress);
    }

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    function setSBTConfianza(address _sbtAddress, uint256 _confianza) external {
        require(msg.sender == cajaFuerteSaludAddress, "Unauthorized");
        CajaFuerteSalud(cajaFuerteSaludAddress).setSBTConfianza(_sbtAddress, _confianza);
    }

    function getSBTConfianza(address _sbtAddress) external view returns (uint256) {
        require(msg.sender == cajaFuerteSaludAddress, "Unauthorized");
        return CajaFuerteSalud(cajaFuerteSaludAddress).SBTConfianza(_sbtAddress);
    }

    function isAuthorizedSBT(address _sbtAddress) external view returns (bool) {
        require(msg.sender == cajaFuerteSaludAddress, "Unauthorized");
        return CajaFuerteSalud(cajaFuerteSaludAddress).isAuthorizedSBT(_sbtAddress);
    }
}
