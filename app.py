import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import openpyxl
import numpy as np
from datetime import datetime, timedelta
import io

# ==========================================
# 1. PAGE CONFIGURATION & STYLING
# ==========================================
st.set_page_config(
    page_title="AI Customer Support Analytics",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Modern Custom CSS (Dark Glassmorphism Theme)
st.markdown("""
<style>
    /* Global Styles */
    .stApp {
        background-color: #0e1117;
        color: #e0e6ed;
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
    }
    
    /* Header Container */
    .header-box {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 24px 32px;
        margin-bottom: 24px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        backdrop-filter: blur(8px);
    }
    
    .header-title {
        color: #ffffff;
        font-size: 2.2rem;
        font-weight: 700;
        margin: 0;
        letter-spacing: -0.5px;
    }
    
    .header-subtitle {
        color: #94a3b8;
        font-size: 1.05rem;
        margin-top: 6px;
    }

    /* Metric Cards */
    .metric-card {
        background: linear-gradient(145deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 14px;
        padding: 20px 24px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        transition: transform 0.2s ease, border-color 0.2s ease;
    }
    
    .metric-card:hover {
        transform: translateY(-2px);
        border-color: rgba(99, 102, 241, 0.4);
    }
    
    .metric-label {
        color: #94a3b8;
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .metric-value {
        color: #f8fafc;
        font-size: 2rem;
        font-weight: 800;
        margin-top: 6px;
    }
    
    .metric-delta {
        font-size: 0.85rem;
        font-weight: 600;
        margin-top: 4px;
    }
    .delta-positive { color: #10b981; }
    .delta-negative { color: #ef4444; }

    /* Custom Streamlit Tabs Styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        background-color: rgba(15, 23, 42, 0.6);
        padding: 6px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .stTabs [data-baseweb="tab"] {
        height: 44px;
        border-radius: 8px;
        color: #94a3b8;
        font-weight: 600;
        padding: 0 20px;
    }

    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
        color: #ffffff !important;
    }

    /* Sidebar Styling */
    section[data-testid="stSidebar"] {
        background-color: #0f172a;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
    }
</style>
""", unsafe_allow_html=True)


# ==========================================
# 2. SAMPLE DATA GENERATOR
# ==========================================
@st.cache_data
def generate_sample_data(num_records=500):
    np.random.seed(42)
    start_date = datetime.now() - timedelta(days=60)
    
    categories = ['Billing & Invoicing', 'Account Access', 'Technical Support', 'Feature Request', 'Bug Report', 'General Inquiry']
    priorities = ['Low', 'Medium', 'High', 'Urgent']
    statuses = ['Resolved', 'Resolved', 'Resolved', 'In Progress', 'Escalated']
    sentiments = ['Positive', 'Neutral', 'Negative']
    channels = ['AI Chatbot', 'Web Portal', 'Email', 'Live Chat']
    agents = ['AI Assistant (GPT-4o)', 'Sarah Jenkins', 'Alex Rivera', 'David Chen', 'Emily Taylor']

    records = []
    for i in range(1, num_records + 1):
        created_dt = start_date + timedelta(
            days=int(np.random.randint(0, 60)),
            hours=int(np.random.randint(0, 24)),
            minutes=int(np.random.randint(0, 60))
        )
        
        category = np.random.choice(categories, p=[0.25, 0.20, 0.25, 0.10, 0.10, 0.10])
        priority = np.random.choice(priorities, p=[0.4, 0.35, 0.18, 0.07])
        status = np.random.choice(statuses, p=[0.70, 0.10, 0.05, 0.10, 0.05])
        channel = np.random.choice(channels, p=[0.55, 0.20, 0.15, 0.10])
        
        is_ai_handled = channel == 'AI Chatbot' and status == 'Resolved' and np.random.rand() > 0.25
        agent = 'AI Assistant (GPT-4o)' if is_ai_handled else np.random.choice(agents[1:])
        
        # Resolution time (hours)
        res_time = round(float(np.random.exponential(scale=1.5 if is_ai_handled else 8.0)), 2)
        if status != 'Resolved':
            res_time = None

        # Sentiment & CSAT
        sentiment = np.random.choice(sentiments, p=[0.60, 0.25, 0.15] if is_ai_handled else [0.50, 0.30, 0.20])
        if sentiment == 'Positive':
            csat = int(np.random.choice([4, 5], p=[0.3, 0.7]))
        elif sentiment == 'Neutral':
            csat = int(np.random.choice([3, 4], p=[0.6, 0.4]))
        else:
            csat = int(np.random.choice([1, 2, 3], p=[0.4, 0.4, 0.2]))

        records.append({
            'Ticket_ID': f"TICK-{1000 + i}",
            'Created_At': created_dt,
            'Category': category,
            'Priority': priority,
            'Status': status,
            'Channel': channel,
            'AI_Handled': 'Yes' if is_ai_handled else 'No',
            'Assigned_Agent': agent,
            'Resolution_Time_Hrs': res_time,
            'Customer_Sentiment': sentiment,
            'CSAT_Rating': csat
        })
        
    df = pd.DataFrame(records)
    df['Created_Date'] = df['Created_At'].dt.date
    return df


# ==========================================
# 3. SIDEBAR CONTROLS & DATA LOADING
# ==========================================
st.sidebar.image("https://img.icons8.com/isometric-line/100/bot.png", width=64)
st.sidebar.title("Support Analytics Controls")

data_source = st.sidebar.radio(
    "Data Source",
    ["Demo Dataset", "Upload File (.xlsx / .csv)"],
    index=0
)

df_raw = None

if data_source == "Demo Dataset":
    df_raw = generate_sample_data()
    st.sidebar.success("Loaded 500 Demo Support Tickets")
else:
    uploaded_file = st.sidebar.file_uploader(
        "Upload Customer Support File",
        type=["xlsx", "xls", "csv"],
        help="Upload an Excel file (.xlsx) or CSV containing ticket logs."
    )
    if uploaded_file is not None:
        try:
            if uploaded_file.name.endswith(('.xlsx', '.xls')):
                df_raw = pd.read_excel(uploaded_file, engine='openpyxl')
            else:
                df_raw = pd.read_csv(uploaded_file)
            
            # Date normalization if present
            for col in df_raw.columns:
                if 'date' in col.lower() or 'created' in col.lower():
                    df_raw[col] = pd.to_datetime(df_raw[col], errors='coerce')
                    df_raw['Created_Date'] = df_raw[col].dt.date
                    break
            st.sidebar.success(f"Successfully loaded {len(df_raw)} records from {uploaded_file.name}")
        except Exception as e:
            st.sidebar.error(f"Error loading file: {e}")
    else:
        st.info("👈 Please upload an Excel or CSV dataset in the sidebar to begin analysis, or switch to 'Demo Dataset'.")
        st.stop()

if df_raw is None or df_raw.empty:
    st.warning("No data available to analyze.")
    st.stop()

# Interactive Filters
st.sidebar.markdown("---")
st.sidebar.subheader("🎯 Data Filters")

# Date Filter
if 'Created_Date' in df_raw.columns:
    min_d = df_raw['Created_Date'].min()
    max_d = df_raw['Created_Date'].max()
    date_range = st.sidebar.date_input("Date Range", value=[min_d, max_d], min_value=min_d, max_value=max_d)
    if len(date_range) == 2:
        df_filtered = df_raw[(df_raw['Created_Date'] >= date_range[0]) & (df_raw['Created_Date'] <= date_range[1])]
    else:
        df_filtered = df_raw.copy()
else:
    df_filtered = df_raw.copy()

# Category Filter
if 'Category' in df_filtered.columns:
    all_categories = sorted(df_filtered['Category'].dropna().unique().tolist())
    selected_categories = st.sidebar.multiselect("Category", options=all_categories, default=all_categories)
    if selected_categories:
        df_filtered = df_filtered[df_filtered['Category'].isin(selected_categories)]

# Priority Filter
if 'Priority' in df_filtered.columns:
    all_priorities = sorted(df_filtered['Priority'].dropna().unique().tolist())
    selected_priorities = st.sidebar.multiselect("Priority", options=all_priorities, default=all_priorities)
    if selected_priorities:
        df_filtered = df_filtered[df_filtered['Priority'].isin(selected_priorities)]

# AI Handled Filter
if 'AI_Handled' in df_filtered.columns:
    ai_options = ['All', 'Yes', 'No']
    selected_ai = st.sidebar.selectbox("AI Autonomous Resolution", ai_options, index=0)
    if selected_ai != 'All':
        df_filtered = df_filtered[df_filtered['AI_Handled'] == selected_ai]


# ==========================================
# 4. MAIN DASHBOARD HEADER
# ==========================================
st.markdown("""
<div class="header-box">
    <div class="header-title">🤖 AI Customer Support Analytics</div>
    <div class="header-subtitle">Performance KPIs, Ticket Metrics, CSAT Ratings & AI Resolution Intelligence</div>
</div>
""", unsafe_allow_html=True)


# ==========================================
# 5. TOP KPI METRICS ROW
# ==========================================
col1, col2, col3, col4, col5 = st.columns(5)

total_tickets = len(df_filtered)

if 'Status' in df_filtered.columns:
    resolved_count = len(df_filtered[df_filtered['Status'] == 'Resolved'])
    res_rate = round((resolved_count / total_tickets * 100), 1) if total_tickets > 0 else 0
else:
    res_rate = 0

if 'Resolution_Time_Hrs' in df_filtered.columns:
    avg_res_time = round(df_filtered['Resolution_Time_Hrs'].mean(), 1)
else:
    avg_res_time = 0

if 'CSAT_Rating' in df_filtered.columns:
    avg_csat = round(df_filtered['CSAT_Rating'].mean(), 2)
else:
    avg_csat = 0

if 'AI_Handled' in df_filtered.columns:
    ai_count = len(df_filtered[df_filtered['AI_Handled'] == 'Yes'])
    ai_rate = round((ai_count / total_tickets * 100), 1) if total_tickets > 0 else 0
else:
    ai_rate = 0

with col1:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Total Tickets</div>
        <div class="metric-value">{total_tickets:,}</div>
        <div class="metric-delta delta-positive">↑ Active Volume</div>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Resolution Rate</div>
        <div class="metric-value">{res_rate}%</div>
        <div class="metric-delta delta-positive">Target: >85%</div>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Avg Resolution Time</div>
        <div class="metric-value">{avg_res_time}h</div>
        <div class="metric-delta delta-positive">⚡ High Efficiency</div>
    </div>
    """, unsafe_allow_html=True)

with col4:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Avg CSAT Rating</div>
        <div class="metric-value">{avg_csat} / 5</div>
        <div class="metric-delta delta-positive">⭐ Customer Satisfaction</div>
    </div>
    """, unsafe_allow_html=True)

