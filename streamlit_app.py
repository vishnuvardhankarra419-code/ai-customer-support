import streamlit as st
import datetime
import requests
import json
import re
import os
import time

# ==============================================================================
# 1. PAGE CONFIGURATION & DARK GLASSMORPHISM STYLING
# ==============================================================================
st.set_page_config(
    page_title="AI Customer Support",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for modern AI Customer Support theme
st.markdown("""
<style>
    /* Global App Background */
    .stApp {
        background: linear-gradient(135deg, #0f172a 0%, #090d16 100%);
        color: #f8fafc;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Sidebar Styling */
    section[data-testid="stSidebar"] {
        background-color: #0d1322 !important;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    /* Branding Header Card */
    .brand-card {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 20px;
        text-align: center;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    }
    
    .brand-title {
        font-size: 1.4rem;
        font-weight: 800;
        background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin: 0;
    }
    
    .brand-subtitle {
        color: #94a3b8;
        font-size: 0.8rem;
        margin-top: 4px;
    }

    /* Status Badges */
    .status-badge-online {
        display: inline-block;
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.3);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .status-badge-standalone {
        display: inline-block;
        background: rgba(168, 85, 247, 0.15);
        color: #c084fc;
        border: 1px solid rgba(168, 85, 247, 0.3);
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    /* Chat Container Header */
    .chat-header {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 16px 24px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        backdrop-filter: blur(12px);
    }

    /* Chat Messages */
    .stChatMessage {
        border-radius: 16px !important;
        padding: 14px 18px !important;
        margin-bottom: 12px !important;
    }

    /* Timestamp tag */
    .msg-timestamp {
        font-size: 0.7rem;
        color: #64748b;
        margin-top: 6px;
        text-align: right;
    }

    /* Primary Buttons */
    div.stButton > button {
        border-radius: 12px !important;
        font-weight: 600 !important;
        transition: all 0.2s ease !important;
    }

    div.stButton > button[kind="primary"] {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
        border: none !important;
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4) !important;
    }

    div.stButton > button[kind="primary"]:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6) !important;
    }

    /* Hide Streamlit Default Footers */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
</style>
""", unsafe_allow_html=True)


# ==============================================================================
# 2. INTENT-BASED AI ENGINE (STANDALONE & FALLBACK MODE)
# ==============================================================================
INTENTS = [
    {
        "name": "GREETING",
        "keywords": {"hi", "hello", "hey", "greetings", "howdy", "good morning", "good afternoon", "good evening", "sup", "what's up"},
        "response": """Hello! 👋 Welcome to **AI Customer Support**! I'm here to help you with anything you need.

You can ask me about:
- 📦 **Orders & Tracking**
- 💳 **Billing & Payments**
- 💰 **Refunds & Returns**
- 🔐 **Account & Password issues**
- 🔧 **Technical problems**
- 📞 **Contacting human support**

What can I assist you with today?"""
    },
    {
        "name": "FAREWELL",
        "keywords": {"bye", "goodbye", "see you", "later", "take care", "farewell", "have a good day", "thank you bye"},
        "response": """Thank you for reaching out! 😊 It was a pleasure helping you.

If you ever need assistance again, don't hesitate to start a new chat. Have a wonderful day! Goodbye! 👋"""
    },
    {
        "name": "THANKS",
        "keywords": {"thank you", "thanks", "thank", "appreciate", "helpful", "great help", "that helped", "perfect", "awesome"},
        "response": """You're very welcome! 😊 I'm so glad I could help.

If you have any other questions or need further assistance, feel free to ask anytime. Is there anything else I can help you with today?"""
    },
    {
        "name": "CANCELLATION",
        "keywords": {"cancel", "cancellation", "cancel order", "stop order", "don't want", "unsubscribe", "cancel my", "want to cancel", "i want to cancel", "how do i cancel"},
        "response": """❌ **Order/Subscription Cancellation**

I can help you with cancellation! Here's what you need to know:

**Cancel an Order:**
- Orders can be cancelled within **1 hour** of placing (before processing begins)
- Go to **My Orders** → Select Order → **Cancel Order**
- If already shipped, you'll need to initiate a **return** instead

**Cancel a Subscription:**
1. Account → Subscription → **Cancel Plan**
2. Your access continues until the end of the current billing period
3. You won't be charged again after cancellation

*Note: Cancellations are usually processed immediately. Refunds (if applicable) take 3–7 business days.*"""
    },
    {
        "name": "ORDER_STATUS",
        "keywords": {"order", "where is my order", "track", "tracking", "shipment", "package", "delivery status", "dispatched", "shipped", "order status", "when will", "arrive", "delivery"},
        "response": """📦 **Order Tracking & Status**

To check your order status, you can:
1. **Log into your account** and go to the **Orders** section
2. Use the **tracking number** from your confirmation email
3. Check your email for real-time shipping updates

**Typical delivery times:**
- Standard Shipping: 5–7 business days
- Express Shipping: 2–3 business days
- Same-day Delivery: Available in select cities

If your order is delayed beyond the estimated date, please share your Order ID and I'll look into it right away! 🔍"""
    },
    {
        "name": "REFUND",
        "keywords": {"refund", "money back", "get my money", "return money", "reimbursement", "want a refund", "request refund", "refund status", "refund policy", "charged wrong", "overcharged", "i need a refund"},
        "response": """💰 **Refund Request & Policy**

I understand you'd like a refund — no problem! Here's how our refund process works:

**Eligibility:**
- Items must be returned within **30 days** of purchase
- Items should be unused and in original packaging
- Digital products may have specific terms

**How to request a refund:**
1. Go to **My Orders** in your account
2. Select the order and click **Request Refund**
3. Choose your reason and submit

**Processing time:** Refunds are processed within **3–5 business days** and appear in your account within **7–10 business days**."""
    },
    {
        "name": "RETURN_DAMAGE",
        "keywords": {"return", "send back", "exchange", "replace", "return policy", "how to return", "return item", "returning", "wrong item", "damaged", "damaged item", "defective", "broken", "product is damaged", "my product is damaged"},
        "response": """🛠️ **Damaged Product & Return Handling**

We're so sorry your item arrived damaged or defective! We will replace or refund it immediately.

**Priority Replacement for Damaged Items:**
- 🔴 **Step 1:** Take 1-2 photos of the damaged product and packaging
- 🔴 **Step 2:** Go to **My Orders** → Select item → **Report Damaged Item**
- 🔴 **Step 3:** Choose **Free Replacement** or **Instant Refund**

**Return Policy Overview:**
- 30-day free return window
- Prepaid shipping label provided via email
- Zero return shipping cost for damaged or incorrect items"""
    },
    {
        "name": "PAYMENT",
        "keywords": {"payment", "pay", "failed payment", "payment failed", "transaction", "card declined", "declined", "checkout", "cannot pay", "payment issue", "payment not working", "my payment failed"},
        "response": """💳 **Payment Troubleshooting**

I'm sorry to hear your payment failed! Let's troubleshoot and get it resolved:

**Common reasons for payment failure:**
1. ⚠️ **Insufficient funds** – Please verify your bank balance
2. ⚠️ **Card expired** – Double-check your expiry date and CVV
3. ⚠️ **Bank security block** – Your bank may require 2FA/OTP authorization
4. ⚠️ **Billing address mismatch** – Ensure billing zip code matches your card statement

**Quick solutions:**
- Try an alternative payment method (PayPal, Credit/Debit Card, UPI, Net Banking)
- Clear browser cookies or try an Incognito window
- Contact your issuing bank to unblock online transactions"""
    },
    {
        "name": "BILLING",
        "keywords": {"bill", "billing", "invoice", "receipt", "statement", "charge", "subscription", "plan", "upgrade", "downgrade", "pricing", "cost", "price", "how much", "cancel subscription", "charges", "payment methods", "what payment", "accept payment", "do you accept", "accepted payment", "which payment"},
        "response": """🧾 **Billing & Accepted Payment Methods**

Happy to help with your billing inquiry!

**Accepted Payment Methods:**
- Visa, MasterCard, American Express, Discover
- PayPal, Apple Pay, Google Pay
- Net Banking & Direct Bank Transfers

**Viewing Invoices & Receipts:**
1. Log into your account → **Billing & Invoices**
2. Download or email any statement as PDF

**Subscription Management:**
- Upgrade/Downgrade: **Account** → **Subscription** → **Change Plan**
- Renewal Date: Displayed under Billing Overview"""
    },
    {
        "name": "PASSWORD",
        "keywords": {"password", "forgot password", "reset password", "change password", "can't login", "cannot login", "login issue", "locked out", "account locked", "forgot my password", "lost password", "i forgot my password"},
        "response": """🔐 **Password Reset & Login Assistance**

No worries — resetting your password takes less than 2 minutes!

**Steps to reset your password:**
1. Go to the **Login Page**
2. Click **"Forgot Password?"**
3. Enter your registered email address
4. Check your inbox for the secure reset link (valid for 60 minutes)
5. Click the link and enter your new password

**Didn't receive the email?**
- Check your Spam / Junk folder
- Ensure there are no typos in the email address
- Wait 2 minutes and click **Resend Link**"""
    },
    {
        "name": "ACCOUNT",
        "keywords": {"account", "profile", "update details", "change email", "change name", "delete account", "close account", "my account", "account settings", "username", "personal info", "edit profile", "how can i update my account"},
        "response": """👤 **Account Management & Profile Updates**

Here is how you can update your account settings:

**Updating Profile Information:**
- Log into your account → **Account Settings** → **Profile**
- You can update your **Name, Email, Phone Number, and Shipping Address**

**Security Settings:**
- Change Password under **Security**
- Enable **Two-Factor Authentication (2FA)** for extra protection

**Account Deletion:**
- Account Settings → **Delete Account** (Warning: Action is permanent)"""
    },
    {
        "name": "TECHNICAL",
        "keywords": {"not working", "error", "bug", "issue", "problem", "crash", "page not loading", "slow", "broken", "glitch", "app not working", "website down", "can't access", "technical", "loading", "stuck", "freeze", "frozen"},
        "response": """🔧 **Technical Support & Troubleshooting**

I'm sorry you're experiencing a technical issue! Let's get it fixed:

**Quick Troubleshooting Steps:**
1. 🔄 **Hard Refresh** the page (`Ctrl + F5` or `Cmd + Shift + R`)
2. 🗑️ **Clear browser cache** & cookies
3. 🌐 **Try Chrome, Firefox, Safari, or Edge**
4. 📱 **Test on mobile or a private/incognito window**

If the issue persists, please share the exact error message or screenshot!"""
    },
    {
        "name": "CONTACT",
        "keywords": {"contact", "speak to agent", "human agent", "talk to person", "customer service", "support team", "phone number", "email support", "live chat", "call", "reach you"},
        "response": """📞 **Contact Customer Support**

We're here for you 24/7! Reach out via any channel below:

- 💬 **Live Chat:** Active right here 24/7 (Human escalation available Mon-Fri 9am-6pm)
- 📧 **Email Support:** `support@aisupport.com` (Response within 4 hours)
- 📞 **Phone Support:** `1-800-SUPPORT` (Mon-Sat, 8am-8pm)
- 🎫 **Submit Ticket:** `account.aisupport.com/tickets`"""
    }
]

def generate_standalone_ai_response(user_msg: str) -> str:
    """Generates a context-aware response based on intent analysis or OpenAI API call if key is provided."""
    openai_key = os.environ.get("OPENAI_API_KEY") or st.secrets.get("OPENAI_API_KEY", "")
    
    # Try calling OpenAI API if valid key is set
    if openai_key and not openai_key.startswith("sk-placeholder") and not openai_key.startswith("sk-your"):
        try:
            headers = {
                "Authorization": f"Bearer {openai_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": st.secrets.get("OPENAI_MODEL", "gpt-4o"),
                "messages": [
                    {"role": "system", "content": "You are a professional, empathetic, and concise AI customer support assistant."},
                    {"role": "user", "content": user_msg}
                ],
                "max_tokens": 500
            }
            base_url = st.secrets.get("OPENAI_BASE_URL", "https://api.openai.com")
            res = requests.post(f"{base_url}/v1/chat/completions", headers=headers, json=payload, timeout=8)
            if res.status_code == 200:
                return res.json()["choices"][0]["message"]["content"]
        except Exception as ex:
            pass

    # Intent-based keyword scoring
    lower = user_msg.lower().strip()
    best_intent = None
    best_score = 0

    for intent in INTENTS:
        score = 0
        for kw in intent["keywords"]:
            if kw in lower:
                score += len(kw.split()) + 1
        if score > best_score:
            best_score = score
            best_intent = intent

    if best_intent and best_score >= 1:
        return best_intent["response"]

    # Default fallback
    return f"""🤔 **I want to make sure I assist you accurately!**

I received your message: *"{user_msg}"*

I can help you with:
- 📦 **Orders & Tracking**
- 💰 **Refunds & Returns**
- 💳 **Payments & Billing**
- 🔐 **Account & Password Reset**
- 🔧 **Technical Support**
- 📞 **Contacting Support**

Please select a topic or describe your question in more detail! 😊"""


# ==============================================================================
# 3. SESSION STATE INITIALIZATION
# ==============================================================================
if "sessions" not in st.session_state:
    now_str = datetime.datetime.now().strftime("%I:%M %p")
    default_id = "session_1"
    st.session_state.sessions = {
        default_id: {
            "title": "Welcome Chat",
            "created_at": now_str,
            "messages": [
                {
                    "sender": "AI",
                    "content": "Hello! 👋 Welcome to **AI Customer Support**. How can I help you today?",
                    "timestamp": now_str
                }
            ]
        }
    }
    st.session_state.current_session_id = default_id

if "feedback" not in st.session_state:
    st.session_state.feedback = {}


# ==============================================================================
# 4. BACKEND CONNECTION & SERVICE HELPERS
# ==============================================================================
def get_backend_url():
    return st.secrets.get("API_BASE_URL", "http://localhost:8080/api")

def check_backend_online():
    try:
        url = get_backend_url().replace("/api", "/swagger-ui.html")
        r = requests.get(url, timeout=1.5)
        return r.status_code in [200, 302]
    except Exception:
        return False

BACKEND_ONLINE = check_backend_online()

def send_chat_message(session_id: str, content: str) -> dict:
    timestamp_str = datetime.datetime.now().strftime("%I:%M %p")
    
    # Check if backend REST API is available
    if BACKEND_ONLINE:
        try:
            # Login / Token check
            token = st.session_state.get("jwt_token")
            if not token:
                login_res = requests.post(
                    f"{get_backend_url()}/auth/login",
                    json={"email": "test@example.com", "password": "Test@1234"},
                    timeout=3
                )
                if login_res.status_code == 200:
                    token = login_res.json().get("token")
                    st.session_state["jwt_token"] = token
            
            headers = {"Content-Type": "application/json"}
            if token:
                headers["Authorization"] = f"Bearer {token}"
            
            payload = {"message": content}
            res = requests.post(
                f"{get_backend_url()}/chat/message",
                headers=headers,
                json=payload,
                timeout=5
            )
            
            if res.status_code == 200:
                data = res.json()
                return {
                    "sender": "AI",
                    "content": data.get("content", "Thank you for reaching out!"),
                    "timestamp": timestamp_str
                }
        except Exception as e:
            pass # Fall back to standalone AI response on error

    # Standalone AI Engine response
    ai_content = generate_standalone_ai_response(content)
    return {
        "sender": "AI",
        "content": ai_content,
        "timestamp": timestamp_str
    }


# ==============================================================================
# 5. SIDEBAR NAVIGATION & CHAT SESSIONS
# ==============================================================================
with st.sidebar:
    # Branding Card
    st.markdown("""
    <div class="brand-card">
        <div class="brand-title">🤖 AI Customer Support</div>
        <div class="brand-subtitle">Instant 24/7 Smart Help Assistant</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Connection Status Indicator
    if BACKEND_ONLINE:
        st.markdown('<div class="status-badge-online">🟢 Backend REST API Connected</div>', unsafe_allow_html=True)
    else:
        st.markdown('<div class="status-badge-standalone">🟣 Standalone AI Engine Active</div>', unsafe_allow_html=True)
        
    st.markdown("---")
    
    # ➕ New Chat Button
    if st.button("➕ Start New Chat", use_container_width=True, type="primary"):
        new_id = f"session_{len(st.session_state.sessions) + 1}_{int(time.time())}"
        now_str = datetime.datetime.now().strftime("%I:%M %p")
        st.session_state.sessions[new_id] = {
            "title": f"Chat #{len(st.session_state.sessions) + 1}",
            "created_at": now_str,
            "messages": [
                {
                    "sender": "AI",
                    "content": "Hello! 👋 Welcome to a new support session. What issue can I help you resolve?",
                    "timestamp": now_str
                }
            ]
        }
        st.session_state.current_session_id = new_id
        st.rerun()

    st.markdown("### 💬 Chat History")
    
    # Session List
    session_ids = list(st.session_state.sessions.keys())
    for s_id in reversed(session_ids):
        sess = st.session_state.sessions[s_id]
        is_active = (s_id == st.session_state.current_session_id)
        
        # Display session selector
        label = f"{'🔹 ' if is_active else '💬 '}{sess['title']} ({sess['created_at']})"
        if st.button(label, key=f"btn_{s_id}", use_container_width=True):
            st.session_state.current_session_id = s_id
            st.rerun()

    st.markdown("---")
    
    # Clear Chat History Option
    if st.button("🗑️ Clear All History", use_container_width=True):
        default_id = "session_1"
        now_str = datetime.datetime.now().strftime("%I:%M %p")
        st.session_state.sessions = {
            default_id: {
                "title": "Welcome Chat",
                "created_at": now_str,
                "messages": [
                    {"sender": "AI", "content": "Hello! 👋 Welcome to **AI Customer Support**. How can I help you today?", "timestamp": now_str}
                ]
            }
        }
        st.session_state.current_session_id = default_id
        st.session_state.feedback = {}
        st.success("Chat history cleared!")
        st.rerun()

    # Settings & API Key Expander
    with st.expander("⚙️ Configuration & Secrets"):
        st.text_input("API Base URL", value=get_backend_url(), disabled=True)
        user_openai_key = st.text_input("OpenAI API Key (Optional)", type="password", help="Enter custom OpenAI API key if desired")
        if user_openai_key:
            os.environ["OPENAI_API_KEY"] = user_openai_key
            st.caption("Custom OpenAI Key updated!")


# ==============================================================================
# 6. MAIN CHAT INTERFACE
# ==============================================================================
current_id = st.session_state.current_session_id
current_session = st.session_state.sessions[current_id]

# Chat Header Bar
st.markdown(f"""
<div class="chat-header">
    <div>
        <h3 style="margin:0; font-size: 1.25rem; font-weight:700;">💬 {current_session['title']}</h3>
        <span style="color: #64748b; font-size: 0.8rem;">Session Started at {current_session['created_at']}</span>
    </div>
</div>
""", unsafe_allow_html=True)

# Render Chat Messages
for idx, msg in enumerate(current_session["messages"]):
    avatar = "🤖" if msg["sender"] == "AI" else "👤"
    with st.chat_message("assistant" if msg["sender"] == "AI" else "user", avatar=avatar):
        st.markdown(msg["content"])
        st.markdown(f'<div class="msg-timestamp">{msg.get("timestamp", "")}</div>', unsafe_allow_html=True)
        
        # Feedback Buttons for AI responses
        if msg["sender"] == "AI" and idx > 0:
            fb_key = f"fb_{current_id}_{idx}"
            col1, col2, col3 = st.columns([1, 1, 10])
            with col1:
                if st.button("👍", key=f"up_{fb_key}", help="Helpful response"):
                    st.session_state.feedback[fb_key] = "helpful"
                    st.toast("Thank you for your feedback! 👍")
            with col2:
                if st.button("👎", key=f"down_{fb_key}", help="Unhelpful response"):
                    st.session_state.feedback[fb_key] = "unhelpful"
                    st.toast("Thank you! We'll work to improve our answers. 👎")

# Chat Input Box
user_prompt = st.chat_input("Ask a question about orders, billing, refunds, account, or technical issues...")

if user_prompt:
    now_str = datetime.datetime.now().strftime("%I:%M %p")
    
    # Update Session Title if it's the first user message
    if len(current_session["messages"]) == 1:
        current_session["title"] = user_prompt[:30] + ("..." if len(user_prompt) > 30 else "")
    
    # 1. Add User Message
    user_msg_obj = {
        "sender": "USER",
        "content": user_prompt,
        "timestamp": now_str
    }
    current_session["messages"].append(user_msg_obj)
    
    # Display user message immediately
    with st.chat_message("user", avatar="👤"):
        st.markdown(user_prompt)
        st.markdown(f'<div class="msg-timestamp">{now_str}</div>', unsafe_allow_html=True)

    # 2. Generate AI Response with spinner
    with st.chat_message("assistant", avatar="🤖"):
        with st.spinner("AI is thinking..."):
            ai_msg_obj = send_chat_message(current_id, user_prompt)
            st.markdown(ai_msg_obj["content"])
            st.markdown(f'<div class="msg-timestamp">{ai_msg_obj["timestamp"]}</div>', unsafe_allow_html=True)
            
    current_session["messages"].append(ai_msg_obj)
    st.rerun()
