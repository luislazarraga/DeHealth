import {
  Button,
  Grid,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  VStack,
  Image,
  GridItem,
  Tooltip,
  Flex,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import {
  erc721ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { SBTsContractAddress } from "../../config/constants";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { SBTsABI } from "../../config/abi";
import sbtCard from "../../assets/sbtcard.png";
import { FaQuestionCircle } from "react-icons/fa";
const Home: NextPage = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [valueAIF, setValueAIF] = useState<number | undefined>();
  const [valueApprove, setValueApprove] = useState<string | undefined>();

  //balanceOf
  const { data: hasSBT } = useContractRead({
    address: SBTsContractAddress,
    abi: erc721ABI,
    functionName: "balanceOf",
    args: [address === undefined ? "0x" : address],
    enabled: Boolean(address),
    watch: true,
  });
  const { data: totalSupply } = useContractRead({
    address: SBTsContractAddress,
    abi: erc721ABI,
    functionName: "totalSupply",
  });
  //walletOfOwner
  const { data: idSBT } = useContractRead({
    address: SBTsContractAddress,
    abi: SBTsABI,
    functionName: "walletOfOwner",
    args: [address === undefined ? "0x" : address],
    enabled: Boolean(hasSBT) && Number(hasSBT) === 1,
    watch: true,
  });

  //amIFam
  const { data: famCheck } = useContractRead({
    address: SBTsContractAddress,
    abi: SBTsABI,
    functionName: "amIFam",
    args: [
      address ? address : "0x0",
      valueAIF === undefined ? BigInt(0) : BigInt(valueAIF),
    ],
    watch: true,
    //account: address,
  });

  //trustYourFam
  const { config: approveConfig, isError: isErrorApprove } =
    usePrepareContractWrite({
      address: SBTsContractAddress,
      abi: SBTsABI,
      functionName: "trustYourFam",
      args: [
        valueApprove === undefined ? "0x0" : `0x${valueApprove}`,
        idSBT === undefined ? BigInt(0) : BigInt(idSBT),
      ],
      enabled: Boolean(hasSBT) && Number(hasSBT) === 1,
    });
  const { isLoading: isLoadingApprove, write: writeApprove } =
    useContractWrite(approveConfig);

  //issue
  const { config: mintConfig } = usePrepareContractWrite({
    address: SBTsContractAddress,
    abi: SBTsABI,
    functionName: "issue",
  });

  const {
    isLoading: isLoadingMint,
    isError: isErrorMint,
    write: writeMint,
  } = useContractWrite({
    ...mintConfig,
  });

  //deleteFam
  const { config: deleteConfig, isError: isErrorDelete } =
    usePrepareContractWrite({
      address: SBTsContractAddress,
      abi: SBTsABI,
      functionName: "deleteFam",
      args: [idSBT === undefined ? BigInt(0) : BigInt(idSBT)],
      enabled: Boolean(hasSBT) && Number(hasSBT) === 1,
    });
  const { isLoading: isLoadingDelete, write: writeDelete } =
    useContractWrite(deleteConfig);

  return (
    <>
      <Head>
        <title>SBT | SBT Management</title>
      </Head>

      <VStack
        px={"8%"}
        color={"black"}
        bgColor={"rgb(254, 242, 184)"}
        py={10}
        minH={"85vh"}
        gap={5}
        textAlign={"justify"}
        alignItems={"start"}
      >
        <Text alignSelf={"center"} fontSize={"2xl"} fontWeight={"semibold"}>
          Consigue tu llave y gestiona sus permisos
        </Text>
        <Text>
          El primer paso para utilizar la plataforma de DeHealth es obtener tu
          SBT personal.
        </Text>
        <Text>
          {" "}
          Los SBT o Soulbound Tokens son los encargados de implementar toda la
          lógica asociada al acceso de los datos médicos, tanto para añadir como
          para visualizarlos.{" "}
        </Text>
        <Text>
          El SBT funciona como una llave única para poder acceder a la caja
          fuerte personal asociada al mismo. Sin el SBT en posesión, no es
          posible acceder a los registros médicos de nadie. La única alternativa
          a contar con un SBT dado en la wallet para acceder a sus respectivos
          datos médicos es mediante el concepto de SBT de confianza.{" "}
        </Text>
        <Text>
          Además de poder acceder a la caja fuerte, cada SBT cuenta con una
          lista de direcciones de confianza. El usuario puede asignar a esta
          lista hasta 2 direcciones personales a las que otorga la posibilidad
          de acceder y añadir sus datos médicos. Esta lista puede ser vaciada y
          reescrita tantas veces como el usuario considere.
        </Text>
        <Grid
          pt={5}
          borderTop={"1px solid rgb(203, 193, 147)"}
          gap={10}
          templateColumns={
            address === undefined || chain?.id !== 250
              ? "repear(1,1fr)"
              : "repeat(2,1fr)"
          }
          justifyContent={
            address === undefined || chain?.id !== 250
              ? "center"
              : "space-between"
          }
          w={"full"}
        >
          {address === undefined || chain?.id !== 250 ? (
            <VStack
              bgColor={"white"}
              borderRadius={20}
              borderWidth={2}
              borderColor={"rgb(2, 62, 84)"}
              flex={1}
              py={"1%"}
            >
              <Text>Primero hay que conectarse</Text>
              <ConnectButton label={"Connect"} />
            </VStack>
          ) : (
            <>
              <Text
                justifySelf={"center"}
                fontSize={"2xl"}
                fontWeight={"semibold"}
              >
                Gestión de las direcciones de confianza
              </Text>
              <Text
                justifySelf={"center"}
                fontSize={"2xl"}
                fontWeight={"semibold"}
              >
                Tu SBT
              </Text>
              <VStack
                bgColor={"white"}
                borderRadius={20}
                borderWidth={2}
                borderColor={"rgb(2, 62, 84)"}
                flex={1}
                py={"1%"}
              >
                <Flex>
                  <Text fontSize={"xl"} fontWeight={"semibold"}>
                    Otorgar permisos de gestión a una dirección
                  </Text>
                  <Tooltip
                    hasArrow
                    label="*Puedes asignar un máximo de tres direcciones"
                    fontSize="md"
                    fontStyle={"italic"}
                  >
                    <span>
                      <FaQuestionCircle />
                    </span>
                  </Tooltip>
                </Flex>
                <HStack align={"center"} justify={"center"} w={"full"}>
                  <Input
                    w={"60%"}
                    borderColor={"rgba(4,5,25,1)"}
                    _placeholder={{ color: "black" }}
                    placeholder="Introduce la dirección de confianza"
                    _hover={{ borderColor: "rgba(4,5,25,1)" }}
                    _focus={{ borderColor: "rgba(4,5,25,1)" }}
                    onChange={(s) => setValueApprove(s.target.value.slice(2))}
                    value={valueApprove ? "0x" + valueApprove : undefined}
                  ></Input>
                </HStack>
                <Button
                  w={"60%"}
                  isDisabled={
                    (hasSBT !== undefined && Number(hasSBT) === 0) ||
                    valueApprove === "" ||
                    isErrorApprove
                  }
                  isLoading={isLoadingApprove}
                  loadingText="Dando permisos..."
                  onClick={() => {
                    writeApprove && writeApprove();
                  }}
                  variant={"solid3"}
                >
                  Dar permisos
                </Button>
              </VStack>

              <VStack
                bgColor={"white"}
                borderRadius={20}
                borderWidth={2}
                borderColor={"rgb(2, 62, 84)"}
                flex={1}
                py={"1%"}
              >
                <Text fontSize={"xl"} fontWeight={"semibold"}>
                  Obtén tu SBT
                </Text>
                <Button
                  w={"60%"}
                  isLoading={isLoadingMint}
                  onClick={() => {
                    writeMint && writeMint();
                  }}
                  loadingText="Minting"
                  isDisabled={isErrorMint || Number(hasSBT) > 0}
                  variant={"solid3"}
                >
                  Mint
                </Button>
              </VStack>
              <VStack
                bgColor={"white"}
                borderRadius={20}
                borderWidth={2}
                borderColor={"rgb(2, 62, 84)"}
                flex={1}
                py={"1%"}
              >
                <Text fontSize={"xl"} fontWeight={"semibold"}>
                  Eliminar direcciones de confianza
                </Text>
                <Text fontStyle={"italic"}>
                  *Esta funcion elimina los permisos de todas las direcciones de
                  confianza
                </Text>
                <Button
                  alignSelf={"center"}
                  w={"60%"}
                  isLoading={isLoadingDelete}
                  loadingText="Deleting"
                  isDisabled={isErrorDelete || Number(hasSBT) == 0}
                  onClick={() => {
                    writeDelete && writeDelete();
                  }}
                  variant={"solid3"}
                >
                  Delete fam
                </Button>
              </VStack>
              {hasSBT && hasSBT > 0 ? (
                <GridItem rowSpan={2}>
                  <VStack
                    bgColor={"white"}
                    borderRadius={20}
                    borderWidth={2}
                    borderColor={"rgb(2, 62, 84)"}
                    flex={1}
                    py={"1%"}
                  >
                    <Text fontSize={"xl"} fontWeight={"semibold"}>
                      El ID de tu SBT es {idSBT ? Number(idSBT) : ""}
                    </Text>
                    <Image w={"full"} maxH={"300px"} src={sbtCard.src}></Image>
                  </VStack>
                </GridItem>
              ) : (
                <></>
              )}
              <VStack
                bgColor={"white"}
                borderRadius={20}
                borderWidth={2}
                borderColor={"rgb(2, 62, 84)"}
                flex={1}
                py={"1%"}
              >
                <Text fontSize={"xl"} fontWeight={"semibold"}>
                  Comprueba tus permisos sobre un SBT
                </Text>
                <NumberInput
                  min={1}
                  max={totalSupply ? Number(totalSupply) : 0}
                  w={"60%"}
                  onChange={(s) => {
                    setValueAIF(Number(s));
                  }}
                  value={valueAIF}
                >
                  <NumberInputField
                    borderColor={"rgba(4,5,25,1)"}
                    _placeholder={{ color: "black" }}
                    placeholder="Introduce el id del SBT"
                    _hover={{ borderColor: "rgba(4,5,25,1)" }}
                    _focus={{ borderColor: "rgba(4,5,25,1)" }}
                  />
                  <NumberInputStepper
                    borderRightRadius={"3"}
                    bgColor={"rgba(4,5,25,1)"}
                  >
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Flex display={valueAIF === undefined ? "none" : "flex"}>
                  <Text>
                    {famCheck === true
                      ? "Tienes permisos de gestión sobre ese SBT"
                      : "No tienes permisos de gestión sobre ese SBT"}
                  </Text>
                </Flex>
              </VStack>
            </>
          )}
        </Grid>
      </VStack>
    </>
  );
};

export default Home;
