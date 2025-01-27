import classnames from 'classnames';
import * as React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import {
    Blur,
    CurrencyInfo,
    DepositCrypto,
    DepositFiat,
    TabPanel,
    WalletList,
} from '../../components';
import { DEFAULT_CCY_PRECISION } from '../../constants';
import { Withdraw, WithdrawProps } from '../../containers';
import { ModalWithdrawConfirmation } from '../../containers/ModalWithdrawConfirmation';
import { ModalWithdrawSubmit } from '../../containers/ModalWithdrawSubmit';
import { EstimatedValue } from '../../containers/Wallets/EstimatedValue';
// import { WalletHistory } from '../../containers/Wallets/History';
import { setDocumentTitle } from '../../helpers';
import {
    alertPush,
    beneficiariesFetch,
    Beneficiary,
    currenciesFetch,
    Currency,
    RootState,
    selectBeneficiariesActivateSuccess,
    selectBeneficiariesCreateSuccess,
    selectBeneficiariesDeleteSuccess,
    selectCurrencies,
    selectHistory,
    selectMobileWalletUi,
    selectUserInfo,
    selectWallets,
    selectWalletsLoading,
    selectWithdrawSuccess,
    setMobileWalletUi,
    User,
    Wallet,
    WalletHistoryList,
    walletsAddressFetch,
    walletsData,
    walletsFetch,
    walletsWithdrawCcyFetch,
    Market,
    selectMarkets,
    setCurrentMarket,
} from '../../modules';
import { incrementalOrderBook } from '../../api';
// import DropdownComponent from './../../components/Dropdown/index';
import { Dropdown } from 'react-bootstrap';

interface ReduxProps {
    user: User;
    wallets: Wallet[];
    withdrawSuccess: boolean;
    walletsLoading?: boolean;
    historyList: WalletHistoryList;
    mobileWalletChosen: string;
    beneficiariesActivateSuccess: boolean;
    beneficiariesDeleteSuccess: boolean;
    beneficiariesAddSuccess: boolean;
    currencies: Currency[];
    markets: Market[];
}

interface DispatchProps {
    fetchBeneficiaries: typeof beneficiariesFetch;
    fetchAddress: typeof walletsAddressFetch;
    fetchWallets: typeof walletsFetch;
    clearWallets: () => void;
    walletsWithdrawCcy: typeof walletsWithdrawCcyFetch;
    fetchSuccess: typeof alertPush;
    setMobileWalletUi: typeof setMobileWalletUi;
    currenciesFetch: typeof currenciesFetch;
    setCurrentMarket: typeof setCurrentMarket;
}

const defaultBeneficiary: Beneficiary = {
    id: 0,
    currency: '',
    name: '',
    state: '',
    data: {
        address: '',
    },
};

const defaultWallet: Wallet = {
    name: '',
    currency: '',
    balance: '',
    type: 'coin',
    fixed: 0,
    fee: 0,
};

interface WalletsState {
    activeIndex: number;
    otpCode: string;
    amount: string;
    beneficiary: Beneficiary;
    selectedWalletIndex: number;
    withdrawSubmitModal: boolean;
    withdrawConfirmModal: boolean;
    bchAddress?: string;
    filteredWallets?: Wallet[] | null;
    tab: string;
    withdrawDone: boolean;
    total: string;
    currentTabIndex: number;
}

interface OwnProps {
    walletsError: {
        message: string;
    };
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps & OwnProps;

class WalletsComponent extends React.Component<Props, WalletsState> {
    constructor(props: Props) {
        super(props);
        this.myRef = React.createRef();
        this.state = {
            activeIndex: 0,
            selectedWalletIndex: -1,
            withdrawSubmitModal: false,
            withdrawConfirmModal: false,
            otpCode: '',
            amount: '',
            beneficiary: defaultBeneficiary,
            tab: this.translate('page.body.wallets.tabs.deposit'),
            withdrawDone: false,
            total: '',
            currentTabIndex: 0,
        };
    }

