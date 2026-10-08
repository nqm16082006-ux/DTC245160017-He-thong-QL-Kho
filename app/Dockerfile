FROM node:20-alpine

WORKDIR /app

# Cài dependencies trong build phase
COPY package*.json ./

RUN npm install --omit=dev \
    && npm cache clean --force

# Copy source và chuyển quyền cho user node
COPY --chown=node:node src ./src

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Không chạy ứng dụng bằng root
USER node

# Chạy trực tiếp Node thay vì npm
CMD ["node", "src/server.js"]
