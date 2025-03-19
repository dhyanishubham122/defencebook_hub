import { Routes, Route } from "react-router-dom";
import UserRouter from "./user/userRouter.jsx";
import AdminRouter from "./admin/adminrouter.jsx";

function App() {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/*" element={<UserRouter />} />

      {/* Admin Routes */}
      <Route path="admin/*" element={<AdminRouter />} />
    </Routes>
  );
}

export default App;
