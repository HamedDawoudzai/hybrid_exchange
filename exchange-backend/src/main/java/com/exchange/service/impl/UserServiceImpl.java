package com.exchange.service.impl;

import com.exchange.dto.response.UserResponse;
import com.exchange.entity.Asset;
import com.exchange.entity.Order;
import com.exchange.entity.Portfolio;
import com.exchange.entity.User;
import com.exchange.enums.AssetType;
import com.exchange.enums.LimitOrderStatus;
import com.exchange.enums.OrderStatus;
import com.exchange.enums.OrderType;
import com.exchange.exception.BadRequestException;
import com.exchange.exception.ResourceNotFoundException;
import com.exchange.repository.AssetRepository;
import com.exchange.repository.LimitOrderRepository;
import com.exchange.repository.OrderRepository;
import com.exchange.repository.PortfolioRepository;
import com.exchange.repository.UserRepository;
import com.exchange.service.UserService;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private static final BigDecimal MAX_DEPOSIT = new BigDecimal("1000000000"); // 1B cap
    private static final String CASH_ASSET_SYMBOL = "CASH";

    private final UserRepository userRepository;
    private final LimitOrderRepository limitOrderRepository;
    private final AssetRepository assetRepository;
    private final PortfolioRepository portfolioRepository;
    private final OrderRepository orderRepository;
    private final EntityManager entityManager;

    @Override
    public User findById(Long id) {
        return userRepository.findById(Objects.requireNonNull(id, "id must not be null"))
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    @Override
    public UserResponse getCurrentUser(Long userId) {
        User user = findById(userId);
        UserResponse response = UserResponse.fromEntity(user);
        
        // Calculate reserved cash from pending limit buy orders
        BigDecimal reservedCash = limitOrderRepository.sumReservedAmountByUserIdAndStatusAndType(
                userId, LimitOrderStatus.PENDING, OrderType.BUY);
        if (reservedCash == null) {
            reservedCash = BigDecimal.ZERO;
        }
        response.setReservedCash(reservedCash);
        
        return response;
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    @Transactional
    public UserResponse depositCash(Long userId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Deposit amount must be positive");
        }
        if (amount.compareTo(MAX_DEPOSIT) > 0) {
            throw new BadRequestException("Deposit amount exceeds the allowed limit");
        }

        User user = findById(userId);
        user.setCashBalance(user.getCashBalance().add(amount));
        user.setTotalDeposits(user.getTotalDeposits().add(amount));
        User saved = userRepository.save(user);
        
        // Create transaction record for deposit
        createCashTransaction(userId, amount, OrderType.DEPOSIT, "Deposit");
        
        UserResponse response = UserResponse.fromEntity(saved);
        BigDecimal reservedCash = limitOrderRepository.sumReservedAmountByUserIdAndStatusAndType(
                userId, LimitOrderStatus.PENDING, OrderType.BUY);
        response.setReservedCash(reservedCash != null ? reservedCash : BigDecimal.ZERO);
        return response;
    }

    @Override
    @Transactional
    public UserResponse withdrawCash(Long userId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Withdrawal amount must be positive");
        }

        User user = findById(userId);
        BigDecimal currentBalance = user.getCashBalance();

        if (currentBalance.compareTo(amount) < 0) {
            throw new BadRequestException(
                    String.format("Insufficient balance. Available: $%s, Requested: $%s", 
                            currentBalance.setScale(2), amount.setScale(2)));
        }

        user.setCashBalance(currentBalance.subtract(amount));
        user.setTotalWithdrawals(user.getTotalWithdrawals().add(amount));
        User saved = userRepository.save(user);
        
        // Create transaction record for withdrawal
        createCashTransaction(userId, amount, OrderType.WITHDRAW, "Withdrawal");
        
        UserResponse response = UserResponse.fromEntity(saved);
        BigDecimal reservedCash = limitOrderRepository.sumReservedAmountByUserIdAndStatusAndType(
                userId, LimitOrderStatus.PENDING, OrderType.BUY);
        response.setReservedCash(reservedCash != null ? reservedCash : BigDecimal.ZERO);
        return response;
    }
    
    /**
     * Creates a transaction record for cash deposits/withdrawals
     */
    private void createCashTransaction(Long userId, BigDecimal amount, OrderType type, String description) {
        try {
            // Get or create CASH asset
            Asset cashAsset = assetRepository.findBySymbol(CASH_ASSET_SYMBOL)
                    .orElseGet(() -> {
                        Asset newAsset = Asset.builder()
                                .symbol(CASH_ASSET_SYMBOL)
                                .name("Cash")
                                .type(AssetType.CRYPTO) // Using CRYPTO type for cash transactions
                                .description("Cash deposit/withdrawal transactions")
                                .active(true)
                                .build();
                        return assetRepository.save(newAsset);
                    });
            
            // Get user's first portfolio (or create a default one if none exists)
            Portfolio portfolio = portfolioRepository.findByUserId(userId).stream()
                    .findFirst()
                    .orElseGet(() -> {
                        User user = findById(userId);
                        Portfolio defaultPortfolio = Portfolio.builder()
                                .user(user)
                                .name("Default")
                                .description("Default portfolio for cash transactions")
                                .build();
                        return portfolioRepository.save(defaultPortfolio);
                    });
            
            // Create order record for the transaction
            Order transaction = Order.builder()
                    .portfolio(portfolio)
                    .asset(cashAsset)
                    .type(type)
                    .status(OrderStatus.COMPLETED)
                    .quantity(amount) // For cash, quantity = amount
                    .pricePerUnit(BigDecimal.ONE) // Cash price is always 1
                    .totalAmount(amount)
                    .build();
            
            // Save and flush immediately to ensure transaction is available instantly
            orderRepository.save(transaction);
            entityManager.flush(); // Force immediate database write
            log.info("Created {} transaction record: {} for user {}", description, amount, userId);
        } catch (Exception e) {
            // Log error but don't fail the deposit/withdrawal
            log.error("Failed to create transaction record for {}: {}", description, e.getMessage());
        }
    }
}