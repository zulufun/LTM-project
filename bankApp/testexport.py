import httpx
import asyncio
from bs4 import BeautifulSoup
import os
import json

bank_config = {
    'vietcombank': "https://vietcombank.nganhangbank.com",
    'agribank': "https://agribank.nganhangbank.com",
    'acb': "https://acb.nganhangbank.com",
    'bidv': "https://bidv.nganhangbank.com",
    'sacombank': "https://sacombank.nganhangbank.com",
    'vietinbank': "https://vietinbank.nganhangbank.com",
    'vib': "https://vib.nganhangbank.com",
    'mbbank' :"https://mbbank.nganhangbank.com/",
}

async def get_city_links(url):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            city_links = []
            ul_tag = soup.find('ul', class_='list-cities')
            if ul_tag:
                for a_tag in ul_tag.find_all('a'):
                    city_links.append(a_tag['href'])
            return city_links
        else:
            print(f"Không thể truy cập trang ({response.status_code})")
            return None

async def get_district_links(url):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            district_links = []
            ul_tag = soup.find('ul', class_='list-cities')
            if ul_tag:
                for a_tag in ul_tag.find_all('a'):
                    district_links.append(a_tag['href'])
            return district_links
        else:
            print(f"Không thể truy cập trang ({response.status_code})")
            return None

async def get_infor_bank(url):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = []  # Danh sách lưu trữ thông tin các chi nhánh
        if response.status_code == 200:
            # Sử dụng BeautifulSoup để phân tích cú pháp trang web
            soup = BeautifulSoup(response.text, 'html.parser')
            # Tìm phần tử chứa thông tin chi nhánh
            content_div = soup.find('div', class_='page-content')
            if content_div:
                list_items = content_div.find('ul')
                if list_items:
                    branch_items = list_items.find_all('li', class_='list-group-item')
                    # Duyệt qua từng phần tử và trích xuất thông tin chi nhánh
                    for item in branch_items:
                        branch_name = item.find('h3', class_='bank-title')
                        address = item.find('p')
                        # Kiểm tra xem thông tin có tồn tại không trước khi thêm vào danh sách
                        if branch_name and address:
                            data.append({
                                'branch_name': branch_name.text.strip(),
                                'address': address.text.strip()
                            })
                else:
                    print("Không tìm thấy danh sách chi nhánh.")
            else:
                print("Không tìm thấy nội dung trang web.")
            return data  # Trả về danh sách thông tin chi nhánh
        else:
            print(f"Không thể truy cập trang ({response.status_code})")
            return None


async def export_to_json(data, filename):
    directory = os.path.dirname(filename)
    if not os.path.exists(directory):
        os.makedirs(directory)
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

async def main():
    bank_name = input("Nhập tên ngân hàng muốn lấy thông tin: ")
    bank_url = bank_config.get(bank_name)
    if bank_url:
        print(f"Đang thu thập dữ liệu cho ngân hàng: {bank_name}")
        city_links = await get_city_links(bank_url)
        if city_links:
            for city_link in city_links:
                district_links = await get_district_links(bank_url + city_link)
                if district_links:
                    city_data = {}
                    for district_link in district_links:
                        bank_info = await get_infor_bank(bank_url + district_link)
                        if bank_info:
                            district_name = district_link.split('/')[-1]
                            city_data[district_name] = bank_info
                            print(f"Thông tin chi nhánh của {district_name} ({bank_name}):")
                            for branch in bank_info:
                                print(f"- {branch['branch_name']}: {branch['address']}")
                        else:
                            print("Không có thông tin chi nhánh.")
                    city_name = city_link.split('/')[-1]
                    filename = f"{city_name}-{bank_name}.json"
                    filepath = os.path.join(bank_name, filename)
                    await export_to_json(city_data, filepath)
                    print(f"Dữ liệu của {bank_name} ở {city_name} đã được xuất ra {filepath}")
                else:
                    print(f"Không có liên kết quận/huyện cho {city_link} của {bank_name}.")
        else:
            print(f"Không thể lấy danh sách liên kết cho {bank_name}.")
    else:
        print(f"Ngân hàng '{bank_name}' không tồn tại trong danh sách.")

asyncio.run(main())
