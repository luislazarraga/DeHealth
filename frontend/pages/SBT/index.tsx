import { Button, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>SBT | SBT Management</title>
      </Head>

      <VStack bgColor={"white"} py={10} minH={"85vh"}>
        <Button variant={"solid3"}>Funcion 1</Button>
        <Button variant={"solid3"}>Funcion 2</Button>
        <Button variant={"solid3"}>Funcion 3</Button>
      </VStack>
    </>
  );
};

export default Home;
