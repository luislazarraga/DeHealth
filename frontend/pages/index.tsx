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
        minH={"99vh"}
        w={"full"}
      >
        <VStack flex={1}>
          <Button
            onClick={() => {
              router.push("/SBT", undefined, { shallow: true });
            }}
            variant={"solid3"}
          >
            SBT
          </Button>
        </VStack>
        <VStack flex={1}>
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
