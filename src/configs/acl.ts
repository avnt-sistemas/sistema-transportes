import { AbilityBuilder, Ability } from '@casl/ability'
import Role from 'src/modules/role/interfaces/role'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defineRulesFor = (role?: Role | null) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  if (role) {
    role.acl_objects.forEach(obj => {
      can(obj.actions, obj.subject)
    })
  }

  if (role?.acl_objects.find(obj => obj.subject === 'customer')) can('read', 'modules')

  return rules
}

export const buildAbilityFor = (role?: Role | null): AppAbility => {
  return new AppAbility(defineRulesFor(role), {
    detectSubjectType: (object: any) => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
