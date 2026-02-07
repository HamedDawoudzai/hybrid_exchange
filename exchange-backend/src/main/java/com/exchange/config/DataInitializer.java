package com.exchange.config;

import com.exchange.entity.Asset;
import com.exchange.enums.AssetType;
import com.exchange.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Seeds the database with default tradeable assets on startup.
 * - Deactivates invalid/untradeable symbols (e.g. CASH)
 * - Ensures all expected assets exist and are active
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AssetRepository assetRepository;

    /** Symbols that should never appear as tradeable assets */
    private static final Set<String> INVALID_SYMBOLS = Set.of(
            "CASH", "USD", "USDT",
            // Delisted or broken on Coinbase Exchange API
            "MATIC", "EOS", "MKR"
    );

    @Override
    @Transactional
    public void run(String... args) {
        deactivateInvalidAssets();
        seedAssets();
        deactivateUnlistedAssets();
    }

    private void deactivateInvalidAssets() {
        for (String symbol : INVALID_SYMBOLS) {
            Optional<Asset> asset = assetRepository.findBySymbol(symbol);
            if (asset.isPresent() && Boolean.TRUE.equals(asset.get().getActive())) {
                asset.get().setActive(false);
                assetRepository.save(asset.get());
                log.info("Deactivated invalid asset: {}", symbol);
            }
        }
    }

    private void seedAssets() {
        Map<String, String> stocks = buildStockMap();
        Map<String, String> cryptos = buildCryptoMap();

        int created = 0;
        int reactivated = 0;

        for (var entry : stocks.entrySet()) {
            int result = ensureAsset(entry.getKey(), entry.getValue(), AssetType.STOCK);
            if (result == 1) created++;
            if (result == 2) reactivated++;
        }
        for (var entry : cryptos.entrySet()) {
            int result = ensureAsset(entry.getKey(), entry.getValue(), AssetType.CRYPTO);
            if (result == 1) created++;
            if (result == 2) reactivated++;
        }

        if (created > 0 || reactivated > 0) {
            log.info("Asset seed complete: {} created, {} reactivated ({} stocks, {} crypto configured).",
                    created, reactivated, stocks.size(), cryptos.size());
        } else {
            log.info("All {} expected assets already present.", stocks.size() + cryptos.size());
        }
    }

    /**
     * Deactivate any active assets that are NOT in the current seed maps.
     * This cleans up old stocks/crypto that were seeded previously but removed.
     */
    private void deactivateUnlistedAssets() {
        Set<String> validSymbols = new HashSet<>();
        validSymbols.addAll(buildStockMap().keySet());
        validSymbols.addAll(buildCryptoMap().keySet());

        List<Asset> activeAssets = assetRepository.findByActiveTrue();
        int deactivated = 0;
        for (Asset asset : activeAssets) {
            if (!validSymbols.contains(asset.getSymbol())) {
                asset.setActive(false);
                assetRepository.save(asset);
                deactivated++;
                log.info("Deactivated unlisted asset: {}", asset.getSymbol());
            }
        }
        if (deactivated > 0) {
            log.info("Deactivated {} unlisted assets.", deactivated);
        }
    }

    /**
     * Ensure an asset exists and is active. Returns 0=existed, 1=created, 2=reactivated.
     */
    private int ensureAsset(String symbol, String name, AssetType type) {
        Optional<Asset> existing = assetRepository.findBySymbol(symbol);
        if (existing.isPresent()) {
            Asset asset = existing.get();
            if (!Boolean.TRUE.equals(asset.getActive())) {
                asset.setActive(true);
                assetRepository.save(asset);
                return 2;
            }
            return 0;
        }
        assetRepository.save(Asset.builder()
                .symbol(symbol)
                .name(name)
                .type(type)
                .active(true)
                .build());
        return 1;
    }

    // ─── 10 Stocks (Polygon free tier: 5 API calls/min) ────────────

    private Map<String, String> buildStockMap() {
        Map<String, String> m = new LinkedHashMap<>();
        m.put("AAPL",  "Apple Inc.");
        m.put("MSFT",  "Microsoft Corporation");
        m.put("GOOGL", "Alphabet Inc.");
        m.put("AMZN",  "Amazon.com Inc.");
        m.put("NVDA",  "NVIDIA Corporation");
        m.put("META",  "Meta Platforms Inc.");
        m.put("TSLA",  "Tesla Inc.");
        m.put("JPM",   "JPMorgan Chase & Co.");
        m.put("V",     "Visa Inc.");
        m.put("DIS",   "The Walt Disney Company");
        return m;
    }

    // ─── 15 Cryptos (Coinbase Exchange — no rate limit issues) ───

    private Map<String, String> buildCryptoMap() {
        Map<String, String> m = new LinkedHashMap<>();
        m.put("BTC",   "Bitcoin");
        m.put("ETH",   "Ethereum");
        m.put("SOL",   "Solana");
        m.put("XRP",   "XRP");
        m.put("DOGE",  "Dogecoin");
        m.put("ADA",   "Cardano");
        m.put("AVAX",  "Avalanche");
        m.put("DOT",   "Polkadot");
        m.put("LINK",  "Chainlink");
        m.put("SHIB",  "Shiba Inu");
        m.put("LTC",   "Litecoin");
        m.put("UNI",   "Uniswap");
        m.put("ATOM",  "Cosmos");
        m.put("XLM",   "Stellar");
        m.put("AAVE",  "Aave");
        return m;
    }
}
