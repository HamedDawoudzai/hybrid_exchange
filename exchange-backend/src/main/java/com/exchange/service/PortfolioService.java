package com.exchange.service;

import com.exchange.dto.request.CreatePortfolioRequest;
import com.exchange.dto.response.PortfolioResponse;

import java.util.List;

public interface PortfolioService {

    PortfolioResponse createPortfolio(Long userId, CreatePortfolioRequest request);

    List<PortfolioResponse> getUserPortfolios(Long userId);

    PortfolioResponse getPortfolioById(Long userId, Long portfolioId);

    PortfolioResponse getPortfolioWithHoldings(Long userId, Long portfolioId);

    void deletePortfolio(Long userId, Long portfolioId);
}