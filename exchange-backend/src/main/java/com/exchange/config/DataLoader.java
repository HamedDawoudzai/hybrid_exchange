package com.exchange.config;

import com.exchange.entity.Asset;
import com.exchange.enums.AssetType;
import com.exchange.repository.AssetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Seeds the database with initial stocks and cryptocurrencies on application startup.
 * Only adds assets that don't already exist (safe to run multiple times).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final AssetRepository assetRepository;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting asset data loader...");
        
        int stocksAdded = seedStocks();
        int cryptoAdded = seedCrypto();
        
        log.info("Data loader complete. Added {} stocks and {} crypto assets.", stocksAdded, cryptoAdded);
    }

    private int seedStocks() {
        List<Asset> stocks = new ArrayList<>();
        
        // ===== TECHNOLOGY =====
        stocks.add(createStock("AAPL", "Apple Inc."));
        stocks.add(createStock("MSFT", "Microsoft Corporation"));
        stocks.add(createStock("GOOGL", "Alphabet Inc. (Google)"));
        stocks.add(createStock("AMZN", "Amazon.com Inc."));
        stocks.add(createStock("META", "Meta Platforms Inc."));
        stocks.add(createStock("NVDA", "NVIDIA Corporation"));
        stocks.add(createStock("TSLA", "Tesla Inc."));
        stocks.add(createStock("NFLX", "Netflix Inc."));
        stocks.add(createStock("ADBE", "Adobe Inc."));
        stocks.add(createStock("CRM", "Salesforce Inc."));
        stocks.add(createStock("INTC", "Intel Corporation"));
        stocks.add(createStock("AMD", "Advanced Micro Devices"));
        stocks.add(createStock("ORCL", "Oracle Corporation"));
        stocks.add(createStock("CSCO", "Cisco Systems Inc."));
        stocks.add(createStock("IBM", "IBM Corporation"));
        stocks.add(createStock("QCOM", "Qualcomm Inc."));
        stocks.add(createStock("TXN", "Texas Instruments"));
        stocks.add(createStock("AVGO", "Broadcom Inc."));
        stocks.add(createStock("NOW", "ServiceNow Inc."));
        stocks.add(createStock("UBER", "Uber Technologies"));
        stocks.add(createStock("LYFT", "Lyft Inc."));
        stocks.add(createStock("SQ", "Block Inc. (Square)"));
        stocks.add(createStock("SHOP", "Shopify Inc."));
        stocks.add(createStock("SNOW", "Snowflake Inc."));
        stocks.add(createStock("PLTR", "Palantir Technologies"));
        
        // ===== FINANCE =====
        stocks.add(createStock("JPM", "JPMorgan Chase & Co."));
        stocks.add(createStock("V", "Visa Inc."));
        stocks.add(createStock("MA", "Mastercard Inc."));
        stocks.add(createStock("BAC", "Bank of America Corp."));
        stocks.add(createStock("WFC", "Wells Fargo & Co."));
        stocks.add(createStock("GS", "Goldman Sachs Group"));
        stocks.add(createStock("MS", "Morgan Stanley"));
        stocks.add(createStock("AXP", "American Express"));
        stocks.add(createStock("BLK", "BlackRock Inc."));
        stocks.add(createStock("PYPL", "PayPal Holdings"));
        stocks.add(createStock("COIN", "Coinbase Global"));
        
        // ===== CONSUMER / RETAIL =====
        stocks.add(createStock("WMT", "Walmart Inc."));
        stocks.add(createStock("HD", "The Home Depot"));
        stocks.add(createStock("NKE", "Nike Inc."));
        stocks.add(createStock("MCD", "McDonald's Corporation"));
        stocks.add(createStock("SBUX", "Starbucks Corporation"));
        stocks.add(createStock("KO", "The Coca-Cola Company"));
        stocks.add(createStock("PEP", "PepsiCo Inc."));
        stocks.add(createStock("COST", "Costco Wholesale"));
        stocks.add(createStock("TGT", "Target Corporation"));
        stocks.add(createStock("LOW", "Lowe's Companies"));
        
        // ===== HEALTHCARE =====
        stocks.add(createStock("JNJ", "Johnson & Johnson"));
        stocks.add(createStock("UNH", "UnitedHealth Group"));
        stocks.add(createStock("PFE", "Pfizer Inc."));
        stocks.add(createStock("MRK", "Merck & Co."));
        stocks.add(createStock("ABBV", "AbbVie Inc."));
        stocks.add(createStock("LLY", "Eli Lilly and Company"));
        stocks.add(createStock("TMO", "Thermo Fisher Scientific"));
        stocks.add(createStock("ABT", "Abbott Laboratories"));
        stocks.add(createStock("MRNA", "Moderna Inc."));
        
        // ===== ENTERTAINMENT / MEDIA =====
        stocks.add(createStock("DIS", "The Walt Disney Company"));
        stocks.add(createStock("CMCSA", "Comcast Corporation"));
        stocks.add(createStock("WBD", "Warner Bros. Discovery"));
        stocks.add(createStock("PARA", "Paramount Global"));
        stocks.add(createStock("RBLX", "Roblox Corporation"));
        stocks.add(createStock("EA", "Electronic Arts"));
        stocks.add(createStock("TTWO", "Take-Two Interactive"));
        stocks.add(createStock("SPOT", "Spotify Technology"));
        
        // ===== ENERGY =====
        stocks.add(createStock("XOM", "Exxon Mobil Corporation"));
        stocks.add(createStock("CVX", "Chevron Corporation"));
        stocks.add(createStock("COP", "ConocoPhillips"));
        
        // ===== INDUSTRIALS =====
        stocks.add(createStock("BA", "The Boeing Company"));
        stocks.add(createStock("CAT", "Caterpillar Inc."));
        stocks.add(createStock("GE", "General Electric"));
        stocks.add(createStock("HON", "Honeywell International"));
        stocks.add(createStock("UPS", "United Parcel Service"));
        stocks.add(createStock("FDX", "FedEx Corporation"));
        
        // ===== AUTOMOTIVE =====
        stocks.add(createStock("F", "Ford Motor Company"));
        stocks.add(createStock("GM", "General Motors"));
        stocks.add(createStock("RIVN", "Rivian Automotive"));
        stocks.add(createStock("LCID", "Lucid Group"));
        
        return saveNewAssets(stocks);
    }

    private int seedCrypto() {
        List<Asset> cryptos = new ArrayList<>();
        
        // ===== MAJOR CRYPTOCURRENCIES (Coinbase supported) =====
        cryptos.add(createCrypto("BTC", "Bitcoin"));
        cryptos.add(createCrypto("ETH", "Ethereum"));
        cryptos.add(createCrypto("SOL", "Solana"));
        cryptos.add(createCrypto("XRP", "XRP (Ripple)"));
        cryptos.add(createCrypto("DOGE", "Dogecoin"));
        cryptos.add(createCrypto("ADA", "Cardano"));
        cryptos.add(createCrypto("AVAX", "Avalanche"));
        cryptos.add(createCrypto("DOT", "Polkadot"));
        cryptos.add(createCrypto("LINK", "Chainlink"));
        cryptos.add(createCrypto("MATIC", "Polygon"));
        cryptos.add(createCrypto("UNI", "Uniswap"));
        cryptos.add(createCrypto("LTC", "Litecoin"));
        cryptos.add(createCrypto("BCH", "Bitcoin Cash"));
        cryptos.add(createCrypto("ATOM", "Cosmos"));
        cryptos.add(createCrypto("XLM", "Stellar"));
        cryptos.add(createCrypto("ALGO", "Algorand"));
        cryptos.add(createCrypto("FIL", "Filecoin"));
        cryptos.add(createCrypto("NEAR", "NEAR Protocol"));
        cryptos.add(createCrypto("APT", "Aptos"));
        cryptos.add(createCrypto("ARB", "Arbitrum"));
        cryptos.add(createCrypto("OP", "Optimism"));
        
        // ===== DEFI TOKENS =====
        cryptos.add(createCrypto("AAVE", "Aave"));
        cryptos.add(createCrypto("MKR", "Maker"));
        cryptos.add(createCrypto("CRV", "Curve DAO Token"));
        cryptos.add(createCrypto("COMP", "Compound"));
        cryptos.add(createCrypto("SNX", "Synthetix"));
        cryptos.add(createCrypto("LDO", "Lido DAO"));
        cryptos.add(createCrypto("SUSHI", "SushiSwap"));
        cryptos.add(createCrypto("1INCH", "1inch"));
        
        // ===== AI / DATA TOKENS =====
        cryptos.add(createCrypto("FET", "Fetch.ai"));
        cryptos.add(createCrypto("RNDR", "Render Token"));
        cryptos.add(createCrypto("GRT", "The Graph"));
        cryptos.add(createCrypto("OCEAN", "Ocean Protocol"));
        
        // ===== GAMING / METAVERSE =====
        cryptos.add(createCrypto("AXS", "Axie Infinity"));
        cryptos.add(createCrypto("SAND", "The Sandbox"));
        cryptos.add(createCrypto("MANA", "Decentraland"));
        cryptos.add(createCrypto("ENJ", "Enjin Coin"));
        cryptos.add(createCrypto("IMX", "Immutable X"));
        cryptos.add(createCrypto("GALA", "Gala"));
        
        // ===== MEME COINS =====
        cryptos.add(createCrypto("SHIB", "Shiba Inu"));
        cryptos.add(createCrypto("PEPE", "Pepe"));
        cryptos.add(createCrypto("BONK", "Bonk"));
        cryptos.add(createCrypto("WIF", "dogwifhat"));
        cryptos.add(createCrypto("FLOKI", "Floki"));
        
        // ===== STABLECOINS (for reference) =====
        cryptos.add(createCrypto("USDC", "USD Coin"));
        cryptos.add(createCrypto("USDT", "Tether"));
        cryptos.add(createCrypto("DAI", "Dai"));
        
        // ===== OTHER POPULAR =====
        cryptos.add(createCrypto("ETC", "Ethereum Classic"));
        cryptos.add(createCrypto("XMR", "Monero"));
        cryptos.add(createCrypto("VET", "VeChain"));
        cryptos.add(createCrypto("HBAR", "Hedera"));
        cryptos.add(createCrypto("ICP", "Internet Computer"));
        cryptos.add(createCrypto("QNT", "Quant"));
        cryptos.add(createCrypto("AERO", "Aerodrome Finance"));
        cryptos.add(createCrypto("SEI", "Sei"));
        cryptos.add(createCrypto("SUI", "Sui"));
        cryptos.add(createCrypto("TIA", "Celestia"));
        cryptos.add(createCrypto("INJ", "Injective"));
        cryptos.add(createCrypto("RUNE", "THORChain"));
        cryptos.add(createCrypto("STX", "Stacks"));
        
        return saveNewAssets(cryptos);
    }

    private Asset createStock(String symbol, String name) {
        return Asset.builder()
                .symbol(symbol)
                .name(name)
                .type(AssetType.STOCK)
                .active(true)
                .build();
    }

    private Asset createCrypto(String symbol, String name) {
        return Asset.builder()
                .symbol(symbol)
                .name(name)
                .type(AssetType.CRYPTO)
                .active(true)
                .build();
    }

    private int saveNewAssets(List<Asset> assets) {
        int added = 0;
        for (Asset asset : assets) {
            if (!assetRepository.existsBySymbol(asset.getSymbol())) {
                assetRepository.save(asset);
                added++;
                log.debug("Added asset: {} - {}", asset.getSymbol(), asset.getName());
            }
        }
        return added;
    }
}

