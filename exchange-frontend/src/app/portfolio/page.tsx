"use client";

import { useState } from "react";
import { usePortfolios } from "@/hooks/usePortfolio";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";

/**
 * Portfolio List Page
 * Displays all user portfolios with option to create new ones.
 * 
 * TODO: Implement create portfolio modal
 * TODO: Add loading states
 * TODO: Handle errors
 */
export default function PortfolioPage() {
  const { portfolios, isLoading, createPortfolio, isCreating } = usePortfolios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    initialBalance: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPortfolio({
      name: formData.name,
      description: formData.description || undefined,
      initialBalance: formData.initialBalance
        ? parseFloat(formData.initialBalance)
        : undefined,
    });
    setIsModalOpen(false);
    setFormData({ name: "", description: "", initialBalance: "" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Portfolios</h1>
        <Button onClick={() => setIsModalOpen(true)}>Create Portfolio</Button>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : portfolios.length === 0 ? (
        <Card variant="bordered">
          <CardContent className="py-16 text-center">
            <p className="mb-4">No portfolios yet</p>
            <Button onClick={() => setIsModalOpen(true)}>
              Create Your First Portfolio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolios.map((portfolio) => (
            <PortfolioCard key={portfolio.id} portfolio={portfolio} />
          ))}
        </div>
      )}

      {/* Create Portfolio Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Portfolio"
      >
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
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Long-term investments"
          />
          <Input
            label="Initial Balance ($)"
            type="number"
            value={formData.initialBalance}
            onChange={(e) =>
              setFormData({ ...formData, initialBalance: e.target.value })
            }
            placeholder="10000"
          />
          <Button type="submit" className="w-full" isLoading={isCreating}>
            Create Portfolio
          </Button>
        </form>
      </Modal>
    </div>
  );
}
