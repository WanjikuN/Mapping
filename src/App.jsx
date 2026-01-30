import { Route, Routes } from "react-router-dom";
import "./App.css";
import Map from "./pages/MapContainer/Map";

function App() {
  return (
    <>
      <Routes>
        <Route
          exact
          path="/"
          element={<Map />}
        />
      </Routes>
    </>
  );
}

export default App;
