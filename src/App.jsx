import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SetPassword } from "./pages/SetPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/set-password" element={<SetPassword />}></Route>
        <Route
          path="*"
          element={<Navigate to="/set-password" replace />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
