import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

export default function ProfileSelector({ value, onChange, disabled = false }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Select Profile</label>

            <Select.Root value={value} onValueChange={onChange} disabled={disabled}>
                <Select.Trigger
                    className={`inline-flex items-center justify-between px-3 py-2 border rounded-md w-[180px] text-sm bg-white ${disabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    <Select.Value placeholder="Select profile..." />
                    <Select.Icon>
                        <ChevronDownIcon />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Content className="bg-white rounded-md shadow-md">
                    <Select.Viewport>

                        <Select.Item value="Proposal" className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
                            <Select.ItemText>Proposal</Select.ItemText>
                        </Select.Item>

                        <Select.Item value="Statement" className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
                            <Select.ItemText>Statement</Select.ItemText>
                        </Select.Item>

                        <Select.Item value="HVAC" className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
                            <Select.ItemText>HVAC</Select.ItemText>
                        </Select.Item>

                        <Select.Item value="Receipt" className="p-2 hover:bg-gray-100 cursor-pointer text-sm">
                            <Select.ItemText>Receipt</Select.ItemText>
                        </Select.Item>

                    </Select.Viewport>
                </Select.Content>
            </Select.Root>
        </div>
    );
}
