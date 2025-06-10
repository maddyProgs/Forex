import pandas as pd
import requests
from bs4 import BeautifulSoup
from datetime import datetime

def fetch_forex_factory_data():
    url = "https://www.forexfactory.com/calendar"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        data = []
        calendar = soup.find('table', {'class': 'calendar__table'})
        
        for row in calendar.find_all('tr', {'class': 'calendar__row'}):
            if 'calendar__row--header' in row.get('class', []):
                continue
                
            impact = row.find('td', {'class': 'impact'})
            if not impact:
                continue
                
            impact_level = impact.find('span')['class'][-1].split('--')[-1]
            if impact_level not in ['high', 'medium']:
                continue
                
            currency_elem = row.find('td', {'class': 'currency'})
            if not currency_elem:
                continue
                
            currency = currency_elem.text.strip()
            if currency not in ['EUR', 'USD']:
                continue
                
            event_elem = row.find('td', {'class': 'event'})
            if not event_elem:
                continue
                
            event = event_elem.text.strip()
            time = row.find('td', {'class': 'time'}).text.strip()
            forecast = row.find('td', {'class': 'forecast'}).text.strip() if row.find('td', {'class': 'forecast'}) else ''
            previous = row.find('td', {'class': 'previous'}).text.strip() if row.find('td', {'class': 'previous'}) else ''
            
            date_row = row.find_previous('tr', {'class': 'calendar__row--day'})
            date = date_row.find('td', {'class': 'date'}).text.strip() if date_row else ''
            
            data.append({
                'Currency': currency,
                'Event': event,
                'Date': date,
                'Time': time,
                'Previous': previous,
                'Forecast': forecast,
                'Impact': impact_level.capitalize()
            })
            
        return data
    
    except Exception as e:
        print(f"Error fetching data from Forex Factory: {e}")
        return []

def update_economic_data():
    # Read existing CSV file
    try:
        df = pd.read_csv(r"C:\Users\LENOVO\Desktop\market_data - Economic Data.csv", skiprows=1)
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        return
    
    # Get fresh data from Forex Factory
    fresh_data = fetch_forex_factory_data()
    if not fresh_data:
        print("No new data fetched from Forex Factory")
        return
    
    # Convert to DataFrame
    fresh_df = pd.DataFrame(fresh_data)
    
    # Update existing data where events match
    for index, row in df.iterrows():
        if pd.isna(row['Currency']) or pd.isna(row['Event']):
            continue
            
        # Find matching event in fresh data
        match = fresh_df[(fresh_df['Currency'] == row['Currency']) & 
                        (fresh_df['Event'].str.contains(row['Event'], case=False, regex=False))]
        
        if not match.empty:
            # Update the row with fresh data
            df.at[index, 'Date'] = match.iloc[0]['Date']
            df.at[index, 'Time'] = match.iloc[0]['Time']
            df.at[index, 'Previous'] = match.iloc[0]['Previous']
            df.at[index, 'Forecast'] = match.iloc[0]['Forecast']
            df.at[index, 'Impact'] = match.iloc[0]['Impact']
    
    # Save back to CSV
    try:
        # Recreate the original structure with empty first row
        header = pd.DataFrame([[''] * len(df.columns)], columns=df.columns)
        final_df = pd.concat([header, df], ignore_index=True)
        final_df.to_csv('market_data - Economic Data.csv', index=False)
        print("CSV file updated successfully")
    except Exception as e:
        print(f"Error saving CSV file: {e}")

if __name__ == "__main__":
    update_economic_data()