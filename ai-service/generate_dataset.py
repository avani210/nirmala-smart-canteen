import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

random.seed(42)
np.random.seed(42)

items = ['Masala Tea', 'Filter Coffee', 'Veg Puff', 'Mango Juice']
base_demand = {'Masala Tea': 40, 'Filter Coffee': 30, 'Veg Puff': 25, 'Mango Juice': 20}

weather_options = ['sunny', 'rainy', 'cloudy', 'cold']

start_date = datetime(2025, 1, 1)
num_days = 180

rows = []

for day_offset in range(num_days):
    date = start_date + timedelta(days=day_offset)
    day_of_week = date.strftime('%A')
    is_weekend = 1 if day_of_week in ['Saturday', 'Sunday'] else 0

    weather = random.choices(
        weather_options,
        weights=[0.45, 0.20, 0.25, 0.10]
    )[0]

    for item in items:
        demand = base_demand[item]

        # Weather effects, matching your real-world example
        if weather == 'rainy':
            if item == 'Masala Tea':
                demand *= 1.5
            elif item == 'Filter Coffee':
                demand *= 1.2
            elif item == 'Mango Juice':
                demand *= 0.6
        elif weather == 'cold':
            if item == 'Filter Coffee':
                demand *= 1.4
            elif item == 'Masala Tea':
                demand *= 1.3
            elif item == 'Mango Juice':
                demand *= 0.5
        elif weather == 'sunny':
            if item == 'Mango Juice':
                demand *= 1.4
            elif item == 'Masala Tea':
                demand *= 0.9

        # Weekend effect - fewer students on campus
        if is_weekend:
            demand *= 0.5

        # Small random daily noise, so it's not perfectly predictable
        demand *= random.uniform(0.85, 1.15)

        rows.append({
            'date': date.strftime('%Y-%m-%d'),
            'day_of_week': day_of_week,
            'is_weekend': is_weekend,
            'weather': weather,
            'item': item,
            'quantity_sold': round(demand)
        })

df = pd.DataFrame(rows)
df.to_csv('sales_data.csv', index=False)
print(f"Generated {len(df)} rows of data across {num_days} days.")
print(df.head(10))