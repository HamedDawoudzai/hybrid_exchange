"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { AssetList } from "@/components/trade/AssetList";
import type { Asset } from "@/types";

type Tab = "all" | "stocks" | "crypto";

/**
 * Trade Page
 * List of tradable assets with filters.
 * 
 * TODO: Fetch assets from API
 * TODO: Implement tab filtering
 * TODO: Add search functionality
 * TODO: Show real-time prices
 */
export default function TradePage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");

  // TODO: Replace with real data from API
  const assets: Asset[] = [];
  const isLoading = false;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Trade</h1>

      <Card variant="bordered">
        <CardHeader>
          {/* Tabs */}
          <div className="flex space-x-4 pb-4 border-b">
            {(["all", "stocks", "crypto"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                  activeTab === tab ? "bg-primary-600/20" : ""
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <AssetList assets={assets} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
