import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ThemeSwitcher from "./components/ThemeSwitcher.jsx";

const Original = lazy(() => import("./themes/original/index.jsx"));
const Terminal = lazy(() => import("./themes/terminal/index.jsx"));
const Bloomberg = lazy(() => import("./themes/bloomberg/index.jsx"));
const Neon = lazy(() => import("./themes/neon/index.jsx"));
const Rates = lazy(() => import("./themes/rates/index.jsx"));
const Compare = lazy(() => import("./themes/compare/index.jsx"));
const Liquidations = lazy(() => import("./themes/liquidations/index.jsx"));

function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0e1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#60a5fa",
        fontFamily: "system-ui, sans-serif",
        fontSize: "1.1rem",
      }}
    >
      Loading...
    </div>
  );
}

export default function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Original />} />
          <Route path="/terminal" element={<Terminal />} />
          <Route path="/bloomberg" element={<Bloomberg />} />
          <Route path="/neon" element={<Neon />} />
          <Route path="/rates" element={<Rates />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/liquidations" element={<Liquidations />} />
        </Routes>
      </Suspense>
      <ThemeSwitcher />
    </>
  );
}
