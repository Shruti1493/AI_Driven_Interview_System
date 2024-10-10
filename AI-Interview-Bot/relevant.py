from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma


embed_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vector_store = Chroma(persist_directory="db", embedding_function=embed_model)


query = "Explain the types of data structures in Python." 
results = vector_store.similarity_search(query, k=3) 

for i, result in enumerate(results):
    print(f"Result {i+1}:")
    print(result.page_content)
    print("\n" + "="*50 + "\n")
