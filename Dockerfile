# Используем официальный образ Node.js в качестве базового образа
FROM node:14-alpine

# Создаем директорию приложения внутри контейнера
WORKDIR /app

# Копируем файлы package.json и package-lock.json внутрь контейнера
#COPY *.json ./
#COPY *.js ./
#COPY .prettierrc ./
COPY package*.json ./

# Install the dependencies
RUN npm install
COPY . .
# Копируем исходный код внутрь контейнера
#COPY src/ .

# Запускаем приложение
CMD ["npm", "start"]