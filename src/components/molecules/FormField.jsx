import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const FormField = ({ 
  type = 'input',
  label,
  value,
  onChange,
  error,
  required = false,
  options = [],
  ...props 
}) => {
  const handleChange = (e) => {
    const newValue = e?.target ? e.target.value : e;
    onChange(newValue);
  };

  if (type === 'select') {
    return (
      <Select
        label={label}
        value={value}
        onChange={handleChange}
        options={options}
        error={error}
        required={required}
        {...props}
      />
    );
  }

  if (type === 'textarea') {
    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
        <textarea
          value={value}
          onChange={handleChange}
          className={`
            w-full px-3 py-2 border rounded-lg transition-all duration-200 resize-none
            ${error 
              ? 'border-error focus:border-error focus:ring-error' 
              : 'border-surface-300 focus:border-primary focus:ring-primary'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-0
          `}
          rows={4}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }

  return (
    <Input
      label={label}
      type={type}
      value={value}
      onChange={handleChange}
      error={error}
      required={required}
      {...props}
    />
  );
};

export default FormField;