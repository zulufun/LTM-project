
from fastapi import FastAPI, HTTPException, Query, Body
from bs4 import BeautifulSoup
import httpx
import asyncio
from datetime import datetime
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.responses import JSONResponse
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
app = FastAPI()
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
# Kết nối tới MongoDB
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.bankinfor  # Tên của database

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",  # Replace with your frontend URL
    "http://192.168.177.1:3000",
    "https://www.example.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

bank_config = {
    'vietcombank': "https://vietcombank.nganhangbank.com",
    'agribank': "https://agribank.nganhangbank.com",
    'acb': "https://acb.nganhangbank.com",
    'bidv': "https://bidv.nganhangbank.com",
    'sacombank': "https://sacombank.nganhangbank.com",
    'vietinbank': "https://vietinbank.nganhangbank.com",
    'vib': "https://vib.nganhangbank.com",
    'mbbank': "https://mbbank.nganhangbank.com/",
    'tpbank':"https://tpb.nganhangbank.com/",
    'techcombank':"https://techcombank.nganhangbank.com/",
    'dongabank':"https://dab.nganhangbank.com/",
    'lienvietpostbank':"https://lienviet.nganhangbank.com/",
    'bacabank':"https://baca.nganhangbank.com/",
    'shinhanbank':"https://shinhan.nganhangbank.com/",
    'abbank':"https://abbank.nganhangbank.com/",
    'gpbank':"https://gpbank.nganhangbank.com/",
    'banvietbank':"https://vietcapital.nganhangbank.com/",
    'vietbank':"https://vietbank.nganhangbank.com/",
    'ncbbank':"https://ncb.nganhangbank.com/",
    'hsbc':"https://hsbc.nganhangbank.com/",
    'nama': "https://nama.nganhangbank.com/",
}
class BankData(BaseModel):
    data: dict

async def get_response(url):
    async with httpx.AsyncClient(timeout=10) as client:
        return await client.get(url)

async def retry_request(url):
    retries = 3
    for _ in range(retries):
        try:
            response = await get_response(url)
            if response.status_code == 200:
                return response
            else:
                raise HTTPException(status_code=response.status_code, detail=f"Unexpected response: {response.status_code}")
        except httpx.ConnectTimeout:
            print("Kết nối mạng không ổn định. Đang thử lại...")
            await asyncio.sleep(2)  # Chờ 2 giây trước khi thử lại
            continue
    raise HTTPException(status_code=500, detail="Failed to establish connection after retries.")

async def get_city_links(url):
    response = await retry_request(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    city_links = []
    ul_tag = soup.find('ul', class_='list-cities')
    if ul_tag:
        for a_tag in ul_tag.find_all('a'):
            city_links.append(a_tag['href'])
    return city_links

async def get_district_links(url):
    response = await retry_request(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    district_links = []
    ul_tag = soup.find('ul', class_='list-cities')
    if ul_tag:
        for a_tag in ul_tag.find_all('a'):
            district_links.append(a_tag['href'])
    return district_links

async def get_infor_bank(url):
    response = await retry_request(url)
    data = []  # Danh sách lưu trữ thông tin các chi nhánh
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
                        'address': address.text.strip(),
                    })
        else:
            raise HTTPException(status_code=404, detail="Không tìm thấy danh sách chi nhánh.")
    else:
        raise HTTPException(status_code=404, detail="Không tìm thấy nội dung trang web.")
    return data

async def get_bank_data(bank_name: str):
    bank_name_lower = bank_name.lower()
    if bank_name_lower in bank_config:
        print(f"Đang thu thập dữ liệu cho ngân hàng: {bank_name}")
        bank_branches = []
        try:
            city_links = await get_city_links(bank_config.get(bank_name_lower))
            if city_links:
                for city_link in city_links:
                    district_links = await get_district_links(bank_config[bank_name_lower] + city_link)
                    if district_links:
                        district_branches = {}
                        for district_link in district_links:
                            try:
                                bank_info = await get_infor_bank(bank_config[bank_name_lower] + district_link)
                                district_name = district_link.split('/')[-1]
                                print(f"Thông tin chi nhánh của {district_name} ({bank_name}):")
                                for branch in bank_info:
                                    print(f"- {branch['branch_name']}: {branch['address']}")
                                    info = {
                                        "branch_name" : branch['branch_name'],
                                        "address" : branch['address'],

                                    }
                                    bank_branches.append(info)
                            except HTTPException as exc:
                                district_name = district_link.split('/')[-1]
                                district_branches[district_name] = str(exc.detail)
                        #bank_branches[city_link] = district_branches
                    else:
                        bank_branches[city_link] = "Không có liên kết quận/huyện."
                return bank_branches
            else:
                raise HTTPException(status_code=404, detail="Không thể lấy danh sách liên kết thành phố.")
        except HTTPException as exc:
            raise HTTPException(status_code=exc.status_code, detail=str(exc.detail))
    else:
        raise HTTPException(status_code=400, detail=f"Ngân hàng '{bank_name}' không được hỗ trợ.")

