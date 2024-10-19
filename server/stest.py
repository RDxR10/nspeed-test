from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import subprocess

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/speedtest")
async def run_speedtest():
    try:
        result = subprocess.run(["speedtest-cli", "--simple"], capture_output=True, text=True)
        output = result.stdout.strip().split("\n")
        
        ping = float(output[0].split(":")[1].strip().split(" ")[0])
        download = float(output[1].split(":")[1].strip().split(" ")[0])
        upload = float(output[2].split(":")[1].strip().split(" ")[0])
        
        return {"ping": ping, "download": download, "upload": upload}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
