 El programa estácompuesto por dos contratos inteligentes "SBTCode" y "CajaFuerteSalud":

 El contrato SBTCode implementaría toda la lógica asociada a la llave de la caja fuerte mientras que el otro contrato implementaría el almacenamiento de los registros médicos de los pacientes.

**Contrato de la cajaFuerteSalud**

El contrato "CajaFuerteSalud"  se forma de cuatro funciones, "annadirRegistroEnCajaFuerte", "recuperarRegistro" y "recuperarVault".  Los datos de los pacientes se almacenaran mediante diccionarios (mappings) en la blockchain. La idea es que cada clave tenga asociada un conjunto de valores. La clave del mapping "cajaFuerteRegistros" es un tokenId (Un identificador único de cada SBT) que tomará el tipo de dato uint256 y el valor será un array de una "struct" denominada Registro.

Registro está actualmente formado por cuatro strings; "condicionesSalud", "registroMedico", "medicamentos" y "situaciónActual". Estos son a su vez los parámetros de la función annadirRegistroEnCajaFuerte(). Este struct variará para poder asemejarse lo máximo posible a un "registro médico concreto" de una intervención de un paciente.

Función annadirRegistroEnCajaFuerte():  (Es susceptible a recibir modificaciones dentro de poco debido a la forma en la que se estructurarán los registros médicos).  El objetivo es añadir un nuevo "registro" dentro de la caja fuerte  de tal manera que cuando un cliente vaya a interaccionar con cualquier hospital, se cree un nuevo registro sobre la información que puede haber aportado dicha intervención y se añada a la estructura de datos que lo almacenará (por ahora mediante mapping). Los argumentos de la función son provisionales y cutres, simplemente para facilitar el testing. Esta función "pusheará" el nuevo registro dentro del array de registros del mapping cajaFuerteRegistros. Por tanto al acceder a la clave (SBT) se referenciará el conjunto de registros de dicho paciente.

Función recuperarRegistro() y recuperarVault(): Ambas tienen el mismo objetivo, recuperar el o los registro/s almacenados para una clave (SBT) dada respectivamente. La primera función permite indexar los registros para obtener uno en concreto (el primero es el 1) mientras que la segunda devuelve todos para una clave dada.

En este contrato se cuenta también con un modifier "hasSBT(_tokenId)".  Éste toma un SBT de entrada (realmente el tokenID asociado al mismo) y requiere que quien esté enviando el mensaje posea dicho tokenId en su cartera (función walletOfOwner() del otro contrato) o que el dueño de dicho SBT haya dado permiso al usuario (concepto de SBTConfianza) para acceder con permisos de r/w a sus datos médicos. Aunque lo describiré más tarde, el SBT no es transferible, lo que implica que se están dando permisos para utilizar dicho SBT (approval/allowance del estándar 721) sin perder de la posesión  del token.


**Contrato de SBTCode**

Este contrato implementa toda la lógica asociada al acceso de los datos médicos, tanto en la lectura como en la escritura de los mismos.





