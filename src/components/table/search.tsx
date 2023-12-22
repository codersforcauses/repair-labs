import React from "react";

export interface SearchProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  beforeInput?: React.ReactNode;
  afterInput?: React.ReactNode;
}

export default function Search({
  className,
  value,
  onChange,
  beforeInput,
  afterInput
}: SearchProps) {
  return (
    <div className={className}>
      {beforeInput}
      <input
        className="h-10 w-full rounded-3xl border-none bg-gray-200 px-5 py-2 text-sm focus:shadow-md focus:outline-none "
        type="search"
        name="search"
        placeholder="Search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      />
      {afterInput}
    </div>
  );
}
