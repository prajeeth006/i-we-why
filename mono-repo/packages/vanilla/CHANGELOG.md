### Vanilla 19.1.0 [Not released yet]

[Release date: TBD]

**FEATURES**

- [DTP-34890](https://jira.corp.entaingroup.com/browse/DTP-34890) Added option to pass `useCase` to `KycStatusService.refresh` method.
- [DTP-35571](https://jira.corp.entaingroup.com/browse/DTP-35571) Save `DisplayedInterceptors` cookie on get post login action.
- [DTP-35588](https://jira.corp.entaingroup.com/browse/DTP-35588) New options to `change label` toastr.
- [DynaCon config](https://admin.dynacon.prod.env.works/services/198137/features/219933/keys/440136/valuematrix?_matchAncestors=true) to show `change label` toastr on every state switch.
- [DynaCon config](https://admin.dynacon.prod.env.works/services/198137/features/219933/keys/440138/valuematrix?_matchAncestors=true) to not show `change label` toastr for that state until the following day when user clicks `Stay in state`.
-  Use `AttemptsBeforeRedirect` property in [ErrorCodeHandlers config](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/133335/valuematrix?_matchAncestors=true) to enable redirect after configured login attempts.
- [DTP-36358](https://jira.corp.entaingroup.com/browse/DTP-36358) Added `strictInputTypes` restriction to the AngularCompilerOptions.
- [DTP-36371](https://jira.corp.entaingroup.com/browse/DTP-36371) Changed log level from error to warning if mlife not found.
- [DTP-37140](https://jira.corp.entaingroup.com/browse/DTP-37140) Sanitized logger on client side.
- [DTP-36556](https://jira.corp.entaingroup.com/browse/DTP-36556) Added session-limits version 2 for Ontario labels.
- [DTP-37648](https://jira.corp.entaingroup.com/browse/DTP-37648) Added support for multiple `smartUrlOverride`.
- [DTP-38427](https://jira.corp.entaingroup.com/browse/DTP-38427) Extended PCImage Template added new field `IconName`.
- [DTP-35451](https://jira.corp.entaingroup.com/browse/DTP-35451) Added [restrictedUrlsForInternalOnly](https://admin.dynacon.prod.env.works/services/198137/features/213638/keys/439098/valuematrix?_matchAncestors=true) key to extend AllowOnlyInternalAccessMiddleware configuration.
- [DTP-37132](https://jira.corp.entaingroup.com/browse/DTP-37132) Added DynaCon config to disable API calls after login: [DisableFeatureDataPrefetch](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/443221/valuematrix?_matchAncestors=true).
- [DTP-39976](https://jira.corp.entaingroup.com/browse/DTP-39976) Added for session-limits v2 call to SaveSessionLimitsPopupAction api for continue button.
- [DTP-40900](https://jira.corp.entaingroup.com/browse/DTP-40900) Added feature to show user timezone in clock with key [UseWithTimeZone](https://admin.dynacon.prod.env.works/services/198137/features/287593/keys/456541/valuematrix?_matchAncestors=true).
- [DTP-40450](https://jira.corp.entaingroup.com/browse/DTP-40450) Added usage of vn-icon in vn-menu-item component.The configuration is switchable for components using vn-menu-item with this key [HtmlSourceTypeReplace](https://admin.dynacon.prod.env.works/services/198137/features/198454/keys/440017/valuematrix?_matchAncestors=true).
- [DTP-40415](https://jira.corp.entaingroup.com/browse/DTP-40415) Added EnableDsScrollbar key in dynacon for enabling ds-scrollbar.
- [DTP-40353](https://jira.corp.entaingroup.com/browse/DTP-40353) Added usage of vn-icon for language-item in language switcher with [UseFastIcons](https://admin.dynacon.prod.env.works/services/198137/features/213625/keys/456305/valuematrix?_matchAncestors=true) key.
- [DTP-42138](https://jira.corp.entaingroup.com/browse/DTP-42138) Added Ds-arrow in Vanilla sliding bar component.
- [DTP-42939](https://jira.corp.entaingroup.com/browse/DTP-42939) Added document upload status dsl with `usecase` parameter.
- [DTP-36221](https://jira.corp.entaingroup.com/browse/DTP-36221) Added vn-icon in place of theme classes.
- [DTP-43063](https://jira.corp.entaingroup.com/browse/DTP-43063) Added `Registration` DSL provider. 
  - `Registration.Date` should replace `User.RegistrationDate`.
  - `Registration.DaysRegistered` should replace `User.DaysRegistered`.
- [DTP-42006](https://jira.corp.entaingroup.com/browse/DTP-42006) Added feedback message in `Net Deposit` and `Profit & Loss` section of profile page.
- [DTP-42682](https://jira.corp.entaingroup.com/browse/DTP-42682) Added SuperCookieMaxAge key in dynacon for setting expiration in days.
- [DTP-44150](https://jira.corp.entaingroup.com/browse/DTP-44150) Created login screen for brazil.
- Fix for DTP-44408 menu-item tracking.
- [DTP-45008](https://jira.corp.entaingroup.com/browse/DTP-45008) Fixed clientID format for cross domain tracking.
- [DTP-45025](https://jira.corp.entaingroup.com/browse/DTP-45025) Modified MappedQueryServiceClient to send only WmId with UseOnlyWmId dynacon key.
- [DTP-43334](https://jira.corp.entaingroup.com/browse/DTP-43334) Fixed OTEL tracing method in health/log and added filter for log level. 
- [DTP-44831](https://jira.corp.entaingroup.com/browse/DTP-44831) Fix vn-icon name in menuitems from parameters iconName.  
- Fixed sfapi PlayGroundContentEndpointBootstrapper allowed path for themepark public pages.
- [DTP-41421](https://jira.corp.entaingroup.com/browse/DTP-41421) Replaced custom-control-switcher with ds-switch.
- [DTP-40412](https://jira.corp.entaingroup.com/browse/DTP-40412) Replaced normal divider with ds-divider.
- [DTP-34946](https://jira.corp.entaingroup.com/browse/DTP-34946) Added ds-loding-spinner as html source using HtmlSourceTypeReplace key.
- [DTP-46339](https://jira.corp.entaingroup.com/browse/DTP-46339) Added tracking for session limit v3. 
- [DTP-40408](https://jira.corp.entaingroup.com/browse/DTP-40408) Replaced bonus-balance with ds-bonus-button.
- [DTP-46695](https://jira.corp.entaingroup.com/browse/DTP-46695) Added product-name in html tag for single domain apps.



**FIXES**

- [DTP-35953](https://jira.corp.entaingroup.com/browse/DTP-35953) Fixed ResponseCacheControlCoreAttribute throwing exception when path contains duplicated segment.
- [DTP-35714](https://jira.corp.entaingroup.com/browse/DTP-35714) Regenerated Sitecore template to include new field `MarketTypes`.
- [DTP-36771](https://jira.corp.entaingroup.com/browse/DTP-36771) Fixed DynaCon config filtering.
- [DTP-36961](https://jira.corp.entaingroup.com/browse/DTP-36961) Added `swapFooterComponent` input to `NavigationLayoutPageComponent` as option to disable footer component swap in navigation layout.
- [DTP-37131](https://jira.corp.entaingroup.com/browse/DTP-37131) Remove logging of the autologin paramaters (DTP-37131).
- [DTP-37097](https://jira.corp.entaingroup.com/browse/DTP-37097) and [DTP-36833](https://jira.corp.entaingroup.com/browse/DTP-36833) Fixed balance breakdown component content for tooltip and UI breaking after refresh.
- Fixed not found currentIconSet.children in vn-icon.
- [DTP-37055](https://jira.corp.entaingroup.com/browse/DTP-37055) Fixed balance-filtered-items-layout component not refreshing items.
- [DTP-39000](https://jira.corp.entaingroup.com/browse/DTP-39000) Added fix to not trigger validation for username and passowrd if CTA is disabled.
- [DTP-38777](https://jira.corp.entaingroup.com/browse/DTP-38777) Fixed vn-icon unique name from item name and created a new content template VnIcon.
- [DTP-38307](https://jira.corp.entaingroup.com/browse/DTP-38307) Added filtering for incoming request in OTEL tracing using key [AllowPathsIncoming](https://admin.dynacon.prod.env.works/services/198137/features/448292/keys/448399/valuematrix?_matchAncestors=true) and changed OTEL exporter url.
- [DTP-39257](https://jira.corp.entaingroup.com/browse/DTP-39257) Added fix for adding/editing meta tags.
- [DTP-38906](https://jira.corp.entaingroup.com/browse/DTP-38906) Added goToLastKnownProductAsync in navigation service.
- [DTP-40009](https://jira.corp.entaingroup.com/browse/DTP-40009) Fixed inconsistency of hiding footer.
- [DTP-42339](https://jira.corp.entaingroup.com/browse/DTP-42339) Fixed organization schema multilanguage showing only english from dslheadtag.
- Fixed pc-carousel now working properly with swiper initial options.
- [DTP-40792](https://jira.corp.entaingroup.com/browse/DTP-40792) Fixed ArgumentOutOfRangeException. 
- [DTP-43564](https://jira.corp.entaingroup.com/browse/DTP-43564) Fixed icon alignment issue of user name on login page.
- Fixed timer not updating in clock component.
- [DTP-42199](https://jira.corp.entaingroup.com/browse/DTP-42199) Fixed ds-button and offer-button as a link angular error and created offer-button-behavior.directive, anchor.directive to replace  plain-link component and offer-button component.[IMPORTANT] In order to use ds-button with plain-link behavior all products should replace the usage of plain-link.component with the new directive. The same applies to offer-button.component to be replaced with offer-button-behaviour.directive.
- [DTP-46801](https://jira.corp.entaingroup.com/browse/DTP-46801) Fixed ShowSuccessValidation for login component v3.
- [DTP-40581](https://jira.corp.entaingroup.com/browse/DTP-40581) Fixed button behavior component to show a ds-button from vnDynamicHTML.  
- [DTP-46212](https://jira.corp.entaingroup.com/browse/DTP-46212) Fixed anchor offer button to show as a ds button when status is offered.

### Vanilla 19.0.0

2024-04-05

**FEATURES**

- [DTP-33795](https://jira.corp.entaingroup.com/browse/DTP-33795) Added open telemetry with jaeger export endpoints for all products.
- [DTP-33739](https://jira.corp.entaingroup.com/browse/DTP-33739) Added UseSwitchMiddleware key in dynacon to disable use of WebAppContextSwitchMiddleware.
- [DTP-35499](https://jira.corp.entaingroup.com/browse/DTP-35499) [CX-3260](https://jira.corp.entaingroup.com/browse/CX-3260) Added an option to display different text for 'Remember Me' option on login page with the [proxy item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={EC101534-E9C7-4B9A-B3D1-7317F0092271}&la=).
- [DTP-35349](https://jira.corp.entaingroup.com/browse/DTP-35349) [DTP-34513](https://jira.corp.entaingroup.com/browse/DTP-34513) Added account menu version `5 (Customer Hub 2024)`.
  - Enable it in [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/198901/keys/254728/valuematrix?_matchAncestors=true) by setting version to `5`.
  - Please clone [Sitecore content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={B2FC40A0-3144-4520-9A69-7D197D21A31D}&la=) to label where you wan to enable `Customer hub 2024`.
- [POR-43766](https://jira.corp.entaingroup.com/browse/POR-43766) [CX-3332](https://jira.corp.entaingroup.com/browse/CX-3332) Added `UserPreHooksLoginEvent` user event that is triggered before post login hooks. It is triggered before `UserLoginEvent`.
- [DTP-34442](https://jira.corp.entaingroup.com/browse/dtp-34442) Removed `hammerjs` npm package and replaced it with `SwipeDirective` in `@frontend/vanilla/core` for gesture support.
- [DTP-35685](https://jira.corp.entaingroup.com/browse/DTP-35685) Expand `AppContextDynaConProvider` to works also for `DOC` requests using `Sec-Fetch-Dest` header.
- [DTP-35754](https://jira.corp.entaingroup.com/browse/DTP-35754) Append `parent` query string when opening quick deposit.
  - Please update [dynacon config](https://admin.dynacon.prod.env.works/services/198200/features/111635/keys/111686/valuematrix?_matchAncestors=true) with `parent` query string param, as we did for [test env](https://admin.dynacon.prod.env.works/changesets/270688).
- [DTP-34458](https://jira.corp.entaingroup.com/browse/DTP-34458) Added support for custom attributes for menu items.
  - Use `attr.` prefix for parameter key in the Sitecore item to add custom attributes to menu items ([example](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={79CF612D-7872-4A26-8190-CC0F6FF282E4}&la=)).

**FIXES**

- [DTP-34206](https://jira.corp.entaingroup.com/browse/DTP-34206) Fixed display of `PCCarouselComponent` component. INC1753418
- [DTP-34406](https://jira.corp.entaingroup.com/browse/DTP-34406) Moved styles from themes to vanilla components: footer, bottom-nav and label-switcher
- Fixed Balance endpoint renewing the session.
- [DTP-34510](https://jira.corp.entaingroup.com/browse/DTP-34510) Fixed web tracking of affordability level.
- [INC1462088](https://entain.service-now.com/esp?id=form&table=incident&filter=&sys_id=d00463861b512950be1a4339cd4bcbf9&v=) Prevent exposing of secret keys in `/health` and `/health/report` endpoints.
- [DTP-33104](https://jira.corp.entaingroup.com/browse/DTP-33104) Fixed displaying of the footer links for bots.
- [DTP-34514](https://jira.corp.entaingroup.com/browse/DTP-34514) Fixed actions for swiper dots navigation in acccount menu tour onboarding.
- [DTP-34486](https://jira.corp.entaingroup.com/browse/DTP-34486) Fixed adding ga trackings and parentURL only on domain change in navigation service.
- [DTP-34521](https://jira.corp.entaingroup.com/browse/DTP-34521) Fixed metrics url accessible only internally added AllowOnlyInternalAccessMiddleware.
- [DTP-34391](https://jira.corp.entaingroup.com/browse/DTP-34391) Prevent data layer tracking before `gtm.load` event.
- [DTP-35051](https://jira.corp.entaingroup.com/browse/DTP-35051) Fixed footer error on profile page.
- [DTP-34604](https://jira.corp.entaingroup.com/browse/DTP-34604) Fixed bottom nav redirection issue.
- [DTP-35587](https://jira.corp.entaingroup.com/browse/DTP-35587) Fixed quick deposit resizing.
- [DTP-25836](https://jira.corp.entaingroup.com/browse/DTP-25836) Updated `ngx-float-ui` npm package, which should resolve instances of positioning issues.
- [DTP-35392](https://jira.corp.entaingroup.com/browse/DTP-35392) Fixed footer appears two times.

### Vanilla 18.2.3

2024-06-25

- [DTP-37131](https://jira.corp.entaingroup.com/browse/DTP-37131) Remove logging of the autologin paramaters.
- Expose `SetLocalesPath` in  `IBootstrapAssetsContext` so custom locales path can be specified in case different from `Clientdist/locales`.

### Vanilla 18.2.2

2024-06-13

**FIXES**

- Fixed legacy authentication middleware not to prolong session when legacy cookie is expired.

### Vanilla 18.2.1

2024-06-05

- [POR-43766](https://jira.corp.entaingroup.com/browse/POR-43766) [CX-3332](https://jira.corp.entaingroup.com/browse/CX-3332) Added `UserPreHooksLoginEvent` user event that is triggered before post login hooks. It is triggered before `UserLoginEvent`.
- Try to fix thread blocking.

### Vanilla 18.2.0 [DO NOT ROLLOUT -  Session expiration issues]

2024-02-19

**FEATURES**

- [DTP-33048](https://jira.corp.entaingroup.com/browse/DTP-33048) [DTP-33157](https://jira.corp.entaingroup.com/browse/DTP-33157) Added [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/123694/keys/430904/valuematrix?_matchAncestors=true) for disabling calls to PPOS endpoints.
- [DTP-34092](https://jira.corp.entaingroup.com/browse/DTP-34092) Extended `logout-page` feature to support tracking configurable in [Sitecore](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={4E8F69F2-7745-44D4-84A5-D07FD9755A3C}&la=).

**FIXES**

- [DTP-32960](https://jira.corp.entaingroup.com/browse/DTP-32960) Fixed user greeting message in mlife banner for ac v1.
- Fixed MappedGeolocation endpoint renewing the session.
- [DTP-34191](https://jira.corp.entaingroup.com/browse/DTP-34191) Fixed incorrect display of session spent time.
- [DTP-33517](https://jira.corp.entaingroup.com/browse/DTP-33517) Fixed auto-logout for `session-time` feature when [LogoutMessage](https://admin.dynacon.prod.env.works/services/198137/features/201115/keys/280574/valuematrix?_matchAncestors=true) config is missing.
- [DTP-34201](https://jira.corp.entaingroup.com/browse/DTP-34201) Fixed sitecore template generator and added menuitemstatic template.
- [DTP-34175](https://jira.corp.entaingroup.com/browse/DTP-34175) Fixed UrlClicked value for logo click tracking.

### Vanilla 18.1.11

2024-08-23

**FIXES**

- Try fixing loading indicator issue. Reverted signals change.

### Vanilla 18.1.10

2024-08-20

**FIXES**

- Try fixing loading indicator issue. Removed onPush Changedetection.

### Vanilla 18.1.9

2024-08-02

**FIXES**

- [DTP-40120](https://jira.corp.entaingroup.com/browse/DTP-40120) Fixed loading indicator console error on navigation back.

### Vanilla 18.1.8

2024-07-23

- [DTP-38736](https://jira.corp.entaingroup.com/browse/DTP-38736) Remove `DnaId` from affordability request.

### Vanilla 18.1.7

2024-06-28

- [POR-43766](https://jira.corp.entaingroup.com/browse/POR-43766) [CX-3332](https://jira.corp.entaingroup.com/browse/CX-3332) Added `UserPreHooksLoginEvent` user event that is triggered before post login hooks. It is triggered before `UserLoginEvent`.

### Vanilla 18.1.6

2024-06-05

**FIXES**

- Fixed play-break-notification-overlay.component missing lsl24 and interceptor data.
- Try to fix blocking thread

### Vanilla 18.1.5

2024-04-24

**FIXES**

- Fixed play-break-notification-overlay.component missing cta and tracking update for lsl lsl24.
- [DTP-36771](https://jira.corp.entaingroup.com/browse/DTP-36771) Fixed DynaCon config filtering.

### Vanilla 18.1.4

2024-03-08

**FIXES**

- Fixed MappedGeolocation endpoint renewing the session.

### Vanilla 18.1.3

2024-03-08

**FIXES**

- Fixed play break overlay layout.

### Vanilla 18.1.2

2024-03-01

**FIXES**

- [DTP-34432](https://jira.corp.entaingroup.com/browse/DTP-34432) Fixed lsl and lsl24 play-break trackings to launch based on breaktype.
- Fixed contact section layout in play break feature.


### Vanilla 18.1.1

2024-02-23

**FIXES**

- [DTP-34191](https://jira.corp.entaingroup.com/browse/DTP-34191) Fixed incorrect display of session spent time.
- Fixed Balance endpoint renewing the session.
- Fixed legacy authentication middleware not to prolong session when legacy cookie is expired.

### Vanilla 18.1.0 [DO NOT ROLLOUT -  Session expiration issues]

2024-01-29

**FEATURES**

- [DTP-32216](https://jira.corp.entaingroup.com/browse/DTP-32216) Added jackpot-winner popup message on RTMS_GLOBAL_JP_WIN_INFO_EVENT.
- For products that are still not migrated to monorepo, please do following:
  - Add Frontend.Vanilla.Features project reference to your Frontend.$PRODUCT.Host
  - dotnet restore Frontend.$PRODUCT.Host/Frontend.$PRODUCT.Host.csproj
  - dotnet msbuild /t:FrontendVanillaFeaturesCopyModule Frontend.$PRODUCT.Host/Frontend.$PRODUCT.Host.csproj (This will generate DataProtection folder inside your Host project)
  - Add following section to your Frontend.$PRODUCT.Host/Frontend.$PRODUCT.Host.csproj to include newly generated folder during publish:
  ```
   <ItemGroup>
        <Content Include="DataProtection\**">
            <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
        </Content>
    </ItemGroup>
  ```
- [DTP-33103](https://jira.corp.entaingroup.com/browse/DTP-33103) Set `Secure` option flag on `vnauth` cookie always.
- [DTP-32959](https://jira.corp.entaingroup.com/browse/DTP-32959) proxy ClientDist requests to local dev server when mode is DevServer.

**FIXES**

- [DTP-25836](https://jira.corp.entaingroup.com/browse/DTP-25836) Fixed initial SDK login for Apple login provider.
- Fixed html vn class for new major `vn-18`.
- [DTP-32585](https://jira.corp.entaingroup.com/browse/DTP-32585) Fixed `enabledTracing` router options.
- [SPO-89913](https://jira.corp.entaingroup.com/browse/SPO-89913) Returned handling for `loyality banner` with account menu v1.
- Fix Redirex response headers deserialization.

### Vanilla 18.0.0 [DO NOT ROLLOUT IF YOUR PRODUCT IS OUTSIDE MONOREPO - MISSING AUTH PREREQUISITES]

2024-01-08

**HIGHLIGHTS**

- [DTP-31656](https://jira.corp.entaingroup.com/browse/DTP-31656) Added new authentication cookie `vnauth`. Legacy cookie `vauth` is still written when user logs in. This ensures consumers can independently rollout this version. In next major version we will remove `vauth` cookie completely. This change is needed because previously used algorithm to encode/decode this cookie is no longer considered secure and safe from application security perspective. This version needs to be rolled out as soon as possible to all labels and products. If this is not done, it will result in login incompatibility between different vanilla versions.
- Added `Open Telemetry support`. Read the info how to start using it [here](https://vie.git.bwinparty.com/vanilla/monorepo/-/wikis/guides/Open-Telemetry).

**FEATURES**

- Removed `NemID` login features specific for danish labels. It is no longer used in favour of MitID.
- [DTP-31241](https://jira.corp.entaingroup.com/browse/DTP-31241) Migrated to new angular control flow syntax.
- [DTP-31451](https://jira.corp.entaingroup.com/browse/DTP-31451) Fixed language switcher is not shown in prerender version.
- Changed signature of `toTotalTimeStringFormat()` in `ClockService` to accept options as object - `ClockOptions`.
  - e.g.: `clockService.toTotalTimeStringFormat(TimeSpan.fromSeconds(62), <ClockOptions>{ unitFormat: UnitFormat.Short, timeFormat: TimeFormat.MS, hideZeros: false })`.
- [DTP-31562](https://jira.corp.entaingroup.com/browse/DTP-31562)[DTP-31491](https://jira.corp.entaingroup.com/browse/DTP-31491) BetMGM loyalty banner (mlife) - An icon is shown based on the membership status.
- [DTP-31226](https://jira.corp.entaingroup.com/browse/DTP-31226) Added client-side [Affordability.EmploymentGroup](https://testweb.vanilla.intranet/health/dsl#Affordability.EmploymentGroup) DSL.
  - `/affordability` API is changed to `/affordability/snapshotdetails` (`[POST] AffordabilityController.SnapshotDetails()`).
- [DTP-31705](https://jira.corp.entaingroup.com/browse/DTP-31705) Modified date component day accept dates with zero and year accepts only numbers.
- [DTP-31701](https://jira.corp.entaingroup.com/browse/DTP-31701) Added tracking for offer-button component and anchor-tracking-helper-service in plain-link.
- [DTP-31555](https://jira.corp.entaingroup.com/browse/DTP-31555) Logout the user and redirect to the login page when RTMS events with the names `GAMPROTECT_ACCOUNT_MATCH` or `GAMSTOP_ACCOUNT_MATCH` are received.
  - Please ensure that `GAMPROTECT_ACCOUNT_MATCH` and `GAMSTOP_ACCOUNT_MATCH` are added to `rtms` section for the `rtms-events` feature in [lazy features](https://admin.dynacon.prod.env.works/services/198137/features/245375/keys/321595/valuematrix?_matchAncestors=true).
- [DTP-32078](https://jira.corp.entaingroup.com/browse/DTP-32078) Show toasts when rtms event with the name `COIN_FAV_GOAL_TOASTER_EVENT` is received.
  - Please ensure that `COIN_FAV_GOAL_TOASTER_EVENT` is added to `rtms` section for the `rtms-events` feature in [lazy features](https://admin.dynacon.prod.env.works/services/198137/features/245375/keys/321595/valuematrix?_matchAncestors=true).
  - Please ensure that the [toast](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={832CA7AB-6C0C-4BD4-BC5C-01C1001CF934}&la=) is cloned for every label where this feature will be utilized.
- [DTP-31395](https://jira.corp.entaingroup.com/browse/DTP-31395) Added additional property `ConditionResultType` in `SuccessDocument` that can be used to identify if content retrieved had a DSL condition based on the result type:
  - `FullOnServer`: Condition existent and it was evaluated fully on server.
  - `PartialForClient`: Condition existent and it was partially evaluated on server.
  - `null`: No condition specified in the Sitecore item.
      - If condition was evaluated fully on server to false, item returned is of type `FilteredContent` instead of `SuccessDocument` so this can also be used to identify items with DSL conditions.
- Removed `partnerSessionId` from `POST_LOGIN` CCB event parameters. Use `postLoginValues.partnerSessionUid` instead.
- [DTP-31999](https://jira.corp.entaingroup.com/browse/DTP-31999) Implemented a server-side option to redirect unauthenticated users to the login page if the requested URL requires authentication.
  - If the requested URL matches the regex pattern in the [Dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/204997/keys/427525/valuematrix?_matchAncestors=true) and the user is unauthenticated, they will be redirected to the login page with a status code of **302**.
- [DTP-32181](https://jira.corp.entaingroup.com/browse/DTP-32181) Extended Betting api request builder to use current TimeoutRules configuration.
- [DTP-30136](https://jira.corp.entaingroup.com/browse/DTP-30136) [ngx-popperjs](https://github.com/tonysamperi/ngx-popperjs) npm package is replaced with [ngx-float-ui](https://github.com/tonysamperi/ngx-float-ui).
  - Use `[floatUi]="popper.content"` instead of `[popper]="popper.content"`.

**FIXES**

- [DTP-31282](https://jira.corp.entaingroup.com/browse/DTP-31282) Fixed missing swiper activeIndexChange event on onboarding tasks.
- [DTP-31296](https://jira.corp.entaingroup.com/browse/DTP-31296) Fixed app crashed when recording enabled on health/log page.
- [DTP-31243](https://jira.corp.entaingroup.com/browse/DTP-31243) Disable login button on login page when login form invalid and [dynacon toggle enabled](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/422470/valuematrix?_matchAncestors=true).
- [DTP-31483](https://jira.corp.entaingroup.com/browse/DTP-31483) Fixed inbox close if locationChange happens.
- INC1693353 Fixed `/login` pages returning 401 for bots when accessed directly.
- [DTP-31735](https://jira.corp.entaingroup.com/browse/DTP-31735) BetMGM loyalty banner (mlife) - Show the first letter of the username and membership status in capital letters.
- [DTP-31493](https://jira.corp.entaingroup.com/browse/DTP-31493) Fixed rtms overlay `Claim now` button.
- [DTP-31410](https://jira.corp.entaingroup.com/browse/DTP-31410) Bug fixed to scroll on section when click on anchor tag link.
- [DTP-31309](https://jira.corp.entaingroup.com/browse/DTP-31309) Fixed missing hub tour task.
- [DTP-31700](https://jira.corp.entaingroup.com/browse/DTP-31700) Fixed navigation service not to append _ga value if null.
- [DTP-31838](https://jira.corp.entaingroup.com/browse/DTP-31838) Fixed failing api call of playbreak acknowledge.
- [INC1713097](https://entain.service-now.com/esp?id=e_form&table=incident&sys_id=d7e7ab01871bf910a2faea0e8bbb35e5&recordUrl=incident.do%3Fsys_id%3Dd7e7ab01871bf910a2faea0e8bbb35e5&sysparm_stack=&sysparm_view=) Fixed login with URL when SDK authentication is disabled.
- [WAL-8426](https://jira.corp.entaingroup.com/browse/WAL-8426) Queue and show multiple toastr messages with the same name.
- INC1715860 Fixed content flickering when navigating between pages.
- [DTP-31903](https://jira.corp.entaingroup.com/browse/DTP-31903) Fixed x-bwin-${options.product}-api header to be set on same domain only.

**BREAKING CHANGES**

- [SPO-2073] ng-lazyload-image dependency removed
  - `LazyLoadImageModule` was removed from the third party core integration
  - Products don't need to install `ng-lazyload-image` anymore

### Vanilla 17.4.8

2024-01-31

**FIXES**

- Fixed `affordabilitylevel` endpoint.

### Vanilla 17.4.7

2024-01-30

**FIXES**

- [DTP-32960](https://jira.corp.entaingroup.com/browse/DTP-32960) Fixed user greeting message in mlife banner for ac v1.
- Fixed MappedGeolocation endpoint renewing the session.

### Vanilla 17.4.6

2024-01-22

**FIXES**

- Fixed `vn-swiper` performance issue.
- [SPO-89913](https://jira.corp.entaingroup.com/browse/SPO-89913) Returned handling for `loyality banner` with account menu v1.
- Fixed session timeout not working on mobile browsers when in background.

### Vanilla 17.4.5

2024-01-19

- INC1730964 - Fixed client app `FileServer` mode to return 404 when requested file is not found in cdn.

### Vanilla 17.4.4

2023-01-16

- [WAL-8426](https://jira.corp.entaingroup.com/browse/WAL-8426) Queue and show multiple toastr messages with the same name.
- [DTP-31838](https://jira.corp.entaingroup.com/browse/DTP-31838) Fixed failing api call of playbreak acknowledge.

### Vanilla 17.4.3

2024-01-03

- [DTP-31562](https://jira.corp.entaingroup.com/browse/DTP-31562)[DTP-31491](https://jira.corp.entaingroup.com/browse/DTP-31491) BetMGM loyalty banner (mlife) - An icon is shown based on the membership status.
- [DTP-DTP-31735](https://jira.corp.entaingroup.com/browse/DTP-31735) BetMGM loyalty banner (mlife) - Show the first letter of the username and membership status in capital letters.

### Vanilla 17.4.2

2023-12-29

**FIXES**

- [INC1713097](https://entain.service-now.com/esp?id=e_form&table=incident&sys_id=d7e7ab01871bf910a2faea0e8bbb35e5&recordUrl=incident.do%3Fsys_id%3Dd7e7ab01871bf910a2faea0e8bbb35e5&sysparm_stack=&sysparm_view=) Fixed login with URL when SDK authentication is disabled.

### Vanilla 17.4.1

2023-12-06

**FIXES**

- [DTP-31296](https://jira.corp.entaingroup.com/browse/DTP-31296) Fixed app crashed when recording enabled on health/log page.

### Vanilla 17.4.0 [DO NOT ROLLOUT - Request dynacon variation context when recording on health/log page is enabled can break the app]

2023-11-29

**HIGHLIGHTS**

- Updated to `.net8`.
- Updated `angular` to `17.0.x`.
- Make sure to run `dotnet msbuild /t:FrontendHostCopyModule Frontend.$PRODUCT.Host/Frontend.$PRODUCT.Host.csproj`, so that `CompanyInternalNetworkSubnetsFallbackFile` entry is added into `appsettings.json`. [Example](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/main/backend/vanilla/Frontend.Host/appsettings.json#L8).

**FEATURES**

- Added `Frontend CDN` critical health check.
- [DTP-29188](https://jira.corp.entaingroup.com/browse/DTP-29188) Added possibility to disable `vn-swiper` pagination via `showPagination` input.
- [DTP-26378](https://jira.corp.entaingroup.com/browse/DTP-26378) Added new component `vn-icon` for loading svg icons. Products must add @push-based/ngx-fast-svg plugin.
- [DTP-127](https://jira.corp.entaingroup.com/browse/DTP-127) Added timings of individual `client configs` into response header `server-timing`, as well as total timing of them.
- Added `type` parameter to TagManagerservice load method to specify custom script types.
- [DTP-30347] Removed sensitive information from client config exception message.
- [DTP-30352](https://jira.corp.entaingroup.com/browse/DTP-30352) Added a `Request` Dynacon context provider, with dynacon variation context values:
  - `Internal` - indicates that the request is comming from the internal network.
  - `External`- indicates that the request is comming the from external network.
- [DTP-31085](https://jira.corp.entaingroup.com/browse/DTP-31085) Added LOGIN_INFO logs to kibana for login actions.
- [BETMGMCFT-2219](https://jira.corp.entaingroup.com/browse/BETMGMCFT-2219) Redesign offer button.
  - New version can be enabled in [dynacon](https://admin.dynacon.prod.env.works/services/198137/features/200843/keys/421805/valuematrix?_matchAncestors=true).
  - For version 2, offer button classes are added in [content](https://vie.git.bwinparty.com/vanilla/monorepo/-/edit/main/packages/vanilla/CHANGELOG.md?ref_type=heads).
  - Offer icon classes are added in [content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={F5DC6F09-76ED-4BF4-81C1-9655D14E3C64}&la=).

**FIXES**

- Fixed `StyleService` and `ScriptService` load to await assets initialization.
- [DTP-29703](https://jira.corp.entaingroup.com/browse/DTP-29703) Added page loader on offer history page.
- [DTP-29668](https://jira.corp.entaingroup.com/browse/DTP-29668) Fixes Prerender exclude pattern logic.
- Fixed wrong product resolved when shared features enabled.
  - `X-From-Product` will take precedence over Dynacon product.
  - Adjusted App.Product DSL to use same logic.
- [DTP-29772](https://jira.corp.entaingroup.com/browse/DTP-29772) Fixed default language culture for linux when is empty.
- [DTP-25839](https://jira.corp.entaingroup.com/browse/DTP-25839) Fixed displaying of the balance formula.
- [DTP-25839](https://jira.corp.entaingroup.com/browse/DTP-25839) Fixed login with providers when `sdkLogin` is enabled.
  - `LoginWithProvidersService` is now `LoginProvidersService` and moved to `@frontend/vanilla/shared/login-providers` - use `sdkAuth()` and `urlAuth()` to invoke authentication.
  - `WorkflowResponse` and `WorkflowHandleResponse` models are now exported from `@frontend/vanilla/core`.
- [DTP-30361](https://jira.corp.entaingroup.com/browse/DTP-30361) Fixed image rendering width and height as `NaN` issue.
- FIxed `vanilla-router` after Angular router changes.

### Vanilla 17.3.9

2023-12-15

- [DTP-31562](https://jira.corp.entaingroup.com/browse/DTP-31562)[DTP-31491](https://jira.corp.entaingroup.com/browse/DTP-31491) BetMGM loyalty banner (mlife) - An icon is shown based on the membership status.
- [DTP-31735](https://jira.corp.entaingroup.com/browse/DTP-31735) BetMGM loyalty banner (mlife) - Show the first letter of the username and membership status in capital letters.
- [DTP-31493](https://jira.corp.entaingroup.com/browse/DTP-31493) Fixed rtms overlay `Claim now` button.

### Vanilla 17.3.8

2023-12-12

**FIXES**

- Updated swiper next tour action on account-menu-onboarding-overlay component.

### Vanilla 17.3.7

2023-12-11

**FIXES**

- Updated account-menu-onboarding-overlay component swiper action.

### Vanilla 17.3.6

2023-12-11

**FIXES**

- Updated account balance breakdown swiper slidechanged action.


### Vanilla 17.3.5

2023-12-07

**FIXES**

- Updated to swiper 11.0.5 and reworked swiper configs on action and button initialization in account menu onboarding and balance breakdown.

### Vanilla 17.3.4

2023-12-06

**FIXES**

- [DTP-31282](https://jira.corp.entaingroup.com/browse/DTP-31282) Added missing swiper activeIndexChange event on onboarding tasks.
- [DTP-31046](https://jira.corp.entaingroup.com/browse/DTP-31046) Fixed slider change event on BalanceBreakdownSliderComponent.


### Vanilla 17.3.3

2023-11-13

**FEATURES**

- Added `type` parameter to TagManagerservice load method to specify custom script types.

### Vanilla 17.3.2

2023-11-10

**FIXES**

- [DTP-29922](https://jira.corp.entaingroup.com/browse/DTP-29922) Fixed loading indicator not showing up.

### Vanilla 17.3.1

2023-11-02

**FIXES**

- Fixed `StyleService` and `ScriptService` load to await assets initialization.
- [DTP-29690](https://jira.corp.entaingroup.com/browse/DTP-29690) Fixed cross product layout component.

### Vanilla 17.3.0

2023-10-30

**FIXES**

- [DTP-25839](https://jira.corp.entaingroup.com/browse/DTP-25839) Fixed loading indicator handler instances not properly disposed when stopped.
- [DTP-28921](https://jira.corp.entaingroup.com/browse/DTP-28921) Adjusted manual click on inactivity screen logout button to always redirect the user to the login page.
- Fixed text content not rendering inside of `a` tag within pc components.

### Vanilla 17.2.0

2023-10-27

**FEATURES**

- [DTP-28608](https://jira.corp.entaingroup.com/browse/DTP-28608) Added endpoint `/site/versionxml` accessible only from internal company network, which outputs content of file `srvadm/version.xml`.
- [DTP-27588](https://jira.corp.entaingroup.com/browse/DTP-27588) Added new design for BetMGM loyalty banner in account menu(`mlife rewards`). [Dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/198901/keys/415022/valuematrix?_matchAncestors=true) for enabling new design.
- [DTP-28453](https://jira.corp.entaingroup.com/browse/DTP-28453) Utilize [ScrollBehaviorEnabledCondition](https://admin.dynacon.prod.env.works/services/198137/features/198454/keys/237837/valuematrix?_matchAncestors=true) configuration to toggle scroll position restoration.
- [DTP-28904](https://jira.corp.entaingroup.com/browse/DTP-28904) Changed api endpoint from `SetPlayerArea` to `PlayerArea`.
- [DTP-29046](https://jira.corp.entaingroup.com/browse/DTP-29046) Extend reCaptcha assessments with `User Agent`, `JA3 Hash` and client `IP Address`.
  - Added [DynaCon config](https://admin.dynacon.prod.env.works/services/198137/features/122236/keys/416119/valuematrix?_matchAncestors=true) to include client IP address.
- [DTP-28109](https://jira.corp.entaingroup.com/browse/DTP-28109) Added `smartUrlOverride` query parameter consisting `product|request_hostname` for the Sitecore REST API request.

***One host initiative***

- Removed `ClientAppOptions.Product` as it got deprecated over time and not used.
- Added option `forwardProductApiRequestHeader` with default value `true`, when using `ApiServiceFactory.create or ApiServiceFactory.createForProduct` methods. This adds additional request header in format `x-bwin-{product}-api` with value of current environment. This request header will later be used as load balancer rule to correctly forward requests to actual product-api application (instead of host application). No action is needed on consumer side related to this change.

**FIXES**

- Fixed Distributed Cache issue introduced in `17.0.0``.
- [DTP-28526](https://jira.corp.entaingroup.com/browse/DTP-28526) Fixed client response cache. If you register response caching middleware `(app.UseResponseCaching())` on your application please remove as we do it now from Vanilla.
- [DTP-28468](https://jira.corp.entaingroup.com/browse/DTP-28468) Fixed incorrect loading of the new visitor page.
- [DTP-27881](https://jira.corp.entaingroup.com/browse/DTP-27881) .NET CORE set Auth cookie(`vauth`) with `SameSite` set to `Lax` and that introduced issue when opening iframe in casino product. Added [dyancon option](https://admin.dynacon.prod.env.works/services/198137/features/160506/keys/415572/valuematrix?_matchAncestors=true) to override `SameSite` for auth cookie.
- Fixed smart banner API call failing.
- [DTP-27690](https://jira.corp.entaingroup.com/browse/DTP-27690) Logout user upon receiving `LOGOUT` CCB from native when user is not fully authenticated (in workflow).
- [DTP-28939](https://jira.corp.entaingroup.com/browse/DTP-28939) Fixed track menu item click when target is set.
- [INC1598099](https://entain.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3Da88899491becf9900804ea42604bcb74%26sysparm_stack%3D%26sysparm_view%3D) Fixed redirect to hidden language after login.
- [DTP-28780](https://jira.corp.entaingroup.com/browse/DTP-28780) Added configurable message when username or password are missing on login attempt.
  - Message can be configured from Sitecore: `Required` key in the [Login template](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={F2B88473-0373-4B8B-A3CF-F2D439C796FF}&la=).
- Skip http interceptor login redirection when 401 is returned from external APIs. Related to `INC1646952`.

### Vanilla 17.1.0 [DO NOT ROLLOUT - Distributed Cache Issue]

2023-10-10

*FRONTEND*

**FIXES**

- Fixed header not showing when header version is set to 1, because `productItems` in header config are missing.
- [DTP-28529](https://jira.corp.entaingroup.com/browse/DTP-28529) Fixed label switcher config error in footer.
- [DTP-28527](https://jira.corp.entaingroup.com/browse/DTP-28527) Fixed errors related to legacy token extraction.

*BACKEND*

***One host initiative***

- Make sure to run following host msbuild target `always` when updating your Host project:
```
dotnet restore Frontend.$PRODUCT.Host/Frontend.$PRODUCT.Host.csproj
dotnet msbuild /t:FrontendHostCopyModule Frontend.$PRODUCT.Host/Frontend.$PRODUCT.Host.csproj
```

- [DTP-28443](https://jira.corp.entaingroup.com/browse/DTP-28443)
  - Allow configurable `clientconfig` request [Headers](https://admin.dynacon.prod.env.works/services/198137/features/158854/keys/414791/valuematrix?_matchAncestors=true). As of now, you don't need to make any changes to this configuration.
  - Merge server side view features to one `Index.cshtml`.
  - Utilize async view methods.

**FIXES**

- [DTP-27820](https://jira.corp.entaingroup.com/browse/DTP-27820) Fix client response cache control filter.

### Vanilla 17.0.0 [DO NOT ROLLOUT - Distributed Cache Issue]

2023-10-06

**BREAKING CHANGES**

*BACKEND*

- Namespace has been adjusted throughout all vanilla packages from `Bwin.Vanilla` to `Frontend.Vanilla`. You can edit/replace (`using Bwin.Vanilla.` -> `using Frontend.Vanilla.`).
- [DTP-27065](https://jira.corp.entaingroup.com/browse/DTP-27065) Preparations to single host (one host) initiative. Read how to update [here](https://vie.git.bwinparty.com/vanilla/monorepo/-/wikis/guides/one-host).
- `GetThirdParty` is removed from `BonusBalanceDslProvider`.
- `CookieConstants.CurrentDomain` is now nullable.
- `status` property is removed from `AffordabilityService`. Use `affordabilityStatus` instead, and `load` to fetch the Affordability status when needed.
- `getInitData` method is removed from `PlayerGamingDeclarationService`. Use `PlayerGamingDeclarationConfig` instead.
- `showCloseLink` input is removed from `PopperContentComponent`. Use `closeType` instead.
- `status` property is removed from `KycStatusService`. Use `kycStatus` instead, and `refresh` to fetch the KYC status when needed.

*FRONTEND*

- [DTP-26382](https://jira.corp.entaingroup.com/browse/DTP-26382) Added option to decorate client config calls with caller product.
  - Added [ClientConfigOptions](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/main/packages/vanilla/lib/core/src/client-config/client-config.model.ts#L18) that should replace `key` parameter in `ClientConfig` and `LazyClientConfig` function usage.
  - Products should replace `key` parameter in [ClientConfig](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/main/packages/vanilla/lib/core/src/client-config/client-config.decorator.ts#L46) and [LazyClientConfig](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/main/packages/vanilla/lib/core/src/lazy/lazy-client-config.decorator.ts#L24) with `ClientConfigOptions`.
  - [ClientConfigProductName](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/main/packages/vanilla/lib/core/src/client-config/client-config.decorator.ts#L12) enum can be used to pass `product` property of `ClientConfigOptions`. Example: [SmartBannerConfig](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/main/packages/vanilla/lib/features/smart-banner/src/smart-banner.client-config.ts#L12)

**HIGHLIGHTS**

- Updated `angular` to `16.2.6`.
- Updated `swiper` to `10.3.0`.

**FEATURES**

- Added operating-system-specific support for configuration system (`appsettings*.json files`). Docs [here](https://vie.git.bwinparty.com/vanilla/monorepo/-/wikis/infrastructure/configuration).
- Added response caching compression level options configurable [here](https://admin.dynacon.prod.env.works/services/198137/features/213638/keys/413699/valuematrix?_matchAncestors=true). Previously `Fastest` level was used always.
- [DTP-27691](https://jira.corp.entaingroup.com/browse/DTP-27691) Backend/frontend decoupling - added dynacon option to specify [ExactVersion](https://admin.dynacon.prod.env.works/services/198137/features/402905/keys/413537/valuematrix?_matchAncestors=true).
- [DTP-26659](https://jira.corp.entaingroup.com/browse/DTP-26659) Added an ability to resolve current label when specified at start of host string i.e. `nj.betmgm.com.ns.cluster.dev.k8s.env.works`. To opt into this behavior, configure environment variable `VANILLA_HOST_STARTS_WITH_LABEL_ENABLED` with value `True`.
- [DTP-26527](https://jira.corp.entaingroup.com/browse/DTP-26527) Added option to send custom event CCB name by adding `ccb-event-name` parameter to menu item.
- [DTP-26744](https://jira.corp.entaingroup.com/browse/DTP-26744) Added tracking for anchor element in login duration.
- [DTP-26422](https://jira.corp.entaingroup.com/browse/DTP-26422) Added x-vanilla-id token for login. Configurable in [dynacon](https://admin.dynacon.prod.env.works/services/198137/features/122037/keys/412587/valuematrix?_matchAncestors=true).
- `sendToNative` exposed via vanillaAppExport.
- [DTP-27495](https://jira.corp.entaingroup.com/browse/DTP-27495) Added support for `UserAgent.WebPageTest` dynacon variation context value. Added handling in PrerenderMiddleware to skip it when URL contains `skipPrerender` query param for future cases.
- [DTP-27903](https://jira.corp.entaingroup.com/browse/DTP-27903) Added `allow="payment"` attribute to cashier iframe.
- [DTP-26330](https://jira.corp.entaingroup.com/browse/DTP-26330) Added possibility to cache `vnSmartBanner` client config call.

**FIXES**

- INC1619153; INC1620025 Removed usage of `Array.at()` function.
- Fix swipe scroll freeze for IOS device.(Removed hammerjs pan configuration in account menu drawer. Products have to set all direction for swipe).
- Changed single sign-on cookie name from `ssoToken` to `ssoTokenCrossDomain`.
- [DTP-25836](https://jira.corp.entaingroup.com/browse/DTP-25836) Fixed click action for some menu items.
- [DTP-27141](https://jira.corp.entaingroup.com/browse/DTP-27141) Fixed removed miliseconds when comparing changeset.validFrom with clock.UtcNow.
- [DTP-27346](https://jira.corp.entaingroup.com/browse/DTP-27346) [DTP-27685](https://jira.corp.entaingroup.com/browse/DTP-27685) Fixed link tracking for both components with PlainLinkInsideComponent.
- Fixed Serilog configuration on .Net6/7 as some classes were not writing logs to the file, therefore not showing on Kibana.

### Vanilla 16.7.0

2023-08-31

**HIGHLIGHTS**

- Downgraded `angular` to `16.1.0`.

**FEATURES**

- [DTP-26407](https://jira.corp.entaingroup.com/browse/DTP-26407) Added account menu text widget.
  - Sitecore item: http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={5E509F35-AB2B-4528-B84E-B50B435960D5}&la=.

### Vanilla 16.6.0 [DO NOT ROLLOUT - Angular minor upgrade along with useDefineForClassFields breaks some clientconfig execution]

2023-08-29

**HIGHLIGHTS**

- [DTP-23657](https://jira.corp.entaingroup.com/browse/DTP-23657) Added the feature to decouple rollout of server and client side application. Read `ClientApp` configuration [documentation here](https://admin.dynacon.prod.env.works/services/198137/features/402905). We have laid out initial support for this initiative. It is still not production ready because we need to figure out production hosting details. As of now you can give it a try on test environment.
  - Instead of  `IBootstrapAssetsContext.IsWebpackDevServerUsed` use `IBootstrapAssetsContext.Mode == ClientAppMode.DevServer`
  - Register server settings: `services.AddSingleton(new ClientAppOptions("your product name here", new ClientAppVersion(x, y, z)));`
  - You need to adjust your client CI/CD pipeline to upload your client app artifacts to our CDN (contact us for more details around this). This will likely to change once we know more on production hosting details.
- [DTP-24991](https://jira.corp.entaingroup.com/browse/DTP-24991) Removed `xplatform` api that was used in the past as a bridge between legacy .NET framework and .NET CORE
  - Instead of `IXPlatformHttpContextAccessor` use `IHttpContextAccessor`.
  - Instead of `IXPlatformHttpContext` use `HttpContext`.
  - Instead of `XPlatformMiddleware` use `Middleware`.
  - Instead of `XPlatformRequestDelegate` use `RequestDelegate`.
  - Modify your `Startup.cs` and add:
  ```
  protected override void ConfigureApp(IApplicationBuilder app)
  {
    app.ConfigureHost();
  }
  ```
  - Instead of registering your middleware(s) inside
  ```
  services.AddMiddlewares<MiddlewareStage.ProductAfterRoutingAndAuthentication>(appBuilder =>
  {
    appBuilder.UseMiddleware<SampleMiddleware>();
  });
  ```
  register them in `Startup.cs` like this:
    ```
  protected override void ConfigureApp(IApplicationBuilder app)
  {
    app.ConfigureHost();
    app.UseMiddleware<SampleMiddleware>();
  }
  ```

  - Updated `angular` to `16.2.1`.

**FEATURES**

- [DTP-23549](https://jira.corp.entaingroup.com/browse/DTP-23549) reCAPTCHA Enterprise version is updated to `v1` (_previously `v1beta1`_).
  - Base API URL containing the version is now in DynaCon: https://admin.dynacon.prod.env.works/services/198137/features/122236/keys/407960/valuematrix.
  - `Reasons` and `Score` are now encapsulated in `RiskAnalysis` for `Bwin.Vanilla.Features.ReCaptcha.ReCaptchaAssessment` response.
- `INC1591727` - added support for `UserAgent.Catchpoint` dynacon variation context value.
- [DTP-26212](https://jira.corp.entaingroup.com/browse/DTP-26212) `IBrotliCompressor` uses .NET7 Brotli instead Brotli.NET
- [DTP-24229](https://jira.corp.entaingroup.com/browse/DTP-24229) Added tracking when user toggle close in product menu.
- [DTP-23556](https://jira.corp.entaingroup.com/browse/DTP-23556) Removed top position for customer hub drawer.
- [DTP-24995](https://jira.corp.entaingroup.com/browse/DTP-24995) Added css class name map for title from sitecore for navigation layout version 1 and 4.
- [DTP-25727](https://jira.corp.entaingroup.com/browse/DTP-25727) Added [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/122030/keys/407754/valuematrix?_matchAncestors=true#407776) for setting up footer section expandable icons.
- [DTP-23514](https://jira.corp.entaingroup.com/browse/DTP-23514) Added possibility to configure play break timer component CSS class from Sitecore: http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={E6289AEE-E947-4203-A727-2DDF5889C631}&la=.
  - Use `cssClass` key to configure `vn-play-break-timer` class.
  - Use `cssStyle` key to configure inner container styles.

**FIXES**

- Removed inbox image aspect ratio. Will be set on themes.
- [DTP-25333](https://jira.corp.entaingroup.com/browse/DTP-25333) [DTP-25158](https://jira.corp.entaingroup.com/browse/DTP-25158)  Send `SensitivePage` CCB event when the inbox is opened as a route.
- Fixed header balance amount issue.
- Fixed header flickering issue.
- [DTP-25865](https://jira.corp.entaingroup.com/browse/DTP-25865) Fixed session info overlay not responsive when user is unauthenticated.
- [DTP-25883](https://jira.corp.entaingroup.com/browse/DTP-25883) Fixed remove play button from adhoc template task.
- [DTP-26266](https://jira.corp.entaingroup.com/browse/DTP-26266) Fixed resetting of the terminal after inactivity.

### Vanilla 16.5.0

2023-08-10

**HIGHLIGHTS**

- [DTP-24990](https://jira.corp.entaingroup.com/browse/DTP-24990) Added API endpoint `/docs` accessible only from internal network which shows  `Swagger API documentation` for running application. You can use this page to view/test/invoke all available APIs. If you need to be authenticated you can login before visiting this page.
  - `VanillaAppStartup` expects now `VanillaServicesOptions` to be passed via constructor. Use `VanillaServicesOptions.ApiDocsInfo` to configure information showed on API docs page. Example [here](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/main/Frontend.TestWeb.Host/Startup.cs#L11).
  - Pass `Options` when registering host services: `services.AddHostServices() -> services.AddHostServices(Options)` like [here](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/main/Frontend.TestWeb.Host/Startup.cs#L26).

**FEATURES**

- [DTP-24549](https://jira.corp.entaingroup.com/browse/DTP-24549) Enable support of plain text for all menu items.
  - Set `type: text` parameter to enable. [Example item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={A203FF97-5321-444C-99E0-5C0913BD0285}&la=).
- [DTP-24374](https://jira.corp.entaingroup.com/browse/DTP-24374) Enable support of static poster for Cloudflare video component.
  - Set `poster` parameter to enable. [Example item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={9201349F-EB2D-4A9A-92CB-3E28FE9EC7C2}&la=).
- [DTP-25376](https://jira.corp.entaingroup.com/browse/DTP-25376) Added option to specify default headers with `ApiBase` and added request header `x-bwin-sf-api` with value of current environment when shared-features-api is enabled.
- [DTP-24229](https://jira.corp.entaingroup.com/browse/DTP-24229) Added tracking when user toggle close in product menu.

**FIXES**

- Fixed header issue.
- Fixed `path` issues surfacing when running app on non-windows environment.
- [DTP-17307](https://jira.corp.entaingroup.com/browse/DTP-17307) Prevent exceptions when interacting with session info overlay while unauthenticated.
- [DTP-23542](https://jira.corp.entaingroup.com/browse/DTP-23542) Fixed video auto-play.
  - _**Note**: According the the [browser policies](https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide#autoplay_availability), auto-playing with sound is not supported._
- [DTP-24868](https://jira.corp.entaingroup.com/browse/DTP-24868) Fixes language resolution for Robots.
- [DTP-25391](https://jira.corp.entaingroup.com/browse/DTP-25391) `Cookie DSL Get` provider will return encoded value for cookie names in [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/160506/keys/406579/valuematrix?_matchAncestors=true).
  - Discard changes done with a [DTP-24016](https://jira.corp.entaingroup.com/browse/DTP-24016) to fix issue with Sitecore web editor override resolver and cookie `SitecoreEditor`.

### Vanilla 16.4.0

2023-08-04

**HIGHLIGHTS**

- [DTP-19678](https://jira.corp.entaingroup.com/browse/DTP-19678) Updated to `.NET7`. Update your `TargetFramework` to `<TargetFramework>net7.0</TargetFramework>`.

### Vanilla 16.3.2

2023-08-16

- Fixed header flickering issue.
- [DTP-25391](https://jira.corp.entaingroup.com/browse/DTP-25391) `Cookie DSL Get` provider will return encoded value for cookie names in [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/160506/keys/406579/valuematrix?_matchAncestors=true).
  - Discard changes done with a [DTP-24016](https://jira.corp.entaingroup.com/browse/DTP-24016) to fix issue with Sitecore web editor override resolver and cookie `SitecoreEditor`.
- Fixed header balance amount issue.

### Vanilla 16.3.1

2023-08-07

- Fixed header issue.

### Vanilla 16.3.0

2023-08-03

**FEATURES**

- [DTP-22085](https://jira.corp.entaingroup.com/browse/DTP-22085) Enhanced session info overlay display
  - Show session info overlay in new tab without responding to RCPU in tab-1.
  - Show session info overlay in new window without responding to RCPU in tab-1.
  - Show session info overlay on page refresh without responding to RCPU previously in same tab.
  - Set strategy to `loggedin` for `session-info` feature in this [config](https://admin.dynacon.prod.env.works/services/198137/features/245375/keys/321595/valuematrix?_matchAncestors=true) if not already set.

**FIXES**

- [DTP-23993](https://jira.corp.entaingroup.com/browse/DTP-23993) Fixed displaying of error message in the login page on auto-logout.

### Vanilla 16.2.0

2023-08-03

**HIGHLIGHTS**

- `Health` pages updated to `.net6 blazor`.
- Vanilla nuget packages have been renamed from `Bwin.Vanilla.*` to `Frontend.Vanilla.*`.
Nuget packages  `Frontend.Vanilla.DotNetCore` and `Bwin.Vanilla.Features` are no longer released. They are merged into new `Frontend.Vanilla.Features` nuget package which you should use from now on.

**FEATURES**

- [DTP-22827](https://jira.corp.entaingroup.com/browse/DTP-22827) Gamification coin animation on balance change.
- [DTP-24720](https://jira.corp.entaingroup.com/browse/DTP-24720) Added shopId to tracking data.

**FIXES**

- [DTP-24013](https://jira.corp.entaingroup.com/browse/DTP-24022) Fixed flex layout replacement issues.
  - Removed 'portal-center-wrapper' parent div from customer hub main layout and nested it in balance-breakdown-iems. **note:** please use Themes version 11.53.0.
  - Changed display flex to block for the account menu v2 (in the navigation page).
- Fixed expanding of left menu on navigation layout v3.
- [DTP-23532](https://jira.corp.entaingroup.com/browse/DTP-23532) Fixed language switcher v2 to show radio instead of cdk overlay.


### Vanilla 16.1.3

2023-07-26

**FIXES**

- Fixed expanding of left menu on navigation layout v3.

### Vanilla 16.1.2

2023-07-25

**FIXES**

- [DTP-24013](https://jira.corp.entaingroup.com/browse/DTP-24022) [DTP-23935](https://jira.corp.entaingroup.com/browse/DTP-23935) Fixed flex layout replacement issues
  - Removed 'portal-center-wrapper' parent div from customer hub main layout and nested it in balance-breakdown-iems. **note:** please use Themes version 11.53.0.
  - Changed display flex to block for the account menu v2 (in the navigation page)

### Vanilla 16.1.1

2023-07-25

**FIXES**

- Fix new user overlay components loading issue.
- The format `dd/MM/yyyy hh:mm:ss tt_CET` is now supported for Inbox and RTMS messages sent from the platform.
- [DTP-23561](https://jira.corp.entaingroup.com/browse/DTP-23561) [DTP-23720](https://jira.corp.entaingroup.com/browse/DTP-23720) [DTP-23662](https://jira.corp.entaingroup.com/browse/DTP-23662) Fixed flex layout in navigation layout component v1 and v4.
- [DTP-22600](https://jira.corp.entaingroup.com/browse/DTP-22600) Bypass anti forgery token validation for AsyncDslController.
- [DTP-23838](https://jira.corp.entaingroup.com/browse/DTP-23838) Fixed inconsistent countdown in play break timer component.
- [DTP-23839](https://jira.corp.entaingroup.com/browse/DTP-23839) Fixed play break timer being visible after the time runs out.
- [DTP-23902](https://jira.corp.entaingroup.com/browse/DTP-23902) Fixed date of birth input validation.
- Changed inactivity feature to redirect to login with full page refresh.
- [DTP-23942](https://jira.corp.entaingroup.com/browse/DTP-23942) Added separate Sitecore item for Play Break (LSL24 hrs) start selection options: http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={EFEEF29D-C2FC-438D-A281-2A9939DDC60E}&la=.
- [DTP-23944](https://jira.corp.entaingroup.com/browse/DTP-23944) Added possibility to toggle the Live Chat button for Play Break by removing `ChatButtonText` value from Sitecore item:
  - LSL: http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={8447C3A2-697F-4367-8BBC-E8D4F5A38F94}&la=
  - LSL24 hrs: http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={1CA8D309-C439-4436-903F-ABC6A3C6EEB3}&la=
- [DTP-23741](https://jira.corp.entaingroup.com/browse/DTP-23741) Fix endpoint replacement for `PPOS` calls. Related to `INC1576394` and Value ticket error.
- Fix .net routing for invalid culture token.
- [DTP-23943](https://jira.corp.entaingroup.com/browse/DTP-23943) Fixed displaying of activation time in mandatory Play Break overlay.
- [DTP-24016](https://jira.corp.entaingroup.com/browse/DTP-24016) Fixed cookie values returned unescaped on dotnet core to guarantee backwards compatibility with old usages.
- Change 401 session expiration logs level to warning instead of error.
- INC1583341 Fixed not found routes not serving html document and therefore not captured by Redirex Middleware.
- [DTP-23859](https://jira.corp.entaingroup.com/browse/DTP-23859) Fixed pending tasks not showing in account profile.
- [DTP-23902](https://jira.corp.entaingroup.com/browse/DTP-23902) Fixed validation to prevent invalid day input in date component.

### Vanilla 16.1.0

2023-07-12

**BREAKING CHANGES**

- All DLLs are targeting `.net6.0` - make sure to adjust your `<TargetFramework>`.
- As no instances of `BonusBalanceType` and `thirdPartyBonusBalance` were found in other products, they have been removed from the public API.

**FEATURES**

- [DTP-22618](https://jira.corp.entaingroup.com/browse/DTP-22618) Refactored rtms-toaster timer - requires Themes 11.48.0
- Performance: Removed CLS related to header messages loading.
- [DTP-15301](https://jira.corp.entaingroup.com/browse/DTP-15301) Adding html `lang` attribute from server side in first document request to enable browser auto translate suggestion.
- [DTP-21436](https://jira.corp.entaingroup.com/browse/DTP-21436) Replaced hardcoded `User-Agent` pattern matching in `UserAgentDynaConProvider` with `DeviceAtlas` and their `IsRobot` property for Robot detection.
- [DTP-22821](https://jira.corp.entaingroup.com/browse/DTP-22821) Added footer top item content message for regulatory content.
- [DTP-23253](https://jira.corp.entaingroup.com/browse/DTP-23253) Added possibility to switch between average and total time for the time spent widget - total time by default.
  - Sitecore key: [showAverageTimeSpent](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={1C705927-3F31-4CBA-861E-FCDEF2652FBD}&la=).
- [DTP-21395](https://jira.corp.entaingroup.com/browse/DTP-21395) Changed date component to use input instead of select for the day field.
- Exported `DatePickerService` from `@frontend/vanilla/datepicker` feature.
- [DTP-23220](https://jira.corp.entaingroup.com/browse/DTP-23220) `BonusBalance.ThirdParty` made obsolite because API is no longer required and it will be removed in next major release.
  - `BonusBalance.ThirdParty` doesn't call PPOS endpoint anymore but returns `0` instead for authenticated users.
- [DTP-22153](https://jira.corp.entaingroup.com/browse/DTP-22153) Added `single sign on` for labels with differant domains.
  - [Dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/122748/keys/401087/valuematrix?_matchAncestors=true) for setting up domains that should be considered as same domain for `single sign on`. It is enough to set up only one product in this config because we set top domain cookie, so login should work on all subdomains(products).
  - *Important* For this feature to work correctly, [CORS configuration](https://admin.dynacon.prod.env.works/services/198137/features/159080/keys/279976/valuematrix?_matchAncestors=true) should be set up correctly for all domains that are considered as same domain for `single sign on`.
- [DTP-19420](https://jira.corp.entaingroup.com/browse/DTP-19420) Removed awaiting of tracking for menu action items. Added possibility to enable it form the Sitecore item if `tracking.await` parameter exists.
  - Example: http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={C8EECFD8-41D2-4BF0-BB9C-03151C055699}&la=

**FIXES**

- [DTP-23015](https://jira.corp.entaingroup.com/browse/DTP-23015) Lugas - Player wager improvements
- [DTP-23097](https://jira.corp.entaingroup.com/browse/DTP-23097) Fixed inconsistent validation message in login page.
- [DTP-23051](https://jira.corp.entaingroup.com/browse/DTP-23051) Changes related to concurrency issues logged from `GetOrAddLockerInternal` method.
- [DTP-23510](https://jira.corp.entaingroup.com/browse/DTP-23510) Fixed standalone login page sometimes not rendered correctly.
- Fixed timeout not happening due to page focus, by removing balance refresh propagation only on focus to other balances that were extending the session.
- [DTP-21973](https://jira.corp.entaingroup.com/browse/DTP-21973) `goTo` method from `LoginService2` will send `OPEN_LOGIN_DIALOG` if [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/122791/keys/200652/valuematrix?_matchAncestors=true) enabled.

### Vanilla 16.0.0

2023-06-26

**HIGHLIGHTS**

- Following nuget packages `Bwin.Vanilla.PluginHost` and `Bwin.Vanilla.Mvc` are no longer updated/released thus meaning we are no longer maintaining legacy ASP.NET application running on `.NET4.8` framework.
- Updated to `angular 16.x.x`.
- *Important* Please make sure that post the upgrade, the `<html>` element contains class `vn-16` (not fw-sixteen or older fw-* version).

**BREAKING CHANGES**

- Moved `WebWorkerService` from `@frontend/vanilla/shared/web-worker` to `@frontend/vanilla/core` and added options to `setTimeout` / `setInterval`.
- Removed `XPlatformHttpRequest`, `XPlatformHttpResponse` and `XPlatformConnectionInfo` in favour of .NET Core's `HttpRequest`, `HttpResponse` and `ConnectionInfo`.

**FEATURES**

- [DTP-20255](https://jira.corp.entaingroup.com/browse/DTP-20255) Added offline page interceptor that will automatically redirect user to offline when API call fails with status code `503` and there is `X-Offline-Page` header in response.
- [DTP-22156](https://jira.corp.entaingroup.com/browse/DTP-22156) Added [prerender configuration](https://admin.dynacon.prod.env.works/services/198137/features/122378/keys/398861/valuematrix?_matchAncestors=true) for writing response `Cache-Control` header.
  - Added [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/394868) to enable polling that can trigger the automatic redirect to offline page.
  - Added `X-Offline-Page` header to response of [offline page](https://vie.git.bwinparty.com/vanilla/offline-page/-/blob/main/OfflinePage.App/Content/ContentMiddleware.cs#L34).
- [DTP-19488](https://jira.corp.entaingroup.com/browse/DTP-19488) Added `If-None-Match` header to DeviceAtlas api call when hash from previous response is available.
- Exported `GamificationService` from `@frontend/vanilla/gamification` feature.
- [DTP-21412](https://jira.corp.entaingroup.com/browse/DTP-21412) Adjusted play break duration selection with separate dropdown for SLS24.
  - Sitecore item: [BreakDurationForm24h](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={7850D26E-C7C1-4887-B1EE-7FFB6F6852A5}&la=).
- [DTP-21395](https://jira.corp.entaingroup.com/browse/DTP-21395) Extended month form field to support full month name.
  - DynaCon config: [ShowMonthLongName](https://admin.dynacon.prod.env.works/services/198137/features/201007/keys/397026/valuematrix).
- [DTP-20857](https://jira.corp.entaingroup.com/browse/DTP-20857) Added tracking for burger menu close.
- [DTP-21230](https://jira.corp.entaingroup.com/browse/DTP-21230) Added new parameter to `ContentLoadOptions` to force skipping cached content. Vary the parameter when fresh content is needed.
- Included `InnerExceptions` in `ClientConfigMergeExecutor` exceptions message.
- [DTP-22431](https://jira.corp.entaingroup.com/browse/DTP-22431) Created language switcher version 2 with radio buttons to select language.
- Added `newEvents` and `allEvents` getters to `EventService`.
- RememberMe logging enhancements and client handling for simultaneous logins with token.
- Performance: Removes CLS related to header messages.

**FIXES**

- Fixed datalayer event bubbling issue.
- [DTP-21740](https://jira.corp.entaingroup.com/browse/DTP-21740) Fixed removal of login duration component when user is no longer authenticated.
- [INC1542562](https://entain.service-now.com/esp?id=e_form&sys_id=b4ac21fe1b4f6110349f40c1b24bcbc9&table=task) Fixed close product switch cool off overlay even when set player area API call is failing.
- [DTP-21213](https://jira.corp.entaingroup.com/browse/DTP-21213) Added RouteScrollingBootstrapService with custom scrolling behaviour. Please for products if InMemoryScrollingOptions is set for appRoutes you can remove it now.
- [INC1542538](https://entain.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D0389a13a1bc7e9509485dd39cd4bcb2c%26sysparm_stack%3D%26sysparm_view%3D) Fixed default response cache control headers for dotnet core.
- Fix some types exported as empty object.
- Add missing `AuthorizeAttribute` to OffersController in dotnet core, spamming Kibana.
- [DTP-22158](https://jira.corp.entaingroup.com/browse/DTP-22158) Fixed lugas session default date value.
- [DTP-21694](https://jira.corp.entaingroup.com/browse/DTP-21694) Modified log type from error to information for GetCurrentWeekPokerPointsAsync.
- [DTP-22273](https://jira.corp.entaingroup.com/browse/DTP-22273) Fixed `ResponseCacheControlCoreAttribute` overriding cache header when configs contain same query string but with different values.
- [DTP-22248](https://jira.corp.entaingroup.com/browse/DTP-22248) Fix navigation layout error.
- Fixed product menu error when tabs content are missing.
- Fixed header service ready when header config is loaded.
- Remove `RequiredAttribute` from not required properties in `PayoutValueTicketRequest`.
- [DTP-22626](https://jira.corp.entaingroup.com/browse/DTP-22626) [DTP-22558](https://jira.corp.entaingroup.com/browse/DTP-22558) Fixed default material dialog max width.
- [DTP-22499](https://jira.corp.entaingroup.com/browse/DTP-22499) Fixed api call after browser resume from idle on lugas session.
- [DTP-22213](https://jira.corp.entaingroup.com/browse/DTP-22213) Fixed account-menu-onboarding-overlay not showing last button to complete tour when tourItems=1.
- [DTP-21856](https://jira.corp.entaingroup.com/browse/DTP-21856) Fixed show of last session info toast when user language is different then current page language.
- [DTP-22662](https://jira.corp.entaingroup.com/browse/DTP-22662) Reduce the number of `AnonymousClaims` and `ClaimsUnauthorized` calls to `PPOS` by calling refresh PPOS claims only when loading `Eager` client configs.
- [DTP-22571](https://jira.corp.entaingroup.com/browse/DTP-22571) Fixed `header-shown` class showing when header feature is disabled.
- Fix `WebHostEnvironmentExtensions` case sensitive comparison.
- [DTP-22743](https://jira.corp.entaingroup.com/browse/DTP-22743) Modified tracking for browser.orientation and screenResolution.
- [DTP-22975](https://jira.corp.entaingroup.com/browse/DTP-22975) Updated flex classes in navigation layout page to get full width in mobile
- [DTP-22756](https://jira.corp.entaingroup.com/browse/DTP-22756) Adjusted redirection logic for inactivity screen feature when triggered on route that require authentication.





[Previous vanilla releases](ARCHIVE-CHANGELOG.md)
