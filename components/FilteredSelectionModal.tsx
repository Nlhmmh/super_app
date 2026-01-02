import { useTheme } from "@/theme/ThemeContext";
import { labelValuePair } from "@/utils/models";
import { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import CustomScrollView from "./CustomScrollView";
import SearchBar from "./SearchBar";
import SelectBox from "./SelectBox";
import { ThemedView } from "./ThemedView";

interface FilteredSelectionModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  placeholder: string;
  allOptions: labelValuePair[];
  selectedValue: labelValuePair | undefined;
  onSelect: (value: labelValuePair | undefined) => void;
  defaultOption: labelValuePair;
}

const FilteredSelectionModal = ({
  open,
  setOpen,
  title,
  placeholder,
  allOptions,
  selectedValue,
  onSelect,
  defaultOption,
}: FilteredSelectionModalProps) => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<labelValuePair[]>(allOptions);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredOptions(allOptions);
      return;
    }
    const filtered = allOptions.filter((option) =>
      option.label.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchText, allOptions]);

  const handleSelect = (value: labelValuePair | undefined) => {
    if (selectedValue?.value === value?.value) {
      onSelect(defaultOption);
      return;
    }
    onSelect(value);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchText("");
  };

  return (
    <CustomModal
      open={open}
      setOpen={setOpen}
      title={title}
      onClose={handleClose}
      body={
        <ThemedView
          style={{
            borderWidth: 1,
            borderColor: theme.outline,
            borderRadius: 12,
            padding: 12,
            gap: 8,
          }}
        >
          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder={placeholder}
          />
          <CustomScrollView childGrow>
            <SelectBox
              options={filteredOptions}
              sel={selectedValue}
              setSel={handleSelect}
              isWrap
            />
          </CustomScrollView>
        </ThemedView>
      }
    />
  );
};

export default FilteredSelectionModal;
