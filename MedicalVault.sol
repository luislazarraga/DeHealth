// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SBTCode.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";


contract CajaFuerteSalud {
    
    address public SBTokenOwner;
    
    address public owner;

    SBTCode private sbtContract;

    constructor(SBTCode _sbtContract) {
        sbtContract = _sbtContract;
        SBTokenOwner = sbtContract.ownerOf(_sbtContract.walletOfOwner(msg.sender));
    }

    struct Registro {
        string condicionesSalud;
        string registroMedico;
        string medicamentos;
        string situacionActual;
    }

    mapping(address => bool) private hasVault;
    mapping(uint256 => Registro[]) private cajaFuerteRegistros;

    function crearRegistroEnCajaFuerte(string memory condicionesSalud, string memory registroMedico, string memory medicacion, string memory situacionActual, uint256 _soulBoundToken) public hasSBT(_soulBoundToken) {
        require(!hasVault[msg.sender], "The user has not registered their medical record yet");
        Registro memory registro = Registro(condicionesSalud, registroMedico, medicacion, situacionActual);
        cajaFuerteRegistros[sbtContract.walletOfOwner(msg.sender)].push(registro);
        hasVault[msg.sender] = true;
    }


    function recuperarRegistro(uint256 index, uint256 _soulBoundToken) public view hasSBT(_soulBoundToken) returns (string memory, string memory, string memory, string memory)  {
        require(cajaFuerteRegistros[sbtContract.walletOfOwner(msg.sender)].length > 0, "No hay registros medicos de este paciente");
        Registro memory registro = cajaFuerteRegistros[sbtContract.walletOfOwner(msg.sender)][index];
        return (registro.condicionesSalud, registro.registroMedico, registro.medicamentos, registro.situacionActual);
    }

    function recuperarVault(uint256 _soulBoundToken) public view hasSBT(_soulBoundToken) returns (Registro[] memory) {
        require(cajaFuerteRegistros[sbtContract.walletOfOwner(msg.sender)].length > 0, "No hay registros medicos de este paciente");
        Registro[] memory registros = cajaFuerteRegistros[sbtContract.walletOfOwner(msg.sender)];
        return registros;
    }

    function recuperarVaultAjeno(uint256 _soulBoundToken) public view hasSBT(_soulBoundToken){
        require(cajaFuerteRegistros[_soulBoundToken].length > 0, "No hay registros medicos de este paciente");
        require(sbtContract.amIFam(_soulBoundToken), "El duenno de este SBT no confia en ti");
         Registro[] memory registros = cajaFuerteRegistros[sbtContract.walletOfOwner(msg.sender)];
        return registros;
    }

    modifier hasSBT(uint256 _soulBoundToken) {
        require(sbtContract.balanceOf(msg.sender) > 0 || sbtContract.amIFam(_soulBoundToken), "No tienes potestad sobre este SBT o no tienes ningun SBT en tu cartera");
        _;
    }

    modifier friendSBT(uint256 _trusterSBT) {
        
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this operation");
        _;
    }

    function recoverSigner(bytes32 _messageHash, bytes memory _signature) internal pure returns (address) {
        require(_signature.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(_signature, 0x20))
            s := mload(add(_signature, 0x40))
            v := byte(0, mload(add(_signature, 0x60)))
        }

        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28, "Invalid signature value");

        return ecrecover(_messageHash, v, r, s);
    }
}
 