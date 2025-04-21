import pandas as pd
import json

# Load JSON
with open("player_data.json") as f:
    players = json.load(f)

# Convert to DataFrame
df = pd.DataFrame(players)

# Rank by contractValue (ascending: lower = better)
df['contractRank'] = df['contractValue'].rank(method='min').astype(int)

# Replace original contractValue with rank
df['contractValue'] = df['contractRank']
df = df.drop(columns=['contractRank'])

# Export back to JSON
with open("player_data_ranked.json", "w") as f:
    json.dump(df.to_dict(orient='records'), f, indent=2)
