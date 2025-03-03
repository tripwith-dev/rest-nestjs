**nest-container 빌드**

- `docker build -t nestjs-app .`

**nest-container 삭제**

- `docker rm -f nest-container`

**nest-container 실행**

- `docker run -d --name nest-container --env-file .env -p 8000:8000 nest-app`
  - `.dockerignore` 에 `.env` 파일이 있기에 직접 주입함.

**컨테이너 내부 접속**

- `docker exec -it nest-container sh`

**docker-compose 사용 (MySQL 포함)**

- 실행: `docker-compose up -d`
- 중지: `docker-compose down`

**컨테이너 상태 관리**

- `docker ps -a`
