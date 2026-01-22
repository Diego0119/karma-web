import { useRef, useEffect } from 'react';

export default function PinInput({ value, onChange, disabled = false, error = false }) {
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const digits = value.split('').concat(['', '', '', '']).slice(0, 4);

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs[0].current && !disabled) {
      inputRefs[0].current.focus();
    }
  }, [disabled]);

  const handleChange = (index, e) => {
    const inputValue = e.target.value;

    // Only allow numbers
    if (inputValue && !/^\d$/.test(inputValue)) {
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = inputValue;
    const newValue = newDigits.join('').slice(0, 4);
    onChange(newValue);

    // Move to next input if digit was entered
    if (inputValue && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // If current input is empty, go to previous and clear it
        inputRefs[index - 1].current?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
    if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pastedData) {
      onChange(pastedData);
      const focusIndex = Math.min(pastedData.length, 3);
      inputRefs[focusIndex].current?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={inputRefs[index]}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-14 h-16 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
              : disabled
              ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white'
          }`}
          aria-label={`Dígito ${index + 1} del PIN`}
        />
      ))}
    </div>
  );
}
