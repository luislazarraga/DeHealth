// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SBTCode.sol";

contract CajaFuerteSalud {
    
    address public SBTokenOwner;
    
    address public owner;

    SBTCode private sbtContract;

    constructor(SBTCode _sbtContract) {
        sbtContract = _sbtContract;
    }

    struct Registro {
        string condicionesSalud;
        string registroMedico;
        string medicamentos;
        string situacionActual;
    }

    mapping(uint256 => Registro[]) private cajaFuerteRegistros;

    function annadirRegistroEnCajaFuerte(string memory condicionesSalud, string memory registroMedico, string memory medicacion, string memory situacionActual, uint256 _soulBoundToken) public hasSBT(_soulBoundToken) {
        Registro memory registro = Registro(condicionesSalud, registroMedico, medicacion, situacionActual);
        cajaFuerteRegistros[_soulBoundToken].push(registro);
    }

    function recuperarRegistro(uint256 index, uint256 _soulBoundToken) public view hasSBT(_soulBoundToken) returns (string memory, string memory, string memory, string memory)  {
        require(cajaFuerteRegistros[_soulBoundToken].length > 0, "No hay registros medicos de este paciente");
        Registro memory registro = cajaFuerteRegistros[_soulBoundToken][index];
        return (registro.condicionesSalud, registro.registroMedico, registro.medicamentos, registro.situacionActual);
    }

    function recuperarVault(uint256 _soulBoundToken) public view hasSBT(_soulBoundToken) returns (Registro[] memory) {
        require(cajaFuerteRegistros[_soulBoundToken].length > 0, "No hay registros medicos de este paciente");        
        Registro[] memory registros = cajaFuerteRegistros[_soulBoundToken];
        return registros;
    }

    modifier hasSBT(uint256 _soulBoundToken) {
        require(sbtContract.walletOfOwner(msg.sender) == _soulBoundToken || sbtContract.amIFam(_soulBoundToken), "No tienes potestad sobre este SBT o no tienes ningun SBT en tu cartera");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this operation");
        _;
    }
}
 