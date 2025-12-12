package com.exchange.service.impl;

import com.exchange.dto.request.CreatePortfolioRequest;
import com.exchange.dto.request.DepositRequest;
import com.exchange.dto.response.PortfolioResponse;
import com.exchange.repository.HoldingRepository;
import com.exchange.repository.PortfolioRepository;
import com.exchange.repository.UserRepository;
import com.exchange.service.PortfolioService;
import com.exchange.service.PriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;
    private final HoldingRepository holdingRepository;
    private final PriceService priceService;

    @Override
    public PortfolioResponse createPortfolio(Long userId, CreatePortfolioRequest request) {
        // TODO: Implement create portfolio
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public List<PortfolioResponse> getUserPortfolios(Long userId) {
        // TODO: Implement get user portfolios
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public PortfolioResponse getPortfolioById(Long userId, Long portfolioId) {
        // TODO: Implement get portfolio by id
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public PortfolioResponse getPortfolioWithHoldings(Long userId, Long portfolioId) {
        // TODO: Implement get portfolio with holdings
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public PortfolioResponse deposit(Long userId, Long portfolioId, DepositRequest request) {
        // TODO: Implement deposit
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public void deletePortfolio(Long userId, Long portfolioId) {
        // TODO: Implement delete portfolio
        throw new UnsupportedOperationException("Not implemented yet");
    }
}

