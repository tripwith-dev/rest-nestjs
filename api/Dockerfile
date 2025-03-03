# 1. Node.js 18 버전의 경량 Alpine 이미지 사용
FROM node:18-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json과 package-lock.json 복사
COPY package.json package-lock.json ./

# 4. 의존성 설치 (운영 환경 패키지만 설치)
RUN npm install

# 5. 소스 코드 복사
COPY . .

# 6. 빌드 (TypeScript 사용 시 필요)
RUN npm run build

# 7. 실행 명령어 (NestJS 서버 시작)
CMD ["node", "dist/main.js"]

# 8. 컨테이너가 8000 포트를 사용하도록 설정
EXPOSE 8000
