
from fastapi import FastAPI, HTTPException, Query, Body
from bs4 import BeautifulSoup
import httpx
import asyncio
import os
import json
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel

app = FastAPI()

# Kết nối tới MongoDB
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.bankinfor  # Tên của database

bank_config = {
    'vietcombank': "https://vietcombank.nganhangbank.com",
    'agribank': "https://agribank.nganhangbank.com",
    'acb': "https://acb.nganhangbank.com",
    'bidv': "https://bidv.nganhangbank.com",
    'sacombank': "https://sacombank.nganhangbank.com",
    'vietinbank': "https://vietinbank.nganhangbank.com",
    'vib': "https://vib.nganhangbank.com",
    'mbbank': "https://mbbank.nganhangbank.com/",
}

class BankData(BaseModel):
    data: dict



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
            raise HTTPException(status_code=response.status_code, detail=f"Không thể truy cập trang ({response.status_code})")

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
            raise HTTPException(status_code=response.status_code, detail=f"Không thể truy cập trang ({response.status_code})")

async def get_infor_bank(url):
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        data = []  # Danh sách lưu trữ thông tin các chi nhánh
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, 'html.parser')
            content_div = soup.find('div', class_='page-content')
            if content_div:
                list_items = content_div.find('ul')
                if list_items:
                    branch_items = list_items.find_all('li', class_='list-group-item')
                    for item in branch_items:
                        branch_name = item.find('h3', class_='bank-title')
                        address = item.find('p')
                        if branch_name and address:
                            data.append({
                                'branch_name': branch_name.text.strip(),
                                'address': address.text.strip()
                            })
                else:
                    raise HTTPException(status_code=404, detail="Không tìm thấy danh sách chi nhánh.")
            else:
                raise HTTPException(status_code=404, detail="Không tìm thấy nội dung trang web.")
            return data
        else:
            raise HTTPException(status_code=response.status_code, detail=f"Không thể truy cập trang ({response.status_code})")
async def get_bank_data(bank_name: str):
    bank_name_lower = bank_name.lower()
    if bank_name_lower in bank_config:
        city_links = await get_city_links(bank_config.get(bank_name_lower))
        if city_links:
            bank_branches = {}
            for city_link in city_links:
                district_links = await get_district_links(bank_config[bank_name_lower] + city_link)
                if district_links:
                    district_branches = {}
                    for district_link in district_links:
                        try:
                            bank_info = await get_infor_bank(bank_config[bank_name_lower] + district_link)
                            district_name = district_link.split('/')[-1]
                            district_branches[district_name] = bank_info
                        except HTTPException as exc:
                            district_name = district_link.split('/')[-1]
                            district_branches[district_name] = str(exc.detail)
                    bank_branches[city_link] = district_branches
                else:
                    bank_branches[city_link] = "Không có liên kết quận/huyện."
            return bank_branches
        else:
            raise HTTPException(status_code=404, detail="Không thể lấy danh sách liên kết thành phố.")
    else:
        raise HTTPException(status_code=400, detail=f"Ngân hàng '{bank_name}' không được hỗ trợ.")
@app.get("/api/bank_branches/")
async def get_bank_branches(bank_name: str = Query(..., description="Tên ngân hàng")):
    return await get_bank_data(bank_name)

@app.post("/api/save_to_mongodb/")
async def save_to_mongodb(bank_name: str = Query(..., description="Tên ngân hàng")):
    bank_data = await get_bank_data(bank_name)
    try:
        collection = db[bank_name.lower()]
        await collection.insert_one({"data": bank_data})
        return {"message": f"Dữ liệu đã được lưu vào MongoDB cho ngân hàng '{bank_name}'"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, debug=True)
