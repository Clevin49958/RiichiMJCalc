import React from "react";
import Select from "react-select";

export function DropdownEntry<T extends string | number>({
  label,
  labels,
  values,
  setter,
  value,
}: {
  label: string;
  labels: string[] | number[];
  values: T[];
  value: T;
  setter: (t: T) => void;
}): JSX.Element {
  const options = labels.map((key, index) => ({
    value: values[index],
    label: key.toString(),
  }));
  interface OptionType {
    value: T;
    label: string;
  }
  return (
    <label>
      {label}:
      <Select<OptionType>
        value={options.find((obj) => obj.value === value)}
        options={options}
        isMulti={false}
        isClearable={false}
        isSearchable={false}
        onChange={(newValue) => {
          setter(newValue!.value);
        }}
      />
    </label>
  );
}
