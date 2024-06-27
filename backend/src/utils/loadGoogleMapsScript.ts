const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if the script is already loaded
    if (
      typeof window.google === "object" &&
      typeof window.google.maps === "object"
    ) {
      resolve();
      return;
    }

    // Create the script element
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    // Set up event listeners to resolve or reject the promise
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Google Maps script"));

    // Append the script to the document head
    document.head.appendChild(script);
  });
};

export default loadGoogleMapsScript;
