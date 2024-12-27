## 계획 관련 RestfulAPI

1. 계획 세부 정보 가져옴: 'GET plans/detail/:planId'
    -req:
    ```
    {
        없음
    }
    ```
    -res:
    ```
    {
        "planId": 1,
        "planTitle": "프랑스 계획",
        "planMainImage": "xxx.xxx.png",
        "status": PUBLIC,
        "totalExpense": "123456789",
        "travelStartDate": "20250103",
        "travelEndDate": "20250203",
        "likesCount": 3,
        "commentsCount":2
        "createAt": 2024-12-01
        "plandetail": [
            {
                "detailId":1,
                "startTime": "202501031000",
                "endTime": "202501031100",
                "detailTitle": "카페에서 커피+빵",
                "detailNote": "",
                "price": 20000,
                "currency": KRW,
                "location": "에펠탑 앞",
                "latitude": "",
                "longitude": ""
                "duthch pay": 6000
            },
            {
                "detailId":2,
                "startTime": "202501031200",
                "endTime": "202501031400",
                "detailTitle": "베르사유 궁전 앞 레스토랑",
                "detailNote": "",
                "price": 100000,
                "currency": KRW,
                "location": "베리사유 궁전",
                "latitude": "",
                "longitude": ""
                "duthch pay": 50000
            }
        ]
    }
    ```

2. 계획 생성: 'POST plans/create/plan/'
    -req:
    ```
    {
        "planTitle": "이탈리아 계획",
        "planMainImage": "xxx.xxx.png",
        "status": PUBLIC,
        "totalExpense": "123456789",
        "travelStartDate": "20250103",
        "travelEndDate": "20250203",
        "plandestination": [
            {
                "destination": {
                    "destinationName": "로마"
                },
                "destination":{
                    "destinationName": "피렌체"
                }
            }
        ]
    }
    ```
    -res:
    ```
    {
        "planId": 1,
        "planTitle": "이탈리아아 계획",
        "planMainImage": "xxx.xxx.png",
        "status": PUBLIC,
        "totalExpense": "123456789",
        "travelStartDate": "20250103",
        "travelEndDate": "20250203",
        "likesCount": 3,
        "commentsCount":2
        "createAt": 2024-12-01
        "plandestination": [
            {
                "destination": {
                    "destinationName": "로마"
                },
                "destination":{
                    "destinationName": "피렌체"
                }
            }
        ]
    }    

3. 계획 수정: 'PATCH plans/update/plan/'
    -req:
    ```
    {
        "planTitle": "이탈리아 계획",
        "planMainImage": "xxx.xxx.png",
        "status": PRIVATE,
        "totalExpense": "321456789",
        "travelStartDate": "20250105",
        "travelEndDate": "20250205",
    }
    ```
    -res:
    ```
    {
        "planId": 1,
        "planTitle": "프랑스 계획",
        "planMainImage": "xxx.xx.x.png",
        "status": PUBLIC,
        "totalExpense": "321456789",
        "travelStartDate": "20250105",
        "travelEndDate": "20250205",
        "likesCount": 3,
        "commentsCount":2
        "createAt": 2024-12-01
        "updatedAt": 2024-12-20,
        "isUpdated": true
    }

4. 계획 삭제제: 'PATCH plans/delete/plan/'
    -req:
    ```
    {
        없음
    }
    ```
    -res:
    ```
    {
        "planId": 1,
        "deletedAt": 2024-12-31,
        "isDeleted": true
    }