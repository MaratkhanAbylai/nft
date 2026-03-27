import { Routes } from '@angular/router';

import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { MainLayout } from './layouts/main-layout/main-layout';
import { Nfts } from './pages/nfts/nfts';
import { Profile } from './pages/profile/profile';
import { MyNfts } from './pages/my-nfts/my-nfts';
import { CreateNft } from './pages/create-nft/create-nft';
import { ArtPage } from './pages/art-page/art-page';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '',
                component: Nfts
            },
            {
                path: 'profile',
                component: Profile
            },
            {
                path: 'my-nfts',
                component: MyNfts
            },
            {
                path: 'create-nft',
                component: CreateNft
            },
            {
                path: 'art-page',
                component: ArtPage
            }
        ]
    },
    {
        path: 'auth',
        component: AuthLayout
    }
];