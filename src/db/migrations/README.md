sequelize migration:create --name <name_migration>
copy content from previous migration file
Adapt to your needs
tsc src/db/migrations/* --outDir src/db/migrations/compiled/
sequelize db:migrate --env development
sequelize db:migrate:undo --env development

node_modules/sequelize-cli-typescript/lib/sequelize db:migrate --env development
