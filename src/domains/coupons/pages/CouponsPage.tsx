import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CouponsPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-cyan-500 fixed top-0 left-0 right-0 px-4 py-2 z-50 justify-between flex items-center">
        <Link to={"/shopping"}>
          <ChevronLeft className="text-white" />
        </Link>
        <Button
          size="back"
          variant={"back"}
          className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer text-white"
        >
          AllquCupones
        </Button>
        <span className=""></span>
      </div>
    </div>
  );
}
