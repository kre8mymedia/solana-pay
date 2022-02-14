import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { TorusWalletAdapter } from '@solana/wallet-adapter-torus';
import { PublicKey } from '@solana/web3.js';
import React, { FC, useMemo, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { DEVNET_ENDPOINT } from '../../utils/constants';
import { ConfigProvider } from '../contexts/ConfigProvider';
import { FullscreenProvider } from '../contexts/FullscreenProvider';
import { PaymentProvider } from '../contexts/PaymentProvider';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { TransactionsProvider } from '../contexts/TransactionsProvider';
import { SolanaPayLogo } from '../images/SolanaPayLogo';
import { SOLIcon } from '../images/SOLIcon';
import * as css from './RootRoute.module.pcss';

export const RootRoute: FC = () => {
    // If you're testing without a phone, set this to true to allow a browser-based wallet connection to be used
    const connectWallet = false;
    const wallets = useMemo(
        () => (connectWallet ? [new PhantomWalletAdapter(), new TorusWalletAdapter()] : []),
        [connectWallet]
    );

    const [params] = useSearchParams();
    const { recipient, label } = useMemo(() => {
        let recipient: PublicKey | undefined, label: string | undefined;

        const recipientParam = params.get('recipient');
        const labelParam = params.get('label');
        if (recipientParam && labelParam) {
            try {
                recipient = new PublicKey(recipientParam);
                label = labelParam;
            } catch (error) {
                console.error(error);
            }
        }

        return { recipient, label };
    }, [params]);

    const [address, setAddress] = useState('');
    const [name, setName] = useState('');

    function scopePage() {
        console.log(name)
        console.log(address)
        if (name == "" || address == "") {
            alert("Missing name or address field")
            return;
        }

        window.location.href = `/?recipient=${address}&label=${name}`;
    }

    return (
        <ThemeProvider>
            <FullscreenProvider>
                {recipient && label ? (
                    <ConnectionProvider endpoint={DEVNET_ENDPOINT}>
                        <WalletProvider wallets={wallets} autoConnect={connectWallet}>
                            <WalletModalProvider>
                                <ConfigProvider
                                    recipient={recipient}
                                    label={label}
                                    symbol="SOL"
                                    icon={<SOLIcon />}
                                    decimals={9}
                                    minDecimals={1}
                                    requiredConfirmations={9}
                                    connectWallet={connectWallet}
                                >
                                    <TransactionsProvider>
                                        <PaymentProvider>
                                            <Outlet />
                                        </PaymentProvider>
                                    </TransactionsProvider>
                                </ConfigProvider>
                            </WalletModalProvider>
                        </WalletProvider>
                    </ConnectionProvider>
                ) : (
                    <div className={css.logo}>
                        <div className="container">
                            <div className="row">
                                <div className="col-sm-12 mx-auto text-center">
                                    <SolanaPayLogo width={240} height={88} />
                                </div>
                                <div className="col-sm-12 mx-auto text-center mt-4">
                                    <button type="button" className="btn btn-primary" style={{ background: "#914BF9", borderColor: 'white' }} data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Enter Credentials
                                    </button>
                                </div>
                                <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Recipient Credentials</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="form-group">
                                                    {/* <form> */}
                                                        <div className="mb-3">
                                                            <label>
                                                                Name:
                                                                <input
                                                                type="text"
                                                                name="name"
                                                                value={name}
                                                                placeholder="Enter a name"
                                                                onChange={(e) => {setName(e.target.value)}}
                                                                className="form-control" />
                                                            </label>
                                                        </div>
                                                        <div className="mb-3">
                                                            <label>
                                                                Recipient:
                                                                <input
                                                                type="text"
                                                                name="address"
                                                                value={address}
                                                                placeholder="Enter an address"
                                                                onChange={(e) => setAddress(e.target.value)}
                                                                className="form-control " />
                                                            </label>
                                                        </div>
                                                    {/* </form> */}
                                                </div>
                                            </div>
                                            <div className="modal-footer justify-content-between">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                <button type="button" className="btn btn-primary" style={{ background: "#914BF9", borderColor: 'white' }} onClick={() => scopePage()}>Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </FullscreenProvider>
        </ThemeProvider>
    );
};
