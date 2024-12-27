## 카테고리 관련 RestfulAPI

1. 특정 카테고리에 대한 정보를 가져옴: `GET category/:categoryId/`

   - req:

   ```
   {
   없음
   }
   ```

   - res:

   ```
   {
       "categoryId": 1,
       "categoryTitle": "유럽여행",
       "createdAt": 2024-12-27,
       "user": {
           "id": 1
       }
       "plans": [
           {
               "planId": 1,
               "planTitle": "프랑스스 여행",
               "planMainImage": "xxx.xxx.png",
               "status": PUBLIC,
               "totalExpense": 1,
               "travelStartDate": "20241231",
               "travelEndDate": "20250201",
               "likesCount": 4,
               "commentsCount": 0,
               "createdAt": 2024-12-27,
               "plandestination": [
                   {
                       "planId": 1,
                       "destinationId": 1
                       "destination":{
                           "destinationId": 1,
                           "destinationName": "프랑스"

                       }
                   },
                   {
                       "planId": 1,
                       "destinationId": 2
                       "destination":{
                           "destinationId": 2,
                           "destinationName": "파리"

                       }
                   }
               ]
           }
       ]
   }
   ```

2. 카테고리 생성: `POST category/create/`

   - req:

   ```
   {
       "categoryTitle": "프랑스 여행"
   }
   ```

   - res:

   ```
   {
       "categoryId": 1,
       "categoryTitle": "프랑스 여행",
       "createdAt": 2024-12-27
   }
   ```

3. 카테고리 수정: `PATCH category/:categoryId`

   -req:

   ```
   {
       "categoryTitle": "스위스 여행"
   }
   ```

   -res:

   ```
   {
       "categoryId": 1,
       "categoryTitle": "스위스 여행",
       "createdAt": 2024-12-27,
       "updatedAt": 2024-12-28,
       "isUpdated": true
   }
   ```

4. 카테고리 삭제: `PATCH category/:categoryId/delete`

   -req:
   `   {
    없음
}`
   -res:
   `   {
    "categoryId": 1,
    "deletedAt": 2024-12-29,
    "isDeleted": true
}`
