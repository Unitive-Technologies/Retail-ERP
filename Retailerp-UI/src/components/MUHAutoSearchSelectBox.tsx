import React, { useRef } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Typography, useTheme } from "@mui/material";
import { PopperProps } from "@mui/material/Popper/BasePopper.types";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
type optionProps = {
  label: string;
  value: string | number;
};
const MUHAutoSearchSelectBox = ({
  options = [],
  onChange,
  multiple = false,
  selectedValues = [],
  isError,
  borderColor,
  height,
  inputLabel,
  required,
  labelColor,
  placeholder = "Search ...",
  isReadOnly,
  isCheckbox = true,
  searchStyle,
  popWidth,
  PopperComponent,
  ...rest
}: {
  options: optionProps[];
  placeholder?: string;
  onChange: (e: any, val: any) => void;
  multiple?: boolean;
  selectedValues: any[];
  isError?: boolean;
  borderColor?: string;
  height?: number;
  inputLabel?: string;
  required?: boolean;
  labelColor?: string;
  isReadOnly?: boolean;
  isCheckbox?: boolean;
  popWidth?: number;
  searchStyle?: React.CSSProperties;
  PopperComponent?: React.JSXElementConstructor<PopperProps>;
}) => {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleOptionChange = (event: any, selectedValue: any) => {
    onChange(event, selectedValue);
    if (!multiple && inputRef.current) {
      inputRef.current.blur();
    }
  };
  return (
    <>
      {inputLabel && (
        <Typography
          variant='inherit'
          sx={{
            color:
              labelColor || isError
                ? theme.Colors.redPrimary
                : theme.Colors.blackPrimary,
            paddingBottom: theme.Spacing.tiny_x,
            fontSize:'14px',
            fontWeight:500
          }}
        >
          {inputLabel}
          {required && (
            <span
              style={{
                color: theme.Colors.redPrimary,
                fontWeight: theme.fontWeight.medium,
              }}
            >
              &nbsp;*
            </span>
          )}
        </Typography>
      )}
      <Autocomplete
        multiple={multiple}
        options={options}
        getOptionLabel={(option) => (option.label ? option.label : "")}
        disableCloseOnSelect={multiple}
        isOptionEqualToValue={(option, value) => option.label === value.label}
        onChange={!isReadOnly ? handleOptionChange : undefined}
        value={selectedValues}
        disabled={isReadOnly}
        sx={{ ...searchStyle }}
        {...rest}
        ListboxProps={{
          style: {
            maxHeight: "300px",
            overflowY: "auto",
          },
        }}
        renderOption={(props, option, { selected }) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              {isCheckbox ? (
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
              ) : null}
              {option.label}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={selectedValues?.length ? "" : placeholder}
            error={isError}
            sx={{
              "& .MuiInputBase-input::placeholder": {
                color: theme.Colors.stormGray,
                opacity: 1, 
              },
              "& .MuiOutlinedInput-input": {
                fontSize: theme.MetricsSizes.small_xx,
                fontWeight: theme.fontWeight.regular,
                color: theme.Colors.grayBlue,
                padding: "0.75rem 1rem",
              },
              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor:
                  borderColor ||
                  (isError ? theme.Colors.redPrimary : theme.Colors.platinum),
                borderWidth: theme.Spacing.tiny_x,
                borderRadius: theme.Spacing.small_xx,
              },
              "& .MuiOutlinedInput-root": {
                pointerEvents: isReadOnly ? "none" : "auto",
                height: height ? `${height}px` : "auto",
                "&.Mui-focused fieldset": {
                  borderColor:
                    borderColor ||
                    (isError
                      ? theme.Colors.redPrimary
                      : theme.Colors.platinum),
                  borderWidth: theme.Spacing.tiny_x,
                },
              },
              "&:hover:not(.Mui-focused)": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor:
                    borderColor ||
                    (isError
                      ? theme.Colors.redPrimary
                      : theme.Colors.platinum),
                },
              },
            }}
            inputRef={(node) => {
              if (node) {
                if (typeof params.InputProps.ref === "function") {
                  params.InputProps.ref(node);
                } else if (params.InputProps.ref) {
                  (
                    params.InputProps.ref as React.MutableRefObject<any>
                  ).current = node;
                }
                inputRef.current = node;
              }
            }}
            disabled={isReadOnly}
          />
        )}
        PopperComponent={PopperComponent}
      />
    </>
  );
};

export default MUHAutoSearchSelectBox;
