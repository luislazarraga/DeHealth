pragma solidity ^0.8.0;

import "./SBTCode.sol";

contract CajaFuerteSalud {
    
    mapping(address => bool) private authorizedUsers;
    mapping(bytes32 => bool) private usedNonces;

    address public owner;
    uint256 public balance;
    uint256 private constant MIN_BALANCE = 10 ether;

    SBTCode private sbtContract;

    event Deposit(address indexed from, uint256 value);
    event Withdraw(address indexed to, uint256 value);

    constructor(SBTCode _sbtContract) {
        owner = msg.sender;
        sbtContract = _sbtContract;
    }

    struct CajaFuerteRegistro {
    string condicionesSalud;
    string registroMedico;
    string medicamentos;
    string situacionActual;
}

mapping(address => CajaFuerteRegistro) private cajaFuerteRegistros;

function crearRegistroEnCajaFuerte() public {
    require(hasRegistered[msg.sender], "The user has not registered their medical record yet");
    CajaFuerteRegistro memory registro = CajaFuerteRegistro(
        registrosMedicos[msg.sender].condicionesSalud,
        registrosMedicos[msg.sender].registroMedico,
        registrosMedicos[msg.sender].medicamentos,
        registrosMedicos[msg.sender].situacionActual
    );
    cajaFuerteRegistros[msg.sender] = registro;
}

function recuperarRegistroDeCajaFuerte() public view returns (string memory, string memory, string memory, string memory) {
    require(cajaFuerteRegistros[msg.sender].condicionesSalud != "", "The user has not stored their medical record in the safe yet");
    CajaFuerteRegistro memory registro = cajaFuerteRegistros[msg.sender];
    return (registro.condicionesSalud, registro.registroMedico, registro.medicamentos, registro.situacionActual);
}


    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this operation");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedUsers[msg.sender], "Only authorized users can perform this operation");
        _;
    }

    function authorize(address _user) public onlyOwner {
        authorizedUsers[_user] = true;
    }

    function deauthorize(address _user) public onlyOwner {
        authorizedUsers[_user] = false;
    }

    function SBTConfianza(uint256 _amount, address _to, bytes32 _nonce, bytes memory _signature) public onlyAuthorized {
        require(balance >= MIN_BALANCE, "The balance is less than the minimum required");
        require(!usedNonces[_nonce], "Nonce has already been used");
        
        bytes32 messageHash = keccak256(abi.encodePacked(_amount, _to, _nonce, address(this)));
        address sbtAuthorizer = recoverSigner(messageHash, _signature);

        require(sbtAuthorizer == sbtContract.owner(), "Invalid signature");
        
        usedNonces[_nonce] = true;
        balance -= _amount;
        payable(_to).transfer(_amount);
        emit Withdraw(_to, _amount);
    }

    function deposit() public payable {
        balance += msg.value;
        emit Deposit(msg.sender, msg.value);
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
