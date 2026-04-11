import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TransactionProvider } from "@/contexts/TransactionContext";
import Index from "./pages/Index";
import CreateTransaction from "./pages/CreateTransaction";
import TransactionStatusPage from "./pages/TransactionStatus";
import ConfirmTransaction from "./pages/ConfirmTransaction";
import TransactionsList from "./pages/TransactionsList";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TransactionProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<CreateTransaction />} />
            <Route path="/transaction/:id" element={<TransactionStatusPage />} />
            <Route path="/confirm/:id" element={<ConfirmTransaction />} />
            <Route path="/transactions" element={<TransactionsList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TransactionProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
