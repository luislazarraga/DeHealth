pragma solidity ^0.8.0;

// Importamos los contratos SBTCode y CajaFuerteSalud
import "./SBTCode.sol";
import "./CajaFuerteSalud.sol";

contract LinkerAlt {
    // Variables de estado
    SBTCode private sbtCode;
    CajaFuerteSalud private cajaFuerteSalud;

    // Eventos
    event CajaFuerteCreada(address indexed owner, address indexed cajaFuerteAddress);

    // Constructor
    constructor(address _sbtCodeAddress, address _cajaFuerteSaludAddress) {
        sbtCode = SBTCode(_sbtCodeAddress);
        cajaFuerteSalud = CajaFuerteSalud(_cajaFuerteSaludAddress);
    }

    // Función para crear una caja fuerte y vincularla a un SBT
    function crearCajaFuerteConSBT(string memory _nombre, uint256 _saldoInicial, uint256 _sbtConfianza) public {
        // Creamos la caja fuerte
        address nuevaCajaFuerte = address(new CajaFuerte(_nombre, msg.sender, _saldoInicial, _sbtConfianza));

        // Asociamos el SBT a la caja fuerte
        sbtCode.setSBTAddress(msg.sender, nuevaCajaFuerte);

        // Emitimos el evento
        emit CajaFuerteCreada(msg.sender, nuevaCajaFuerte);
    }

    // Función para acceder a la caja fuerte utilizando un SBT
    function accederCajaFuerteConSBT() public view returns (address) {
        // Obtenemos la dirección de la caja fuerte asociada al SBT del usuario actual
        address cajaFuerteAddress = sbtCode.getSBTAddress(msg.sender);

        // Verificamos que la caja fuerte exista y esté asociada al SBT del usuario actual
        require(cajaFuerteAddress != address(0), "No se encontró una caja fuerte asociada a este SBT");

        // Verificamos que el usuario actual tenga suficiente confianza en el SBT asociado a la caja fuerte
        require(sbtCode.getSBTConfianza(msg.sender) >= cajaFuerteSalud.getSBTConfianzaRequerida(cajaFuerteAddress), "No tienes suficiente confianza en este SBT para acceder a la caja fuerte");

        // Devolvemos la dirección de la caja fuerte
        return cajaFuerteAddress;
    }
}
