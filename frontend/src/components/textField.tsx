interface TextFieldProps {
  containerStyle?: string;
  textFieldStyle?: string;
  inputStyle?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  value?: string;
}

export function TextField(props: TextFieldProps) {
  const {
    containerStyle,
    textFieldStyle,
    inputStyle,
    placeholder = "",
    onChange,
    type = "text",
    value
  } = props;
  return (
    <div className={` ${containerStyle}`}>
      <div className={`border border-black rounded-sm ${textFieldStyle}`}>
        <input
          type={type}
          className={`w-full h-8 p-2 text-black focus:ring-2 focus:ring-transparent outline-none ${inputStyle}`}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
      </div>
    </div>
  );
}
