import * as React from 'react';
// import { FormattedMessage } from 'react-intl';
import { Wallet } from '../../modules';
import { CryptoIcon } from '../CryptoIcon';
// import { Decimal } from '../Decimal';

export interface CurrencyInfoProps {
    wallet: Wallet;
}

interface CurrencyIconProps {
    icon?: string | null;
    currency: string;
}

const CurrencyIcon: React.FunctionComponent<CurrencyIconProps> = (props: CurrencyIconProps) => {
    return props.icon ?
        <img alt={props.currency} className="cr-wallet-item__single__image-icon" src={props.icon} /> :
        <CryptoIcon code={props.currency} />;
};

const CurrencyInfo: React.FunctionComponent<CurrencyInfoProps> = (props: CurrencyInfoProps) => {
    // const balance = props.wallet && props.wallet.balance ? props.wallet.balance.toString() : '0';
    // const lockedAmount = props.wallet && props.wallet.locked ? props.wallet.locked.toString() : '0';
    const currency = (props.wallet || { currency: '' }).currency.toUpperCase();
    // const selectedFixed = (props.wallet || { fixed: 0 }).fixed;

    // const stringLocked = lockedAmount ? lockedAmount.toString() : undefined;
    const iconUrl = props.wallet ? props.wallet.iconUrl : null;
    const { flexDirection } = props


    return (
        <div className={`cr-wallet-item__single m-0 ${flexDirection}`}>
            <CurrencyIcon icon={iconUrl} currency={currency} style={{ marginLeft: '1rem' }} />
            {/* <div className="cr-wallet-item__single-balance justify-content-start">
                <div style={{ margin: '0 1rem' }}>
                    <div className={`cr-wallet-item__amount-locked m-0 ${flexDirection}`}>
                        <FormattedMessage id="page.body.wallets.locked" />
                    </div>
                    <span className="cr-wallet-item__balance-locked">
                        <Decimal fixed={selectedFixed} thousSep=",">{stringLocked}</Decimal>
                    </span>
                </div>
                <div>
                    <span className={`cr-wallet-item__balance m-0 ${flexDirection}`}>
                        {currency}&nbsp;<FormattedMessage id="page.body.wallets.balance" />
                    </span>
                    &nbsp;
                    <span className="cr-wallet-item__balance-amount">
                        <Decimal fixed={selectedFixed} thousSep=",">{balance}</Decimal>
                    </span>
                </div>
            </div> */}
        </div>
    );
};

export {
    CurrencyInfo,
};
