import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { divIcon } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";

// Coordenadas que definen los límites de Lima Metropolitana
const LIMA_BOUNDS = {
  north: -11.7, // mas al norte para incluir huaral
  south: -12.5, // mas al sur para incluir lurin
  west: -77.3, // mas al oeste para zonas costeras
  east: -76.7, // mas al este para chosiva y zonas altas
};

// Coordenadas por defecto en el centro de Lima
const DEFAULT_LIMA_COORDS = {
  lat: -12.0464, // Centro de Lima
  lng: -77.0428,
};

// Componente para el buscador de direcciones
const AddressSearch = ({
  onAddressSelect,
}: {
  onAddressSelect: (address: string, lat: number, lng: number) => void;
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchAddress = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `format=json&` +
          `q=${encodeURIComponent(searchQuery)}&` +
          `countrycodes=pe&` + // Limitar a Perú
          `city=Lima&` + // Especificar ciudad Lima
          `bounded=1&` + // Usar bounding box
          `viewbox=${LIMA_BOUNDS.west},${LIMA_BOUNDS.south},${LIMA_BOUNDS.east},${LIMA_BOUNDS.north}&` +
          `limit=8&` + // Un poco más de resultados
          `addressdetails=1` // Obtener más detalles de la dirección
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error searching address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectResult = (result: any) => {
    onAddressSelect(
      result.display_name,
      parseFloat(result.lat),
      parseFloat(result.lon)
    );
    setQuery(result.display_name);
    setResults([]);
  };

  // Función para formatear mejor la dirección de Lima
  const formatLimaAddress = (result: any) => {
    if (!result.address) return result.display_name;

    const { address } = result;
    // Priorizar: distrito > suburb > neighbourhood
    const district =
      address.suburb || address.neighbourhood || address.city_district;
    const street = address.road || address.pedestrian;
    const number = address.house_number;

    let formatted = "";
    if (street) {
      formatted += street;
      if (number) formatted += ` ${number}`;
      if (district) formatted += `, ${district}`;
    } else if (district) {
      formatted += district;
    }

    if (!formatted) return result.display_name;

    // Agregar "Lima" al final si no está presente
    if (!formatted.toLowerCase().includes("lima")) {
      formatted += ", Lima";
    }

    return formatted;
  };

  return (
    <div className="relative mb-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length > 2) {
              searchAddress(e.target.value);
            } else {
              setResults([]);
            }
          }}
          placeholder="Buscar dirección en Lima..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D86C00]"
        />
        <button
          onClick={() => searchAddress(query)}
          className="bg-[#D86C00] text-white p-3 rounded-lg hover:bg-[#b35900] transition-colors"
        >
          <FaSearch className="size-5" />
        </button>
      </div>

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-[10001] max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={index}
              onClick={() => handleSelectResult(result)}
              className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
            >
              <div className="font-medium text-sm">
                {formatLimaAddress(result)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {[
                  result.address?.suburb || result.address?.neighbourhood,
                  "Lima",
                  "Perú",
                ]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 p-3 text-center z-[10001]">
          Buscando en Lima...
        </div>
      )}
    </div>
  );
};

// Componente para manejar los clicks en el mapa
const MapClickHandler = ({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Componente principal para la gestión de direcciones
const AddressManager = () => {
  const [selectedAddress, setSelectedAddress] = useState({
    name: "Casa",
    address: "Miraflores, Lima, Perú",
    lat: DEFAULT_LIMA_COORDS.lat,
    lng: DEFAULT_LIMA_COORDS.lng,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempAddress, setTempAddress] = useState(selectedAddress);

  const createCustomIcon = useCallback(() => {
    const iconMarkup = renderToStaticMarkup(
      <FaMapMarkerAlt className="text-[#D86C00] text-2xl" />
    );
    return divIcon({
      html: iconMarkup,
      iconSize: [32, 32],
      iconAnchor: [14, 28],
      popupAnchor: [0, -28],
    });
  }, []);

  const handleAddressSelect = (address: string, lat: number, lng: number) => {
    setTempAddress((prev) => ({
      ...prev,
      address: address,
      lat: lat,
      lng: lng,
    }));
  };

  const handleMapClick = (lat: number, lng: number) => {
    // Verificar que el click esté dentro de los límites de Lima
    if (
      lat >= LIMA_BOUNDS.south &&
      lat <= LIMA_BOUNDS.north &&
      lng >= LIMA_BOUNDS.west &&
      lng <= LIMA_BOUNDS.east
    ) {
      // Reverse geocoding para obtener la dirección desde las coordenadas
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&countrycodes=pe`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.display_name) {
            // Formatear la dirección para Lima
            let formattedAddress = data.display_name;
            if (data.address) {
              const district =
                data.address.suburb ||
                data.address.neighbourhood ||
                data.address.city_district;
              if (district) {
                formattedAddress = `${district}, Lima, Perú`;
              }
            }

            setTempAddress((prev) => ({
              ...prev,
              address: formattedAddress,
              lat: lat,
              lng: lng,
            }));
          }
        })
        .catch((error) => {
          console.error("Error in reverse geocoding:", error);
          // Si falla el reverse geocoding, al menos actualizar las coordenadas
          setTempAddress((prev) => ({
            ...prev,
            address: `Ubicación en Lima (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            lat: lat,
            lng: lng,
          }));
        });
    } else {
      alert("Por favor, selecciona una ubicación dentro de Lima Metropolitana");
    }
  };

  const handleSave = () => {
    setSelectedAddress(tempAddress);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempAddress(selectedAddress);
    setIsEditing(false);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{selectedAddress.name}</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-[#D86C00] hover:text-[#b35900] font-medium"
          >
            Editar
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          <div className="text-gray-700">{selectedAddress.address}</div>
          <div className="w-full h-[200px] rounded-xl overflow-hidden relative z-0">
            <MapContainer
              center={[selectedAddress.lat, selectedAddress.lng]}
              zoom={14}
              className="w-full h-full"
              scrollWheelZoom={false}
              minZoom={11}
              maxBounds={[
                [LIMA_BOUNDS.south, LIMA_BOUNDS.west],
                [LIMA_BOUNDS.north, LIMA_BOUNDS.east],
              ]}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[selectedAddress.lat, selectedAddress.lng]}
                icon={createCustomIcon()}
              />
            </MapContainer>
          </div>
        </div>
      ) : (
        <div className="space-y-4 relative">
          {" "}
          {/* Added relative here */}
          <AddressSearch onAddressSelect={handleAddressSelect} />
          <div className="w-full h-[200px] rounded-xl overflow-hidden relative z-0">
            {" "}
            {/* Ensure map has lower z-index */}
            <MapContainer
              center={[tempAddress.lat, tempAddress.lng]}
              zoom={14}
              className="w-full h-full"
              scrollWheelZoom={true}
              minZoom={11}
              maxBounds={[
                [LIMA_BOUNDS.south, LIMA_BOUNDS.west],
                [LIMA_BOUNDS.north, LIMA_BOUNDS.east],
              ]}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[tempAddress.lat, tempAddress.lng]}
                icon={createCustomIcon()}
              />
              <MapClickHandler onMapClick={handleMapClick} />
            </MapContainer>
          </div>
          <div className="text-xs text-gray-500 text-center">
            Haz clic en el mapa para seleccionar una ubicación en Lima
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 px-4 bg-[#D86C00] text-white rounded-lg hover:bg-[#b35900]"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManager;
