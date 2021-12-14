import * as React from 'react';
import { injectIntl } from 'react-intl';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { IntlProps } from '../../';
import { ProfileAccountActivity } from '../../containers/ProfileAccountActivity';
import { setDocumentTitle } from '../../helpers';

class ActivityComponent extends React.Component<RouterProps, IntlProps> {

    public componentDidMount() {
        setDocumentTitle('Activity');
    }

    public goBack = () => {
        this.props.history.goBack();
    };

    public render() {
        const lang = this.props.intl.locale
        return (
            <div className="container-fluid pg-profile-page row m-0">
                {/* <div className="col-12"> */}
                <ProfileAccountActivity dir={`${lang === 'fa' && 'rtl'}`} />
                {/* </div> */}
            </div>
        );
    }
}

export const ActivityScreen = compose(
    injectIntl,
    withRouter,
)(ActivityComponent) as React.ComponentClass;
