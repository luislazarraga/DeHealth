import {
    Button,
    ButtonProps,
    ComponentWithAs,
    forwardRef,
} from "@chakra-ui/react";
import { useNetwork, useSwitchNetwork } from "wagmi";

type NetworkButtonType = ComponentWithAs<"button", ButtonProps>;

const NetworkButton: NetworkButtonType = forwardRef(
    ({ children, ...props }, ref) => {
        const { chain } = useNetwork();
        const { switchNetwork, isLoading } = useSwitchNetwork();

        async function switchNetworkWrapper() {
            if (!switchNetwork) return;
            switchNetwork(250);
        }
        return (
            <>
                {chain === undefined ? (
                    <Button {...props} disabled ref={ref}>
                        NOT CONNECTED
                    </Button>
                ) : (
                    <>
                        {chain && chain.id !== 250 ? (
                            <>
                                {isLoading ? (
                                    <Button
                                        ref={ref}
                                        {...props}
                                        disabled
                                        onClick={() => switchNetworkWrapper()}
                                        isLoading
                                        loadingText="Switching"
                                    />
                                ) : (
                                    <Button
                                        ref={ref}
                                        {...props}
                                        onClick={() => switchNetworkWrapper()}
                                    >
                                        {"Switch to Fantom"}
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Button ref={ref} {...props}>
                                {children}
                            </Button>
                        )}
                    </>
                )}
            </>
        );
    }
);

export default NetworkButton;
