import classnames from 'classnames';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToProps, MapDispatchToPropsFunction } from 'react-redux';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { MarketsTable } from '../../containers';
import { toggleColorTheme } from '../../helpers';
import { Dropdown } from 'react-bootstrap';
import {
    RootState,
    selectCurrentColorTheme,
    selectUserLoggedIn,
    changeUserDataFetch,
    changeLanguage,
    User,
    selectCurrentLanguage,
    selectUserInfo
} from '../../modules';
import { languages } from '../../api/config';
import { ArrowIcon } from '../../assets/images/customization/ArrowIcon';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import 'swiper/react/swiper-react';


const FeaturesExchangeIcon = require('../../assets/images/landing/features/Exchange.svg');
const FeaturesTypesIcon = require('../../assets/images/landing/features/Types.svg');
const FeaturesCustomizeIcon = require('../../assets/images/landing/features/Customize.svg');
const FeaturesSecurityIcon = require('../../assets/images/landing/features/Security.svg');
const FeaturesCommunityIcon = require('../../assets/images/landing/features/Community.svg');
const FeaturesAPIIcon = require('../../assets/images/landing/features/API.svg');

const TelegramIcon = require('../../assets/images/landing/social/Telegram.svg');
const LinkedInIcon = require('../../assets/images/landing/social/LinkedIn.svg');
const TwitterIcon = require('../../assets/images/landing/social/Twitter.svg');
const YouTubeIcon = require('../../assets/images/landing/social/YouTube.svg');
const RedditIcon = require('../../assets/images/landing/social/Reddit.svg');
const FacebookIcon = require('../../assets/images/landing/social/Facebook.svg');
const MediumIcon = require('../../assets/images/landing/social/Medium.svg');
const CoinMarketIcon = require('../../assets/images/landing/social/CoinMarket.svg');
const enIcon = require('../../assets/images/sidebar/en.svg');
const faIcon = require('../../assets/images/sidebar/fa.svg');
// ../../assets/images/sidebar/${lang}.svg

interface ReduxProps {
    isLoggedIn: boolean;
    colorTheme: string;
    lang: string;
    user: User;
}
interface State {
    isOpenLanguage: boolean;
}
interface OwnProps {
    // onLinkChange?: () => void;
    // history: History;
    changeUserDataFetch: typeof changeUserDataFetch;
}
type Props = ReduxProps & RouteProps & IntlProps & State & OwnProps;

class Landing extends React.Component<Props> {
    public state = {
        isOpenLanguage: false,
    };
    public componentDidMount() {
        if (this.props.colorTheme === 'light') {
            toggleColorTheme('dark');
        }
    }

    public componentWillReceiveProps(next: Props) {
        if (next.colorTheme === 'light') {
            toggleColorTheme('dark');
        }
    }

    public componentWillUnmount() {
        if (this.props.colorTheme === 'light') {
            toggleColorTheme(this.props.colorTheme);
        }
    }

