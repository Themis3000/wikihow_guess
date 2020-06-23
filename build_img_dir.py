import requests
from bs4 import BeautifulSoup
import time
import json

# delay between requests, in seconds
REQUEST_DELAY = 2
# Do scraping on sitemap page listing site categorys
DO_CATEGORYS = True
# Write scraped data to text file for later use (json format)
WRITE_CATEGORYS = True
# Do scraping on collected category listing pages
DO_CATEGORY_PAGES = True
# Write scraped data to text file for later use (json format)
WRITE_CATEGORY_PAGES = True
# Do scraping on collected article pages, also writes to text file for later use (json format)
DO_PAGES = True
# delay between failed request retrys
RETRY_DELAY = 20
# amount of attempts to make before giving up
RETRY_ATTEMPTS = 4


def get_soup(url: str):
    page = requests.get(url)
    assert page.status_code == 200, f"got a non ok response ({page.status_code})"
    return BeautifulSoup(page.content, 'html.parser')


def save_data(data, path):
    with open(path, 'w+') as f:
        json.dump(data, f)


def load_data(path):
    with open(path, 'r') as f:
        return json.load(f)


if DO_CATEGORYS:
    sitemap_soup = get_soup('https://www.wikihow.com/Special:Sitemap')
    category_containers = sitemap_soup.find_all(class_='cat_list')

    category_array = []
    # get all listed categorys from site map
    for category_container in category_containers:
        for a_tag in category_container.find_all('a'):
            category_array.append({"category": a_tag.text, "link": f"https://www.wikihow.com{a_tag['href']}"})

    if WRITE_CATEGORYS:
        save_data(category_array, './category_dir.txt')

if DO_CATEGORY_PAGES:
    if 'category_array' not in locals():
        category_array = load_data('./category_dir.txt')

    category_page_array = []
    # request all category pages and get article links listed
    for i, category in enumerate(category_array):
        time.sleep(REQUEST_DELAY)
        print(f'requesting {i+1}/{len(category_array)}')
        for retry in range(RETRY_ATTEMPTS):
            try:
                category_soup = get_soup(category['link'])
                print('Success')
                break
            except:
                if retry+1 >= RETRY_ATTEMPTS:
                    print(f"Request failed, retrying in {RETRY_DELAY} (attempt #{retry+1}/{RETRY_ATTEMPTS})")
                    time.sleep(RETRY_DELAY)
                else:
                    print("Maximum retry attempts reached, exiting...")
                    if WRITE_CATEGORY_PAGES:
                        save_data(category_page_array, 'category_page_dir_incomplete.txt')
                    exit()
        responsive_thumbs = category_soup.find_all(class_='responsive_thumb')
        for responsive_thumb in responsive_thumbs:
            a_tag = responsive_thumb.find('a')
            title = a_tag.find('p').text
            category_page_array.append({'link': a_tag['href'], 'title': title, 'category': category['category']})

    if WRITE_CATEGORY_PAGES:
        save_data(category_page_array, 'category_page_dir.txt')

if DO_PAGES:
