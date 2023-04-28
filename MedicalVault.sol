// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./SBTCode.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CajaFuerteSalud {
    
    
    
    address public SBTokenOwner;

    mapping(address => bool) private authorizedUsers;
    mapping(bytes32 => bool) private usedNonces;
    

    address public owner;
    uint256 public balance;
    uint256 private constant MIN_BALANCE = 10 ether;


    SBTCode private sbtContract;


    constructor(SBTCode _sbtContract) {
        sbtContract = _sbtContract;
        SBTokenOwner = sbtContract.ownerOf(_sbtContract.walletOfOwner(msg.sender));
    }

    event Deposit(address indexed from, uint256 value);
    event Withdraw(address indexed to, uint256 value);
    event DeauthorizedUser(address indexed user, address indexed sbt);

    

    struct Registro {
        string condicionesSalud;
        string registroMedico;
        string medicamentos;
        string situacionActual;
    }

    struct AuthorizedUser {
        address sbt;
        uint256 maxRecords;
    }

    mapping(address => AuthorizedUser[]) private authorizedUsersInfo;
    mapping(address => bool) private hasVault;
    mapping(address => Registro[]) private cajaFuerteRegistros;

    function crearRegistroEnCajaFuerte(string memory condicionesSalud, string memory registroMedico, string memory medicacion, string memory situacionActual) public onlyOwner {
        require(hasVault[msg.sender], "The user has not registered their medical record yet");
        Registro memory registro = Registro(condicionesSalud, registroMedico, medicacion, situacionActual);
        cajaFuerteRegistros[msg.sender].push(registro);
        //hasVault[msg.sender] = true;
    }


    function recuperarRegistro(uint256 index) public view hasSBT returns (string memory, string memory, string memory, string memory)  {
        require(cajaFuerteRegistros[msg.sender].length > 0, "No hay registros medicos de este paciente");
        Registro memory registro = cajaFuerteRegistros[msg.sender][index];
        return (registro.condicionesSalud, registro.registroMedico, registro.medicamentos, registro.situacionActual);
    }

    function recuperarVault() public view hasSBT returns (Registro[] memory) {
        require(cajaFuerteRegistros[msg.sender].length > 0, "No hay registros medicos de este paciente");
        Registro[] memory registros = cajaFuerteRegistros[msg.sender];
        return registros;
    }

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
