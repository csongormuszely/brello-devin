from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Welcome to the Brello API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# TODO: Add more endpoints for Brello functionality

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
