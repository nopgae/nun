import { useState, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = '카메라 검색... (Search cameras)' }: SearchBarProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    onSearch(v);
  };

  const handleClear = () => {
    setValue('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      {/* Search icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[rgba(0,240,255,0.5)]">
        ⌕
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-7 pr-8 py-2 font-mono text-xs text-white placeholder-[rgba(229,231,235,0.3)] outline-none"
        style={{
          background: 'rgba(0,240,255,0.05)',
          border: '1px solid rgba(0,240,255,0.2)',
          borderRadius: '4px',
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = 'rgba(0,240,255,0.5)';
          e.currentTarget.style.boxShadow = '0 0 10px rgba(0,240,255,0.1)';
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = 'rgba(0,240,255,0.2)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />

      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(229,231,235,0.4)] hover:text-white text-xs"
        >
          ✕
        </button>
      )}
    </div>
  );
}
