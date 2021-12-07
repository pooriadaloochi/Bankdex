import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { ProfileApiKeys, ProfileVerification } from '../../containers';
import { ProfileAccountActivity } from '../../containers/ProfileAccountActivity';
import { ProfileAuthDetails } from '../../containers/ProfileAuthDetails';
import { ReferralProgram } from '../../containers/ReferralProgram';
import { setDocumentTitle } from '../../helpers';

class ProfileComponent extends React.Component<RouterProps, IntlProps> {

    public componentDidMount() {
        setDocumentTitle('Profile');
    }

    public goBack = () => {
        this.props.history.goBack();
    };

    public render() {
        const lang = this.props.intl.locale
        return (
            <div className="container pg-profile-page">
                <div className="pg-profile-page__details">
                    <div className="row pg-profile-page-header pg-profile-page-header-first">
                        <h3 className={`col-12 ${lang === 'fa' && 'text-right'}`}>
                            <FormattedMessage id="page.body.profile.header.account" />
                        </h3>
                    </div>
                    <div className="row" dir={`${lang === 'fa' && 'rtl'}`}>
                        <div className="col-12 col-md-6 mx-0">
                            <div className="row col-12 mx-0 ">
                                <ProfileAuthDetails dir={`${lang === 'fa' && 'rtl'}`} />
                                <ReferralProgram dir={`${lang === 'fa' && 'rtl'}`} />
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <ProfileVerification dir={`${lang === 'fa' && 'rtl'}`} lang={lang} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <ProfileApiKeys dir={`${lang === 'fa' && 'rtl'}`} />
                    </div>
                    <div className="col-12">
                        <ProfileAccountActivity dir={`${lang === 'fa' && 'rtl'}`} />
                    </div>
                </div>
            </div>
        );
    }
}

export const ProfileScreen = compose(
    injectIntl,
    withRouter,
)(ProfileComponent) as React.ComponentClass;
