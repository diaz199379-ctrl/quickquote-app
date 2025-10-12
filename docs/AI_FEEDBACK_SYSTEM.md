# AI Feedback System

## Overview

The AI Assistant includes a comprehensive feedback system that allows users to rate responses with thumbs up/down. This feedback is collected and can be used to continuously improve the AI's responses over time.

## Features

### ✅ What's Implemented

1. **Visual Feedback UI**
   - Thumbs up/down buttons on every AI response
   - Visual confirmation when feedback is given
   - Filled icons to show which rating was selected
   - "Thanks for feedback!" message
   - One-time rating per message

2. **Feedback Storage**
   - Currently: LocalStorage (for demo)
   - Production: Supabase database (migration included)
   - Includes: rating, message content, context, timestamp

3. **Analytics**
   - Real-time feedback stats in console
   - Positive/negative ratio calculation
   - Total feedback count

## How It Works

### User Flow

1. User asks AI a question
2. AI provides an answer
3. User clicks thumbs up 👍 or thumbs down 👎
4. System saves feedback
5. UI updates to show feedback was received
6. Stats are logged to console

### Data Collected

```typescript
{
  messageId: string        // Unique message identifier
  rating: 'up' | 'down'    // User's rating
  comment?: string         // Optional user comment (future)
  context: {               // Project context when asked
    projectType: string
    zipCode: string
    dimensions: {...}
    materials: {...}
  }
  messageContent: string   // The AI's response
  timestamp: ISO string    // When feedback was given
}
```

## Setup for Production

### 1. Run Supabase Migration

```bash
# In Supabase SQL Editor
psql > \i supabase/migrations/003_ai_feedback.sql
```

Or copy the contents and paste into Supabase SQL Editor.

### 2. Update feedbackStore.ts

Uncomment the Supabase code in `lib/openai/feedbackStore.ts`:

```typescript
// Replace localStorage code with:
const { data, error } = await supabase
  .from('ai_feedback')
  .insert({
    message_id: feedback.messageId,
    rating: feedback.rating,
    comment: feedback.comment,
    message_content: feedback.messageContent,
    context: feedback.context,
    user_id: userId // Get from auth.getUser()
  })
```

## Using Feedback to Improve AI

### Method 1: Analyze and Update Fallback Responses

1. **Check feedback stats:**
   ```typescript
   const stats = FeedbackStore.getFeedbackStats()
   console.log(stats) // { total: 50, positive: 40, negative: 10, ratio: 0.8 }
   ```

2. **View all feedback:**
   ```typescript
   const feedback = FeedbackStore.getAllFeedback()
   ```

3. **Identify low-rated responses:**
   - Look for responses with many thumbs down
   - Improve those specific responses in `assistant.ts`

4. **Update fallback knowledge base:**
   - Edit `getFallbackResponse()` in `lib/openai/assistant.ts`
   - Add better examples, clearer explanations
   - Include more context-specific information

### Method 2: Supabase Analytics (Production)

```sql
-- View feedback analytics
SELECT * FROM ai_feedback_analytics;

-- Find most disliked responses
SELECT 
  message_content,
  COUNT(*) as dislikes,
  context
FROM ai_feedback
WHERE rating = 'down'
GROUP BY message_content, context
ORDER BY dislikes DESC
LIMIT 10;

-- Check positive ratio by question type
SELECT 
  context->>'projectType' as project_type,
  SUM(CASE WHEN rating = 'up' THEN 1 ELSE 0 END) as positive,
  SUM(CASE WHEN rating = 'down' THEN 1 ELSE 0 END) as negative,
  SUM(CASE WHEN rating = 'up' THEN 1 ELSE 0 END)::float / 
    COUNT(*)::float as positive_ratio
FROM ai_feedback
GROUP BY context->>'projectType';
```

### Method 3: OpenAI Fine-Tuning (Advanced)

For true AI learning, you can use OpenAI fine-tuning:

1. **Export positive feedback as training data:**
   ```typescript
   // Get all positive feedback
   const positive = feedback.filter(f => f.rating === 'up')
   
   // Format for OpenAI fine-tuning
   const trainingData = positive.map(f => ({
     messages: [
       { role: 'system', content: systemPrompt },
       { role: 'user', content: f.userMessage },
       { role: 'assistant', content: f.messageContent }
     ]
   }))
   ```

2. **Upload to OpenAI and create fine-tuned model:**
   ```bash
   openai api fine_tunes.create \
     -t training_data.jsonl \
     -m gpt-3.5-turbo
   ```

3. **Use fine-tuned model in production**

## Future Enhancements

### Short Term
- [ ] Add optional comment field for detailed feedback
- [ ] Show feedback stats in admin dashboard
- [ ] Email notifications for negative feedback
- [ ] A/B test different response styles

### Long Term
- [ ] Automatic prompt optimization based on feedback
- [ ] Machine learning to categorize feedback
- [ ] Suggest improvements to fallback responses
- [ ] Real-time response quality scoring

## Testing

### View Feedback in Console

After giving feedback, check the browser console for:
```
✅ Feedback saved! Total: 5, Positive: 4 (80.0%)
```

### Clear All Feedback

```javascript
// In browser console
FeedbackStore.clearFeedback()
```

### View All Stored Feedback

```javascript
// In browser console
FeedbackStore.getAllFeedback()
```

## Best Practices

1. **Monitor feedback regularly** - Check stats weekly
2. **Address negative feedback** - Improve low-rated responses
3. **Test improvements** - Track if changes increase positive ratio
4. **Don't over-optimize** - Keep responses natural and helpful
5. **Respect privacy** - Don't store sensitive project details

## Privacy & Data

- User IDs are linked to feedback in production
- Message content is stored for analysis
- Project context helps understand feedback
- Can be fully anonymized if needed
- GDPR compliant with user consent

## Support

For questions about the feedback system:
- Check console logs for debugging
- Review Supabase feedback table
- Monitor analytics views
- Contact support for fine-tuning help

