"use client";

import { useState } from "react";
import { toast } from "sonner";
import { usePortfolios } from "@/hooks/usePortfolio";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";

export default function PortfolioPage() {
  const { portfolios, isLoading, createPortfolio, isCreating } = usePortfolios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPortfolio({
        name: formData.name,
        description: formData.description || undefined,
      });
      toast.success("Portfolio created");
      setIsModalOpen(false);
      setFormData({ name: "", description: "" });
    } catch (_err) {
      toast.error("Failed to create portfolio. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gold-600/3 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/3 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-px bg-gold-600/50"></span>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-600">Portfolios</p>
            </div>
            <h1 className="text-3xl font-serif font-light text-white">Your Portfolios</h1>
            <p className="text-sm text-neutral-500 mt-1">Create and manage your stock/crypto portfolios.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="mt-3 md:mt-0">
            Create Portfolio
          </Button>
        </header>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-lg border border-neutral-800/50 bg-neutral-900/50 animate-pulse"
              />
            ))}
          </div>
        ) : portfolios.length === 0 ? (
          <Card className="border border-neutral-800/50 bg-neutral-950/50">
            <CardContent className="py-14 text-center space-y-3">
              <p className="text-lg font-serif text-white">No portfolios yet</p>
              <p className="text-sm text-neutral-500">Create your first portfolio to start trading.</p>
              <div className="pt-2">
                <Button onClick={() => setIsModalOpen(true)}>Create Portfolio</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map((portfolio) => (
              <PortfolioCard key={portfolio.id} portfolio={portfolio} />
            ))}
          </div>
        )}

        {/* Create Portfolio Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 z-50">
            <div className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-950 p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded bg-gold-600/10 flex items-center justify-center text-gold-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </span>
                <h2 className="text-lg font-serif text-white">Create Portfolio</h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Portfolio"
                  required
                />
                <Input
                  label="Description (optional)"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Long-term investments"
                />
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <Button type="submit" isLoading={isCreating}>
                    Create Portfolio
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
