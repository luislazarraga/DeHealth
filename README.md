La lógica del backend de la aplicación está compuesto por dos contratos inteligentes "SBTCode" y "CajaFuerteSalud":

El contrato SBTCode implementa toda la lógica asociada a la llave de la caja fuerte (gestión de accesos y permisos) mientras que el otro contrato se centra en habilitar el almacenamiento y recuperación de los datos médicos médicos de los pacientes.

**Contrato de la cajaFuerteSalud**

El contrato "CajaFuerteSalud"  está formado por tres funciones, "annadirRegistroEnCajaFuerte", "recuperarRegistro" y "recuperarVault".  Los datos de los pacientes se almacenan mediante diccionarios o mappings en la blockchain. La idea es que cada clave tenga asociada un conjunto de valores. 
La clave del mapping "cajaFuerteRegistros" es un tokenId (Un identificador único de cada SBT) que tomará el tipo de dato uint256 y el valor será una lista de una estructura personalizada denominada Registro.

El contrato se compone de:

**1. La estructura "Registro"**:
Las variables que forman su contenido son totalmente personalizables. A modo genérico, está actualmente formado por cuatro strings; "condicionesSalud", "registroMedico", "medicamentos" y "situaciónActual". Estos deben ser a su vez los parámetros de la función annadirRegistroEnCajaFuerte(). Este struct puede ser modificado en función del tipo de información médica que se quiere almacenar,

**2. Función annadirRegistroEnCajaFuerte()**:
El objetivo es añadir un nuevo registro dentro de la caja fuerte de tal manera que cuando un paciente vaya a cualquier hospital, se cree y almacene sobre la blockchain un nuevo registro sobre la información que puede haber aportado dicha intervención. Como se menciona en el párrafo anterior, los argumentos de la función son ambiguos, dado que son todos los declarados dentro de la estructura Registro. En función de la información que se quiera almacenar se incluirán unos parámetros u otros, pero deben mantener esa correlación con la estructura. Por otro lado, esta función no devuelve nada.

Esta función crea una objeto Registro con los datos pasados por parámetro e inmediatamente lo añade mediante la función push, propia de las listas, dentro del array de Registros al que referencian los valores del mapping denominado cajaFuerteRegistros. Por tanto al acceder a la clave (tokenId de un SBT dado) se referenciará el conjunto de registros de dicho paciente. Es importante destacar que esta se encuentra condicionada por el modifier hasSBT que exige que solo el dueño del SBT o alguien con confianza del dueño (otorgada mediante trustYourFam del contrato SBTCode) pueda añadir un registro a la lista de registros del diccionario para dicho SBT dado.

**3. Funciones recuperarRegistro(uint256 index, uint256 _soulBoundToken) y recuperarVault(uint256 _soulBoundToken)**: 
Ambas tienen el mismo objetivo, recuperar el o los registros almacenados a partir de una clave (el identificador tokenId de un SBT). La primera de ellas permite obtener uno en concreto. mientras que la segunda devuelve todos para una clave dada.

RecuperarRegistro cuenta con dos parámetros de entrada, uint256 index y uint256 _soulBoundToken. El primero de ellos se utiliza para señalar el registro en concreto que se quiere recuperar, siendo 0 el primero en haberse almacenado, por lo que el índice más alto será el registro más reciente. El segundo, en cambio, sirve para poder pasar el identificador del SBT como parámetro del modifier hasSBT. Esta función devuelve el contenido del objeto Registro que se ha especificado mediante el índice introducido por parámetro.

Respecto a la lógica interna de recuperarRegistro, la primera línea establece una condición para poder ejecutar la función. Si la longitud del array que representa el valor del diccionario cajaFuerteRegistros vinculado a un SBT dado no es mayor a 0, automáticamente cancela la ejecución y salta un mensaje de aviso. Tras dicha comprobación se crea un a variable para recuperar el Registro especificado mediante el índice de la lista de Registros del diccionario y se devuelve el contenido del mismo.
Adicionalmente, esta función está condicionada por el modifier hasSBT(_soulBoundToken) que exige que quién llama la función para leer un registro vinculado a un SBT deba ser el poseedor de dicho SBT (lo tenga en la dirección desde la que llama a la función) o se le hayan otorgado permisos mediante la función trustYourFam para su administración. Para comprobar los permisos se hace uso de la función amIFam del contrato de los SBT.

