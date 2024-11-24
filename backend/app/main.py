from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, boards, lists, tasks

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(boards.router, prefix="/boards", tags=["boards"])
app.include_router(lists.router, prefix="/lists", tags=["lists"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])

@app.get("/")
async def root():
    return {"message": "Welcome to the Brello API"}
