"""
AI Customer Support Chatbot — Streamlit Entry Point
====================================================
This file is intentionally minimal. The actual chatbot application lives in
streamlit_app.py. Run with:

    streamlit run streamlit_app.py

Streamlit Community Cloud entry point: streamlit_app.py
"""
import subprocess, sys

# Safety guard: if someone runs this directly, redirect them to the correct file.
if __name__ == "__main__":
    import subprocess, sys
    subprocess.run([sys.executable, "-m", "streamlit", "run", "streamlit_app.py"] + sys.argv[1:])