Una alternativa a recuperarRegistro es recuperar directamente todos los registros en la lista de registros asociada a un SBT dado. La función **recuperarVault** es una versión simplificada de recuperarRegistro la cual toma un único parámetro de entrada, el identificador del SBT. Este parámetro sirve fundamentalmente para poder utilizar el modifier hasSBT, como ocurría con la función recién comentada. Por otra parte, esta función devuelve toda la lista de registros para un SBT dado.

**4. El modifier hasSBT(uint256 _soulBoundToken)**:
Éste toma un SBT de entrada (realmente el tokenID asociado al mismo) y requiere que quien esté enviando el mensaje posea dicho tokenId en su cartera (utilizando la función walletOfOwner() del otro contrato) o que el dueño de dicho SBT haya dado permiso al usuario (concepto de SBTConfianza) para acceder con permisos de lectura y escritura a sus datos médicos.

Además, un detalle importante a tener en cuenta es que antes de desplegar el contrato **cajaFuerteSalud** es necesario que se haya desplegado ya el **SBTCode** dado que este primero requiere de la dirección del contrato de los SBTs para desplegarse. Es la manera en la que se vinculan ambos contratos para poder funcionar en paridad. Por tanto, la variable *sbtContract* presente en el constructor de **cajaFuerteSalud** debe ser la *address* en la que se despliega el contrato de los SBTs.


**Contrato de SBTCode**

Este contrato implementa toda la lógica asociada al acceso de los datos médicos, tanto en la lectura como en la escritura de los mismos.
SBT.sol cuenta además con toda la lógica asociada a los permisos de la caja fuerte, sirviendo como llave necesaria para todas las operaciones sobre los registros médicos de un paciente dado. Sin el SBT en posesion, no es posible acceder a los registros médicos de nadie. La única alternativa a contar con un SBT dado en la wallet para acceder a sus respectivos datos médicos es mediante el concepto de "SBTConfianza". 

Este concepto surge de la necesidad de evitar un posible "jaque mate" en situaciones extraordinarias. En caso de una persona no poder dar permisos de lectura/escritura sobre sus datos médicos, (por una atención médica extraordinaria en la que el paciente se encuentre inhabilitado. Un ejemplo podría ser una situación de coma del paciente) los asignados como SBTs de confianza de dicha persona podrían actuar sobre ellos de forma excepcional. Para ello el dueño de los datos (y por tanto del SBT asociado) debe haber designado explicitamente quienes son sus "direcciones de confianza" (direcciones autorizadas a utilizar el SBT del dueño).

El contrato SBTCode utiliza mecanismos de herencia para traer las funciones relativas a una extensión del estándar **ERC-721**. Esta extensión denominada **ERC-721Enumerable** a su vez hereda del estándar de los NFT, y su particularidad es que agrega una funcionalidad adicional a los tokens no fungibles. Esta extensión define una nueva función opcional llamada **tokenOfOwnerByIndex**, que permite a los desarrolladores enumerar los tokens de un propietario determinado, junto con otras funciones adicionales. 

Otra de las características fundamentales de los Soulbound Tokens es su no transferibilidad. Es estrictamente necesario que las “llaves” encargadas de gestionar el acceso de lectura y escritura de los datos no puedan cambiar de ubicación una vez emitidas a una dirección dada. Con este planteamiento se evitan los posibles robos de dichos tokens, un potencial mercado negro, la suplantación de identidad y demás problemas asociados a las mismas. Para lograr esta “no transferibilidad” no existe un estándar dentro del ecosistema cripto.

En cuanto al resto de dependencias que se importan en el contrato, son todas librerías de *OpenZeppelin* que son requeridas para utilizar y heredar el estándar *ERC-721Enumerable* en un determinado código.

