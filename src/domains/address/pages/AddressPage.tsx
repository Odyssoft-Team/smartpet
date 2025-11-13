import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { supabase } from "@/lib/supabaseClient";

export interface Address {
  id: string;
  alias: string;
  address: string;
  is_default: boolean;
}

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (error) {
        console.error("Error obteniendo direcciones:", error);
      } else {
        setAddresses(data || []);
      }
    } catch (error) {
      console.error("Error en fetchAddresses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: string) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar esta dirección?")
    ) {
      try {
        const { error } = await supabase
          .from("user_addresses")
          .delete()
          .eq("id", id);

        if (error) {
          console.error("Error eliminando dirección:", error);
        } else {
          setAddresses((prev) => prev.filter((addr) => addr.id !== id));
        }
      } catch (error) {
        console.error("Error en handleDelete:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/">
            <Button
              size="back"
              variant="back"
              className="w-auto h-auto py-2 text-icon hover:text-icon"
            >
              <IoIosArrowBack className="size-8" />
              <span>Mis direcciones</span>
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Cargando direcciones...
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-8 space-y-4">
            <p className="text-gray-500">No tienes direcciones registradas</p>
            <Link to="/address/register">
              <Button className="bg-black text-white">Agregar dirección</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="border border-gray-200 rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{address.alias}</h3>
                      {address.is_default && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          Predeterminada
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {address.address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/address/edit/${address.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(address.id)}
                    className="flex-1"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}

            <Link to="/address/register">
              <Button className="w-full bg-black text-white mt-4">
                Agregar nueva dirección
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
