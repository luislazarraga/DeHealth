import { Flex, HStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import logo from "../../assets/logo.png";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  return (
    <HStack bgColor={"rgba(4,5,25,1)"} minH={"15vh"} px={"5%"} w={"full"}>
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
      </Flex>
    </HStack>
  );
}