@app.get("/api/bank_branches/")
async def get_bank_branches(bank_name: str = Query(..., description="Tên ngân hàng")):
    print("get!!")
    return await get_bank_data(bank_name)

# @app.post("/api/save_to_mongodb/")
# async def save_to_mongodb(bank_name: str = Query(..., description="Tên ngân hàng")):
#     print("post!!")
#     try:
#         # Lấy dữ liệu của ngân hàng từ hàm get_bank_data
#         bank_data = await get_bank_data(bank_name)
#         if bank_data:
#             # Tên collection tương ứng với bank_name
#             collection_name = bank_name.lower()
#             # Kiểm tra xem collection đã tồn tại hay chưa
#             if collection_name not in await db.list_collection_names():
#                 # Nếu collection chưa tồn tại, tạo mới
#                 await db.create_collection(collection_name)
#             # Chèn dữ liệu vào collection
#             await db[collection_name].insert_many(bank_data)
#             # Trả về thông báo thành công
#             return {"message": f"Data for {bank_name} saved to MongoDB successfully!"
#                     }
#         else:
#             # Nếu không có dữ liệu, trả về thông báo lỗi
#             raise HTTPException(status_code=404, detail=f"No data found for {bank_name}")
#     except Exception as e:
#         # Xử lý ngoại lệ và trả về thông báo lỗi
#         raise HTTPException(status_code=500, detail=str(e))
@app.post("/api/save_to_mongodb/")
async def save_to_mongodb(
    bank_name: str = Query(..., description="Tên ngân hàng"),
    data: list= Body(..., description="Dữ liệu của ngân hàng")
):
    print("post!!")
    try:
        if data:
            collection_name = bank_name.lower()
            if collection_name not in await db.list_collection_names():
                await db.create_collection(collection_name)
            await db[collection_name].insert_many(data)
            return {"message": f"Data for {bank_name} saved to MongoDB successfully!"}
        else:
            raise HTTPException(status_code=404, detail=f"No data provided for {bank_name}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
############Login######################
class Login(BaseModel):
    username: str
    password: str

@app.post("/api/auth/login")
async def login(login_data: Login):
    print(login_data)
    # Thực hiện xác thực người dùng ở đây
    # Ví dụ: kiểm tra tên người dùng và mật khẩu trong cơ sở dữ liệu
    # Nếu xác thực thành công, trả về thông báo thành công
    # Nếu xác thực không thành công, ném ra một HTTPException với mã lỗi 401
    if login_data.username == "admin" and login_data.password == "pas":
        return {
            'status': True,
            'data':{
                'name': "Phuc",
                "username": "admin",
                "password": "pas"
            }

        }
    else:
        raise HTTPException(status_code=401, detail="Incorrect username or password")

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": "Authentication failed", "detail": exc.detail},
    )
################Thong Kê################
@app.get("/api/thongke")
async def get_collections():
    try:
        # Lấy danh sách tên các collection trong database
        collections = await db.list_collection_names()
        collection_info = []
        # Đếm số lượng tài liệu trong mỗi collection và thêm vào danh sách kết quả
        for collection_name in collections:
            collection = db[collection_name]
            count = await collection.count_documents({})
            collection_info.append({"collection_name": collection_name, "count": count})

        return {"data": collection_info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
#####SCORE CARD###
@app.get("/api/thongke2")
async def get_statistics():
    try:
        # Lấy danh sách tên các collection trong database
        collections = await db.list_collection_names()
        total_documents = 0
        max_collection = {"name": "", "count": 0}
        min_collection = {"name": "", "count": float('inf')}

        # Tính tổng số lượng tài liệu và tìm collection có số lượng lớn nhất và nhỏ nhất
        for collection_name in collections:
            collection = db[collection_name]
            count = await collection.count_documents({})
            total_documents += count

            if count > max_collection["count"]:
                max_collection["name"] = collection_name
                max_collection["count"] = count

            if count < min_collection["count"]:
                min_collection["name"] = collection_name
                min_collection["count"] = count
        collection_info = []
        collection_info.append({"total_collections": len(collections),
            "total_documents": total_documents,
            "max_collection": max_collection["name"],
            "min_collection": min_collection["name"]})
        return {"data": collection_info }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class BankBranch(BaseModel):
    name: str
    branch_name: str
    address: str


@app.get("/api/v1/promotion", response_model=List[BankBranch])
async def get_product_data():
    try:
        collections = await db.list_collection_names()
        product_data = []

        for collection_name in collections:
            collection = db[collection_name]
            documents = await collection.find({}, {"_id": 0, "branch_name": 1, "address": 1}).to_list(length=None)
            for document in documents:
                document['name'] = collection_name
            product_data.extend(documents)

        return product_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.get("/api/v1/collections", response_model=List[str])
async def get_collections():
    try:
        # Lấy danh sách tên các collection trong database
        collections = await db.list_collection_names()
        return collections
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
########################################
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, debug=True)
#uvicorn test:app --host 127.0.0.1 --port 8000 --reload