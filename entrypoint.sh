#!/bin/sh

# This script replaces the VITE_ runtime string placeholders natively inside the Docker container
# prior to spinning up Nginx. This executes upon Docker Run so Registry secrets stream down securely.

echo "Reconfiguring container with deployed environment variables..."

# Find all javascript and html files inside the served deployment bundle
find /usr/share/nginx/html/goal_momentum -type f \( -name "*.js" -o -name "*.html" \) -exec sed -i "s|__VITE_NEON_DATABASE_URL__|${VITE_NEON_DATABASE_URL}|g" {} +
find /usr/share/nginx/html/goal_momentum -type f \( -name "*.js" -o -name "*.html" \) -exec sed -i "s|__VITE_NEON_PROJECT_ID__|${VITE_NEON_PROJECT_ID}|g" {} +
find /usr/share/nginx/html/goal_momentum -type f \( -name "*.js" -o -name "*.html" \) -exec sed -i "s|__VITE_NEON_API_KEY__|${VITE_NEON_API_KEY}|g" {} +
find /usr/share/nginx/html/goal_momentum -type f \( -name "*.js" -o -name "*.html" \) -exec sed -i "s|__VITE_GOOGLE_TRANSLATE_API_KEY__|${VITE_GOOGLE_TRANSLATE_API_KEY}|g" {} +

echo "Applying Nginx..."

# Execute standard Nginx foreground command passing args down
exec "$@"
