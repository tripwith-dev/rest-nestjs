### Settings

**1. `.eslintrc.js/prettier rule`**

```
'prettier/prettier': [
    'error',
    {
        endOfLine: 'auto',
    },
],
```

**2. dependency**

```
cd server-nestjs
```

우선 위와 같이 `server-nestjs` 디렉토리에 접근 후 아래 디펜던시를 설치합니다.

```
# swagger
npm i --save @nestjs/swagger swagger-ui-express
npm i --save @nestjs/typeorm typeorm
npm i --save class-validator class-transformer
```