El contrato se compone de:

**1. Diccionario _SBTApprovals**: Esta estructura de datos es la encargada de almacenar las direcciones a la que el dueño de un determinado SBT asigna como direcciones de confianza para utilizar su token. Posteriormente se detallarán las funciones que involucran el tratamiento de dicho *mapping*. Este mapping es la estructura de datos central para la implementación del concepto de "*SBT de Confianza*". Vincula la clave (el identificador numérico de cada SBT) con la lista de direcciones de confianza relativas a dicho SBT.

**2. Constructor para inicializar el ERC721**: Pese a que el estándar ha sido adulterado para cumplir con los requisitos de esta aplicación, la base de los SBT de la aplicación es el contrato estándar *ERC721 (NFT)* el cual cuenta con un **nombre** y **símbolo** como parámetros para su creación.

**3. Función issue()**: Esta función es la encargada de la emisión de los SBTs, sigue las mecánicas propias del estándar ERC721 cuya función análoga se denomina _mint. 

Esta función debe llamarse desde la dirección a la que se quiere asignar el SBT, sin incluir ningún parámetro de entrada. El retorno de la misma será un entero de 256 bits que servirá para identificar de forma inequívoca al SBT en cuestión que acaba de ser expedido y añadido a la dirección que ha llamado a la función.

Respecto a la lógica interna, se incluye una condición mediante un require() para limitar la emisión a un SBT por wallet o dirección. Esta implementación se ha utilizado para construir la maqueta de este proyecto pero en un entorno real habría que realizar comprobaciones adicionales casi inevitablemente off-chain. 

Esta limitación es básica, y asume que los usuarios solo van a contar con una wallet cuando la realidad es que una misma persona podría crear y gestionar varias direcciones. Para una implementación real se debería incluir un servicio en una API que limitase a través del DNI u otro identificador único la emisión a realmente uno por persona. Esto es muy complicado hacerlo sin ayuda de las BBDD de los distintos gobiernos dado que se debería desarrollar un mecanismo que garantizase que no solo el DNI es válido, (sigue las condiciones alfanuméricas que éste requiere, dado que esto tampoco solucionaría el problema) sino que pertenece a una persona real y además, que no ha sido utilizado previamente para la emisión de un SBT. 

Debido a la complejidad y el manejo de datos confidenciales que esto requiere se decide que se escapa del alcance de este proyecto. La máxima aproximación (sin requerir de datos oficiales) sería implementar la exigencia de un DNI a la hora de emitir el token (junto con la comprobación de su validez y no haber sido utilizado anteriormente) añadiendo un parámetro a la función issue(DNI dni) o issue(string dni). 

Igualmente, asegurar la propiedad de dicho DNI sería mucho más complejo de implementar on-chain y, dado que este proyecto tiene como objetivo exprimir las funciones y propiedades de las cadenas de bloques frente a otras tecnologías tradicionales, se estima como fuera del alcance del proyecto.

Volviendo a la lógica de la función, el primer paso consiste en incrementar la variable currentTokenId. Esta asignará un uint256 a cada SBT emitido que servirá para identificarlo del resto de tokens y posibilita su posterior referencia. 

El “Token Id” se inicializa en 0, de forma que en la primera ejecución de la función ya estaría incrementado antes del _safeMint y el primer SBT se identificaría con el "1". A partir de ahí se incrementará de uno en uno por cada SBT emitido.
La función _safeMint a la que se llama en esta función se encuentra originalmente en el estándar ERC-721 y es la encargada de acuñar estos tokens. En sí, el término "mintear" o “minting” en inglés, hace referencia a la emisión y primera asignación del token a una dirección dada. Los datos de este SBT se registrarán en la cadena en este momento. 

