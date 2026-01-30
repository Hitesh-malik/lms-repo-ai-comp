'use client'
import React from "react"

type SearchBarProps = {
  placeholder?: string
  onSearch?: (value: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search Something...",
  onSearch,
}) => {
  const [value, setValue] = React.useState("")

  const handleSearch = () => {
    if (onSearch) {
      onSearch(value)
    }
  }

  const inputClassName = "w-full outline-none bg-white pl-4 text-sm min-h-9"

  return (
    <div className="bg-white flex px-1 py-1 rounded-full border border-black-700 overflow-hidden w-full max-w-xl">
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={inputClassName}
          autoComplete="off"
        />
      <button
        type="button"
        onClick={handleSearch}
        className="bg-blue-600 hover:bg-blue-700 transition-all text-white text-sm rounded-full px-5 py-2.5"
      >
        Search
      </button>
    </div>
  )
}
