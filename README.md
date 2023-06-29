**Como  utilizar la interfaz (aplicación web) para acceder a los contratos inteligentes**

Pese a no ser estrictamente necesario recurrir a la aplicación de Next.js para utilizar las funciones de los contratos inteligentes, esta facilita mucho el uso para aquellos carentes del conocimiento técnico necesario. 

Es importante mencionar que la aplicación de Next está diseñada para ser alojada en un servidor web, aunque en este proyecto (más concretamente en la demo) se utilizará en un servidor local. Otro punto importante a destacar es la independencia de los contratos inteligentes respecto a la interfaz web. Es posible relanzar la interfaz tantas veces como se quiera sin afectar a los contratos desplegados que ya se encuentran alojados dentro de la cadena de bloques.

Las direcciones de los contratos se almacenan en el fichero *constants.ts*.
Es crucial que se cuente con las *ABI (Application Binary Interface)* correspondientes a los contratos desplegados. Estas *ABI* se almacenan en el fichero *abi.ts* en forma de constante de *typescript*. 

En caso de querer interactuar con los contratos sin utilizar la aplicación, es también necesario contar con las correspondientes *ABI* y las direcciones de los mismos.
*Remix*, el IDE online para desarrollar en *solidity*, ofrece la posibilidad de "cargar" contratos desplegados para utilizar sus funciones facilmente sin requerir de una interfaz o aplicación. 

En cuanto a la app, puede ser desplegada tanto en sistemas operativos Windows o Linux. Los pasos para su despliegue son los siguientes:

**Linux**
Se utiliza una máquina Ubuntu como referencia

1. Clonar el repositorio ubicado en "https://github.com/luislazarraga/DeHealth" en tu PC. 
2. Acceder al directorio DeHealth > frontend del repositorio recién clonado.
3. Instalar *nodejs*. Es necesaria una versión superior a la "16.8.0". La forma más sencilla de hacerlo en Ubuntu es mediante el comando: 
    
    '''
    sudo apt install -y nodejs 
    '''

4. Instalar *npm*. La forma más sencilla de hacerlo en Ubuntu es mediante el comando: 
    
    '''
    sudo apt install npm
    '''

5. Instalar *yarn* mediante *npm*. La forma más sencilla de hacerlo en Ubuntu es mediante el comando: 
    
    '''
    sudo npm install --global yarn
    '''

5. Instalar las dependencias del proyecto mediante *yarn*:  
    
    '''
    yarn install
    '''

6. Lanzar la aplicación mediante *yarn*:
    
    '''
    yarn dev
    '''

**Windows**
Se utiliza una máquina Windows 10 como referencia.
Adicionalmente, se cuenta con la consola "Git Bash" para poder ejecutar comandos de *Linux* en *Windows* 

1. Clonar el repositorio ubicado en "https://github.com/luislazarraga/DeHealth" en tu PC. 
2. Acceder al directorio DeHealth > frontend del repositorio recién clonado.
3. Instalar *nodejs*. Es necesaria una versión superior a la "16.8.0". 
4. Instalar *npm*. 
5. Instalar *yarn* mediante *npm*. La forma más sencilla de hacerlo en Ubuntu es mediante el comando: 
    
    '''
    npm install --global yarn
    '''

5. Instalar las dependencias del proyecto mediante *yarn*:  
   
    '''
    yarn install
    '''

6. Lanzar la aplicación mediante *yarn*:
    
    '''
    yarn dev
    '''







La lógica del backend de la aplicación está compuesto por dos contratos inteligentes "SBT" y "CajaFuerte":

El contrato SBT implementa toda la lógica asociada a la llave de la caja fuerte (gestión de accesos y permisos) mientras que el otro contrato se centra en habilitar el almacenamiento y recuperación de los datos médicos médicos de los pacientes.

**Contrato de la caja fuerte**

El contrato "CajaFuerte"  está formado por tres funciones, "annadirRegistroEnCajaFuerte", "recuperarRegistro" y "recuperarVault".  Los datos de los pacientes se almacenan mediante diccionarios o mappings en la blockchain. La idea es que cada clave tenga asociada un conjunto de valores. 
La clave del mapping "cajaFuerteRegistros" es un tokenId (Un identificador único de cada SBT) que tomará el tipo de dato uint256 y el valor será una lista de una estructura personalizada denominada Registro.

El contrato se compone de:

**1. La estructura "Registro"**:
Las variables que forman su contenido son totalmente personalizables. A modo genérico, está actualmente formado por cuatro strings; "condicionesSalud", "registroMedico", "medicamentos" y "situaciónActual". Estos deben ser a su vez los parámetros de la función annadirRegistroEnCajaFuerte(). Este struct puede ser modificado en función del tipo de información médica que se quiere almacenar,

**2. Función annadirRegistroEnCajaFuerte()**:
El objetivo es añadir un nuevo registro dentro de la caja fuerte de tal manera que cuando un paciente vaya a cualquier hospital, se cree y almacene sobre la blockchain un nuevo registro sobre la información que puede haber aportado dicha intervención. Como se menciona en el párrafo anterior, los argumentos de la función son ambiguos, dado que son todos los declarados dentro de la estructura Registro. En función de la información que se quiera almacenar se incluirán unos parámetros u otros, pero deben mantener esa correlación con la estructura. Por otro lado, esta función no devuelve nada.

Esta función crea una objeto Registro con los datos pasados por parámetro e inmediatamente lo añade mediante la función push, propia de las listas, dentro del array de Registros al que referencian los valores del mapping denominado cajaFuerteRegistros. Por tanto al acceder a la clave (tokenId de un SBT dado) se referenciará el conjunto de registros de dicho paciente. Es importante destacar que esta se encuentra condicionada por el modifier hasSBT que exige que solo el dueño del SBT o alguien con confianza del dueño (otorgada mediante trustYourFam del contrato SBT) pueda añadir un registro a la lista de registros del diccionario para dicho SBT dado.

**3. Funciones recuperarRegistro(uint256 index, uint256 _soulBoundToken) y recuperarVault(uint256 _soulBoundToken)**: 
Ambas tienen el mismo objetivo, recuperar el o los registros almacenados a partir de una clave (el identificador tokenId de un SBT). La primera de ellas permite obtener uno en concreto. mientras que la segunda devuelve todos para una clave dada.

RecuperarRegistro cuenta con dos parámetros de entrada, uint256 index y uint256 _soulBoundToken. El primero de ellos se utiliza para señalar el registro en concreto que se quiere recuperar, siendo 0 el primero en haberse almacenado, por lo que el índice más alto será el registro más reciente. El segundo, en cambio, sirve para poder pasar el identificador del SBT como parámetro del modifier hasSBT. Esta función devuelve el contenido del objeto Registro que se ha especificado mediante el índice introducido por parámetro.

Respecto a la lógica interna de recuperarRegistro, la primera línea establece una condición para poder ejecutar la función. Si la longitud del array que representa el valor del diccionario cajaFuerteRegistros vinculado a un SBT dado no es mayor a 0, automáticamente cancela la ejecución y salta un mensaje de aviso. Tras dicha comprobación se crea un a variable para recuperar el Registro especificado mediante el índice de la lista de Registros del diccionario y se devuelve el contenido del mismo.
Adicionalmente, esta función está condicionada por el modifier hasSBT(_soulBoundToken) que exige que quién llama la función para leer un registro vinculado a un SBT deba ser el poseedor de dicho SBT (lo tenga en la dirección desde la que llama a la función) o se le hayan otorgado permisos mediante la función trustYourFam para su administración. Para comprobar los permisos se hace uso de la función amIFam del contrato de los SBT.

Una alternativa a recuperarRegistro es recuperar directamente todos los registros en la lista de registros asociada a un SBT dado. La función **recuperarVault** es una versión simplificada de recuperarRegistro la cual toma un único parámetro de entrada, el identificador del SBT. Este parámetro sirve fundamentalmente para poder utilizar el modifier hasSBT, como ocurría con la función recién comentada. Por otra parte, esta función devuelve toda la lista de registros para un SBT dado.

