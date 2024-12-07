 


from langchain import hub
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_huggingface import HuggingFaceEndpoint, ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from fastapi import FastAPI
import uvicorn
from langserve import add_routes
from pydantic import BaseModel
import os
import requests

# from huggingface_hub import login
# login()
# Define the input query model to handle topic, file (resume), and skills with their levels
class QueryInput(BaseModel):
    topic: str
    file: str
    skills: dict  # Dictionary to store skills with levels, e.g., {"Python": "Intermediate"}

# Function to process the PDF file
def ProccessPdf(filePath):
    pdf_loader = PyPDFLoader(filePath)
    pages = pdf_loader.load_and_split()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    context = "\n\n".join(str(p.page_content) for p in pages)
    texts = text_splitter.split_text(context)

    return texts

# Function to initialize the embedding model
def embedModel():
    embed_model = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-MiniLM-L6-v2")
    return embed_model

# Function to create a vector store using the text and embedding model
def VectorStore(texts, embed_model):
    vector_store = Chroma.from_texts(texts, embedding=embed_model)
    return vector_store

# Define the prompt template to include skills and resume
def Prompt():
    custom_prompt = PromptTemplate.from_template(
        """
    You are a seasoned hiring manager with over 15 years of experience in conducting interviews across tech industries. You have a keen eye for recognizing talent and understanding the nuances of candidate projects and skills. Your goal is to assess candidates thoroughly to ensure the best fit for the organization.
    
    Your task is to generate interview questions for a candidate based on their resume and specified skills. Here are the details you need to consider for creating relevant questions:

    The resume of the candidate: 
    <resume>
        {context}
    </resume>   

    The skills for which you need to generate questions (including their levels, such as "Intermediate", "Low", "High"):
    <skills>
        {input}
    </skills>

    Keep in mind the importance of tailoring the questions to elicit detailed responses regarding the candidate's experience, problem-solving abilities, and contribution to their projects. Focus on ensuring the questions promote a deeper discussion that can help assess the technical skills.

    Here are the few interview questions:

    Question 1:
    Question 2:
    Question 3:
    Question 4:
    Question 5:
    """
    )
    return custom_prompt

# Function to initialize the LLM model
def LLMModel(custom_prompt, vector_store):
    llm = HuggingFaceEndpoint(repo_id="mistralai/Mistral-7B-Instruct-v0.3")
    chat = ChatHuggingFace(llm=llm, verbose=True)

    combine_docs_chain = create_stuff_documents_chain(llm, custom_prompt)
    rag_chain = create_retrieval_chain(vector_store.as_retriever(search_kwargs={"k": 5}), combine_docs_chain)

    return rag_chain

# Function to generate interview questions based on the resume and skills
def generateQuestions(input: QueryInput):
    query = {"input": input.topic, "skills": input.skills}  # Include skills with the query
    print("Skills are  ", query["skills"])
    filePath = input.file

    print("File path is ", filePath)

    texts = ProccessPdf(filePath)
    embed_model = embedModel()
    vector_store = VectorStore(texts, embed_model)
    custom_prompt = Prompt()  # Include skills in the prompt
    rag_chain = LLMModel(custom_prompt, vector_store)

    result = rag_chain.invoke(query)
    print("Generated Questions:")
    print("Generated Questions:", result['answer'])
    return {"answer": result['answer']}


if __name__ == "__main__":
    input_data = QueryInput(
        topic="Python",
        file="C:/Users/91937/Desktop/Major_Project_MONGODB/AI_Interview_System/Interview_channels/Shruti Kedari SDE.pdf",  
        skills={
            "Python": "Intermediate",
            "Django": "High",
            "JavaScript": "Low"
        }
    )

    # Generate questions based on the input data
    ques = generateQuestions(input_data)
    print(ques)