    public renderHeader() {

        const { isLoggedIn } = this.props;
        const lang = (this.props?.intl?.locale);

        const languageName = lang?.toUpperCase();
        const languageClassName = classnames('dropdown-menu-language-field', {
            'dropdown-menu-language-field-active': this.state.isOpenLanguage
        });
        if (isLoggedIn) {
            return (
                <div className="pg-landing-screen__header">
                    <div className="pg-landing-screen__header__wrap">
                        <div className="pg-landing-screen__header__wrap__left" style={{ cursor: 'pointer' }}
                            onClick={e => this.handleScrollTop()}>
                            <img src='/images/logo_bankdex.png' alt='BankDex' />
                            {/* <LogoIcon /> */}
                            <div className='pg-landing-screen__header__wrap__left_menu'>
                                <Link to='/trade'>
                                    {this.translate('page.header.navbar.trade')}
                                </Link>
                                <Link to='/'>
                                    {this.translate('page.header.navbar.markets')}
                                </Link>
                                <Link to='/' className=''>
                                    {this.translate('page.header.navbar.news')}
                                </Link>
                            </div>

                        </div>
                        <div className='pg-landing-screen__header__wrap__right'>
                            <Link to='/profile' className='landing-button'>
                                {this.translate('page.body.landing.header.button1')}
                            </Link>
                            <Dropdown style={{ marginLeft: '1rem' }}>
                                <Dropdown.Toggle variant='primary' id={languageClassName}>
                                    <img
                                        src={lang === 'en' ? enIcon : faIcon}
                                        alt={`${lang}-flag-icon`}
                                    />
                                    <span className='dropdown-menu-language-selected'>{languageName}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='dropdownMenu'>
                                    {this.getLanguageDropdownItems()}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className='pg-landing-screen__header'>
                <div className='pg-landing-screen__header__wrap'>
                    <div className='pg-landing-screen__header__wrap__left' style={{ cursor: 'pointer' }}
                        onClick={e => this.handleScrollTop()}>
                        {/* <LogoIcon /> */}

                        <img src='/images/logo_bankdex.png' alt='BankDex' />

                    </div>
                    <div className='pg-landing-screen__header__wrap__right'>
                        <Link to='/signin' className='landing-button landing-button--simple'>
                            {this.translate('page.body.landing.header.button2')}
                        </Link>
                        <Link to='/signup' className='landing-button'>
                            {this.translate('page.body.landing.header.button3')}
                        </Link>
                        <Dropdown style={{ marginLeft: '1rem' }}>
                            <Dropdown.Toggle variant='primary' id={languageClassName}>
                                <img
                                    src={lang === 'en' ? enIcon : faIcon}
                                    alt={`${lang}-flag-icon`}
                                />
                                <span className='dropdown-menu-language-selected'>{languageName}</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className='dropdownMenu'>
                                {this.getLanguageDropdownItems()}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        );

    }
    private tryRequire = (name: string) => {
        try {
            require(`../../assets/images/sidebar/${name}.svg`);

            return true;
        } catch (err) {
            return false;
        }
    };
    private handleChangeLanguage = (language: string) => {
        const { user, isLoggedIn } = this.props;
        if (isLoggedIn) {
            const data = user.data && JSON.parse(user.data);

            if (data && data.language && data.language !== language) {
                const payload = {
                    ...user,
                    data: JSON.stringify({
                        ...data,
                        language,
                    }),
                };

                this.props.changeUserDataFetch({ user: payload });
            }
        }

        // @ts-ignore
        this.props.changeLanguage(language);
    };
    public getLanguageDropdownItems = () => {
        return languages.map((l: string, index: number) =>
            <Dropdown.Item key={index} onClick={e => this.handleChangeLanguage(l)}>
                <div className='dropdown-row'>
                    <img
                        src={this.tryRequire(l) && require(`../../assets/images/sidebar/${l}.svg`)}
                        alt={`${l}-flag-icon`}
                    />
                    <span>{l.toUpperCase()}</span>
                </div>
            </Dropdown.Item>
        );
    };
    public renderMarketInfoBlock() {
        const { lang } = this.props
        return (
            <div className='pg-landing-screen__market-info'>
                <div className='pg-landing-screen__market-info__wrap'>
                    <div className='pg-landing-screen__market-info__wrap__title'>
                        <div style={{ width: '100%' }}>
                            <Swiper
                                spaceBetween={50}
                                pagination={{ clickable: true }}
                                loop={true}
                                // autoplay={{
                                //     delay: 2000,
                                //     disableOnInteraction: false
                                // }}
                                slidesPerView={1}
                                modules={[Autoplay]}
                            >
                                <SwiperSlide>
                                    <div className='sliderItem'>
                                        <div className='textslider'
                                            style={{
                                                right: `${lang === 'fa' ? '8%' : 'auto'}`,
                                                left: `${lang === 'fa' ? 'auto' : '8%'}`,
                                                direction: `${lang === 'fa' ? 'rtl' : 'ltr'}`
                                            }}>
                                            <h1>{this.translate('page.body.landing.marketInfo.title.text1')}</h1>
                                            <span style={{ float: `${lang === 'fa' ? 'right' : 'left'}` }} >
                                                {this.translate('page.body.landing.marketInfo.title.text3')}
                                            </span>
                                            <Link to='/signup' className='landing-button'>
                                                {this.translate('page.body.landing.registerNow.title')}
                                            </Link>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className='sliderItem'>
                                        <div className='textslider'>
                                            <h1>{this.translate('page.body.landing.marketInfo.title.text1')}</h1>
                                            <span>{this.translate('page.body.landing.marketInfo.title.text1')}</span>
                                            <Link to='/signup' className='landing-button'>
                                                {this.translate('page.body.landing.registerNow.title')}
                                            </Link>
                                        </div>
                                    </div>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <div className='sliderItem'>
                                        <div className='textslider'>
                                            <h1>{this.translate('page.body.landing.marketInfo.title.text1')}</h1>
                                            <span>{this.translate('page.body.landing.marketInfo.title.text')}</span>
                                            <Link to='/signup' className='landing-button'>
                                                {this.translate('page.body.landing.registerNow.title')}
                                            </Link>
                                        </div>
                                    </div>
                                </SwiperSlide>

                            </Swiper>
                        </div>
                    </div>
                    <MarketsTable slider={true} />
                </div>
            </div >
        );
    }

    prevBonusRef = React.createRef<HTMLInputElement>();
    nextBonusRef = React.createRef<HTMLInputElement>();
    public renderbounceBlock() {
        const { lang } = this.props
        return (
            <div className='Bonus'>
                <Swiper
                    spaceBetween={50}
                    pagination={{ clickable: true }}
                    // loop={true}
                    // autoplay={{
                    //     delay: 2000,
                    //     disableOnInteraction: false
                    // }}
                    slidesPerView={4}
                    modules={[Autoplay, Navigation]}
                    navigation={{
                        prevEl: this.prevBonusRef.current,
                        nextEl: this.nextBonusRef.current,
                    }}
                    onBeforeInit={(swiper) => {
                        // @ts-ignore
                        swiper.params.navigation.prevEl = this.prevBonusRef.current;
                        // @ts-ignore
                        swiper.params.navigation.nextEl = this.nextBonusRef.current;
                    }}
                >
                    <SwiperSlide>
                        <div className='sliderBonusItem'>
                            <img src="/images/bounce1.png" alt="" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='sliderBonusItem'>
                            <img src="/images/bounce2.png" alt="" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='sliderBonusItem'>
                            <img src="/images/bounce3.png" alt="" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='sliderBonusItem'>
                            <img src="/images/bounce2.png" alt="" />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className='sliderBonusItem'>
                            <img src="/images/bounce1.png" alt="" />
                        </div>
                    </SwiperSlide>

                    <div className='prevPaginationBonus' ref={this.prevBonusRef} >
                        <div className="prevPaginationBonus_button">
                            <ArrowIcon colorSvg={'var(--primary-text-color)'} />
                        </div>
                    </div>
                    <div className='nextPaginationBonus' ref={this.nextBonusRef} >
                        <div className="nextPaginationBonus_button">
                            <ArrowIcon colorSvg={'var(--primary-text-color)'} />
                        </div>
                    </div>
                    {/* <div ref={navigationNextRef} /> */}
                </Swiper>
                <h1 style={{ float: `${lang === 'fa' ? 'right' : 'left'}` }}>{this.translate('page.body.landing.marketInfo.title.exchange')}</h1>

                <MarketsTable slider={false} />
            </div>
        );
    }
    public renderPlatformInfoBlock() {
        return (
            <div className=''>
                {/* <div className='pg-landing-screen__platform-info'> */}
                {/* <div className='pg-landing-screen__platform-info__wrap'>
                    <div className='pg-landing-screen__platform-info__wrap__item'>
                        <span>{this.translate('page.body.landing.platformInfo.item.first.value')}</span>
                        <span>{this.translate('page.body.landing.platformInfo.item.first.title')}</span>
                    </div>
                    <div className='pg-landing-screen__platform-info__wrap__item'>
                        <span>{this.translate('page.body.landing.platformInfo.item.second.value')}</span>
                        <span>{this.translate('page.body.landing.platformInfo.item.second.title')}</span>
                    </div>
                    <div className='pg-landing-screen__platform-info__wrap__item'>
                        <span>{this.translate('page.body.landing.platformInfo.item.third.value')}</span>
                        <span>{this.translate('page.body.landing.platformInfo.item.third.title')}</span>
                    </div>
                </div> */}
            </div>
        );
    }

    public renderRegisterBlock() {
        return (
            <div className='pg-landing-screen__register'>
                <div className='pg-landing-screen__register__wrap'>
                    <div className='pg-landing-screen__register__wrap__item'>
                        <h1>{this.translate('page.body.landing.register.item.title')}</h1>
                        <h2>{this.translate('page.body.landing.register.item.text')}</h2>
                        <Link to='/signup' className='landing-button'>
                            {this.translate('page.body.landing.register.item.button')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    public renderFeaturesBlock() {
        return (
            <div className='pg-landing-screen__features'>
                <div className='pg-landing-screen__features__wrap'>
                    <h1>{this.translate('page.body.landing.features.title')}</h1>
                    <div className='pg-landing-screen__features__content'>
                        <div className='pg-landing-screen__features__content__row'>
                            <div className='pg-landing-screen__features__content__row__item'>
                                <img
                                    src={FeaturesExchangeIcon}
                                    alt={this.translate('page.body.landing.features.features.item1.title')}
                                />
                                <h2>{this.translate('page.body.landing.features.features.item1.title')}</h2>
                                <span>{this.translate('page.body.landing.features.features.item1.text')}</span>
                            </div>
                            <div className='pg-landing-screen__features__content__row__item'>
                                <img
                                    src={FeaturesTypesIcon}
                                    alt={this.translate('page.body.landing.features.features.item2.title')}
                                />
                                <h2>{this.translate('page.body.landing.features.features.item2.title')}</h2>
                                <span>{this.translate('page.body.landing.features.features.item2.text')}</span>
                            </div>
                        </div>
                        <div className='pg-landing-screen__features__content__row'>
                            <div className='pg-landing-screen__features__content__row__item'>
                                <img
                                    src={FeaturesCustomizeIcon}
                                    alt={this.translate('page.body.landing.features.features.item3.title')}
                                />
                                <h2>{this.translate('page.body.landing.features.features.item3.title')}</h2>
                                <span>{this.translate('page.body.landing.features.features.item3.text')}</span>
                            </div>
                            <div className='pg-landing-screen__features__content__row__item'>
                                <img
                                    src={FeaturesSecurityIcon}
                                    alt={this.translate('page.body.landing.features.features.item4.title')}
                                />
                                <h2>{this.translate('page.body.landing.features.features.item4.title')}</h2>
                                <span>{this.translate('page.body.landing.features.features.item4.text')}</span>
                            </div>
                        </div>
                        <div className='pg-landing-screen__features__content__row'>
                            <div className='pg-landing-screen__features__content__row__item'>
                                <img
                                    src={FeaturesCommunityIcon}
                                    alt={this.translate('page.body.landing.features.features.item5.title')}
                                />
                                <h2>{this.translate('page.body.landing.features.features.item5.title')}</h2>
                                <span>{this.translate('page.body.landing.features.features.item5.text')}</span>
                            </div>
                            <div className='pg-landing-screen__features__content__row__item'>
                                <img
                                    src={FeaturesAPIIcon}
                                    alt={this.translate('page.body.landing.features.features.item6.title')}
                                />
                                <h2>{this.translate('page.body.landing.features.features.item6.title')}</h2>
                                <span>{this.translate('page.body.landing.features.features.item6.text')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    public renderTradeOnTheGoBlock() {
        return (
            <div className='pg-landing-screen__trade-on-the-go'>
                <div className='pg-landing-screen__trade-on-the-go__wrap'>
                    <div className='pg-landing-screen__trade-on-the-go__wrap__image' />
                    <div className='pg-landing-screen__trade-on-the-go__wrap__content'>
                        <h1>{this.translate('page.body.landing.tradeOnTheGo.item.title')}</h1>
                        <h2>{this.translate('page.body.landing.tradeOnTheGo.item.text1')}</h2>
                        <h2>{this.translate('page.body.landing.tradeOnTheGo.item.text2')}</h2>
                        <h2>{this.translate('page.body.landing.tradeOnTheGo.item.text3')}</h2>
                        <Link to='/trading/' className='landing-button'>
                            {this.translate('page.body.landing.tradeOnTheGo.item.button')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    public renderStartTradingBlock() {
        return (
            <div className='pg-landing-screen__start-trading'>
                <div className='pg-landing-screen__start-trading__wrap'>
                    <h1>{this.translate('page.body.landing.startTrading.title')}</h1>
                    <div className='pg-landing-screen__start-trading__wrap__content'>
                        <Link to='/signup' className='landing-button'>
                            {this.translate('page.body.landing.startTrading.button1')}
                        </Link>
                        <Link to='/trading/' className='landing-button landing-button--secondary'>
                            {this.translate('page.body.landing.startTrading.button2')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    public renderFooter() {
        return (
            <div className='pg-landing-screen__footer'>
                <div className='pg-landing-screen__footer__wrap'>
                    <div className='pg-landing-screen__footer__wrap__left' onClick={e => this.handleScrollTop()}>
                        {/* <LogoIcon /> */}

                        <img src='/images/logo_bankdex.png' alt='BankDex' />

                    </div>
                    <div className='pg-landing-screen__footer__wrap__navigation'>
                        <div className='pg-landing-screen__footer__wrap__navigation__col'>
                            <Link to='/trading/'>{this.translate('page.body.landing.footer.exchange')}</Link>
                            <Link to='/wallets'>{this.translate('page.body.landing.footer.wallets')}</Link>
                            <Link to='/'>{this.translate('page.body.landing.footer.fees')}</Link>
                        </div>
                        <div className='pg-landing-screen__footer__wrap__navigation__col'>
                            <Link to='/'>{this.translate('page.body.landing.footer.faq')}</Link>
                            <Link to='/'>{this.translate('page.body.landing.footer.support')}</Link>
                            <Link to='/'>{this.translate('page.body.landing.footer.privacy')}</Link>
                        </div>
                        <div className='pg-landing-screen__footer__wrap__navigation__col'>
                            <Link to='/'>{this.translate('page.body.landing.footer.about')}</Link>
                            <Link to='/'>{this.translate('page.body.landing.footer.community')}</Link>
                            <Link to='/'>{this.translate('page.body.landing.footer.info')}</Link>
                        </div>
                    </div>
                    <div className='pg-landing-screen__footer__wrap__social'>
                        <div className='pg-landing-screen__footer__wrap__social__row'>
                            <img src={TelegramIcon} alt='Telegram' />
                            <img src={LinkedInIcon} alt='LinkedIn' />
                            <img src={TwitterIcon} alt='Twitter' />
                            <img src={YouTubeIcon} alt='YouTube' />
                        </div>
                        <div className='pg-landing-screen__footer__wrap__social__row'>
                            <img src={RedditIcon} alt='Reddit' />
                            <img src={FacebookIcon} alt='Facebook' />
                            <img src={MediumIcon} alt='MediumIcon' />
                            <img src={CoinMarketIcon} alt='CoinMarket' />
                        </div>
                    </div>
                </div>
                <span
                    className='pg-landing-screen__footer__rights'>{this.translate('page.body.landing.footer.rights')}</span>
            </div>
        );
    }

    public render() {

        return (
            <div className='pg-landing-screen'>
                {this.renderHeader()}
                {this.renderMarketInfoBlock()}
                {this.renderPlatformInfoBlock()}
                {this.renderbounceBlock()}
                {this.renderRegisterBlock()}
                {this.renderFeaturesBlock()}
                {this.renderTradeOnTheGoBlock()}
                {this.renderStartTradingBlock()}
                {this.renderFooter()}
            </div>
        );
    }

    private handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    private translate = (key: string) => this.props.intl.formatMessage({ id: key });
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    isLoggedIn: selectUserLoggedIn(state),
    colorTheme: selectCurrentColorTheme(state),
    lang: selectCurrentLanguage(state),
    user: selectUserInfo(state)
});
const mapDispatchToProps: MapDispatchToPropsFunction<MapDispatchToProps<any, any>, {}> = dispatch => ({
    changeLanguage: payload => dispatch(changeLanguage(payload)),
    // toggleSidebar: payload => dispatch(toggleSidebar(payload)),
    // logoutFetch: () => dispatch(logoutFetch()),
    changeUserDataFetch: payload => dispatch(changeUserDataFetch(payload))
});
export const LandingScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps)
)(Landing) as React.ComponentClass;
