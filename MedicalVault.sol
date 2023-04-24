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

    struct AuthorizedUser {
    address sbt;
    uint256 maxRecords;
}

mapping(address => AuthorizedUser[]) private authorizedUsersInfo;

mapping(address => CajaFuerteRegistro[]) private cajaFuerteRegistros;

function crearRegistroEnCajaFuerte() public {
    require(hasRegistered[msg.sender], "The user has not registered their medical record yet");
    
    CajaFuerteRegistro memory registro = CajaFuerteRegistro(
        registrosMedicos[msg.sender].condicionesSalud,
        registrosMedicos[msg.sender].registroMedico,
        registrosMedicos[msg.sender].medicamentos,
        registrosMedicos[msg.sender].situacionActual
    );
    
    cajaFuerteRegistros[msg.sender].push(registro);
}


function recuperarRegistroDeCajaFuerte() public view returns (string memory, string memory, string memory, string memory) {
    require(cajaFuerteRegistros[msg.sender].length > 0, "The user has not stored their medical record in the safe yet");
    CajaFuerteRegistro memory registro = cajaFuerteRegistros[msg.sender][cajaFuerteRegistros[msg.sender].length - 1];
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

    function authorize(address _user, address _sbt, uint256 _maxRecords) public onlyOwner {
    require(sbtContract.isAuthorized(_sbt), "SBT is not authorized");

    AuthorizedUser memory authorizedUser = AuthorizedUser(_sbt, _maxRecords);
    authorizedUsersInfo[_user].push(authorizedUser);

    authorizedUsers[_user] = true;
}


    function deauthorize(address _user, uint256 _index) public onlyOwner {
    require(authorizedUsersInfo[_user].length > _index, "Invalid index");

    address sbt = authorizedUsersInfo[_user][_index].sbt;
    authorizedUsers[_user] = false;
    authorizedUsersInfo[_user][_index] = authorizedUsersInfo[_user][authorizedUsersInfo[_user].length - 1];
    authorizedUsersInfo[_user].pop();

    emit DeauthorizedUser(_user, sbt);
}


    function SBTConfianza(uint256 _amount, address _to, bytes32 _nonce, bytes memory _signature) public onlyAuthorized {
    require(balance >= MIN_BALANCE, "The balance is less than the minimum required");
    require(!usedNonces[_nonce], "Nonce has already been used");

    bytes32 messageHash = keccak256(abi.encodePacked(_amount, _to, _nonce, address(this)));
    address sbtAuthorizer = recoverSigner(messageHash, _signature);

    require(sbtAuthorizer == sbtContract.owner() || sbtContract.isAuthorized(sbtAuthorizer), "Invalid signature");

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
