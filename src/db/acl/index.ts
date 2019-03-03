import * as Enforcer from 'casbin';
import { SequelizeAdapter } from 'casbin-sequelize-adapter';

import { GroupService } from '../../services/groupService';
import { GroupAttributes } from '../../db/models/GroupModel';

class CasbinAcl {
  async sync() {
    const a = await this.getAdapter();

    try {
      const e = await Enforcer.newEnforcer(__dirname + '/authz_model.conf');
      await e.addPolicy('super_user', '/api/*', '*');
      await e.addGroupingPolicy('1', 'super_user');

      const groups: GroupAttributes[] = await GroupService.retrieveGroups();

      for (const group of groups) {
        switch (group.name) {
          case 'superAdmin': {
            for (const user of <GroupAttributes[]>group.users) {
              await e.addPolicy(user.id + '_' + group.name, '/api/group', '*');
              await e.addPolicy(user.id + '_' + group.name, '/api/user', '*');
              await e.addGroupingPolicy(
                user.id.toString(),
                user.id + '_' + group.name 
              );
            }
            break;
          }
          case 'Admin': {
            for (const user of <GroupAttributes[]>group.users) {
              await e.addPolicy(user.id + '_' + group.name, '/api/group', '(POST)|(PUT)|(GET)');
              await e.addPolicy(user.id + '_' + group.name, '/api/user' + user.id, '*');
              await e.addGroupingPolicy(
                user.id.toString(),
                user.id + '_' + group.name 
              );
            }
            break;
          }
          case 'Manager': {
            for (const user of <GroupAttributes[]>group.users) {
              await e.addPolicy(
                user.id + '_' + group.name,
                '/api/group' + '/' + group.id,
                'GET'
              );
              await e.addGroupingPolicy(
                user.id.toString(),
                user.id + '_' + group.name
              );
            }
          }
        }
        await a.savePolicy(e.getModel());
      }
    } catch (error) {
      console.log('casbin error::', error);
    } finally {
      a.close();
    }
  }

  private async getAdapter() {
    return await SequelizeAdapter.newAdapter(
      'postgresql://' +
        (process.env.DATABASE_USER || 'postgresql_dev') +
        ':' +
        (process.env.DATABASE_PASS || 'postgresql_dev') +
        '@' +
        (process.env.DATABASE_HOST || '192.168.99.100') +
        ':' +
        (process.env.DATABASE_PORT || 5433) +
        '/' +
        (process.env.DATABASE_DB || 'postgresql_dev'),
      true 
    );
  }

  async getEnforcer() {
    const a = await this.getAdapter();
    try {
      const e = await Enforcer.newEnforcer(__dirname + '/authz_model.conf', a);
      return e;
    } catch (err) {
      console.log('casbin error::', err);
    } finally {
      a.close();
    }
  }
}
export const acl = new CasbinAcl();