with col5:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">AI Resolution %</div>
        <div class="metric-value">{ai_rate}%</div>
        <div class="metric-delta delta-positive">🤖 Autonomous Rate</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)


# ==========================================
# 6. TABS CONTENT & PLOTLY CHARTS
# ==========================================
tab_overview, tab_performance, tab_csat, tab_ai, tab_raw = st.tabs([
    "📊 Executive Overview",
    "⏱️ Performance & SLA",
    "⭐ CSAT & Sentiment",
    "🤖 AI vs Human Ops",
    "📋 Data Explorer & Export"
])

# ------------------------------------------
# TAB 1: EXECUTIVE OVERVIEW
# ------------------------------------------
with tab_overview:
    c1, c2 = st.columns([6, 4])
    
    with c1:
        st.subheader("📈 Ticket Volume Trend Over Time")
        if 'Created_Date' in df_filtered.columns:
            trend_df = df_filtered.groupby(['Created_Date', 'Status']).size().reset_index(name='Counts')
            fig_trend = px.area(
                trend_df,
                x='Created_Date',
                y='Counts',
                color='Status',
                color_discrete_map={'Resolved': '#10b981', 'In Progress': '#f59e0b', 'Escalated': '#ef4444'},
                template='plotly_dark'
            )
            fig_trend.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                margin=dict(l=20, r=20, t=30, b=20),
                height=350
            )
            st.plotly_chart(fig_trend, use_container_width=True)
        else:
            st.info("Created_Date field required for trend chart.")

    with c2:
        st.subheader("🍩 Category Share")
        if 'Category' in df_filtered.columns:
            cat_df = df_filtered['Category'].value_counts().reset_index()
            cat_df.columns = ['Category', 'Count']
            fig_cat = px.pie(
                cat_df,
                values='Count',
                names='Category',
                hole=0.55,
                color_discrete_sequence=px.colors.qualitative.Pastel,
                template='plotly_dark'
            )
            fig_cat.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                margin=dict(l=20, r=20, t=30, b=20),
                height=350
            )
            st.plotly_chart(fig_cat, use_container_width=True)

    st.markdown("---")
    
    # Priority & Channel Distribution
    p1, p2 = st.columns(2)
    with p1:
        st.subheader("🔥 Tickets by Priority")
        if 'Priority' in df_filtered.columns:
            prio_df = df_filtered['Priority'].value_counts().reset_index()
            prio_df.columns = ['Priority', 'Count']
            fig_prio = px.bar(
                prio_df,
                x='Priority',
                y='Count',
                color='Priority',
                color_discrete_map={'Low': '#3b82f6', 'Medium': '#f59e0b', 'High': '#f97316', 'Urgent': '#ef4444'},
                template='plotly_dark'
            )
            fig_prio.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', height=300)
            st.plotly_chart(fig_prio, use_container_width=True)

    with p2:
        st.subheader("🌐 Support Channel Breakdown")
        if 'Channel' in df_filtered.columns:
            chan_df = df_filtered['Channel'].value_counts().reset_index()
            chan_df.columns = ['Channel', 'Count']
            fig_chan = px.bar(
                chan_df,
                x='Count',
                y='Channel',
                orientation='h',
                color='Channel',
                color_discrete_sequence=px.colors.sequential.Darkmint,
                template='plotly_dark'
            )
            fig_chan.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', height=300)
            st.plotly_chart(fig_chan, use_container_width=True)


