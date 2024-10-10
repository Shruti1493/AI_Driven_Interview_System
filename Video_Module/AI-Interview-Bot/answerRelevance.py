from sentence_transformers import SentenceTransformer, util

rag_answer = "Inheritance allows one class to inherit attributes and methods from another."
candidate = "Inheritance is having multiple forms of the same method in a class."

model = SentenceTransformer('all-MiniLM-L6-v2')

embedding1 = model.encode(rag_answer, convert_to_tensor=True)
embedding2 = model.encode(candidate, convert_to_tensor=True)

cosine_sim = util.cos_sim(embedding1, embedding2)

print(f"Cosine Similarity: {cosine_sim.item():.4f}")