**4. El modifier hasSBT(uint256 _soulBoundToken)**:
Éste toma un SBT de entrada (realmente el tokenID asociado al mismo) y requiere que quien esté enviando el mensaje posea dicho tokenId en su cartera (utilizando la función walletOfOwner() del otro contrato) o que el dueño de dicho SBT haya dado permiso al usuario (concepto de SBTConfianza) para acceder con permisos de lectura y escritura a sus datos médicos.

Además, un detalle importante a tener en cuenta es que antes de desplegar el contrato **CajaFuerte** es necesario que se haya desplegado ya el **SBT** dado que este primero requiere de la dirección del contrato de los SBTs para desplegarse. Es la manera en la que se vinculan ambos contratos para poder funcionar en paridad. Por tanto, la variable *sbtContract* presente en el constructor de **CajaFuerte** debe ser la *address* en la que se despliega el contrato de los SBTs.


**Contrato SBT**

Este contrato implementa toda la lógica asociada al acceso de los datos médicos, tanto en la lectura como en la escritura de los mismos.
SBT.sol cuenta además con toda la lógica asociada a los permisos de la caja fuerte, sirviendo como llave necesaria para todas las operaciones sobre los registros médicos de un paciente dado. Sin el SBT en posesion, no es posible acceder a los registros médicos de nadie. La única alternativa a contar con un SBT dado en la wallet para acceder a sus respectivos datos médicos es mediante el concepto de "SBTConfianza". 

Este concepto surge de la necesidad de evitar un posible "jaque mate" en situaciones extraordinarias. En caso de una persona no poder dar permisos de lectura/escritura sobre sus datos médicos, (por una atención médica extraordinaria en la que el paciente se encuentre inhabilitado. Un ejemplo podría ser una situación de coma del paciente) los asignados como SBTs de confianza de dicha persona podrían actuar sobre ellos de forma excepcional. Para ello el dueño de los datos (y por tanto del SBT asociado) debe haber designado explicitamente quienes son sus "direcciones de confianza" (direcciones autorizadas a utilizar el SBT del dueño).

El contrato SBT utiliza mecanismos de herencia para traer las funciones relativas a una extensión del estándar **ERC-721**. Esta extensión denominada **ERC-721Enumerable** a su vez hereda del estándar de los NFT, y su particularidad es que agrega una funcionalidad adicional a los tokens no fungibles. Esta extensión define una nueva función opcional llamada **tokenOfOwnerByIndex**, que permite a los desarrolladores enumerar los tokens de un propietario determinado, junto con otras funciones adicionales. 

Otra de las características fundamentales de los Soulbound Tokens es su no transferibilidad. Es estrictamente necesario que las “llaves” encargadas de gestionar el acceso de lectura y escritura de los datos no puedan cambiar de ubicación una vez emitidas a una dirección dada. Con este planteamiento se evitan los posibles robos de dichos tokens, un potencial mercado negro, la suplantación de identidad y demás problemas asociados a las mismas. Para lograr esta “no transferibilidad” no existe un estándar dentro del ecosistema cripto.

En cuanto al resto de dependencias que se importan en el contrato, son todas librerías de *OpenZeppelin* que son requeridas para utilizar y heredar el estándar *ERC-721Enumerable* en un determinado código.

El contrato se compone de:

**1. Diccionario _SBTApprovals**: Esta estructura de datos es la encargada de almacenar las direcciones a la que el dueño de un determinado SBT asigna como direcciones de confianza para utilizar su token. Posteriormente se detallarán las funciones que involucran el tratamiento de dicho *mapping*. Este mapping es la estructura de datos central para la implementación del concepto de "*SBT de Confianza*". Vincula la clave (el identificador numérico de cada SBT) con la lista de direcciones de confianza relativas a dicho SBT.

**2. Constructor para inicializar el ERC721**: Pese a que el estándar ha sido adulterado para cumplir con los requisitos de esta aplicación, la base de los SBT de la aplicación es el contrato estándar *ERC721 (NFT)* el cual cuenta con un **nombre** y **símbolo** como parámetros para su creación.

**3. Función issue()**: 
Esta función es la encargada de la emisión de los SBTs, sigue las mecánicas propias del estándar ERC721 cuya función análoga se denomina _mint. 

