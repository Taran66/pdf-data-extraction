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

frontend_url = os.getenv("FRONTEND_URL") 

origins = [
    frontend_url,  # Allow the frontend URL
]

app = FastAPI()  # Create the FastAPI app

app.add_middleware(  # Add CORS middleware
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

port = int(os.environ.get("PORT", 8000))  # Get the port from environment variable

model = ChatGroq(  # Initialize the model
    model='mixtral-8x7b-32768',
    groq_api_key=os.environ.get("GROQ_API_KEY"),
    temperature=0.7,
    max_tokens=4096,
    top_p=0.9
)

extracted_text=""  # Global variable to store extracted text

class ChatRequest(BaseModel):  # Define the request model
    question: str
    

class ChatResponse(BaseModel):  # Define the response model
    answer: str


@app.post("/upload")  # Define the upload route
async def upload_file(file: UploadFile = File(...)):  # Define the file parameter

    global extracted_text

    if file.content_type != "application/pdf":  # Check if the file is a PDF
        return {"error": "Only PDF files are allowed"}

    try:
        doc = fitz.open(stream=await file.read(), filetype="pdf")  # Open the PDF file
        text = ""
        
        for page_num in range(len(doc)):  # Iterate over the pages
            page = doc[page_num]
            text += page.get_text()  # Extract text from the page

            extracted_text = text  # Store the extracted text

        return {"message": "File uploaded successfully, text extracted"}
    except Exception as e:  # If there is an error
        return {"error": f"Error processing PDF: {e}"}

@app.post("/chat", response_model=ChatResponse)  # Define the chat route
async def chat_with_ai(request: ChatRequest):

    global extracted_text  # Access the global variable

    context = ""
 
    if extracted_text:  # If the extracted text is not empty
            context = extracted_text
            # Add the extracted text to the prompt
            prompt = f"""Use the following document content to answer the question.  
            If the question cannot be answered using the document content alone, 
            use your general knowledge but mention that the information comes from outside the document.

            Document content:
            {context}

            Question: {request.question}"""
    elif not extracted_text:  # If the extracted text is empty
            prompt = request.question
    else:
        raise HTTPException(status_code=400, detail="No document_id provided or invalid") # If the extracted text is empty
    try:

        response = model.invoke([HumanMessage(content=prompt)])  # Invoke the model

        answer_content = response.content if hasattr(response, 'content') else str(response)  # Get the answer content

        # Return the AI-generated answer
        return ChatResponse(answer=answer_content)  # Return the AI-generated answer
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing the question: {str(e)}")