# ------------------------------------------
# TAB 2: PERFORMANCE & SLA
# ------------------------------------------
with tab_performance:
    st.subheader("⏱️ Average Resolution Time by Category & Priority")
    if 'Resolution_Time_Hrs' in df_filtered.columns and 'Category' in df_filtered.columns:
        res_df = df_filtered.dropna(subset=['Resolution_Time_Hrs']).groupby(['Category', 'Priority'])['Resolution_Time_Hrs'].mean().reset_index()
        fig_res = px.bar(
            res_df,
            x='Category',
            y='Resolution_Time_Hrs',
            color='Priority',
            barmode='group',
            labels={'Resolution_Time_Hrs': 'Avg Time (Hours)'},
            template='plotly_dark'
        )
        fig_res.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', height=380)
        st.plotly_chart(fig_res, use_container_width=True)
    
    st.markdown("---")
    
    col_ag1, col_ag2 = st.columns(2)
    with col_ag1:
        st.subheader("👨‍💼 Support Agent Volume & Handling")
        if 'Assigned_Agent' in df_filtered.columns:
            agent_df = df_filtered['Assigned_Agent'].value_counts().reset_index()
            agent_df.columns = ['Agent', 'Tickets Handled']
            fig_agent = px.bar(
                agent_df,
                x='Tickets Handled',
                y='Agent',
                orientation='h',
                color='Agent',
                template='plotly_dark'
            )
            fig_agent.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', height=320)
            st.plotly_chart(fig_agent, use_container_width=True)

    with col_ag2:
        st.subheader("🎯 Resolution Status Matrix")
        if 'Status' in df_filtered.columns and 'Category' in df_filtered.columns:
            matrix_df = pd.crosstab(df_filtered['Category'], df_filtered['Status'])
            fig_heat = px.imshow(
                matrix_df,
                text_auto=True,
                color_continuous_scale='Blues',
                template='plotly_dark'
            )
            fig_heat.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', height=320)
            st.plotly_chart(fig_heat, use_container_width=True)


