interface ActionToggleProps {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

export default function ActionToggle({ value, onChange, label }: ActionToggleProps) {
  return (
    <button
      type="button"
      className="flex items-center gap-3 group"
      onClick={() => onChange(!value)}
    >
      <div className="toggle-track" data-active={value}>
        <div className="toggle-knob" />
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </button>
  );
}