Esta función debe llamarse desde la dirección a la que se quiere asignar el SBT, sin incluir ningún parámetro de entrada. El retorno de la misma será un entero de 256 bits que servirá para identificar de forma inequívoca al SBT en cuestión que acaba de ser expedido y añadido a la dirección que ha llamado a la función.

Respecto a la lógica interna, se incluye una condición mediante un require() para limitar la emisión a un SBT por wallet o dirección. Esta implementación se ha utilizado para construir la maqueta de este proyecto pero en un entorno real habría que realizar comprobaciones adicionales casi inevitablemente off-chain. 

Esta limitación es básica, y asume que los usuarios solo van a contar con una wallet cuando la realidad es que una misma persona podría crear y gestionar varias direcciones. Para una implementación real se debería incluir un servicio en una API que limitase a través del DNI u otro identificador único la emisión a realmente uno por persona. Esto es muy complicado hacerlo sin ayuda de las BBDD de los distintos gobiernos dado que se debería desarrollar un mecanismo que garantizase que no solo el DNI es válido, (sigue las condiciones alfanuméricas que éste requiere, dado que esto tampoco solucionaría el problema) sino que pertenece a una persona real y además, que no ha sido utilizado previamente para la emisión de un SBT. 

Debido a la complejidad y el manejo de datos confidenciales que esto requiere se decide que se escapa del alcance de este proyecto. La máxima aproximación (sin requerir de datos oficiales) sería implementar la exigencia de un DNI a la hora de emitir el token (junto con la comprobación de su validez y no haber sido utilizado anteriormente) añadiendo un parámetro a la función issue(DNI dni) o issue(string dni). 

Igualmente, asegurar la propiedad de dicho DNI sería mucho más complejo de implementar on-chain y, dado que este proyecto tiene como objetivo exprimir las funciones y propiedades de las cadenas de bloques frente a otras tecnologías tradicionales, se estima como fuera del alcance del proyecto.

Volviendo a la lógica de la función, el primer paso consiste en incrementar la variable currentTokenId. Esta asignará un uint256 a cada SBT emitido que servirá para identificarlo del resto de tokens y posibilita su posterior referencia. 

El “Token Id” se inicializa en 0, de forma que en la primera ejecución de la función ya estaría incrementado antes del _safeMint y el primer SBT se identificaría con el "1". A partir de ahí se incrementará de uno en uno por cada SBT emitido.
La función _safeMint a la que se llama en esta función se encuentra originalmente en el estándar ERC-721 y es la encargada de acuñar estos tokens. En sí, el término "mintear" o “minting” en inglés, hace referencia a la emisión y primera asignación del token a una dirección dada. Los datos de este SBT se registrarán en la cadena en este momento. 

Otro detalle a tener en cuenta es que _safeMint es en sí una evolución más sofisticada y segura de la verdadera función detrás del minting denominada “_mint” en el estándar ERC-721. Esta extensión agrega una capa de seguridad adicional al verificar que el destinatario sea capaz de recibir el token correctamente y no se pierda en la transacción. En cambio, en la función _mint() el contrato simplemente agrega un nuevo token a la cuenta del propietario sin realizar ninguna comprobación adicional. 

**5. Funciones trustYourFam(), deleteFam() y amIFam()**: 
Estas tres pertenecen al grupo de funciones asociadas a implementar el concepto de SBT de Confianza. La primera de ellas sería similar a un setter de confianza, es decir, es una interfaz con varios requires (condiciones que deben cumplirse para poder ejecutar la función) para poder llamar la función tipo internal **approveSBT**. Esta última es la que verdaderamente añade la dirección al diccionario de direcciones de confianza de un SBT. 

**TrustYourFam(address _yourFriend, uint256 _soulBoundToken)** es la encargada de añadir una dirección dada a la lista personal con la que cuenta cada usuario de direcciones de confianza. La función devolverá un booleano que será "true" si se ha podido llamar exitosamente a la función approveSBT y "false" si no se cumple alguna de las condiciones especificadas.
Esta función toma como parámetros address _yourFriend y uint256 _soulBoundToken. El primero de ellos sirve para especificar la dirección que se quiere añadir a la lista de direcciones de confianza de un SBT dado, mientras que el segundo es necesario para poder referenciar, mediante su correspondiente identificador, un SBT dado en la función tipo modifier hasSBT(_soulBoundToken) que aplica sobre trustYourFam.

