package com.aisupport.service;

import com.aisupport.model.ChatMessage;
import com.aisupport.model.Faq;
import com.aisupport.repository.FaqRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final ChatClient.Builder chatClientBuilder;
    private final FaqRepository faqRepository;

    private static final String SYSTEM_PROMPT = """
            You are a helpful and friendly AI customer support assistant.
            Your goal is to assist customers with their questions and issues professionally.
            Be concise, clear, and empathetic in your responses.
            If you don't know something, say so honestly and offer to escalate to a human agent.
            Always maintain a positive and professional tone.
            """;

    // Intent definitions: each entry has a set of trigger keywords and a response
    private static final List<Intent> INTENTS = List.of(

        new Intent("GREETING",
            Set.of("hi", "hello", "hey", "greetings", "howdy", "good morning",
                   "good afternoon", "good evening", "sup", "what's up"),
            "Hello! Welcome to AI Customer Support! I'm here to help you with anything you need.\n\n"
            + "You can ask me about:\n"
            + "- Orders & Tracking\n"
            + "- Billing & Payments\n"
            + "- Refunds & Returns\n"
            + "- Account & Password issues\n"
            + "- Technical problems\n"
            + "- Or anything else!\n\n"
            + "What can I assist you with today?"),

        new Intent("FAREWELL",
            Set.of("bye", "goodbye", "see you", "later", "take care",
                   "farewell", "have a good day", "thank you bye"),
            "Thank you for reaching out! It was a pleasure helping you.\n\n"
            + "If you ever need assistance again, don't hesitate to start a new chat.\n\n"
            + "Have a wonderful day! Goodbye!"),

        new Intent("THANKS",
            Set.of("thank you", "thanks", "thank", "appreciate", "helpful",
                   "great help", "that helped", "perfect"),
            "You're very welcome! I'm so glad I could help.\n\n"
            + "If you have any other questions or need further assistance, feel free to ask anytime.\n\n"
            + "Is there anything else I can help you with today?"),

        new Intent("CANCELLATION",
            Set.of("cancel", "cancellation", "cancel order", "stop order",
                   "don't want", "unsubscribe", "cancel my", "want to cancel",
                   "i want to cancel", "how do i cancel"),
            "Order/Subscription Cancellation\n\n"
            + "I can help you with cancellation! Here's what you need to know:\n\n"
            + "Cancel an Order:\n"
            + "- Orders can be cancelled within 1 hour of placing (before processing begins)\n"
            + "- Go to My Orders > Select Order > Cancel Order\n"
            + "- If already shipped, you'll need to initiate a return instead\n\n"
            + "Cancel a Subscription:\n"
            + "1. Account > Subscription > Cancel Plan\n"
            + "2. Your access continues until the end of the current billing period\n"
            + "3. You won't be charged again after cancellation\n\n"
            + "Note: Cancellations are usually processed immediately. Refunds (if applicable) take 3-7 business days.\n\n"
            + "Would you like help cancelling a specific order or subscription? Please share the details!"),

        new Intent("ORDER_STATUS",
            Set.of("order", "where is my order", "track", "tracking", "shipment",
                   "package", "delivery status", "dispatched", "shipped", "order status",
                   "when will", "arrive", "delivery"),
            "Order Tracking & Status\n\n"
            + "To check your order status, you can:\n"
            + "1. Log into your account and go to the Orders section\n"
            + "2. Use the tracking number from your confirmation email\n"
            + "3. Check your email for shipping updates\n\n"
            + "Typical delivery times:\n"
            + "- Standard: 5-7 business days\n"
            + "- Express: 2-3 business days\n"
            + "- Same-day: Available in select cities\n\n"
            + "If your order is delayed beyond the estimated date, please share your Order ID and I'll look into it right away!"),

        new Intent("REFUND",
            Set.of("refund", "money back", "get my money", "return money", "reimbursement",
                   "want a refund", "request refund", "refund status", "refund policy",
                   "charged wrong", "overcharged"),
            "Refund Request & Policy\n\n"
            + "I understand you'd like a refund - no problem! Here's how our refund process works:\n\n"
            + "Eligibility:\n"
            + "- Items must be returned within 30 days of purchase\n"
            + "- Items should be unused and in original packaging\n"
            + "- Digital products may have different terms\n\n"
            + "How to request a refund:\n"
            + "1. Go to My Orders in your account\n"
            + "2. Select the order and click Request Refund\n"
            + "3. Choose your reason and submit\n\n"
            + "Processing time: Refunds are processed within 3-5 business days and appear in your account within 7-10 business days.\n\n"
            + "Would you like me to initiate a refund for a specific order? Please share the Order ID!"),

        new Intent("RETURN",
            Set.of("return", "send back", "exchange", "replace", "return policy",
                   "how to return", "return item", "returning", "wrong item",
                   "damaged item", "defective", "broken"),
            "Returns & Exchanges\n\n"
            + "We want you to be completely satisfied! Here's our return process:\n\n"
            + "Return Policy:\n"
            + "- 30-day return window from delivery date\n"
            + "- Free returns for defective or wrong items\n"
            + "- Exchange available for size/color changes\n\n"
            + "Steps to return an item:\n"
            + "1. Log into your account > Orders > Select item\n"
            + "2. Click Return Item and select reason\n"
            + "3. Print the prepaid return label (email will be sent)\n"
            + "4. Drop off at any courier partner location\n\n"
            + "Once we receive your return, your refund or exchange will be processed within 5-7 business days.\n\n"
            + "Did you receive a damaged or wrong item? I can escalate this for priority handling!"),

        new Intent("PAYMENT",
            Set.of("payment", "pay", "failed payment", "payment failed", "transaction",
                   "card declined", "declined", "credit card",
                   "debit card", "checkout", "cannot pay", "payment issue",
                   "payment not working"),
            "Payment Issues & Help\n\n"
            + "I'm sorry to hear you're having payment trouble! Let's fix it:\n\n"
            + "Common reasons for payment failure:\n"
            + "1. Insufficient funds - Check your account balance\n"
            + "2. Card expired - Verify your card expiry date\n"
            + "3. Wrong details - Double-check card number, CVV, and billing address\n"
            + "4. Bank blocked - Your bank may need to authorize the transaction\n"
            + "5. International restrictions - Some cards block online transactions\n\n"
            + "Quick fixes:\n"
            + "- Try a different payment method (PayPal, UPI, net banking)\n"
            + "- Contact your bank and ask them to allow the transaction\n"
            + "- Clear browser cache and try again\n"
            + "- Try an incognito/private browser window\n\n"
            + "Accepted payment methods: Visa, MasterCard, Amex, PayPal, UPI, Net Banking\n\n"
            + "If the issue persists, please share the error message you see and I'll escalate it!"),

        new Intent("BILLING",
            Set.of("bill", "billing", "invoice", "receipt", "statement", "charge",
                   "subscription", "plan", "upgrade", "downgrade", "pricing", "cost",
                   "price", "how much", "cancel subscription", "charges",
                   "payment methods", "what payment", "accept payment",
                   "do you accept", "accepted payment", "which payment", "paypal", "upi"),
            "Billing & Account Charges\n\n"
            + "Happy to help with your billing question! Here's what you need to know:\n\n"
            + "Accepted Payment Methods:\n"
            + "- Visa, MasterCard, American Express\n"
            + "- PayPal, UPI, Net Banking\n\n"
            + "To view your invoices/receipts:\n"
            + "1. Log into your account > Billing > Invoices\n"
            + "2. Download or email any invoice as PDF\n\n"
            + "Subscription management:\n"
            + "- Upgrade/Downgrade: Account > Subscription > Change Plan\n"
            + "- Cancel: Account > Subscription > Cancel (takes effect at billing cycle end)\n"
            + "- Billing date: Shown in Account > Billing > Next Billing Date\n\n"
            + "Unexpected charge? We'll investigate immediately - please share the amount and date.\n\n"
            + "Is there a specific billing concern I can help you with?"),

        new Intent("PASSWORD",
            Set.of("password", "forgot password", "reset password", "change password",
                   "can't login", "cannot login", "login issue", "locked out",
                   "account locked", "forgot my password", "lost password"),
            "Password Reset & Account Access\n\n"
            + "No worries - getting back into your account is easy!\n\n"
            + "To reset your password:\n"
            + "1. Go to the Login page\n"
            + "2. Click 'Forgot Password?'\n"
            + "3. Enter your registered email address\n"
            + "4. Check your inbox for the reset link (valid for 1 hour)\n"
            + "5. Click the link and set a new password\n\n"
            + "Tips for a strong password:\n"
            + "- At least 8 characters long\n"
            + "- Mix of uppercase, lowercase, numbers, and symbols\n"
            + "- Don't reuse old passwords\n\n"
            + "Didn't receive the reset email?\n"
            + "- Check your spam/junk folder\n"
            + "- Make sure you're using the correct email address\n"
            + "- Wait 2-3 minutes and try again\n\n"
            + "Still locked out? Share your registered email and I'll help you manually!"),

        new Intent("ACCOUNT",
            Set.of("account", "profile", "update details", "change email", "change name",
                   "delete account", "close account", "my account", "account settings",
                   "username", "personal info", "edit profile"),
            "Account Management\n\n"
            + "Here's how to manage your account settings:\n\n"
            + "Update your profile:\n"
            + "- Account > Profile Settings > Edit Details\n"
            + "- You can update your name, email, phone, and address\n\n"
            + "Change your email:\n"
            + "- Account > Security > Change Email\n"
            + "- A verification link will be sent to your new email\n\n"
            + "Delete/Close account:\n"
            + "- Account > Settings > Delete Account\n"
            + "- Warning: This is permanent and cannot be undone\n\n"
            + "Two-Factor Authentication (2FA):\n"
            + "- Account > Security > Enable 2FA\n"
            + "- Recommended for added security\n\n"
            + "What specific account change do you need help with?"),

        new Intent("TECHNICAL",
            Set.of("not working", "error", "bug", "issue", "problem", "crash",
                   "page not loading", "slow", "broken", "glitch", "app not working",
                   "website down", "can't access", "technical", "loading", "stuck",
                   "freeze", "frozen"),
            "Technical Support\n\n"
            + "I'm sorry you're experiencing a technical issue! Let's troubleshoot this:\n\n"
            + "Quick fixes to try first:\n"
            + "1. Refresh the page (Ctrl+F5 / Cmd+Shift+R)\n"
            + "2. Clear browser cache and cookies\n"
            + "3. Try a different browser (Chrome, Firefox, Safari, Edge)\n"
            + "4. Try a different device or network\n"
            + "5. Check your internet connection\n"
            + "6. Wait 5 minutes - may be a temporary server issue\n\n"
            + "Still not working? Please tell me:\n"
            + "- What exactly are you trying to do?\n"
            + "- What error message (if any) do you see?\n"
            + "- Which browser/device are you using?\n"
            + "- When did this start happening?\n\n"
            + "This info will help me find the exact issue and fix it for you!"),

        new Intent("SHIPPING",
            Set.of("shipping", "ship", "courier", "postage", "free shipping",
                   "shipping cost", "shipping time", "express", "standard shipping",
                   "overnight", "next day"),
            "Shipping Information\n\n"
            + "Here's everything about our shipping options:\n\n"
            + "Shipping Methods & Timing:\n"
            + "- Standard: 5-7 business days (Free on orders over Rs.500)\n"
            + "- Express: 2-3 business days (Rs.99)\n"
            + "- Next Day: 1 business day (Rs.199)\n\n"
            + "Free Shipping: Orders above Rs.500 automatically qualify for free standard shipping.\n\n"
            + "Tracking your shipment:\n"
            + "- A tracking number is emailed once your order ships\n"
            + "- Track at any time via My Account > Orders\n\n"
            + "International shipping: Available to 50+ countries - rates vary by destination.\n\n"
            + "Do you have a specific shipping question?"),

        new Intent("COMPLAINT",
            Set.of("complaint", "complain", "unhappy", "disappointed", "frustrated",
                   "angry", "terrible", "awful", "worst", "bad experience", "bad service",
                   "unacceptable", "not satisfied", "poor service"),
            "We Sincerely Apologize\n\n"
            + "I'm truly sorry to hear that you've had a bad experience. "
            + "Your satisfaction is our top priority, and we take all complaints very seriously.\n\n"
            + "I want to make this right for you. To resolve your issue as quickly as possible, could you please tell me:\n\n"
            + "1. What exactly happened?\n"
            + "2. When did the issue occur?\n"
            + "3. What was your Order/Transaction ID (if applicable)?\n\n"
            + "Your complaint will be:\n"
            + "- Recorded and escalated to our quality team\n"
            + "- Reviewed within 24 hours\n"
            + "- Followed up with a resolution or compensation if applicable\n\n"
            + "You can also email us at complaints@aisupport.com for formal complaint tracking.\n\n"
            + "I'm here to listen and help - please share more details!"),

        new Intent("CONTACT",
            Set.of("contact", "speak to agent", "human agent", "talk to person",
                   "customer service", "support team", "phone number", "email support",
                   "live chat", "call", "reach you"),
            "Contact Our Support Team\n\n"
            + "I'm happy to connect you with our team! Here are all the ways to reach us:\n\n"
            + "Live Chat (Fastest): Available right here, 24/7 with AI assistance\n"
            + "Human agents available Mon-Fri 9am-6pm\n\n"
            + "Email: support@aisupport.com\n"
            + "Response time: Within 4-6 business hours\n\n"
            + "Phone: 1-800-SUPPORT (1-800-787-7678)\n"
            + "Available: Mon-Sat, 8am-8pm (local time)\n\n"
            + "Submit a Ticket: account.aisupport.com/tickets\n"
            + "For complex issues requiring detailed investigation\n\n"
            + "Would you like me to escalate your current issue to a human agent right now?")
    );

    // ─── Main entry point ────────────────────────────────────────────────────────────────────────
    public String generateResponse(String userMessage, List<ChatMessage> conversationHistory) {
        try {
            return callOpenAi(userMessage, conversationHistory);
        } catch (Exception e) {
            log.warn("OpenAI unavailable ({}), using smart intent-based fallback", e.getMessage());
            return smartFallbackResponse(userMessage);
        }
    }

    // ─── OpenAI call ─────────────────────────────────────────────────────────────────────────────
    private String callOpenAi(String userMessage, List<ChatMessage> history) {
        List<Message> messages = new ArrayList<>();
        messages.add(new SystemMessage(SYSTEM_PROMPT));

        int start = Math.max(0, history.size() - 10);
        for (int i = start; i < history.size(); i++) {
            ChatMessage msg = history.get(i);
            if (msg.getSender() == ChatMessage.SenderType.USER) {
                messages.add(new UserMessage(msg.getContent()));
            } else {
                messages.add(new AssistantMessage(msg.getContent()));
            }
        }
        messages.add(new UserMessage(userMessage));

        ChatClient chatClient = chatClientBuilder.build();
        return chatClient.prompt()
                .messages(messages)
                .call()
                .content();
    }

    // ─── Smart intent-based fallback ─────────────────────────────────────────────────────────────
    private String smartFallbackResponse(String userMessage) {
        String lower = userMessage.toLowerCase().trim();

        // 1. Score all intents by keyword matches
        Intent bestIntent = null;
        int bestScore = 0;

        for (Intent intent : INTENTS) {
            int score = 0;
            for (String keyword : intent.keywords()) {
                if (lower.contains(keyword)) {
                    // Multi-word keywords score higher (more specific)
                    score += keyword.split("\\s+").length + 1;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestIntent = intent;
            }
        }

        if (bestIntent != null && bestScore >= 1) {
            log.info("Intent matched: {} (score={}) for: '{}'", bestIntent.name(), bestScore, userMessage);
            return bestIntent.response();
        }

        // 2. Try FAQ database matching
        String faqResponse = matchFaq(lower);
        if (faqResponse != null) {
            log.info("FAQ matched for: '{}'", userMessage);
            return faqResponse;
        }

        // 3. Final helpful fallback
        log.info("No intent matched, using final fallback for: '{}'", userMessage);
        return finalFallback(userMessage);
    }

    // ─── FAQ keyword matching ─────────────────────────────────────────────────────────────────────
    private String matchFaq(String lowerMessage) {
        List<Faq> faqs = faqRepository.findByIsActiveTrueOrderByCreatedAtDesc();
        Faq bestFaq = null;
        long bestScore = 0;

        for (Faq faq : faqs) {
            String[] words = faq.getQuestion().toLowerCase().split("\\s+");
            long score = 0;
            for (String word : words) {
                if (word.length() > 3 && lowerMessage.contains(word)) {
                    score++;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestFaq = faq;
            }
        }

        if (bestFaq != null && bestScore >= 2) {
            return "Regarding: \"" + bestFaq.getQuestion() + "\"\n\n"
                   + bestFaq.getAnswer()
                   + "\n\nIs this what you were looking for? If not, please tell me more and I'll help further!";
        }
        return null;
    }

    // ─── Final fallback ───────────────────────────────────────────────────────────────────────────
    private String finalFallback(String userMessage) {
        return "I want to make sure I help you correctly!\n\n"
            + "I received your message: \"" + userMessage + "\"\n\n"
            + "I can help you with:\n"
            + "- Orders & Tracking - order status, shipping\n"
            + "- Refunds & Returns - return policy, refund requests\n"
            + "- Payments & Billing - payment issues, invoices\n"
            + "- Account & Password - login issues, reset password\n"
            + "- Technical Issues - bugs, errors, page not loading\n"
            + "- Complaints - I take all feedback seriously\n"
            + "- Talk to a Human - connect with our support team\n\n"
            + "Could you describe your issue in a bit more detail? Or type one of the topics above and I'll get right on it!";
    }

    // ─── Intent record ────────────────────────────────────────────────────────────────────────────
    private record Intent(String name, Set<String> keywords, String response) {}
}
