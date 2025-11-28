import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, FrownIcon, SmileIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCoupons, type Coupons } from "../services/getCoupons";
import { Checkbox } from "@/components/ui/checkbox";
import { useDetailStore } from "@/store/detail";

export default function CouponsPage() {
  const { couponSelected, setCouponSelected } = useDetailStore();
  const [listCoupons, setListCoupons] = useState<Coupons[]>([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      const coupons = await getCoupons();
      if (coupons) {
        setListCoupons(coupons);
      }
    };

    fetchCoupons();
  }, []);

  const COUPONS_AVAILABLES = listCoupons.filter((coupon) => {
    return coupon.is_active;
  });

  const COUPONS_EXPIRED = listCoupons.filter((coupon) => {
    return !coupon.is_active;
  });

  const onSelect = (coupon: Coupons) => {
    if (coupon === couponSelected) {
      setCouponSelected(null);
    } else {
      setCouponSelected(coupon);
    }
  };

  return (
    <div className="h-full flex flex-col pt-20">
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

      <div className="w-full">
        <Tabs defaultValue="tab-1">
          <ScrollArea>
            <TabsList className="mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 text-foreground w-full">
              <TabsTrigger
                value="tab-1"
                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent text-base font-bold text-black/50 data-[state=active]:text-[#0085D8] data-[state=active]:shadow-none data-[state=active]:after:bg-[#0085D8] data-[state=active]:hover:bg-accent"
              >
                <SmileIcon className="size-5" size={20} aria-hidden="true" />
                Disponibles
              </TabsTrigger>

              <TabsTrigger
                value="tab-2"
                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent text-base font-bold text-black/50 data-[state=active]:text-[#0085D8] data-[state=active]:shadow-none data-[state=active]:after:bg-[#0085D8] data-[state=active]:hover:bg-accent"
              >
                <FrownIcon className="size-5" size={20} aria-hidden="true" />
                Vencidos
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          <TabsContent value="tab-1">
            <div className="w-full flex flex-col gap-2">
              {COUPONS_AVAILABLES.length > 0 &&
                COUPONS_AVAILABLES.map((coupon) => {
                  return (
                    <div
                      className="w-full flex items-center justify-between border rounded-md p-2"
                      onClick={() => onSelect(coupon)}
                    >
                      <div className="flex flex-col items-start leading-[1]">
                        <h3 className="text-[#FBBC05] font-medium">
                          {coupon.code}
                        </h3>
                        <p className="pt-1 text-center text-xs text-muted-foreground">
                          {coupon.name}
                        </p>
                      </div>
                      <Checkbox
                        checked={couponSelected?.id === coupon.id}
                        className="data-[state=checked]:bg-[#FBBC05] data-[state=checked]:border-[#FBBC05]"
                      />
                    </div>
                  );
                })}
            </div>
          </TabsContent>
          <TabsContent value="tab-2">
            <div className="w-full flex flex-col gap-2">
              {COUPONS_EXPIRED.length > 0 &&
                COUPONS_EXPIRED.map((coupon) => {
                  return (
                    <div className="w-full flex items-center justify-between border rounded-md p-2">
                      <div className="flex flex-col items-start leading-[1]">
                        <h3 className="text-[#FBBC05] font-medium">
                          {coupon.code}
                        </h3>
                        <p className="pt-1 text-center text-xs text-muted-foreground">
                          {coupon.name}
                        </p>
                      </div>
                      <Checkbox checked={couponSelected?.id === coupon.id} />
                    </div>
                  );
                })}

              {COUPONS_EXPIRED.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center gap-2">
                  <h3 className="text-[#FBBC05] font-medium">
                    No hay cupones vencidos
                  </h3>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {couponSelected && (
        <div className="w-full flex items-center justify-center mt-8">
          <Link to="/shopping">
            <Button className="w-auto h-auto py-2 text-icon bg-green-500 hover:bg-green-500 hover:text-icon cursor-pointer text-white">
              Continuar compra
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