TrustYourFam devolverá un valor booleano que será true en caso de poder añadir de forma satisfactoria una dirección a la lista de direcciones de confianza asociada a un SBT dado. Se devolverá false en caso de que dicha dirección ya se encuentre agregada dentro de la lista. Si no se cumpliesen las condiciones de los requires descritos en los siguientes párrafos, devolverá un error con un mensaje especificando la causa.

En cuanto a las condiciones o requires, la primera establece el máximo de elementos que una clave del diccionario “_SBTApprovals” puede tener en su valor asociado. La clave es el identificador de un token (SBT) dado del tipo uint256 y el valor es una lista de direcciones limitada a dos elementos como máximo. 
En sí no está limitada a dos elementos en la estructura del diccionario, sino que para poder ejecutar la función encargada de "añadir confianza" (trustYourFam) se requiere que el tamaño de esa lista de direcciones sea menor que dos.

La decisión de restringirlo a dos personas viene de la siguiente problemática ya descrita anteriormente. Pese a que esta *Dapp* pretende otorgar la soberanía de los datos médicos a sus respectivos dueños, podrían darse casos extraordinarios en los que estos estén decidiendose entre la vida y la muerte y no se encuentren capaces de otorgar los permisos de lectura que podría requerir una determinada organización para iniciar un tratamiento u operación. Para afrontar estos casos la idea es que la persona cuente con una persona de total confianza sobre la que depositar esa confianza a través de trustYourFam(). 

La segunda dirección de confianza tendría sentido una vez la aplicación comenzase a funcionar en un entorno real, donde sería necesario para su implementación que los gobiernos contasen con la confianza de todos sus ciudadanos para poder gestionar también situaciones excepcionales. Sería catastrófico que una persona terminase falleciendo por encontrarse en coma y su persona de mayor confianza incomunicada. Por tanto, esta segunda dirección haría de backdoor de la aplicación obligando a los usuarios a tener una dirección (por ej: MinisterioDeSanidad.eth) agregada siempre en su lista de direcciones de confianza. Esta implementación podría prescindir de la intervención del gobierno para las operaciones habituales de una persona, pero en caso de requerirlo en última instancia se podría recurrir a ella.

La segunda condición (require) de la función trustYourFam se encarga de que no haya direcciones duplicadas en la lista de direcciones de confianza para un SBT dado. Devolverá "true" si la confianza se ha podido depositar correctamente y "false" si la dirección está duplicada.
Además, la función trustYourFam está limitada por un modifier denominado hasSBT. Es importante destacar que este modifier es distinto que el presente en el contrato CajaFuerte. Este simplemente comprueba si la persona que quiere realizar un determinado tratamiento sobre un SBT dado es dueño (tiene dicho SBT en su posesión) del mismo. Para ello se recurre a la función walletOfOwner la cual se describe más adelante.
A modo aclarativo, un modifier es una función o “bloque de código reutilizable” utilizado para abstraer condiciones y evitar la duplicación de código. En caso de que una serie de funciones solo puedan ser utilizadas por el dueño de un SBT dado, es conveniente incluir dicho código en esta estructura en vez de repetirlo en cada función a la que se vaya a aplicar. 

Esta función, como las dos siguientes, son imprescindibles para el correcto funcionamiento de la aplicación, dado que sin ellas sería imposible combatir la casuística del jaque mate descrita previamente.

Por otra parte está la función **deleteFam(uint256 _soulBoundToken)**. Esta función es la encargada de vaciar la lista de direcciones de confianza de un SBT dado. Para ello hace uso de la función predefinida pop. Esta requiere utilizar pop dado que interesa no sólo sobrescribir la posición de la lista sino acortarla para que no interfiera con el require de dos posiciones máximo definido en trustYourFam. 