    //tslint:disable member-ordering
    public translate = (id: string) => this.props.intl.formatMessage({ id });

    private title = this.translate('page.body.wallets.tabs.deposit.fiat.message1');
    private description = this.translate('page.body.wallets.tabs.deposit.fiat.message2');

    public componentDidMount() {
        setDocumentTitle('Wallets');
        const { wallets } = this.props;
        const { selectedWalletIndex } = this.state;

        if (this.props.wallets.length === 0) {
            this.props.fetchWallets();
        }

        if (selectedWalletIndex === -1 && wallets.length) {
            this.setState({ selectedWalletIndex: 0 });
            wallets[0]?.currency && this.props.fetchBeneficiaries({ currency_id: wallets[0].currency.toLowerCase() });
        }

        if (!this.props.currencies.length) {
            this.props.currenciesFetch();
        }
    }

    public componentWillUnmount() {
        this.props.clearWallets();
    }

    public componentWillReceiveProps(next: Props) {
        const {
            wallets,
            beneficiariesActivateSuccess,
            beneficiariesDeleteSuccess,
            withdrawSuccess,
            beneficiariesAddSuccess,
        } = this.props;
        const { selectedWalletIndex } = this.state;

        if (!wallets.length && next.wallets.length) {
            this.setState({ selectedWalletIndex: 0 });
            next.wallets[0]?.currency && this.props.fetchBeneficiaries({ currency_id: next.wallets[0].currency.toLowerCase() });
        }

        if (!withdrawSuccess && next.withdrawSuccess) {
            this.toggleSubmitModal();
        }

        if ((next.beneficiariesActivateSuccess && !beneficiariesActivateSuccess) ||
            (next.beneficiariesDeleteSuccess && !beneficiariesDeleteSuccess) ||
            (next.beneficiariesAddSuccess && !beneficiariesAddSuccess)) {
            const selectedCurrency = (next.wallets[selectedWalletIndex] || { currency: '' }).currency;

            this.props.fetchBeneficiaries({ currency_id: selectedCurrency.toLowerCase() });
        }
    }

