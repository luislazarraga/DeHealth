import { Flex, HStack, Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import logo from "../../assets/logo.png";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import NetworkButton from "../NetworkButton/NetworkButton";

export default function Navbar() {
  const router = useRouter();
  return (
    <HStack
      bgColor={"rgb(60, 91, 102)"}
      minH={"15vh"}
      px={"5%"}
      w={"full"}
      borderBottom={"2px rgb(2, 62, 84) solid"}
    >
      <Flex
        as={Button}
        variant={"logo"}
        onClick={() => {
          router.push("/", undefined, { shallow: true });
        }}
        flex={1}
        justify={"start"}
        align={"center"}
      >
        <Image width={80} height={40} alt="" src={logo.src} />
        <Text color="white">DeHealth</Text>
      </Flex>
      <Flex flex={4}></Flex>
      <Flex gap={5} flex={1}>
        <Button
          variant={"solid2"}
          onClick={() => {
            router.push("/SBT", undefined, { shallow: true });
          }}
        >
          SBT
        </Button>
        <Button
          variant={"solid2"}
          onClick={() => {
            router.push("/CajaFuerte", undefined, { shallow: true });
          }}
        >
          Caja
        </Button>
        <ConnectButton
          accountStatus={{ smallScreen: "address", largeScreen: "full" }}
          showBalance={false}
          label={"Connect"}
        ></ConnectButton>
      </Flex>
    </HStack>
  );
}
