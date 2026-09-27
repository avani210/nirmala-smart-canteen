from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from chatbot_data import intents

# Flatten all patterns into one list, remembering which intent each belongs to
all_patterns = []
pattern_to_tag = []

for intent in intents:
    for pattern in intent["patterns"]:
        all_patterns.append(pattern)
        pattern_to_tag.append(intent["tag"])

# Convert all example patterns into TF-IDF vectors
# TF-IDF turns text into numbers based on word importance/frequency
vectorizer = TfidfVectorizer()
pattern_vectors = vectorizer.fit_transform(all_patterns)

def get_response(user_message, threshold=0.3):
    # Convert the user's message into the same TF-IDF vector space
    user_vector = vectorizer.transform([user_message])

    # Compare the user's message against every known pattern
    similarities = cosine_similarity(user_vector, pattern_vectors)[0]

    best_match_index = similarities.argmax()
    best_score = similarities[best_match_index]

    if best_score < threshold:
        return {
            "response": "I'm not sure about that. Try asking about today's special, healthy food options, or your order status.",
            "confidence": round(float(best_score), 2),
            "matched_intent": None
        }

    matched_tag = pattern_to_tag[best_match_index]
    matched_intent = next(i for i in intents if i["tag"] == matched_tag)

    return {
        "response": matched_intent["response"],
        "confidence": round(float(best_score), 2),
        "matched_intent": matched_tag
    }