    public render() {
        const { wallets, historyList, mobileWalletChosen, walletsLoading } = this.props;
        const {
            beneficiary,
            total,
            selectedWalletIndex,
            filteredWallets,
            withdrawSubmitModal,
            withdrawConfirmModal,
            currentTabIndex,
        } = this.state;
        const formattedWallets = wallets.map((wallet: Wallet) => ({
            ...wallet,
            currency: wallet.currency.toUpperCase(),
            iconUrl: wallet.iconUrl ? wallet.iconUrl : '',
        }));
        const selectedCurrency = (wallets[selectedWalletIndex] || { currency: '' }).currency;
        let confirmationAddress = '';
        let selectedWalletPrecision = DEFAULT_CCY_PRECISION;

        if (wallets[selectedWalletIndex]) {
            selectedWalletPrecision = wallets[selectedWalletIndex].fixed;
            confirmationAddress = wallets[selectedWalletIndex].type === 'fiat' ? (
                beneficiary.name
            ) : (
                beneficiary.data ? (beneficiary.data.address as string) : ''
            );
        }

        return (
            <React.Fragment>
                {wallets.length && <EstimatedValue wallets={wallets} />}
                <div className="pg-container pg-wallet">
                    <div className="text-center">
                        {walletsLoading && <Spinner animation="border" variant="primary" />}
                    </div>
                    <div className={`row no-gutters pg-wallet__tabs-content ${!historyList.length && 'pg-wallet__tabs-content-height'}`}>
                        <div className={`col-sm-12 col-12 ${mobileWalletChosen && 'd-none d-md-block'}`}>
                            <WalletList
                                onWalletSelectionChange={this.onWalletSelectionChange}
                                walletItems={filteredWallets || formattedWallets}
                                activeIndex={this.state.activeIndex}
                                onActiveIndexChange={this.onActiveIndexChange}
                                panels={this.renderTabs()}
                                onTabChange={(_, label) => this.onTabChange(label)}
                                currentTabIndex={currentTabIndex}
                                onCurrentTabChange={this.onCurrentTabChange}
                                moveScroll={this.myRef}
                                setMarkets={this.currencyPairSelectHandler}

                            />
                        </div>
                        <div className={`pg-wallet__tabs col-sm-12 col-12 ${!mobileWalletChosen && 'd-none d-md-block'}`}
                            ref={this.myRef}>
                            <TabPanel
                                panels={this.renderTabs()}
                                onTabChange={(_, label) => this.onTabChange(label)}
                                currentTabIndex={currentTabIndex}
                                onCurrentTabChange={this.onCurrentTabChange}
                                flexDirection={this.translate('directionFlex')}
                            />
                        </div>
                    </div>
                    <ModalWithdrawSubmit
                        show={withdrawSubmitModal}
                        currency={selectedCurrency}
                        onSubmit={this.toggleSubmitModal}
                    />
                    <ModalWithdrawConfirmation
                        show={withdrawConfirmModal}
                        amount={total}
                        currency={selectedCurrency}
                        rid={confirmationAddress}
                        onSubmit={this.handleWithdraw}
                        onDismiss={this.toggleConfirmModal}
                        precision={selectedWalletPrecision}
                    />
                </div>
            </React.Fragment>
        );
    }
    private currencyPairSelectHandler = (value) => {

        const { markets } = this.props;
        const key = value?.target?.id?.toLowerCase();

        const marketToSet = markets.find(el => el.base_unit === key);
        // this.props.setCurrentPrice(0);
        if (marketToSet) {
            this.props.setCurrentMarket(marketToSet);
            if (!incrementalOrderBook()) {
                this.props.depthFetch(marketToSet);
            }
        }
    };
    private onTabChange = label => this.setState({ tab: label });
    private onActiveIndexChange = index => this.setState({ activeIndex: index });
    private onCurrentTabChange = index => this.setState({ currentTabIndex: index });

    private toggleSubmitModal = () => {
        this.setState((state: WalletsState) => ({
            withdrawSubmitModal: !state.withdrawSubmitModal,
            withdrawDone: true,
        }));
    };

    private toggleConfirmModal = (amount?: string, total?: string, beneficiary?: Beneficiary, otpCode?: string) => {
        this.setState((state: WalletsState) => ({
            amount: amount || '',
            beneficiary: beneficiary ? beneficiary : defaultBeneficiary,
            otpCode: otpCode ? otpCode : '',
            withdrawConfirmModal: !state.withdrawConfirmModal,
            total: total || '',
            withdrawDone: false,
        }));
    };

    private renderTabs() {
        const { tab, selectedWalletIndex } = this.state;
        const { wallets } = this.props;

        if (selectedWalletIndex === -1) {
            return [{ content: null, label: '' }];
        }

        const showWithdraw = wallets[selectedWalletIndex].type === 'fiat' || wallets[selectedWalletIndex].balance;

        return [
            {
                content: tab === this.translate('page.body.wallets.tabs.deposit') ? this.renderDeposit(!!showWithdraw) : null,
                label: this.translate('page.body.wallets.tabs.deposit'),
            },
            {
                content: tab === this.translate('page.body.wallets.tabs.withdraw') ? this.renderWithdraw() : null,
                label: this.translate('page.body.wallets.tabs.withdraw'),
                disabled: !showWithdraw,
            },
        ];
    }

    private handleWithdraw = () => {
        const { selectedWalletIndex, otpCode, amount, beneficiary } = this.state;
        if (selectedWalletIndex === -1) {
            return;
        }

        const { currency } = this.props.wallets[selectedWalletIndex];
        const withdrawRequest = {
            amount,
            currency: currency.toLowerCase(),
            otp: otpCode,
            beneficiary_id: String(beneficiary.id),
        };
        this.props.walletsWithdrawCcy(withdrawRequest);
        this.toggleConfirmModal();
    };

