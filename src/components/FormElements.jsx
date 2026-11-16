import React, { forwardRef } from "react";

/**
 * Reusable FormLabel component
 * Standardized to #FFF1DF with optional required indicator.
 */
export const FormLabel = ({ children, required, htmlFor, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`block text-xs font-semibold uppercase tracking-wider text-[#FFF1DF] mb-1.5 ${className}`}
  >
    {children}
    {required && <span className="text-brand-orange ml-1">*</span>}
  </label>
);

/**
 * Reusable FormInput component
 * High-contrast #FFFFFF text on #17110D background with S4DS border/focus theme.
 */
export const FormInput = forwardRef(
  ({ type = "text", error, icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8A99A] pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full rounded-xl bg-[#17110D] text-[#FFFFFF] placeholder-[#B8A99A] border text-sm transition-all duration-150 focus:outline-none ${
            Icon ? "pl-10 pr-3.5 py-2.5" : "px-3.5 py-2.5"
          } ${
            error
              ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              : "border-[rgba(252,135,6,0.25)] focus:border-[#FC8706] focus:ring-2 focus:ring-[rgba(252,135,6,0.20)]"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
      </div>
    );
  }
);
FormInput.displayName = "FormInput";

/**
 * Reusable FormTextarea component
 */
export const FormTextarea = forwardRef(
  ({ rows = 3, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          rows={rows}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-[#17110D] text-[#FFFFFF] placeholder-[#B8A99A] border text-sm transition-all duration-150 focus:outline-none ${
            error
              ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              : "border-[rgba(252,135,6,0.25)] focus:border-[#FC8706] focus:ring-2 focus:ring-[rgba(252,135,6,0.20)]"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea";

/**
 * Reusable FormSelect component
 */
export const FormSelect = forwardRef(
  ({ children, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <select
          ref={ref}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-[#17110D] text-[#FFFFFF] border text-sm cursor-pointer transition-all duration-150 focus:outline-none ${
            error
              ? "border-rose-500/80 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
              : "border-[rgba(252,135,6,0.25)] focus:border-[#FC8706] focus:ring-2 focus:ring-[rgba(252,135,6,0.20)]"
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
      </div>
    );
  }
);
FormSelect.displayName = "FormSelect";

export default FormInput;
