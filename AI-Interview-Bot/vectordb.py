from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.huggingface import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma

pdf_loader = PyPDFLoader("data/basics.pdf")
pages = pdf_loader.load_and_split()



text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
context = "\n\n".join(str(p.page_content) for p in pages)
texts = text_splitter.split_text(context)

embed_model = HuggingFaceEmbeddings(model_name = "sentence-transformers/paraphrase-MiniLM-L6-v2")
vector_store = Chroma.from_texts(texts, embedding = embed_model, persist_directory = "db")
vector_store.persist()