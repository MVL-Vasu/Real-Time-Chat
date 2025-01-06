import React from 'react';

const Input = ({ readOnly = false, maxLength, className, type, name, value, placeholder, required = false, inputRef, onChange, onKeyUp = null, spellCheck = true, autoComplete }) => {
     return (
          <input
               className={className ? className : 'input-field'}
               type={type}
               placeholder={placeholder}
               maxLength={maxLength}
               value={value}
               id={name}
               name={name}
               ref={inputRef}
               onKeyUp={onKeyUp}
               onChange={onChange}
               readOnly={readOnly}
               autoComplete={autoComplete}
               spellCheck={spellCheck}
               required={required}
          />
     );
}

export default Input;
