CRAFT: Cost-Adjusted Ranking via Aggregated Forest Training
==============================

DESCRIPTION
-----------
CRAFT is a web-based interactive analytics dashboard designed to showcase a novel NBA player metric: Cost-Adjusted Ranking via Aggregated Forest Training (CRAFT). The CRAFT metric uses a weighted combination of core basketball statistics — including points, assists, shooting percentages, and rebounding — adjusted by an estimated contract value using a trained random forest model.

The dashboard allows users to explore player effectiveness in a variety of interactive views:
- A zoomable scatterplot of effectiveness distribution across players
- A sortable ranked table
- Individual player radar charts
- A correlation matrix of all statistical metrics

This tool is intended for NBA fans, analysts, and front offices who want deeper insight into player value beyond traditional box score statistics.
## Technologies Used
- React + Tailwind for UI
- D3.js for visualizations
- CSV dataset sourced from Kaggle’s 2023-24 NBA player stats, contract values scraped from hoopshype.com

## Computational Analysis
A `.ipynb` file is included in this repository which runs through all of the forest-based models and computations used to generate the custom CRAFT metric from raw player statistics. This notebook provides the code behind the CRAFT scores and other scores.

INSTALLATION
------------
1. Clone the GitHub repository:
   git clone https://github.com/doddap123/nba-impact-vis.git
   cd nba-impact-vis

2. Install dependencies:
   npm install

EXECUTION
---------
To run the local development server:
   npm start

Also feel free to check it out on: https://doddap123.github.io/nba-impact-vis/

