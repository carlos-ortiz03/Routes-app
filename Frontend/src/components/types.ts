export interface Step {
  end_location: google.maps.LatLngLiteral;
}

export interface Route {
  legs?: Array<{
    steps?: Step[];
    start_location: google.maps.LatLngLiteral;
    end_location: google.maps.LatLngLiteral;
  }>;
}
