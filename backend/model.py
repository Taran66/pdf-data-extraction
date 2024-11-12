from pydantic import BaseModel
from typing import Optional

class Note(BaseModel):
    id: Optional[int]
    title: str
    content: str

class Document(BaseModel):
    id: Optional[int]
    filename: str
    upload_date: str  # You can use datetime if needed