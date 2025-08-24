# Database Migration Order

Apply these migrations in the following order to maintain database consistency and add new features:

## 1. Apply the insights status column removal migration
```sql
-- File: 12-remove-status-column-from-insights.sql
-- Removes the status column and related indexes
```

## 2. Apply the insights optimization migration  
```sql
-- File: 13-optimize-insights-for-completed-column.sql
-- Adds new optimized functions and indexes for the completed column
```

## 3. Add conversation summaries to patient context
```sql
-- File: 14-add-conversation-summaries-to-patient-context.sql
-- Adds conversation_summaries JSONB column to patient_context table
```

## 4. Regenerate TypeScript types
After applying the database migrations, regenerate the TypeScript types:
```bash
cd front
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
```

## Summary of Changes

### Database Schema Changes:
- ✅ Removed `status` column from `conversation_insights` table
- ✅ Removed indexes: `idx_insights_status`, `idx_insights_pending`
- ✅ Added optimized indexes for `completed` column queries
- ✅ Added `conversation_summaries` JSONB column to `patient_context` table
- ✅ Added GIN index for efficient JSONB querying on `conversation_summaries`
- ✅ Added array type constraint for `conversation_summaries`

### Function Updates:
- ✅ `create_active_insights()` - Now uses `completed = false` instead of `status = 'pending'`
- ✅ `complete_insight()` - Removed status update, only sets `completed = true`
- ✅ `get_pending_insights()` - Updated to use `completed = false`
- ✅ `get_conversation_insights()` - Returns `completed` boolean instead of `status` text
- ✅ Added `complete_insight_batch()` - New function for batch completion
- ✅ Added `get_oldest_pending_insights()` - Prioritization helper
- ✅ Added `cleanup_orphaned_insights()` - Maintenance function


### Trigger Updates:
- ✅ `auto_complete_insight()` trigger already works correctly with `completed` column
- ✅ No changes needed to conversation management triggers

### Benefits:
1. **Simpler data model**: Boolean `completed` is clearer than text `status`
2. **Better performance**: Boolean comparisons are faster than text comparisons
3. **Reduced storage**: Boolean uses less space than text
4. **Type safety**: Boolean prevents invalid status values
5. **Cleaner queries**: `WHERE completed = false` is more readable than `WHERE status = 'pending'`
6. **Flexible conversation summaries**: JSONB storage allows for evolving summary schemas without migrations
7. **Efficient querying**: GIN index enables fast searches within conversation summaries
8. **Simple operations**: Use native PostgreSQL JSONB operators instead of custom functions

### Frontend Impact:
- TypeScript types will need regeneration after database changes
- Any frontend code referencing `status` field will need to be updated to use `completed`
- The change is backwards compatible for most use cases since `completed = false` maps to `status = 'pending'`
- New `conversation_summaries` field will be available in `patient_context` table
- Use native PostgreSQL JSONB operations for adding/querying conversation summaries
