FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency graphs
COPY package*.json ./
RUN npm i

# Transfer app source (excluding secrets via .dockerignore)
COPY . .

# Generate Placeholder Environment file inline.
# Vite will freeze these tokens into the build JS,
# allowing the final container to dynamically sed them later.
RUN echo "VITE_NEON_DATABASE_URL=__VITE_NEON_DATABASE_URL__" > .env.production
RUN echo "VITE_NEON_PROJECT_ID=__VITE_NEON_PROJECT_ID__" >> .env.production
RUN echo "VITE_NEON_API_KEY=__VITE_NEON_API_KEY__" >> .env.production
RUN echo "VITE_GOOGLE_TRANSLATE_API_KEY=__VITE_GOOGLE_TRANSLATE_API_KEY__" >> .env.production

# Compile static assets
RUN npm run build


FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Transfer compiled application
COPY --from=builder /app/dist /usr/share/nginx/html/goal_momentum

# Clean default Nginx settings and apply Subpath routing
RUN rm /etc/nginx/conf.d/default.conf
COPY vite-nginx.conf /etc/nginx/conf.d/nginx.conf

# Setup runtime Environment intercepter
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

# Expose HTTP
EXPOSE 80

# Spin up through the interceptor
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
