import os
from typing import Optional, List
from fastapi import FastAPI, Body, HTTPException, status
from fastapi.responses import Response
from pydantic import ConfigDict, BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated
from bson import ObjectId
import motor.motor_asyncio
from pymongo import ReturnDocument
#####
from fastapi import FastAPI, HTTPException, Query
import requests
from bs4 import BeautifulSoup
from fastapi.middleware.cors import CORSMiddleware
import httpx
from fastapi import HTTPException

app = FastAPI(
    title="Collect API",
    summary="A sample application showing how to use FastAPI to add a ReST API to a MongoDB collection.",
)

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://localhost:27017")
db = client.get_database("province")
student_collection = db.get_collection("cty")

PyObjectId = Annotated[str, BeforeValidator(str)]


class ProvinceModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "name": "Jane Doe",
            }
        },
    )

class UpdateStudentModel(BaseModel):
    name: Optional[str] = None
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        json_schema_extra={
            "example": {
                "name": "Jane Doe",

            }
        },
    )

class StudentCollection(BaseModel):
    students: List[StudentModel]

@app.post(
    "/students/",
    response_description="Add new student",
    response_model=StudentModel,
    status_code=status.HTTP_201_CREATED,
    response_model_by_alias=False,
)
async def create_student(student: StudentModel = Body(...)):
    new_student = await student_collection.insert_one(
        student.model_dump(by_alias=True, exclude=["id"])
    )
    created_student = await student_collection.find_one(
        {"_id": new_student.inserted_id}
    )
    return created_student


@app.get(
    "/students/",
    response_description="List all students",
    response_model=StudentCollection,
    response_model_by_alias=False,
)
async def list_students():
    return StudentCollection(students=await student_collection.find().to_list(1000))


@app.get(
    "/students/{id}",
    response_description="Get a single student",
    response_model=StudentModel,
    response_model_by_alias=False,
)
async def show_student(id: str):
    if (
        student := await student_collection.find_one({"_id": ObjectId(id)})
    ) is not None:
        return student

    raise HTTPException(status_code=404, detail=f"Student {id} not found")


@app.put(
    "/students/{id}",
    response_description="Update a student",
    response_model=StudentModel,
    response_model_by_alias=False,
)
async def update_student(id: str, student: UpdateStudentModel = Body(...)):
    student = {
        k: v for k, v in student.model_dump(by_alias=True).items() if v is not None
    }
    if len(student) >= 1:
        update_result = await student_collection.find_one_and_update(
            {"_id": ObjectId(id)},
            {"$set": student},
            return_document=ReturnDocument.AFTER,
        )
        if update_result is not None:
            return update_result
        else:
            raise HTTPException(status_code=404, detail=f"Student {id} not found")

    # The update is empty, but we should still return the matching document:
    if (existing_student := await student_collection.find_one({"_id": id})) is not None:
        return existing_student

    raise HTTPException(status_code=404, detail=f"Student {id} not found")


@app.delete("/students/{id}", response_description="Delete a student")
async def delete_student(id: str):
    """
    Remove a single student record from the database.
    """
    delete_result = await student_collection.delete_one({"_id": ObjectId(id)})

    if delete_result.deleted_count == 1:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    raise HTTPException(status_code=404, detail=f"Student {id} not found")
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

