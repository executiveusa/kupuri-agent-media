FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ENV NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:9 NEXT_PUBLIC_SUPABASE_ANON_KEY=preview-placeholder SUPABASE_SERVICE_ROLE_KEY=preview-placeholder NEXT_TELEMETRY_DISABLED=1
RUN npx next build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npx","next","start","-p","3000"]
