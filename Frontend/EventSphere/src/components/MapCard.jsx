import { useEffect, useState } from "react";
import axios from "axios";

const MapCard = ({ address }) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const API_KEY = "pk.eceffc0d67492d7a95e4599a5d9a7638"; // Replace with your API key

  useEffect(() => {
    if (!address) return;

    const fetchCoordinates = async () => {
      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(address)}&format=json`
        );

        if (response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setLocation({ lat: parseFloat(lat), lng: parseFloat(lon) });
        } else {
          setError("Location not found.");
        }
      } catch (err) {
        setError("Error fetching location.");
      }
    };

    fetchCoordinates();
  }, [address]);

  return (
    <div style={{ height: "200px", width: "100%", borderRadius: "10px", backgroundColor: "#2E2E2E", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {error ? (
        <p style={{ color: "#FF6961" }}>{error}</p>
      ) : location ? (
        <iframe
          width="100%"
          height="100%"
          style={{ borderRadius: "10px" }}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01},${location.lat - 0.01},${location.lng + 0.01},${location.lat + 0.01}&layer=mapnik&marker=${location.lat},${location.lng}`}
          allowFullScreen
        />
      ) : (
        <p style={{ color: "#C5BAFF" }}>Fetching location...</p>
      )}
    </div>
  );
};

export default MapCard;
