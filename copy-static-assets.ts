import * as shell from 'shelljs';

shell.cp('-R', '.env.*', 'dist/');
shell.cp('-R', 'src/db/acl/*.conf', 'dist/db/acl/');
shell.cp('-R', '.sequelizerc', 'dist/.sequelizerc');
shell.cp('-R', 'src/db/config', 'dist/db/');