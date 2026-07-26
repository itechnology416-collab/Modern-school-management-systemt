#!/bin/bash
# Database backup script — run via cron: 0 2 * * * /path/to/backup.sh
DB_URI="${MONGO_URI:-mongodb://localhost:27017/school_management}"
BACKUP_DIR="./backups"
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_${TIMESTAMP}.gz"

echo "[$(date)] Starting backup..."
mongodump --uri="$DB_URI" --gzip --archive="$BACKUP_DIR/$FILENAME" 2>/dev/null

if [ $? -eq 0 ]; then
  echo "[$(date)] Backup successful: $FILENAME ($(du -h "$BACKUP_DIR/$FILENAME" | cut -f1))"
else
  echo "[$(date)] Backup FAILED"
  exit 1
fi

# Clean old backups
find "$BACKUP_DIR" -name "backup_*.gz" -mtime +$RETENTION_DAYS -delete
echo "[$(date)] Removed backups older than $RETENTION_DAYS days"
echo "[$(date)] Done."
