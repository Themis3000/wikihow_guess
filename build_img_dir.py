import requests
from bs4 import BeautifulSoup
import time
import json

REQUEST_DELAY = 2
# must set this to true in order to do category pages
DO_CATEGORYS = True
WRITE_CATEGORYS = True
DO_CATEGORY_PAGES = True
WRITE_CATEGORY_PAGES = True
RETRY_DELAY = 20
RETRY_ATTEMPTS = 4


def get_soup(url: str):
    page = requests.get(url)
    assert page.status_code == 200, "got a non ok response"
    return BeautifulSoup(page.content, 'html.parser')


def save_data_as_str(data, path):
    with open(path, 'w+') as f:
        json.dump(data, f)


if DO_CATEGORYS:
    sitemap_soup = get_soup('https://www.wikihow.com/Special:Sitemap')
    category_containers = sitemap_soup.find_all(class_='cat_list')

    category_array = []
    # get all listed categorys from site map
    for category_container in category_containers:
        for a_tag in category_container.find_all('a'):
            category_array.append({"category": a_tag.text, "link": f"https://www.wikihow.com{a_tag['href']}"})

    if WRITE_CATEGORYS:
        save_data_as_str(category_array, './category_dir.txt')

if DO_CATEGORY_PAGES:
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
                    print("Maximum retry attempts reached, saving progress and exiting")
                    save_data_as_str(category_page_array, 'category_page_dir_incomplete.txt')
                    exit()
        responsive_thumbs = category_soup.find_all(class_='responsive_thumb')
        for responsive_thumb in responsive_thumbs:
            a_tag = responsive_thumb.find('a')
            title = a_tag.find('p').text
            category_page_array.append({'link': a_tag['href'], 'title': title, 'category': category['category']})

    if WRITE_CATEGORY_PAGES:
        save_data_as_str(category_page_array, 'category_page_dir.txt')
