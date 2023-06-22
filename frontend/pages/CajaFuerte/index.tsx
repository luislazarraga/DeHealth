import {
  Button,
  VStack,
  Text,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";
import {
  useContractRead,
  erc721ABI,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
} from "wagmi";
import { MedicalVaultABI, SBTsABI } from "../../config/abi";
import {
  SBTsContractAddress,
  MedicalVaultContractAddress,
} from "../../config/constants";
import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface Registro {
  antecedentes: string;
  analitica: string;
  enfermedades: string;
  anotaciones: string;
  medicacion: string;
}
const Home: NextPage = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [valueAñadir1, setValueAñadir1] = useState<string | undefined>();
  const [valueAñadir2, setValueAñadir2] = useState<string | undefined>();
  const [valueAñadir3, setValueAñadir3] = useState<string | undefined>();
  const [valueAñadir4, setValueAñadir4] = useState<string | undefined>();
  const [valueAñadir5, setValueAñadir5] = useState<string | undefined>();

  const [valueAñadirToken, setValueAñadirToken] = useState<
    number | undefined
  >();

  const [valueVToken, setValueVToken] = useState<number | undefined>();
  const [valueRToken, setValueRToken] = useState<number | undefined>();
  const [valueRIndex, setValueRIndex] = useState<number | undefined>();

  const [getRegistro, setRegistro] = useState<Registro>();

  const [getLongitudCaja, setLongitudCaja] = useState<number | undefined>();
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
    enabled: Boolean(hasSBT) && Number(hasSBT) > 0,
    watch: true,
  });
  //recuperarRegistro
  const { data: registro } = useContractRead({
    address: MedicalVaultContractAddress,
    abi: MedicalVaultABI,
    args: [
      valueRIndex ? BigInt(valueRIndex) : BigInt(0),
      valueRToken ? BigInt(valueRToken) : BigInt(0),
    ],
    functionName: "recuperarRegistro",
    watch: true,
    account: address,
    onSuccess(data) {
      console.log(data);
    },
  });
  //recuperarVault
  const { data: vault } = useContractRead({
    address: MedicalVaultContractAddress,
    abi: MedicalVaultABI,
    functionName: "recuperarVault",
    args: [valueVToken ? BigInt(valueVToken) : BigInt(0)],
    account: address,
    watch: true,
    onSuccess(data) {
      console.log("VAULT");
      console.log(data);
    },
  });

  //annadirRegistro
  const { config: añadirConfig, isError: isErrorAñadir } =
    usePrepareContractWrite({
      address: MedicalVaultContractAddress,
      abi: MedicalVaultABI,
      functionName: "annadirRegistroEnCajaFuerte",
      args: [
        valueAñadir1 ?? "",
        valueAñadir2 ?? "",
        valueAñadir3 ?? "",
        valueAñadir4 ?? "",
        valueAñadir5 ?? "",
        valueAñadirToken ? BigInt(valueAñadirToken) : BigInt(""),
      ],
    });
  const { isLoading: isLoadingAñadir, write: writeAñadir } =
    useContractWrite(añadirConfig);

  function handleRegistro() {
    const r: Registro = registro
      ? {
        antecedentes: registro[0],
        analitica: registro[1],
        enfermedades: registro[2],
        anotaciones: registro[3],
        medicacion: registro[4],
      }
      : {
        antecedentes: "",
        analitica: "",
        enfermedades: "",
        anotaciones: "",
        medicacion: "",
      };
    setRegistro(r);
  }
  return (
    <>
      <Head>
        <title>Caja | Caja Management</title>
      </Head>

      <VStack
        gap={10}
        color={"black"}
        bgColor={"rgb(254, 242, 184)"}
        py={10}
        px={10}
        minH={"85vh"}
      >
        <Text>
          Aquí podrás controlar tu caja fuerte, consultar, añadir registros
          médicos o consultar todos los registros que tiene almacenados
        </Text>
        {address === undefined || chain?.id !== 250 ? (
          <VStack
            gap={3}
            textAlign={"left"}
            bgColor={"white"}
            borderRadius={20}
            borderWidth={2}
            borderColor={"rgb(2, 62, 84)"}
            py={"20px"}
            px={"20px"}
          >
            <Text>Primero hay que conectarse</Text>
            <ConnectButton label={"Connect"} />
          </VStack>
        ) : (
          <HStack
            w={"full"}
            justify={"space-between"}
            align={"stretch"}
            gap={5}
          >
            <VStack
              bgColor={"white"}
              borderRadius={20}
              borderWidth={2}
              borderColor={"rgb(2, 62, 84)"}
              flex={1}
              py={"1%"}
            >
              <Text>Función para añadir un registro</Text>
              <Input
                w={"75%"}
                borderColor={"rgba(4,5,25,1)"}
                _placeholder={{ color: "black" }}
                placeholder="Antecedentes médicos"
                _hover={{ borderColor: "rgba(4,5,25,1)" }}
                _focus={{ borderColor: "rgba(4,5,25,1)" }}
                onChange={(s) => setValueAñadir1(s.target.value)}
                value={valueAñadir1}
              ></Input>
              <Input
                w={"75%"}
                borderColor={"rgba(4,5,25,1)"}
                _placeholder={{ color: "black" }}
                placeholder="Analítica sanguínea"
                _hover={{ borderColor: "rgba(4,5,25,1)" }}
                _focus={{ borderColor: "rgba(4,5,25,1)" }}
                onChange={(s) => setValueAñadir2(s.target.value)}
                value={valueAñadir1}
              ></Input>
              <Input
                w={"75%"}
                borderColor={"rgba(4,5,25,1)"}
                _placeholder={{ color: "black" }}
                placeholder="Enfermedades crónicas"
                _hover={{ borderColor: "rgba(4,5,25,1)" }}
                _focus={{ borderColor: "rgba(4,5,25,1)" }}
                onChange={(s) => setValueAñadir3(s.target.value)}
                value={valueAñadir2}
              ></Input>
              <Input
                w={"75%"}
                borderColor={"rgba(4,5,25,1)"}
                _placeholder={{ color: "black" }}
                placeholder="Anotaciones subjetivas"
                _hover={{ borderColor: "rgba(4,5,25,1)" }}
                _focus={{ borderColor: "rgba(4,5,25,1)" }}
                onChange={(s) => setValueAñadir4(s.target.value)}
                value={valueAñadir3}
              ></Input>
              <Input
                w={"75%"}
                borderColor={"rgba(4,5,25,1)"}
                _placeholder={{ color: "black" }}
                placeholder="Medicación recetada"
                _hover={{ borderColor: "rgba(4,5,25,1)" }}
                _focus={{ borderColor: "rgba(4,5,25,1)" }}
                onChange={(s) => setValueAñadir5(s.target.value)}
                value={valueAñadir4}
              ></Input>
              <NumberInput
                min={0}
                w={"75%"}
                onChange={(s) => setValueAñadirToken(Number(s))}
                value={valueAñadirToken}
              >
                <NumberInputField
                  borderColor={"rgba(4,5,25,1)"}
                  _placeholder={{ color: "black" }}
                  placeholder="Introduce el id del SBT asociado"
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
              <Button
                onClick={() => {
                  writeAñadir && writeAñadir();
                }}
                isLoading={isLoadingAñadir}
                isDisabled={isErrorAñadir}
                loadingText="Añadiendo"
                w={"75%"}
                variant={"solid3"}
              >
                Añadir registro
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
              <Text>Función para recuperar un registro</Text>
              <VStack w={"full"}>
                <NumberInput
                  min={0}
                  w={"75%"}
                  onChange={(s) => setValueRIndex(Number(s))}
                  value={valueRIndex}
                >
                  <NumberInputField
                    borderColor={"rgba(4,5,25,1)"}
                    _placeholder={{ color: "black" }}
                    placeholder="Introduce el registro a recuperar"
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
                <NumberInput
                  min={0}
                  w={"75%"}
                  onChange={(s) => setValueRToken(Number(s))}
                  value={valueRToken}
                >
                  <NumberInputField
                    borderColor={"rgba(4,5,25,1)"}
                    _placeholder={{ color: "black" }}
                    placeholder="Introduce el id del SBT asociado"
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
                <Button
                  onClick={() => {
                    handleRegistro();
                  }}
                  w={"75%"}
                  variant={"solid3"}
                >
                  Recuperar registro
                </Button>
                {getRegistro && getRegistro.analitica !== "" ? (
                  <VStack w={"74%"} align={"start"}>
                    <Text>Antecedentes médicos {getRegistro.antecedentes}</Text>
                    <Text>Analítica sanguínea {getRegistro.analitica}</Text>
                    <Text>
                      Enfermedades crónicas {getRegistro.enfermedades}
                    </Text>
                    <Text>
                      Anotaciones subjetivas {getRegistro.anotaciones}
                    </Text>
                    <Text>Medicación recetada {getRegistro.medicacion}</Text>
                  </VStack>
                ) : (
                  <Text w={"74%"}>
                    Ese registro no existe o no tienes acceso a él
                  </Text>
                )}
              </VStack>
            </VStack>
            <VStack
              bgColor={"white"}
              borderRadius={20}
              borderWidth={2}
              borderColor={"rgb(2, 62, 84)"}
              flex={1}
              py={"1%"}
            >
              <Text>Función para recuperar todos los registros</Text>
              <NumberInput
                w={"75%"}
                onChange={(s) => setValueVToken(Number(s))}
                value={valueVToken}
                min={0}
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
              <Button
                onClick={() => {
                  console.log(vault);
                  setLongitudCaja(vault ? vault.length : 0);
                }}
                w={"75%"}
                variant={"solid3"}
              >
                Recuperar caja
              </Button>
              {vault && getLongitudCaja ? (
                <Text>
                  {getLongitudCaja === 1
                    ? "Solo tienes un registro el 0"
                    : `Tienes ${getLongitudCaja} registros (0-${getLongitudCaja - 1
                    })`}
                </Text>
              ) : (
                <>
                  {getLongitudCaja === 0 ? (
                    <Text w={"75%"}>
                      No hay ningún registro en ese SBT o no tienes acceso a
                      ellos
                    </Text>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </VStack>
          </HStack>
        )}
      </VStack>
    </>
  );
};

export default Home;
