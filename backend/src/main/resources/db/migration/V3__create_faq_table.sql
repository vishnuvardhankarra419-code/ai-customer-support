-- V3: Create faqs table

CREATE TABLE IF NOT EXISTS faqs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    created_by BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_faq_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Seed sample FAQs
INSERT INTO faqs (question, answer, category, is_active) VALUES
('How do I reset my password?', 'To reset your password, click on "Forgot Password" on the login page and follow the instructions sent to your email.', 'Account', TRUE),
('What payment methods do you accept?', 'We accept Visa, MasterCard, American Express, PayPal, and bank transfers.', 'Billing', TRUE),
('How can I track my order?', 'You can track your order by logging into your account and visiting the Orders section.', 'Orders', TRUE),
('What is your return policy?', 'We offer a 30-day return policy for all unused items in their original packaging.', 'Returns', TRUE),
('How do I contact support?', 'You can reach our support team via this chat, email at support@aisupport.com, or call us at 1-800-SUPPORT.', 'Support', TRUE);
