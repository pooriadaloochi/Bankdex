import React, { useCallback } from 'react';
import { Wallet } from '../../modules';
// import { WalletItem } from '../WalletItem';
import { CryptoIcon } from '../CryptoIcon';
import { Decimal } from '../Decimal';
import { Link } from 'react-router-dom';
import {
    Market,
    Ticker,
} from '../../../../modules';


/**
 * Component for displaying lock icon.
 */
const LockIcon = () => {
    return (
        <svg width="11" height="13" viewBox="0 0 13 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.27501 4.06251V6.24997H1.30003C0.581781 6.24997 0 6.80935 0 7.49998V13.7501C0 14.4407 0.581781 15 1.30003 15H11.6999C12.4181 15 13 14.4407 13 13.7501V7.49998C13 6.80935 12.4181 6.24997 11.6999 6.24997H10.725V4.06251C10.725 1.81881 8.83335 0 6.5 0C4.16665 0 2.27501 1.81878 2.27501 4.06251ZM3.90001 6.24997V4.06251C3.90001 2.68128 5.06347 1.56246 6.49996 1.56246C7.93646 1.56246 9.09999 2.68128 9.09999 4.06251V6.24997H3.90001ZM5.19997 9.68751C5.19997 8.99692 5.78172 8.43754 6.49996 8.43754C7.21821 8.43754 7.79992 8.99692 7.79992 9.68751C7.79992 10.1282 7.56262 10.5157 7.20523 10.7376C7.20523 10.7376 7.33221 11.4752 7.47501 12.3438C7.47501 12.6031 7.25727 12.8125 6.98749 12.8125H6.01244C5.74269 12.8125 5.52499 12.6031 5.52499 12.3438L5.79477 10.7376C5.43735 10.5157 5.19997 10.1282 5.19997 9.68751Z"
                fill="#E5E6EF"
            />
        </svg>
    );
};
export interface WalletListProps {
    walletItems: Wallet[];
    panels: Tab[];
    activeIndex: number;
    /**
     * Callback function which is invoked whenever wallet item is clicked
     */
    onWalletSelectionChange(item: Wallet): void;
    /**
     * Callback function which is invoked whenever wallet item is clicked
     */
    onActiveIndexChange(index: number): void;
    markets: Market[];
}

interface ReduxProps {
    currentMarket: Market | undefined;
    markets: Market[];
    marketTickers: {
        [key: string]: Ticker,
    };
}
// const removeAlt = (str: string): string => str.replace('-alt', '');

const style: React.CSSProperties = {
    listStyleType: 'none',
    padding: 'calc(var(--gap) * 1) calc(var(--gap))',
    fontSize: '1.2rem',
};
const style2: React.CSSProperties = {
    listStyleType: 'none',
    padding: 'calc(var(--gap) * 1) calc(var(--gap))',
    fontSize: '1.2rem',
    textAlign: 'center',
};

/**
 * Component to display list of user wallets. It is scrollable and reacts on WalletItem click.
 */

export const WalletList: React.FC<WalletListProps> = ({
    onWalletSelectionChange,
    onActiveIndexChange,
    activeIndex,
    walletItems,
    panels,
    onTabChange,
    currentTabIndex,
    onCurrentTabChange,
    moveScroll,
    markets,
    setMarkets
}) => {

    const handleCallbackActiveToken = useCallback(
        (i: number, p: Wallet) => {
            moveScroll?.current?.scrollIntoView({ behavior: "smooth" });
            if (onWalletSelectionChange) {
                onWalletSelectionChange(p);
            }
            if (onActiveIndexChange) {
                onActiveIndexChange(i);
            }
        },
        [onWalletSelectionChange, onActiveIndexChange, moveScroll]
    );
    const createOnTabChangeHandler = useCallback(
        (index: number, panels: Tab) => {
            if (!panels.disabled) {
                if (onCurrentTabChange) {
                    onCurrentTabChange(index);
                }
                if (onTabChange) {
                    onTabChange(index, panels.label);
                }
            }
        },
        [onCurrentTabChange, onTabChange]
    );

    const handleClick = (i, p, index) => {
        handleCallbackActiveToken(i, p);
        createOnTabChangeHandler(index, panels[index]);
    }


    const defaultHeaders = [`      Token`, 'Name', 'Balance', 'Locked', 'Currency', 'Status', 'Ation']

    return (
        <table className="cr-wallet-list w-100">
            <tr className='cr-wallet-list-header'>
                {defaultHeaders.map((el, i) => <th style={i !== 6 ? style : style2}>{el}</th>)}
            </tr>
            {walletItems.map((p: Wallet, i: number) => p ?
                (<tr className={`${i === activeIndex ? 'active' : null}`}
                 style={{ margin: '1rem 0',cursor:"pointer" }}
                 onClick={() => handleClick(i, p, 0)}
                 >
                    <td style={style}>
                        {p.iconUrl ? (
                            <span className="cr-crypto-icon cr-wallet-item__icon">
                                <img alt={p.currency.toUpperCase()} src={p.iconUrl} />
                            </span>
                        ) : (<CryptoIcon
                            className={`cr-wallet-item__icon ${i === activeIndex && 'active'}`}
                            code={p.currency.toUpperCase()} />)}
                        <span>{p.currency}</span>
                    </td>
                    <td style={style}>
                        <span>{p.name}</span>
                    </td>
                    <td style={style}>
                        <Decimal fixed={p.fixed} thousSep=",">{p.balance ? p.balance.toString() : '0'}</Decimal>&nbsp;
                        {p.currency}
                    </td>
                    <td style={style}>
                        {
                            p.locked ? (
                                <div className="cr-wallet-item__amount-locked">
                                    <LockIcon /> <Decimal fixed={p.fixed} thousSep=",">{p.locked.toString()}</Decimal>
                                </div>) : ''
                        }
                    </td>
                    <td style={style}>
                        <Decimal fixed={p.fixed} thousSep=",">{p.balance ? p.balance.toString() : '0'}</Decimal>&nbsp;
                        {p.currency}
                    </td>
                    <td style={style}>
                        {p.deposit_address?.state}
                    </td>
                    <td style={style}>
                        <div className={i === activeIndex ? 'actionTableActive' : 'actionTable'}>
                            <span onClick={() => handleClick(i, p, 0)} style={{ cursor: 'pointer', }}>
                                Deposit
                            </span> |
                            <span onClick={() => handleClick(i, p, 1)} style={{ cursor: 'pointer', }}>
                                Withdraw
                            </span>
                            {/* <a onClick={() => handleClick(i, p)}>Deposit</a> | */}
                            <Link to='/trading' id={p.currency} onClick={(e) => setMarkets(e)}>Trade</Link>
                        </div>
                    </td>
                </tr>) : <span>there is no Token</span>)

            }
        </table >
    );
};