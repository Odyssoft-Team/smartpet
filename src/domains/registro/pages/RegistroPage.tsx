import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ServicesPage() {
  return (
    <div>
      
      <div className="flex flex-col gap-4">
        <h1>Registro</h1>
        <Input />
      <Button
              size={"icon"}
              variant={"default"}
              className="w-auto h-auto p-2 text-icon hover:text-icon cursor-pointer"
              //onClick={() => setOpenBusiness(!openBusiness)}
            >
              Registro
            </Button>
      </div>
      
    </div>
  );
}