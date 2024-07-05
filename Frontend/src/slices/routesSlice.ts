import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Route, GeoJsonRoute } from "../components/types";

interface RouteState {
  generatedRoutes: Route[];
  savedRoutes: Route[];
  currentRoute: GeoJsonRoute | null;
}

const initialState: RouteState = {
  generatedRoutes: [],
  savedRoutes: [],
  currentRoute: null,
};

const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    setGeneratedRoutes(state, action: PayloadAction<Route[]>) {
      state.generatedRoutes = action.payload;
    },
    setSavedRoutes(state, action: PayloadAction<Route[]>) {
      state.savedRoutes = action.payload;
    },
    setCurrentRoute(state, action: PayloadAction<GeoJsonRoute | null>) {
      state.currentRoute = action.payload;
    },
  },
});

export const { setGeneratedRoutes, setSavedRoutes, setCurrentRoute } =
  routesSlice.actions;
export default routesSlice.reducer;
