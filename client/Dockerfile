# client/Dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install 
COPY . ./
# Add environment variable for production API URL
ARG REACT_APP_API_URL=http://3.94.88.44:4000/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
# Fix for permissions issue with react-scripts
RUN chmod +x node_modules/.bin/react-scripts
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy nginx config to handle React routing
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]