Otro detalle a tener en cuenta es que _safeMint es en sí una evolución más sofisticada y segura de la verdadera función detrás del minting denominada “_mint” en el estándar ERC-721. Esta extensión agrega una capa de seguridad adicional al verificar que el destinatario sea capaz de recibir el token correctamente y no se pierda en la transacción. En cambio, en la función _mint() el contrato simplemente agrega un nuevo token a la cuenta del propietario sin realizar ninguna comprobación adicional. 

**5. Funciones trustYourFam(), deleteFam() y amIFam()**: Estas funciones pertenecen al grupo de funciones asociadas a implementar el concepto de **SBT de Confianza**. La primera de ellas sería similar a un *setter de confianza*, es decir, es una interfaz con un par de **requires** (condiciones que deben cumplirse para poder ejecutar la función) para poder llamar la función tipo **internal** *approveSBT* que es la encargada de añadir una dirección dada a la lista personal con la que cuenta cada usuario de *direcciones de confianza*. La función devolverá un booleano que será "true" si se ha podido llamar exitosamente a la función approveSBT y "false" si no se cumple alguna de las condiciones/requires especificados en la interfaz.

La primera condición establece el máximo de elementos que una clave del diccionario *_SBTApprovals* puede tener en su valor asociado. La clave es el identificador de un token (SBT) dado del tipo *uint256* y el valor es una lista de direcciones capada a dos elementos como máximo. En sí no está limitada a dos elementos en la estructura del diccionario, sino que para poder ejecutar la función encargada de "añadir confianza" (trustYourFam) se requiere que el tamaño de esa lista de direcciones sea menor que dos. 

La decisión de restringirlo a dos personas viene de la siguiente problemática ya descrita anteriormente. Pese a que esta Dapp pretende otorgar la soberanía de los datos médicos a sus respectivos dueños, podrían darse casos extraordinarios en los que estos estén decidiendose entre la vida y la muerte y no se encuentren capaces de otorgar los permisos de lectura que podría requerir una determinada organización para iniciar un tratamiento u operación. Para afrontar estos casos la idea es que la persona cuente con una persona de total confianza sobre la que depositar esa confianza a través de **trustYourFam()**. La segunda dirección de confianza tendría sentido una vez la aplicación comenzase a funcionar en un entorno real, donde sería necesario para su implementación que los gobiernos contasen con la confianza de todos sus ciudadanos para poder gestionar también situaciones excepcionales. Sería catastrófico que una persona terminase falleciendo por encontrarse en coma y su persona de mayor confianza incomunicada. Por tanto, esta segunda dirección haría de *backdoor* de la aplicación obligando a los usuarios a tener una dirección (por ej: *MinisterioDeSanidad.eth*) agregada siempre en su lista de direcciones de confianza. Esta implementación podría prescindir de la intervención del gobierno para las operaciones habituales de una persona, pero en caso de requerirlo en última instancia se podría recurrir a ella.

La segunda condición (*require*) de la función **trustYourFam** se encarga de que no haya direcciones duplicadas en la lista de direcciones de confianza para un SBT dado. Devolverá "true" si la confianza se ha podido depositar correctamente y "false" si la dirección está duplicada.

Además, la función **trustYourFam** está limitada por un *modifier* denominado **hasSBT()**. Es importante destacar que este *modifier* es distinto que el presente en la clase **cajaFuerteSalud**. Éste simplemente comprueba si la persona que quiere realizar un determinado tratamiento sobre un SBT dado es dueño (tiene dicho SBT en su posesión) del mismo. Para ello se recurre a la funcion **walletOfOwner()** la cual describiré más adelante.

Por otra parte está la función **deleteFam()**. Esta función es la encargada de vaciar la lista de direcciones de confianza de un SBT dado. Para ello hace uso de la función predefinida *pop()*. Esta función requiere utilizar *pop()* dado que interesa no solo sobrescribir la posición de la lista sino acortarla para que no interfiera con el *require* de dos posiciones máximo definido en **trustYourFam()**. Además dado que trustYourFam() llama a **approveSBT** (la cual hace un push en dicha lista) es necesario eliminar la posición del array dinámico en vez de simplemente actualizar su dato a 0s. Al igual que **trustYourFam()**, esta función también hace uso de **hasSBT()** dado que la única persona que debería ser capaz de eliminar una dirección de la lista de direcciones de confianza debería ser el dueño de dicha lista, es decir, el dueño del SBT a la que va asociada dicha lista.

