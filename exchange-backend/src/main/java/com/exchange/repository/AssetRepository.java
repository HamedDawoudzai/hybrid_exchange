package com.exchange.repository;

import com.exchange.entity.Asset;
import com.exchange.enums.AssetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for {@link Asset}.
 * Manages tradable assets (stocks and crypto) by symbol and type.
 */
@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    /** Finds an asset by its trading symbol (e.g. AAPL, BTC). */
    Optional<Asset> findBySymbol(String symbol);

    /** Returns all assets of the given type (STOCK or CRYPTO). */
    List<Asset> findByType(AssetType type);

    /** Returns all assets that are active for trading. */
    List<Asset> findByActiveTrue();

    /** Returns active assets of the given type. */
    List<Asset> findByTypeAndActiveTrue(AssetType type);

    /** Returns true if an asset exists with the given symbol. */
    Boolean existsBySymbol(String symbol);
}

