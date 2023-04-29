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

    function crearRegistroEnCajaFuerte(string memory condicionesSalud, string memory registroMedico, string memory medicacion, string memory situacionActual) public onlyOwner {
        require(hasVault[msg.sender], "The user has not registered their medical record yet");
        Registro memory registro = Registro(condicionesSalud, registroMedico, medicacion, situacionActual);
        cajaFuerteRegistros[sbtContract.walletOfOwner(msg.sender)].push(registro);
    }


    function recuperarRegistro(uint256 index) public view hasSBT returns (string memory, string memory, string memory, string memory)  {
        require(cajaFuerteRegistros[sbtContract.walletOfOwner(msg.sender)].length > 0, "No hay registros medicos de este paciente");
        Registro memory registro = cajaFuerteRegistros[sbtContract.walletOfOwner(msg.sender)][index];
        return (registro.condicionesSalud, registro.registroMedico, registro.medicamentos, registro.situacionActual);
    }

    function recuperarVault() public view hasSBT returns (Registro[] memory) {
        require(cajaFuerteRegistros[sbtContract.walletOfOwner(msg.sender)].length > 0, "No hay registros medicos de este paciente");
        Registro[] memory registros = cajaFuerteRegistros[sbtContract.walletOfOwner(msg.sender)];
        return registros;
    }

    function recuperarVaultAjeno(address SBTAjeno) public view {}

    modifier hasSBT() {
        require(sbtContract.balanceOf(msg.sender) > 0 , "No tienes ningun SBT en tu cartera");
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