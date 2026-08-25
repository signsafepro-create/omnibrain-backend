import os
import json
import time
import threading
import urllib.request
from datetime import datetime
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# --- REVENUE AGENTS ---
class EmpireAgent(threading.Thread):
    def __init__(self, name, task):
        super().__init__(daemon=True)
        self.agent_name = name
        self.task = task
        self.logs = []
        self.revenue = 0.0

    def run(self):
        while True:
            ts = datetime.now().strftime("%H:%M:%S")
            if self.task == "SCALP":
                work = self.simulate_market_scan()
            else:
                work = self.simulate_job_hunt()
            
            log_entry = f"[{ts}] {self.agent_name}: {work}"
            self.logs.append(log_entry)
            if len(self.logs) > 20: self.logs.pop(0)
            time.sleep(5)

    def simulate_market_scan(self):
        try:
            url = "https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT"
            with urllib.request.urlopen(url) as res:
                data = json.loads(res.read().decode())
                change = float(data['priceChangePercent'])
                if change > 1.0: self.revenue += 5.50
                return f"Scanning BTC/USDT. Volatility: {change}%. Scalp Profit: ${self.revenue:.2f}"
        except: return "Connecting to live market feeds..."

    def simulate_job_hunt(self):
        return "Scraping global boards for 'AI Architect' contracts. Found 2 leads."

# Start Agents
scalper = EmpireAgent("SCALPER_01", "SCALP")
hunter = EmpireAgent("HUNTER_01", "JOB")
scalper.start()
hunter.start()

# --- WEB INTERFACE ---
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"])

@app.get("/", response_class=HTMLResponse)
async def get_dashboard():
    return f"""
    <html>
    <head>
        <title>X-SOVEREIGN WEB4</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-[#010103] text-white p-10 font-sans">
        <h1 class="text-4xl font-bold text-orange-500 mb-2">X-SOVEREIGN WEB4</h1>
        <p class="text-white/40 uppercase text-xs tracking-widest mb-10">Universal Agent Command Center</p>
        <div class="grid grid-cols-2 gap-10">
            <div class="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 class="text-xs font-bold text-white/40 uppercase mb-4">Live Workstream</h3>
                <div id="logs" class="font-mono text-green-400 text-sm h-64 overflow-y-auto">Initializing...</div>
            </div>
            <div class="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 class="text-xs font-bold text-white/40 uppercase mb-4">Revenue Projection</h3>
                <div class="text-5xl font-bold text-green-400 mt-10">$1,000.00</div>
                <p class="text-white/30 text-xs mt-2">Targeting payout by Noon Tomorrow.</p>
            </div>
        </div>
        <script>
            async function update() {{
                const r = await fetch('/logs');
                const d = await r.json();
                document.getElementById('logs').innerHTML = d.join('<br>');
            }}
            setInterval(update, 2000);
        </script>
    </body>
    </html>
    """

@app.get("/logs")
async def get_logs():
    return scalper.logs + hunter.logs

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8888)
