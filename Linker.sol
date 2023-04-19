pragma solidity ^0.8.0;

interface SBTCode {
    function getSBTConfianza(address) external view returns (uint);
}

interface CajaFuerteSalud {
    function setCajaFuerte(address _user, bytes32 _key, uint _value) external;
    function getCajaFuerte(address _user, bytes32 _key) external view returns (uint);
}

contract Linker {
    address public sbtCodeAddress;
    address public cajaFuerteSaludAddress;

    SBTCode private sbtCode;
    CajaFuerteSalud private cajaFuerteSalud;

    constructor(address _sbtCodeAddress, address _cajaFuerteSaludAddress) {
        sbtCodeAddress = _sbtCodeAddress;
        cajaFuerteSaludAddress = _cajaFuerteSaludAddress;

        sbtCode = SBTCode(sbtCodeAddress);
        cajaFuerteSalud = CajaFuerteSalud(cajaFuerteSaludAddress);
    }

    function getSBTConfianza() public view returns (uint) {
        return sbtCode.getSBTConfianza(msg.sender);
    }

    function setCajaFuerte(bytes32 _key, uint _value) public {
        require(getSBTConfianza() >= 5, "SBTConfianza insufficient");

        cajaFuerteSalud.setCajaFuerte(msg.sender, _key, _value);
    }

    function getCajaFuerte(bytes32 _key) public view returns (uint) {
        require(getSBTConfianza() >= 5, "SBTConfianza insufficient");

        return cajaFuerteSalud.getCajaFuerte(msg.sender, _key);
    }

    function setCajaFuerteWithSBT(bytes32 _key, uint _value, bytes32 _sbt) public {
        require(keccak256(abi.encodePacked(_sbt)) == keccak256(abi.encodePacked(_key)), "Invalid SBT");

        setCajaFuerte(_key, _value);
    }

    function getCajaFuerteWithSBT(bytes32 _key, bytes32 _sbt) public view returns (uint) {
        require(keccak256(abi.encodePacked(_sbt)) == keccak256(abi.encodePacked(_key)), "Invalid SBT");

        return getCajaFuerte(_key);
    }
}