# ------------------------------------------
# TAB 3: CSAT & SENTIMENT
# ------------------------------------------
with tab_csat:
    c_s1, c_s2 = st.columns(2)
    
    with c_s1:
        st.subheader("😃 Customer Sentiment Breakdown")
        if 'Customer_Sentiment' in df_filtered.columns:
            sent_df = df_filtered['Customer_Sentiment'].value_counts().reset_index()
            sent_df.columns = ['Sentiment', 'Count']
            fig_sent = px.pie(
                sent_df,
                values='Count',
                names='Sentiment',
                color='Sentiment',
                color_discrete_map={'Positive': '#10b981', 'Neutral': '#f59e0b', 'Negative': '#ef4444'},
                template='plotly_dark'
            )
            fig_sent.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', height=350)
            st.plotly_chart(fig_sent, use_container_width=True)

    with c_s2:
        st.subheader("⭐ CSAT Rating Distribution")
        if 'CSAT_Rating' in df_filtered.columns:
            csat_counts = df_filtered['CSAT_Rating'].value_counts().sort_index().reset_index()
            csat_counts.columns = ['Rating', 'Count']
            csat_counts['Rating_Label'] = csat_counts['Rating'].astype(str) + " Stars ⭐"
            fig_csat = px.bar(
                csat_counts,
                x='Rating_Label',
                y='Count',
                color='Rating_Label',
                color_discrete_sequence=px.colors.sequential.Viridis,
                template='plotly_dark'
            )
            fig_csat.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', height=350)
            st.plotly_chart(fig_csat, use_container_width=True)

    st.markdown("---")
    st.subheader("🔍 CSAT vs Customer Sentiment Score Map")
    if 'CSAT_Rating' in df_filtered.columns and 'Customer_Sentiment' in df_filtered.columns:
        scat_df = df_filtered.groupby(['CSAT_Rating', 'Customer_Sentiment', 'Category']).size().reset_index(name='Ticket_Volume')
        fig_scat = px.scatter(
            scat_df,
            x='CSAT_Rating',
            y='Category',
            size='Ticket_Volume',
            color='Customer_Sentiment',
            color_discrete_map={'Positive': '#10b981', 'Neutral': '#f59e0b', 'Negative': '#ef4444'},
            template='plotly_dark'
        )
        fig_scat.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', height=350)
        st.plotly_chart(fig_scat, use_container_width=True)


