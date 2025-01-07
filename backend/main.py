from fastapi import FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel
import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import HumanMessage
import fitz
import uuid

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

port = int(os.environ.get("PORT", 8000))

model = ChatGroq(
    model='mixtral-8x7b-32768',
    groq_api_key=os.environ.get("GROQ_API_KEY"),
    temperature=0.7,
    max_tokens=4096,
    top_p=0.9
)

extracted_text=""

class ChatRequest(BaseModel):
    question: str
    

class ChatResponse(BaseModel):
    answer: str

class FileResponse(BaseModel):
    text_content: str

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    global extracted_text

    if file.content_type != "application/pdf":
        return {"error": "Only PDF files are allowed"}

    try:
        doc = fitz.open(stream=await file.read(), filetype="pdf")
        text = ""
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            text += page.get_text()

            extracted_text = text

        return {"message": "File uploaded successfully, text extracted"}
    except Exception as e:
        return {"error": f"Error processing PDF: {e}"}

@app.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):

    global extracted_text

    context = ""

    if extracted_text:
            context = extracted_text
            
            prompt = f"""Use the following document content to answer the question. 
            If the question cannot be answered using the document content alone, 
            use your general knowledge but mention that the information comes from outside the document.

            Document content:
            {context}

            Question: {request.question}"""
    elif not extracted_text:
            prompt = request.question
    else:
        raise HTTPException(status_code=400, detail="No document_id provided or invalid")
    try:

        response = model.invoke([HumanMessage(content=prompt)])

        answer_content = response.content if hasattr(response, 'content') else str(response)

        # Return the AI-generated answer
        return ChatResponse(answer=answer_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing the question: {str(e)}")
