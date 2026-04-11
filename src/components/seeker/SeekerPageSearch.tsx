import { Input } from "@/components/ui/input";

type SeekerPageSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export function SeekerPageSearch({ value, onChange, placeholder }: SeekerPageSearchProps) {
  return (
    <div className="w-full">
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-9 w-full min-w-0 pl-9 lg:w-[220px]"
      />
    </div>
  );
}
