import React, { useId } from "react";
import { forwardRef } from "react";

const Input = forwardRef(function Input(
    { label, type = "text", className = "", ...props },
    ref
) {
    const id = useId();
    return (
        <div className="w-auto">
            {label && <label className="pr-3">{label}</label>}
            <input
                type={type}
                className={`bg-slate-600 ${className}`}
                ref={ref}
                {...props}
                id={id}
            />
        </div>
    );
});

export default Input;
