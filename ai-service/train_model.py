import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import OneHotEncoder
import joblib

# Load the dataset we generated
df = pd.read_csv('sales_data.csv')

# Convert categorical columns (weather, item, day_of_week) into numbers
# using one-hot encoding - each category becomes its own 0/1 column
encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
categorical_cols = ['day_of_week', 'weather', 'item']
encoded = encoder.fit_transform(df[categorical_cols])
encoded_df = pd.DataFrame(encoded, columns=encoder.get_feature_names_out(categorical_cols))

# Combine encoded columns with the numeric ones (is_weekend)
X = pd.concat([df[['is_weekend']].reset_index(drop=True), encoded_df], axis=1)
y = df['quantity_sold']

# Split into training data (80%) and testing data (20%)
# Testing data is held back, never seen during training - it proves the model
# can predict demand it hasn't memorized, not just recall the training set
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a Random Forest Regressor - handles non-linear patterns well
# (e.g. rain boosts tea but lowers juice - not a simple straight-line relationship)
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate on the held-back test data
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print(f"Mean Absolute Error: {mae:.2f} units")
print(f"R² Score: {r2:.3f}")

# Save the trained model and encoder, so we can use them later
# without retraining every time
joblib.dump(model, 'demand_model.pkl')
joblib.dump(encoder, 'encoder.pkl')
print("Model and encoder saved.")