    private handleOnCopy = () => {
        this.props.fetchSuccess({ message: ['page.body.wallets.tabs.deposit.ccy.message.success'], type: 'success' });
    };

    private handleGenerateAddress = () => {
        const { selectedWalletIndex } = this.state;
        const { wallets } = this.props;

        const wallet: Wallet = wallets[selectedWalletIndex] || defaultWallet;

        if (!wallet.deposit_address && wallets.length && wallet.type !== 'fiat') {
            this.props.fetchAddress({ currency: wallets[selectedWalletIndex].currency });
        }
    };

    private renderDeposit = (isAccountActivated: boolean) => {

        const {
            currencies,
            user,
            wallets,
        } = this.props;
        const { selectedWalletIndex } = this.state;

        const wallet: Wallet = (wallets[selectedWalletIndex] || defaultWallet);
        const currencyItem = (currencies && currencies.find(item => item.id === wallet.currency)) || { min_confirmations: 6, deposit_enabled: false };
        const text = this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.submit' },
            { confirmations: currencyItem.min_confirmations });
        const error = this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.deposit.ccy.message.pending' });

        const blurCryptoClassName = classnames('pg-blur-deposit-crypto', {
            'pg-blur-deposit-crypto--active': isAccountActivated,
        });

        const buttonLabel = `${this.translate('page.body.wallets.tabs.deposit.ccy.button.generate')} ${wallet.currency.toUpperCase()} ${this.translate('page.body.wallets.tabs.deposit.ccy.button.address')}`;

