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

      <HStack
        bgColor={"white"}
        justifyContent={"space-between"}
        minH={"85vh"}
        w={"full"}
        color={"black"}
      >
        <VStack flex={1} px={"5%"}>
          <Text>
            Aquí puedes controlar tu SBT, expedirlo, añadir usuarios de
            confianza, borrarlos...
          </Text>
          <Button
            onClick={() => {
              router.push("/SBT", undefined, { shallow: true });
            }}
            variant={"solid3"}
          >
            SBT
          </Button>
        </VStack>
        <VStack flex={1} px={"5%"}>
          <Text>
            Aquí podrás controlar tu caja fuerte. Puedes consultar un registro médico concreto o todos los almacenados y añadir nuevos.
          </Text>
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
    </>
  );
};

export default Home;
