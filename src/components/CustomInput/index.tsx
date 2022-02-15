import * as React from 'react';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import { EyePassword } from '../../assets/images/EyePassword'
import { EyePasswordClose } from '../../assets/images/EyePasswordClose'

export interface CustomInputProps {
    type: string;
    label: string;
    defaultLabel: string;
    handleChangeInput?: (value: string) => void;
    inputValue: string | number;
    handleFocusInput?: () => void;
    placeholder: string;
    classNameLabel?: string;
    classNameInput?: string;
    autoFocus?: boolean;
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    id?: string;
    handleClick?: ((event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void);
    isDisabled?: boolean;
    labelVisible?: boolean;
    autoComplete?: string;
    name?: string;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}
type Props = CustomInputProps;

class CustomInput extends React.Component<Props> {
    public state = {
        passwordEye: true,
    };
    public render() {
        const {
            label,
            labelVisible,
            placeholder,
            defaultLabel,
            inputValue,
            classNameLabel,
            type,
            autoFocus,
            readOnly,
            id,
            handleClick,
            isDisabled,
            onKeyPress,
            autoComplete,
            name,
            flexDirection,
            // withdrawComponent
        } = this.props;
        const handleShowPassword = () => {
            this.setState({ passwordEye: !this.state.passwordEye });
        }

        return (
            <React.Fragment>
                <div className="custom-input" dir={flexDirection === 'flex-row-reverse' && 'rtl'}>
                    <label className={classNameLabel}
                        style={{
                            left: `${flexDirection === 'flex-row' && '10px'}`,
                            right: `${flexDirection === 'flex-row-reverse' && '10px'}`
                        }}>
                        {(labelVisible || inputValue) && (label || defaultLabel)}
                    </label>
                    <InputGroup size="lg">
                        <FormControl
                            className={`${flexDirection === 'flex-row-reverse' && 'text-right'}`}
                            size="lg"
                            type={type === 'password' ?
                                this.state.passwordEye ? type : 'text'
                                : type}
                            value={inputValue.toString()}
                            placeholder={placeholder}
                            autoFocus={autoFocus}
                            onFocus={this.props.handleFocusInput}
                            onBlur={this.props.handleFocusInput}
                            onChange={e => this.handleChangeValue(e)}
                            readOnly={readOnly}
                            id={id}
                            onClick={handleClick}
                            disabled={isDisabled}
                            onKeyPress={onKeyPress}
                            autoComplete={autoComplete}
                            name={name}
                        />
                        {type === 'password' &&
                            <InputGroup.Append>
                                <Button onClick={handleShowPassword} className={`eyePassword`}>
                                    {this.state.passwordEye ?
                                        <EyePasswordClose fillColor={'var(--icons)'} />
                                        : <EyePassword fillColor={'var(--icons)'} />}

                                </Button>
                            </InputGroup.Append>
                        }
                    </InputGroup>
                </div>
            </React.Fragment >
        );
    }

    private handleChangeValue = (e: OnChangeEvent) => {
        this.props.handleChangeInput && this.props.handleChangeInput(e.target.value);
    };
}

export {
    CustomInput,
};
