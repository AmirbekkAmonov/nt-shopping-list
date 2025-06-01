import React from "react";
import AppRoutes from "./routers"; 
import "./styles/main.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
            <Toaster position="top-right" richColors closeButton/>  
      <AppRoutes />
    </QueryClientProvider>
  )
}

export default App;
