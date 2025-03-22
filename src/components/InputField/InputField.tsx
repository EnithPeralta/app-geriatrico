import React from 'react';
import { InputFieldProps } from './types';

export const InputField = (props: InputFieldProps) => {
    return (
        <div className="input-container-register">
            <label>{props.label}</label>
            <div className="input-wrapper">
                <input
                    type={props.type}
                    name={props.name}
                    value={props.type === "file" ? undefined : props.value}
                    onChange={props.onChange}
                    placeholder={props.placeholder}
                    required={props.required}
                    accept='image/*'
                />
                {props.icon && <i className={props.icon} onClick={props.onClick}></i>}
            </div>
        </div>
    );
};
