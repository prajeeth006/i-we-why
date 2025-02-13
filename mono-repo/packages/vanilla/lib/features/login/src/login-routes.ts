import { importProvidersFrom } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Routes } from '@angular/router';

import { routeData } from '@frontend/vanilla/core';

import { DanskeSpilLoginSuccessComponent } from './integration/danske-spil-login-success.component';
import { LoginStandaloneComponent } from './login-standalone.component';
import { loginStandaloneGuard } from './login-standalone.guard';
import { NewVisitorPageComponent } from './newvisitor-page/newvisitor-page.component';
import { newVisitorPageGuard } from './newvisitor-page/newvisitor-page.guard';
import { PendingPostLoginWorkflowComponent } from './pending-post-login-workflow.component';
import { PendingWorkflowComponent } from './pending-workflow.component';
import { PostLoginWorkflowComponent } from './post-login-workflow.component';
import { PreLoginPageComponent } from './pre-login-page/pre-login-page.component';
import { preLoginPageGuard } from './pre-login-page/pre-login-page.guard';
import { WorkflowComponent } from './workflow.component';

export const ROUTES: Routes = [
    {
        path: 'login',
        component: LoginStandaloneComponent,
        data: routeData({ allowAnonymous: true }),
        canActivate: [loginStandaloneGuard],
    },
    {
        path: 'prelogin',
        component: PreLoginPageComponent,
        providers: [importProvidersFrom(MatDialogModule)],
        data: routeData({ allowAnonymous: true }),
        canActivate: [preLoginPageGuard],
    },
    {
        path: 'welcome',
        component: NewVisitorPageComponent,
        data: routeData({ allowAnonymous: true }),
        canActivate: [newVisitorPageGuard],
    },
    {
        path: 'danske-spil-login-success',
        component: DanskeSpilLoginSuccessComponent,
        data: routeData({ allowAnonymous: true }),
    },
    {
        path: 'workflow',
        children: [
            {
                // this is the new endpoint which should be used by all apps
                // combines pre and post login interceptors
                // other workflow endpoints should be removed after this one is used everywhere
                path: '',
                component: WorkflowComponent,
                data: routeData({ allowAnonymous: true, allowAllWorkflowTypes: true }),
            },
            {
                path: 'pending',
                component: PendingWorkflowComponent,
                data: routeData({ allowAnonymous: true, allowAllWorkflowTypes: true }),
            },
            {
                path: 'pendingpostlogin', // obsolete, remove once native routes are removed as well
                component: PendingPostLoginWorkflowComponent,
                data: routeData({ allowAnonymous: true, allowAllWorkflowTypes: true }),
            },
            {
                path: 'postlogin',
                component: PostLoginWorkflowComponent,
                data: routeData({ authorized: true }),
            },
        ],
    },
];
