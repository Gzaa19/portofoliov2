import { useState, useCallback } from "react";

/**
 * useToggle - Hook for boolean state toggle
 * 
 * @param initialValue - Initial boolean value
 * @returns Array with current value and toggle function
 * 
 * @example
 * const [isOpen, toggleOpen] = useToggle(false);
 * <button onClick={toggleOpen}>Toggle</button>
 */
export function useToggle(initialValue: boolean = false): [boolean, () => void] {
    const [value, setValue] = useState(initialValue);

    const toggle = useCallback(() => {
        setValue((prev) => !prev);
    }, []);

    return [value, toggle];
}
