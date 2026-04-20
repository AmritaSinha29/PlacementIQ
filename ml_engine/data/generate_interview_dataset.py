import pandas as pd
import numpy as np
import os

def generate_interview_data(num_samples=5000, output_path="interview_qa_dataset.csv"):
    """
    Generates a specialized dataset for training a custom Interview Evaluator Model.
    Contains variations of answers to technical questions with corresponding grades.
    """
    np.random.seed(42)
    print(f"Generating {num_samples} interview Q&A records...")
    
    questions = [
        "Explain how a hash map works.",
        "What is the difference between TCP and UDP?",
        "How do you handle concurrency in a distributed system?",
        "Explain the concept of REST APIs.",
        "What is normalization in a database?"
    ]
    
    # Good, Average, and Bad answer templates
    good_answers = [
        "It uses a hash function to compute an index into an array of buckets, allowing O(1) lookups.",
        "TCP is connection-oriented and guarantees delivery, while UDP is connectionless and faster but drops packets.",
        "I use distributed locks like Redis or ZooKeeper, and ensure database transactions are isolated.",
        "REST uses standard HTTP methods like GET and POST to interact with stateless resources.",
        "Normalization organizes tables to reduce redundancy and improve data integrity using normal forms."
    ]
    
    bad_answers = [
        "It's just an array that stores things inside it.",
        "TCP is for the internet and UDP is for games I think.",
        "I just use a boolean flag in the database to lock it.",
        "It's an API that lets you download data.",
        "It makes the database normal and easy to read."
    ]
    
    dataset = []
    
    for _ in range(num_samples):
        q_idx = np.random.randint(0, len(questions))
        q = questions[q_idx]
        
        # Decide answer quality
        quality = np.random.choice(["good", "average", "bad"], p=[0.3, 0.4, 0.3])
        
        if quality == "good":
            ans = good_answers[q_idx] + " " + np.random.choice([" This is very efficient.", " I used this in my last project.", ""])
            tech_score = np.random.normal(90, 5)
            conf_score = np.random.normal(85, 10)
        elif quality == "average":
            ans = good_answers[q_idx][:len(good_answers[q_idx])//2] + "... um, and some other things."
            tech_score = np.random.normal(60, 10)
            conf_score = np.random.normal(50, 15)
        else:
            ans = bad_answers[q_idx] + " " + np.random.choice([" I am not really sure.", " Basically that's it.", ""])
            tech_score = np.random.normal(30, 10)
            conf_score = np.random.normal(40, 15)
            
        dataset.append({
            "question": q,
            "answer": ans,
            "tech_accuracy": min(100, max(0, int(tech_score))),
            "confidence": min(100, max(0, int(conf_score)))
        })
        
    df = pd.DataFrame(dataset)
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Saved custom interview dataset to {output_path}")

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    generate_interview_data(5000, os.path.join(script_dir, "interview_qa_dataset.csv"))
