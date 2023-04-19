pragma solidity ^0.8.0;

contract CajaFuerteSalud {
    struct Permiso {
        address persona;
        bool lectura;
        bool escritura;
    }

    struct HistorialMedico {
        bool alergias;
        bool enfermedades;
        bool medicamentos;
        string situacionActual;
        // Otros datos médicos relevantes
    }

    address public dueno;
    address public sbtConfianza;
    HistorialMedico public historial;
    mapping(address => Permiso) public permisos;

    constructor() {
        dueno = msg.sender;
    }

    function actualizarHistorial(HistorialMedico calldata _historial) public {
        require(msg.sender == dueno || msg.sender == sbtConfianza, "No tienes permiso para actualizar el historial");
        historial = _historial;
    }

    function otorgarPermiso(address persona, bool lectura, bool escritura) public {
        require(msg.sender == dueno || msg.sender == sbtConfianza, "No tienes permiso para otorgar permisos");
        permisos[persona] = Permiso(persona, lectura, escritura);
    }

    function revocarPermiso(address persona) public {
        require(msg.sender == dueno || msg.sender == sbtConfianza, "No tienes permiso para revocar permisos");
        delete permisos[persona];
    }

    function asignarSBTConfianza(address _sbtConfianza) public {
        require(msg.sender == dueno, "No tienes permiso para asignar un SBT de confianza");
        sbtConfianza = _sbtConfianza;
    }
}
