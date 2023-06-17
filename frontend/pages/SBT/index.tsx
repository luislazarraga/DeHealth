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
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { getContract } from "viem";
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
        px={"10%"}
        color={"black"}
        bgColor={"white"}
        py={10}
        minH={"85vh"}
        gap={5}
      >
        <Text>
          Los Soulbound Tokens (SBT) son tokens de identidad digital que
          representan los rasgos, características y logros que conforman una
          persona o entidad. Los SBT son emitidos por "Souls", que representan
          cuentas o billeteras de blockchain, y no se pueden transferir.
        </Text>
        <Grid
          rowGap={10}
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
            <VStack>
              <Text>Primero hay que conectarse</Text>
              <ConnectButton label={"Connect"} />
            </VStack>
          ) : (
            <>
              <VStack>
                <Text>
                  Función para comprobar si eres "trusted" del SBT dado
                </Text>
                <NumberInput
                  min={0}
                  w={"60%"}
                  onChange={(s) => setValueAIF(Number(s))}
                  value={valueAIF}
                >
                  <NumberInputField
                    borderColor={"rgba(4,5,25,1)"}
                    _placeholder={{ color: "black" }}
                    placeholder="Introduce el id de un SBT"
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
                <Text>{famCheck === true ? "Eres fam" : "No eres fam"}</Text>
              </VStack>
              <VStack>
                <Text>Función para el mint</Text>
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
              <VStack>
                <Text>
                  Función para aprobar un SBT de confianza, solo puedes tener 2
                  SBTs de confianza
                </Text>
                <HStack align={"center"} justify={"center"} w={"full"}>
                  <Input
                    w={"60%"}
                    borderColor={"rgba(4,5,25,1)"}
                    _placeholder={{ color: "black" }}
                    placeholder="Introduce el address de tu trusted"
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
                  loadingText="Approving"
                  onClick={() => {
                    writeApprove && writeApprove();
                  }}
                  variant={"solid3"}
                >
                  Trust your fam
                </Button>
              </VStack>
              <VStack>
                <Text>Función para borrar tus SBTs de confianza</Text>

                <Button
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
            </>
          )}
        </Grid>
      </VStack>
    </>
  );
};

export default Home;
