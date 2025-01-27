import cx from 'classnames';
import * as React from 'react';
import { injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { captchaLogin } from '../../api';
import { Captcha, SignInComponent, TwoFactorAuth } from '../../components';
import { EMAIL_REGEX, ERROR_EMPTY_PASSWORD, ERROR_INVALID_EMAIL, setDocumentTitle } from '../../helpers';
import {
    Configs,
    GeetestCaptchaResponse,
    resetCaptchaState,
    RootState,
    selectAlertState,
    selectCaptchaResponse,
    selectConfigs,
    selectGeetestCaptchaSuccess,
    selectRecaptchaSuccess,
    selectSignInError,
    selectSignInRequire2FA,
    selectSignUpRequireVerification,
    selectUserFetching,
    selectUserLoggedIn,
    signIn,
    signInError,
    signInRequire2FA,
    signUpRequireVerification,
} from '../../modules';
import { CommonError } from '../../modules/types';
import { store } from './../../store'

interface ReduxProps {
    error?: CommonError;
    isLoggedIn: boolean;
    loading?: boolean;
    require2FA?: boolean;
    requireEmailVerification?: boolean;
    configs: Configs;
    captcha_response?: string | GeetestCaptchaResponse;
    reCaptchaSuccess: boolean;
    geetestCaptchaSuccess: boolean;
}

interface DispatchProps {
    signIn: typeof signIn;
    signInError: typeof signInError;
    signInRequire2FA: typeof signInRequire2FA;
    resetCaptchaState: typeof resetCaptchaState;
    signUpRequireVerification: typeof signUpRequireVerification;
}

interface SignInState {
    email: string;
    emailError: string;
    emailFocused: boolean;
    password: string;
    passwordError: string;
    passwordFocused: boolean;
    otpCode: string;
    error2fa: string;
    codeFocused: boolean;
}

type Props = ReduxProps & DispatchProps & RouterProps & IntlProps;

class SignIn extends React.Component<Props, SignInState> {
    public state = {
        email: '',
        emailError: '',
        emailFocused: false,
        password: '',
        passwordError: '',
        passwordFocused: false,
        otpCode: '',
        error2fa: '',
        codeFocused: false,
    };

    public componentDidMount() {
        setDocumentTitle('Sign In');
        this.props.signInError({ code: 0, message: [''] });
        this.props.signUpRequireVerification({ requireVerification: false });
    }

    public componentWillReceiveProps(nextProps: Props) {
        const { email } = this.state;

        if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
            this.props.resetCaptchaState();
            this.props.history.push('/wallets', { email: email });
        }

        if (nextProps.requireEmailVerification) {
            this.props.history.push('/email-verification', { email: email });
        }
    }

    public componentWillUnmount() {
        this.props.resetCaptchaState();
    }

    public renderCaptcha = () => {
        const { error } = this.props;

        return (
            <Captcha error={error} />
        );
    };

    public render() {
        const { loading, require2FA } = this.props;

        const className = cx('pg-sign-in-screen__container', { loading });
        const { isMobileDevice } = store.getState().public.colorTheme;
        return (
            <div className="pg-sign-in-screen">
                {!isMobileDevice
                    && <div className={"image_left"}>
                        <img src='/images/background.jpeg' alt='BankDex' />
                    </div>
                }
                <div className={className} dir={this.props.intl.locale === "fa" && 'rtl'}>
                    {!isMobileDevice && <div className="top_header_link">
                        {this.props.intl.locale === "fa" ? 'ثبت نام نکرده اید ؟' : 'Haven’t registered?'}
                        <Link to="/signup">
                            &nbsp;
                            {this.props.intl.locale === "fa" && ' الان '}
                            {this.props.intl.formatMessage({ id: 'page.header.signUp' })}
                            {this.props.intl.locale !== "fa" ? ' now' : ' کنید'}
                        </Link>
                    </div>}
                    {require2FA ? this.render2FA() : this.renderSignInForm()}
                </div>
            </div>
        );
    }

    private renderSignInForm = () => {
        const {
            configs,
            loading,
            captcha_response,
            reCaptchaSuccess,
            geetestCaptchaSuccess,
        } = this.props;
        const { email, emailError, emailFocused, password, passwordError, passwordFocused } = this.state;

        return (
            <SignInComponent
                email={email}
                emailError={emailError}
                emailFocused={emailFocused}
                emailPlaceholder={this.props.intl.formatMessage({ id: 'page.header.signIn.email' })}
                password={password}
                passwordError={passwordError}
                passwordFocused={passwordFocused}
                passwordPlaceholder={this.props.intl.formatMessage({ id: 'page.header.signIn.password' })}
                labelSignIn={this.props.intl.formatMessage({ id: 'page.header.signIn' })}
                labelSignUp={this.props.intl.formatMessage({ id: 'page.header.signUp' })}
                emailLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.email' })}
                passwordLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.password' })}
                receiveConfirmationLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.receiveConfirmation' })}
                forgotPasswordLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.forgotPassword' })}
                isLoading={loading}
                onForgotPassword={this.forgotPassword}
                onSignUp={this.handleSignUp}
                onSignIn={this.handleSignIn}
                handleChangeFocusField={this.handleFieldFocus}
                isFormValid={this.validateForm}
                refreshError={this.refreshError}
                changeEmail={this.handleChangeEmailValue}
                changePassword={this.handleChangePasswordValue}
                captchaType={configs.captcha_type}
                renderCaptcha={this.renderCaptcha()}
                reCaptchaSuccess={reCaptchaSuccess}
                geetestCaptchaSuccess={geetestCaptchaSuccess}
                captcha_response={captcha_response}
                lang={this.props.intl.locale}
            />
        );
    };

    private render2FA = () => {
        const { loading } = this.props;
        const { otpCode, error2fa, codeFocused } = this.state;

        return (
            <TwoFactorAuth
                isLoading={loading}
                onSubmit={this.handle2FASignIn}
                title={this.props.intl.formatMessage({ id: 'page.password2fa' })}
                label={this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' })}
                buttonLabel={this.props.intl.formatMessage({ id: 'page.header.signIn' })}
                message={this.props.intl.formatMessage({ id: 'page.password2fa.message' })}
                codeFocused={codeFocused}
                otpCode={otpCode}
                error={error2fa}
                handleOtpCodeChange={this.handleChangeOtpCode}
                handleChangeFocusField={this.handle2faFocus}
                handleClose2fa={this.handleClose}
                lang={this.props.intl.locale}
            />
        );
    };

    private refreshError = () => {
        this.setState({
            emailError: '',
            passwordError: '',
        });
    };

    private handleChangeOtpCode = (value: string) => {
        this.setState({
            error2fa: '',
            otpCode: value,
        });
    };

    private handleSignIn = () => {
        const { email, password } = this.state;
        const { configs: { captcha_type }, captcha_response } = this.props;

        if (captcha_type !== 'none' && captchaLogin()) {
            this.props.signIn({ email, password, captcha_response });
        } else {
            this.props.signIn({ email, password });
        }
    };

    private handle2FASignIn = () => {
        const { email, password, otpCode } = this.state;
        const { configs: { captcha_type }, captcha_response } = this.props;

        if (!otpCode) {
            this.setState({
                error2fa: 'Please enter 2fa code',
            });
        } else {
            if (captcha_type !== 'none' && captchaLogin()) {
                this.props.signIn({ email, password, captcha_response, otp_code: otpCode });
            } else {
                this.props.signIn({ email, password, otp_code: otpCode });
            }
        }
    };

    private handleSignUp = () => {
        this.props.history.push('/signup');
    };

    private forgotPassword = () => {
        this.props.history.push('/forgot_password');
    };

    private handleFieldFocus = (field: string) => {
        switch (field) {
            case 'email':
                this.setState(prev => ({
                    emailFocused: !prev.emailFocused,
                }));
                break;
            case 'password':
                this.setState(prev => ({
                    passwordFocused: !prev.passwordFocused,
                }));
                break;
            default:
                break;
        }
    };

    private handle2faFocus = () => {
        this.setState(prev => ({
            codeFocused: !prev.codeFocused,
        }));
    };

    private validateForm = () => {
        const { email, password } = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);

        if (!isEmailValid) {
            this.setState({
                emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                passwordError: '',
            });

            return;
        }
        if (!password) {
            this.setState({
                emailError: '',
                passwordError: this.props.intl.formatMessage({ id: ERROR_EMPTY_PASSWORD }),
            });

            return;
        }
    };

    private handleChangeEmailValue = (value: string) => {
        this.setState({
            email: value,
        });
    };

    private handleChangePasswordValue = (value: string) => {
        this.setState({
            password: value,
        });
    };

    private handleClose = () => {
        this.props.signInRequire2FA({ require2fa: false });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    alert: selectAlertState(state),
    error: selectSignInError(state),
    isLoggedIn: selectUserLoggedIn(state),
    loading: selectUserFetching(state),
    require2FA: selectSignInRequire2FA(state),
    requireEmailVerification: selectSignUpRequireVerification(state),
    configs: selectConfigs(state),
    captcha_response: selectCaptchaResponse(state),
    reCaptchaSuccess: selectRecaptchaSuccess(state),
    geetestCaptchaSuccess: selectGeetestCaptchaSuccess(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    signIn: data => dispatch(signIn(data)),
    signInError: error => dispatch(signInError(error)),
    signInRequire2FA: payload => dispatch(signInRequire2FA(payload)),
    resetCaptchaState: () => dispatch(resetCaptchaState()),
    signUpRequireVerification: data => dispatch(signUpRequireVerification(data)),
});

export const SignInScreen = compose(
    injectIntl,
    withRouter,
    connect(mapStateToProps, mapDispatchToProps),
)(SignIn) as React.ComponentClass;