        if (wallets[selectedWalletIndex].type === 'coin') {
            return (
                <React.Fragment>
                    {currencyItem && !currencyItem.deposit_enabled ? (
                        <Blur
                            className={blurCryptoClassName}
                            text={this.translate('page.body.wallets.tabs.deposit.disabled.message')}
                        />
                    ) : null}
                    <CurrencyInfo wallet={wallets[selectedWalletIndex]} flexDirection={this.translate('directionFlex')} />
                    <DepositCrypto
                        buttonLabel={buttonLabel}
                        copiableTextFieldText={this.translate('page.body.wallets.tabs.deposit.ccy.message.address')}
                        copyButtonText={this.translate('page.body.wallets.tabs.deposit.ccy.message.button')}
                        error={error}
                        handleGenerateAddress={this.handleGenerateAddress}
                        handleOnCopy={this.handleOnCopy}
                        text={text}
                        wallet={wallet}
                        flexDirection={this.translate('directionFlex')}
                    />
                    {/* {wallet.currency && <WalletHistory label="deposit" type="deposits" currency={wallet.currency} flexDirection={this.translate('directionFlex')} />} */}
                </React.Fragment>
            );
        } if (wallets[selectedWalletIndex].currency === "irr") {
            return (
                <div className='RialCoin'>
                    {/* <CurrencyInfo wallet={wallets[selectedWalletIndex]} /> */}
                    <div className='RialCoin_header'>
                        <p>لطفا پیش از واریز وجه توضیحات زیر را به دقت مطالعه نمایید.مسئولیت مشکلات ناشی از عدم توجه به این موارد برعهده ی  مشتری خواهد بود.</p>
                        <a href="https://google.com">راهنمای تصویری</a>
                    </div>
                    <div className='RialCoin_raiseOfwalletsHeader'>
                        <p>
                            جهت افزایش اعتبار کیف پول ریالی خود با استفاده از کارت های بانک عضو شبکه شتاب و از طریق درگاه پرداخت اینترنتی اقدام نمایید .
                        </p>
                        <br />
                        <p>
                            در هنگام پرداخت به نکات زیر دقت نمایید :
                        </p>
                    </div>
                    <ul className='RialCoin_raiseOfwalletsHeader'>
                        <li>حتمابه آدرس صفحه ی درگاه بانکی دقت نموده و تنها پس از اطمینان از حضور در سایت های سامانه شاپرک مشخصات کارت بانکی خود را وارد کنید .</li>
                        <li>در صفحه درگاه دقت کنید که حتما مبلغ نمایش داده شده درست باشد .</li>
                        <li>در تعیین مبلغ واریز به این موضوع دقت نمایید که حداقل مبلغ معامله در بازار بانکدکس سیصدهزار تومان است .</li>
                    </ul>
                    <div className='RialCoin_bottomInputs'>
                        <span>
                            جهت واریز وجه ، حتما باید از کارت های بانکی به نام خودتان که در پروفایل تان ثبت و تایید شده است، استفاده نمایید .
                        </span>
                        <div className='RialCoin_bottomInputs_all'>
                            <div className='RialCoin_bottomInputs_all_dropdowns'>
                                <div className='RialCoin_bottomInputs_all_dropdowns_dropParent'>
                                    <span>
                                        کارت بانکی
                                    </span>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="primary" id="dropdown-basic"
                                        >
                                            انتخاب کارت
                                            {/* <ChevronIcon className="cr-dropdown__arrow" /> */}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu >
                                            1
                                        </Dropdown.Menu>
                                        <Dropdown.Menu >
                                            2
                                        </Dropdown.Menu>
                                        <Dropdown.Menu >
                                            3
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className='rialWithdraw_inputs_cost'>
                                    <span>
                                        شماره کارت را وارد کنید :
                                    </span>
                                    <input type='number' className='rialWithdraw_inputs_cost_inputCartNumber' />
                                </div>
                            </div>
                            <Button
                                // block={true}
                                type="button"
                                // onClick={handleGenerateAddress}
                                size="lg"
                                variant="primary"
                                className='addCart firstButton'
                            >
                                افزودن کارت
                            </Button>
                            <br />
                            <br />
                            <div className='RialCoin_bottomInputs_all_seccondInput'>
                                <div className='RialCoin_bottomInputs_all_seccondInput_right'>
                                    <span>
                                        مبلغ واریزی به تومان :
                                    </span>
                                    <br />
                                    <input />
                                </div>


                                <div className='RialCoin_bottomInputs_all_seccondInput_left'>
                                    <Button
                                        // block={true}
                                        type="button"
                                        // onClick={handleGenerateAddress}
                                        size="lg"
                                        variant="primary"
                                    >
                                        بازگشت به لیست کیف ها
                                    </Button>
                                    <Button
                                        // block={true}
                                        type="button"
                                        // onClick={handleGenerateAddress}
                                        size="lg"
                                        variant="primary"
                                    >
                                        انتقال به درگاه پرداخت
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            );
        } else {
            return (
                <React.Fragment>
                    <CurrencyInfo wallet={wallets[selectedWalletIndex]} />
                    {currencyItem && !currencyItem.deposit_enabled ? (
                        <Blur
                            className="pg-blur-deposit-fiat"
                            text={this.translate('page.body.wallets.tabs.deposit.disabled.message')}
                        />
                    ) : null}
                    <DepositFiat title={this.title} description={this.description} uid={user ? user.uid : ''} />
                    {/* {wallet.currency && <WalletHistory label="deposit" type="deposits" currency={wallet.currency} flexDirection={this.translate('directionFlex')} />} */}
                </React.Fragment>
            );
        }
    };

    private renderWithdraw = () => {
        // const { currencies, user, wallets, walletsError } = this.props;
        const { currencies, wallets, walletsError } = this.props;
        const { selectedWalletIndex } = this.state;
        const wallet = (wallets[selectedWalletIndex] || defaultWallet);
        const currencyItem = (currencies && currencies.find(item => item.id === wallet.currency));

        return (
            <React.Fragment>
                <CurrencyInfo wallet={wallets[selectedWalletIndex]} flexDirection={this.translate('directionFlex')} />
                {walletsError && <p className="pg-wallet__error">{walletsError.message}</p>}
                {currencyItem && !currencyItem.withdrawal_enabled ? (
                    <Blur
                        className="pg-blur-withdraw"
                        text={this.translate('page.body.wallets.tabs.withdraw.disabled.message')}
                    />
                ) : null}
                {this.renderWithdrawContent()}
                {/* {user.otp && wallet.currency && <WalletHistory label="withdraw" type="withdraws" currency={wallet.currency} flexDirection={this.translate('directionFlex')} />} */}
            </React.Fragment>
        );
    };

