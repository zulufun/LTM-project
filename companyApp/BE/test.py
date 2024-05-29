import requests
from bs4 import BeautifulSoup
import csv

city_config = {
        'ha-noi': {
            'mbbank': "https://mbbank.nganhangbank.com/chi-nhanh/ha-noi",
            'vietinbank': "https://vietinbank.nganhangbank.com/chi-nhanh/ha-noi",
            'sacombank': "https://sacombank.nganhangbank.com/chi-nhanh/ha-noi",
        },
        'da-nang': {
            'mbbank': "https://mbbank.nganhangbank.com/chi-nhanh/da-nang",
            'vietinbank': "https://vietinbank.nganhangbank.com/chi-nhanh/da-nang",
            'sacombank': "https://vietcombank.nganhangbank.com/chi-nhanh/da-nang",
        },
        # Thêm các thành phố khác nếu cần
    }

def scrape_and_export_to_csv(city, bank):
    url = city_config[city][bank]

    # Gửi yêu cầu GET đến trang App
    response = requests.get(url)

    # Kiểm tra nếu yêu cầu thành công
    if response.status_code == 200:
        # Sử dụng BeautifulSoup để phân tích cú pháp trang App
        soup = BeautifulSoup(response.text, 'html.parser')
        # Tìm đến bảng chứa thông tin các chi nhánh
        content_div = soup.find('div', class_='page-content nganhang_listing')

        # Tìm tất cả các phần tử li có class là "item"
        branch_items = content_div.find_all('li', class_='item')

        # Danh sách để lưu trữ dữ liệu chi nhánh
        data = []
        n = 0
        # Duyệt qua từng phần tử và trích xuất thông tin chi nhánh
        for item in branch_items:
            n += 1
            # Trích xuất tên chi nhánh
            branch_name = item.find('h3', class_='bank-title').text.strip()
            # Trích xuất địa chỉ chi nhánh
            address = item.find('p').text.strip()
            # Thêm thông tin chi nhánh vào danh sách
            data.append({'branch_name': branch_name, 'address': address})
            print("Chi nhánh:", n)
            print("Chi nhánh:", branch_name)
            print("Địa chỉ:", address)
            print("------")
        # Xuất dữ liệu vào file CSV
    else:
        print("Yêu cầu không thành công:", response.status_code)

def main():
    city = input("Nhập tên thành phố (Ví dụ: ha-noi, da-nang): ")
    bank = input("Nhập tên ngân hàng (Ví dụ: mbbank, vietinbank, sacombank): ")
    filename = f"{city}_{bank}_list.csv"
    scrape_and_export_to_csv(city, bank)

if __name__ == "__main__":
    main()
