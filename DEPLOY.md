# Namecheap VPS Deployment

## Option A — Namecheap VPS (recommended)

### 1. Build locally

```bash
npm run build
```

### 2. Upload files to VPS via SSH

```bash
rsync -avz --exclude node_modules --exclude .git ./ user@your-vps-ip:~/htc/
```

### 3. On the VPS, install deps and run

```bash
cd ~/htc
npm install --omit=dev
npm run start   # runs on port 3000 by default
```

### 4. Set up PM2 so it stays alive

```bash
npm install -g pm2
pm2 start "npm run start" --name htc
pm2 save
pm2 startup
```

### 5. Point your domain with Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
