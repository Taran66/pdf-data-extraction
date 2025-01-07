# PDF Chat Application

A FastAPI-based application that enables users to upload PDF documents and interact with them using AI-powered chat functionality. The application uses the Groq API for natural language processing and provides a RESTful API interface.

## Features

- PDF document upload and text extraction
- AI-powered chat interface using Groq's Mixtral-8x7b model
- CORS support for frontend integration
- Environment-based configuration
- Error handling and validation

## Prerequisites

- Python 3.7+
- Virtual environment (recommended)
- Groq API key

## Installation

1. Clone the repository and create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate
```

2. Install required dependencies:

```bash
pip install fastapi uvicorn python-multipart pydantic python-dotenv langchain-groq PyMuPDF
```

3. Create a `.env` file in the project root and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=8000  # Optional, defaults to 8000
```

## Running the Application

Start the server using uvicorn:

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

### Upload PDF Document

```
POST /upload
```

**Request:**
- Content-Type: multipart/form-data
- Body: PDF file

**Response:**
```json
{
    "message": "File uploaded successfully, text extracted"
}
```

### Chat with Document

```
POST /chat
```

**Request:**
```json
{
    "question": "What is the main topic of the document?"
}
```

**Response:**
```json
{
    "answer": "AI-generated response based on document content"
}
```

## Application Architecture

### Components

1. **FastAPI Application (`app`)**
   - Handles HTTP requests and routing
   - Implements CORS middleware for frontend integration
   - Manages file uploads and chat endpoints

2. **PDF Processing**
   - Uses PyMuPDF (fitz) for PDF text extraction
   - Stores extracted text in memory for chat context

3. **AI Chat Integration**
   - Utilizes Groq's Mixtral-8x7b model via langchain
   - Supports contextual responses based on uploaded documents
   - Falls back to general knowledge when no document is provided

### Data Models

1. **ChatRequest**
   - Properties:
     - question: str (required)

2. **ChatResponse**
   - Properties:
     - answer: str

3. **FileResponse**
   - Properties:
     - text_content: str

## Error Handling

The application implements error handling for:
- Invalid file types (non-PDF)
- PDF processing errors
- Chat API errors
- Missing or invalid parameters

## Security Considerations

1. CORS is configured to allow only specific origins (currently localhost:5173)
2. API key is stored in environment variables
3. File type validation for uploads
4. Error messages are sanitized for production use

## Limitations

- Single document context (new uploads replace previous content)
- In-memory storage (no persistence)
- Limited to PDF file format
- Maximum token limit of 4096 for AI responses

## Frontend Integration

To integrate with a frontend application:

1. Ensure the frontend origin is added to the `origins` list in CORS configuration
2. Use multipart/form-data for file uploads
3. Send JSON for chat requests
4. Handle responses appropriately based on the API documentation

## Future Improvements

- Document persistence using a database
- Multiple document support
- Streaming responses for large documents
- User authentication and authorization
- Rate limiting
- Additional file format support