phuc_config = {
    'bentre' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/ben-tre-185",
    ####################################################
    'daknong' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/dak-nong-245",
    'angiang' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/an-giang-93",
    'baria-vungtau' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/ba-ria-vung-tau-32",
    'bacgiang' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/bac-giang-72",
    'backan' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/bac-kan-1127",
    'baclieu' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/bac-lieu-197",
    'bacninh' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/bac-ninh-170",
    'binhdinh' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/binh-dinh-152",
    'binhduong' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/binh-duong-17",
    'binhphuoc' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/binh-phuoc-1",
    'binhthuan' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/binh-thuan-20",
    'camau' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/ca-mau-108",
    'cantho' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/can-tho-96",
    'caobang' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/cao-bang-1612",
    'danang' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/da-nang-35",
    'daklak' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/dak-lak-214",
    'daknong' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/dak-nong-245",
    'dienbien' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/dien-bien-1007",
    'dongnai' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/dong-nai-57",
    'dongthap' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/dong-thap-63",
    'gialai': "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/gia-lai-563",
    'hagiang' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/ha-giang-529",
    'hanam' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/ha-nam-162",
    'hanoi' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/ha-noi-7",
    #######################################################################
    'hatinh' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/ha-tinh-342",
    'haiduong' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/hai-duong-147",
    'haiphong' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/hai-phong-99",
    'haugiang' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/hau-giang-190",
    'hochiminh' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/ho-chi-minh-23",
    'hoabinh' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/hoa-binh-786",
    'hungyen' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/hung-yen-123",
    'khanhhoa' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/khanh-hoa-26",
    'kiengiang' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/kien-giang-80",
    'kontum' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/kon-tum-956",
    'laichau' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/lai-chau-2501",
    'lamdong' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/lam-dong-10",
    'langson' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/lang-son-984",
    'laocai' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/lao-cai-320",
    'longan' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/long-an-29",
    'namdinh' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/nam-dinh-137",
    'nghean' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/nghe-an-144",
    'ninhbinh' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/ninh-binh-75",
    'ninhthuan' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/ninh-thuan-11",
    'phutho' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/phu-tho-134",
    'phuyen' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/phu-yen-14",
    'quangbinh' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/quang-binh-60",
    'quangnam' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/quang-nam-49",
    'quangngai' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/quang-ngai-301",
    'quangninh' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/quang-ninh-142",
    'quangtri' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/quang-tri-69",
    'soctrang' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/soc-trang-949",
    'sonla' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/son-la-316",
    'tayninh' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/tay-ninh-90",
    'thaibinh' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/thai-binh-128",
    'thainguyen' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/thai-nguyen-131",
    'thanhhoa' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/thanh-hoa-4",
    'thuathienhue' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/thua-thien-hue-66",
    'tiengiang' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/tien-giang-177",
    'travinh' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/tra-vinh-41",
    'tuyenquang' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/tuyen-quang-1284",
    'vinhlong' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/vinh-long-193",
    'vinhphuc' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/vinh-phuc-420",
    'yenbai' : "https://masothue.com/tra-cuu-ma-so-thue-theo-tinh/yen-bai-724",
}

@app.get("/api/companies/")
async def get_companies_by_province(province: str = Query(..., description="Tên tỉnh/thành")):
    if province in phuc_config:
        companies = []
        # Lặp qua các trang từ 1 đến 3
        for page_num in range(1, 4):
            url = phuc_config[province] + f"?page={page_num}"
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(url)
                    response.raise_for_status()  # Ném ngoại lệ HTTPError nếu có mã trạng thái không thành công
                    soup = BeautifulSoup(response.content, 'html.parser')
                    all_list = soup.find('div', class_='tax-listing')
                    company_items = all_list.find_all(attrs={"data-prefetch": True})
                    # Thu thập thông tin công ty từ từng trang
                    for company in company_items:
                        company_name = company.find('h3').find('a').text.strip()
                        tax_code = company.find('div').find('a').text.strip()
                        representative = company.find('div').find('em').find('a').text.strip()
                        address = company.find('address').text.strip()

                        company_info = {
                            'company_name': company_name,
                            'tax_code': tax_code,
                            'representative': representative,
                            'address': address
                        }
                        companies.append(company_info)
            except httpx.HTTPStatusError as exc:
                raise HTTPException(status_code=500, detail=f"Không thể truy cập trang ({exc})")
            except httpx.RequestError as exc:
                raise HTTPException(status_code=500, detail=f"Lỗi trong quá trình gửi yêu cầu ({exc})")

        return {'companies': companies}
    else:
        raise HTTPException(status_code=400, detail=f"Tỉnh/thành '{province}' không được hỗ trợ")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, debug=True)