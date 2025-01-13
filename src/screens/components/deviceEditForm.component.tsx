import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DeviceEditForm = ({
  initialVehicleNumber,
  onSave,
  onCancel,
}: {
  initialVehicleNumber: string;
  onSave: (updatedVehicleNumber: string) => void;
  onCancel: () => void;
}) => {
  const [vehicleNumber, setVehicleNumber] = useState<string>(initialVehicleNumber);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus(); // Ensure input gets focus when the form is rendered
  }, []);

  return (
    <form onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col gap-2 w-full">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Enter Vehicle Number"
          value={vehicleNumber ?? ""}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />
        <div className="flex flex-row gap-2">
          <Button
            className="w-full bg-red-500 hover:bg-red-600"
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              onCancel();
              e.stopPropagation();
            }}
          >
            Cancel
          </Button>
          <Button
            className="w-full"
            onClick={(e) => {
              e.preventDefault(); // Prevent form submission
              onSave(vehicleNumber);
              e.stopPropagation();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default DeviceEditForm;