DeleteFam toma un único parámetro uint256 _soulBoundToken por la misma razón que lo hace la función trustYourFam, para poder referenciar, mediante su correspondiente identificador, un SBT dado en la función tipo modifier hasSBT(_soulBoundToken) que aplica sobre esta. Mencionar también que, a diferencia de trustYourFam, deleteFam no devuelve nada.

Además, dado que trustYourFam llama internamente a approveSBT (la cual hace un push en dicha lista) es necesario eliminar la posición del array dinámico en vez de simplemente actualizar su dato a 0s. Al igual que trustYourFam, esta función también hace uso de hasSBT, dado que la única persona que debería ser capaz de eliminar una dirección de la lista de direcciones de confianza debería ser el dueño de dicha lista, es decir, el dueño del SBT a la que va asociada dicha lista.
Sin deleteFam en el código sería imposible poder resetear el contenido de la lista de direcciones de confianza de un SBT dado, volviéndose esta perpetua. Dado que eso causaría grandes problemas en un entorno real, su implementación es necesaria para poder sustituir aquellas direcciones de confianza a las que se le quiere revocar los permisos. 

Finalmente se cuenta con **amIFam(address origin, uint256 trusterSBT)**. Esta función se utiliza fundamentalmente para poder realizar comprobaciones en el contrato CajaFuerte, para ver si una dirección dada pertenece a la lista de direcciones de confianza de un token dado. 

Esta función necesita de dos parámetros adress origin y uint256 trusterSBT siendo este segundo el identificador del SBT cuya lista va a ser inspeccionada para comprobar si efectivamente una dirección dada pertenece o no a la misma. El parámetro origin surge de un problema al utilizar el modifier para el que esta función se diseñó. Dado que el contrato CajaFuerteSalud llama a la función amIFam para realizar la comprobación correspondiente, si no se añade este parámetro, el msg.sender no es el usuario autorizado por trustYourFam, sino el propio contrato inteligente. Por tanto, este parámetro permite trasladar el msg.sender a través de los dos contratos para que la función realice su cometido.

A su vez, e igual que trustYourFam, esta función sirve como interfaz de una función interna denominada getApprovedSBT pero con una diferencia notable. En este caso, la función getApprovedSBT devuelve la lista de direcciones de confianza de un SBT dado, mientras que amIFam comprueba si la dirección introducida por parámetro coincide con alguna de las existentes en la lista. Si pertenece, devolverá true, si no, false.
En el contrato CajaFuerte se utiliza la función amIFam solo para el modifier denominado hasSBT. Recordar que este modificador es distinto al del contrato SBT.

**6. Función walletOfOwner()**:
Esta función tiene como objetivo devolver el tokenId asociado a un SBT del cual una dirección dada es dueño. Para ello hace uso de una función propia del estándar ERC721Enumerable denominada **tokenOfOwnerByIndex**. Esta función permite obtener el identificador numérico de un NFT (Non-Fungible Token) por su índice de orden para un propietario determinado. 

WalletOfOwner toma un único parámetro de entrada del tipo address llamado _owner. Este es necesario para especificar la dirección de la cual se quiere saber su SBT en posesión. A su vez, esta función devuelve un dato del tipo uint256 (tokenId) que sirve para identificar de forma inequívoca un SBT dado.  
Esta función es realmente una interfaz para llamar a la ya mencionada tokenOfOwnerByIndex(_owner, 0), obteniendo mediante los parámetros una forma de referenciar a la primera posición del diccionario  _ownedTokens que hereda del estándar ERC721Enumerable, el cual almacena una lista indexada de los SBTs de una dirección dada.

**7. Sobrescritura de la función _beforeTokenTransfer()**: 
Esta función se ejecuta antes de llevar a cabo una transferencia de tokens (en este caso SBT) en los contratos inteligentes que heredan o implementan el modelo ERC721 o cualquiera de sus extensiones. El fin de la misma es permitir la personalización de las reglas de transferencia, más concretamente, antes de que estas ocurran.

