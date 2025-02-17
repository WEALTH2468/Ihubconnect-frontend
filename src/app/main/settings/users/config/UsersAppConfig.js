import { lazy } from 'react';
import authRoles from '../../../../auth/authRoles';
import UserView from '../user/UserView';
import RoleForm from '../../RoleFom';
import DepartmentForm from '../../DepartmentForm';
import UnitForm from '../../UnitForm';
import UserForm from '../user/UserForm';

const UsersApp = lazy(() => import('../UsersApp'));

const UsersAppConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: authRoles.admin,

    routes: [
        {
            path: '/settings',
            element: <UsersApp />,
            children: [
                {
                    path: 'users/:id',
                    element: <UserView />,
                },
                {
                    path: 'users/:id/edit',
                    element: <UserForm />,
                },
                // {
                //   path: 'users',
                //   element: <UsersList />,
                // },
                {
                    path: 'roles/:id',
                    element: <RoleForm />,
                },
                {
                    path: 'departments/:id/department',
                    element: <DepartmentForm />,
                },
                {
                    path: 'departments/:id/unit',
                    element: <UnitForm />,
                },
            ],
        },
    ],
};

export default UsersAppConfig;
