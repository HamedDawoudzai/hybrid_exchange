# Edge Cases Analysis for Hybrid Exchange

## Summary
This document outlines potential edge cases and issues found in the application that could cause unexpected behavior or bugs.

## Critical Issues

### 1. ✅ FIXED: Limit Orders Affecting P&L
**Status:** Fixed
**Issue:** Reserved cash for limit buy orders was not included in net worth calculation, causing P&L to decrease incorrectly when creating limit orders.
**Fix:** Added `reservedCash` field to `UserResponse` and included it in net worth calculations on dashboard and portfolio pages.

## Potential Issues (Low to Medium Priority)

### 2. Race Condition in Concurrent Limit Order Creation
**Severity:** Medium
**Issue:** If two limit buy orders are created simultaneously, both might pass the balance check before either reserves cash, potentially allowing orders that together exceed available balance.
**Location:** `LimitOrderServiceImpl.createLimitOrder()`
**Mitigation:** Currently handled by database transactions, but could be improved with optimistic locking or explicit balance reservation checks.
**Recommendation:** Consider adding a check that sums all pending limit orders' reserved amounts before allowing new orders.

### 3. Null Safety in Average Buy Price Calculation
**Severity:** Low
**Issue:** In `OrderServiceImpl.java` line 100-102, if `holding.getAverageBuyPrice()` is null (from old data), it would throw `NullPointerException`.
**Location:** `OrderServiceImpl.createOrder()` - BUY path
**Current Protection:** Holdings are created with `BigDecimal.ZERO`, but existing data might have null values.
**Recommendation:** Add null check: `holding.getAverageBuyPrice() != null ? holding.getAverageBuyPrice() : BigDecimal.ZERO`

### 4. Division by Zero in Gain/Loss Percentage
**Severity:** Low (Protected)
**Issue:** Division by zero when calculating gain/loss percentage if average buy price is zero.
**Location:** `PortfolioServiceImpl.computePortfolioSummary()` line 105-109
**Current Protection:** ✅ Already protected with `averageBuyPrice.compareTo(BigDecimal.ZERO) > 0` check.
**Status:** Safe

### 5. Holdings with Zero Quantity
**Severity:** Low
**Issue:** Holdings are deleted when quantity reaches zero, but if a holding exists with zero quantity and non-zero average price, it could cause calculation issues.
**Location:** Multiple places where holdings are updated
**Current Protection:** Holdings are deleted when quantity reaches zero in sell operations.
**Status:** Generally safe, but worth monitoring

## Edge Cases That Are Handled Correctly

### ✅ Limit Order Fill Price Validation
- Limit buy orders only fill when `currentPrice <= targetPrice`
- Limit sell orders only fill when `currentPrice >= targetPrice`
- Reserved amount is always sufficient because we only fill when price is favorable

### ✅ Limit Order Cancellation
- Reserved cash is properly refunded when limit buy orders are cancelled
- Status validation prevents cancelling non-pending orders

### ✅ Limit Order Filling
- If fill price is lower than target (for buy), difference is refunded
- Holdings are validated at fill time for sell orders
- Order history is properly recorded

### ✅ Stop Order Holdings Validation
- Holdings are checked at creation and at trigger time
- Orders are cancelled if holdings are insufficient at trigger time

### ✅ Withdrawal Validation
- Withdrawal checks available cash balance
- Since reserved cash is already subtracted from balance, the check is correct
- Users cannot withdraw more than available (excluding reserved cash, which is correct)

### ✅ Average Buy Price Calculation
- Division by zero is protected with quantity checks
- DCA (Dollar-Cost Averaging) is correctly implemented

### ✅ Sell Order Profit Consistency
- Sell orders use current market price
- Users receive proceeds based on displayed price (with market movement tolerance)

## Recommendations

1. **Add null safety checks** for `averageBuyPrice` in calculations
2. **Consider optimistic locking** for limit order creation to prevent race conditions
3. **Add validation** to ensure holdings with zero quantity are cleaned up
4. **Add logging** for edge cases that are handled gracefully (e.g., insufficient holdings at fill time)
5. **Consider adding unit tests** for edge cases, especially:
   - Concurrent limit order creation
   - Holdings with null average buy price
   - Zero quantity holdings
   - Price fluctuations during order execution

## Notes

- Most critical issues have been addressed
- The application handles most edge cases gracefully
- The main remaining concern is the potential race condition in concurrent limit order creation
- All financial calculations use `BigDecimal` for precision, which is good
- Transaction boundaries are properly defined with `@Transactional`