    private renderWithdrawContent = () => {
        const { withdrawDone, selectedWalletIndex } = this.state;

        if (selectedWalletIndex === -1) {
            return [{ content: null, label: '' }];
        }
        const { user: { level, otp }, wallets } = this.props;
        const wallet = wallets[selectedWalletIndex];
        const { currency, fee, type } = wallet;
        const fixed = (wallet || { fixed: 0 }).fixed;
        const rial = (wallets[selectedWalletIndex].currency === "irr")

        const withdrawProps: WithdrawProps = {
            withdrawDone,
            currency,
            fee,
            onClick: this.toggleConfirmModal,
            twoFactorAuthRequired: this.isTwoFactorAuthRequired(level, otp),
            fixed,
            type,
            withdrawAmountLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.amount' }),
            withdraw2faLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' }),
            withdrawFeeLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.fee' }),
            withdrawTotalLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.total' }),
            withdrawButtonLabel: this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.button' }),
        };

        return (otp && !rial) ? <Withdraw flexDirection={this.translate('directionFlex')} {...withdrawProps} /> : rial ? this.isRialWithdraw() : this.isOtpDisabled();
    };


    private isOtpDisabled = () => {
        return (
            <div className='withdraw_2fa'>
                <p className="pg-wallet__enable-2fa-message">
                    {this.translate('page.body.wallets.tabs.withdraw.content.enable2fa')}
                </p>
                <div className='pg-wallet__enable-2fa-message_button'>
                    <Button
                        block={true}
                        onClick={this.redirectToEnable2fa}
                        size="lg"
                        variant="primary"
                    >
                        {this.translate('page.body.wallets.tabs.withdraw.content.enable2faButton')}
                    </Button>
                </div>
            </div>
        );
    };
    private isRialWithdraw = () => {
        return (
            <div className='rialWithdraw'>
                <div className='rialWithdraw_header'>
                    <span>در صورت تمایل به برداشت موجودی کیف پول های خود ، درخواست خود را اینجا ثبت نمایید .</span>
                    <span>درصورت ثبت حساب بانک آینده و استفاده از آن، معمولا امکان انتقال داخل بانکی و تسریع درخواست برداشت وجود دارد .</span>

                    <Button
                        // block={true}
                        type="button"
                        // onClick={handleGenerateAddress}
                        size="lg"
                        variant="primary"
                        className='addCart'
                    >
                        زمان بندی تسویه ریالی بانکدکس
                    </Button>
                </div>
                <div className='rialWithdraw_inputs'>
                    <div className='rialWithdraw_inputs_cost'>
                        <span>
                            مبلغ برداشت (تومان) :
                        </span>
                        <br />
                        <input />
                    </div>
                    <ul className="rialWithdraw_inputs_balance">
                        <li>
                            <span>
                                موجودی قابل برداشت شما : 384و621 تومان
                            </span>
                            <Button
                                type="button"
                                variant="primary">
                                انتخاب
                            </Button>
                        </li>
                        <li>مجموع برداشت روزانه : 0 از 300,000,000 تومان </li>
                        <li>مجموع برداشت ماهانه : 4,990,286 از 300,000,000 تومان </li>
                    </ul>
                    <div className='RialCoin_bottomInputs_all_dropdowns rialWithdraw_inputs_count'>
                        <div>
                            <span>
                                شماره حساب بانک مقصد
                            </span>
                            <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic"
                                >
                                    انتخاب کارت
                                    {/* <ChevronIcon className="cr-dropdown__arrow" /> */}
                                </Dropdown.Toggle>
                                <Dropdown.Menu >
                                    1
                                </Dropdown.Menu>
                                <Dropdown.Menu >
                                    2
                                </Dropdown.Menu>
                                <Dropdown.Menu >
                                    3
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className='rialWithdraw_inputs_count_footer'>
                            <span>میتوانید هریک از حساب های بانکی تایید شده یخود را برای دریافت وجه انتخاب نمایید</span>
                            <Button
                                // block={true}
                                type="button"
                                // onClick={handleGenerateAddress}
                                size="lg"
                                variant="primary"
                                className='addCart'
                            >
                                افزودن کارت
                            </Button>
                        </div>

                    </div>
                    <div className='rialWithdraw_inputs_cost Identification'>
                        <span>
                            کد شناسایی دوعاملی :
                        </span>
                        <br />
                        <input />
                        <span>
                            شناسایی دو عاملی برای حساب شما فعال است .
                        </span>
                    </div>
                    <div className='rialWithdraw_inputs_cost Identification'>
                        <span>
                            کارمزد انتقال:
                        </span>
                        <br />
                        <input />
                        <span>
                            کارمزد انتقال ریال جهت انجام عملیات بانکی است .
                        </span>
                    </div>

                    <div className='RialCoin_bottomInputs_all_seccondInput_left footer_button_witdraw'>
                        <Button
                            // block={true}
                            type="button"
                            // onClick={handleGenerateAddress}
                            size="lg"
                            variant="primary"
                        >
                            مشاهده کارمزدها
                        </Button>
                        <Button
                            // block={true}
                            type="button"
                            // onClick={handleGenerateAddress}
                            size="lg"
                            variant="primary"
                        >
                            ایجاد درخواست برداشت
                        </Button>
                    </div>
                </div>
            </div>
        );
    };

