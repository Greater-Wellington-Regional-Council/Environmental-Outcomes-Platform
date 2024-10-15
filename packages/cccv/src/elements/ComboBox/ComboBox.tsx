import "./ComboBox.scss"
import React, { useState, useEffect, useRef, CSSProperties } from 'react'
import _ from 'lodash'
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid"

export interface ComboBoxProps {
    initialValue?: string;
    label?: string;
    placeholder?: string;
    options: OptionsFunction | OptionsArray | LabelAndValue[];
    onSelect: (option: LabelAndValue | null) => void;
    className?: string;
    buttonStyle?: CSSProperties | undefined;
    directionUp?: boolean;
    rememberItems?: number; // New prop to control how many items to cache
}

export type OptionsFunction = (query: string) => Promise<LabelAndValue[]>;

export type OptionsArray = LabelAndValue[];

export interface LabelAndValue { label: string; value: unknown }

const ComboBox: React.FC<ComboBoxProps> = ({
                                               initialValue = null,
                                               label = "Select item",
                                               placeholder = "Select item",
                                               options,
                                               onSelect,
                                               className = null,
                                               buttonStyle = null,
                                               directionUp = false,
                                               rememberItems = 5 // Default value of 5 remembered items
                                           }) => {
    const [query, setQuery] = useState(initialValue || '')
    const [filteredOptions, setFilteredOptions] = useState<LabelAndValue[]>([])
    const [cachedItems, setCachedItems] = useState<LabelAndValue[]>([]) // Cache state
    const inputContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (options instanceof Function) {
            if (query.length === 0) {
                setFilteredOptions([])
            } else if (query.length > 2) {
                options(query).then((options) => setFilteredOptions(options))
            }
        } else {
            if (query.length < 3) {
                filteredOptions?.length && setFilteredOptions([])
            } else if (query.length < 5) {
                setFilteredOptions((options as never[]).filter(option =>
                    (_.get(option, "label", option) as string).toLowerCase().includes(query.toLowerCase())))
            } else {
                setFilteredOptions(filteredOptions.filter(option => option.label.toLowerCase().includes(query.toLowerCase())))
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, options])

    // Prepend the cached items at the top of the list
    const combinedOptions = [...cachedItems, ...filteredOptions.filter(option => !cachedItems.find(cached => cached.label === option.label))]

    const selectedOption = (o: string | null): LabelAndValue | null =>
        combinedOptions.find(option => option.label.toLowerCase() === o?.toLowerCase()) || null

    const handleSelect = (option: LabelAndValue | null) => {
        if (option) {
            // Update cache with the selected item
            setCachedItems(prevItems => {
                const updatedItems = [option, ...prevItems.filter(item => item.label !== option.label)]
                return updatedItems.slice(0, rememberItems) // Limit to the rememberItems count
            })
            setQuery("")
            onSelect(option)
        }
    }

    return (
        <div className={`relative ${className}`} aria-label={label} >
            <div ref={inputContainerRef} className="flex">
                <input
                    className={`input-field mt-1 block text-nui w-full py-2 px-3 border-nui border-[2.3px] border-r-0 bg-white shadow-sm focus:outline-none focus:ring-nui-500 focus:border-nui sm:text-sm ${className}`}
                    type="search"
                    placeholder={placeholder}
                    autoComplete="off"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, borderBottomLeftRadius: "6px", borderTopLeftRadius: "6px", borderRight: 'none' }}
                />
                <button
                    type="button"
                    className="flex bg-white items-center mt-1 py-2 px-3 hover:text-textDefault hover:bg-white border-[2.3px]"
                    onClick={() => handleSelect(selectedOption(query))}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, borderLeft: 'none', ...buttonStyle }}
                >
                    <MagnifyingGlassIcon className="h-6 border-none ml-2 mr-2 text-nui" />
                </button>
            </div>

            {combinedOptions.length > 0 && (
                <div
                    id="options_list"
                    className={`absolute bg-transparent border-none z-10 ${directionUp ? 'bottom-full' : 'top-full'} w-auto`}
                    style={{ minWidth: inputContainerRef.current ? inputContainerRef.current.offsetWidth : 'auto' }}
                >
                    {combinedOptions.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(option)}
                            className={`cursor-pointer p-2 bg-gray-100 shadow rounded text-textDefault hover:bg-nui hover:text-white ${option.label.toLowerCase() === query.toLowerCase() ? 'bg-nui' : ''}`}
                            style={{
                                whiteSpace: 'nowrap',
                                marginTop: index === 0 ? '0' : '2px',
                                marginBottom: index === combinedOptions.length - 1 ? '0' : '2px'
                            }}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ComboBox