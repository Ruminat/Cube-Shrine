"use client";

import { useCallback, useMemo, useState, type ChangeEvent, type ClipboardEvent } from "react";
import { normalizeAlgorithm, validateAlgorithm } from "../core/notation/algorithmFormat";

export type UseAlgorithmFieldOptions = {
  /**
   * When false (default), `setValue` and native `onChange` / `onPaste` reject updates that fail
   * {@link validateAlgorithm}. When true, any string is kept and {@link error} reflects validation.
   */
  allowInvalid?: boolean;
  /** Uncontrolled initial value. Ignored when `value` is set. */
  initialValue?: string;
  /** Controlled value. */
  value?: string;
  /** Fired after the value changes (blocked updates do not call this). */
  onChange?: (value: string) => void;
};

export type NativeAlgorithmFieldProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPaste: (e: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export type UseAlgorithmFieldResult = {
  value: string;
  /** Apply a full replacement string (same rules as typing / paste). Returns whether the value was applied. */
  setValue: (next: string) => boolean;
  error: string | undefined;
  normalized: string | undefined;
  /** Spread onto `<input />`. */
  inputProps: NativeAlgorithmFieldProps;
  /** Spread onto `<textarea />` or Radix `TextArea`. */
  textareaProps: NativeAlgorithmFieldProps;
};

const buildPasteValue = (
  current: string,
  el: HTMLInputElement | HTMLTextAreaElement,
  pasted: string
): string => {
  const start = el.selectionStart ?? current.length;
  const end = el.selectionEnd ?? current.length;
  return current.slice(0, start) + pasted + current.slice(end);
};

function useAlgorithmFieldCore(options: UseAlgorithmFieldOptions = {}): UseAlgorithmFieldResult {
  const { allowInvalid = false, initialValue = "", value: controlledValue, onChange } = options;
  const [inner, setInner] = useState(initialValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : inner;

  const error = useMemo(() => validateAlgorithm(value), [value]);
  const normalized = useMemo(() => (error ? undefined : normalizeAlgorithm(value)), [value, error]);

  const commit = useCallback(
    (next: string): boolean => {
      if (!allowInvalid && validateAlgorithm(next)) {
        return false;
      }
      if (!isControlled) {
        setInner(next);
      }
      onChange?.(next);
      return true;
    },
    [allowInvalid, isControlled, onChange]
  );

  const setValue = useCallback((next: string) => commit(next), [commit]);

  const onTypeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      commit(e.target.value);
    },
    [commit]
  );

  const onPaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const pasted = e.clipboardData.getData("text");
      const next = buildPasteValue(value, e.currentTarget, pasted);
      if (!allowInvalid && validateAlgorithm(next)) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      commit(next);
    },
    [allowInvalid, commit, value]
  );

  const fieldProps: NativeAlgorithmFieldProps = useMemo(
    () => ({
      value,
      onChange: onTypeChange,
      onPaste
    }),
    [value, onTypeChange, onPaste]
  );

  return {
    value,
    setValue,
    error,
    normalized,
    inputProps: fieldProps,
    textareaProps: fieldProps
  };
}

/** Controlled or uncontrolled {@link HTMLInputElement} helpers for WCA-style algorithms. */
export function useAlgorithmInput(options: UseAlgorithmFieldOptions = {}): UseAlgorithmFieldResult {
  return useAlgorithmFieldCore(options);
}

/** Same as {@link useAlgorithmInput} — use with `<textarea />` or Radix `TextArea`. */
export function useAlgorithmTextArea(options: UseAlgorithmFieldOptions = {}): UseAlgorithmFieldResult {
  return useAlgorithmFieldCore(options);
}
