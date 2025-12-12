package com.exchange.repository;

import com.exchange.entity.Asset;
import com.exchange.enums.AssetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    Optional<Asset> findBySymbol(String symbol);

    List<Asset> findByType(AssetType type);

    List<Asset> findByActiveTrue();

    List<Asset> findByTypeAndActiveTrue(AssetType type);

    Boolean existsBySymbol(String symbol);
}