    private redirectToEnable2fa = () => this.props.history.push('/security/2fa', { enable2fa: true });

    private isTwoFactorAuthRequired(level: number, is2faEnabled: boolean) {
        return level > 1 || (level === 1 && is2faEnabled);
    }

    private onWalletSelectionChange = (value: Wallet) => {
        const { wallets } = this.props;

        const nextWalletIndex = this.props.wallets.findIndex(
            wallet => wallet.currency.toLowerCase() === value.currency.toLowerCase()
        );

        this.setState({
            selectedWalletIndex: nextWalletIndex,
            withdrawDone: false,
        });

        this.props.fetchBeneficiaries({ currency_id: value.currency.toLowerCase() });
        this.props.setMobileWalletUi(wallets[nextWalletIndex].name);
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    wallets: selectWallets(state),
    walletsLoading: selectWalletsLoading(state),
    withdrawSuccess: selectWithdrawSuccess(state),
    historyList: selectHistory(state),
    mobileWalletChosen: selectMobileWalletUi(state),
    beneficiariesActivateSuccess: selectBeneficiariesActivateSuccess(state),
    beneficiariesDeleteSuccess: selectBeneficiariesDeleteSuccess(state),
    currencies: selectCurrencies(state),
    beneficiariesAddSuccess: selectBeneficiariesCreateSuccess(state),
    markets: selectMarkets(state),
});

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    fetchBeneficiaries: params => dispatch(beneficiariesFetch(params)),
    fetchWallets: () => dispatch(walletsFetch()),
    fetchAddress: ({ currency }) => dispatch(walletsAddressFetch({ currency })),
    walletsWithdrawCcy: params => dispatch(walletsWithdrawCcyFetch(params)),
    clearWallets: () => dispatch(walletsData([])),
    fetchSuccess: payload => dispatch(alertPush(payload)),
    setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
    currenciesFetch: () => dispatch(currenciesFetch()),
    setCurrentMarket: (payload) => dispatch(setCurrentMarket(payload))
});

export const WalletsScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(WalletsComponent) as React.ComponentClass;
