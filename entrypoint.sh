#!/bin/sh

echo "🚀 Démarrage du conteneur..."

# Boucle de sécurité : Attendre que la DB soit vraiment prête pour Prisma
# Parfois le healthcheck Docker est OK mais la socket n'est pas prête pour une migration
echo "🔄 Tentative de migration Prisma..."
MAX_RETRIES=30
count=0

until npx prisma migrate deploy; do
  count=$((count+1))
  if [ $count -ge $MAX_RETRIES ]; then
    echo "❌ Échec des migrations après $MAX_RETRIES tentatives. Arrêt."
    exit 1
  fi
  echo "⏳ La base n'est pas encore prête pour la migration... (Tentative $count/$MAX_RETRIES)"
  sleep 2
done

echo "✅ Migrations appliquées avec succès."

echo "🔥 Lancement de l'application..."
exec tsx src/app.ts