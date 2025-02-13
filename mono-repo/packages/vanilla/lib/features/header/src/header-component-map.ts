import { Type } from '@angular/core';

export const HEADER_COMPONENTS_MAP: { [key: string]: () => Promise<Type<any>> } = {
    'am-onboarding': () => import('./account-menu-onboarding/account-menu-onboarding.component').then((x) => x.AccountMenuOnboardingComponent),
    'avatar-balance': () => import('./avatar-balance/avatar-balance.component').then((x) => x.AvatarBalanceComponent),
    'avatar': () => import('./avatar/avatar.component').then((x) => x.AvatarComponent),
    'balance': () => import('./balance/balance.component').then((x) => x.BalanceComponent),
    'button': () => import('./button/button.component').then((x) => x.ButtonComponent),
    'deposit': () => import('./deposit-button/deposit-button.component').then((x) => x.DepositButtonComponent),
    'dropdown': () => import('./dropdown/dropdown.component').then((x) => x.DropdownComponent),
    'header-search': () => import('./search/search.component').then((x) => x.SearchComponent),
    'icon': () => import('./icon/icon.component').then((x) => x.IconComponent),
    'inbox': () => import('./inbox-icon/inbox-icon.component').then((x) => x.InboxIconComponent),
    'login-start-time': () => import('./login-start-time/login-start-time.component').then((x) => x.LoginStartTimeComponent),
    'logo': () => import('./logo/logo.component').then((x) => x.LogoComponent),
    'navigation-pill': () => import('./navigation-pill/navigation-pill.component').then((x) => x.NavigationPillComponent),
    'product-navigation': () => import('./product-navigation/product-navigation.component').then((x) => x.ProductNavigationComponent),
    'terminal-balance': () => import('./terminal-balance/terminal-balance.component').then((x) => x.TerminalBalanceComponent),
    'text': () => import('./text/text.component').then((x) => x.TextComponent),
    'bonus-balance': () => import('./bonus-balance/bonus-balance.component').then((x) => x.BonusBalanceComponent),
};
