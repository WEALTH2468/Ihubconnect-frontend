import { createContext } from 'react';
import { createContextualCan } from '@casl/react';
import { createMongoAbility } from '@casl/ability';

export const AbilityContext = createContext();
export const Can = createContextualCan(AbilityContext.Consumer);


export default function AbilityProvider({permissions, children }) {
    const ability = createMongoAbility(JSON.parse(permissions ?? "[]"));
  return <AbilityContext.Provider value={ability}>
  {children}
  </AbilityContext.Provider>;
}