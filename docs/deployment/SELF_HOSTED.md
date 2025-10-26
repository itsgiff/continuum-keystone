# Self-Hosting Keystone v0.1

This guide covers how to self-host Keystone on your own infrastructure using Docker Compose.

## Prerequisites

- Docker 20.10+ and Docker Compose 2.0+
- At least 1GB of available disk space
- Linux, macOS, or Windows with WSL2

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/continuum-keystone.git
cd continuum-keystone
```

### 2. Configure Environment

Copy the example environment file and customize it:

```bash
cp .env.example .env
```

Edit `.env` and set a secure `SESSION_SECRET`:

```bash
# Generate a secure random secret
openssl rand -base64 32

# Add it to .env
SESSION_SECRET=your-generated-secret-here
```

### 3. Start Services

```bash
docker-compose up -d
```

This will:
- Build the API and web containers
- Start the services in detached mode
- Create a `data` directory for SQLite database

### 4. Access Keystone

- **Web Interface**: http://localhost:3001
- **API**: http://localhost:3000

### 5. Create Your First Account

Navigate to http://localhost:3001/register and create an account.

## Data Persistence

### Database Location

The SQLite database is stored in `./data/keystone.db` on your host machine. This directory is mounted as a Docker volume for persistence.

### Backup Strategy

To backup your data:

```bash
# Stop services
docker-compose down

# Backup data directory
tar -czf keystone-backup-$(date +%Y%m%d).tar.gz data/

# Restart services
docker-compose up -d
```

### Restore from Backup

```bash
# Stop services
docker-compose down

# Extract backup
tar -xzf keystone-backup-20240101.tar.gz

# Restart services
docker-compose up -d
```

## Upgrading

To upgrade to a new version:

```bash
# Stop services
docker-compose down

# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build
```

Your data in the `./data` directory will be preserved.

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SESSION_SECRET` | Secret key for session encryption | `dev-secret-change-me` |
| `NODE_ENV` | Environment mode | `production` |
| `DATABASE_URL` | SQLite database path | `file:/app/data/keystone.db` |

### Ports

By default:
- API: `3000`
- Web: `3001`

To change ports, edit `docker-compose.yml`:

```yaml
services:
  api:
    ports:
      - "8080:3000"  # Change left side to your desired port
  web:
    ports:
      - "8081:3000"  # Change left side to your desired port
```

## Security Considerations

### Production Deployment

1. **Always set a strong `SESSION_SECRET`**
   - Use a cryptographically secure random string
   - Never reuse secrets across deployments

2. **Use HTTPS**
   - Set up a reverse proxy (nginx, Caddy) with SSL
   - Update `ORIGIN` environment variable

3. **Firewall Configuration**
   - Only expose web port (3001) to internet
   - Keep API port (3000) internal

4. **Regular Backups**
   - Automate daily backups of `./data` directory
   - Store backups in a secure, separate location

### Example Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name keystone.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring

### Health Checks

Both services include health check endpoints:

```bash
# API health
curl http://localhost:3000/health

# Web health
curl http://localhost:3001/
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f web
```

## Troubleshooting

### Services Won't Start

1. Check logs: `docker-compose logs`
2. Verify ports aren't in use: `lsof -i :3000 -i :3001`
3. Ensure `SESSION_SECRET` is set in `.env`

### Database Issues

If you encounter database errors:

```bash
# Stop services
docker-compose down

# Remove database (WARNING: This deletes all data)
rm -rf data/

# Restart services (will create new database)
docker-compose up -d
```

### Permission Issues

If you see permission errors with the data directory:

```bash
# Fix ownership
sudo chown -R $USER:$USER data/
```

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/continuum-keystone/issues
- Documentation: See `/docs` directory
