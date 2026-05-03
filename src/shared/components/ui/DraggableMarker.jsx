import { useMemo, useRef } from "react";
import { Marker } from "react-leaflet";

export function DraggableMarker({ position, setPosition }) {
  const markerRef = useRef(null);

  const eventHandlers = useMemo(() => ({
    drag() {
      const marker = markerRef.current;

      if (marker && marker.getLatLng) {
        setPosition(marker.getLatLng());
      }
    },
  }), [setPosition]);

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    />
  );
}