Finalmente se cuenta con **amIFam()**. Esta función se utiliza fundamentalmente para poder realizar comprobaciones en el contrato **cajaFuerteSalud** para ver si una dirección dada pertenece a la lista de direcciones de confianza de un token dado. A su vez e igual que **trustYourFam()**, esta función sirve como interfaz de una función interna denominada **getApprovedSBT()** pero con una diferencia notable. En este caso, la función **getApprovedSBT()** devuelve la lista de direcciones de confianza de un SBT dado, mientras que **amIFam()** comprueba si la dirección introducida por parámetro coincide con alguna de las existentes en la lista. Si pertenece, devolverá true, si no, false.

En el contrato **cajaFuerteSalud** se utiliza la función **amIFam** solo para el *modifier* denominado **hasSBT()**. Recordar que este modificador es distinto al del contrato **SBTCode**.

La función **approveSBT()** que se menciona en el párrafo de **trustYourFam** simplemente introduce mediante un *push()* una dirección dada en la lista de direcciones de confianza de un token dado.

**6. Función walletOfOwner()**: Esta función tiene como objetivo devolver el SBT (su tokenId asociado) del cual una dirección dada es dueño. Para ello hace uso de una función propia del estándar ERC721Enumerable denominada **tokenOfOwnerByIndex()**. Esta función permite obtener el token ID de un NFT (Non-Fungible Token) por su índice de orden para un propietario determinado. Es perfectamente aplicable para devolver el token Id de nuestros SBTs. 

**7. Sobrescritura de la función _beforeTokenTransfer()**: Esta función es una función hook (gancho) que se ejecuta antes de cada transferencia de tokens en los contratos inteligentes que implementan los estándares ERC-721 y ERC-721Enumerable. El objetivo de esta función es permitir a los contratos que heredan de estos estándares implementar reglas personalizadas para la transferencia de tokens, y realizar cualquier otra acción necesaria antes de que se lleve a cabo la transferencia.

En una guía encontrada en internet (adjuntar enlace) se establecía un método para poder añadir la no transferibilidad sobre el estándar ERC-721. Este método modificaba la función anterior con el objetivo de inhabilitar la transmisión de los tokens sin afectar a ninguna otra funcionalidad del programa. En el *override* de la función, se incluye un *require* que establece una condición imposible, por lo que siempre va a dar error al utilizarse para la transmisión de tokens. Esta condición requiere que el parámetro **from** de la función (la dirección de origen que solicitaría transmitir su token) sea igual a la *dirección 0* de Ethereum.

En Ethereum, la dirección address(0) se utiliza comúnmente para hacer referencia a una dirección nula o vacía. En otras palabras, no hay una cuenta de Ethereum asociada a esta dirección. Esta dirección nula es útil en muchas situaciones en las que se necesita indicar la ausencia de una dirección, como por ejemplo en la implementación de contratos inteligentes que involucren tokens. En algunos casos, se puede utilizar la *address(0)* para indicar que un token no está asignado a ninguna dirección, lo que puede ser útil para evitar problemas de doble asignación. En este caso, al requerir que la dirección **from** sea igual a la *address(0)* no se podrá llevar a cabo la transmisión de los tokens en ninguna circunstancia. Esta funcionalidad es la que garantiza que no se puedan robar los SBTs.

**8. Función getApprovedSBT()**: Complementar lo dicho anteriormente con que esta función es un clon de *getApproved()* del estándar ERC-721 pero adaptado a los SBT. La función es un *getter* para la lista de direcciones de confianza de un SBT dado. Esta función se utiliza como medio para un fin, se declara como *internal* para solo poder ser llamada por funciones dentro de contrato. El objetivo es que sea utilizada por *amIFam()* para implementar la lógica de dicha función.

























