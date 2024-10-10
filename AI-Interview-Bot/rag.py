from langchain_huggingface import HuggingFaceEndpoint,ChatHuggingFace
from langchain_core.prompts import PromptTemplate
from fastapi import FastAPI
import uvicorn
from langserve import add_routes
from langchain.chains import RetrievalQA

# from huggingface_hub import login
# login()
llm = HuggingFaceEndpoint(
    repo_id="microsoft/Phi-3-mini-4k-instruct"
)

chat = ChatHuggingFace(llm=llm, verbose=True)

# messages = [
#     ("system", "You are a helpful translator. Translate the user sentence to French."),
#     ("human", "I love programming."),
# ]
# app = FastAPI(
#     title="RAG",
#     description="A simple API for RAG",
#     version="0.1",
# )
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage

prompt_template = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant"),
    MessagesPlaceholder("msgs")
])

template = """Imagine you are an interviewer for python role. Use only the following pieces of context to ask the question at the end. If it falls out of the context simply say so, don't try to make up questions on your own.
{context}
Question: {question}
Question: """
QA_CHAIN_PROMPT = PromptTemplate.from_template(template)# Run chain
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    return_source_documents=True,
    chain_type_kwargs={"prompt": QA_CHAIN_PROMPT, "verbose": True}, 
)

# prompt_template.invoke({"msgs": [HumanMessage(content="hi!")]})
prompt = "What is python?"
result = chat.invoke(prompt, chain = qa_chain)

print(result.content)

# add_routes(
#   app,
#   prompt|chat,
#   path="/rag",
# )


# if __name__ == "__main__":
#     uvicorn.run(app, host="localhost", port=8000)