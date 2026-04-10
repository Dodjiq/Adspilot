'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Shared custom Dropdown — replaces all native <select> and shadcn Select.
 *
 * Props:
 *   value      — current selected value (string | number)
 *   onChange   — (value) => void
 *   options    — Array<{ value: string|number, label: string }>
 *   placeholder — string shown when nothing is selected (optional)
 *   style      — outer container style overrides (optional)
 *   className  — outer container className overrides (optional)
 *   disabled   — boolean (optional)
 */
export function Dropdown({ value, onChange, options = [], placeholder = '', style = {}, className = '', disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const selected = options.find(o => String(o.value) === String(value));

  const triggerBase = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: '10px 14px',
    color: '#fff',
    fontSize: 14,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    userSelect: 'none',
    width: '100%',
    transition: 'border-color 0.15s, background 0.15s',
    boxSizing: 'border-box',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', ...style }}
    >
      <div
        onClick={() => !disabled && setOpen(p => !p)}
        style={triggerBase}
        onMouseEnter={e => {
          if (disabled) return;
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
        }}
      >
        <span style={{ color: selected ? '#fff' : 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown style={{
          width: 14,
          height: 14,
          color: 'rgba(255,255,255,0.45)',
          flexShrink: 0,
          marginLeft: 8,
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.15s',
        }} />
      </div>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0,
          right: 0,
          background: '#13131b',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8,
          zIndex: 400,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.65)',
          minWidth: '100%',
        }}>
          {options.map(opt => {
            const isActive = String(opt.value) === String(value);
            return (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                style={{
                  padding: '9px 14px',
                  cursor: 'pointer',
                  fontSize: 13,
                  color: isActive ? '#c4b5fd' : 'rgba(255,255,255,0.85)',
                  background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
                  transition: 'background 0.1s, color 0.1s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(124,58,237,0.28)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isActive ? 'rgba(124,58,237,0.2)' : 'transparent';
                  e.currentTarget.style.color = isActive ? '#c4b5fd' : 'rgba(255,255,255,0.85)';
                }}
              >
                {opt.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
