from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def citeste_root():
    return {"status": "ok", "message": "Backend-ul LostNFound functioneaza!"}