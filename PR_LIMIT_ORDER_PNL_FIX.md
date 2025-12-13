# Fix: Limit Orders Affecting P&L and Edge Case Improvements

## Summary
This PR fixes a critical issue where creating limit buy orders incorrectly affected P&L calculations by not including reserved cash in net worth. Additionally, it adds null safety checks and improves overall robustness of financial calculations.

## Problem
When users created limit buy orders, cash was reserved (subtracted from balance) but the reserved cash wasn't included in the net worth calculation. This caused P&L to decrease incorrectly, making it appear as if users were losing money when they were just reserving cash for pending orders.

**Example:**
- User has $1,000,000 cash and $0 in holdings
- User creates limit buy order for $500,000 worth of BTC
- Cash balance: $500,000 (correct)
- Reserved cash: $500,000 (not shown)
- Net worth displayed: $500,000 ❌ (should be $1,000,000)
- P&L: -$500,000 ❌ (should be $0)

## Solution

### 1. Added Reserved Cash Tracking
- Added `reservedCash` field to `UserResponse` DTO
- Added query method `sumReservedAmountByUserIdAndStatusAndType()` to `LimitOrderRepository` to calculate total reserved cash from pending limit buy orders
- Updated `UserServiceImpl` to include reserved cash in all user responses (`getCurrentUser`, `depositCash`, `withdrawCash`)

### 2. Updated Net Worth Calculations
- **Frontend (`dashboard/page.tsx`):** Updated P&L calculation to include reserved cash: `netWorth = marketValue + cashBalance + reservedCash`
- **Frontend (`portfolio/[id]/page.tsx`):** Updated portfolio P&L calculation to include reserved cash
- **TypeScript types:** Added `reservedCash?: number` to `User` interface

### 3. Added Null Safety Checks
- Added null checks for `averageBuyPrice` in `OrderServiceImpl.createOrder()` (BUY path)
- Added null checks for `averageBuyPrice` in `LimitOrderServiceImpl.fillLimitOrder()` (BUY path)
- Prevents `NullPointerException` if holdings have null average buy price (edge case from old data)

## Changes

### Backend

#### New Files
- `EDGE_CASES_ANALYSIS.md` - Documentation of edge cases found and their status

#### Modified Files

**`LimitOrderRepository.java`**
- Added `sumReservedAmountByUserIdAndStatusAndType()` query method to calculate total reserved cash

**`UserResponse.java`**
- Added `reservedCash` field
- Updated `fromEntity()` to initialize `reservedCash` (calculated by service)

**`UserServiceImpl.java`**
- Updated `getCurrentUser()` to calculate and set `reservedCash`
- Updated `depositCash()` to calculate and set `reservedCash`
- Updated `withdrawCash()` to calculate and set `reservedCash`
- Added `LimitOrderRepository` dependency

**`OrderServiceImpl.java`**
- Added null safety check for `averageBuyPrice` in BUY order path

**`LimitOrderServiceImpl.java`**
- Added null safety check for `averageBuyPrice` in limit order fill path

### Frontend

#### Modified Files

**`types/index.ts`**
- Added `reservedCash?: number` to `User` interface

**`dashboard/page.tsx`**
- Updated net worth calculation to include `reservedCash`
- Updated `useMemo` dependencies to include `reservedCash` and `user`

**`portfolio/[id]/page.tsx`**
- Updated net worth calculation to include `reservedCash`
- Updated `useMemo` dependencies to include `reservedCash`

## Testing

### Manual Testing
1. ✅ Created limit buy order - P&L remains correct
2. ✅ Deposited cash - reserved cash still included in net worth
3. ✅ Withdrew cash - reserved cash still included in net worth
4. ✅ Cancelled limit order - reserved cash properly refunded and P&L correct
5. ✅ Limit order filled - P&L remains correct after fill

### Edge Cases Verified
- ✅ Multiple pending limit orders - all reserved cash included
- ✅ Limit orders across different portfolios - reserved cash tracked correctly
- ✅ Holdings with null average buy price - null safety prevents crashes

## Impact

### Before
- Creating limit buy orders incorrectly decreased P&L
- Users saw negative P&L even when they had sufficient assets
- Confusing user experience

### After
- Reserved cash is properly included in net worth
- P&L accurately reflects user's actual financial position
- Clear distinction between available cash and reserved cash

## Related Issues
- Fixed issue where limit orders "ruined" P&L calculations
- Improved null safety for financial calculations
- Better handling of edge cases in order execution

## Notes
- Reserved cash is still unavailable for other trades (correct behavior)
- Reserved cash is included in net worth because it's still part of user's assets
- The fix maintains consistency between cash balance, reserved cash, and net worth

## Additional Improvements
- Added comprehensive edge case analysis documentation
- Improved code robustness with null safety checks
- Better separation of concerns (reserved cash calculated at service layer)

