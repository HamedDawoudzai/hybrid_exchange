"use client";

import { useState } from "react";
import { toast } from "sonner";
import { usePortfolios } from "@/hooks/usePortfolio";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Portfolios</p>
            <h1 className="text-3xl font-semibold text-slate-50">Your portfolios</h1>
            <p className="text-sm text-slate-400">Create and manage your stock/crypto portfolios.</p>
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
                className="h-48 rounded-2xl border border-slate-800/70 bg-slate-900/60 animate-pulse"
              />
            ))}
          </div>
        ) : portfolios.length === 0 ? (
          <Card className="border border-slate-800/70 bg-white/5 backdrop-blur-xl shadow-xl">
            <CardContent className="py-14 text-center space-y-3 text-slate-200">
              <p className="text-lg font-medium">No portfolios yet</p>
              <p className="text-sm text-slate-400">Create your first portfolio to start trading.</p>
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
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Portfolio">
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" className="w-full" isLoading={isCreating}>
              Create Portfolio
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  );
}