El objetivo de su sobreescritura en este contrato es precisamente eliminar la posibilidad de transferir estos tokens, para convertirlos en soulbound sin afectar por ello a ninguna otra funcionalidad del programa. En el override de la función, se incluye un require que establece una condición imposible, por lo que siempre va a dar error al intentar llevarse a cabo la transmisión de tokens. Esta condición requiere que el parámetro from de la función (la dirección de origen que solicitaría transmitir su token) sea igual a la dirección 0 de Ethereum. Esta dirección de Ethereum se utiliza para hacer referencia a una dirección nula o vacía la cual no tiene una cuenta asociada. En este caso, al requerir que la dirección from sea igual a la address(0) no se podrá llevar a cabo la transmisión de los tokens en ninguna circunstancia. 

**8. Funciones ApproveSBT y getApprovedSBT**: 
Estas funciones cumplen el rol de un setter y un getter para el diccionario _SBTApprovals. Esta estructura de datos es la encargada de almacenar las direcciones a las que el dueño de un determinado SBT asigna como direcciones de confianza para utilizar su token. Este mapping es la estructura de datos central para la implementación del concepto de "SBT de Confianza". Hay que destacar que ambas son del tipo internal, de tal forma que no pueden ser ejecutadas directamente, sino por otras funciones dentro de este código. TrustYourFam es la función pública análoga a approveSBT y amIFam requiere del uso de getApprovedSBT. 

La primera de ellas añade una dirección al diccionario _SBTApprovals, siendo la clave el identificador del token pasado por parámetro. Por tanto, los dos parámetros de entrada que toma approveSBT son el identificador del token (uint256 tokenId) para referenciar el SBT que se va a permitir gestionar desde otra dirección y la dirección que va a tener dichos permisos.

Es importante destacar que tras ejecutarse approveSBT se otorgarán permisos extraordinarios para utilizar las funciones de la caja fuerte, pero no se permite utilizar las funciones que involucren la propia administración de la confianza. Adicionalmente, esta función no devuelve nada a quién la llama.

Por otra parte, además de introducir la dirección en el diccionario se emite un evento del tipo *Approval* tal que el dueño del SBT (obtenido a través de la función ownerOf(tokenId)) da permisos a la dirección introducida por parámetro (address to) para gestionar el SBT dado a través del identificador (uint256 tokenId) pasado también por parámetro.

Mencionar que la función **ownerOf(uint256 tokenId)** es propia del estándar ERC721 y sus extensiones. Sirve para obtener la dirección de Ethereum propietaria de un token dado, en este caso, de un SBT.

Volviendo con la otra función, getApprovedSBT es la función interna encargada de obtener los valores del diccionario _SBTApprovals para una clave dada. Esta clave es el identificador de un SBT (su tokenId) el cual es pasado por parámetro de entrada a esta función. Esta devuelve el array de direcciones de confianza de un SBT dado a través del diccionario descrito.

Adicionalmente se llama a la función **requireMinted(uint256 tokenId)** del estándar ERC721. Esta solo permite la ejecución del código posterior (la llamada al diccionario) si el tokenId introducido por parámetro ya se ha emitido. En caso de no haberse expedido cancela la ejecución.

**9. El modifier hasSBT**: 
Como ya se ha descrito anteriormente, este modifier es el encargado de realizar una comprobación presente en trustYourFam y deleteFam. Para poder dar o eliminar permisos a una dirección dada es necesario que solo el dueño del SBT sea el encargado de darlos, ni siquiera aquellos terceros con confianza ya asignada para garantizar la soberanía absoluta en última instancia del dueño.

Solo cuenta con un require en su interior que llama a la función walletOfOwner para comprobar que el SBT que tiene el dueño en su dirección coincide con aquél al que se pretende aplicar un tratamiento. Incluye también la sintaxis “_;” utilizada para exigir que primero se procese la condición y posteriormente el código de las funciones en las que se aplica el modificador. 

Esta función cuenta con un único parámetro uint256 _soulBoundToken que hace referencia al identificador del SBT del cual se hará la comprobación descrita en el párrafo anterior. Al ser un modifier, no devuelve nada en sí misma. En caso de no cumplirse la condición establecida se cancela la ejecución del código posterior y devuelve un mensaje del porqué. Esta función condicional es prescindible si se añade el require individualmente en las funciones trustYourFam y deleteFam, pero es indispensable limitarlas con dicha condición.


























