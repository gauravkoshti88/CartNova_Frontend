import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import WebsiteInitializer from "./components/WebsiteInitializer";

function App() {
  return (

    <WebsiteInitializer>

      <RouterProvider router={router} />

    </WebsiteInitializer>

  );
}

export default App;