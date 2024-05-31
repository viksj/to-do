import React from "react";

export const InputField = ({
    id = "",
    label = "",
    type = "text",
    placeholder = "",
    value = "",
    error = "",
    onChange = () => { }
}) => {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label form-label-sm">
                {label}
            </label>
            <input
                type={type}
                className={`form-control form-control-sm ${error ? 'is-invalid' : ''}`}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
            {error && (
                <div className="invalid-feedback">
                    {error}
                </div>
            )}
        </div>
    );
};


export const Select = ({
    id = "",
    label = "",
    options = [],
    value = "",
    error = "",
    onChange = () => { }
}) => {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label form-label-sm">
                {label}
            </label>
            <select
                className={`form-select form-select-sm ${error ? 'is-invalid' : ''}`}
                id={id}
                value={value}
                onChange={onChange}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <div className="invalid-feedback">
                    {error}
                </div>
            )}
        </div>
    );
};


export const TextArea = ({
    id = "",
    label = "",
    placeholder = "",
    value = "",
    error = "",
    disabled=false,
    style={},
    rows="",
    onChange = () => { }
}) => {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label form-label-sm">
                {label}
            </label>
            <textarea
                className={`form-control ${error ? 'is-invalid' : ''}`}
                id={id}
                placeholder={placeholder}
                value={value}
                disabled={disabled}
                style={style}
                onChange={onChange}
                rows={rows}
            />
            {error && (
                <div className="invalid-feedback">
                    {error}
                </div>
            )}
        </div>
    );
};