# ------------------------------------------
# TAB 4: AI VS HUMAN OPERATIONS
# ------------------------------------------
with tab_ai:
    ai_col1, ai_col2 = st.columns(2)
    
    with ai_col1:
        st.subheader("🤖 AI Bot Resolution vs Human Agent Handoff")
        if 'AI_Handled' in df_filtered.columns:
            ai_df = df_filtered['AI_Handled'].value_counts().reset_index()
            ai_df.columns = ['AI Handled', 'Count']
            fig_ai = px.pie(
                ai_df,
                values='Count',
                names='AI Handled',
                color='AI Handled',
                color_discrete_map={'Yes': '#6366f1', 'No': '#ec4899'},
                hole=0.4,
                template='plotly_dark'
            )
            fig_ai.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', height=350)
            st.plotly_chart(fig_ai, use_container_width=True)

    with ai_col2:
        st.subheader("⚡ Avg Resolution Time: AI vs Human (Hours)")
        if 'AI_Handled' in df_filtered.columns and 'Resolution_Time_Hrs' in df_filtered.columns:
            ai_res_df = df_filtered.dropna(subset=['Resolution_Time_Hrs']).groupby('AI_Handled')['Resolution_Time_Hrs'].mean().reset_index()
            fig_ai_res = px.bar(
                ai_res_df,
                x='AI_Handled',
                y='Resolution_Time_Hrs',
                color='AI_Handled',
                color_discrete_map={'Yes': '#6366f1', 'No': '#ec4899'},
                labels={'Resolution_Time_Hrs': 'Avg Resolution (Hours)', 'AI_Handled': 'Autonomous AI Resolution'},
                template='plotly_dark'
            )
            fig_ai_res.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', height=350)
            st.plotly_chart(fig_ai_res, use_container_width=True)


# ------------------------------------------
# TAB 5: RAW DATA EXPLORER & EXPORT
# ------------------------------------------
with tab_raw:
    st.subheader("📋 Support Ticket Master Log")
    
    # Search input
    search_term = st.text_input("🔍 Search tickets by keyword (ID, Category, Agent, Status)...", "")
    
    df_display = df_filtered.copy()
    if search_term:
        mask = df_display.apply(lambda row: row.astype(str).str.contains(search_term, case=False).any(), axis=1)
        df_display = df_display[mask]
        
    st.dataframe(
        df_display,
        use_container_width=True,
        hide_index=True
    )
    
    st.markdown("---")
    st.subheader("📥 Export Processed Data")
    
    exp_col1, exp_col2 = st.columns(2)
    
    # CSV Export
    with exp_col1:
        csv_buffer = df_display.to_csv(index=False).encode('utf-8')
        st.download_button(
            label="📄 Download Processed Data as CSV",
            data=csv_buffer,
            file_name=f"customer_support_analytics_{datetime.now().strftime('%Y%m%d')}.csv",
            mime="text/csv"
        )
        
    # Excel Export via OpenPyXL
    with exp_col2:
        excel_buffer = io.BytesIO()
        with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
            df_display.to_excel(writer, index=False, sheet_name='Support Analytics')
        excel_data = excel_buffer.getvalue()
        
        st.download_button(
            label="📊 Download Processed Data as Excel (.xlsx)",
            data=excel_data,
            file_name=f"customer_support_analytics_{datetime.now().strftime('%Y%m%d')}.xlsx",
            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

# Footer
st.markdown("---")
st.markdown("<p style='text-align: center; color: #64748b;'>AI Customer Support Analytics Dashboard • Streamlit + Pandas + Plotly + OpenPyXL</p>", unsafe_allow_html=True)
