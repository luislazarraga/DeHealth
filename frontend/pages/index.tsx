import { VStack, HStack, Text, Button } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>SBT | SBT Management</title>
      </Head>

      <VStack
        justifyContent={"space-between"}
        minH={"85vh"}
        w={"full"}
        color={"black"}
        bgColor={"rgb(254, 242, 184)"}
      >
        <Text py={5} fontSize={"2xl"} fontWeight={"bold"}>
          DeHealth - Salud Descentralizada
        </Text>
        <HStack w={"full"} gap={20} justifyContent={"space-between"} px={50}>
          <VStack
            bgColor={"white"}
            borderRadius={20}
            borderWidth={2}
            borderColor={"rgb(2, 62, 84)"}
            flex={1}
            px={"2%"}
            py={"1%"}
          >
            <Text fontWeight={"bold"}>SBT</Text>
            <HStack>
              <Text fontSize={"sm"}>
                Consigue y gestiona tu{" "}
                <span style={{ fontStyle: "italic" }}>token</span> de acceso
              </Text>
            </HStack>
            <Button
              onClick={() => {
                router.push("/SBT", undefined, { shallow: true });
              }}
              variant={"solid3"}
            >
              SBT
            </Button>
          </VStack>
          <VStack
            bgColor={"white"}
            borderRadius={20}
            borderWidth={2}
            borderColor={"rgb(2, 62, 84)"}
            flex={1}
            px={"2%"}
            py={"1%"}
          >
            <Text fontWeight={"bold"}>ALMACENAMIENTO</Text>
            <Text fontSize={"sm"}>Añade o consulta tus registros médicos</Text>
            <Button
              onClick={() => {
                router.push("/CajaFuerte", undefined, { shallow: true });
              }}
              variant={"solid3"}
            >
              Caja fuerte
            </Button>
          </VStack>
        </HStack>
        <Text>
          DeHealth plantea una alternativa a la gestión de datos médicos a
          través de la tecnología blockchain. A día de hoy estos se encuentran
          en posesión de los distintos agentes e instituciones que hacen uso de
          ellos, desde instituciones públicas como la Seguridad Social en España
          hasta aseguradoras u otras organizaciones privadas. A raíz de ello,
          los pacientes han perdido la soberanía de los mismos, siendo estos
          capaces de visualizarlos como un agente más de la cadena al igual que
          las ya mencionadas. El objetivo de DeHealth es devolver a los
          pacientes la autoridad de su información médica de tal forma que sean
          ellos quienes decidan quién, cuándo y durante cuánto puede alguien
          acceder a su información privada. El otro de los objetivos que aborda
          este proyecto es garantizar la interoperabilidad del sistema,
          solucionando el problema que hoy existe entre los sistemas de gestión
          de datos médicos de todo el mundo. A diferencia del modelo actual, en
          este los datos residen dentro de una cadena de bloques la cual puede
          ser accedida de la misma forma desde cualquier parte del mundo en
          cualquier momento, eliminando los intermediarios actuales. La forma de
          acceso a los datos personales de cada usuario se lleva a cabo mediante
          unos tokens únicos denominados SoulBound Tokens o SBT. Cada SBT
          representa una llave no transferible asociada a todos los datos
          médicos de un determinado paciente. El poseedor de cada SBT cuenta con
          todos los permisos sobre sus datos, pudiendo otorgar y revocar
          permisos de escritura y lectura sobre los mismos en función de su
          correspondiente necesidad.
        </Text>
      </VStack>
    </>
  );
};

export default Home;
