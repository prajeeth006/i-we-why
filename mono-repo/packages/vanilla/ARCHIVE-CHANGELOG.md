### Vanilla 15.2.0

2023-06-13

**FIXES**

- Fix left over types exported as empty object.
- [DTP-22248](https://jira.corp.entaingroup.com/browse/DTP-22248) Fix navigation layout error.
- Fixed product menu error when tabs content are missing.
- Fixed header service ready when header config is loaded.
- [DTP-21460](https://jira.corp.entaingroup.com/browse/DTP-21460) Revert - Imported styles into 2 components: footer and label-switcher.
- Fixed datalayer event bubbling issue.
- [DTP-21213](https://jira.corp.entaingroup.com/browse/DTP-21213) Added RouteScrollingBootstrapService with custom scrolling behaviour. Please for products if InMemoryScrollingOptions is set for appRoutes you can remove it now.
- Remove `RequiredAttribute` from not required properties in `PayoutValueTicketRequest`.
- Fixed default response cache control headers for dotnet core.

### Vanilla 15.1.0

2023-06-02

**FEATURES**

- [INC1542562](https://entain.service-now.com/esp?id=e_form&sys_id=b4ac21fe1b4f6110349f40c1b24bcbc9&table=task) Fixed close product switch cool off overlay even when set player area API call is failing.
- [DTP-21460](https://jira.corp.entaingroup.com/browse/DTP-21460) Imported styles into 2 components: footer and label-switcher.

**FIXES**

- Fix some types exported as empty object.

### Vanilla 15.0.0 [DO NOT ROLLOUT ON GERMAN LABELS ON GAMING PRODUCTS - SetPlayerArea is not rolled out on the platform side, so the product switch overlay will not be closed when user clicks]

2023-05-30

**HIGHLIGHTS**

- Removed `@angular\flex-layout` and `crypto-js` npm packages from Vanilla.
- Improve rendering performance of `DynamicComponentDirective`.
- Follow our [update guide](https://vie.git.bwinparty.com/vanilla/monorepo/-/wikis/guides/major-updates)

**FEATURES**

- [DTP-14042](https://jira.corp.entaingroup.com/browse/DTP-14042) Removed deprecated `@angular\flex-layout` npm package from Vanilla.
  - Introduced [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/198454/keys/393600/valuematrix?_matchAncestors=true) that is used to map breakpoint aliases to media queries.
  - Introduced [MediaQueryService](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/main/Client/vanilla/core/src/browser/media-query.service.ts) service that is wrapper around [BreakpointObserver](https://material.angular.io/cdk/layout/api#BreakpointObserver). Can be used to get an observable of results for the given queries/registered breakpoints, check whether one or more breakpoint aliases/media queries match the current viewport size and map breakpoint aliases to a media queries.
  - Replaced usage of `MediaObserver` from `@angular/flex-layout` package in favor of `BreakpointObserver` from `@angular/cdk/layout`.
  - Adapted `MediaDslValuesProvider` to use `BreakpointObserver`.
- Exported `DatePickerCalendarComponent`.
- Added `Google-InspectionTool` as UserAgent.Robot in `UserAgent` dynacon provider.
- [DTP-19701](https://jira.corp.entaingroup.com/browse/DTP-19701) Added player-active-wager lazy feature or lugas session.
- [INC1505028](https://entain.service-now.com/esp/?id=e_form&sys_id=ea8af1d51b126914349f40c1b24bcbb0&table=task) Tracked trackingAffiliate cookie value as `page.trackingAffiliate`.
- [INC1536423](https://entain.service-now.com/esp/?id=e_form&sys_id=20ca06649783a910c059baf0f053af45&table=task) Removed exposure of sensitive data in the client config.

**FIXES**

- [DTP-21298](https://jira.corp.entaingroup.com/browse/DTP-21298) Bug fixed to datalayer event bubbling before GTM load.
- [DTP-21695](https://jira.corp.entaingroup.com/browse/DTP-21695) Fixed Product menu.
- `vn-nv-opted` and `toastShownInStates` cookies changed to permanent cookies.

### Vanilla 14.16.21

2023-07-06

**FIXES**
- Fixed timeout not happening due to page focus, by removing balance refresh propagation only on focus to other balances that were extending the session.

### Vanilla 14.16.20

2023-07-05

**FIXES**

- Fixed ConcurrentDictionary conversion issue on `Legacy framework`.

### Vanilla 14.16.19

2023-07-05

**FEATURES**
- [DTP-22821](https://jira.corp.entaingroup.com/browse/DTP-22821) Added footer top item content message for regulatory content under language switcher.

**FIXES**
- [DTP-22571](https://jira.corp.entaingroup.com/browse/DTP-22571) FIxed header class issue. Added `newEvents` and `allEvents` getters to `EventService`.
- [DTP-23015](https://jira.corp.entaingroup.com/browse/DTP-23015) Lugas - Player wager improvements

### Vanilla 14.16.18

2023-07-04

**FEATURES**
- Revert changes for [DTP-22821](https://jira.corp.entaingroup.com/browse/DTP-22821) Added footer top item content message for regulatory content.

**FIXES**
- [DTP-23051](https://jira.corp.entaingroup.com/browse/DTP-23051) Small refactoring changes related to concurrency issues logged from `GetOrAddLockerInternal` method.
- Revert [DTP-22571](https://jira.corp.entaingroup.com/browse/DTP-22571) FIxed header class issue. Added `newEvents` and `allEvents` getters to `EventService`.

### Vanilla 14.16.17 [DO NOT ROLLOUT - ISSUES WITH DEVICE RECOGNITION DUE TO CONCURRENCY DICTIONARY CHANGES]

2023-07-03

**FEATURES**
- [DTP-22821](https://jira.corp.entaingroup.com/browse/DTP-22821) Added footer top item content message for regulatory content.

**FIXES**
- [DTP-22571](https://jira.corp.entaingroup.com/browse/DTP-22571) FIxed header class issue. Added `newEvents` and `allEvents` getters to `EventService`.
- [DTP-23051](https://jira.corp.entaingroup.com/browse/DTP-23051) Changes related to concurrency issues logged from `GetOrAddLockerInternal` method.

### Vanilla 14.16.16

2023-06-29

- Fixed sending of incorrect IP address to `Redirex`.

### Vanilla 14.16.15

2023-06-26

- Fixed sending of incorrect IP address to `Redirex`.

### Vanilla 14.16.14

2023-06-20

**FIXES**

- [DTP-22499](https://jira.corp.entaingroup.com/browse/DTP-22499) Fixed api call after browser resume from idle on lugas session. reworked.
- [DTP-22213](https://jira.corp.entaingroup.com/browse/DTP-22213) Fixed account-menu-onboarding-overlay not showing last button to complete tour when tourItems=1.
- [.NET 6] Fixed `AccessControlAllowOrigin` response header if `Origin` request header is configured [here](https://admin.dynacon.prod.env.works/services/198137/features/251212/keys/251217/valuematrix?_matchAncestors=true).
- Included `InnerExceptions` in `ClientConfigMergeExecutor` exceptions message.

### Vanilla 14.16.13

2023-06-15

**FIXES**

- [.NET6] Fixed an issue with `OffersController` spamming logs because of missing `AuthorizeAttribute`.
- Remove `RequiredAttribute` from not required properties in `PayoutValueTicketRequest`.

### Vanilla 14.16.12

2023-06-14

- [.NET6] Fixed an issue with `MappedGeolocation` endpoint.

### Vanilla 14.16.11

2023-06-14

- [INC1505028](https://entain.service-now.com/esp/?id=e_form&sys_id=ea8af1d51b126914349f40c1b24bcbb0&table=task) Tracked trackingAffiliate cookie value as `page.trackingAffiliate`.

### Vanilla 14.16.10

2023-06-12

**FIXES**

- [DTP-22289](https://jira.corp.entaingroup.com/browse/DTP-22289) Fixed call api for RTMS lugas activation event.
- [DTP-22273](https://jira.corp.entaingroup.com/browse/DTP-22273) Fixed `ResponseCacheControlCoreAttribute` overriding cache header when configs contain same query string but with different values.

### Vanilla 14.16.9

2023-06-11

**FIXES**

- Fixed gamification DI provider.
- [.NET 6] Adjusted `static files` to specify `Cache Control` response headers. Added `AccessControlAllowOrigin` response header if `Origin` request header is configured [here](https://admin.dynacon.prod.env.works/services/198137/features/251212/keys/251217/valuematrix?_matchAncestors=true).
### Vanilla 14.16.8

2023-06-09

**FIXES**

- [DTP-22158](https://jira.corp.entaingroup.com/browse/DTP-22158) Fixed showing time in hh:mm:ss for lugas session.
- [DTP-22248](https://jira.corp.entaingroup.com/browse/DTP-22248) Fix navigation layout error.
- Fixed product menu error when tabs content are missing.

### Vanilla 14.16.7

2023-06-07

**FEATURES**

- [DTP-21395](https://jira.corp.entaingroup.com/browse/DTP-21395) Extended month form field to support full month name.
  - DynaCon config: [ShowMonthLongName](https://admin.dynacon.prod.env.works/services/198137/features/201007/keys/397026/valuematrix).

**FIXES**

- [DTP-22158](https://jira.corp.entaingroup.com/browse/DTP-22158) Fixed rtms event type property for lugas session.

### Vanilla 14.16.6

2023-06-06

**FIXES**

- [DTP-22158](https://jira.corp.entaingroup.com/browse/DTP-22158) Fixed lugas session default date value.

### Vanilla 14.16.5

2023-06-02

**FIXES**

- [DTP-22087](https://jira.corp.entaingroup.com/browse/DTP-22087) Fixed AntiForgeryToken validation issue [.NET6]

### Vanilla 14.16.4

2023-06-01

**FEATURES**

- [DTP-19676](https://jira.corp.entaingroup.com/browse/DTP-19676) Added integration with redirex api without the need of having IIS module installed. Config [here](https://admin.dynacon.prod.env.works/services/198137/features/395747).
- Exported `GamificationService` from `@frontend/vanilla/gamification` feature.

**FIXES**

- [INC1542562](https://entain.service-now.com/esp?id=e_form&sys_id=b4ac21fe1b4f6110349f40c1b24bcbc9&table=task) Fixed close product switch cool off overlay even when set player is API call is failing.
- [INC1542538](https://entain.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D0389a13a1bc7e9509485dd39cd4bcb2c%26sysparm_stack%3D%26sysparm_view%3D) Fixed default response cache control headers for dotnet core.

### Vanilla 14.16.3

2023-05-30

- [DTP-19701](https://jira.corp.entaingroup.com/browse/DTP-19701) Added feature player-active-wager or lugas session.

### Vanilla 14.16.2

2023-05-25

**FIXES**

- Added `Google-InspectionTool` as UserAgent.Robot in `UserAgent` dynacon provider.
- Fixed `GuardSameAssemblyVersion` exception (application not starting) when version contains git revision with plus sign.
- [DTP-21695](https://jira.corp.entaingroup.com/browse/DTP-21695) Fixed Product menu.

### Vanilla 14.16.1

2023-05-19

- [DTP-21385](https://jira.corp.entaingroup.com/browse/DTP-21385) Fixed inactivity screen countdown timer shown as negative value.

**FEATURES**

- [DTP-20324](https://jira.corp.entaingroup.com/browse/DTP-20324) Refresh bonus balance on `bonus-balance` feature init.
- [DTP-20170](https://jira.corp.entaingroup.com/browse/DTP-20170) Add `native-wrapper-odr` class to html tag for ODR apps.

**FIXES**

- [DTP-20717](https://jira.corp.entaingroup.com/browse/DTP-20717) Fixed worker initialization for inactivity screen countdown timer.

### Vanilla 14.16.0 [DO NOT ROLLOUT ON GERMAN LABELS ON GAMING PRODUCTS - SetPlayerArea is not rolled out on the platform side, so the product switch overlay will not be closed when user clicks]

2023-05-17

**FEATURES**

- [DTP-20324](https://jira.corp.entaingroup.com/browse/DTP-20324) Refresh bonus balance on `bonus-balance` feature init.
- [DTP-20170](https://jira.corp.entaingroup.com/browse/DTP-20170) Add `native-wrapper-odr` class to html tag for ODR apps.

**FIXES**

- [DTP-20717](https://jira.corp.entaingroup.com/browse/DTP-20717) Fixed worker initialization for inactivity screen countdown timer.

### Vanilla 14.15.0 [DO NOT ROLLOUT ON GERMAN LABELS ON GAMING PRODUCTS - SetPlayerArea is not rolled out on the platform side, so the product switch overlay will not be closed when user clicks]

2023-05-12

**FEATURES**

- [DTP-19305](https://jira.corp.entaingroup.com/browse/DTP-19305) Added option to staggered idle timeout in inactivity screen using [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/250385/keys/392449/valuematrix?_matchAncestors=true).
- Performance: Improve CLS in `Product Menu`.
- Allow dynamic layout slot component to evaluate DSL filters from the Sitecore items on the client.
- Adjusted time spent widget to show only one message when current average and product cumulative periods are missing.
- [DTP-15830](https://jira.corp.entaingroup.com/browse/DTP-15830) Added header feature for US mobile scroll EnableToggleOnScroll.
- Added additional diagnostics related to prerender (forwarding of X-Correlation-Id and X-Forwarded-For headers).
- [DTP-19630](https://jira.corp.entaingroup.com/browse/DTP-19630) Gamification - UK Coin balance display.
- [DTP-20880](https://jira.corp.entaingroup.com/browse/DTP-20880) Added experimental `WebWorkerService` in `@frontend/vanilla/shared` providing means to register Web workers to run scripts in background threads.

**FIXES**

- [DTP-19634](https://jira.corp.entaingroup.com/browse/DTP-19634) Fix Recaptcha health check when feature is disabled.
- [DTP-20126](https://jira.corp.entaingroup.com/browse/DTP-20126) Added option to disable setting of `active` class in account menu by adding `set-active-item-disabled` to Sitecore item and setting it to `true`.
- [DTP-20169](https://jira.corp.entaingroup.com/browse/DTP-20169) Removed `glyphicon` icon from login button.
- [DTP-18711](https://jira.corp.entaingroup.com/browse/DTP-18711) Fixed G4 cross domain tracking additional _ga query parameter.
- [DTP-19711](https://jira.corp.entaingroup.com/browse/DTP-19711) Fixed scrolling in the middle for account menu 3 and mobile unresponsiveness.
- [DTP-20363](https://jira.corp.entaingroup.com/browse/DTP-20363) Added option to fetch content if a user is not authenticated and `IsAnonymousAccessRestricted` is enabled by adding new option `AllowedAnonymousAccessRestrictedPaths` to `ContentEndpointOptions`.
- [DTP-20252](https://jira.corp.entaingroup.com/browse/DTP-20252) Fixed vn-clock and vn-login-duration HTML class change after rerender.
- [DTP-20717](https://jira.corp.entaingroup.com/browse/DTP-20717) Fixed inactivity screen countdown timer when browser is inactive / minimized.

**.NET6**

- Added fix related to environment uppercase.
- Fixed display of RTMS overlay and toasters.

### Vanilla 14.14.0 [DO NOT ROLLOUT ON GERMAN LABELS ON GAMING PRODUCTS - SetPlayerArea is not rolled out on the platform side, so the product switch overlay will not be closed when user clicks]

2023-04-28

**FEATURES**

- [DTP-19840](https://jira.corp.entaingroup.com/browse/DTP-19840) Adapted `vnProductMenu`, `vnPlayerGamingDeclaration`, `vnFooter` and `vnLoginContent` lazy client configs for client and CDN caching.
  - **Please don't use `loginPage` property directly from `vnLoginContent` client config. Use evaluated content from `content` property in `LoginContentService`**.

**FIXES**

- [DTP-19449](https://jira.corp.entaingroup.com/browse/DTP-19449) Bug fixed to return success message from server.
- [DTP-17884](https://jira.corp.entaingroup.com/browse/DTP-17884) Bug fixed to change the account menu drawer bar icon from horizontal bar to downward arrow.
- [DTP-17307](https://jira.corp.entaingroup.com/browse/DTP-17307) Allow overlapping of [DynaCon configured classes](https://admin.dynacon.prod.env.works/services/198137/features/159289/keys/159291/valuematrix?_matchAncestors=true) with classes provided from the counter for the menu item badge directive.
- [DTP-19915](https://jira.corp.entaingroup.com/browse/DTP-19915) Fixed App.Environment DSL returning uppercase value that was breaking existent conditions.
- [INC1511960](https://entain.service-now.com/esp/?id=e_form&sys_id=9c8e127f971ae910ccaef0e0f053af51&table=task) Fixed rendering of inbox messages main banner.

### Vanilla 14.13.0 [DO NOT ROLLOUT ON GERMAN LABELS ON GAMING PRODUCTS - SetPlayerArea is not rolled out on the platform side, so the product switch overlay will not be closed when user clicks]

2023-04-21

**FEATURES**

- [DTP-18131](https://jira.corp.entaingroup.com/browse/DTP-18131) Created toggle to enable eagerly loading of configs to avoid multiple partial API calls.
- [DTP-19569](https://jira.corp.entaingroup.com/browse/DTP-19569) CLS improvements header.
- [DTP-18711](https://jira.corp.entaingroup.com/browse/DTP-18711) Added cross domain tracking for GA3 and GA3 applicable for domains in dynacon CrossDomainRegExG4 key.

**FIXES**

- [DTP-19709](https://jira.corp.entaingroup.com/browse/DTP-19709) Fixed popper tooltip on vn-h-product-navigation.
- [DTP-19650](https://jira.corp.entaingroup.com/browse/DTP-19650) Fixed overflowing of the cashier iframe for mobile devices with small screen.

### Vanilla 14.12.0 [DO NOT ROLLOUT ON GERMAN LABELS ON GAMING PRODUCTS - SetPlayerArea is not rolled out on the platform side, so the product switch overlay will not be closed when user clicks]

2023-04-19

**FEATURES**

- Deprecated `registerLoader, BaseLoader`. Use `registerLoaderFn` instead. Example [TODO here](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/main/client/src/provide.ts#L21).
- [DTP-18811](https://jira.corp.entaingroup.com/browse/DTP-18811) Tooltip on product navigation menu.
- [DTP-17307](https://jira.corp.entaingroup.com/browse/DTP-17307) Added default CSS classes (`badge`, `badge-circle`, `badge-t-r`) for `Icon` menu item badge type.

**FIXES**

- [DTP-17307](https://jira.corp.entaingroup.com/browse/DTP-17307) Removed error message from login screen when the session is terminated from inactivity feature.
- [DTP-19460](https://jira.corp.entaingroup.com/browse/DTP-19460) Extended cashier iframe `postMessage` event with `target` parameter in order to target concrete iframe.

### Vanilla 14.11.0 [DO NOT ROLLOUT ON GERMAN LABELS ON GAMING PRODUCTS - SetPlayerArea is not rolled out on the platform side, so the product switch overlay will not be closed when user clicks]

2023-04-17

- [DTP-14058](https://jira.corp.entaingroup.com/browse/DTP-14058) Change RTMS based features to load when the event is received (using [event strategy](https://admin.dynacon.prod.env.works/services/198137/features/245375/keys/321595/valuematrix?_matchAncestors=true)). **Required config change**: https://admin.dynacon.prod.env.works/changesets/222008
  - `loss-limits` will lazy-load on `LOSS_LIMIT_WARN` and `LOSS_LIMIT_REACHED` event.
  - `session-info` will lazy-load on `RCPU_SESS_EXPIRY_EVENT` and `RCPU_ACTION_ACK` event.
  - `session-limits-logout-popup` will lazy-load on `AUTO_LOGOUT_EVENT_WITH_POPUP` event.
- [DTP-18201](https://jira.corp.entaingroup.com/browse/) SASW - Account menu balance tooltip.
- [DTP-5464](https://jira.corp.entaingroup.com/browse/DTP-5464) Added call to `SetPlayerArea` PPOS endpoint when user confirm product switch cool off overlay.

**FIXES**

- [DTP-17218](https://jira.corp.entaingroup.com/browse/DTP-17218) Fixed state switcher  issue for GET_GEO_LOCATION_POSITION event
- [SPO-61621](https://jira.corp.entaingroup.com/browse/SPO-61621) Fixed delay in showing of idle screen.
- [DTP-18720](https://jira.corp.entaingroup.com/browse/DTP-18720) Fixed showing of entry messages on login page.
- Updated `DeviceAtlas` to version `3.1.7`. Fixes health page issue and device recognition failures related to culture context.

### Vanilla 14.10.0

2023-03-31

**FEATURES**

- [DTP-18016](https://jira.corp.entaingroup.com/browse/DTP-18016) Removed footer load tracking event.
- [DTP-17883](https://jira.corp.entaingroup.com/browse/DTP-17883) Include new `PrepaidCardDepositBalance` to Balance DSL provider.
- Removed `LANGUAGE_CHANGED` CCB event as it is replaced with `LanguageUpdated` CCB event.

**FIXES**

- [DTP-18058](https://jira.corp.entaingroup.com/browse/DTP-18058) Fixed sticky sub nav behavior on pages when header is not enabled.
- [DTP-17096](https://jira.corp.entaingroup.com/browse/DTP-17096) Added missed category of performance counter.
- INC1475195 Removed toaster image click as it was redirecting to image url.
- Fix wrong usage of `isOnboardingTooltipsEnabled` config in TutorialLayoutComponent.
- Fix Login form disabled after login click when password hints are enabled and validation fails.
- Fix Toaster intermitently not showing after product switch.
- Fix `usecaseName` typo in `EVENT_CAPTURE` CCB.
- Fix RTMS connection failing when login with user in workflow (LCG issue only as Portal is embedded).
- INC1488018 Fix missing language switcher for bots.
- [DTP-18137](https://jira.corp.entaingroup.com/browse/DTP-18137) Fixed scrolling issue in account menu 3 for mobile view.

### Vanilla 14.9.0

2023-03-24

**FIXES**

- Using new `DeviceAtlas3` endpoint from POS.
- [DTP-17919](https://jira.corp.entaingroup.com/browse/DTP-17919) Fixed Balance breakdown UI alignment on Customer Hub.

### Vanilla 14.8.0 [DO NOT ROLLOUT - USES DEVICE ATLAS 3.x API BUT USES POSAPI ENDPOINT WHICH SERVES DEVICE ATLAS 2.x]

2023-03-22

**FEATURES**

- Updated to `angular 15.2.4`.
- [DTP-17302](https://jira.corp.entaingroup.com/browse/DTP-17302) Updated `DeviceAtlas` to version `3.1.5`.
- [DTP-16193](https://jira.corp.entaingroup.com/browse/DTP-16193) Extend `ResponseCacheControlAttribute` to support dynamic parameters in query params using wildcard (*).
- [DTP-14639](https://jira.corp.entaingroup.com/browse/DTP-14639) Added new DSL for tier field vn-loyality-profile.
- New versions of `@vanilla/sitecore-template-generator` are no longer published. Remove it from your solution. Find out [here](https://vie.git.bwinparty.com/vanilla/monorepo/-/wikis/guides/Content-Template-Generator) how to update your content templates in future.
- [DTP-17015](https://jira.corp.entaingroup.com/browse/DTP-17015) Move delayed update of data layer outside of Angular zone (when [timeout](https://admin.dynacon.prod.env.works/services/198137/features/123228/keys/360902/valuematrix?_matchAncestors=true) is configured).
- Added log to Kibana for `Unauthorized` client calls (401) in order to help identifying session expirations.
- [DTP-17299](https://jira.corp.entaingroup.com/browse/DTP-17299) Extended account menu time spent tile to show fixed aggregation period when [FixedAggregationPeriod](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={1C705927-3F31-4CBA-861E-FCDEF2652FBD}&la=) field in Sitecore is provided.

**FIXES**

- [DTP-17096](https://jira.corp.entaingroup.com/browse/DTP-17096) Bug fixed to stop spamming Kibana logs for Performance counter.
- Fixed prefill username toggle not showing (RememberMe for US labels).
- [DTP-17214](https://jira.corp.entaingroup.com/browse/DTP-17214) RouteScrollingBootstrapService was removed in favor of Angular router feature withInMemoryScrolling. Please configure on your product accordingly if you want this behavior. [Example](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/d7c8d0ce3d4636c9d7b4614a87a52f86c1228ea2/Client/src/main.ts#L25).
- [DTP-17645](https://jira.corp.entaingroup.com/browse/DTP-17645) Fixed tracking event type on smart banner load
- [DTP-17626](https://jira.corp.entaingroup.com/browse/DTP-17626) Fixed Not found item log type to warning
- [DTP-17730](https://jira.corp.entaingroup.com/browse/DTP-17730) Fixed empty space on header.
- [DTP-17235](https://jira.corp.entaingroup.com/browse/DTP-17235) Fixed Sitecore template mapping for text over image for Toasters.
- [DTP-17218](https://jira.corp.entaingroup.com/browse/DTP-17218) Fixed state switcher toaster not showing sometimes after switching to another state.

### Vanilla 14.7.0

2023-03-01

**FEATURES**

- [DTP-17235](https://jira.corp.entaingroup.com/browse/DTP-17235) Removed text over image support for Toasters.
- [DTP-12843](https://jira.corp.entaingroup.com/browse/DTP-12843) CH - Added possibility to show/hide left menu based on [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/198901/keys/382154/valuematrix?_matchAncestors=true).

**FIXES**

- [DTP-15592](https://jira.corp.entaingroup.com/browse/DTP-15592) Bug fixed to stop spamming Kibana logs in case CountryDynaConProvider resolves to null.
- [DTP-17361](https://jira.corp.entaingroup.com/browse/DTP-17361) Bug fixed session statistics slider on close.

### Vanilla 14.6.0

2023-02-27

**FEATURES**

- [DTP-16446](https://jira.corp.entaingroup.com/browse/DTP-16446) Added WA ARC tracking for LSL24 play breaks.
- [DTP-228](https://jira.corp.entaingroup.com/browse/DTP-228) Added WA tracking for minimenu session statistics slide and Mytransaction click.

**FIXES**

- [POR-13065](https://jira.corp.entaingroup.com/browse/POR-13065) Fix navigating to blank page when clicking on Account Menu settings.

### Vanilla 14.5.0

2023-02-24

**FIXES**

- [DTP-17030](https://jira.corp.entaingroup.com/browse/DTP-17030) Fixed link is not opening when on Sitecore item `target` is set.
- [DTP-16427](https://jira.corp.entaingroup.com/browse/DTP-16427) Fixed scrolling issue [Partypoker.fr].

### Vanilla 14.4.0

2023-02-24

**FEATURES**

- [DTP-15125](https://jira.corp.entaingroup.com/browse/DTP-15125) CH - Added tracking for click on menu links in customer hub.

**FIXES**

- [DTP-17014](https://jira.corp.entaingroup.com/browse/DTP-17014) Fixed login not working on DanskeSpil download client - INC1440984.
- [DTP-16313](https://jira.corp.entaingroup.com/browse/DTP-16313) Fixed header inbox icon tracking.
- [DTP-16287](https://jira.corp.entaingroup.com/browse/DTP-16287) CH - Fixed missing dot for onboarding task.
- Exported `CashierResourceService`.
- [DTP-17152](https://jira.corp.entaingroup.com/browse/DTP-17152) Fixed evaluation of footer enable condition.
- [DTP-16938](https://jira.corp.entaingroup.com/browse/DTP-16938) Fixed rendering divs when content is empty.
- [DTP-17168](https://jira.corp.entaingroup.com/browse/DTP-17168) Fixed Cashier iframe initialization error.

### Vanilla 14.3.0

2023-02-17

**FEATURES**

- Exposed `ResponseCacheControlAttribute` to be used by products for client request caching.
- [DTP-15783](https://jira.corp.entaingroup.com/browse/DTP-15783) Added payment preferences menu in account settings.
  - DynaCon config: [PaymentPreferencesUrlTemplate](https://admin.dynacon.prod.env.works/services/198200/features/111635/keys/379093/valuematrix?_matchAncestors=true)
  - Sitecore template: [PaymentPreferences](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={ADC9CF33-1038-4664-9D19-ACCA110092BA}&la=)
- [DTP-16290](https://jira.corp.entaingroup.com/browse/DTP-16290) Added extra header items and footer in newvisitor-page component.
- [DTP-15135](https://jira.corp.entaingroup.com/browse/DTP-15135) Added configuration to enable fiddler for dotnet core.
- [DTP-15083](https://jira.corp.entaingroup.com/browse/DTP-15083) Epcot - Added tracking for mLife, wallet, and invite friends component.
- [DTP-15861](https://jira.corp.entaingroup.com/browse/DTP-15861) Extended time spent tile to show message when average period is less than a configured value.
  - [Sitecore content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={1C705927-3F31-4CBA-861E-FCDEF2652FBD}&la=) - `EmptyAveragePeriod`; `averagePeriodThresholdInMinutes`.

**FIXES**

- [DTP-16302](https://jira.corp.entaingroup.com/browse/DTP-16302) Fixed MatDialogModule dependency in dialog feature.
- [DTP-14745](https://jira.corp.entaingroup.com/browse/DTP-14745) Fixed fast login options missing on login page when login page is opened by route.
- [DTP-15539](https://jira.corp.entaingroup.com/browse/DTP-15539) and [DTP-14979] Fixed Security tab not showing in My account Settings
- [DTP-15316](https://jira.corp.entaingroup.com/browse/DTP-15316) Modified account menu-3, my hub button class to have optional style using dictionary
- [DTP-14768](https://jira.corp.entaingroup.com/browse/DTP-14768) Fixed overlay click tracking data before redirect and product type
- [DTP-16159](https://jira.corp.entaingroup.com/browse/DTP-16159) Fixed logout user on web if logged out on PosApi.
- [DTP-15938](https://jira.corp.entaingroup.com/browse/DTP-15938) Fixed `closeAction` of content messages not running on backdrop click.
- [DTP-16444](https://jira.corp.entaingroup.com/browse/DTP-16444) Fixed issue with navigation header by fixing tracking issue.
- [DTP-16884](https://jira.corp.entaingroup.com/browse/DTP-16884) Fixed issue on login page when login message is set explicitly and also login message is part of the proxy item on Sitecore.

### Vanilla 14.2.0

2023-02-03

**HIGHLIGHTS**

- Please update update to `prettier` npm package version `2.8.3` or higher when you are updated to this Vanilla version.
- [DTP-15038](https://jira.corp.entaingroup.com/browse/DTP-15038) Move following DSL providers on client side so that partial config can be cached on CDN.
  - Added client side implementation for followint DSLs: `App.Theme`, `BonusAward`, `Browser`, `Culture`, `Device`, `Epcot`, `GeoIp`, `LicenseInfo`, `NativeApplication`, `Offer`, `Request`, `RequestHeaders.UserAgent`, `Shop`, `Terminal`, `User`.
  - **Please check usage of `DslEvaluation.PartialForClient` when using `IContentService`, and check if you need to adapt client side code to evaluate DSL on client side using `DslService`.**
  - Please also use `health/dsl` page to check if DSL is server or client side.

**FEATURES**

- [DTP-15408](https://jira.corp.entaingroup.com/browse/DTP-15408) Added ability to configure `style` property of ``vn-dynamic-layout-slot`. [Config](https://admin.dynacon.prod.env.works/services/198137/features/370176/keys/376000/valuematrix?_matchAncestors=true) here.
- [DTP-15416](https://jira.corp.entaingroup.com/browse/DTP-15416) Added possibility to immediately logout the user on inactivity.
  - To enable, set [CountdownTimeout](https://admin.dynacon.prod.env.works/services/198137/features/250385/keys/250389/valuematrix?_matchAncestors=true) to `0`.
- Changed guards and resolvers to functions. In case you use any Vanilla guard, remove it from the providers list in the Routes or Module and rename it accordingly:
  - `HomePageGuard` --> `homePageGuard`
  - `ConfirmPasswordGuard` --> `confirmPasswordGuard`
- [DTP-15143](https://jira.corp.entaingroup.com/browse/DTP-15143) Extended Value Ticket CCB event with new attributes: `source`, `reqRefId` and `timestamp`.
- [DTP-13258](https://jira.corp.entaingroup.com/browse/DTP-13258) Extended dynamic layout component to support multiple Sitecore items configured in a folder.
- Use self closing tags in Vanilla.
- [DTP-14768](https://jira.corp.entaingroup.com/browse/DTP-14768) Added to feature rtms-overlay tracking service for WA for events like Terms and Conditions hide/show, close and claim offer.

**FIXES**

- [DTP-15210](https://jira.corp.entaingroup.com/browse/DTP-15210) Fix close button not going to last known product on help and contact page for casinowodr.
- [DTP-15878](https://jira.corp.entaingroup.com/browse/DTP-15878) Fixed autologout firing too late.
- [DTP-16148](https://jira.corp.entaingroup.com/browse/DTP-16148) Clear message queue when redirecting to the login page from inactivity screen on native app.

### Vanilla 14.1.0

2023-01-13

**FEATURES**

- Updated to `angular 15.1.0`.
- [DTP-14309](https://jira.corp.entaingroup.com/browse/DTP-14309) Implemented web tracking for idle session timer.
- Removed `Cookie SameSite fix` health check as requested from leanops team.

**FIXES**

- [DTP-14358](https://jira.corp.entaingroup.com/browse/DTP-14358) Fixed session expired tracking event.
- [DTP-14513](https://jira.corp.entaingroup.com/browse/DTP-14513) Fixed account menu tracking when user clicks on the link that redirects him to another product.
- Fixed missing export of `NotFoundComponent`.
- [DTP-14938](https://jira.corp.entaingroup.com/browse/DTP-14938) Fix footer slot swap.
- [DTP-14295](https://jira.corp.entaingroup.com/browse/DTP-14295) Bug fixed Ghost CTA display issue.
- [DTP-15080](https://jira.corp.entaingroup.com/browse/DTP-15080) Fixed closing of Play Break overlay if the API call fails.
  - Sitecore item: [Overlay](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={7667C602-FD33-4DD5-8031-26C81B57C192}&la=).
- INC1398382 Fixed duplicate images on Inbox message when setting up Image Link.
- [DTP-15150](https://jira.corp.entaingroup.com/browse/DTP-15150) Bug fixed for toaster image broken issue if image not added in Sitecore.
- [DTP-15213](https://jira.corp.entaingroup.com/browse/DTP-15213) Fixed inactivity screen tracking issues.
- [DTP-15289](https://jira.corp.entaingroup.com/browse/DTP-15289) Fixed null injector on `QuickDepositGuard`.

**.NET6**

- [DTP-15097](https://jira.corp.entaingroup.com/browse/DTP-15097) Added additional health info pages.

### Vanilla 14.0.0

2022-12-20

**HIGHLIGHTS**

- Updated to angular 15
- Utilized standalone components across our features and routes
- Switched to `provide-like` configuration pattern for providing our features
- This resulted in reduction of main bundle size of our testweb application from `282KB to 271KB`.
- Follow our [update guide](https://vie.git.bwinparty.com/vanilla/monorepo/-/wikis/guides/major-updates)

**FEATURES**

- Adjusted `dynacon` settings related to networkTimeout and pollingInterval.
- [DTP-13861](https://jira.corp.entaingroup.com/browse/DTP-13861) Rework `PlayBreak` feature.
  - New DynaCon config: [VanillaFramework.Features.PlayBreak](https://admin.dynacon.prod.env.works/services/198137/features/371723)
  - New Sitecore templates: [/vanilla.mobile/m2.whitelabel/app-v1.0/playbreak](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={3A386945-DC77-4F78-BBDB-7E6876840718}&la=)
- [DTP-13736](https://jira.corp.entaingroup.com/browse/DTP-13736) Removed `registerConfigToReloadOnLogin` from LoginResponseHandlerService. Pass `true` for the `reloadOnLogin` parameter in client configs which you want to reload after login. E.g. @ClientConfig('vnUser', true).
- [DTP-13807](https://jira.corp.entaingroup.com/browse/DTP-13807) Big Balance notification.
- [DTP-14135](https://jira.corp.entaingroup.com/browse/DTP-14135) Adjusted classes for text on image component (`vn-image`) provided for rtms overlay, rtms toast, inbox.
- [DTP-12969](https://jira.corp.entaingroup.com/browse/DTP-12969) Added new templates for Play Break `LONG_SESSION_24H_INTERACTION_EVENT` and `LONG_SESSION_24H_BREAK` type.
  - Sitecore templates: [MandatoryBreak24h](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={1CA8D309-C439-4436-903F-ABC6A3C6EEB3}&la=); [ScheduledBreakPrompt24h](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={3A53761F-C1C0-4462-AE53-7EEF63915091}&la=); [NonScheduledBreakPrompt24h](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={7297C24D-E73C-439D-B97E-BEE7EB809CB4}&la=).

**FIXES**

- INC1374763 Fixed `SeoTrackingMiddleware` throwing and possibly causing app crashes when referrer is invalid or relative url.
- [DTP-13789](https://jira.corp.entaingroup.com/browse/DTP-13789) Kibana log bug fixed for `initHighlighting` and `initProductHighlighting` properties.
- [DTP-14154](https://jira.corp.entaingroup.com/browse/DTP-14154) Added [IsEnabled](https://admin.dynacon.prod.env.works/services/198137/features/145809/keys/373448/valuematrix?_matchAncestors=true) config for enabling deposit prompt feature.
- [DTP-14291](https://jira.corp.entaingroup.com/browse/DTP-14291) Removed utility class text-info from customer-hub widgets to avoid the usage of !important - from bootstrap - themes version 11.12.0 is required.
- [DTP-13790](https://jira.corp.entaingroup.com/browse/DTP-13790) Bug fixed to subscribe `whenReady` of HeaderService for  public pages.
- [DTP-14333](https://jira.corp.entaingroup.com/browse/DTP-14333) Added ability to delay establishing rtms connection.
- [DTP-14123](https://jira.corp.entaingroup.com/browse/DTP-14123) Fixed inactivity feature to watch for idle time immediately on Web.
- [DTP-14255](https://jira.corp.entaingroup.com/browse/DTP-14255) Bug fixed to show shadow of CTA in overlay.

### Vanilla 13.7.0

2022-11-24

**FEATURES**

-   [DTP-10466](https://jira.corp.entaingroup.com/browse/DTP-10466) Counts and sets the number of rows for the new langauge-switcher grid template.
-   [DTP-13221](https://jira.corp.entaingroup.com/browse/DTP-13221) Saved last visitor cookie only on successful login and prefill username only on successful login.
-   [DTP-13132](https://jira.corp.entaingroup.com/browse/DTP-13132) Added try catch blocks to prevent failing of application when content is missing for WebAppMetadata/MetaTags.
-   [DTP-13379](https://jira.corp.entaingroup.com/browse/DTP-13379) Removed afterviewinitscripts and script-injection feature.
-   [DTP-13258](https://jira.corp.entaingroup.com/browse/DTP-13258) Extended dynamic layout with `main_content_header` and `main_content_footer` sections.
    -   [DynaCon configuration](https://admin.dynacon.prod.env.works/services/198137/features/370176/keys/370351/valuematrix) - use to configure the slots (by [SlotName](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/master/Bwin.Vanilla.PluginHost/Client/vanilla/core/src/dynamic-layout/dynamic-layout.service.ts#L152)) and DSL condition for enablement.
    -   [Sitecore items](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={C1E5D7B9-5FEF-4A12-B19F-DEDD669699F6}&la=) - use to configure slot content mapped in DynaCon path property.
-   [DTP-12974](https://jira.corp.entaingroup.com/browse/DTP-12974) Remove Recaptcha `EnabledVersions` config validation and usage.
-   [DTP-13208](https://jira.corp.entaingroup.com/browse/DTP-13208) Added option to not show loading indicator on configured URLs. Regax based dynacon configuration can be found on this [link](https://admin.dynacon.prod.env.works/services/198137/features/123537/keys/370509/valuematrix?_matchAncestors=true#370510).
-   [DTP-13196](https://jira.corp.entaingroup.com/browse/DTP-13196) Modified logo component to display svg image with animation.
-   [DTP-12849](https://jira.corp.entaingroup.com/browse/DTP-12849) Added skeleton for [safer-gambling](https://www.bwin.com/en/p/safer-gambling) public pages.
-   [DTP-12849](https://jira.corp.entaingroup.com/browse/DTP-12849) Added skeleton for public pages.

**FIXES**

-   [DTP-6393](https://jira.corp.entaingroup.com/browse/DTP-6393) Disabled redirection after login in download client for Danske Spil login integration version 2.
-   [DTP-12752](https://jira.corp.entaingroup.com/browse/DTP-12752) Fixed bug to reflect language change when user click on back CTA.
-   [DTP-162](https://jira.corp.entaingroup.com/browse/DTP-162) .NET 6 - Fixed bug related to regeneration of auth cookie.
-   INC1365497 Fixed product tracking happening before Vanilla initial values are sent to datalayer.
-   [DTP-215](https://jira.corp.entaingroup.com/browse/DTP-215) Added possibility to highlight menu item from Sitecore parameter using DSL expression.
    -   Parameter: `highlighted` - [example item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={E6B95FF3-CB06-41C7-953F-67DAA2937EFA}&la=).
-   Fixed logout event not tracked.
-   Refactor BettingApiRestRequest infrastructure to correctly map error content.
-   Ignore already loaded client config instead of throwing exception.
-   INC1374763 Removed RTMS related code called by iframe, causing random unhandled exceptions due to missing httpcontext.

### Vanilla 13.6.0

2022-11-04

**FEATURES**

-   [DTP-13197](https://jira.corp.entaingroup.com/browse/DTP-13197) Added support to strip content item's paths. Config [here](https://admin.dynacon.prod.env.works/services/198137/features/122634/keys/369866/valuematrix?_matchAncestors=true).
-   [DTP-11595](https://jira.corp.entaingroup.com/browse/DTP-11595) `CssOverrides` are now lazy feature which supports `client side DSL filtering`. Make sure that `@Html.RenderCssOverrides()` is removed from `MobileLayout.cshtml`.
-   [DTP-11682](https://jira.corp.entaingroup.com/browse/DTP-11682) Extended `ContentLoadOptions` with `BypassCache` property. Setting `BypassCache` to true will skip cache and fetch content directly from Sitecore. Default value is false.
-   [DTP-13010](https://jira.corp.entaingroup.com/browse/DTP-13010) Extended images for RTMS overlays; toasters and inbox to support custom on-top text configured in Sitecore (_[example](http://cms.test.env.works/sitecore/DirectLink.aspx?fo={7F56B09A-ED12-43D9-8199-A3DB1BB9172A}&la=)_).
    -   Added new `vn-image` component in `@frontend/vanilla/shared/image` that can be used to display images with text on top.
-   [DTP-12908](https://jira.corp.entaingroup.com/browse/DTP-12908) Label switcher - Removed confirmation overlay.
-   [DTP-13193](https://jira.corp.entaingroup.com/browse/DTP-13193) Smart Banner button class is now configurable in Sitecore: [OpenButtonClass](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={B68A8915-CD28-4002-BA0B-B930D5F32492}&la=).

**FIXES**

-   INC1352622 - Fixed an issue with Austrian Gaming Declaration page.
-   Fixed registration page frozen related to tracking changes.
-   Fixed double pageView tracking when there is locationChange event but without url changes.
-   Fixed user values tracked after `Event.Login` event.
-   [DTP-212](https://jira.corp.entaingroup.com/browse/DTP-212) Fixed login duration timer reset on navigation.
-   [DTP-13042](https://jira.corp.entaingroup.com/browse/DTP-13042) Fixed navigation layout top items.
-   INC1363403 Fixed wrong regex matching for not registered DSLs.
-   Fix tracking issue on login when no tag manager configured or tracking feature disabled.

### Vanilla 13.5.0

2022-10-28

**FEATURES**

-   [DTP-12574](https://jira.corp.entaingroup.com/browse/DTP-12574) Added session lifetime check feature.
-   [DTP-8572](https://jira.corp.entaingroup.com/browse/DTP-8572) Delayed data layer events push until data layer dom event fires.
-   [DTP-11679](https://jira.corp.entaingroup.com/browse/DTP-11679) Added `isEnabledCondition` [DynaCon configuration](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix#288220) to toggle login providers via DSL.
    -   Added `socialcookiedropped` window event listener to store `ab-social-log` cookie.
    -   Disabled login providers are now removed from the client configuration (`clientConfig.vnLogin2.providers`).
    -   Remove usage of `ShowFBLoginReg` cookie used for enablement of Facebook login provider.
-   [DTP-11995](https://jira.corp.entaingroup.com/browse/DTP-11995) Extend [`ContentLoadOptions`](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/master/Bwin.Vanilla.Content/ContentLoadOptions.cs#L8) with `IncludeTranslation` flag. When untranslated content is requested with this flag it will return `NotFound` error.

**FIXES**

-   [DTP-12834](https://jira.corp.entaingroup.com/browse/DTP-12834) Fix navigation layout top menu update.
-   [RET-2783](https://jira.corp.entaingroup.com/browse/RET-2783) Fix inactivity screen overlay showing backdrop for a while.
-   [DTP-12931](https://jira.corp.entaingroup.com/browse/DTP-12931) Fix empty navigation layout page and language switcher.
-   Fixed missing tracking before feature loads.
-   Fix `balance/refresh` and `mappedgeolocation` api calls renewing the session.

### Vanilla 13.4.0

2022-10-20

**FIXES**

-   [DTP-12557](https://jira.corp.entaingroup.com/browse/DTP-12557) Fixed proper showing of html content when using `openDialog` menu action.
-   Bug fixed to manually highlight bottom nav item.
-   [DTP-12200](https://jira.corp.entaingroup.com/browse/DTP-12200) Fixed click event tracking issue on time spent tile.
-   Fix InventoryService client checking for authentication when getting shop details.
-   [DTP-12790](https://jira.corp.entaingroup.com/browse/DTP-12790) Fixed `LOGIN_USERNAME_PREFILL` not prefilling username on login page.
-   [RET-2802](https://jira.corp.entaingroup.com/browse/RET-2802), [RET-2773](https://jira.corp.entaingroup.com/browse/RET-2773) Fixed Inactivity Screen.
-   [DTP-12834](https://jira.corp.entaingroup.com/browse/DTP-12834) Fixed account menu top items not updating.
-   Fix menu action click default event.

### Vanilla 13.3.0

2022-10-14

**FEATURES**

-   [DTP-12439](https://jira.corp.entaingroup.com/browse/DTP-12439) Shop DSL provider now executes for unauthenticated users. `INC1324204`.
-   [DTP-11896](https://jira.corp.entaingroup.com/browse/DTP-11896) Extend inactivity screen feature to support a new layout.
    -   Sitecore template: [InactivityOverlay](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={178A4682-F2AF-4215-BE47-5A7C30B184E5}&la=).
-   [DTP-12417](https://jira.corp.entaingroup.com/browse/DTP-12417) Allow dynamic change of menu item badge type with `MenuItemsService.setCounter()`.
-   [DTP-130](https://jira.corp.entaingroup.com/browse/DTP-130) CCB - Added tracing for CCB events. Log level for CCB events in `Information`.
    -   [Config](https://admin.dynacon.prod.env.works/services/198137/features/122791/keys/366694/valuematrix?_matchAncestors=true&previewChangesetId=200785) to enable tracing.
    -   [Config](https://admin.dynacon.prod.env.works/services/198137/features/122791/keys/366707/valuematrix?_matchAncestors=true) to blacklist CCB events(by name) that don't need tracing.
-   [DTP-11265](https://jira.corp.entaingroup.com/browse/DTP-11265) Added DSL balance support for Cashier items: [Total](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={23A71F67-58BD-4F86-971A-3B5AE522C8E0}&la=); [Withdrawable](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={4BFFB3A0-5C37-4024-A135-08D18C4E677A}&la=).
-   [DTP-12332](https://jira.corp.entaingroup.com/browse/DTP-12332) Removed Vanilla quick deposit spinner. Removed code related to quick deposit v1, because all labels use v2 now.

**FIXES**

-   [DTP-11265](https://jira.corp.entaingroup.com/browse/DTP-11265) Fixed HTTP interceptor for balance update _(when `.WithRefreshedBalance()` extension method is used)_.
-   [DTP-12167](https://jira.corp.entaingroup.com/browse/DTP-12167) SASW - Added remember login between states in the web.
    -   Added [set cookie domain config](https://admin.dynacon.prod.env.works/services/198137/features/365468/keys/365473/valuematrix?_matchAncestors=true) that contains `Cookies` and `Domain` properties.
    -   `Cookies` indicates the list of cookies for which we set domain. `Domain` indicates domain we want to set.
    -   Replaced [cleanup config](https://admin.dynacon.prod.env.works/services/198137/features/356688) with [new config](https://admin.dynacon.prod.env.works/services/198137/features/365468/keys/365470/valuematrix?_matchAncestors=true).
-   [DTP-11649](https://jira.corp.entaingroup.com/browse/DTP-11649) Mapped error response from BettingApiRestRequest to PosApiException.
-   Use fallback endpoint on ClientConfigService for when trying to reload a config not previously loaded.
-   [DTP-195](https://jira.corp.entaingroup.com/browse/DTP-195) Amended User.TrackerId behavior to return User.AffiliateInfo in case of logged in else return User.TracketId.
-   Fix Vanilla router causing circular dependency errors.

### Vanilla 13.2.0

2022-10-10

**FEATURES**

-   [DTP-5151](https://jira.corp.entaingroup.com/browse/DTP-5151) Created common static key values Site core item for static keys of RTMS, Inbox and TNCSection Static keys.
-   [DTP-225](https://jira.corp.entaingroup.com/browse/DTP-225) CH - added option to render `adhoc` task HTML based on the `layout` property that is set in `paramters` section. Currently supported layout is `onboarding`. If `layout` property is not set, it will render default adhoc layout.
-   [DTP-11681](https://jira.corp.entaingroup.com/browse/DTP-11681) Epcot - added tracking when menu loads.
-   [DTP-12202](https://jira.corp.entaingroup.com/browse/DTP-12202) Tracked `user.affordabilityJourney` in user level information.
-   [DTP-12296](https://jira.corp.entaingroup.com/browse/DTP-12296) Epcot - tracked when menu is closed and when user logout.

**FIXES**

-   Fixed an issue causing some lazy routes not working.
-   Exported `TagManagerService` from `@frontend/vanilla/core`, make sure to subscribe to its `.whenReady` before using it.
-   Fix betstation Activity Popup position flickering on show.
-   [DTP-213](https://jira.corp.entaingroup.com/browse/DTP-213) Fixed menu item highlight issue.
-   Stop rendering popper content on menu items when not configured.

### Vanilla 13.1.0

2022-09-30

**FEATURES**

-   [DTP-9298](https://jira.corp.entaingroup.com/browse/DTP-9298) Tracking is now a lazy module and. Core services remained on Vanilla core module.

**FIXES**

-   [DTP-11744](https://jira.corp.entaingroup.com/browse/DTP-11744) Bug fixed to display onboarding task.
-   [DTP-12084](https://jira.corp.entaingroup.com/browse/DTP-12084) Betstation - Fixed popups display taking longer.
-   [DTP-12083](https://jira.corp.entaingroup.com/browse/DTP-12083) Betstation - Fixed popups position flickering.
-   [DTP-1558](https://jira.corp.entaingroup.com/browse/DTP-1558) Fixed bug of sending wrong parent URL to cashier from payment history and manage my cards.
-   [RET-2524](https://jira.corp.entaingroup.com/browse/RET-2524) Fixed duplicated loading of features with `loggedin` strategy on Login.
-   [DTP-12035](https://jira.corp.entaingroup.com/browse/DTP-12035) Group documents if all are with the same status, e.g. `<n> Document(s) <status>`.
-   [DTP-12036](https://jira.corp.entaingroup.com/browse/DTP-12036) Removed failed documents notification when there are failed documents, but the overall verification is completed.

### Vanilla 13.0.0

2022-09-23

**HIGHLIGHTS**

-   [DTP-8135](https://jira.corp.entaingroup.com/browse/DTP-8135) Updated to `Angular 14.2.1`. Take a look at our [guide](https://vie.git.bwinparty.com/vanilla/monorepo/-/wikis/guides/major-updates).

**BREAKING CHANGES**

-   [DTP-11436](https://jira.corp.entaingroup.com/browse/DTP-11436) Cleanup code related to recaptcha versions not used anymore (v2,v3,v2Invisible), now only `Enterprise` is used. Client side logging improved.
    -   The following inputs on RecaptchaComponent were removed: `type`,`size`,`badge`, `noValidate` and `version`, along with corresponding dynacon configs.
    -   `RecaptchaVersion` config on Dynacon is now deprecated, `RecaptchaEnterpriseEnabled` is the toggle used for enablement on Login.
    -   Removed dependency `ngx-captcha`.
-   Changed popper package to a up-to-date one.
    -   Added new package dependency `ngx-popperjs`.
    -   Added new package dependency `@popperjs/core`.
    -   Removed dependency to `ngx-popper-ng10`.
    -   Removed dependency to `popper.js`
-   Uninstall `@frontend/vanilla-features` and install `@frontend/loaders`
    -   `VanillaFeaturesModule => LoadersModule`
    -   `BaseFeatureLoader => BaseLoader`
    -   `LazyFeatureLoader => Loader`
    -   `registerLazyFeatureLoader => registerLoader`
-   [DTP-134](https://jira.corp.entaingroup.com/browse/DTP-134) `BalanceProperties` and `BonusBalance` related code is now lazily-loaded (with `loggedin` [lazy-loading strategy](https://admin.dynacon.prod.env.works/services/198137/features/245375/keys/321595/valuematrix?_matchAncestors=true)) and moved from `@frontend/vanilla/core` to `@frontend/vanilla/features`.
    -   `vnUser.balanceProperties` is removed in favor of `vnBalanceProperties` lazy-loaded client config.
    -   `User.AccountBalance` is removed from `UserDslValuesProvider` in favor of `Balance.AccountBalance` DSL.
    -   `userBalance` and `hasPositiveBalance` are removed from `TrackingValueGettersService`.
    -   `BalanceService` is renamed to `BalancePropertiesService`.
-   `data` parameter for `DataLayerTrackingService.triggerEvent` is now manditory. Passing empty object will result in promise rejection.

**FEATURES**

-   [DTP-11139](https://jira.corp.entaingroup.com/browse/DTP-11139) Cashier - added tracking for deposit ofline using RTMS event `CASHIER_DEPOSIT_RECOVERY`.
-   [DTP-11569](https://jira.corp.entaingroup.com/browse/DTP-11569) Betstation - track `page.terminalId` and `page.terminalType` in terminal context.
-   [DTP-11571](https://jira.corp.entaingroup.com/browse/DTP-11571) Implement showing of brand logo for the RTMS overlays when `OverlayHeaderType` is `Logo`.
    -   [Sitecore template example](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={D633F29D-1FF9-41FC-A568-67F3E10121B3}&la=).
-   [DTP-DTP-11744](https://jira.corp.entaingroup.com/browse/DTP-11744) Created icon component.

**FIXES**

-   [DTP-10984](https://jira.corp.entaingroup.com/browse/DTP-10984) Fixed `ShopCountry` and `Jurisdiction` dynacon variation context provider null error message in log.
-   [DTP-11055](https://jira.corp.entaingroup.com/browse/DTP-11055) Fixed recaptcha failure on registration.
-   [DTP-11210](https://jira.corp.entaingroup.com/browse/DTP-11210) Fixed idle mode not triggered when scanning the ticket on the terminal.
-   [DTP-11492](https://jira.corp.entaingroup.com/browse/DTP-11492) Use available balance instead of user summary total deposit amount for documents deposit limit notice condition.
-   [DTP-11634](https://jira.corp.entaingroup.com/browse/DTP-11634) Removed tracking of manual resolution change; Filter out tracking events if tracking data is missing.

### Vanilla 12.33.0

2022-09-12

**FEATURES**

-   [DTP-10525](https://jira.corp.entaingroup.com/browse/DTP-10525) Added `VanillaFramework.Features.StatusCode` feature to define response code for specific paths.
-   [DTP-10934](https://jira.corp.entaingroup.com/browse/DTP-10934) Logged information about Affordability dsl evaluation cancellation.
-   [DTP-10608](https://jira.corp.entaingroup.com/browse/DTP-10608) Added lazy feature with id: `styles`. Use it to lazy load styles and add css classes to html node. Changed lazy feature implementation - feature needs to be both configured and registered - previously only registration was needed. No impact is expected here as dynacon changes are already in place.
-   [DTP-10949](https://jira.corp.entaingroup.com/browse/DTP-10949) Added option to set css class when close button shown as text for product menu and login component.
    -   [Product menu config](https://admin.dynacon.prod.env.works/services/198137/features/127151/keys/363061/valuematrix?_matchAncestors=true).
    -   [Login component config](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/363059/valuematrix?_matchAncestors=true).

**FIXES**

-   INC1294737 - Moved `MetaTagsService` to `@frontend/vanilla/core`. Make sure to subscribe to its `.whenReady` before using it (Poker product). Evaluated `Prerender` user agent with greater priority than `bots` user agents.
-   [DTP-11324](https://jira.corp.entaingroup.com/browse/DTP-11324) Fixed an issue with multiple `assets/manifest` api calls.
-   [DTP-10491](https://jira.corp.entaingroup.com/browse/DTP-10491) Removed listing of `SOF` documents when all use-cases are verified.
-   [DTP-9614](https://jira.corp.entaingroup.com/browse/DTP-9614) Show driving license as document name instead `IDENTITY`/`ADDRESS` when the status is the same for both.
-   [DTP-11333](https://jira.corp.entaingroup.com/browse/DTP-11333) Adapt [config](https://admin.dynacon.prod.env.works/services/198137/features/287228/keys/359245/valuematrix?_matchAncestors=true) so any valid `Link` header attribute can be added.
    -   Added crossorigin attribute to dynamic `Link` response header because it is needed even though resoruces are on the same domain.
    -   In [config](https://admin.dynacon.prod.env.works/services/198137/features/287228/keys/359245/valuematrix?_matchAncestors=true) replace `ContentType` attribute with `as` attribute.
-   [DTP-11395](https://jira.corp.entaingroup.com/browse/DTP-11395) Fixed register link on login page is not working.
-   [DTP-10947](https://jira.corp.entaingroup.com/browse/DTP-10947) Added posibility to set badge class for menu items from Sitecore, using `badgeClass` parameter.

### Vanilla 12.32.0

2022-08-31

**DOCUMENTATION**

-   [DTP-142](https://jira.corp.entaingroup.com/browse/DTP-142) https://docs.vanilla.intranet is now officially decommissioned. Use [this link](https://vie.git.bwinparty.com/vanilla/monorepo/-/wikis/home) instead.

**PERFORMANCE**

-   [DTP-10146](https://jira.corp.entaingroup.com/browse/DTP-10146) Added possibility to delay updating of the GTM data layer in order to prevent slowing down the click handler.
    -   DynaCon config: [DataLayerUpdateTimeout](https://admin.dynacon.prod.env.works/services/198137/features/123228/keys/360902/valuematrix).

**FEATURES**

-   [DTP-10127](https://jira.corp.entaingroup.com/browse/DTP-10127) Added `balance-refresh` lazy event-feature which can be configured for various events.
-   [DTP-10755](https://jira.corp.entaingroup.com/browse/DTP-10755) Moved viewport meta tag to the top of the head tag (make sure to update MobileLayout.cshtml and ClientBootstrap.cshtml files correctly).
-   [DTP-10755](https://jira.corp.entaingroup.com/browse/DTP-10755) Enabled style tags in WebAppMetadata.
-   [DTP-9072](https://jira.corp.entaingroup.com/browse/DTP-9072) Added `Claims.Get` to the list of supported `persistent DSLs`.
-   [DTP-9814](https://jira.corp.entaingroup.com/browse/DTP-9814) Epcot - added tracking for state switcher.
-   [DTP-9297](https://jira.corp.entaingroup.com/browse/DTP-9297) Send `LanguageUpdated` CCB only on manual language change.
-   [DTP-9540](https://jira.corp.entaingroup.com/browse/DTP-9540) Posted CCB event for All_Deposits.
-   [DTP-9937](https://jira.corp.entaingroup.com/browse/DTP-9937) Extend menu item to show tooltip text, based on a DSL condition.
    -   use `tooltip` in `HtmlAttributes` to set the DSL condition.
-   [DTP-10572](https://jira.corp.entaingroup.com/browse/DTP-10572) Passed `prefillUserName` and `lastVisitor` in `PRE_LOGIN` event.
-   [DTP-9877](https://jira.corp.entaingroup.com/browse/DTP-9877) Added tracking for `Clock` and `Login Duration` components.
-   [DTP-10100](https://jira.corp.entaingroup.com/browse/DTP-10100) Added header terms and conditions field that will be shown below header image. Field is added to following Sitecore templates:
    -   HeaderTermsAndConditionsToaster, HeaderTermsAndConditionsOverlay, HeaderTermsAndConditionsRewardsOverlay to [Notification template](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={91062191-226F-4BCF-8960-11DBAAE9D777}&la=).
    -   HeaderTermsAndConditionsInbox to [InboxOffer template](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={A666F2FB-2A5D-41F2-B104-DCE16D0E428E}&la=).
-   [DTP-9546](https://jira.corp.entaingroup.com/browse/DTP-9546) Changed bottom nav highlighting similar to header nav.
-   [DTP-10483](https://jira.corp.entaingroup.com/browse/DTP-10483) Added DynaCon enablement configuration for `player-gaming-declaration` feature: [IsEnabledCondition](https://admin.dynacon.prod.env.works/services/198137/features/361704/keys/361706/valuematrix?_matchAncestors=true).
-   [DTP-10947](https://jira.corp.entaingroup.com/browse/DTP-10947) Removed badge counter from `vnMenuItemBadge` directive when `badgeType=icon`.
-   [DTP-10935](https://jira.corp.entaingroup.com/browse/DTP-10935) Login page V2 - Added posibility to show dynamic register link in page footer.
    -   Register links as `PCText` items can be added to [location](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={42A45646-565E-4ABB-8A11-E26578F5C7F6}&la=). They will be filterd based on DSL condition and first one will be shown.
    -   If `PCText` item doesn't have `TitleLink` then user will be redirected to default mobile portal register page.

**FIXES**

-   [RET-2070](https://jira.corp.entaingroup.com/browse/RET-2070) Fix inactivity screen countdown hanging.
-   Fix DSL reevaluation of lazy loaded providers.
-   [DTP-9542](https://jira.corp.entaingroup.com/browse/DTP-9542) Added an input property to notify DOB component about parent form validity state.
-   [DTP-10491](https://jira.corp.entaingroup.com/browse/DTP-10491) Adjusted showing of customer documents notice for multiple use-cases.
-   [DTP-10719](https://jira.corp.entaingroup.com/browse/DTP-10719) Fix sitecore tracking via data attributes for inbox ctas.
-   INC1286027 Fix blank cashier page due to client config not ready.
-   [DTP-10936](https://jira.corp.entaingroup.com/browse/DTP-10936) Fixed DSL filter working issue after applying filter to template.

### Vanilla 12.31.0

2022-08-18

**FIXES**

-   Removed multiple client DSL contexts.

### Vanilla 12.30.0

2022-08-17

**PERFORMANCE**

-   Updated `@rtms/client` to `1.0.9` [Make sure to remove `sockjs-client (and @types/sockjs-client, if available)` from dependencies]. With this change main bundle size went down for `14KB gzipped`.

**FEATURES**

-   [DTP-10130](https://jira.corp.entaingroup.com/browse/DTP-10130) Added `UserAgent.Robot` user agent type and added it to dynacon's `UserAgent` variation context. Updated prerender configuration to use it.
-   [DTP-9866](https://jira.corp.entaingroup.com/browse/DTP-9866) Added `Frontend-Automation` user agent type and added it to dynacon's `UserAgent` variation context. Should be used by automation teams so they can tailor feature availability for their tests (i.e. turn off Recaptcha).
-   [DTP-9404](https://jira.corp.entaingroup.com/browse/DTP-9404) Added support for dynamic `103 early hints`.
    -   Added [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/287228/keys/359245/valuematrix?_matchAncestors=true) that contains file name and appropriate attributes. File name is used to read file href from `manifest.json` and then that href with attributes is added dynamically to `Link` HTTP response header.
-   [DTP-9975](https://jira.corp.entaingroup.com/browse/DTP-9975) When [SingleSignOnDomains](https://admin.dynacon.prod.env.works/services/198137/features/122748/keys/279130/valuematrix?_matchAncestors=true) is enabled add query params `parentURL` and `gavisitid` on domain change.
-   [DTP-9953](https://jira.corp.entaingroup.com/browse/DTP-9953) Passed lastLoginTime parameter in the Post_Login CCB event.
-   [DTP-9167](https://jira.corp.entaingroup.com/browse/DTP-9167) Account header bar positioning.
-   [DTP-10105](https://jira.corp.entaingroup.com/browse/DTP-10105) Expose client-side `UserFlagsService.load()`.
-   [DTP-7565](https://jira.corp.entaingroup.com/browse/DTP-7565) Removed tracking for login screen loaded.
-   [DTP-10105](https://jira.corp.entaingroup.com/browse/DTP-7565) Added deprication flag for `KycStatusService.status` and `AffordabilityService.status` observables in favor of `KycStatusService.kycStatus` and `AffordabilityService.affordabilityStatus`, which does not invoke API call as a side-effect. Use `refresh` to load the data when needed.

**FIXES**

-   [DTP-10542](https://jira.corp.entaingroup.com/browse/DTP-10542) Fixed signup bonus redirect not storing tracker cookie.
-   [DTP-10541](https://jira.corp.entaingroup.com/browse/DTP-10541) Fixed footer alignment issue.
-   Fixed missing label switcher text on new visitor page.
-   [DTP-10284](https://jira.corp.entaingroup.com/browse/DTP-10284) Don't render empty element if there is no items in left login header section.
-   [DTP-9408](https://jira.corp.entaingroup.com/browse/DTP-9408) Fixed calculation of the weekly interval in the Customer Hub time spent tile.
-   [DTP-10545](https://jira.corp.entaingroup.com/browse/DTP-10545) Reverted changes of DTP-7993.
-   [DTP-10105](https://jira.corp.entaingroup.com/browse/DTP-10105) Fixed console errors caused from `UserSummary` and `UserFlags` features.
-   INC1283034 Fixed dropdown header module name.
-   [DTP-9297](https://jira.corp.entaingroup.com/browse/DTP-9297) Fixed is language changed indicator.
-   [DTP-10178](https://jira.corp.entaingroup.com/browse/DTP-10178) Fixed potential issue with the KYC DSL evaluation.

### Vanilla 12.29.0

2022-08-05

**FEATURES**

-   [DTP-9872](https://jira.corp.entaingroup.com/browse/DTP-9872) Epcot - Login page header improvements
    -   Added possibility to show `Close` button as text by enabling [Dynacon config](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/358893/valuematrix?_matchAncestors=true). `Close` button text can be found in `Messages` section of `MobileLogin-v1.0/Login/Login` under key `HeaderCloseButtonText`.
    -   Added possiblity to add icon dynamically from [Sitecore](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={42E106FF-B471-46E5-A712-130E9253C5AA}&la=) on left side of header.
-   [DTP-9390](https://jira.corp.entaingroup.com/browse/DTP-9390) Added support for sitecore DSL filter to hide Deposit related TnCs based on "directAward" attribute.

**FIXES**

-   [DTP-9614](https://jira.corp.entaingroup.com/browse/DTP-9614) Fixed showing of the document name for SOF use-case when there is only one document.
-   Removed obsolete and not used `mpulse` lazy feature to track page group name.
-   [INC1261651](https://entain.service-now.com/esp/?id=e_form&sys_id=33c32e5b1b785d909485dd39cd4bcb3d&table=task) Move back `languages` from `@frontend/vanilla/features` to `@frontend/vanilla/core` (fixing incorrect `LOCALE_ID`).
-   [DTP-6290](https://jira.corp.entaingroup.com/browse/DTP-6290) Fixed header selector for the RTMS overlay template.
-   [DTP-9395](https://jira.corp.entaingroup.com/browse/DTP-9395) Refactor new visitor page label switcher item to be able to hide bottom nav.
-   [DTP-9027](https://jira.corp.entaingroup.com/browse/DTP-9027) Fixed showing of customer document grace period for SOF use-case.
-   [DTP-7441](https://jira.corp.entaingroup.com/browse/DTP-7441) Fixed showing of document status for multiple use-cases _(e.g. SOF + UK-KYC-REFRESH)_.

### Vanilla 12.28.0

2022-08-02

**FIXES**

-   [DTP-8547](https://jira.corp.entaingroup.com/browse/DTP-8547) Fixed login duration component for usage with any lazy load strategy.
-   [DTP-9904](https://jira.corp.entaingroup.com/browse/DTP-9904) Fixed onboarding tutorial initialization, so that onboarding task is clickable when header is disabled.
-   [DTP-9873](https://jira.corp.entaingroup.com/browse/DTP-9873) Fixed loading navigation layout menu pages.
-   [DTP-9785](https://jira.corp.entaingroup.com/browse/DTP-9785) Bug fix to show security tab.

### Vanilla 12.27.0

2022-07-29

**FEATURES**

-   [DTP-7995](https://jira.corp.entaingroup.com/browse/DTP-7995) Added `PageNotFoundMiddleware` to set 404 status code from server for client routes that do not match any pattern specified in [ClientPaths](https://admin.dynacon.prod.env.works/services/198137/features/358318/keys/358324/valuematrix?_matchAncestors=true) dynacon config.
-   [DTP-7412](https://jira.corp.entaingroup.com/browse/DTP-7412) Created inactivity popup for session expire.
-   [DTP-9523](https://jira.corp.entaingroup.com/browse/DTP-9523) Added ability to hide header close button in navigation layout page from Sitecore. New parameter `hide-close` introduced on Sitecore items in `/MobileLogin-v1.0/Navigation` folder.

**FIXES**

-   Fixed play break module bootstrapper not running.
-   [DTP-9266](https://jira.corp.entaingroup.com/browse/DTP-9266) Fixed time format of embeded clock component.
-   Fix new visitor page intermittently not saving `vn-nv-opted` cookie on CTA click and causing loop.
-   [DTP-9328](https://jira.corp.entaingroup.com/browse/DTP-9328) Embedded component can be lazy loaded with delay.
-   [DTP-9518](https://jira.corp.entaingroup.com/browse/DTP-9518) ReturnUrl will not be decoded if it contains query param whose value is URL.
-   Fixed account menu onboarding DSL evaluation.

### Vanilla 12.26.0

2022-07-22

**FEATURES**

-   [DTP-7302](https://jira.corp.entaingroup.com/browse/DTP-7302) Moved `SignUpBonusRedirect` feature to middleware.
-   [DTP-9471](https://jira.corp.entaingroup.com/browse/DTP-9471) Show label switcher success toaster on correct state change only.

**FIXES**

-   [DTP-7924](https://jira.corp.entaingroup.com/browse/DTP-7924) Fixed CH drawer not expanding to top or down on swipe in Sports.
-   [DTP-9445](https://jira.corp.entaingroup.com/browse/DTP-9445) Fixed eds group optin button.
-   [DTP-3182](https://jira.corp.entaingroup.com/browse/DTP-3182) FIxed show pagination dots in onboarding task overlay.
-   Fixed footer not showing.
    -   **FOOTER_LOADED event removed from Vanilla as it makes no sense anymore with the lazy client configs.**
    -   Added lazy `FooterService` on `@frontend/vanilla/core` that should be used for waiting till Footer is ready (`whenReady` method). Change the existing imports of FooterService.
-   Fixed account menu sometimes not opened as a route because of timing issue.
-   [DTP-9293](https://jira.corp.entaingroup.com/browse/DTP-9293) Added DynaCon config for verified user document visibility: [VerifiedDocumentsVisibilityTimespan](https://admin.dynacon.prod.env.works/services/198137/features/325151/keys/357854/valuematrix?_matchAncestors=true).
-   [DTP-7913](https://jira.corp.entaingroup.com/browse/DTP-7913) Added key to format the login duration.

### Vanilla 12.25.0

2022-07-19

**FEATURES**

[DTP-8999](https://jira.corp.entaingroup.com/browse/DTP-8999) Changed HTTPStatusCode for abuser information.
[DTP-9266](https://jira.corp.entaingroup.com/browse/DTP-9266) Made footer time format configurable.

**FIXES**

-   [DTP-9385](https://jira.corp.entaingroup.com/browse/DTP-9385) Moved toastr feature back to '@frontend/vanilla/core'.
-   [DTP-9343](https://jira.corp.entaingroup.com/browse/DTP-9343) Added [config](https://admin.dynacon.prod.env.works/services/198137/features/122030/keys/357223/valuematrix?_matchAncestors=true) to hide label switcher in footer.

### Vanilla 12.24.0

2022-07-17

**FIXES**

-   Fixed back button in navigation layout when prelogin menu action is used.
-   MLife tier number text is now moved in Sitecore: [MLifeNumberText](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={988A7106-CA6C-42D2-AC69-69CF9816AEB0}&la=)

### Vanilla 12.23.0

2022-07-15

**FEATURES**

-   [DTP-242](https://jira.corp.entaingroup.com/browse/DTP-242) Introduced Persistent DSL feature. The feature can't be activated at the moment until it's underlying data store setup is finished. Configuration [here](https://admin.dynacon.prod.env.works/services/198137/features/355141).
-   [DTP-7791](https://jira.corp.entaingroup.com/browse/DTP-7791) Added `type` to semantic file sink. Make sure to adapt web.config(s) according to change in `template.web.config`. When `/health` endpoint is accessed using `SCOM` user agent it will return only failed critical health checks if there is a failing one. In such case writes log entry to file sinks with `type="health"`. This will be used for better/easier monitoring.
-   [DTP-9227](https://jira.corp.entaingroup.com/browse/DTP-9227) [INC1250359] Added possibility to remove top level domain cookies for borgata-like label setups. Configuration [here](https://admin.dynacon.prod.env.works/services/198137/features/356688).

**FIXES**

-   [DTP-9004](https://jira.corp.entaingroup.com/browse/DTP-9004) Fixed 0 balance showing for a while when hide-if-zero specified.
-   [DTP-8927](https://jira.corp.entaingroup.com/browse/DTP-8927) Fixed Inbox not working with prelogin page on account menu.
-   Fixed CCB event late subscriptions.
-   Fixed quick deposit guard.
-   [DTP-9027](https://jira.corp.entaingroup.com/browse/DTP-9027) Added config in Sitecore to format customer documents grace period.
    -   Keys: [gracePeriodDaysToHoursThreshold](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={63AE6738-595A-481C-BF4E-E39399377774}&la=); [hideGracePeriodDaysThreshold](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={63AE6738-595A-481C-BF4E-E39399377774}&la=)
-   [DTP-8973](https://jira.corp.entaingroup.com/browse/DTP-8973) The Bonus and rewards section icon in Account Menu changed from arrow-right to arrow-down.
-   [DTP-9048](https://jira.corp.entaingroup.com/browse/DTP-9048) Epcot bug fixes - UAT: Account Menu BetMGM Rewards card font-weight change.
-   INC1251219 Fixed loading dynamic content on promo pages.
-   Fixed loading of offer button.

### Vanilla 12.22.0

2022-07-08

**PERFORMANCE** :rocket:

-   The following features are moved from `@frontend/vanilla/core` to `@frontend/vanilla/features`:
    -   `languages`, `domain-specific-actions`, `idle`, `toastr`. Configuration is available in DynaCon: [Lazy features rules](https://admin.dynacon.prod.env.works/services/198137/features/245375/keys/321595/valuematrix).
-   [DTP-9073](https://jira.corp.entaingroup.com/browse/DTP-9073) Extracted CCB event names in enum.
-   [DTP-9223](https://jira.corp.entaingroup.com/browse/DTP-9223) Extracted hard-coded NativeAppService event names.

**FEATURES**

-   [DTP-6475](https://jira.corp.entaingroup.com/browse/DTP-6475) Eds group offer - Show eds campaign status based on API response on page load.
-   [DTP-6474](https://jira.corp.entaingroup.com/browse/DTP-6474) Eds group offer - Update other campaigns' status from same group on page when user optin into one campaign.
-   [DTP-8413](https://jira.corp.entaingroup.com/browse/DTP-8413) Changed behaviour of X button on Rules overlay.
-   Added `WebAnalytics` field to `MenuItem` and `MenuItemTemplate` sitecore templates as a multiline string so tracking can be easily added in JSON format for `load` and `click` events.
-   [DTP-8923](https://jira.corp.entaingroup.com/browse/DTP-8923) Added validation text classes to `lh-validation-hint` component.

**FIXES**

-   [DTP-8881](https://jira.corp.entaingroup.com/browse/DTP-8881) Fixed "invite and earn rewards" links cursor change issue in my account popup.
-   Fix lazy features default strategy loading.
-   Fixed product menu loading.
-   Fix player gaming declaration console error when api returns null.
-   Fix Cashier client config.
-   Fixed navigation layout loading.
-   [DTP-8958](https://jira.corp.entaingroup.com/browse/DTP-8958) Fixed nemID iframe not loading on dk labels.
-   Fix lazy features strategy values merge.
-   Fix header bar client config loading delay when opening login dialog.
-   Fixed top menu in navigation layout not showing.
-   [DTP-8976](https://jira.corp.entaingroup.com/browse/DTP-8976) Fixed navigation layout page not loaded.
-   [DTP-425](https://jira.corp.entaingroup.com/browse/DTP-425) Fixed account menu close issue.
-   [DTP-1749](https://jira.corp.entaingroup.com/browse/DTP-1749) Fixed help and contact button issue.
-   [DTP-8547](https://jira.corp.entaingroup.com/browse/DTP-8547) Attempted fix on login duration component initialization.
-   [DTP-428](https://jira.corp.entaingroup.com/browse/DTP-428) Fixed myhub Help and contact icon mismatching.

### Vanilla 12.21.0 DON'T ROLLOUT

2022-07-01

**PERFORMANCE** :rocket:

-   [DTP-8397](https://jira.corp.entaingroup.com/browse/DTP-8397) Lazy-load Cashier client config.

**FIXES**

-   [DTP-8340](https://jira.corp.entaingroup.com/browse/DTP-8340) Fixed parameters fetch of 'gotoPreLogin' menu action.
-   [DTP-8585](https://jira.corp.entaingroup.com/browse/DTP-8585) Fixed updating of customer documents status for the current session.
-   [DTP-8583](https://jira.corp.entaingroup.com/browse/DTP-8583) Fixed showin of customer document 'Start now' link for `2+2` and `kycrefresh`.
-   [DTP-8584](https://jira.corp.entaingroup.com/browse/DTP-8584) Fixed showing of 'No documents' template for empty and verified state.
-   [DTP-8875](https://jira.corp.entaingroup.com/browse/DTP-8875) Fixed by adding missing horizontal line for withdrawable balance.
-   [DTP-8334](https://jira.corp.entaingroup.com/browse/DTP-8334) Language switcher bug fixed.
-   [DTP-8884](https://jira.corp.entaingroup.com/browse/DTP-8884) Fixed welcome screen layout.
-   Fixed Activity Popup showing for anonymous user in Betstation. Added [IsEnabledCondition](https://admin.dynacon.prod.env.works/services/198137/features/267977/keys/354804/valuematrix?_matchAncestors=true) to activity popup config replacing boolean `IsEnabled` in order to make it more flexible along with LazyFeatures enablement.

### Vanilla 12.20.0

2022-06-24

**PERFORMANCE** :rocket:

-   Please remove css chunks (`native-app`, `authentication`, `navigation-layout` and `inbox`) from `BootstrapAssetsProvider`. These ccs chunks will be loaded lazy with corresponding lazy feature. [Dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/245375/keys/321595/valuematrix?_matchAncestors=true) for setting up lazy features.
-   [DTP-1510](https://jira.corp.entaingroup.com/browse/DTP-1510) Implemented client level caching config that can be set for most of the Vanilla apis. Can be configured per url segment of the request in [ClientResponseCacheControl](https://admin.dynacon.prod.env.works/services/198137/features/287228/keys/353593/valuematrix?_matchAncestors=true#353859)

**FEATURES**

-   Added `header-ctrl-r__btn` class to product menu header when close button is shown as text.
-   [DTP-246](https://jira.corp.entaingroup.com/browse/DTP-246) Added tracking for self-exclusion login errors.
-   [DTP-8249](https://jira.corp.entaingroup.com/browse/DTP-8249) Added tracking for Epcot header.
-   [DTP-8340](https://jira.corp.entaingroup.com/browse/DTP-8340) Epcot Login & Register CTA along with Logo

**FIXES**

-   Fixed header config console error.
-   [DTP-8363](https://jira.corp.entaingroup.com/browse/DTP-8363) Fixed customer hub profile page display.
-   Fixed `vnLogout` client config load.
-   Fixed `BalanceBreakdownComponent`.
-   [DTP-8368](https://jira.corp.entaingroup.com/browse/DTP-8368) Fixed logout issue. Added [config](https://admin.dynacon.prod.env.works/services/198137/features/342737/keys/342740/valuematrix?_matchAncestors=true) for remember me logut prompt.
-   [DTP-8097](https://jira.corp.entaingroup.com/browse/DTP-8097) Fixed adding of multiple tracking records when updating data layer.
-   [DTP-8509](https://jira.corp.entaingroup.com/browse/DTP-8509) Bug fixed vnNemId not loaded.
-   Fixed content endpoint for `Partials`.
-   CH - Fixed header hotspot error.
-   [DTP-8236](https://jira.corp.entaingroup.com/browse/DTP-8236) Fixed calculation of passive time on user logout.
-   [DTP-8478](https://jira.corp.entaingroup.com/browse/DTP-8478) Fixed setting of active bottom navigation item when outside of `/menu` route.
-   [DTP-8565](https://jira.corp.entaingroup.com/browse/DTP-8565) Removing close button from label switcher page header in Epcot. New parameter `hide-close` introduced on sitecore items of layout `list` in AccountMenu4 folder.
-   [DTP-8395](https://jira.corp.entaingroup.com/browse/DTP-8395) Fixed showing of bonus balance header withdraw icon by extracting the class in Sitecore. Icon is removed if no class present.
    -   _Location: [Wallet -> withdrawIconClass](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={3CE1F764-0850-48FB-A674-DA116C3478B0}&la=)_
-   [DTP-8588](https://jira.corp.entaingroup.com/browse/DTP-8588) Fixed Login/Register CTAs position in account menu logged out state.
-   Fixed added theme name to html tag.
-   [DTP-8380](https://jira.corp.entaingroup.com/browse/DTP-8380), [DTP-8378](https://jira.corp.entaingroup.com/browse/DTP-8378) Fixed navigation layout config.
-   Fixed clock and login duration components not updating correctly.

### Vanilla 12.19.0

2022-06-15

**PERFORMANCE** :rocket:

-   [DTP-7690](https://jira.corp.entaingroup.com/browse/DTP-7690) Added `goToPreLogin` menu action. If user is logged in, it will navigate to item's url. If user is not logged in, it will show intermediate pre-login dialog.
-   [DTP-7750](https://jira.corp.entaingroup.com/browse/DTP-7750) Added `openDialog` menu action which opens a material dialog which title and content is configurable in sitecore (uses `parameters`).
-   [DTP-7928](https://jira.corp.entaingroup.com/browse/DTP-7928) Exposed `IAccountMenuConfiguration`.
-   Add optional `skipClientInjectionConfigCheck` param to `RenderTagManagers` method in TrackingExtensions default to `false`. Passing `true` will ignore [UseClientInjection](https://admin.dynacon.prod.env.works/services/198137/features/123228/keys/155026/valuematrix) config.
-   [DTP-7947](https://jira.corp.entaingroup.com/browse/DTP-7947) Added feature toggle for Clock and Login duration features.
-   [DTP-6983](https://jira.corp.entaingroup.com/browse/DTP-6983) Epcot - Added option to set class on underlaying header bar tag in `product menu` and `labelhost header bar`.
    -   [Config](https://admin.dynacon.prod.env.works/services/198137/features/127151/keys/342143/valuematrix?_matchAncestors=true) for setting header bar class in product menu.
    -   Added input param `headerCssClass` in `lh-header-bar` component.

**FIXES**

-   [DTP-7660](https://jira.corp.entaingroup.com/browse/DTP-7660) Fixed `cashier` feature interdependencies.
-   Fix blank product page.
-   Fixed Avatar counter providers.
-   INC1209610: Fixed inbox close issue.
-   [DTP-7993](https://jira.corp.entaingroup.com/browse/DTP-7993) Bug fixed to pass null value for user account id tracking when user is not authenticated.
-   [DTP-7322](https://jira.corp.entaingroup.com/browse/DTP-7322) Epcot - click on `Invite and earn rewards` redirects to configured link.
-   [DTP-8017](https://jira.corp.entaingroup.com/browse/DTP-8017) Epcot - click on `View Details` in `Mlife banner` redirects to configured link.

### Vanilla 12.18.0

2022-06-10

**PERFORMANCE** :rocket:

-   This release brings a combination of approaches aimed at improving overall performance and load times. We have:
    -   drastically removed the number of client configs fetched with initial `/{lang}/api/clientconfig` xhr request by making those client configs lazy (they will be fetched if/when feature is used). This decreases both load time and response size of this api call.
    -   used existing dynacon feature toggles for enablement of lazy features (where supported, plus we added toggles and will be adding them in future releases). This reduces the overall number of loaded features and keeps dynacon `Rules` configuration cleaner.
    -   introduced new lazy load strategies: `loggedin, just-loggedin, already-loggedin, event`. This aims at deferring the loading of feature to the point it is really needed.
    -   scanned `@frontend/vanilla/core`, introduced new lazy features, removed accompanying chat libraries and polished apis by moving them around. This all reduces our bundles between 30KB and 40KB bringing a size improvement of `8.3%` measured in our testweb application.
    -   used setTimeOut outside of angular zone when loading lazy features which should improve performance for low end (android) devices.
    -   added support for lazy loading of styles from sitecore (`type=content`), from any url (`type=url`) in addition to the existing one `type=theme`.

**BREAKING CHANGES** :bomb:

-   [DTP-7525](https://jira.corp.entaingroup.com/browse/DTP-7525) Decomissioned Genesys Chat Feature. Make sure to remove following npm packages `genesys-web-chat` and `cometd`.
-   Removed support for legacy native routes (pokerapp/\*).
-   Renamed `VanillaInboxModule` to `InboxModule`.
-   Moved `KycStatusService` to `@frontend/vanilla/shared/kyc`.
-   Moved `WrapperSettingsService, WrapperSettings, WrapperUpdateSettings` to `@frontend/vanilla/shared/native-app`.
-   Moved `UserFlagsService` to `@frontend/vanilla/features/user-flags`.
-   Moved `BalanceBreakdown` to `@frontend/vanilla/features/balance-breakdown`. Update your Vanilla lazy routes accordingly.
-   Moved `ProductActivatorService` to `@frontend/vanilla/shared/product-activation`.
-   Renamed `<lh-date>` to `<vn-date>`. Removed its input [newLayout] as it was redundant. Exported `DateConfig` from '@frontend/vanilla/forms'. It is lazy-loaded so subscribe to whenReady before using it.
-   Renamed all client configs that had `lh` prefix to `vn` (Make sure to update any script dependent on this).
-   `goToLogin` method in `LoginNavigationService` is now async.
-   [DTP-210](https://jira.corp.entaingroup.com/browse/DTP-210) Bug fixed for Captcha site key error.
-   [DTP-7878](https://jira.corp.entaingroup.com/browse/DTP-7878) Bug fixed to redirect from RG page to new user welcome overlay page.

**FEATURES** :clipboard:

-   [DTP-7532](https://jira.corp.entaingroup.com/browse/DTP-7532) Added support to lazy load styles from sitecore folder `App-v1.0/LazyStyles` when type=content. Added support to load any stylesheet from any url when type=url. Replaced `themesCssChunk` with `type=theme`.
-   Added `item-path-enabled` css class to html node when `ItemPathDisplayModeEnabled` is set. This will be used to improve styling when running the app in this mode.
-   [DTP-6860](https://jira.corp.entaingroup.com/browse/DTP-6860) Epcot - Added `disableCloseAnimation` option to product menu `toogle` method that can be used to disable close animation.
-   [DTP-204](https://jira.corp.entaingroup.com/browse/DTP-204) Login duration additional class when showing only time, without text.
-   [DTP-7008](https://jira.corp.entaingroup.com/browse/DTP-7008) Rework Splash screen loading. **If your MobileLayout.cshtml and ClientBootstrap.cshtml view is not updated automatically please do it manually according to changes in Vanilla**.
-   [DTP-6583](https://jira.corp.entaingroup.com/browse/DTP-6583) Epcot - Added option to show text in product menu header instead of `x` button.
    -   Can be enabled with [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/127151/keys/336966/valuematrix?_matchAncestors=true).
    -   `Close` text for product menu v1 can be found under `close-button-text` parameter in `Resources` section of [content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={13B67828-74A5-40CE-9301-70D281550004}&la=).
    -   `Close` text for product menu v2 can be found under `close-button-text` parameter in `Resources` section of [content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={74ED474A-2BDF-4F41-B6D0-E60FB318B2C4}&la=).
-   [DTP-4737](https://jira.corp.entaingroup.com/browse/DTP-4737) Added Epcot bonus balance funds in account menu.
-   [DTP-236](https://jira.corp.entaingroup.com/browse/DTP-236) Added params `text-on-click` and `disable-on-click` to menu items so alternative text can be set and link can be disabled on click.
-   [DTP-687](https://jira.corp.entaingroup.com/browse/DTP-687) Exposed `caretPosition` property in VirtualKeyboardComponent.
-   [DTP-5502](https://jira.corp.entaingroup.com/browse/DTP-5502) Added tracking for bonus balance header component and wallet account menu component.
-   [DTP-6865](hhttps://jira.corp.entaingroup.com/browse/DTP-6865) Show German annual kyc verification success toast when RTMS event `DE_ANNUAL_KYC_VERIFIED_EVENT` is sent.
    -   Please clone toast [content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={E21DAF6A-A4BE-467F-8ADB-825A153767A3}&la=) to desired labels.
-   [DTP-7188](https://jira.corp.entaingroup.com/browse/DTP-7188) Removed client-side service and DSLs for Inventory features (Shop & Terminal).
-   [DTP-7041](https://jira.corp.entaingroup.com/browse/DTP-7041) Additional classes on html tag for language switcher and label switcher.
-   [DTP-7068](https://jira.corp.entaingroup.com/browse/DTP-7068) Customer hub - Net deposit widget - Use `netLossInfoV2` PPOS endpoing instead of `netLossInfo` for fetching data.
    -   This behaviour can be toggled with this [config](https://admin.dynacon.prod.env.works/services/198137/features/198901/keys/337932/valuematrix?_matchAncestors=true).
-   [DTP-7067](https://jira.corp.entaingroup.com/browse/DTP-7067) Added support to call client side api for Geolocation mapping.
-   [DTP-235](https://jira.corp.entaingroup.com/browse/DTP-235) Added tracking for betstation inactivity screen.
-   [DTP-7383](https://jira.corp.entaingroup.com/browse/DTP-7383) Inbox message close tracking.
-   [DTP-233](https://jira.corp.entaingroup.com/browse/DTP-233) Added activity popup tracking.
-   [DTP-234](https://jira.corp.entaingroup.com/browse/DTP-234) Added betstation value ticket overlay tracking.
-   [DTP-7411](https://jira.corp.entaingroup.com/browse/DTP-7411) Added support for expandable/collapsable footer sections. Configuration [ExpandableModeEnabled](https://admin.dynacon.prod.env.works/services/198137/features/122030/keys/339658/valuematrix?_matchAncestors=true).
-   [DTP-232](https://jira.corp.entaingroup.com/browse/DTP-232) Betstation Login tracking.
-   [DTP-4419](https://jira.corp.entaingroup.com/browse/DTP-4419) DeviceAtlas - Added support for HTTP headers `Client Hints`.
    -   Update DeviceAtlas nuget package to version 2.2.0.
    -   Enable `Client Hints` by adding `Accept-CH` header to this [response header config](https://admin.dynacon.prod.env.works/services/198137/features/287228/keys/287230/valuematrix?_matchAncestors=true&previewChangesetId=175858#341319). Testweb [example](https://admin.dynacon.prod.env.works/services/198137/features/287228/keys/287230/valuematrix?_matchAncestors=true&previewChangesetId=175858#341319).
-   Epcot - Added label switcher version [config](https://admin.dynacon.prod.env.works/services/198137/features/219933/keys/341437/valuematrix?_matchAncestors=true).

**FIXES** :bug:

-   Fixed trying to close unexisting rtms connection.
-   [DTP-6910](https://jira.corp.entaingroup.com/browse/DTP-6910) Handle SOF use-case for My Documents tile.
    -   Added new Sitecore menu item for the [Limit Notice](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={B8F596D5-BBCB-4AEB-A731-3E54FF65279F}&la=).
-   [DTP-6964](https://jira.corp.entaingroup.com/browse/DTP-6964) Register cashback components only when [`CashbackType`](https://admin.dynacon.prod.env.works/services/198137/features/198901/keys/198925/valuematrix?_matchAncestors=true) is set.
    -   **If you are missing cashback in account menu after upgrade to this or higher version please set up correct cashback type in above configuration**.
-   [DTP-4598](https://jira.corp.entaingroup.com/browse/DTP-4598) Page UI bug fixed for night mode tab.
-   [DTP-6981](https://jira.corp.entaingroup.com/browse/DTP-6981) Change last known product url when product stays the same but url is different (e.g. language changed).
-   [DTP-7176](https://jira.corp.entaingroup.com/browse/DTP-7176) FIx incorrect top menu on navigation layout.
-   [DTP-7472](https://jira.corp.entaingroup.com/browse/DTP-7472) Header bar close button not working.
-   [DTP-6994](https://jira.corp.entaingroup.com/browse/DTP-6994) Stop caching `DocumentUploadStatusIsPending` property in `KycStatus` DSL provider.
-   Betstation: Fix Balance Transfer popup logout CTA not logging user out.
-   INC1212481: Fix recaptcha module not loading.
-   [DTP-7420](https://jira.corp.entaingroup.com/browse/DTP-7420) DanskeSpil - Pages that require authentication will first try to check if the user is already logged in on Danskespil side and if yes they will log in the user on Entain side. If the user is not logged in on Danskespil side he will be redirected to login page.
    -   `goToLogin` method in `LoginNavigationService` made async.
    -   `goTo` method in `LoginService2` made async.
-   [DTP-7212](https://jira.corp.entaingroup.com/browse/DTP-7212) Adjust showing of the deposit limit notice in customer documents widget based on a configuration.
    -   DynaCon config: [DepositLimitNoticeThreshold](https://admin.dynacon.prod.env.works/services/198137/features/325151/keys/339678/valuematrix?_matchAncestors=true)
-   INC1211699, INC1210037: Added fix for Signup Bonus balance redirect.
-   Fixed label switcher toaster showing more than once per session.
-   Remove duplicate `LOGOUT` CCB event being sent without params.

### Vanilla 12.17.0

2022-05-06

**FEATURES** :clipboard:

-   [DTP-188](https://jira.corp.entaingroup.com/browse/DTP-188) Added the support for sitecore `proxy folders`.
    -   Act like a proxy but not require any configuration in the parent "proxy folder" item
    -   Assume all direct decendents are choices of items that can be returned by the proxy
    -   Process the items in the same order they are configured in Sitecore
    -   Respect Sitecore publish / unpublish conditions
    -   Use DSL filters on the items themselves to iterate through to find the first matching item
    -   Only render one item
-   [DTP-4484](https://jira.corp.entaingroup.com/browse/DTP-4484) My Documents tile - handle failed and required documents scenarios.
-   [DTP-6586](https://jira.corp.entaingroup.com/browse/DTP-6586) Added `SCOM` to the list of supported user agents when dynacon `UserAgent` variation context is used.
-   [DTP-6301](https://jira.corp.entaingroup.com/browse/DTP-6301) Implemented `FEATURE_LOADED` CCB event for all lazy features.
    -   Added DynaCon DSL config for checking the user's current KYC status: [UserKycStatus](https://admin.dynacon.prod.env.works/services/198137/features/233597/keys/325157/valuematrix?_matchAncestors=true)
-   [DTP-4645](https://jira.corp.entaingroup.com/browse/DTP-4645) Epcot - Added bonus balance header component.
    -   Bonus balance item [content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={115A5C7B-3A27-4588-B118-B610FAB60ECB}&la=).
    -   Added `PlatformProductName` property to `AppDslProvider` provider that indicates platform product name.
    -   Added DynaCon DSL config for checking the user's current KycStatus: [UserKycStatus](https://admin.dynacon.prod.env.works/services/198137/features/233597/keys/325157/valuematrix?_matchAncestors=true)
-   [DTP-262](https://jira.corp.entaingroup.com/browse/DTP-262) Added [IsCashierRedirectEnabled](https://admin.dynacon.prod.env.works/services/198137/features/233597/keys/336543/valuematrix?_matchAncestors=true) dynacon config to disable redirect to cashier after receiving `KYC_VERIFIED_EVENT`.
-   Merged prerender config `VanillaFramework.Features.PrerenderIsReady` into `VanillaFramework.Features.Prerender`. Made prerender client config lazy.
-   [DTP-6827](https://jira.corp.entaingroup.com/browse/DTP-6827) Added `Age` property to `UserDslProvider` that indicates user age. Calculated based on `DateOfBirth` claim.

**FIXES** :bug:

-   [DTP-203](https://jira.corp.entaingroup.com/browse/DTP-203) Account menu 2 - Fixed icon from parent item shown in sub-item. Added `list-layout-class` parameter for dynamically adding classes to list template.
-   [DTP-5684](https://jira.corp.entaingroup.com/browse/DTP-5684) Account menu 4 - Fixed showing blank page when navigation layout is used.
-   [DTP-6701](https://jira.corp.entaingroup.com/browse/DTP-6701) Danskespil - Fixed append `loginSuccessPage` query param value dynamically in `StandaloneLoginUrl` param in [config](https://admin.dynacon.prod.env.works/services/198137/features/288792/keys/288798/valuematrix?_matchAncestors=true).
    -   Replace hardcoded query param `loginSuccessPage` value with `{LOGIN_SUCCESS_PAGE}` e.g. `loginSuccessPage={LOGIN_SUCCESS_PAGE}`. [Dynacon example](https://admin.dynacon.prod.env.works/services/198137/features/288792/keys/288798/valuematrix?_matchAncestors=true#324952).
    -   Fixed usage of `RedirectAfterLoginCondition` option.
-   [DTP-189](https://jira.corp.entaingroup.com/browse/DTP-189) Bug fixed to stop throwing error when open public page.
-   [DTP-6853](https://jira.corp.entaingroup.com/browse/DTP-6853) Attempt fix duplicated auto-login calls.

### Vanilla 12.16.0

2022-04-29

**FEATURES** :clipboard:

-   [DTP-299](https://jira.corp.entaingroup.com/browse/DTP-299) RTMS - Establish RTMS connection only in logged in state.
    -   This behaviour can be disabled in case there is some issue in receiving RTMS events from platform right after the login with [config](https://admin.dynacon.prod.env.works/services/198137/features/122353/keys/325149/valuematrix?_matchAncestors=true).
-   [DTP-6159](https://jira.corp.entaingroup.com/browse/DTP-6159) Show currency symbol received from CRM in poker cashback.
-   [DTP-190](https://jira.corp.entaingroup.com/browse/DTP-190) Added toggle to skip call to Btag.
-   [DTP-263](https://jira.corp.entaingroup.com/browse/DTP-263) Added configuration to hadle bonus page redirection.
-   [DTP-6202](https://jira.corp.entaingroup.com/browse/DTP-6202) Added markup for the title of language and location switcher.
-   [DTP-3603](https://jira.corp.entaingroup.com/browse/DTP-3603) Vanilla performance profiling adjusts.

**FIXES** :bug:

-   Fixed claims dsl invalidation.

### Vanilla 12.15.0

2022-04-22

**FEATURES** :clipboard:

-   Updated to `angular 13.3.4`.
-   Removed deprecated `WorkflowService` and renamed `WorkflowNewService` to `WorkflowService`.
-   [DTP-5875](https://jira.corp.entaingroup.com/browse/DTP-5875) Introduced `App.Theme` server side DSL.
-   [DTP-6050](https://jira.corp.entaingroup.com/browse/DTP-6050) Epcot - New User page.
-   [DTP-299](https://jira.corp.entaingroup.com/browse/DTP-299) RTMS - Establish RTMS connection only in logged in state.
    -   This behaviour can be disabled in case there is some issue in receiving RTMS events from platform right after the login with [config](https://admin.dynacon.prod.env.works/services/198137/features/122353/keys/325149/valuematrix?_matchAncestors=true).
-   [DTP-190](https://jira.corp.entaingroup.com/browse/DTP-190) Added toggle to skip call to Btag.

**FIXES** :bug:

-   [DTP-6154](https://jira.corp.entaingroup.com/browse/DTP-6154) Fix account menu slider not navigating with dots.
-   [INC1146548](https://entain.service-now.com/esp/?id=e_form&sys_id=bed41e87879ec91058f0bae09bbb356b&table=task) Extended Cashier query parameters with `page.frontend` value: e.g. `&frontend=desktop`.

### Vanilla 12.14.0

2022-04-15

**FEATURES** :clipboard:

-   [https://jira.corp.entaingroup.com/browse/DTP-50](https://jira.corp.entaingroup.com/browse/DTP-50) Health endpoints `/health` and `/health/report` now show only enabled health checks.
-   [DTP-3212](https://jira.corp.entaingroup.com/browse/DTP-3212) Added the feature which allows showing sitecore item's path instead actual content. Uses templates and fields in [ItemPathDisplayModeMapping](https://admin.dynacon.prod.env.works/services/198137/features/122634/keys/323030/valuematrix?_matchAncestors=true) and replaces their values with actual item's path. Use [ItemPathDisplayModeEnabled](https://admin.dynacon.prod.env.works/services/198137/features/122634/keys/323028/valuematrix?_matchAncestors=true) to enable this feature. This can signifactly speed-up finding actual items in sitecore and reduce the number of questions related to items sitecore location.
-   [DTP-205](https://jira.corp.entaingroup.com/browse/DTP-205) Added key `version.Themes` with value of npm package `@themes/whitelabel` to kibana log entries.
-   [DTP-4614](https://jira.corp.entaingroup.com/browse/DTP-4614) Added redesign label switcher menu.
    -   Label switcher menu can be opened from sitecore with menu action `toggleLabelSwitcher`.

**FIXES** :bug:

-   [DTP-5259](https://jira.corp.entaingroup.com/browse/DTP-5259) Fixed recaptcha error while linking oauth accounts.
-   Fix showing out of state deposit even when `IsRestrictedAccessCondition` is disabled.
-   [DTP-133](https://jira.corp.entaingroup.com/browse/DTP-133) Fixed case-insensitive claims DSL cache invalidation.

### Vanilla 12.13.0

2022-04-08

**FEATURES**

-   Updated to `angular 13.3.2`.
-   [DTP-300](https://jira.corp.entaingroup.com/browse/DTP-300)[DTP-159](https://jira.corp.entaingroup.com/browse/DTP-159) Added support for lazy loading of features and themes css chunks based on `DSL` [configuration](https://admin.dynacon.prod.env.works/services/198137/features/245375/keys/321595/valuematrix?_matchAncestors=true).
-   [DTP-301](https://jira.corp.entaingroup.com/browse/DTP-301) Decommissioned unused `background` feature.
-   [DTP-4705](https://jira.corp.entaingroup.com/browse/DTP-4705) Regulatory header for partypoker.dk and bwin.dk. `vn-clock` is now supported ad embeddable component to be used on sitecore content.
-   [DTP-5258](https://jira.corp.entaingroup.com/browse/DTP-5258) Epcot - Added search icon in product navigation for desktop. [Content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={B4B18101-66E8-4F41-AA00-FCEBBF663065}&la=) .
-   [DTP-4318](https://jira.corp.entaingroup.com/browse/DTP-4318) Modified login with bank id screen. Removed tabs and added buttons to switch screen.
-   [DTP-4961](https://jira.corp.entaingroup.com/browse/DTP-4961) Added configuration to change PosAPI version for specific endpoint: [DynaCon config](https://admin.dynacon.prod.env.works/services/198137/features/123694/keys/322293/valuematrix).
-   Updated NuGet packages FluentAssertions 5.10.3 -> 6.6.0
-   [DTP-4713](https://jira.corp.entaingroup.com/browse/DTP-4713) MPP pages - introduced new component type `pc-header-for-mpp-page` that should be used as header in MPP pages.
    -   Set render parameter to `pc-header-for-mpp-page` instead of `pc-text-with-header-bar` in MPP pages. With doing this, no need for adding `custom-header-media-query` parameter.
    -   Cross CTA in mobile view will redirect user to previous page.
    -   Back button in desktop view will redirect user to previous page.
-   [DTP-5559](https://jira.corp.entaingroup.com/browse/DTP-5559) Added `form-group-label--invalid` class to login form labels when input is invalid.

**FIXES**

-   Fixed an issue where login dialog would be shown over betstation inactivity screen.
-   [DTP-1519](https://jira.corp.entaingroup.com/browse/DTP-1519) Fixed tracking of "Get verified" CTA in verification badge info.
-   [DTP-4986](https://jira.corp.entaingroup.com/browse/DTP-4986) Fixed Currency DSL failing if value is 0.
-   [DTP-4346](https://jira.corp.entaingroup.com/browse/DTP-4346) Fixed tracking of browser.resolution/orientation to appear in data layer untill it change.
-   Fixed replace of static keys in inbox and overlay.
-   [Ontario](https://tasks.office.com/coralracing.onmicrosoft.com/Home/Task/8ClUOcp1Sk-vXQAlWUuxN5cAO47C?Type=TaskLink&Channel=Link&CreatedTime=637847577590590000) - Fixed don't shown logout toast when session exipred and user clicks logout button.
-   [DTP-5555](https://jira.corp.entaingroup.com/browse/DTP-5555) Fixed geolocation issue on quick deposit.
-   [DTP-194](https://jira.corp.entaingroup.com/browse/DTP-194) Fixed append correctly query param in `vnProfilesSrc`.

### Vanilla 12.12.0

2022-04-01

**FEATURES**

-   [DTP-4272](https://jira.corp.entaingroup.com/browse/DTP-4272) Fixed unhandled exception when login with query string.
-   [DTP-4575](https://jira.corp.entaingroup.com/browse/DTP-4575) Poker Cashback 2.0 - Display `tournament Dollars/Euros` in poker cashback based on awardType. [AwardType config](https://admin.dynacon.prod.env.works/services/198137/features/198901/keys/320012/valuematrix?_matchAncestors=true). [Tournament poker cashback config](https://admin.dynacon.prod.env.works/services/198137/features/198901/keys/321696/valuematrix?_matchAncestors=true#321697).
-   [DTP-3224](https://jira.corp.entaingroup.com/browse/DTP-3224) Added tracking for home logo and product switcher.
-   [DTP-4682](https://jira.corp.entaingroup.com/browse/DTP-4682) Adjusted [BypassTechnicalError](https://admin.dynacon.prod.env.works/services/198137/features/122236/keys/244331/valuematrix?_matchAncestors=true) configuration to allow login on reCAPTCHA exception.
-   [DTP-4831](https://jira.corp.entaingroup.com/browse/DTP-4831) Added feature to redirect initially requested URL post successful acceptance of Austria Gaming Declaration popup.

**FIXES**

-   [DTP-5121](https://jira.corp.entaingroup.com/browse/DTP-5121) Restricted `X-App-Context` header only to our backend api calls.
-   [DTP-3737](https://jira.corp.entaingroup.com/browse/DTP-3737) Fixed proxy rule doesn't work outside vanilla.mobile folder.
-   [DTP-2192](https://jira.corp.entaingroup.com/browse/DTP-3737) Fixed reseting of the account menu drawer on verification status icon click.
-   [DTP-4646](https://jira.corp.entaingroup.com/browse/DTP-4646) Rework fix for hiding top menu on mobile for Dark mode on account menu V3.

### Vanilla 12.11.0

2022-03-28

**FIXES**

-   [DTP-4866](https://jira.corp.entaingroup.com/browse/DTP-4866) Fixed throwing exception when trying to parse DSL inside JSON content from sitecore. If content is JSON vanilla content filtering logic will be skipped.
-   [DTP-5114](https://jira.corp.entaingroup.com/browse/DTP-5114) Fixed display of right arrow in account menu.
-   [DTP-5112](https://jira.corp.entaingroup.com/browse/DTP-5112) Fixed counter badge visibility logic.
-   [DTP-4828](https://jira.corp.entaingroup.com/browse/DTP-4828) Adjusted navigation pills to be toggleable.

### Vanilla 12.10.0

2022-03-25

**FEATURES**

-   [DTP-3646](https://jira.corp.entaingroup.com/browse/DTP-3646) EPCOT Account Menu Logged-Out state.
-   [DTP-3649](https://jira.corp.entaingroup.com/browse/DTP-3649) EPCOT Account Menu Logged-In state.
-   [DTP-437](https://jira.corp.entaingroup.com/browse/DTP-437) Added support for xPOS API (Extended POS). Use `ExtendedApiRestRequest`. Configuration options are available [here](https://admin.dynacon.prod.env.works/services/198137/features/320549).
-   [DTP-4828](https://jira.corp.entaingroup.com/browse/DTP-3316) Added initial navigation pills feature. Use `NavigationPillService` from `@frontend/vanilla/features/responsive-header` to integrate.
    -   Sitecore items: [PillItems](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={8C494B6E-843E-4AAC-BBEF-3961E62ABAC8}&la=).
-   [DTP-4736](https://jira.corp.entaingroup.com/browse/DTP-4736) Added P$ balance breakdown page.

**FIXES**

-   [DTP-4272](https://jira.corp.entaingroup.com/browse/DTP-4272) Fixed unhandled exception when login with query string.
-   [DTP-4649](https://jira.corp.entaingroup.com/browse/DTP-4649) Fix shared rtms services instantiating twice.
-   Fixed label switcher geolocation error.

### Vanilla 12.9.0

2022-03-18

**FEATURES**

-   Updated to `angular 13.3.0` and `"@cloudflare/stream-angular": "1.0.0"`.
-   [DTP-155](https://jira.corp.entaingroup.com/browse/DTP-155) Introduced application context awareness. Client-side code determines if application is running in iframe context. It passes this info to all server calls by adding `X-App-Context` request header. `Make sure to whitelist this request header where needed (3rd party integrations).` Currently following two state values are used: `default` and `iframe`. Implemented accompanying DSL `App.Context` and dynacon variation context `AppContext`. Client-side api to get the value `NativeAppService.context`.
-   Added sending CCB events over `window.webkit.messageHandlers.observer.postMessage` to support future poker clients.
-   [DTP-4602](https://jira.corp.entaingroup.com/browse/DTP-4602) Added `redirectQueryParams` [DynaCon config](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix?_matchAncestors=true) for login providers.
-   [DTP-2095](https://jira.corp.entaingroup.com/browse/DTP-2095) Adapted `state switcher` so it can use `Geolocation.State` DSL provider for showing `change label` and `restricted access` toasts.
    -   Please adapt corresponding dynacon configs to use `Geolocation.State`.
    -   [Change label config](https://admin.dynacon.prod.env.works/services/198137/features/219933/keys/219989/valuematrix?_matchAncestors=true)
    -   [Restricted access config](https://admin.dynacon.prod.env.works/services/198137/features/219933/keys/219971/valuematrix?_matchAncestors=true)
-   [DTP-4736](https://jira.corp.entaingroup.com/browse/DTP-4736) Added P$ balance breakdown page.

**FIXES**

-   Fixed writing of kibana log errors related to `HeaderProduct` dynacon provider.
-   [DTP-3421](https://jira.corp.entaingroup.com/browse/DTP-3421) Fixed overlapping of account recovery success message with login limits toast message.
-   [DTP-1611](https://jira.corp.entaingroup.com/browse/DTP-1611) Sent ShopId and TerminalId properties to PosApi when login retail users for Grid/Connect.
-   [DTP-4600](https://jira.corp.entaingroup.com/browse/DTP-4600) CH - Fixed swiper index changed event on onboarding overlay.
-   [DTP-4646](https://jira.corp.entaingroup.com/browse/DTP-4646) Fixed displaying top menu on mobile for navigation layout with account menu V3.
-   [DTP-1406](https://jira.corp.entaingroup.com/browse/DTP-1406) Epcot header search. Fixed event on input click. Use `HeaderSearchService` from `@frontend/vanilla/shared/header` to subscribe to `clickEvent`.
-   Remove currency api dependency for PP Dollars.
-   [DTP-3722](https://jira.corp.entaingroup.com/browse/DTP-3722) Fixed displaying of time values in session limits overlay.
-   Fixed deposit limits placeholder in session limits toast when limits are not set.

### Vanilla 12.8.0

2022-03-11

**FEATURES**

-   Updated to `angular 13.2.6` and `"@cloudflare/stream-angular": "1.0.0-rc.1"`.
-   Removed mpulse soft navigation tracking.
-   [DTP-2389](https://jira.corp.entaingroup.com/browse/DTP-2389) Added writing of `sso` http-only cookie after login with value of user's ssoToken.
-   [DTP-2683](https://jira.corp.entaingroup.com/browse/DTP-2683) Expended `Offer button` so it can handle eds group optin.
    -   Replace `data-offer-id` with `data-campaign-id`, where `data-campaign-id` specifies EDS Group Offer event ID.
    -   Set `data-offer-type` to `EDSGroup` value.
    -   Example in testweb https://testweb.vanilla.intranet/en/p/edsgroupbutton with coressponding Sitecore item http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={501C8B73-FB8B-40A2-8F5B-C01323818463}&la=.
    -   [Documentation](https://vie.git.bwinparty.com/vanilla/monorepo/-/wikis/EDS-Group-Offer-button)
-   [DTP-3719](https://jira.corp.entaingroup.com/browse/DTP-3719) Added inactivity screen implementation. To enable it, specify [Mode](https://admin.dynacon.prod.env.works/services/198137/features/250385/keys/317818/valuematrix?_matchAncestors=true) with value `Web`. Popup gets content from this [item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={D7775807-C5BD-42DE-BCA9-9E66FF7DE443}&la=). Message on login page (after logout) comes from this [item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={D888F629-7632-4D54-8DD9-5D882E73577B}&la=).
-   [DTP-1788](https://jira.corp.entaingroup.com/browse/DTP-1788) Show toaster message on `KYC_VERIFIED_EVENT_RMP` - [Sitecore item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={2B512CE4-AA2E-4A9B-9085-14426BF975F4}&la=).
-   [DTP-255](https://jira.corp.entaingroup.com/browse/DTP-255) Changed the style of the text of "Total Slots Fee" for User summary overlay.
-   [DTP-4413](https://jira.corp.entaingroup.com/browse/DTP-4413) Added sending of CCB event `FEATURE_LOADED`, for now specific to geolocation feature, but will be extended in the future to all lazily loaded features.
-   [DTP-3709](https://jira.corp.entaingroup.com/browse/DTP-3709) Betstation - Vanilla will not logout `anonymous user` when idle mode triggers. It will just send `RESET_TERMINAL` CCB event.
-   [DTP-4085](https://jira.corp.entaingroup.com/browse/DTP-4085) Changed time spent tile to include the interval in days for a complete calendar week. New Sitecore key: [WeekOf](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={7F611E6A-31F1-4B8B-9034-11DAC21F01AF}&la=).
-   [DTP-3786](https://jira.corp.entaingroup.com/browse/DTP-3786) Fixed NullDeserializedException when endpoint returns http code 204.

**FIXES**

-   [DTP-4320](https://jira.corp.entaingroup.com/browse/DTP-4320) Fixed KYC status response when customer doc details are unavailable.
-   Send `hideCloseButton` CCB on gaming declaration route recognized in order to reduce the time of close button enabled in download client.
-   [DTP-2940](https://jira.corp.entaingroup.com/browse/DTP-2940) Add support to add link classes via sitecore to balance breakdown CTAs and add balance item and CTA to account menu V1 balance.
-   [DTP-4411](https://jira.corp.entaingroup.com/browse/DTP-4411) Fix getting enabled providers reading from cookies on every change detection cycle on login page.

### Vanilla 12.7.0

2022-03-04

**FEATURES**

-   [DTP-2379](https://jira.corp.entaingroup.com/browse/DTP-2379) Added tracking for player gaming declaration popup.
-   Player gaming declaration - Added sending of ccb event `hideCloseButton`. Added `gaming-declaration` css class to html node.
-   [DTP-3219](https://jira.corp.entaingroup.com/browse/DTP-3219) Added initial Customer Documents tile feature.
    -   Sitecore items: [DocumentsWidget](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={63AE6738-595A-481C-BF4E-E39399377774}&la=).
    -   DynaCon config: [DocumentVerificationStatus](https://admin.dynacon.prod.env.works/services/198137/features/233597/keys/316308/valuematrix?_matchAncestors=true).
    -   New DSLs: `KycStatus.DocumentUseCase`; `KycStatus.DocumentIsVerified`; `KycStatus.DocumentVerifiedTime`.
-   [DTP-2188](https://jira.corp.entaingroup.com/browse/DTP-2188) `CryptoService` is moved from `@frontend/vanilla/core` to `@frontend/vanilla/shared`.
    -   Lazy-load `crypto-js` library in order to reduce main bundle size.

**FIXES**

-   Fixed `Epcot.IsEnabled` DSL provider is evaluated on every request to server.
-   [DTP-2229](https://jira.corp.entaingroup.com/browse/DTP-2229) Clear login messages queue on login dialog close.

### Vanilla 12.6.0

2022-02-25

**FEATURES**

-   Updated to `angular 13.2.4`.
-   [DTP-1380](https://jira.corp.entaingroup.com/browse/DTP-1380) Added some fixes needed for `Sitecore's smart label` concept.
-   [DTP-1506](https://jira.corp.entaingroup.com/browse/DTP-1506) Epcot - Extended product menu V1 to support Epcot
    -   Enable product menu animation [config](https://admin.dynacon.prod.env.works/services/198137/features/127151/keys/315790/valuematrix?_matchAncestors=true).
    -   Hide tabs [config](https://admin.dynacon.prod.env.works/services/198137/features/127151/keys/315792/valuematrix?_matchAncestors=true).
    -   Added option to set custom header title for every product. Clone [header item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={13B67828-74A5-40CE-9301-70D281550004}&la=) and add key in `Resources` section. Key is name of the product, that you can take from `product` property in `Page` config. Value should be title that you want to show e.g key `vanilla-testweb`, value `Testweb`.
    -   Added option to dynamically add class from Sitecore to the header, so you can add class that will make header sticky.
    -   Added `Epcot.IsEnabled` DSL provider that can be used to determine if Epcot feature is enabled. Current values are `Header` and `AccountMenu`.
-   [DTP-3213](https://jira.corp.entaingroup.com/browse/DTP-3213) CH - Fixed show zero in time spent widget when there is no record for previous time spent.
-   [DTP-3715](https://jira.corp.entaingroup.com/browse/DTP-3715) Added [IsAutoLogoutEnabled](https://admin.dynacon.prod.env.works/services/198137/features/225237/keys/316062/valuematrix?_matchAncestors=true) DynaCon config to toggle auto-logout on session limit reached.

**FIXES**

-   Added sending of CCB event `GAMING_DECLARATION_ACCEPTED`.
-   [INC1116803](https://entain.service-now.com/esp/?id=e_form&sys_id=c50409b587f585106cb4ebdbbbbb353d&table=task) Fixed `\\n` characters rendered in the `PageMatrix` component text.

### Vanilla 12.5.0

2022-02-18

**HIGHLIGHTS**

-   Updated to `angular 13.2.3` and `rxjs 7.5.4`.

**FEATURES**

-   [DTP-1406](https://jira.corp.entaingroup.com/browse/DTP-1406) Epcot header search. Use `HeaderSearchService` from `@frontend/vanilla/shared/header` to subscribe to user's search inputs. Sitecore item is [here](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={79AC82F8-908C-4543-9D7D-30BEE5154044}&la=).
-   [DTP-2784](https://jira.corp.entaingroup.com/browse/DTP-2784) Added versioning for the connect card login dialog layout.
    -   DynaCon config: [ConnectCardVersion](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/315527/valuematrix?_matchAncestors=true).
    -   New Sitecore field: [ConnectCardLoginTitle](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={F2B88473-0373-4B8B-A3CF-F2D439C796FF}&la=).

**FIXES**

-   [DTP-259](https://jira.corp.entaingroup.com/browse/DTP-259) Fixed tracking of the smart banner opening.
-   [DTP-2659](https://jira.corp.entaingroup.com/browse/DTP-2659) Make register link available for the connected card login page.

### Vanilla 12.4.0

2022-02-14

**FIXES**

-   [DTP-2164](https://jira.corp.entaingroup.com/browse/DTP-2164) Fixed display of `vn-dropdown-header` component.
-   [DTP-1404](https://jira.corp.entaingroup.com/browse/DTP-1404) Extended login providers `queryParams` (instead of `redirectQueryParams`) with values based on Sitecore config.
    -   Removed `trigger: 'login'` from `redirectQueryParams` - please adjust in DynaCon.

### Vanilla 12.3.0

2022-02-11

**FEATURES**

-   [DTP-455](https://jira.corp.entaingroup.com/browse/DTP-455) Betstation - Hardware Fault behavior message.
-   [DTP-1490](https://jira.corp.entaingroup.com/browse/DTP-1490) Betstation - Close Hardware Fault behavior message.
-   [DTP-1404](https://jira.corp.entaingroup.com/browse/DTP-1404) Extended `redirectQueryParams` for the login providers based on values from Sitecore.
    -   To add query parameters use `Values` field in the respective login provider button template (e.g. [FacebookButton](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={674931F7-D713-4263-9BD7-AE399AF9FC46}&la=)).
-   [DTP-139](https://jira.corp.entaingroup.com/browse/DTP-139) Added validation of DSL cookie value for unallowed characters.
    -   Validation rules (using regex) can be applied from DynaCon: [CookieStringRules](https://admin.dynacon.prod.env.works/services/198137/features/290738/keys/314229/valuematrix?_matchAncestors=true).

**FIXES**

-   [INC1102837](https://entain.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D716a68911b2dc5d0be1a4339cd4bcb09%26sysparm_stack%3D%26sysparm_view%3D) Changed `systemLogout` parameter sent to natives to `false` when manual or auto-logout.
-   Fix null date handling for Austria gaming declaration.
-   Fix showing Austria gaming declaration for users on First Login (after registration).
-   [DTP-1692](https://jira.corp.entaingroup.com/browse/DTP-1692) Added `PositionEvent` when tracking login with provider.
-   [DTP-1741](https://jira.corp.entaingroup.com/browse/DTP-1741) Fix error message is displaying only for a fraction of second in defull kyc screen.

### Vanilla 12.2.0

2022-02-09

**FIXES**

-   Skip duplicate phone validation implemented in [B-463541](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21000914) that currently blocks users from login with mobile.
-   [DTP-1377](https://jira.corp.entaingroup.com/browse/DTP-1377) Added session limits logout popup that is triggerd with RTMS notification `AUTO_LOGOUT_EVENT_WITH_POPUP`. Popup content Sitecore [location](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={984D9178-2BD7-4170-930E-29DF7FA3C7A5}&la=).

### Vanilla 12.1.0

2022-02-07

**FEATURES**

-   Updated to `angular 13.1.4`
-   [DTP-261](https://jira.corp.entaingroup.com/browse/DTP-261) Update web tracking for login with mobile number.
-   Added `CryptoService` (wrapper around `crypto-js`), which can be used to encrypt/decrypt data.
    -   DynaCon config: https://admin.dynacon.prod.env.works/services/198137/features/303108
-   [DTP-555](https://jira.corp.entaingroup.com/browse/DTP-555) Austria Gaming Declaration. Sync your [vanilla-lazy-routes](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/vanilla-lazy.routes.ts#L48).
-   [DTP-1405](https://jira.corp.entaingroup.com/browse/DTP-1405) Epcot - Added version config to `Header configuration`.
    -   For Epcot set version to value 2 in [config](https://admin.dynacon.prod.env.works/services/198200/features/103702/keys/313861/valuematrix?_matchAncestors=true).
    -   Content for [product items](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={2284E7B2-AA10-4B50-AF2C-D1BE876B79C1}&la=).

**FIXES**

-   ARC TimeSpent tile: Fixes for api call and time format.
-   Fixed display of login duration component.
-   Fixed virtual keyboard re-initialization after navigation.
-   Fixed poper click doesn't work on full page reload in balance breakdown.
-   [DTP-820](https://jira.corp.entaingroup.com/browse/DTP-820) Connect card login page adjustments.
    -   Content added: [ConnectCardLogo](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={1DFC86E5-EA42-4B7D-9768-39046CC42242}&la=); [ConnectCardPageText](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={F2B88473-0373-4B8B-A3CF-F2D439C796FF}&la=).
-   [DTP-891](https://jira.corp.entaingroup.com/browse/DTP-891) Remove liveperson query params from url after returning from cashier.
-   [DTP-417](https://jira.corp.entaingroup.com/browse/DTP-417) Fixed login limits toast text.
-   [DTP-822](https://jira.corp.entaingroup.com/browse/DTP-822) Fixed Apple login provider profile fetching.
-   [DTP-420](https://jira.corp.entaingroup.com/browse/DTP-420) Ladbrokes/Coral: Fix dsl context missing providers when product changes from `host` to embedded product.
-   [DTP-716](https://jira.corp.entaingroup.com/browse/DTP-716) Fixed toastr is not shown in Safari browser because `non-ASCII` characters are refused by Safari.
-   Add again binding redirect for assembly System.Text.Encodings.Web to fix SiteScripts injection and log spamming (removed by merge).
-   Fix swiper index changed event for balance breakdown and account menu onboarding overlay.
-   Prevented ReCaptcha API re-initialization when on the same route.
-   Fix Dependency Injection error on RTMS Layer component.

### Vanilla 12.0.0

2022-01-19

**BEFORE THE UPDATE**

-   You can already change imports in your solution to minimize amount to code changes related to this update. Change all your imports `from '@frontend/vanilla';` to `from '@frontend/vanilla/core';`' Leave only import of VanillaLibModule from @frontend/vanilla.

**HIGHLIGHTS**

-   Updated to `angular 13.1.3`
-   Potential @frontend/vanilla/core bundle size decrease of `41.7%` - from `113 KB to 74 KB (gzipped)` (measured on our testweb app).
-   Potential production application build time descrease by `27%` (measured on our testweb app).

**BREAKING CHANGES**

-   Replace `VanillaLibModule` with `VanillaCoreModule` in your [AppModule](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/app.module.ts#L53).
-   Add `VanillaStoreModule.forRoot()` to your [AppModule](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/app.module.ts#L54).
-   Update your `BootstrapAssetsProvider` - there is no longer need so specify different filenames for differential loading. Example [here](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Playground/BootstrapAssetsProvider.cs#L39).
-   `CarouselComponent` (vn-carousel) is no longer provided by Vanilla, as [swiper](https://swiperjs.com/angular) launched an Angular version some time ago and we removed the previous `ngx-swiper-wrapper` package.
    Refer the package page in order to make the necessary changes on your side, the styles will be included on themes so this can be skipped.
    Sample usage on Vanilla side [HERE](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/master/Bwin.Vanilla.PluginHost/Client/vanilla/account-menu/src/sub-components/slider.html) for the markup and [HERE](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/master/Bwin.Vanilla.PluginHost/Client/vanilla/account-menu/src/sub-components/slider.component.ts) for the code.
-   Update `vanilla-webpack` to 5.0.21 as Angular locales were moved to the package.
-   Update your `ng.plugin.js` so the splitChunks configuration for the locales matches to `vanilla-webpack`. Copy from [here](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/webpack/ng.plugin.js#L44).
-   Parameter `runOperationInsideZone` removed from `TimerService.setTimeoutOutsideAngularZone` so this method is now purely running the interval outside as the name suggests, which was not the case before as default value for `runOperationInsideZone` was true, hence triggering change detection multiple times and affecting performance. Update your usages in case this parameter was being used and in case it was not, double check if the feature behaves same way as it was running `Inside` the Angular zone and now will run `Outside`.

**FEATURES**

-   [DTP-251](https://jira.corp.entaingroup.com/browse/DTP-251) Added support for native apps to receive `POST_LOGIN` ccb event after all post login interceptors are handled. (Use new endpoint `/labelhost/workflow` instead `/labelhost/workflow/pending` or `labelhost/workflow/pendingpostlogin`).
-   Removed `vanillaVersion` kibana log property. You can switch to usage of `version.VanillaFramework` if you still used the old, deprecated name.
-   [B-479147](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21697699) Exposed `GetEdsGroupStatusAsync(ExecutionMode mode, [NotNull] string groupId, bool cached = true)` method in `IPosApiNotificationService` interface for fetching eds group status.
-   [B-479342](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21704795) Exposed `UpdateEdsGroupStatusAsync(ExecutionMode mode, EdsGroupOptInRequest request)` method in `IPosApiNotificationService` interface for updating eds group optin status.
-   [B-464112](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21031372) Remember me logout prompt tracking.
-   [B-487050](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21987699) Added welcome screen for Apple.
    -   Welcome screen is now shown based on last used login with provider option if [welcomeDialog](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix?_filter=welcomeDialog&_filterExpanded.value=true&_matchAncestors=true) is enabled for multiple providers.
-   [B-475991](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21560685) Adapted `ConnectedAccounts.Count` DSL provider to platform changes.
-   [B-482841](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21850820) Modified tabbed login screen with new buttons:
    -   [Conncect login button](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={D3C2F90A-FE09-4DF1-87D3-EC2721F45601}&la=)
    -   [Email login button](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={7476415C-8487-4F85-A1A4-548064432775}&la=)
-   [B-486181](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21957183) Added client ip address as `clientIP` property in `vnPage` client config.
-   [B-482839](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21850776) Added / adjusted tabbed login tracking.
-   [B-478228](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21659916) Added `providerId` as a DOM element class instead of ID for virtual keyboard component (e.g. `simple-keyboard english`);
    -   Extended `defaultOptions` with: `theme: 'simple-keyboard hg-theme-default hg-layout-default'`.
-   [B-456413](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20679528) CH - Display verification status badge. Sitecore rules can be configured [here](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={50CD3061-F7E2-4A8B-83EA-E02ED8B23EDA}&la=).
-   [DTP-258](https://jira.corp.entaingroup.com/browse/DTP-258) Added [ShowHeaderBarClose](https://admin.dynacon.prod.env.works/services/198137/features/198901/keys/301211/valuematrix?_matchAncestors=true) configuration.
-   [DTP-223](https://jira.corp.entaingroup.com/browse/DTP-223) ARC - Time Spent Tile. Sitecore item with configurations/messages [here](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={1C705927-3F31-4CBA-861E-FCDEF2652FBD}&la=).
-   [DTP-259](https://jira.corp.entaingroup.com/browse/DTP-259) Added tracking for smart banner.
-   [DTP-256](https://jira.corp.entaingroup.com/browse/DTP-256) Added tracking for product cool off overlay.
-   [DTP-443](https://jira.corp.entaingroup.com/browse/DTP-443) PP Dollars in Balance breakdown.

**FIXES**

-   [D-125291](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21960567) Fixed `postlogin` issue related to `additionalCcbParameters`.
-   [D-124437](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21766894) Added option to open cashier transaction history page through url.
-   Fix limits toaster removing client formatting as lastLoginTimeFormatted is formatted in the backend.
-   [D-125352](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21972109) Removed login provider title element (`p.login-provider-title`) from the DOM if text is missing.
-   [D-124794](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21857684) Fix incorrect days displaying on Tasks.
    -   Considering `GraceDaysUnit` from KycStatus response and converting always to Days for the frontend calculation.
    -   Added `GraceDaysUnitDivisor` to KycStatus Dsl Provider to be used in the Task formula for the conversion.
    -   Task formula parameter now used is `dsl-countdown-formula`.
-   [D-125176](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21926782) Fixed store return url when login integration is enabled.
-   [DTP-448](https://jira.corp.entaingroup.com/browse/DTP-448) Removed logging of empty tracking values.

### Vanilla 11.19.0

2021-12-14

**FEATURES**

-   [B-468490](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21224412) Added menu action `openZendeskChat` for opening zendesk chat.
-   [B-449443](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20430931) `INC806360` & `INC838298` & `INC806285` Improving cookie security. New configuration [DefaultSameSiteMode](https://admin.dynacon.prod.env.works/services/198137/features/160506/keys/296501/valuematrix?_matchAncestors=true) was added to set default cookie SameSite attribute for Vanilla cookies.
    -   **Important**: Currently config is set to `Lax`, as per security team recommendation not to have it as `None`, but in case any issues are observed related to missing cookies this can be reverted back to `None`.
-   Raise CCB event on Value Ticket scan error.
    -   Event name: `EVENT_CAPTURE`; Parameters: `{ usecaseName: 'SCAN_VT_ERROR', requestReferenceId: <id previously received> }`
-   [B-484179](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21898694) Added login welcome dialog for Google.
    -   To enable use `welcomeDialog` config in [DynaCon](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix?_filter=welcomeDialog&_filterExpanded.value=true&_matchAncestors=true).
    -   If `welcomeDialog` for multiple providers are enabled, the first one available (alphabetically) will be shown.
-   [B-478228](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21659916) Added `providerId` as a DOM element id for virtual keyboard component (e.g. `simple-keyboard--english`).
-   [B-483607](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21874498) Updated barcode scanner feature to lazy-load ([config](https://admin.dynacon.prod.env.works/services/198137/features/245375/keys/245434/valuematrix?_filter=barcode-scanner&_filterExpanded.value=true&_matchAncestors=true)).
-   [B-480455](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21748129) Change offer button class from `offer-button` to `offer-button-md`
    -   Added possibility to configure the button class based on status from [Sitecore item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={3FB27FB2-3061-4AB5-A214-5978EA0C22A7}&la=).
-   [B-463895](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21020645) Logout prompt for Remember Me on Native apps. New CCB `REMEMBER_ME_CLOSE` is sent to native when manually Logging on frontend so app can be closed based on this event.
    -   Sync your [vanilla-lazy-routes](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/vanilla-lazy.routes.ts#L44).

**FIXES**

-   [D-124487](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21780831) Display time left on Tasks only when grace days greater.
-   Add binding redirect for assembly System.Text.Encodings.Web to fix SiteScripts injection and log spamming.

### Vanilla 11.18.0

2021-11-26

**IMPORTANT**

-   Please migrate values from [DslBasedHeadTags](https://admin.dynacon.prod.env.works/services/198137/features/131900/keys/244827/valuematrix?_matchAncestors=true) config to [DslHeadTags](https://admin.dynacon.prod.env.works/services/198137/features/131900/keys/257065/valuematrix?_matchAncestors=true) config. `Values need to be migrated in order for HTML injection feature to work properly with this Vanilla version`.

**FEATURES**

-   [B-455314](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20636414) Replaced array based config [DslBasedHeadTags](https://admin.dynacon.prod.env.works/services/198137/features/131900/keys/244827/valuematrix?_matchAncestors=true) with object based config [DslHeadTags](https://admin.dynacon.prod.env.works/services/198137/features/131900/keys/257065/valuematrix?_matchAncestors=true). This change will allow merging values from different dynacon contexts. `Please migrate values from DslBasedHeadTags config to DslHeadTags config`.
-   [D-123508](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21545684) Added config [UseBrowserLanguage](https://admin.dynacon.prod.env.works/services/198137/features/124504/keys/294945/valuematrix?_matchAncestors=true) to enable browser language to be used as locale for Angular, instead of `AngularLocale` defined on Globalization config.
-   [B-477411](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21622381) `INC1000964` - Added logging in `LoginResponseHandlerService` service for easier login diagnostics. Dynacon [config](https://admin.dynacon.prod.env.works/services/198137/features/295336/keys/295338/valuematrix?_matchAncestors=true).
-   [B-439254](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20028186) Add `DateTime.Format(year, month, day)` to `DateTime` DSL provider. That can be used as sitecore placeholder to make sure dates are formatted to user/browser culture.
-   [B-462673](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20953364) Added custom header with back button and title to `PCTextWithHeaderBarComponent`. Custom header will be shown instead of header bar if Sitecore iteam has `custom-header-media-query` parameter with valid angular flex breakpoint (e.g. http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={5A2D6702-7017-4C3B-A8CB-5D280952AA6B}&la=).
-   [B-472881](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21434987) Mapped `ToolTip` property to title attribute on anchor in `MenuItemComponent`. Added `ToolTip` field to `MenuItem` and `PC Image` templates.
-   [B-466783](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21147862) Added configuration - [SelectedTabEnabled](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/295838/valuematrix?_matchAncestors=true), to toggle the usage of selected login tab based on `SelectedTab` cookie.
-   [B-467109](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21164081) Added barcode scanner error overlays - [Sitecore templates](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={38276489-3FC7-4CF2-AFAC-89826F88B9FF}&la=).
    -   CCB event type is mapped to `Messages -> type` field in the template.
-   [D-124089](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21677622) Added `warn` log for missing tracking values, e.g: `Missing tracking value for: {value}`.

**FIXES**

-   [B-478068](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21652988) Rework login providers logic to properly handle async operations/callbacks;
    -   Fallback to login with URI when login with SDK fails.
    -   Fixed customer hub onboarding content pointing to AccountMenu2 sitecore folder.
-   [D-124487](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21780831) Customer Hub - Show task description when days and hours left are zero.

### Vanilla 11.17.0

2021-11-16

**HIGHLIGHTS**

-   Updated to `Angular 12.2.13`.

**FEATURES**

-   Introduced `WorkflowNewService`. Deprecated `WorkflowService`, will be removed in vanilla version 12. Migrate as soon as possible. New service provides better API and guaruantes correct execution sequence.
-   [B-478074](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21653597) Account menu feature will take sitecore content from `AccountMenu{version}` sitecore folder, where {version} corresponds to configured value in dynacon (Excluding version 1 which takes it from AccountMenu folder).
-   [B-479133](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21696659) NL - Added showing of all limits on login and logout toasters.
-   NL - Session limit time in login/logout toast is shown as decimal hours (e.g. 1.5 hours).
-   [B-469256](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21259697) Integrate Facebook SDK for authentication.
-   [B-467244](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21170281&RoomContext=TeamRoom%3A11990726) Integrate Apple SDK for authentication.
-   [B-467246](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21170332) Integrate Google SDK for authentication.
    -   To enable authentication using SDK, toggle [sdkLogin](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix?_matchAncestors=true) config for the given provider in DynaCon.
-   [B-465591](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21092376) Made `User.DaysRegistered` DSL client side.
-   [B-459136](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20800407) Raise CCB event on Value Ticket scan.
    -   Event name: `EVENT_CAPTURE`; Parameters: `{ usecaseName: 'SCAN_VT_COMPLETE', requestReferenceId: <id previously received> }`
-   [B-471164](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21344385) Html injection validation and logging. [ForbiddenCharsExpression](https://admin.dynacon.prod.env.works/services/198137/features/131900/keys/292479/valuematrix?_matchAncestors=true) can be configured and matching items will be skipped and logged to Kibana.
-   Update count of inbox messages when inbox is opened and RTMS is used.
-   [B-480030](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21732561) Exposed `MaxLimitExceededBalance` property from Balance and added to the DSL.

**FIXES**

-   [D-122866](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21399154) StackOverflow - There is no HttpContext.Current but calling code requires it.
-   [D-123848](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21636244) CH - Fixed multiple tracking of menu drawer.
-   [D-118310](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20411513) `INC842098` - Fixed show stored queue message when login page is loaded.
-   [D-124070](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21673954) Added tracking for successful login with provider.
-   [D-123338](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21512141) Fixed double tracking when clicked on `vn-menu-item`.
-   [D-124045](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21667053) Reset navigation menu item selection on Quick Deposit overlay close.
-   Betstation: Fix Deposit limit exceeded popup showing only once.
-   [D-123940](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21653089) Fixed auto-logout delay on session completion.
-   [B-465963](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21687584) Removed `StoreDevtoolsModule`.
-   [D-124305](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21729768) Fixed session limits post-login overlay.

### Vanilla 11.16.0

2021-11-02

**FEATURES**

-   [B-467545](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21185626) Adjust social login tracking values.
-   [B-469972](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21298724) Add tracking for balance breakdown items.
-   [B-470960](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21338273) Added possibility to enable Facebook login provider with a cookie entry - `ShowFBLoginReg: 1`. If the cookie is missing, existing [DynaCon configuration](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix?_matchAncestors=true) will be used.
-   [B-472255](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21405136) Lazy-load ValueTicket client config. Use [this DynaCon config](https://admin.dynacon.prod.env.works/services/198137/features/245375/keys/245434/valuematrix?_matchAncestors=true) to toggle the feature.
-   [B-440721](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20092520) Added [Single-Sign-On Integration Type configuration](https://admin.dynacon.prod.env.works/services/198200/features/111635/keys/290722/valuematrix?_matchAncestors=true) which enables storing of `x-sso` cookie with the value of user's sso token instead using `sessionKey` query parameter. Security incident details INC773171.
-   [B-465963](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21106161) Added session limits overlay notification with remaining time.
-   [B-434805](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19834294) Added DSL `SelfExclusion.StartDate` and `SelfExclusion.EndDate`. Added [SelfExclusion sitecore header message](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={51A95FF4-45CB-4130-A466-7C94F2CB3FB1}&la=).
-   [B-463541](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21000914) Login with mobile number: Duplicate number validation.
-   [B-467474](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21182497) Added logout session stats toast ([sitecore item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={95D9CC1C-01EB-4E8F-A8F6-563EC8507574}&la=), [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/201115/keys/280574/valuematrix?_matchAncestors=true)).
    -   Added sticky top message with user balance [sitecore item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={7B4D1DD2-206D-4D06-9339-6BD3BA27FCF8}&la=).

**FIXES**

-   Added close button to inbox notification banner.
-   [D-123116](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21448157) Fix broken page load when login duration slot not defined.
-   [D-123275](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21499946) Fix logout not happening when pre logout api call fails.
-   [B-472255](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21405136) Enabled [ValueTicket DynaCon feature toggle](https://admin.dynacon.prod.env.works/services/198137/features/245071/keys/245073/valuematrix?_matchAncestors=true).
-   [D-123514](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21547840) Dynacon provider `country` is not working when used in Globalization feature (example: AllowedCultures).
-   Fixed error while fetching login duration client config if user is not authenticated.
-   [B-472255](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21405136) Disable login with provider button after click to prevent spamming.
-   PLAY_BREAK event is now sent from EventsService on getting api response, without filtering on Vanilla, to be filtered on consumer side.
-   Fix `Offer.IsOffered` DSL executing for unauthenticated users and spamming logs.
-   [D-123182](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21470212) Added middleware for filtering suspicious query string parameters.
    -   Query string regex rules can be configured in [dynacon](https://admin.dynacon.prod.env.works/services/198137/features/290738/keys/290752/valuematrix?_matchAncestors=true).
    -   If query string value is suspicious all existing query strings are stripped and diagnostic query string parameter `dsr=1` is added. Also `X-Vanilla-Suspicious-Request` response header will be added.
-   `session-fund-summary` moved to a lazy module that can be enabled/disabled on dynacon.
-   [B-473570](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21458385) NL - Added `Error code` redirect support for user's workflow scenarios.
-   NL - Fixed session limit text in login/logout toast.

### Vanilla 11.15.0

2021-10-20

**FEATURES**

-   Nuget packages `Bwin.Vanilla.Mvc` and `Bwin.Vanilla.PluginHost` now support `.net48` framework. Updated some dependencies.
-   [B-470406](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21316117) Introduced [VanillaFramework.Features.LoginIntegration](https://admin.dynacon.prod.env.works/services/198137/features/288792). Added support for `NinjaCasinoSe` login integration. `IMPORTANT` - re-test `DanskeSpil` login integration.
-   [B-469200](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21258485) Value Ticket overlays can now be configured in Sitecore - [items](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={4C9C61F5-2940-4B3D-8458-46B6580F9310}&la=).
-   [B-465211](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21074801) NL- Display Session Fund Summary data on account menu.
-   [B-473570](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21458385) NL - Added support for `RedirectUrl` in [ErrorCodeHandlers](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/133335/valuematrix?_matchAncestors=true).
-   [B-449287](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20426384) Improved Recaptcha Enterprise actions to have unique identifations per domain. New action format examples: `Login_bwincom`, `pageLoad_partypokercom`.
-   [B-460224](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20847429) HCC - Added help button in footer. Content [here](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={5DFD6EDE-B695-4C58-A3ED-597D8D1112FB}&la=). Config [here](https://admin.dynacon.prod.env.works/services/198137/features/122030/keys/288711/valuematrix?_matchAncestors=true).

**FIXES**

-   [D-122320](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21283933) Fixed DanskeSpil logout issue.
-   [D-122800](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21387884) Fixed tasks loaded events are tracked multiple times.
-   [D-122827](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21393336) Fixed urgent tasks tracked as non urgent.
-   [D-121899](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21182163) Fix profile page not loading intermitently.
-   Fix error logged in console while receiving BALANCE_UPDATE event.

### Vanilla 11.14.0

2021-10-14

**FEATURES**

-   [B-458113](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3a20758113) one-party.NL: Added header and footer changes
    -   Added `login start time component` to be shown in header. It can be enabled by cloning [sitecore item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={586FEF71-A96D-49BC-9E1B-D53CEF994713}&la=).
    -   `Clock component` can be added dynamically in slot using [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/287593/keys/287596/valuematrix?_matchAncestors=true).
    -   `Login duration component` can be added dynamically in slot using [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/201067/keys/287873/valuematrix?_matchAncestors=true).
    -   Added new slot `footer_items_inline` to footer.
-   [B-467668](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21191608) INC914538 Added posibility to disable sending of CCB events. Config [here](https://admin.dynacon.prod.env.works/services/198137/features/122791/keys/288693/valuematrix?_matchAncestors=true).
-   [B-472659](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3a21423436) Added ability to pass extra options of type `LoginResponseOptions` with `workflowService` to underlying post login CCB event.

**FIXES**

-   Betstation - Wait for RTMS connection to close before connection again.
-   [D-122576](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21354070) Login links container (`div.login-bottom-links`) is now removed if no content.
-   Fix OverlayRefs not being updated on language switcher close via X button.
-   [D-122820](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21390007) Fix account menu onboarding init based on menu client config updated.
-   [D-122961](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21419037) Fix dropdown menu not closing when item selected.

-   Fix OverlayRefs not being updated on language switcher close via X button.

### Vanilla 11.13.0 [*DO NOT USE - RTMS CONNECTION WILL NOT WORK AFTER LOGIN*]

2021-10-08

**IMPORTANT**

-   Updated `rtms/client` npm package to version `1.0.7`. Please update on product.

**FEATURES**

-   [B-458113](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3a20758113) Added login limits toaster ([sitecore item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={F3CB8A84-BCF8-4EA8-9FFF-1F4466B413F9}&la=), [dynacon config](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/287777/valuematrix?_matchAncestors=true)).
    Added logout limits toaster ([sitecore item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={B533029C-20A6-47F1-A0DB-887D9AD8E369}&la=), [dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/201115/keys/280574/valuematrix?_matchAncestors=true)).
-   [B-449814](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20447777) Fixed `vn-h-product-navigation` blinks on location change. `DslPipe` will execute only when new result of the content evaluation is different than the previous result.
-   [B-468922](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21246587) Added `UserScrub.IsScrubbedFor('product_name')` server and client DSL provider. Uses following [POSAPI endpoint](http://qa2.api.bwin.com/v3/#crm-scrubbed-player-information) where POSAPI request details can be configured [here](https://admin.dynacon.prod.env.works/services/198137/features/286943/keys/286948/valuematrix?_matchAncestors=true).
-   [B-450621](https://www52.v1host.com/Entain/story.mvc/summary?oidToken=Story%3A20476780) one-party.NL: Additional header changes. Added support for vn-menu-item to add css class to img tag from item parameter `image-class`.
-   [B-471630](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21371056) Enabled additional option parameters for PC Video component - `autoplay`; `loop`; `muted`; `preload`; `poster`.
-   [B-354130](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:16703640) `INC868053` Added posiblity to configure HTTP response headers and values based on DSL conditions. [Dynacon](https://admin.dynacon.prod.env.works/services/198137/features/287228/keys/287230/valuematrix?_matchAncestors=true).

**FIXES**

-   [D-122184](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21260731) ARC - Fixed tracking of play break overlay.
-   [D-122031](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3a21221434) Added [NavigationLayoutScrollService](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/master/Bwin.Vanilla.PluginHost/Client/vanilla/features/navigation-layout/src/navigation-layout�scroll.service.ts) which expose `scrollEvents` observable:
    -   _example:_ `this.navigationLayoutScrollService.scrollEvents.subscribe((event: NavigationScrollEvent) => { ... })`
    -   added `scrolledToBottomPadding` input in [NavigationLayoutComponent](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/master/Bwin.Vanilla.PluginHost/Client/vanilla/features/navigation-layout/src/navigation-layout.component.ts#L21) and [NavigationLayoutPageComponent](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/master/Bwin.Vanilla.PluginHost/Client/vanilla/features/navigation-layout/src/navigation-layout-page.component.ts#L90) to control when the scroll is considered at bottom.
    -   fixed lazy-loading on scroll for `MonthlyViewComponent`
-   [D-122171] ARC- Fix more info and contact links for play break set / not set with based on flag `playBreakInGC` received from RTMS events.
-   [D-122346] Betstation - Close RTMS connection before reconnect on new Login.
-   [D-122004](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21216771) [Qa2][galabingo.com][Long session breaks] - fix buttons being invisible on galabingo theme
-   [D-122674](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21370776) Do not show login provider buttons in connect card login dialog.
-   Fix calling Offers api for unauthenticated users while evaluating `Offer.IsOffered` DSL.

### Vanilla 11.12.0

2021-10-01

-   Updated `rtms/client` npm package to version `1.0.6`.

**FEATURES**

-   [B-449278](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20426190) one-party.NL: Improved `Single Sign On logic` to cover more redirect scenarios.
-   [B-450621](https://www52.v1host.com/Entain/story.mvc/summary?oidToken=Story%3A20476780) one-party.NL: Additional header changes. Make sure that children of this [item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={5C28BF96-08B4-453A-99E7-C54C981F4DEA}&la=) are of type `MenuItem`, and that this [item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={0C74DAAB-05DD-4CCF-841A-48C566EBB284}&la=) is cloned.

**FIXES**

-   [D-122171] ARC- Fix more info and contact links for play break set / not set.
-   [D-122357](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21290957) ARC - Fix play break after X mins toaster value.
-   [D-122321](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21284071) Betstation - Fixed showing of limit exceeded dialog.
-   [D-122202](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21262173) ARC - Fix toaster not showing on Contact Us button click on confirmation popup

### Vanilla 11.11.0

2021-09-30

**FEATURES**

-   [B-469772](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21288304) Added feature to logout user when rtms event `AUTO_LOGOUT_EVENT` is received.
-   [B-461191](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3a20893024) Added `danske spil login success page` logic to deal with situation when page is not opened inside of an iframe.
-   [B-441131](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20116612) Added inbox notification banner for native apps.
-   [B-463492](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20998411) Decouple connect card divider text, so it can be removed if text is missing _([Sitecore -> ConnectCardDividerText](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={F2B88473-0373-4B8B-A3CF-F2D439C796FF}&la=))_.
-   [B-466571](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21136792) Added support to omit 'portal-center-wrapper' class for Account Menu version 2. Use `<lh-navigation-layout-page contentContainerClassV2="foobar"` to override default value `portal-center-wrapper`.
-   [D-117615](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20295757) Updated `lastKnownProduct` cookie to expire in 30 days.
-   [B-463463](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20997466) Smart banner ui improvement - added btn utility classes.
-   [D-122321](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21284071) Betstation - Added limit exceeded dialog.
-   [D-122325](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21285350) Long session Breaks/Play breaks - Font sizes fix

**FIXES**

-   [D-121280](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21019791) Customer Hub - Fixed pulse blinking is not stopping for fresh user, even after clicking on dismiss or show more in pop up.
-   [D-121999](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21216364) Customer Hub - Area around My Hub button on menu should not be clickable. Added support to pass `menu-item-additional-class` from item's parameters.
-   [D-122048](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21224793) Customer Hub - Show currency on both values on loss limit widget.
-   [D-121899](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21182163) Customer Hub - Fixed profile page loading issue.
-   Fixed double tracking on `vn-menu-item`.
-   [D-121959](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21200843) Customer Hub - Fixed click on `Home` button in header redirects user to last know product.
-   [D-117743](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20319701) Customer Hub - Prevent collapsing of profile page tasks when opening account menu overlay.
-   [D-122104](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21236263) Betstation - Fix language switcher blank dialog.
-   [B-427444](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19491960) Betstation - Fixed event subscription for deposit limit.
-   [D-122155](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21253931) Betstation - Fixed Value Ticket error handling when a printed ticket is rejected.
-   [D-121052](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20967791) Betstation - Fixed redirection after grid user login.
-   [D-122184](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21260731) Added tracking for email and phone number on hard interceptor.
-   Betstation - Force RTMS reconnect on UserLoginEvent.
-   [D-122171](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21258179) ARC - More info link for break set and Contact link for break not set.
-   [D-122191](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21261533) Customer Hub - Fixed when task section has only one task then click will open that task.
-   [D-122104](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21236263) Added lazy feature `flags`. (Language pop up is not as expected).

### Vanilla 11.10.0

2021-09-24

**FEATURES**

-   [B-461191](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3a20893024) Added login changes related to `DanskeSpil` login integration. Introduced [StandaloneLoginUrl](https://admin.dynacon.prod.env.works/services/198137/features/200978/keys/284484/valuematrix?_matchAncestors=true#284485) and [Version](https://admin.dynacon.prod.env.works/services/198137/features/200978/keys/284482/valuematrix?_matchAncestors=true).
-   [B-427444](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19491960) Added deposit limit overlay for BetStation:
    -   [Sitecore template](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={4D328DD1-7771-43F4-AEC7-01874C0500EB}&la=) - _if the template is missing, the feature is disabled_.

**FIXES**

-   [D-121814](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21159714) [D-121899](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21182163) Customer Hub - Refresh account menu based on user's jurisdiction fixes.
-   [D-122048](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21224793) Customer Hub -Content changes on loss limit widget.
-   [B-468347](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21217469) Customer Hub -Onboarding Tooltip button styling.
-   [D-121629](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21125512) ARC - Fix different timer countdown in duplicated tabs.
-   [D-121813](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21157946) ARC - Fix duplicated break start popups.
-   [D-121313](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21029266) ARC - Revert previous timer calculation as was causing different timer on duplicated pages.
-   [D-121915](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21186266) ARC - Fix timer not displaying or disappearing after new play break RTMS event comes in.
-   [D-121812](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21157896) ARC - UI of Take a play break and Not Now Buttons are not as per zeplin.
-   [D-121912](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21186036) ARC - Ui of Contact us and Ok on confirmation screen is not appropriate.
-   [D-122004](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21216771) ARC - Cancel and Contact Us in soft interceptor should be links
-   [D-121559](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3a21111259) ARC - Config for [Break Duration](https://admin.dynacon.prod.env.works/services/198137/features/266641/keys/284252/valuematrix?_matchAncestors=true) options and [Break Start](https://admin.dynacon.prod.env.works/services/198137/features/266641/keys/284254/valuematrix?_matchAncestors=true) options.
-   Disabled `smart banner` if [AppId config](https://admin.dynacon.prod.env.works/services/198137/features/127967/keys/127971/valuematrix?_matchAncestors=true) is not set.

### Vanilla 11.9.0

2021-09-20

**FEATURES**

-   [B-460792](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20874428) Updated following client configs to lazy infrastructure:
    -   `vnFlags` (`FlagsService` properties and methods changed to observable)
    -   `vnBackground`
    -   `vnCookieConsent`
-   [B-458729](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20783139) Extended custom overlay template to support header logo and transparent header.
-   [B-463991](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21027091) Refreshed `kyc status` on rtms event `KYC_REFRESH_TRIGGER_EVENT`.
-   [B-456998](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20703866) Betstation - On language change, the idle mode should kick in without previous interaction with the page.
-   ARC - Hard interceptor to be shown on `PLAY_BREAK_GRACE_PERIOD_EVENT` when user did not opted in for break. `isPlayBreakOpted: 'N'`.
-   [B-465916](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21103882) Exposed PCVideo (`<vn-pc-video [item]="..."></vn-pc-video>`) component.
-   Replaced `initLogin` menu action with DynaCon configuration: [UseProviderProfile](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/283204/valuematrix).
-   ARC - Added sending of `PLAY_BREAK` event using `EventsService` with play break data. You can use it when you need info if user i.e. has active play break.

**FIXES**

-   [D-121640](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21126777) ARC - Content displaying on confirmation screen popup is not appropriate when user selects play break time and Right Now (use this item for Contact Us content `App-v1.0/PlayerBreak/BreakStarted Messages:actionsMessage`).
-   [D-121617](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21123522) ARC - Toaster message is still displaying when user white listed the player on next login.
-   [D-121424](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21071731) ARC - Fix wrong confirmation for user with break already set.
-   [D-121520](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21102980) ARC - Fix content for user with break already set.
-   [D-121537](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21105040) ARC - Fix negative timer on page refresh.
-   [D-121152](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20987129) ARC - Fix break timer not showing on navigation / showing wrong value.
-   [D-121660](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21130689) ARC - Fixed tracking for toastr, confirmation overlay and header component.
-   [D-121665](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21131016) ARC - Fixed tracking for break confirmation drawer overlay.
-   [D-121313](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21029266) ARC - Fixed calculation of play break countdown for the header timer.
-   [D-120874](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20907555) CH tracking - Fixed tracking.
-   [D-121814](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21159714) CH - Not getting the CH menu when player logged in from casino product.
-   [D-121234](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21009656) CH onboarding - Added new cookie when onboarding is completed. Update onboarding task sitecore item with this condition: `... AND Cookies.Get('vn-otc') != '1'` in order not to show onboarding task to customers that completed onboarding.
-   [D-120883](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20909585) CH - Fixed tracked open event when account menu is opened using route.
-   [D-120194](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20741969) CH - Fixed swipe responsiveness for iOS in account menu drawer.

### Vanilla 11.8.0

2021-09-10

**HIGHLIGHTS**

-   [B-460792](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20874428) Added the infrastructure to lazy load client configs. Following client configs are using it already: `vnFooter`. As a result of this, there is a BREAKING change: If you use `ResponsiveFooterContent` then you need to subscribe to whenReady before using it, like [here](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/master/Bwin.Vanilla.PluginHost/Client/vanilla/features/responsive-footer/footer-bootstrap.service.ts#L24).

**FEATURES**

-   [D-119411](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20598101) Replaced DSL `AssociatedAccounts.Count` with `ConnectedAccounts.Count` to avoid confusion. (My other accounts CTA is not displayed under the name of the account).
-   [B-464430](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A21045722) Added support for `jurisdiction` dynacon variation context.
-   [B-349106](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A16519236) Added `inbox health` to `/health/report` page.
-   [D-121279](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A21019491) Added ability for `vn-popper-content` to render `buttons` section before close button within same parent. There is simple breaking change here, instead i.e. `<vn-popper-content #popper>{{ uploadDocumentTooltip }}</vn-popper-content>` use this: `<vn-popper-content #popper><ng-container content>{{ uploadDocumentTooltip }}</ng-container></vn-popper-content>`
-   [B-427603](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19499108) Added tracking for show/hide more login providers.
-   [B-457704](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20738941) Added passive screen time feature. [Dynacon](https://admin.dynacon.prod.env.works/services/198137/features/273208).
-   [B-450252](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20462341) Exposed active overlays references (e.g. `this.overlayFactory.overlayRefsSubject.subscribe((overlayRefs: Map<string, OverlayRef>) => { ... });` / [code](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/dialog/dialog-test.component.ts#L18))
    -   _BREAKING CHANGE_: `OverlayFactory` is moved from `@frontend/vanilla/features/overlay` to `@frontend/vanilla/shared/overlay-factory`.

**FIXES**

-   [D-121135](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20984027) ARC- Fix missing toaster on Playbreak start.
-   Fix ARC grace period toaster not showing.
-   [D-121320](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21031930) Refresh `User` and `Claims` client config on logout when `redirectAfterLogout` option is set to false.
-   [D-121130](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20982915) ARC - Fix UI for desktop popups.
-   [D-120839](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20897797) ARC - Fix live chat and close CTA order on hard interceptor.
-   [D-121132](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20983252) ARC - Fix confirmation popup not showing for soft interceptor after chosing to take a break after X minutes.
-   [D-121313](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:21029266) ARC - Fix header timer countdown not showing.

### Vanilla 11.7.0

2021-09-03

**FEATURES**

-   [B-461222](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20894493) Added display of elapsed time and session statistics in logout toastr message. Config [here](https://admin.dynacon.prod.env.works/services/198137/features/201115/keys/280574/valuematrix?_matchAncestors=true). Sitecore [item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo=%7B8878B8AC-7DEC-41BA-BEE0-7164353C1974%7D&la=).
-   [B-457908](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20748428) Customer Hub - tile action will be triggered with click on tile and not just on arrow.
-   [B-457123](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20709229) Added currency-specific `display format`. Config [here](https://admin.dynacon.prod.env.works/services/198137/features/198454/keys/280402/valuematrix?_matchAncestors=true).
-   [B-461747](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20917918) Germany 1 hour wait on Winnings. Exposed 3 new balance properties and added to the DSL (`SportsRestrictedBalance`, `PokerRestrictedBalance`, `SlotsRestrictedBalance`).
-   [B-463254](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20985197) Changed implementation of footer clock. Footer clock now shows time in browser (machine) timezone and not in the timezone set by the user in site settings.
-   [B-456437](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20680666) Extended [DateTime.UtcDateTime DSL](<https://testweb.vanilla.intranet/health/dsl#DateTime.UtcDateTime(dateString:_String,_exactFormat:_String)>) to support string input, allowing to compare dates: e.g.: `DateTime.UtcDateTime(User.RegistrationDate, "yyyy-MM-dd HH:mm:ss") > DateTime.UtcDateTime("2002-10-11 13:50:48", "")`.
-   [B-431539](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19699694) Session expired tracking.
-   Enriched log message for Content parsing of date and amount fields.
-   [B-463492](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20998411) Added expand/collapse section for login provider buttons ([Sitecore template](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={02698202-8BAC-42AF-B9CD-DD105D07C167}&la=)); Changed login provider button icons when connected.
-   [B-427603](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19499108) Added tracking for login with Facebook provider welcome screen.

**FIXES**

-   [B-431539](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19699694) Session expired tracking.
-   [D-120709](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20866008) Fix LOGOUT CCB not sent on logout method.

### Vanilla 11.6.0

2021-08-31

**IMPORTANT**

-   [B-440701](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20091829) Added prevention of certain CORS vulnerabilities. Previously CORS origin was considered safe if its host ends with `.{current_label}`. This had implications that our policy would trust subdomains like `foobar.sportingbet.com`. From now on, allowed hosts are configured in [dynacon](https://admin.dynacon.prod.env.works/services/198137/features/159080/keys/279976/valuematrix?_matchAncestors=true). Please **go through this config and ensure your vanilla applications are configured**.

**FEATURES**

-   [B-458638](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20779646) PcMenu can now have two boolean parameters `active-scroll-horizontal` and `active-scroll-vertical`. This will auto scroll to active menu item when inside of scrollable container.
-   [B-427566](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19497646) Added welcome dialog for users that are connected to Facebook login provider.
    -   New Sitecore template: [WelcomeCancelButton](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={5F17CC7B-B19B-4FF1-8E35-AB52CE619F1A}&la=)
    -   New DynaCon configuration: [welcomeDialog](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix?_filter=welcomeDialog&_filterExpanded.value=true)

**FIXES**

-   [D-120978](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20950162) Fixed account menu tasks refresh issue.
-   [D-120560](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20834830) Fixed header account menu onboarding tooltip positioning (in combination with theme changes).
-   Remove RTMS reconnect on Logout as now handled internally by the package.
-   [D-120985](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20951156) Fix Customer hub onboarding tracking.
-   [D-121152](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20987129) Fix remaining break time not showing when navigating to another page and coming back.
-   Fix Toaster close button class.

### Vanilla 11.5.2

2021-09-10

**FEATURES**

-   [B-465213](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:21074918&RoomContext=TeamRoom:11990726) Added tracking for play/pause events of PCVideo component.

**FIXES**

-   [B-457933](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20749362) Fixed PCVideo stream not working when poster is enabled.

### Vanilla 11.5.1

2021-08-24

**FIXES**

-   [D-120560](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20834830) Fixed header account menu onboarding tooltip positioning (in combination with theme changes).

### Vanilla 11.5.0

2021-08-23

**IMPORTANT**

-   update `rtms/client` npm package to version `1.0.5`.

**FEATURES**

-   [B-449278](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20426190) Added Single Sign On for assiciated domains. Config [here](https://admin.dynacon.prod.env.works/services/198137/features/122748/keys/279130/valuematrix?_matchAncestors=true).
-   [B-449278](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20426190) Added support for autologin with sso token value in request header `x-sso`.
-   [B-458463](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20772326) Added support for execution of RTMS notifications in multi-tabs.
    -   [DynaCon](https://admin.dynacon.prod.env.works/services/198137/features/122353/keys/279072/valuematrix?_matchAncestors=true) - List of the RTMS notification types that will be executed on client side even when the document(tab) is not visible(focused).
    -   **IMPORTANT** please update `rtms/client` npm package to version `1.0.5`.

**FIXES**

-   [D-120269](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20759930) Fix PCScrollMenu navigation issues.
-   Fixed Betstation login error dialog markup.
-   [D-120322](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20771053) Fix playbreak overlay action.

### Vanilla 11.4.0

2021-08-13

**UPDATES**

-   Updated to `angular 12.2.1`.

**FEATURES**

-   [B-449109](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20420279) Added client side DSL `CurfewStatus.IsDepositCurfewOn` which works with [this POSAPI endpoint](http://qa2.api.bwin.com/V3/#wallet-get-deposit-curfew-status-get).
-   [B-449309](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3a20427034) Added support for additional loading indicator (spinner) content configurable from dynacon [here](https://admin.dynacon.prod.env.works/services/198137/features/123537/keys/276047/valuematrix?_matchAncestors=true).
-   Extended `logout` menu action so it can use sitecore param `redirect-after-logout` to override default redirectAfterLogout value.
-   [B-454490](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20605505) Added single account toast for US labels that should be shown after the login, when session in previous state is terminated. Toast [content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={F4906D40-A6B0-4934-99F3-AD21AC8404AC}&la=) should be cloned to the labels where this features will be used.
-   [B-449255](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20425497) Customer Hub - Onboarding tracking.
-   [B-433546](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19782611) Customer Hub - Added tasks tracking.

**FIXES**

-   [B-457933](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20749362) Changed PC Video component to use video stream ID as a source.
-   [D-118981](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20522121) Fix resetting drawer on account name click.
-   [B-457933](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20749362) Fixed showing of session limits overlay on post-login interceptor redirects.
-   Fixed filter for showing onboarding hot spot in header.
-   [D-120184](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20739126) [Qa2][Gala Bingo][Customer Hub] - SOF pending tasks is not changing to urgent even though grace days is less than 14 days
-   [D-120185](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20739182) Added `SofStatusDetais` DSL provider that can be used to set up sof details task in Customer Hub.
    -   Rewrite tasks to use `dsl-countdown-field` parameter from Sitcore item for calculating days left instead of the `countdown-field` parameter. [Task Example](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={18276B1B-FDB4-423E-9CEE-E6600AEF1226}&la=).
-   INC908508 Fixed don't append `X-From-Product` header for external requests.
-   [B-458943](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20793508) changed 2 css classes, theme-check to theme-success-i, toast-close-button to theme-ex
-   [B-459711](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20824580) inbox checkbox change, removed 2 checkbox classes and added 3 new classes

### Vanilla 11.3.0

2021-08-02

**FEATURES**

-   [B-437255](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19939381) Customer Hub - Profit and loss widget - Added tracking for profit and loss tile.
-   [B-433547](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19782634) Customer Hub - Tracking Mobile behavior.
-   [B-433548](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19782657) Customer Hub - Tracking Desktop behavior.

**FIXES**

-   Fixed an issue `vnPrerenderIsReady config failed to load.`.
-   Fixed Arc PlayBreakStatus endpoint.
-   [D-119923](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20678266) Fix Greece session limits overlay not closing on UpdateLimits CTA click.
-   [D-119979](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20691905) Fix Kyc DSL error when AdditionalKycInfo comes null in API response.

### Vanilla 11.2.0

2021-07-29

**FEATURES**

-   [B-454347](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20600273) Added `SportsTaxCollected` field to the German Tax - 30 days transaction summary. [Content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={2FBAF5A7-FA30-4FE6-BA0A-A5644539927F}&la=).

**FIXES**

-   [D-119297](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20581990) Fix previously account menu selected item highlighted when navigating back in router mode.
-   [D-118523](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20445962) Fixed customer hub - added skeleton for widgets.
-   [D-118923](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20515370) Fixed styling issue on balance breakdown by adding `navigation-layout-page-card` class.
-   [D-119126](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20547498) Fixed expand position of the customer hub drawer when content is scrolled.
-   [D-118949](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20518359) Adjusted customer hub drawer swipe detection threshold.
-   Fixed previously account menu selected item highlighted in desktop mode.
-   Enable session limits overlay for play money users.
-   [D-118566](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20454035) Show facebook login button text only after response from facebook sdk is received.
-   [B-447316](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20357867) Fixed `User` variation context property where `anonymous` user would be considered as `logged-in`.
-   [D-119822](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20656210) Fixed execute recaptcha on different areas.
-   [B-455171](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20630997) Fixed login handler logic where `willPossiblyRedirect` field is `true` when no redirects.
-   [D-119953](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20687864) Fixed reload activity popup config on user login.
-   [D-116170](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19955655) Fixed error message displayed on login page is persisting on account recovery. Use new MessageQueueClearOptions `clearStoredMessages` on pages that face this issue.
-   [D-118756](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20490926) Added markup ids in order to make scrollIntoView easier on navigation layout.
-   Fix ARC Playbreak endpoint.
-   Fixed use event `capture` in idle service.

### Vanilla 11.1.2

2021-07-27

-   [B-455171](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20630997) Fixed login handler logic where `willPossiblyRedirect` field is `true` when no redirects.
-   [B-455171](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20630997) Enable session limits overlay for play money users.

### Vanilla 11.1.1

2021-07-27

-   [D-119822](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20656210) Fixed execute recaptcha on different areas.

### Vanilla 11.1.0

2021-07-20

**IMPORTANT**

-   ARC: `mohRiskBand` and `mohPrimaryReason` values can be fetched with `Claims.Get` DSL.
    -   for `mohRiskBand` claim name is http://api.bwin.com/v3/user/arcRiskBandLevel
    -   for `mohPrimaryReason` claims name is http://api.bwin.com/v3/user/arcPrimaryReason

**FEATURES**

-   Updated to `angular 12.1.0`
-   Use `VanillaLibModule` from `@frontend/vanilla` only in your `AppModule`. For all other submodules (or lazy modules) replace import of `VanillaLibModule` with `VanillaCoreModule` from `@frontend/vanilla/core`.
-   [B-446148](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20313586) Added implementation of additional POSAPI query parameters. Config [here](https://admin.dynacon.prod.env.works/services/198137/features/123694/keys/269237/valuematrix?_matchAncestors=true).
-   [B-446167](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20314668) Added ARC: RTMS event triggering Toaster on Vanilla pages.
-   [B-451710](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20513933) Added ARC: Player break header timer ribbon.
-   [B-441474](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20136442) Added Arc soft interceptor (break already set) feature.
-   [B-449088] (https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20419670) Added Arc Soft interceptor overlay and configs.
-   [B-425865](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19417006) Added terminal balance transfer dialog.
-   [B-447316](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20357867) Added `User` variation context property. It supports following values:
    -   `logged-in` - user is logged in
    -   `workflow` - user is in workflow
    -   `anonymous` - user is anonymous (betstation scenario)
    -   `known` - user is known and was already visiting our site
    -   `unknown` - none of the above
-   [B-447316](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20357867) Added `User.IsAnonymous` DSL provider property. Indicates whether the current user is anonymous (i.e. betstation user).
-   [B-441368](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20130296) Added `AssociatedAccounts` dsl provider.
-   [B-446166](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20314655) Extended `MohDetails` DSL provider with new properties.
    -   Moh details are fetched from `MOHDetails` PPOS and not from `/Arc/PlayerData`.
-   [B-441476](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20136557) Arc play break dsl provider.
-   Betstation login - NFC Grid/Connect card implementation.
-   [B-436397](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19908717) Added activity popup for betstation. Dynacon [config](https://admin.dynacon.prod.env.works/services/198137/features/267977). Sitecore [item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={5D6A7CC0-C042-42CD-8B93-05FEDF465C37}&la=).
-   [B-441475](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20136501) Arc hard interceptor.
-   [B-448884](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20412237) Added `header-hidden` css class to html node when header is hidden.
-   [B-449033](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20417759) `queryParamsHandling` added to `GoToOptions` of NavigationService in order to `preserve` or `merge` previous query string in the new url.
-   [B-448503](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20393671) Added dynacon DSL condition to header bar config that can be used to toggle back button visibilty if consumers are not providing it. [Config](https://admin.dynacon.prod.env.works/services/198137/features/123531/keys/269519/valuematrix?_matchAncestors=true)
-   [B-446990](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20345619) [DE Multi Account Improvements] Display My other accounts CTA
-   [B-448507](https://www52.v1host.com/Entain/story.mvc/summary?oidToken=Story%3A20394060) New page matrix component `PCScrollMenu` to handle ARC animation on page requirement.
-   [B-449248](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20425164) Customer hub onboarding hotspots.
-   [B-449252](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20425392) Customer hub onboarding tour. Start onboarding tour screen [content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={64305FD2-5493-43B6-8C31-DD05A172DEF9}&la=). Onboarding tour slides [content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={9A7BA8D2-B633-4DCB-90C6-B7084C288E8C}&la=).
-   [B-452020](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20524832) Turn off `runtimeChecks` for the root store module.
-   [D-118826](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20502388) Expose `Custom3` and `Custom4` fields in the KYC status DSL.

**FIXES**

-   [D-118355](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20420303) Fixed bug related to not being able inject after-init scripts with src.
-   [D-118498](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20443015) Fixed the cors header so it won't add an extra / to the value.
-   Fixed the ARC duration and break start drawers (part of B-451755)
-   Refresh kyc status whenever KYC_VERIFIED_EVENT rtms event is triggeded.
-   [D-117660](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20308735) Improved login with facebook button status change.
-   [D-118566](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20454035) Show facebook login button after response from facebook sdk is received.
-   [D-117672](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20309876) Customer hub drawer initial position in middle. Added position saving.
-   [D-118183](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20400569) Fixed updating of active menu item when navigating to Help/Contact pages.
-   [D-117669](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20309734); [D-117743](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20319701) Added state preservation of the customer hub drawer.
-   [D-118165](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20398569) Remove message panel from Vanilla side on Navigation layout (all versions).
-   [D-118287](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20409641) Fix balance break down page stretched and is not expected when compared with v2 menu (portal-center-wrapper)
-   [D-117584](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20285162) Add hand Icon when user mouse hover on My Balance in Hub Page
-   [D-118004](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20366149) Size of the real time toaster is appearing big.
-   [D-118583](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20457352) Fixed click on My balance section redirects to balance breakdown.
-   Fix Touch/Face ID tracking.
-   [D-117926](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20350933) Fixed show default description when countdown-field value is less then 0.
-   [D-118660](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20470285) Fixed styling on cashback tile.
-   [D-118832](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20504087) Fixed don't use cache when fetching date for tiles.
-   [D-118804](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20470285) Fixed Single Session Limit 80% Notice pop up should to show current limits as 24 hours.
-   Recaptcha enterprise guard to avoid duplicate script tag.
-   [D-118483](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20441401) Fixed show error text on profit loss tile when API call fails.
-   [D-118948](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20518245) Fixed close menu after clicking on neutral drawer icon.
-   [D-118832](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20504087) Fixed don't divide profit loss values with 100 because they are already in the main currency.
-   [D-118330](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20415842) Fixed show closed nudget on next login.
-   [D-118584](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20457421) Fix component.URLClicked missing on facebook login CTA click.
-   [D-118582](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20457325) Fix missing variable on WA when already logged in with facebook.
-   [D-117521](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20268642) Fix Customer hub tile action to be triggered only on arrow click.
-   [D-119320](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20585136) Fixed product menu highlighting.
-   [D-118981](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20522121) Fix reset container to default view when clicking on account name.
-   Fix Login CTA click tracking.
-   [D-119125](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20547297) Reset to default account menu view when opening from header avatar.

### Vanilla 11.0.0

2021-06-18

**HIGHLIGHTS**

-   Updated to [angular 11](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/master/docfx/articles/guides/updating-to-ng-11.md#how-to-update-to-angular-11) and [angular 12](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/master/docfx/articles/guides/updating-to-ng-11.md#how-to-update-to-angular-12)
-   Our libraries support only ivy rendering engine
-   Removed dependency on `adobe-target-script` package. This script is injected via dynacon config. Remove it from your's package.json
-   Removed writing of custom header `X-UA-Compatible` with value `IE=edge` as Internet Explorer is not supported browser
-   Removed web.config's IIS rewrite module section related to removal of trailing slash. Installation of IIS URL Rewrite module is no longer needed. If this feature is still used, redirex rule can be added.

**FEATURES**

-   [B-436440](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19910175) Added prerender config and automatic setting window.prerenderReady to true after a configurable timeout.
-   [B-444581](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20263287) Use `terminalid` and `shopid` query parameters during autologin.
-   [B-444021](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20242099) Part 2: added more accurate script loading measurements for mpulse cache check
-   [B-439206](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20025022) Add ability to Bootstrap JavaScript assets based on 'Media', 'LazyLoad' & 'Alias'.
    -   Specific config on dynacon is [LoadCustomScriptAliasAsSecondary](https://admin.dynacon.prod.env.works/services/198137/features/264844/keys/264847/valuematrix?_matchAncestors=true).
    -   `StylesheetLazyLoadStrategy` renamed to `AssetLazyLoadStrategy`.
-   [B-428211](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19532155) Customer Hub - Net deposit widget - Added net deposit tile.
-   [B-429175](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19575134) Customer Hub - Net deposit widget - Added tracking for net deposit tile.
-   [B-446475](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20327857) Customer Hub - Profit loss widget - Added profit loss tile.
-   [B-440923](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20101849) Added tracking for `Continue with Facebook` button when connected.
-   [B-429175](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19575134) Customer Hub - Global loss limit widget - Added tracking for global loss limit tile.
-   [B-446473](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20327827) Betstation Login with card.
    [D-117685](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20311476) Expose additional KYC info including the following client-side DSLs:
    -   AmlVerificationStatus
    -   BlackListVerificationStatus
    -   IdVerificationGraceDays
    -   IdVerificationStatus
    -   KycAttempts
    -   KycMaxAttempts
    -   IsKycMaxAttemptsReached
    -   SsnVerificationAttempts
    -   SsnVerificationMaxAttempts
    -   IsSsnVerificationMaxAttemptsReached
    -   ThirdPartyVerificationStatus

**FIXES**

-   [D-116913](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20135695); [D-115684](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19839543) Adjusted tracking of login with providers.
-   [B-444233](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20249494) Adjusted _ValueTicket_ contract misalignment in regards to `amlDecisionDate`.
-   [B-438651](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19999554) Prevent multiple navigation invocations (leading to navigation stuck) on menu item clicks.
-   [D-117560](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20279822) Customer Hub - Hand icon is not displaying on mouse hovering on Pending tasks
-   [D-117584](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20285162) Customer Hub - Hand icon is not displaying on mouse hovering on My Balance
-   [D-117624](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20300765) Customer Hub - Dotted line is overlapping to footer of Tasks grid on My Hub page
-   [D-117755](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20320661) Customer Hub - Alert icon Should be left to text on Loss limit section
-   [D-117782](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20328013) Customer Hub - Hand Icon is not displaying on Monthly loss limit tile and You can deposit section
-   [D-117594](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20289212) Customer Hub - Removed close icon for tasks in profile page.
-   [D-117554](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20278277); [D-117597](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20289452) Customer Hub - Removed urgent task count in account menu and profile page if there is no urgent tasks.
-   [D-117558](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20279758); [D-117673](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20309952) Customer Hub - Adjust sliding up/down of the customer hub drawer.
-   [D-117709](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20313351); [D-117602](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20291137) Customer Hub - Fixed collapsing of the customer hub drawer when tasks are expanded from _Show All_ link.
-   [D-117706](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20313210) Customer Hub - Adjusted the click area from which the tasks are expanded.
-   [D-117558](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3a20279758); [D-117564](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20280260) Fixed swipe related functionalities.
-   [D-117657](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20308606) Removed `access_token` query param when login with Facebook.
-   [D-117660](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20308735); [D-117671](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20309842) Fixed rendering of the Facebook button on navigation.
-   [B-444018](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20241969) Fixed balance refresh response for `shared-features-api`.
-   [D-116451](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20021999) Fixed updating of active menu item when navigating to balance breakdown page.
-   [D-117601](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20290673) Fixed remove arrow from balance section on profile page.
-   [D-117603](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20291227) Fixed casino cashback is not shown when cashback amount in response is 0.
-   [D-117953](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20357489) Fixed onboarding tooltip errors spamming the logs.
-   [D-117642](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20305151) Avoid showing negative date on Tasks. If days less or equal 0, 0 will be shown.
-   [D-117913](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20350066) Fixed show opt-in text when user is not opted-in to coral cashback.
-   [D-117779](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20327557) Fixed added abilty to show content based on loss limit type.

### Vanilla 10.40.0

2021-05-27

**FEATURES**

-   [B-444021](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20242099) mPulse Capture (un)cached status- Part 2. Added window.script_load.timings to measure dist script load time.
-   [B-444020](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20242028) Added mPulse softnav fix
-   [B-417142](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19036424) Added `window.__rendered` to the pages to store rendered time so it can be used by mPulse.

    -   This will help us to detect cached pages. The following change is needed to send the cached value to mPulse: https://vie.git.bwinparty.com/vanilla-labs/mpulse-script/-/merge_requests/1/diffs

-   [B-441136](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20117099) Added cache hit / miss logging and configuration to pos cache calls.
-   Rtms Overlays redesign: Markup change for small TaC over image.
-   [B-433054](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19758448) Adjusted authentication fail tracking to include remaining login attempts, eg.: `Authentication failed - attempts left: 2`.
-   [B-439214](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20025492) Added sent CCB event `LANGUAGE_CHANGED` with parameters `newLanguage` and `routeValue` to native when language is changed in language switcher.
    -   Should be used by Electron to change language on other screens. It is sent immediately after the language change and it is sent before `LanguageUpdated` (sent on the next page load with new language).
    -   It is not replacement for CCB event `LanguageUpdated` that is used by native apps.
-   [B-432994](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19756155) Deposit prompt improvements - Added `SelfExclusion` and `DepositLimits` DSL providers that can be used for showing and hiding deposit prompt toast.
    -   `DepositLimits.IsLow` Indicates if specified limit is low according to the [configuration](https://admin.dynacon.prod.env.works/services/198137/features/263656/keys/263658/valuematrix?_matchAncestors=true).
-   [B-441863](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:20159259) German Tax - 30 days transaction summary change.

**FIXES**

-   [D-116823](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20120382) Added better error handling to Inventory Service Client to recover from invalid shop ids.
-   Fix markup for connect card button with image.
-   [B-438650](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19999540) Hide fast-login info icon if the text is missing.
-   [B-436026](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19887309) Fixed handling of Facebook SDK button click.
-   Fixed prerender user agent detection in dynacon variation context.
-   [D-116797](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20116234) [beta/test]Font size of the page name is too big
-   [B-409421](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A18709415) Rework debounce button embeded component to a service with a CSS selector configured in [Sitecore](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={711F579A-D4A0-4F96-A5E8-6C2A20CCF843}&la=).

### Vanilla 10.39.4

2021-05-25

**FIXES**

-   INC820937 Fix recaptcha hostname validation to consider evasion domains. Dynacon toggle [EnableHostNameValidation](https://admin.dynacon.prod.env.works/services/198137/features/122236/keys/264647/valuematrix?_matchAncestors=true)

### Vanilla 10.39.3

2021-05-19

**FIXES**

-   INC805758 Fixed recaptcha passing for invalid tokens. Add hostname validation when token is valid.
-   Fixed prerender user agent detection in dynacon variation context.
-   [B-440619](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20087418) Prevent double navigation event leading to navigation stuck, on [plain link](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/master/Source/Bwin.Vanilla.PluginHost/Client/vanilla/core/src/plain-link/plain-link.component.ts#L28) click.
-   Fix performance issue related to Bonus Abuser as lazy dsl provider.
-   [D-117158](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20187680) Fix page matrix rendering run before components registered.

### Vanilla 10.39.2

2021-05-18

-   [D-117063](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A20165907) Fixed ShopTier mapping issue and added more tests

### Vanilla 10.39.1

2021-05-17

**FEATURES**

-   [B-439251](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20028153) Changed [ProviderLoginOptions](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/752da1c63279ba13ee3a4292438483b2745c2878/Source/Bwin.Vanilla.PluginHost/Client/vanilla/shared/login/src/login-with-providers.service.ts#L10) to include URL and redirect URL query parameters. `trigger` is removed.

**FIXES**

-   [D-116821](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20120227) Fix markup for connect card button with image.
-   [D-115956](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19897714) Fix broken navigation layout header while navigating from cashier.
-   [D-116975](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20148857) Fix cashier iframe not updating url on menu navigation.
-   INC808317 Guard against self referencing items on sitecore RelativeTreeList.
-   Fix some interval operations inside angular zone, unnecessarily triggering change detection.

### Vanilla 10.39.0

2021-05-12

**FEATURES**

-   [B-433544](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19782526) Customer Hub - Navigation layout adjust `top menu visibility`.
-   [B-424911](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19372433) RTMS Toasters redesign.
-   [B-438472](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19991735) RTMS Overlays redesign.
-   [B-433543](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19782513) Custom Hub - Added web tracking for promotions and cashier widgets.
-   [B-436026](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19887309) Rework the Facebook button to show profile information for authenticated in Facebook users.
    -   Extended config to include Facebook SDK in [DynaCon](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix?_matchAncestors=true#252396).
-   [B-440092](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20069546) Added balance refresh when showing it on the terminal.
    -   Added `balance-refresh-timeout` parameter in the [TerminalBalance item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={DE4BBEBD-3E2C-4A86-A9B4-64148DAED4B7}&la=) to prevent spamming.

**FIXES**

-   JL: fixed StaticFileCorsWhitelistedHostConfig registration which is related to the earlier B-414593 cors error
-   INC779195 Fix open redirect for cancel url param.
-   [B-433009](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19756615) Fixed scanning of value ticket when `IsManualTicketLocking` is `null`.
-   [D-116685](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:20098059) Dynacon [Config](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/262589/valuematrix?_matchAncestors=true) for enabling/disabling username autofocus when opening LoginDialog. Can also be passed as a param on LoginDialogOptions.
-   [D-116147](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19948933) Fix message panel position on Navigation layout V2.
-   [D-115956](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19897714) Fix header bar layout issue on coral/ladbrokes when navigating from navigation layout cashier to portal pages.
-   Fixed show header bar in navigation layout V2 based on header bar config.
-   INC792961 and INC802054 Fix return url path on cashier service.

### Vanilla 10.38.1

2021-05-06

**FIXES**

-   [B-433009](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19756615) Fixed scanning of value ticket when `IsManualTicketLocking` is `null`.

### Vanilla 10.38.0

2021-05-04

**FEATURES**

-   [B-438940](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A20011601) Added the ShopCountry variation context so it can be used by Betstation
-   [B-426548](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19445159) Added text-component so only text labels can be added to the header in sitecore.
-   Exposed `AssemblyExtensions`. This will give access to `GetFullVersion()` extension method related to sample diagnostics version provider mentioned in previous release.
-   [B-433544](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19782526) Customer Hub - Pending Tasks - KYC (1+1, 2+2, KYC Refresh). Added generic implementation of countdown/deadline task based on KYC status property.
-   [B-433545](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19782588) Customer Hub - Pending Tasks - SOF. Added generic implementation of countdown/deadline task based on postloginvalues property.
-   [B-424905](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19372008) Added `th-{theme}` css class to html element. Removed `responsive` class.
-   [B-437913](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19965015) Added `postLoginValues` to `POST_LOGIN` ccb event.
-   [B-372429](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A17491441) Added tracking for the login type when login with interceptor (e.g. remember me).
-   [B-429146](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19574323) Customer Hub - Global loss limit widget - Added loss limit tile.
-   [B-433541](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19782487) Customer Hub - Cashier widget - Added cashier tile.
-   [B-433540](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19782473) Customer Hub - Promotions widget - Added promotions tile.
-   [B-429497](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19589282) Show session limits overlay based on post-login values.
-   [B-433009](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19756615) Show error message on blocked Value Ticket.

**FIXES**

-   JL: Fixed excessive error logging in the AffordabilityServiceClient
-   Fixed don't show technical error on page when PPOS api call for bonus abuser failed.
-   [D-115458](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19787232) Fix user not being asked to login when navigating to cashier route.

### Vanilla 10.37.0

2021-04-23

**KIBANA/SEMANTIC LOGGING IMPROVEMENTS**

-   [B-422352](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19261370) Added possibility for consumers (by implementing `IDiagnosticsVersionProvider`) to report their version. This information will be used on `/site/version` page and in log entries in format `version.{name}` where {name} represents value of your `IDiagnosticsVersionProvider.Name`. Products can use this information to filter for log entries specific to some version i.e. during rollouts. Sample implementation [here](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Playground/PlaygroundDiagnosticsVersionProvider.cs).
-   Added log entry property `domain` with value of current label. This is needed for multitenant setups. Same as current `label` property which is populated by leanops log shippers.
-   [B-427064](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19469563) Removed writing of vanilla and plugin versions to `vanillaversion` file. This is no longer needed as [vanilla versions dashboard](https://kibana.prod.env.works/app/dashboards#/view/8a70dab0-780a-11eb-a6db-ed63419af88b?_g=h@c823129&_a=h@e4244e0) uses applog data.

**FEATURES**

-   [B-398970](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A18356208) Added additional `home page` features. Exported HomePageGuard and HomePageConfig. [Dynacon config](https://admin.dynacon.prod.env.works/services/198137/features/258907).
-   [B-431033](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19677081) Added infrastructure to register logout providers. Exposed `OnLogoutProvider`, `LogoutStage`, `runOnLogout` and `LogoutProvidersService`. Usage:
    -   [implement providers](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/playground-logout-providers.ts)
    -   [inject into module](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/app.module.ts#L91)
    -   [register](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/bootstrapper.ts#L31)
-   [B-434732](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19831074) Added offer messages in inbox. [Dynacon config](https://admin.dynacon.prod.env.works/services/198200/features/111705/keys/259029/valuematrix?_matchAncestors=true). Offer messages are configured in [content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={E7D04E40-7A7E-4A60-A991-809C20051807}&la=). Message key naming convention: OFFER_STATUS + `_MESSAGE` (for example `ACCOUNT_NEW_MESSAGE`).
-   [B-426346](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19438017) Added SlidesPerView and SlidesPerGroup properties on PC-Carousel for multi slides carousel.
-   [B-418829](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19111150) Added [BonusAbuserInformation](https://testweb.vanilla.intranet/health/dsl#BonusAbuserInformation) DSL. The feature can be toggled from [LazyFeatures config](https://admin.dynacon.prod.env.works/services/198137/features/245375/keys/245434/valuematrix?_matchAncestors=true) in DynaCon.
-   [B-430551](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19649296) Introduce V2 layout for cashier quick deposit. [Dynacon config](https://admin.dynacon.prod.env.works/services/198200/features/111635/keys/259139/valuematrix?_matchAncestors=true). Required Themes version `9.36.0` or higher.
-   [B-433244](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19764461) Added `PageMatrix` video component: `PCVideo`
    -   [Sitecore item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={9201349F-EB2D-4A9A-92CB-3E28FE9EC7C2}&la=) used in the [PageMatrix testweb page](https://testweb.vanilla.intranet/en/p/pagematrixtest)
-   [B-432102](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19720844) Added initial value - `null` for the user `flags` observable.

**FIXES**

-   [D-115832](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19870549) Fixed affordability level null check issue.
-   Fix for [B-429619](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19597118) Added [configurable origins](https://admin.dynacon.prod.env.works/services/198200/features/111635/keys/258071/valuematrix?_matchAncestors=true) when to invoke quick vs. normal cashier deposit.
-   [B-434344](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19815586) Removed username/password validation when login with providers (Apple, Yahoo, etc.).
-   [D-115596](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19821653) Fixed double tracking related to menu items.
-   [D-115662](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19834781) Fixed login with Connect card when SignInByEmail config is enabled.
-   [D-115683](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19839522) Fixed potential double tracking on login.
-   [D-115753](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19853437) Fixed show header bar in navigation layout based on header bar config.
-   [D-115875](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19883416) Fixed closing the idle overlay with `touch` should not trigger `click` event on page.

### Vanilla 10.36.0

2021-04-12

**FEATURES**

-   [B-426595](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19447528) Added shop tier DSL provider
-   Added sending of following query parameters to cashier: `channelId`, `brandId`, and `userId`.
-   [B-376943](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:17630064) Redesign deposit prompt toast UI. Added `MohDetails` DSL provider that indicates user moh details.
-   [B-402372](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A18470786) Login screen optimization old tracking cleanup.
-   [B-422839](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19279047) Prerender health check timeout now can be configured indepenently, failure can be supressed
-   Adapted generic overlays based on themes changes. Don't use generic classes on HTML tag but in overlay container. Required Themes version `9.34.0` or higher.
-   [D-96468](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A16030158) Introduced `UserAgent` dynacon provider. Supported values for now: `Prerender` and `Other`.
-   [B-429619](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19597118) Added [configurable origins](https://admin.dynacon.prod.env.works/services/198200/features/111635/keys/258071/valuematrix?_matchAncestors=true) when to invoke quick vs. normal cashier deposit.
-   [B-431782](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19708096) Added [dynacon toggle](https://admin.dynacon.prod.env.works/services/198137/features/213625/keys/257904/valuematrix?_matchAncestors=true) for showing header bar on language switcher. Introduced new menu action `toggleLanguageSwitcher` that will open language switcher. To use it setup item in sitecore with this parameter: `click-action: toggleLanguageSwitcher`.
-   [B-432102](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19720844) Extended [user flags service](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/d347c9abe9112be0ddd1a4b7cab9ac7451a3a628/Source/Bwin.Vanilla.PluginHost/Client/vanilla/core/src/user-flags/user-flags.service.ts) with `reasonCodes`
    -   Added `HasReasonCode(reasonCodes: string)` to the [users flags DSLs](https://testweb.vanilla.intranet/health/dsl#UserFlags)
    -   Added configuration for the initialization of the user flags in [DynaCon](https://admin.dynacon.prod.env.works/services/198137/features/258120)
-   [D-114820](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19627508) Added [DynaCon configuration](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/258475/valuematrix?_matchAncestors=true) to enable/disable the fast-login toggle button.

**FIXES**

-   [D-115621](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19828702) Added client side DSL provider for Affordability level.
-   [D-114727](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19608239) Fix typo on mobile number tracking.
-   [D-114723](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19608030) Fix text casing on mobile number tracking.
-   [D-114724](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19608058) Fix component.UrlClicked on mobile number tracking.

### Vanilla 10.35.0

2021-03-26

**FIXES**

-   `Inactivity screen` is not closed when the countdown expires.
-   [B-425862](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19416920): Fixed error code mappings for cross-shop/brand usage of a value ticket.
-   [D-115225](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19715973) Refactor Fix top navigation menu items evaluation on menu change.

### Vanilla 10.34.0

2021-03-24

**FIXES**

-   [D-115225](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19715973) Fix top navigation menu items evaluation on menu change.
-   [B-423602](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19311347) Introduced `LoginPageLinks` section used when `UseV2` on login settings is enabled.

### Vanilla 10.33.0

2021-03-23

**FEATURES**

-   [B-424036](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19331240) Rework recaptcha on connectcard/gridcard login option.

**FIXES**

-   [D-114883](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19638526) Fixed before call to close function on login dialog reference in nemid login page check if it exists. It seems that this issue only exists on native clients.
-   [D-115112](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19681794)Rework Splash screen filter. If ClientBootstrap.cshtml view is not updated automatically please update it manually according to changes in Vanilla.

### Vanilla 10.32.0

2021-03-23

**FEATURES**

-   [B-394602](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A18203723) New web tracking for remember me toggle.
-   [B-425088](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19381383) Added cashback tile for casinoclub.
-   [B-428136](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19527792) Introduced new cashier menu action `gotoManageMyCards`. To use it setup item in sitecore with this parameter: `click-action: gotoManageMyCards`. Exposed `cashierService.gotoManageMyCards(options)`. Added dynacon config [Labelhost.Cashier.ManageMyCardsUrlTemplate](https://admin.dynacon.prod.env.works/services/198200/features/111635/keys/256480/valuematrix?_matchAncestors=true).

**FIXES**

-   Fixed splash screen issue.
-   Fixed an issue where `.box=1` would still write response header `X-Frame-Options with value SAMEORIGIN`.

### Vanilla 10.31.0 [*DO NOT USE - .NET MIDDLEWARE BREAKS RESPONSE ON CHROME*]

2021-03-19

**FEATURES**

-   [B-423602](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19311347) Fixed an issue where `LoginPageMessagesBottom` are shown twice. Setup items in `MobileLogin-v1.0/Login/LoginPageMessagesBottom`.
-   [B-425088](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19381383) Added [config](https://admin.dynacon.prod.env.works/services/198137/features/198901/keys/256345/valuematrix?_matchAncestors=true) to ignore account VIP level for cashback in account menu V2.
-   [B-425862](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19416920) Added value ticket location error when used from another shop/brand ID.

**FIXES**

-   Use Account menu `Version` property to differentiate between layouts on navigation layout. Use version 3 to configure layout for so called `Customer Hub`.
-   `NewReq` and `NewUser` parameters are used in `OAuth` login flow.
-   [D-114697](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19603076) Fixed duplicated separator in login page.

### Vanilla 10.30.0

2021-03-18

**FEATURES**

-   [B-423718](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19315414) Added affordability level dsl provider, client and service classes and configuration. Configuration [here](https://admin.dynacon.prod.env.works/services/198137/features/254284)
-   [B-421898](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19245413) Added support for parameters `badge-text` and `badge-text-class` in menu item. Can be used for showing a custom badge with a text.
-   Added `NewReq` and `NewUser` properties to `MobileLoginParameters`.
-   [B-412023](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A18806492) Splash screen content is now configurable on [sitecore](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={68A85220-D17D-42A9-B567-0AF3F797B7D0}&la=) and logic to show is on Vanilla is handled in a middleware, making it show up much faster than previous implementation.
-   [B-426657](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19450205) CasinoClub affID tracker.
-   [B-425088](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19381383) Added [DynaCon config](https://admin.dynacon.prod.env.works/services/198137/features/198901/keys/256345/valuematrix?_matchAncestors=true) to ignore account VIP level for the cashback banner.

### Vanilla 10.29.0

2021-03-05

**FEATURES**

-   JL: fixed Betstation-Nullable isManualTicketLocking serialization issue. isManualTicketLocking is not nullable.
-   [B-423304](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19298778) Send logintype with autologin request.
-   [B-426624](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19448947) Open login dialog with passed error message when `OPEN_LOGIN_SCREEN` CCB event is received.
-   Adapted session info header based on themes changes. Required Themes version `9.29.0` or higher.
-   [B-427361](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19486557) Login with mobile web tracking.

**FIXES**

-   [D-113178](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19292946) Fixed show monthly transactions after the login when user language is different than page language.
-   [INC741823] Fix account menu header display delay on slow connections.
-   Revert changes done for: Improved flickering on navigation layout.

### Vanilla 10.28.0

2021-03-02

**FEATURES**

-   [B-424640](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19359237) Removed password validation while login_type is USERNAME_SUBMIT.
-   [B-419761](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19149975) [B-423345](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19300430) Added login with external providers. Config [here](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/252395/valuematrix?_matchAncestors=true). Instead of `LoginNavigationService.gotoYahooLogin(options)` use `LoginWithProvidersService.invoke('yahoo', options)`. `import { LoginWithProvidersService } from '@frontend/vanilla/shared/login';`
-   [B-422789](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19277598) Added setInput, onChange and layout toggling to virtual keyboard. Here's [testweb example](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/virtual-keyboard-test/virtual-keyboard-test.html).
-   [B-417757](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19061955) Added inactivity screen feature with the [config](https://admin.dynacon.prod.env.works/services/198137/features/250385) and [sitecore content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={D7775807-C5BD-42DE-BCA9-9E66FF7DE443}&la=).
    -   `IdleService` moved to the core.
    -   Added additional options to `whenIdle` method in `IdleService`.
-   [B-412022](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:18806485) Show cashier loading indicator in desktop mode before the cashier pages are loaded.
-   [B-410310](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:18739713) Show auto-logout toast after login when multiple active sessions are terminated. Auto-logout toast is located in [Sitecore](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={77932417-6D48-4F31-885C-270E1D2DFCD7}&la=)
    -   Feature can be enabled by cloning the above Sitecore item for a particular label.
    -   Item can be further filtered for the environment or product by applying the item Filter.
-   [B-424030](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A19331034) [INC734704] Fix DSL not invalidating cache location when first loading the page.
-   [B-424249](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19341342) Improved flickering on navigation layout.
-   [B-425388](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story:19394353) Added superCookie value to POST_LOGIN CCB event.
-   [B-410311](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A18739736) Added tracking for auto logout toast.

**FIXES**

-   JL: Fixed an issue related to prerender config: success logging was always on. The content check regexp is now parsed once and evaluated per call and not parsed for every call.
-   [B-411415](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A18782017): Changed [PlayerLimit](https://testweb.vanilla.intranet/health/dsl#PlayerLimits); [Shop](https://testweb.vanilla.intranet/health/dsl#Shop) & [Terminal](https://testweb.vanilla.intranet/health/dsl#Terminal) DSLs to return default values for unauthenticated users.
-   [D-113364](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect:19329866) Fixed incorrect invalidation of List DSL.
-   [D-113598](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19366879) Fixed register `LoginDurationComponent` as an embedded component.
-   Fix setting active item on label switcher.

### Vanilla 10.27.2

2021-02-16

**FIXES**

-   [D-113372](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19331179) Fixed showing of error screen when scanning already paid out ticket.
-   Fixed formatting of the value ticket amount.

### Vanilla 10.27.1

2021-02-12

-   [D-113257](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19309140) Fixed quick deposit issue on cashier redirect page `/cashier/deposit`.

### Vanilla 10.27.0

2021-02-11

-   [D-113257](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19309140) Fixed quick deposit issue on cashier redirect page `/cashier/deposit`.
-   [B-417825](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19065635) Fixed scan `ValueTicket` request URI.
-   [D-113205](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19298865) Fixed displaying of login entry messages.

### Vanilla 10.26.0

2021-02-10

**FEATURES**

-   [B-414593](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A18927533) Added static file host whitelisting functionality for CORS
-   Exposed `IDeviceFingerprintEnricher`.
-   [B-418384](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A19091049) Login on registration tracking.

**FIXES**

-   Updated `install.ps1` to update `@frontend/vanilla-features` as well.
-   [D-112715](https://www52.v1host.com/Entain/defect.mvc/Summary?oidToken=Defect%3A19164967) Wait for remember-me login to finish before redirecting to login page when route requires authentication.
-   Fix old country code being sent when mobile field prefilled.
-   [B-417825](https://www52.v1host.com/Entain/story.mvc/Summary?oidToken=Story%3A19065635) Fixed `ValueTicket` contract misalignments.

### Vanilla 10.25.0

2021-02-05

**FEATURES**

-   Added `FOOTER_LOADED` event emited using EventsService.
-   [B-389633](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18036250) Updated tracking events for tabbed login.
-   [B-402370](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18470724) Added tracking events for US Login and tabbed login improvements.

**FIXES**

-   `HomePageModule` no longer imports `HomePageRoutingModule`.
-   [D-112761](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19175444) [D-112608](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19131292) Fixed cashier page.
-   [D-112776](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19181070) Fixed product menu issue.
-   Fixed issue with hidding login tabs on v2.
-   [D-112641](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19145178) Fix double login overlay on Danskespil.
-   [D-112904](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3a19217026) Fixed show RCPU in mobile view as popup and not full screen.
-   [D-107215](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18123719) Fixed login fields showing errors when reset form is true for error code.

### Vanilla 10.24.0

2021-02-01

-   Minor updates:
    -   Angular from `10.1.5` to `10.2.4`
    -   Angular CLI from `10.0.6` to `10.2.1`

As always, copy exact version numbers from testweb's [package.json](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/source/package.json#L20).

-   `InjectPackageVersionsPlugin` from `vanilla-webpack` didn't work with new angular cli because of dependencies webpack mismatch.

    -   Update `vanilla-webpack` to `4.5.0`
    -   Use webpack's `DefinePlugin` instead of using InjectPackageVersionsPlugin like [this](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/webpack/ng.plugin.js#L34) and add this [line](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/main.ts#L2) to your `main.ts`. This way is also much more clearer how `window.VERSIONS` variable is created.

-   Exposed infrastructure for lazy loading of features. Use it for features that you want out of main bundle. They will be loaded at some later point in time according to this [config](https://admin.dynacon.prod.env.works/services/198137/features/245375). Here's a [testweb example](https://vie.git.bwinparty.com/vanilla/testweb/-/tree/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/lazy-test-loader).

**FEATURES**

-   [B-394907](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18212866) Added GeoIP.CountryName dsl and updated the RedirectMessageClientConfigProvider to use MessageWithCountryName instead of Message
-   [B-417818](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:19065222) Added stats logging to PrerenderService
-   [B-410409](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18744019) The validation hint component's title now accepts html so can be styled differently.
-   [B-417824](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A19065621) Added initial `Value Ticket` overlay with a simple payout/error states.
    -   Triggering event: `{ eventName: 'VALUETICKET', data: { barcode: 'V-...', source: 'terminal' } }`
    -   [Sitecore item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={4C67C43B-16E1-4AB0-ADD7-819673083210}&la=); [DynaCon config](https://admin.dynacon.prod.env.works/services/198137/features/245071).
-   [B-413656](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18880355) Added possibility to add custom toast component to toast queue. See the [docs](http://docs.vanilla.intranet/articles/features/toastr-queue.html) and [testweb example](https://vie.git.bwinparty.com/vanilla/testweb/-/tree/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/toastr).
    -   Register your component with `ToastrDynamicComponentsRegistry`.
    -   Pass custom registered component as `custom Toastr` property to `Toastr QueueService.add` method.
-   [B-417829](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:19065765) Currency DSL provider.
-   [B-417825](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A19065635) Added server/client DSLs for retial's [Shop](https://testweb.vanilla.intranet/health/dsl#Shop) / [Terminal](https://testweb.vanilla.intranet/health/dsl#Terminal) and a [DynaCon toggles](https://admin.dynacon.prod.env.works/services/198137/features/250140).

**FIXES**

-   Moved `style-loading` back to VanillaLibModule.
-   [D-112715](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19164967) Fixed an issue when `HeaderService` would be used before it is ready.
-   [D-112413](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19093335) Fixed Auto Login option to use a toggle when login `V2` is enabled.
-   [D-112343](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19083202) Fix success icon when coming from registration page with username prefilled.
-   [D-112064](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19031521) Fix forgot password link position on login V1.
-   [D-108311](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18018960) Keep header bar enabled on navigation layout pages for account menu V1.
-   [D-112066](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19031680) Fix country code not populated by default on login.
-   [D-112425](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19096364) V2 layout for Remember my username toggle.
-   [D-112359](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19084807) Fix red validation for proper email address.
-   [D-112059](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19096364) Fix showing error validation when field is focused.
-   [D-112069](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A11990726) Fix success validation showing for empty field.
-   [D-112702](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19159589) Fixed changing of fast-login icon according to fast-login type.

### Vanilla 10.23.0

2021-01-21

**FEATURES**

-   [B-365642](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17177397) Added remote logging of RTMS messages by level. This is the [config](https://admin.dynacon.prod.env.works/services/198137/features/122353/keys/246711/valuematrix?_matchAncestors=true).
-   [B-416042](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18994951) Browser Geolocation api is no longer automatically invoked. Call `GeolocationService.watchBrowserPositionChanges` to initiate it.
-   [B-410660](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18753495) Removed `vnContentMessages` from client config. Content is featched when needed in separate api call.

**FIXES**

-   Fixed an issue where other lazy strategies (all except preload) would not be invoked in certain scenarios.
-   [D-112326](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19082015) Fixed product menu not highlighted initially.
-   Fixed danske spil logout issue.
-   [D-112393](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19090356) Fixed dark mode page blank issue.
-   [D-110776](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18748877) Adjusted login error message logic.
-   [D-112197](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A19059681) Use `lh-header-bar` instead `vn-header-bar` inside `PCTextWithHeaderBar` public page template.

### Vanilla 10.22.0

2021-01-18

**PERFORMANCE**

This release brings potential size improvement of `~71.9%` (bundle size reduced from 237.56 KB to 66.75 KB). `Vendor` bundle size on vanilla testweb went down from initial 487.7 KB to 283.8 KB.

-   No need to create public page template `pc-text-with-header-bar`, it is part of vanilla from now on. You can remove it from your solution (portal, casino, bingo).
-   Removed `UserConfig` from public api.
-   Sync your [vanilla-lazy-routes](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/vanilla-lazy.routes.ts).
-   Added `load` and `domcontentloaded` lazy strategies.

**Changed import paths**

-   `OverlayService` - @frontend/vanilla/features/overlay
-   `StylesService` - @frontend/vanilla/shared/style-loading
-   `RouteDataService` - @frontend/vanilla/shared/routing
-   `CashierConfig` - @frontend/vanilla/shared/cashier
-   `DslPipe, ElementKeyDirective, FocusScrollDirective, FormatPipe, HtmlAttrsDirective, TrustAsHtmlPipe,TrustAsResourceUrlPipe` -> import { VanillaCommonModule } from '@frontend/vanilla/common';
-   `vn-popper-content` -> import { PopperModule } from '@frontend/vanilla/features/popper';
-   `vn-header-bar, lh-header-bar` -> import { HeaderBarModule } from '@frontend/vanilla/features/header-bar';
-   `vn-responsive-language-switcher` -> import { LanguageSwitcherModule } from '@frontend/vanilla/features/language-switcher';
-   `vn-message-panel` -> import { MessagePanelModule } from '@frontend/vanilla/features/message-panel';
-   `vn-carousel` -> import { CarouselModule } from '@frontend/vanilla/features/carousel';
-   `vn-menu-item` -> import { MenusModule } from '@frontend/vanilla/features/menus';

**FEATURES**

-   [B-406270](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18601317) Added logging of content item's path and guid when invalid or filtered content is requested.
-   [B-406357](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18604525) Removed `lhHomePage` client config. HomePage component fetches the data when needed.
-   [B-408201](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18665917) Added `IdleService` that provides information about the user idle time.
-   [B-415149](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18952914) Added options to trigger LivePerson chat on the specific page based on URL regex and user idle status.
    -   Conditional events [config](https://admin.dynacon.prod.env.works/services/198137/features/201023/keys/246046/valuematrix?_matchAncestors=true). Specifies event name, URL regex, and timeout for triggering LivePerson event.
    -   If the new event name is added to dynacon, please add it also to the LivePerson script.
-   [B-409421](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18709415) Added debounce directive with attribute selector: `data-debounce="type"`, which will add `disabled` class to the element for _X_ amount of seconds after click or permanently if a DSL condition evaluates to `true`. Multiple configurations are supported in [Sitecore](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={10B01E33-A2E7-4895-8C7E-E5102A7A5A11}&la=) - attribute `type` must match the element name.
-   [B-413996](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18898538) Remove `.has-messages-with-overlay` class on content messages component destroyed.

**FIXES**

-   [B-414487](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18919599) Allow client filtering on balance breakdown for DSL based balance items.
-   [D-101245](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16937052) Track page.medium with nativemode values and OS plus mobile/desktop/tablet web instead of Unknown.
-   [D-110013](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18605667) Fix to avoid incompatible document requested logs on Kibana.
-   [B-411138](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18771497) Removed default overlay class: `generic-modal-overlay` from HTML tag.

### Vanilla 10.21.0 [*DO NOT USE - BROKEN PACKAGE VALIDATION*]

2020-12-30

**PERFORMANCE**

This release brings potential size improvement of `~49.5%` (bundle size reduced from 237.56 KB to 120 KB).

-   Install `@frontend/vanilla-features` to your package.json. It has the same version number as @frontend/vanilla. Keep them in sync and update always both.
-   Added lazy features strategies with configuration options (config [here](https://admin.dynacon.prod.env.works/services/198137/features/245375)). Currently supported strategies:
    -   `preload` (starts loading of features eagerly, with a greater level of urgency)
    -   `interaction` (starts loading when document.readyState value changes to interaction)
    -   `complete` (starts loading when document.readyState value changes to complete)

**Route related changes**

-   Sync your [vanilla-lazy-routes](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/vanilla-lazy.routes.ts#L20).
-   `PublicPageLoaderComponent`, `NotFoundComponent` and `ServerErrorComponent` are loadable only lazily. Examples [here](https://vie.git.bwinparty.com/vanilla/testweb/-/commit/a1de6b5b65a82a6badca74b9c22b2f955029e60a) and [here](https://vie.git.bwinparty.com/vanilla/testweb/-/commit/8cac871a64cea2a798c64865400488e94d0151a8).
-   Removed `VANILLA_ROUTES`, it's not needed anymore.

**Changed import paths**

-   `lh-home-page` -> import { HomeModule } from '@frontend/vanilla/features/home-page';
-   `lh-navigation-layout-page` -> import { NavigationLayoutModule } from '@frontend/vanilla/features/navigation-layout';
-   `lh-pull-chat-button` -> import { ChatModule } from '@frontend/vanilla/chat';
-   `lh-cross-product-layout` -> import { CrossProductLayoutModule } from '@frontend/vanilla/features/cross-product-layout';
-   `lh-sliding-bar` -> import { SlidingBarModule } from '@frontend/vanilla/features/sliding-bar';
-   `vn-recaptcha*` -> import { ReCaptchaModule } from '@frontend/vanilla/features/recaptcha';
-   `vn-datepicker-calendar`, `vn-datepicker` -> import { DatepickerModule } from '@frontend/vanilla/features/datepicker';
-   `vn-dialog-content` -> import { DialogModule } from '@frontend/vanilla/features/dialog';
-   `FlagsService` -> @frontend/vanilla/features/flags
-   `SeonService` -> @frontend/vanilla/features/seon
-   `LivePersonApiService` -> @frontend/vanilla/features/live-person
-   `AdobeTargetService` -> @frontend/vanilla/features/adobe-target
-   `ConfirmPasswordGuard` -> @frontend/vanilla/features/confirm-password
-   `AccountUpgradeGuard` -> @frontend/vanilla/features/account-upgrade

**Lazy features related api changes**

-   Added `whenReady` property to following services: `PageMatrixService`, `ProductMenuService`, `BottomSheetService`, `BottomNavService`, `AccountMenuService`, `CashierService` and `HeaderService`. You need to make a change only in case you use it very early in app lifecycle i.e. during `onAppInit()`. Example of change [here](https://vie.git.bwinparty.com/vanilla/testweb/-/commit/66c15b89cb92194938ee66e474ae21b726605570#19d0708e33fa4b096af3d1ba85fd7f415066c061).

**FEATURES**

-   [B-415151](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18952914) Added handling of footer and after view init script tags.
-   [B-412100](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18809473) Added support to provide options to `vn-virtual-keyboard`. Follow the example [here](https://vie.git.bwinparty.com/vanilla/testweb/-/tree/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/virtual-keyboard-test).
-   [B-410055](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18731096&RoomContext=TeamRoom%3A11990726) Added lazy loading of the at.js only if it is not loaded already. This ensures that the header tag script injection will not break things.
-   [B-393178](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18159496) Added language switcher tracking.
-   [B-394598](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18203624) Connect card user login page new layout
-   [B-406049](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18595715) Added ability to show `total wager amount`. `title` and `description` on RCPU overlay.
-   [B-410512](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18748248) Global session id handling for Greece Session Limit event.
-   [B-411383](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18780770) Added `product` parameter to `MENU_CLOSED`, `PAGE_CLOSED` and `INBOX_CLOSED` CCB events.
-   Exposed `IXPlatformHttpContextAccessor` interface.
-   [B-410499](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18747843) Show Loss limits overlay only when isMandatory is true.
-   [B-410058](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18731168) Added identification of barcode types send in `BarcodeScanned` CCB events.
    -   Barcode types [config](https://admin.dynacon.prod.env.works/services/198137/features/244409/keys/244411/valuematrix).
    -   When the event is identified, it will be raised through [EventsService](https://docs.vanilla.intranet/mobile/api/vanilla/core/EventsService).
-   [B-410499](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18747843) Show Loss limits overlay only when isMandatory is true.
-   [B-396064](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18247341) Login with mobile number. Enabled via [IsLoginWithMobileEnabled](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/244631/valuematrix?_matchAncestors=true) config.
-   Exposed onClose event as Output on vn-dialog-content.
-   [B-409092](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18692340) Html head tags injection based on DSL conditions using [DslBasedHeadTags](https://admin.dynacon.prod.env.works/services/198137/features/131900/keys/244827/valuematrix?_matchAncestors=true) config.
-   [B-411138](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18771497) Added `OverlayFactory` service as a wrapper around Angular Overlay CDK, providing API for setting CSS class in the HTML tag in order to style different types of overlays: `generic-modal-overlay`; `generic-modal-popup`; `generic-modal-drawer`. The default overlay class is: `generic-modal-overlay`.
-   [B-409074](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18691700) Close header drop down on click/touch outside.
-   [B-402369](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18470700) Login US UI Optimization (links, fastlogin).
-   [B-402371](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18470764) Login UI optimization (remember me toggle, tooltips).

**FIXES**

-   [B-287594](https://www52.v1host.com/GVCGroup/TeamRoom.mvc/Show/11990726) fixed package name
-   [D-110780](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:18749810) Fixed send native event `MENU_CLOSED` for tablet and desktop devices when the account menu is closed.
-   [D-110402](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:18662828) Fixed track logout type as `auto/standard logout`.
-   [D-109952](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:18594483) Fixed prolong session when user closes idle session toast.
-   [B-395758](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18238365) Fixed `AvatarBalance` component counter.

### Vanilla 10.20.0

2020-12-02

**PERFORMANCE**

This release brings a lot of features `loaded lazily through routes, on demand or during application bootstrap`. Vanilla bundle size reduced from 237.56 KB to 183 KB, bringing improvement of `~23.0%`.

-   Update your [vanilla-lazy-routes](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/vanilla-lazy.routes.ts#L11).
-   `VanillaFormsModule` is removed from main `VanillaLibModule`. Only in case you need it you can import it like this: `import { VanillaFormsModule } from '@frontend/vanilla/forms';`

-   [B-394473](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18198995) Added on-demand (lazy-loading).
-   [B-397880](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18313888) Added support for loading (during bootstrap) of `Custom styles` as `Secondary styles`.
    -   [LoadCustomAliasAsSecondary](https://admin.dynacon.prod.env.works/services/198137/features/241444/keys/241446/valuematrix?_matchAncestors=true) config with custom style `alias` and DSL condition if custom style should be loaded as secondary.
    -   Vanilla Themes released three separated bundles: `authentication.css`, `navigation-layout.css` and `native-apps.css`. To load them as secondary you need to add them into bootstrap assets provider like [here](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/source/Bwin.Vanilla.TestWeb.Playground/BootstrapAssetsProvider.cs#L30) and enable DSL condition in dynacon.

**FEATURES**

-   [B-407121](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18627912) Added dynacon configurable caching back to CachedUserValuesFlag.
-   [B-391221](https://www52.v1host.com/GVCGroup/Search.mvc/Advanced?q=b-391221) Added Loss limit tracking.
-   [B-287594](https://www52.v1host.com/GVCGroup/TeamRoom.mvc/Show/11990726) Added npm package check.
-   [B-402356](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18470066) Added GUID to CCB events sent to native. Added posibility to log CCB events in Kibana. Config [here](https://admin.dynacon.prod.env.works/services/198137/features/122791/keys/237984/valuematrix?_matchAncestors=true).
-   [B-382070](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17797713) Added tracking for yahoo login integration.
-   [B-379949](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17727426) Added `closeType` to `LoginDialogData` that indicates the way the login dialog is closed. Possible values exposed in enum `LoginDialogCloseType`.
-   [B-386949](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17956783) Added Greece Session Limits event tracking.
-   [B-405129](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18566100) Added DSL based filter for rtms. Events can be disabled based on type and condition set in [DisabledEvents](https://admin.dynacon.prod.env.works/services/198137/features/122353/keys/240312/valuematrix?_matchAncestors=true) in Dynacon.
-   [B-399147](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18361950) Added menu action to manipulate query parameters. _Ref: [Betstation_Rules](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={6C720022-0BE0-420E-9787-C740B717158E}&la=) item._
-   [B-408172](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18664603) Open Chat from quick deposit cashier iframe.
-   [B-407121](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18627912) Created `FetchCachedUserValuesConditions` config to allow toggle `use cached` based on DSL expressions to be evaluated on server. Previous `FetchCachedUserValues` not used anymore.
-   [B-396913](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18275338) Added new placeholder for login content messages at the bottom of the login page. Bottom login content messages are located in Sitecore under [LoginPageMessagesBottom](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={0279E72B-1F59-4D9A-BC92-C4576DAAE9A6}&la=).

**FIXES**

-   [D-109814](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:18571760) Fixed use browser window dimensions for tracking screen resolution. As fallback use deviceatlas data.
-   [B-404179](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18536737) Changed kibana entry client config provider took more time than configured with threshold to log time in ms instead of timespan.
-   [D-106541](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18018960) Fix session not expiring after RememberMe token expiration time.
-   [D-109706](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18550929) Fix missing tracking event for More Info link in account menu balance tile.
-   [D-109849](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18579380) Removed duplicated pageView call
-   [D-109008](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18420114) Added posibility to `opt out of default scroll to top behavior` after client navigation. Config [here](https://admin.dynacon.prod.env.works/services/198137/features/198454/keys/237837/valuematrix?_matchAncestors=true).
-   Fixed Session Limits time conversion.
-   Handled `NOT_OFFERED` response for the offer in `InboxCtaActionComponent`.
-   [D-108311](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18018960) Keep header bar enabled on navigation layout pages.
-   [INC700030] Fixed `disabled` property for optin button in inbox and rtms when status of the offer is not `OFFERED`.
-   [INC703632] Fixed bullet point shown on inbox messages for Coral and Ladbrokes.
-   [D-109807](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18570531) Disable the feature and log error in the console if client config failed to load.

### Vanilla 10.19.0

2020-10-28

-   Updated to `Angular 10`. Follow [the migration guide](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/master/docfx/articles/guides/updating-to-ng-10.md#how-to-update-to-angular-10).

### Vanilla 10.18.12

2020-12-15

-   Added sending of event `system LOGOUT` in any case, not only for native clients.
-   [D-111077](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18815960) User summary dialog is now disabled for non-real players.
-   [B-410955](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18764915) Changed log level for successful reCAPTCHA verification from `information` to `warning`.
-   [B-411459](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18783465) Added more user details to reCAPTCHA verification outcome logging.

### Vanilla 10.18.11

2020-12-10

-   [B-410955](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18764915) Added logging of successful reCAPTCHA verification. DynaCon toggle for this can be found [here](https://admin.dynacon.prod.env.works/services/198137/features/122236/keys/243476/valuematrix?_matchAncestors=true).

### Vanilla 10.18.10

2020-12-02

-   [D-110427](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18667039) Fixed player limits to initialize on page refresh / product switch when enabled.
-   [B-399148](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18361960) Added safety check when the Sitecore content of the `offer` feature is missing.

### Vanilla 10.18.9

2020-12-01

-   [D-110427](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18667039) Disable initial API requests for player limits and user summary features.

### Vanilla 10.18.8

2020-12-01

-   [D-110427](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18667039) Fixed console error when no loss limits are available.
-   [B-380030](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17731260) Removed unnecessary API calls during user summary overlay initialization.
-   [B-401958](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18462201) Added DynaCon toggle for Affordability Loss Limit feature: https://admin.dynacon.prod.env.works/services/198137/features/243000.

### Vanilla 10.18.7

2020-11-27

-   [D-110427](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18667039) Changed player limits DSL evaluation to be client side only.

### Vanilla 10.18.6

2020-11-25

-   [B-380030](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17731260) Added `User Summary` overlay, which is shown on user login (once per session). Summary elements are located in SiteCore under [SummaryItems](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={0AAC300F-A904-465F-BC4A-D8455D5A8672}&la=) element. To toggle the feature you can use the [DynaCon toggle](https://admin.dynacon.prod.env.works/services/198137/features/239764/keys/239766/valuematrix) or a DSL condition in the `SummaryItems` element.
-   [D-110427](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18667039) Fixed contract misalignment in player limits API.

### Vanilla 10.18.5

2020-11-24

-   [B-408172](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18664603) Open Chat from quick deposit cashier iframe.
-   [B-407121](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18627912) Created `FetchCachedUserValuesConditions` config to allow toggle `use cached` based on DSL expressions to be evaluated on server. Previous `FetchCachedUserValues` not used anymore.
-   [D-110427](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18667039) Added client side provider for the `PlayerLimitsSum` DSL: `c.PlayerLimits.GetPlayerLimitsSum("TYPE")`. For unauthenticated users, the returned value is: `-1`.

### Vanilla 10.18.4

2020-11-18

-   [B-407121](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18627912) Added dynacon configurable caching back to CachedUserValuesFlag

### Vanilla 10.18.3

2020-11-13

-   [B-389887](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18043623) Fixed offer button text content mapping.

### Vanilla 10.18.2

2020-11-06

-   [B-398792](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18349575) Fixed terminal balance component registration.

### Vanilla 10.18.1

2020-11-06

-   [B-401958](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18462201) Fixed PlayerLimits DSL provider issue.

### Vanilla 10.18.0

2020-10-27

-   Removed `BootloaderInlineScriptBootstrapAsset` in attempt to improve the loading time of client config call. Client config loading will be from now on the first `<script>` tag on the page.
-   [B-399721](https://www52.v1host.com/GVCGroup/TeamRoom.mvc/Show/11990726) Added Loss Limit Overlay
-   [D-108060](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18275245) Added DSL string operators `URL-ENCODE` and `URL-DECODE`.
-   [B-397319](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18290974) New Balance Breakdown Tracking.
-   [B-390761](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18070831) Service Availability CTA adaptations based on the active chat session.
-   [D-108499](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18339853) Do not subscribe to session limits events if disabled in dynacon.
-   [D-108758](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:18377546) Fixed track login errors in correct format.
-   Fixed `RememberMe` issues: `LoginType value legacy` is no longer passed and `rm-t` cookie writing when feature is disabled.
-   [B-397552](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18299814) As part of `Zendesk` integration, which will replace `Genesys` chat, added the change to send ccb events always and not only when running in native context.
-   [B-398792](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18349575) Added balance visibility toggle for BetStation.
-   [B-389887](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18043623) Added fallback status text for the offer button in [Sitecore](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={F86CBA0A-3B0C-4FF4-80A6-31A03B8A0AD6}&la=) when the text in attributes is missing.
-   [B-322231](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15520544) Added new dynacon config for canonical rule [UrlRegexRules](https://admin.dynacon.prod.env.works/services/198137/features/122805/keys/236772/valuematrix) that replaces [UrlRules](https://admin.dynacon.prod.env.works/services/198137/features/122805/keys/122820/valuematrix) config. New config is `json` (old was `Array`) and gives the ability to merge and override rules between labels and environments.
-   Removed unnecessary log entry related to `Cashback/v2` posapi endpoint.
-   [B-390417](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18059675) Added `vn-virtual-keyboard` based on [simple-keyboard](https://virtual-keyboard.js.org/). You will have to install it as dependency. Exported `VirtualKeyboardModule`. Check the example [here](https://testweb.vanilla.intranet/en/playground/virtual-keyboard-test).
-   [B-395758](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3a18238365) Added `avatar-balance` component - combining avatar with the balance. _([Sitecore item](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={B9309936-C580-4065-B348-2E9EB2CA11AC}&la=))_
-   [D-109321](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18477225) Logout on different tabs logic migrated from Van8.
-   [D-109327](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:18477982) Fixed rendering of standalone login page with login tabs. Issue observed on following products: `poker` and `casino`.
-   [B-401958](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3a18462201) Added [`PlayerLimits.GetPlayerLimitsSum()`](<https://testweb.vanilla.intranet/health/dsl#PlayerLimits.GetPlayerLimitsSum(limitTypeIds:_String)>) DSL providing the sum of the player's current limits, which will be used for affordability check.
-   [B-389876](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18043392) Added option to `opt-in` through email on Public Pages with `offer button`. For auto opt-in to work the URL that points to Public Page must have two query string parameters `offerId` (id of the offer) and `offerType` (type of the offer e.g. eds, bonuses ...) with corresponding values (e.g. https://testweb.vanilla.intranet/en/p/offerbutton?`offerId=123&offerType=eds`)

### Vanilla 10.17.1

2020-10-24

-   Added [DanskeSpil RedirectAfterLogin configuration](https://admin.dynacon.prod.env.works/services/198137/features/200978/keys/237283/valuematrix?_matchAncestors=true).

### Vanilla 10.17.0

2020-10-12

-   [B-399608](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18377541) Forward initial login `product` to finalize calls by overriding `x-bwin-product` header with value from `LastKnownProduct.PlatformProductId`.
    -   Added DSL `LastKnownProduct.PlatformProductId` which indicates the value of the platform product id.
-   [D-108792](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18380636) Added auto-scroll to the balance breakdown tooltip on tutorial navigation.
-   [B-399978](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18390602) Hide balance breakdown expand button if no items.

### Vanilla 10.16.0

2020-10-09

-   [B-386542](https://www52.v1host.com/GVCGroup/TeamRoom.mvc/Show/11990726) Added support for previous balance tracking.
-   [B-386794](https://www52.v1host.com/GVCGroup/TeamRoom.mvc/Show/11990726) Added utm tracking functionality.
-   [B-386641](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17952428) Added entry info tracking on PageView.
-   [B-387649](https://www52.v1host.com/GVCGroup/TeamRoom.mvc/Show/11990726) Added PosErrorMessage to the LoginInfo and changed the tracking message format.
-   [B-395366](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18227275) Added `Id` to document metadata `(DocumentId.Id)` which coresponds to sitecore item's GUID.
-   Changed balance breakdown layout markup.
-   [INC659012] Fixed replacement of `STATIC` keys in inbox message.
-   Included `loop` property on page matrix carousel.
-   [B-386794](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18217173) Geolocation support for native apps:
    -   Position is sent by the native app via CCB event `GEO_LOCATION POSITION` and then mapped to a location by platform (via PosAPI).
    -   [UseBrowserGeolocation](https://admin.dynacon.prod.env.works/services/198137/features/214370/keys/235049/valuematrix) toggle added to dynacon if browser API geolocation will be used.
-   [B-386641](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17946904) Added entry info tracking persisted on user navigation.
-   [B-398372](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3a18333963) Adding ability to login a user with `rememberMeToken` and `loginType`.
-   [B-398351](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18332600) Added `f2FVerificationRequired` and `partiallyVerified` to the KYC Status provider.
-   [D-108625](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18361165) Added ability to specify `package-versions.json` file path. Config is [here](https://admin.dynacon.prod.env.works/services/198137/features/213638/keys/235724/valuematrix?_matchAncestors=true).
-   [D-108563](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3a18350893) Fixed set default slider item when product name is not in slider items.
-   Avoid label switcher navigation for Native.

### Vanilla 10.15.1

2020-10-05

-   [B-392284](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18129469) Fixed KYC for ribbon DSL mapping for the client.

### Vanilla 10.15.0

2020-09-29

-   [D-107428](https://www52.v1host.com/GVCGroup/TeamRoom.mvc/Show/11990726) Removed native bwinex:// post login call
-   [B-393930](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18180476) Added feature to extract our `remember me token` from any of our labels and use it to login on another label.
-   [B-394317](https://www52.v1host.com/GVCGroup/TeamRoom.mvc/Show/11990726) Added DSL `KycStatus.KycAuthenticationStatus`.
-   [B-380843](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17758211) Added `regexp support` to `SEO page meta tags`.
-   [B-372572](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17497163) Added scrolling to the top of `cashier iframe` when `resize` event is received.
-   [B-393933](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18180674) Added support for `migrated player onboarding` toast. Displays the `MigratedPlayerOnboarding` toast for migrated user when the filter condition on `App-v1.0/Toasts/UpdateBrowser` yields true.
-   [B-394851](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18211731) Added support for showing an image on Session Info overlay.
-   [B-391750](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18107094) 24h active session overlay.
-   [B-384084](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17863425) Added support for receiving `FINGERPRINT` CCB event with `device details` object. Device details are saved in cookie and sent to server on login.
-   [B-394472] ((https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18198983)) Balance breakdown changes for Germany.
    -   `SportsExclusiveBalance`, `SportsDepositBalance`, `GamesDepositBalance`, `SportsWinningsBalance`, `PokerWinningsBalance`, `SlotsWinningsBalance`, `AllWinningsBalance` added to balance DSL provider.
    -   [UseV2](https://admin.dynacon.prod.env.works/services/121971/features/151147/keys/232760/valuematrix?_matchAncestors=true) toggle added to dynacon.
    -   Sitecore Content created on [BalanceBreakdownNew](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={C33D8B05-4668-4360-B8E3-891B722BF35B}&la=)
-   Fixed onboarding tooltips being shown after every navigation.
-   [INC646340] Fixed open redirect security issue on return url from login.
-   Fixed an issue where `chat` couldn't be disabled.
-   [D-107931](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:18259323) Fixed `cashier payment history` link in `account menu v2`.
-   [B-382654](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17820510) Added `UserFlag` DSL provider (based on values of http://qa1.api.bwin.com/V3/#crm-player-flags-get) with `Get` method. `Get` method will return the value of the user flag.
-   [D-107843](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A18236550) Fixed parsing of login error code when `=` parameter value is used.

### Vanilla 10.14.3

2020-09-29

-   [B-392284](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18129469) Fix client evaluation of DLS for KYC for ribbon.

### Vanilla 10.14.2

2020-09-28

-   [B-392284](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18129469) Flatten KYC ribbon data to comply with DSL syntax.
    -   DSL changed:
        -   `KycStatus.GetAdditionalInfo('key')` -> `KycStatus.KycStatus.GetAdditionalKycInfo('key')`
        -   `KycStatus.GetRibbonAdditionalInfo('key')` -> `KycStatus.GetAdditionalRibbonInfo('key')`

### Vanilla 10.14.1

2020-09-24

-   [B-392284](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18129469) Exposed [`KycInfoForRibbon`](http://test.api.bwin.com/V3/#kyc-kyc-info-for-ribbon) for claims for France explicitly.
    -   [DynaCon feature toggle](https://admin.dynacon.prod.env.works/services/198137/features/233597/keys/233599/valuematrix) added
    -   New DSL added:
        -   `KycStatus.RibbonStatusCode`
        -   `KycStatus.RibbonStatusMessage`
        -   `KycStatus.GetRibbonAdditionalInfo('key')`
        -   `KycStatus.GetAdditionalInfo('key')`

### Vanilla 10.14.0

2020-09-15

-   [B-390629](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18066144) Added support for `product switch overlay`. Dynacon [config](https://admin.dynacon.prod.env.works/services/198137/features/231603). Content is configured on this path `App-v1.0/ProductSwitchCoolOff`.
-   [B-394425](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18197051) Added `HandShakeSessionKey` to `MobileLoginParameters`.

### Vanilla 10.13.0

2020-09-14

-   **IMPORTANT** As of this version consumers are in charge of specifying `lazy vanilla routes` into their application. This is still work in progress and we will try to improve this in future. You need to add this [file](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/vanilla-lazy.routes.ts) and use `VANILLA_LAZY_ROUTES` in your routes like [here](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/app.routes.ts#L37).
-   [B-382638](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17820003) RTMS 24h continuous active session logout.
-   [B-388974](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18017142) RTMS Session limits elapsed time dialog.
-   [B-391401](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18090511) Added `pathTemplate` property to `CashierNewoptions`. Should be used to redirect to non-standard cashier pages. If not provided, `urlTemplate` will be used. Specific methods like `gotoDeposit` will use correct value from config i.e. `depositUrlTemplate`.
-   [B-390221](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18052744) Exposed `ISeoMetaTagsConfiguration` and related classes.
-   [B-367410](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17277481) Added update browser toast. Displays the `UpdateBrowser` toast for the supported but untested browsers when the filter condition on `App-v1.0/Toasts/UpdateBrowser` yields true.
-   Added ability to pass parameters to menu action that is used for closing content message.
-   [B-389894](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18043866) Added DSL `LastKnownProduct.Previous` which indicates the value of the previous known product.
-   Fixed an issue when login error code used with `resetForm` would prevent next login.
-   [D-102983](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A17300262) TimeSpan login error converter to show 1 when value is lower.
-   Added configuration for ReCaptcha Enterprise project id [EnterpriseProjectId](https://admin.dynacon.prod.env.works/services/198137/features/122236/keys/229854/valuematrix?_matchAncestors=true#229857).
-   [B-388980](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18017353): Added back button on health pages.
-   Improved Recaptcha Enterprise logging and client execution.
-   [B-391716](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A18104989) Added capability to set onboarding tooltips on sitecore menu items.
    -   Parameters are:
        -   `tooltip` - name of the tooltip item as ViewTemplate in `App-v1.0/Tooltips` folder.
        -   `tooltip-class` class to define the color of the tooltip.
-   [B-370627](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17422025) Added support for `user inactivity detection`. when a user is inactive for a configured time period, he will be presented with a toast message. If he does not close the toast message in the configured time period, he will be automatically logout. Dynacon [config](https://admin.dynacon.prod.env.works/services/198137/features/229987).
-   [B-393614](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3a18172429) Added generic menu action `sendToNative` which can be used to send native events. Check sample item [here](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={C5873974-7001-43F7-9841-6E5B0CB00CC6}&la=).
-   [D-107364](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3a18139650) Exposed `FlagsService` which returns content from `vnFlags` client config.
-   Added `goBack` menu action which navigates back in browser history.
-   [INC638987] Fixed an issue with `nemid login` when standalone login page is opened.
-   `NATIVE APP TEAMS` Added replacement method instead of `{native}app/postlogin` route. Use `{culture}/labelhost/workflow/postlogin`, this route will send `POST_LOGIN` ccb event instead responding with `bwin:// schema`.
-   Added support for header item type `dropdown` for both header elements and product menu.

### Vanilla 10.12.0

2020-08-26

-   [INC564291](https://gvcgroup.service-now.com/gvcsp?id=gvc_form&sys_id=8d59000fdbfddcd0b6d3a5ca0b961944&table=task) `Nemid` login after registration - added `username` to `LoginDialogData` to be used instead `LoginStore.LastVisitor`.
-   [B-378460](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17678114) Added multi state switcher tracking.
-   Added `NativeAppService.isTerminal` and `Terminal` as native mode to better cover future integration with terminals i.e. `betstation`.
-   Changed dependency to `ngx-popper-ng10` instead `ngx-popper` as package is not maintained anymore. We will look to remove the dependency on this package in the future. For now this change is enough so we can compile against `angular 10` in one of the next releases.
-   [D-106292](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:17962024) Adapted display of games in inbox to contract change.
-   Fixed show label switcher success toast for label switcher.
-   Added `IsEnabled` configuration to disable establishing rtms web socket connection.
-   [B-389270](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:18026067) Added configs for toggling the win\loss description and Logout CTA on RCPU popup [dynacon](https://admin.dynacon.prod.env.works/services/198137/features/201046).

### Vanilla 10.11.0

2020-08-20

-   [B-357117](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16812659) Adapted failed login error message retrieval logic to be based not only on login error code, but also on `posapiValues`. Error code and parameter details should be configured [here](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/133335/valuematrix?_matchAncestors=true).
-   [B-376197](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17605954) Updated `language flags` to better support `DSL` filtering in sitecore.
-   Fixed reCaptcha health check.
-   [B-376249](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17607806) Added `Language Switcher` tracking.
-   [D-104762](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:17684031) Fixed `Cookies.SetPersistent` DSL on client to save decoded value to cookie.
-   [D-106552](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:18020473) Fixed show correct label text in success toast for label switcher.
-   [B-354706](https://www52.v1host.com/GVCGroup/story.mvc/summary?oidToken=Story%3a16730157) Added `Counter` DSL provider.
-   Changed `LOCATION` event name to `Location`.
-   [D-106110](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A17916780) Permanent redirect will now correctly use status code `301` instead `302`.

### Vanilla 10.10.0

2020-08-12

-   [B-378446](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17677771) Added stateCode and countryCode to `LOCATION` CCB event.
-   Fix out of state deposit popup display.
-   [B-376197](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17605954) `Language switcher country icons` are now configurable through sitecore `App-v1.0/Flags`. They can be accessed via `vnPage.uiLanguages`.

### Vanilla 10.9.0

2020-08-06

-   [D-106264](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A17953892) Added `appendRefferer: true` when clicking on `Register Now` button on login page.
-   [D-106238](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A17947570) Fix culture added twice when navigating with query param.

### Vanilla 10.8.0

2020-08-04

-   [B-384396](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17872892) Added and mapped `SubNavigationContainer` to `MenuItem`.
-   [B-382122](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17799919) Added `saveText` input to `vn-datepicker` to display custom button text, if not specified, commonMessages.Save will be used.
-   [B-381392](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17775416) Added possibility to specify type how failed login messages will be shown i.e. `MessageType: "Information"`. Also added `ClearForm` so login form can be kept clear when certain login error code is received. Config [here](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/133335/valuematrix?_matchAncestors=true).

### Vanilla 10.7.0

2020-07-31

-   Don't log error in T&C if `#RELEASE_CRITERIA_STATIC_KEY#` is missing from platform response.
-   [B-380338](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17741723) Custom behavior on closing content messages can be done using menu action. Item parameter name: `closeAction`.
-   [B-378446](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17677771) Send native event `LOCATION` when user switch label.

### Vanilla 10.6.0

2020-07-30

-   [D-105814](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A17858378) Changed `Accept` header sent to `Prerender` service to accept `utf-8` characters (`text/html` -> `text/html; charset=utf-8`).
-   [B-379360](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17707050) [B-378446](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17677771) [B-379367](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17707260) Added support for `label-switcher` a.k.a. `multi-state switcher for US labels`. Dynacon [config](https://admin.dynacon.prod.env.works/services/198137/features/219933). Content is configured on this path `App-v1.0/LabelSwitcher`.
-   [B-384188](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17867002) Added logging when `browser-not-supported` page is shown. Added client side logging which can be enabled [here](https://admin.dynacon.prod.env.works/services/198137/features/221636).
-   Added response header `Cache-Control: no-cache ` to `browser-not-supported` page.
-   New config for [DisabledItems](https://admin.dynacon.prod.env.works/services/198200/features/103702/keys/221686/valuematrix?_matchAncestors=true) on Header to define more granular visibility for header sections, specifying which one should be disabled when header is enabled.
-   `Yahoo Login improvements` - Added support for image on yahoo login button. Fixed redirect_uri to use absolute url. Fixed closing of login oauth dialog when there is navigation detected .

### Vanilla 10.5.0

2020-07-23

-   [B-380734](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17754148) Added `GoToYahooLoginOptions` parameter to `LoginNavigationService.gotoYahooLogin`. Improved [config](https://admin.dynacon.prod.env.works/services/198137/features/205056) to make maintainence easier.

### Vanilla 10.4.0

2020-07-22

-   [B-381559 B-377420](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17646586) ReCaptcha enterprise integration.
    -   `Enterprise` version added to [EnabledVersions](https://admin.dynacon.prod.env.works/services/198137/features/122236/keys/125564/valuematrix?_matchAncestors=true)
    -   [InstrumentationOnPageLoad](https://admin.dynacon.prod.env.works/services/198137/features/122236/keys/218273/valuematrix?_matchAncestors=true) can be enabled to run reCAPTCHA evaluation on every page
    -   New configuration for Enterprise keys: [EnterpriseSecretKey](https://admin.dynacon.prod.env.works/services/198137/features/122236/keys/217937/valuematrix?_matchAncestors=true) and [EnterpriseSiteKey](https://admin.dynacon.prod.env.works/services/198137/features/122236/keys/217935/valuematrix?_matchAncestors=true)
    -   New configuration for reCAPTCHA version to be used on Login page to avoid breaking changes. [RecaptchaEnterpriseEnabled](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/218254/valuematrix?_matchAncestors=true) will have precedence over [RecaptchaVersion](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/155536/valuematrix?_matchAncestors=true)
    -   Methods `CreateAssessmentAsync` and `AnnotateAssessmentAsync` can be called on `ReCaptchaService` to make backend calls to Google api.
-   [B-382301](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17807922) Added `firstName, lastName, secondLastName` to `PostLogin` CCB event.
-   [B-377127](https://www52.v1host.com/GVCGroup/story.mvc/summary?oidToken=Story%3A17634922) Added chat `datePicker` message template.
-   [B-383041](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17832253) Made `HeaderBar` [visibility configuration](https://admin.dynacon.prod.env.works/services/198137/features/123531/keys/219694/valuematrix?_matchAncestors=true) to support `DSL` evaluation.
-   Fixed logic for getting cookie value that is affecting `clientconfig` api call in special cases.
-   [D-105715](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:17838852) Fixed hidding header, footer and messages slots in native apps. For hiding header, footer or messages for native apps please use below configs:
    -   `Header` [config](https://admin.dynacon.prod.env.works/services/198200/features/103702/keys/103704/valuematrix?_matchAncestors=true)
    -   `Footer` [config](https://admin.dynacon.prod.env.works/services/198137/features/122030/keys/201136/valuematrix?_matchAncestors=true)
    -   Top or header message can be hiden by setting sitecore filter on message item.

### Vanilla 10.3.0

2020-07-09

-   [D-105324](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:17771507) Fixed sending cookies with initial `clientconfig` request.
-   [B-379777](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17721554) Use `vn-menu-item` on product navigation in header.

### Vanilla 10.2.0

2020-07-03

-   [B-364934](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17148051) Automated T&Cs for Oddsboost and Riskfree tokens.
-   [B-378616](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17683767) Changed rules in chat `UrlToPageIdentifiers` to match full URL instead of path.
-   Added `Exception.Data` to logged JSON written to Kibana. Used for example by DSL for very long expressions.
-   [B-378669](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17685888) Added `cancelUrl` to `LoginGoToOptions`. Indicates url where redirection will happen if close button on login page is clicked.
-   [D-104641](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:17666530) Fixed show last session info after login for Danskespil label.
-   [B-375363](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17581936) Config that specifies list of items to be visible when header is enabled.
    -   Header needs to be enabled on [this config](https://admin.dynacon.prod.env.works/services/198200/features/103702/keys/103704/valuematrix?_matchAncestors=true) so subitems can be disabled individually in the new config [EnabledItems](https://admin.dynacon.prod.env.works/services/198200/features/103702/keys/216949/valuematrix?_matchAncestors=true)
-   [D-105017](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:17718959) Fixed the issues when using ajax-login functionality and afterward the back-button. Set value of `cache-control` header to `no-store, must-revalidate, no-cache` for all `clientconfig` api calls. This disables the caching for history-back and forward.
-   Fixed `/health/content` page, loading also client-side document and added support to specify `ContentLoadOptions`.

### Vanilla 10.1.0

2020-06-18

-   Updated to `angular 9.1.9`.
-   [B-372028](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17478426) Yahoo login oauth integration.
-   [B-357117](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16812659) Adapted failed login count error message based on login error code. Error code details should be configured [here](https://admin.dynacon.prod.env.works/services/198200/features/133282/keys/133335/valuematrix?_matchAncestors=true).
-   [B-373738](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17533693) Added input `backButtonText` to `vn-header-bar` and `lh-header-bar`. It is used to show text for back button.
-   [B-373116](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17514341) Tracked `user.profile.bal` on balance refresh.
-   [B-368872](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17348341) Introduced `Authentication.Logout()` DSL provider.
-   If static keys in CMS contains except static text also placeholders, replace those placeholders in Terms and conditions with values.
-   Added css classes to cashback account menu.
-   Fixed `DateTime` DSL provider: fixed evaluation of client-side properties and added client-side implementation of functions.
-   [EnableCCBDebug](https://admin.dynacon.prod.env.works/services/198137/features/122791/keys/215470/valuematrix?_matchAncestors=true) config on dynacon to enable CCB (sending/receiving) logging to console.
-   Improved `health/report` page to be more readable.
-   [B-376749](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17625191) Geolocation support:
    -   Position is automatically watched and mapped to a location by platform (via PosAPI).
    -   Current position and mapped location are exposed by `IGeolocationService` (server) and `GeolocationService` (client).
    -   All requests to PosAPI contain `X-Bwin-LocationId` header with ID of current location.
    -   In addition current position is passed via `requestData` on login to PosAPI/platform.
    -   The feature can be configured in DynaCon [VanillaFramework.Web.Geolocation](https://admin.dynacon.prod.env.works/services/198137/features/214370).
-   Fixed an issue with native app legacy routes where redirection from relative urls to `https` has been done only on production environment.
-   Fix RTMS CTA ViewChild usage with Angular 9 [INC526975].
-   Debug and info logs in browser console are enabled also for internal requests on PROD environment.

### Vanilla 10.0.0

2020-05-26

-   Updated to Angular 9.1.2 (follow [migration guide](http://docs.vanilla.intranet/mobile/guide/migration-guide-7-9)).
-   Updated to DynaCon service version `VanillaFramework:6`.
-   `client-bootstrap-scripts.js` (and `ClientBootstrapScriptsBootstrapAsset`) was removed. Configuration is now loaded from `/{lang}/api/clientconfig` endpoint.
    -   use `bootloader()` function in your `main.ts` to load configuration ([docs](http://docs.vanilla.intranet/mobile/api/vanilla/core/bootloader)).
    -   Add `BootloaderInlineScriptBootstrapAsset` as first thing in your [BootstrapAssetProvider](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/master/source/Bwin.Vanilla.TestWeb.Playground/BootstrapAssetsProvider.cs#L11).
-   Removed volatile data from ClientBootstrap
    -   Server side datalayer - all properties were moved to client side.
    -   `html` node attributes `data-lang-route-value`, `data-theme`
-   Removed `html` node attribute `data-env`. Replaced `data-label` with `data-domain` (domain has `.` prefix).
-   Removed `hideLoginBar` and `hideMenuButton` on route data options as they were used only on non responsive header.
-   Renamed `LabelhostNavigationService` to `LoginNavigationService` and removed proxy methods from `NavigationService` (i.e. goTo, gotoNativeApp, location, locationChange).
-   Renamed `LabelhostGoToOptions` to `LoginGoToOptions`.
-   `InboxService` - removed deprecated `visible`, subscribe to `state` instead.
-   `KycStatusService` - removed deprecated `current`, subscribe to `status` instead.
-   Adjusted namespace for code moved from `Bwin.Vanilla.Mvc` to `Bwin.Vanilla.Features`.
-   Refined `IRestFormatter`-s: renamed `Instance` to `Singleton` and removed public constructors.
-   Renamed `IClientConfigurationProvider` -> `IClientConfigProvider` with related stuff.
-   Removed `IClientClaimsWhitelist` as far as the most sensitive claims were already included.
-   Added `Identifier` class and used it e.g. for `IClientConfigProvider.Name` or `DslValueProvider.Name`.
-   Removed dependency to _System.IO.Abstractions_.
-   Removed `ICompressor`. Let us know if you need it.
-   Made `AccountCurrency` on `Balance` a mandatory property.
-   Refined `ICookieHandler` and `ICookieConfiguration` and moved to `Bwin.Vanilla.Features.Cookies`.
-   Removed anonymous user restriction from `ClientBootstrap`, because the view is the same as for login page, which is always allowed for anonymous anyway. `allowAnonymous` and `authorize` parameters of `MapClientBootstrapRoute()` and `RouteDataTokenKeys.MobileRouteAllowAnonymous`/`RouteDataTokenKeys.MobileRouteAuthorize` were removed.
-   Updated [service worker docs](http://docs.vanilla.intranet/mobile/guide/service-worker). It should now be possible to use service workers to achieve loading the site offline (to show offline overlay) as well as cache specified requests and allow possibility of implementing new site version notifications etc. in the future. This should be considered experimental and will require some effort from products that wish to use it.
-   Added `IClock` which gets UTC time, Unix time, user's local time, handles stopwatch and it's easy to mock. It replaces removed `SystemTime`.
-   Refined `IPosApiDataCache` to support _nullable_ reference annotations.
-   Removed client-side `Page.languages` as far as it is subset of `Page.uiLanguages`.
-   Refactored `site root` feature and ported it to `domain specific actions`. Removed `SiteRootGuard` as it was not necessary anymore.
-   Fixed `DynaConSessionOverrides` cookie to have full domain because overrides apply only to a single app.
-   Replaced header `X-Vanilla-App-Execution-Duration` with `Server-Timing`.
-   Replaced `Bwin.Vanilla.Core.Rest.HttpMethod` with `System.Net.Http.HttpMethod`.
-   Refined `ILanguageResolver`:
    -   Renamed to `ILanguageService`.
    -   Replaced `ILanguageInfo` interface with `LanguageInfo` class which has strict validation.
    -   Replaced `GetAllowed()` method with `Allowed` property which returns value cached per HttpRequest.
    -   Replaced `GetCurrent()` method with `Current` property which selects current one from `Allowed`.
    -   Removed `SearchEngine` propert because it's supposed to be used only internally.
    -   Removed `FindByRouteValue(...)` because you can use regular LINQ expression.
-   Changed `DocumentId`:
    -   Replaced property `RelativeUri` of type `Uri` with `Path` of type `string`.
    -   Added `Parent` property.
-   Changes in DSL:
    -   New syntax:
        -   `ELSE-IF` branch.
        -   [B-354985](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16738684) String manipulation operators `LENGTH`, `INDEX-OF`, `LAST-INDEX-OF`, `SUBSTRING-FROM`, `TAKE`.
    -   New providers:
        -   `Sitecore.GetLink(contentPath)`.
        -   `Culture` provider with members `Default`, `Allowed`, `Current`, `FromClaims`, `FromBrowser`, `FromPreviousVisit`, `GetUrlToken(cultureName)`.
    -   Deprecated providers:
        -   `App.DefaultCulture`, `App.DefaultCultureToken`.
        -   `User.Language`, `User.Culture`.
    -   Used `decimal` for numbers instead of previous `int`. All providers are adapted accordingly.
    -   Changed provider `Request.AbsoluteUri` to consistently return URL with scheme that user sees in his browser which is `https` on _PROD_. Previously it was always `http` for `DslEvaluation.FullOnServer`.
    -   Changed provider `Request.CultureToken` to return actual `culture` route value.
    -   Changed providers `PlayerValue` and `KycStatus` to support _async_.
    -   [B-358107](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16853359) Unused local variables are automatically removed.
-   Updated NuGet packages:
    -   _Microsoft.Net.Compilers_ 3.4.0 -> 3.6.0.
    -   _Microsoft.Extensions..._ 2.2.0 -> 3.1.2.
    -   _System.Diagnostics.PerformanceCounter_ 4.5.0 -> 4.7.0.
    -   _Microsoft.CodeAnalysis.CSharp_ 3.3.1 -> 3.4.0.
    -   _System.Data.SqlClient_ 4.6.1 -> 4.8.1.
    -   _Serilog_ 2.8.0 -> 2.9.0.
    -   _Serilog.Extensions.Logging_ 2.0.4 -> 3.0.1.
    -   _Serilog.Sinks.Async_ 1.3.0 -> 1.4.0.
    -   _Serilog.Sinks.File_ 4.0.0 -> 4.1.0.
    -   _System.ServiceModel.Primitives_ 4.5.3 -> 4.7.0.
    -   _System.ServiceModel.Http_ 4.5.3 -> 4.7.0.
    -   _FluentAssertions_ 5.6.0 -> 5.10.3.
    -   _Moq_ 4.10.1 -> 4.14.1.
-   Removed obsolete code
    -   Server
        -   old Asset infrastructure (`IThemeManager`, etc.) and related helpers were removed.
        -   `Bwin.Vanilla.Core.CrappyIO` was removed.
        -   `DynaConEngineSettings` but `DynaConEngineSettingsBuilder` is still there to initialize DynaCon config engine if used outside Vanilla website.
        -   `preview.transform.config` was removed.
        -   Removed `IClientUserValuesProvider` and related infrastructure. Create your own client config instead.
        -   Useless properties on `IDocumentMetadata`.
        -   JSON `HtmlHelper` extensions because there is no bootstrap script anymore.
    -   Client
        -   All non responsive code was removed
        -   `PictureComponent` and `PictureWithProfilesComponent` were removed, use `ProfilesDirective` instead.
        -   `arrow` input of `MenuItemComponent` was removed, use `additionalIcon` instead.
        -   unused `AccountMenuService.updateAvatar()` was removed
        -   unused account menu routing was removed from `AccountMenuService`, use `AccountMenuRouter` instead.
        -   removed dependency and usage of `ngx-perfect-scrollbar`.
        -   removed dependency on `ngx-cookie` - all code was ported over to vanilla.
        -   deprecated cashier related methods on `LabelhostNavigationService` were removed.
-   [B-343244](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16311914) Added support for closing hints automatically. Added support for showing hints based on product.
-   [B-351398](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16604978) MLife Rewards on account menu V1.
-   [D-101709](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A17047765) Fix inbox count missing on load when rtms is enabled.
-   [B-353196](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16672611) Show language switcher on site root if user browser language is not supported and culture is missing from `usersettings` cookie. It's configurable in [DynaCon](https://admin.dynacon.prod.env.works/services/198137/features/201553/keys/202389/valuematrix?_matchAncestors=true).
-   [B-363692](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17095241) Subscribe to RTMS notification before the user is logged in. Should resolve the issue that RTMS notifications sent immediately after connection to RTMS are not received in Vanilla.
-   [D-101948](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:17093613) Fixed username is not prefilled when remember me is checked. Set expiration of cookie `mobileLogin.LastVisitor` to one year.
-   Fix Mlife rewards endpoint URL.
-   [VANO-1411](https://jira.egalacoral.com/browse/VANO-1411) On autologin when login dialog is opened don't redirect to the standalone login page, just add login entry message to login dialog.
-   `/health` returns JSON data (like `/health?json=1` in the past). UI page is now available under `/health/report`.
-   [B-365374](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17164444) Execute `Prerender` logic when `DocumentRequest` route data token is present.
-   [B-363797](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17099963) TimeSpan converter for Error Code Handler. Parameters config:
    -   Type: `Timespan`,
    -   From: Any valid TimeSpan.From.. method (e.g `Milliseconds`)
    -   To: Any valid TimeSpan property (e.g `Minutes`)
-   [B-365023](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17150193) Added `productMenuService.setItemDescription(itemName, description, cssClass)` which updates product menu item description and css class, optionally.
-   [B-364236](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17121335) Added possibility to skip changing the language to user language after the login with a query string/cookie. If website is opened with `_skipUserLanguage=1` (this will write a cookie) then after the login user language will not be applied. [INC497186]
-   Simplified custom error page to show static HTML because it's rendered only if _ClientBootstrap_ HTML document failed.
    -   `HttpException` is treated as any other exception so it can't be used to return particular HTTP response anymore.
-   [B-368559](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17337255) Themes clean up
    -   remove legacy button classes from code `btn-t`, `btn-t3`, `ghost-btn`, `prominent`, `btn-go` (replaced with btn-success)
-   [B-365918](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17196125) DatePicker for date and date range selection.
    -   Install dependency package `@ng-bootstrap/ng-bootstrap: "^6.0.2"`.
    -   Since it uses `@angular/localize` for the i18n of the weekdays and month names, **add `import '@angular/localize/init'`** in your `polyfills.ts`.
-   [B-360089](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16937622) Redirect message popup on page load.
-   [B-369971](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17392706) Added ability to show login bonus teaser that is sent with RTMS notification.
-   Increased `maxRequestLength` in `template.web.config` from `8192` to `15360` to be aligned with our consumers e.g. Mobile Portal.
-   [D-103436](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:17416279) `suppressDefaultBackBehaviour` input added to NavigationLayoutPageComponent to control when default back behaviour is triggred. Default value is false.
-   [B-360341](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16950603) Added separate text in offer tiles when there are no offers.
-   Render inbox even if the DetailImage and ShortImage are not set in Sitecore item.
-   Fix chat microcomponent client config.
-   [B-345426](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16396972) Optin in inbox to `promos` and 'eds` offers based on the sitecore item settings.
-   [D-103009](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A17302483) If a regex in SEO global meta tags rule is valid but not supported in some browser (e.g. look-aheads/behinds in Safari) then we catch client error and log it.
-   [B-372782](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17503221) Handled missing key in Terms and conditions static replace values.

Find information about older versions in [ARCHIVE-CHANGELOG.md](ARCHIVE-CHANGELOG.md).

### Vanilla 9.42.0

2020-06-03

-   If static keys in CMS contains except static text also placeholders, replace those placeholders in Terms and conditions with values.

### Vanilla 9.41.0

2020-06-02

-   [B-372028](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17478426) Yahoo login oauth integration - Renamed `ErrorValues` to `errorValues`. Don't call `oauth` login when username and password are supplied. Send `loginType` parameter as query parameter to POSAPI, instead as request body.

### Vanilla 9.40.0

2020-05-29

-   [B-372028](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17478426) Yahoo login oauth integration - Exposed `ErrorValues` as a result of `ILoginResultHandle.Login` call.

### Vanilla 9.39.0

2020-05-29

-   Changed classes for back button and back button text on header bar.
-   [B-372028](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17478426) Yahoo login oauth integration - Exposed `LoginStore.LoginType` (underlying cookie name is `mobileLogin.loginType`). The value is sent as parameter `loginType` during `finalizeWorkflow` and `skipWorkflow` calls and removed after logout.

### Vanilla 9.38.0

2020-05-28

-   [B-372028](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17478426) Yahoo login oauth integration - `oAuthUserId` is not required.

### Vanilla 9.37.0

2020-05-27

-   [B-345426](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16396972) Optin in inbox to `promos` and 'eds` offers based on the sitecore item settings.
-   [B-372782](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17503221) Handled missing key in Terms and conditions static replace values.
-   [B-373738](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17533693) Added input `backButtonText` to `vn-header-bar` and `lh-header-bar`. It is used to show text for back button.
-   [B-372028](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17478426) Added yahoo login oauth integration.

### Vanilla 9.36.0

2020-05-14

-   [B-360341](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16950603) Added separate text in offer tiles when there are no offers.
-   Fix chat microcomponent client config.

### Vanilla 9.35.0

2020-05-12

-   [B-372028](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17478426) Yahoo OAuth Integration - Added `LoginOAuthComponent` that can be opened as dialog. Also exposed `LoginOAuthDialogData` that should be used to pass data into it.

### Vanilla 9.34.0

2020-05-08

-   [B-369971](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17392706) Added ability to show login bonus teaser that is sent with RTMS notification.
-   Fixed datepicker error on mobile mode.

### Vanilla 9.33.0

2020-05-08

-   [B-360089](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16937622) Redirect message popup on page load.
-   DatePicker - Small fixes (disabled input, wrong month, model binding).
-   Increased `maxRequestLength` in `template.web.config` from `8192` to `15360` to be aligned with our consumers e.g. Mobile Portal.
-   [D-103436](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:17416279) `suppressDefaultBackBehaviour` input added to NavigationLayoutPageComponent to control when default back behaviour is triggred. Default value is false.
-   [B-360341](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16950603) Added separate text in offer tiles when there are no offers.
-   Render inbox even if the DetailImage and ShortImage are not set in Sitecore item.
-   Fix chat microcomponent client config.

### Vanilla 9.32.0

2020-04-30

-   [B-365918](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17196125) DatePicker for date and date range selection.
    -   Install dependency package `@ng-bootstrap/ng-bootstrap: "~4.2.2"`.
-   Fixed integration with `shared-features-api`.
-   [D-101411](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16969831) Added `KycStatus.IsMobileNumberVerified` DSL and `KycStatus.IsEmailVerified` DSL (based if values of http://qa1.api.bwin.com/V3/#authentication-comm-verification-status are `verified`).
-   Added a health check to make sure that .NET fix for _SameSite_ cookies is installed on the server.
-   [B-361799](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17012428) Chatbot web analytics.
-   [B-369100](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17357961) Fixed [UrlToPageIdentifiers](https://admin.dynacon.prod.env.works/services/151381/features/118206/keys/120822/valuematrix?_matchAncestors=true) in chat DynaCon configuration so that it's possible to send page identifier to Genesys when starting a chat or determining its availability.

### Vanilla 9.31.0

2020-04-16

-   Whitelisted `sofStatus` and `playerPriority` claims.

### Vanilla 9.30.0

2020-04-15

-   Fix chat init issue.

### Vanilla 9.29.0

2020-04-14

-[B-103064](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A17311146) Fix premium login issue for native apps.

### Vanilla 9.28.0

2020-04-09

-   [B-366823](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17250791) Expand `NAVIGATE_TO` CCB event with `forceReload` parameter. When forceReload parameter is equal to `true` full-page reload will be done.

### Vanilla 9.27.0

2020-04-07

-   Fix MLife rewards content item retrieval and set tier class.

### Vanilla 9.26.0

2020-04-06

-   Fixed `Chat` timing issue.

### Vanilla 9.25.0

2020-04-02

-   Fixed `Chatbot` issue.
-   [VANO-1465](https://jira.egalacoral.com/browse/VANO-1465) Added `isRegistrationLogin` parameter on `LoginResponse`, sent to native along with POSTLOGIN parameters.
-   [B-362275](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17032853) Added `cdk-global-scrollblock` class to html tag when quick deposit overlay is opened.
-   [B-363797](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17099963) TimeSpan converter for Error Code Handler. Parameters config:
    -   Type: `Timespan`,
    -   From: Any valid TimeSpan.From.. method (e.g `Milliseconds`)
    -   To: Any valid TimeSpan property (e.g `Minutes`)

### Vanilla 9.24.0

2020-03-24

-   Fix Mlife rewards endpoint URL.
-   [B-349203](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16523877) Added DSL `PackageVersions.HasVersion('packageName', 'operatorAndVersion')`.It works in conjunction with `CreatePackageVersionsManifestPlugin` from `vanilla-webpack` so be sure to [include it](https://vie.git.bwinparty.com/vanilla/testweb/-/blob/release/9.x/source/Bwin.Vanilla.TestWeb.Host/webpack/ng.plugin.js#L30).

### Vanilla 9.23.0

2020-03-18

-   Fixed chat issue.
-   Fixed offers count issue.

### Vanilla 9.22.0 [BROKEN - DO NOT ROLLOUT]

2020-03-13

-   [B-363473](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17085258) Added dynacon configuration [DisableCloseCondition](https://admin.dynacon.prod.env.works/services/198137/features/123531/keys/202255/valuematrix?_matchAncestors=true) which contains DSL that will be used if consumers are not passing any value as input field `disableClose` of `<lh-header-bar>` component.
-   [B-363692](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:17095241) Subscribe to RTMS notification before the user is logged in. Should resolve the issue that RTMS notifications sent immediately after connection to RTMS are not received in Vanilla.
-   [D-101948](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:17093613) Fixed username is not prefilled when remember me is checked. Set expiration of cookie `mobileLogin.LastVisitor` to one year.

### Vanilla 9.21.0

2020-03-12

-   [B-343244](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16311914) Added support for closing hints automatically. Added support for showing hints based on product.
-   [B-351398](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16604978) MLife Rewards on account menu V1.
-   [D-101709](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A17047765) Fix inbox count missing on load when rtms is enabled.
-   Fixed issue when `lhChat` is not enabled.
-   Fixed `DynaConSessionOverrides` cookie to have full domain because overrides apply only to a single app.
-   [B-353196](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16672611) Show language switcher on site root if user browser language is not supported and culture is missing from `usersettings` cookie. It's configurable in [DynaCon](https://admin.dynacon.prod.env.works/services/198137/features/201553/keys/201555/valuematrix?_matchAncestors=true).

### Vanilla 9.20.0

2020-03-04

-   [B-360047](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16935969) Added a toggle to opt-in/out of pre-filling username to the login form. Feature can be turned on in dynacon under `LabelHost.LoginSettings` => `PrefillUsernameToggleEnabled`, content can be changed under in Sitecore on `Vanilla.Mobile/m2.WhiteLabel/MobileLogin-v1.0/Login/Login/PrefillUsername`.
-   [B-359869](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16925856) Regenerated sitecore templates (Added `ISignposting`).
-   Added `devicealtlas-clientside` dependency (it is now automatically imported by vanilla, so you should **remove it from your `polyfills.ts`**).
-   [D-101333](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16956863) Clicking back button in inbox while on mobile will now correctly navigate back to the menu.
-   [D-101333](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16956863) Added native event `INBOX_CLOSED` when inbox is closed. Added native event `PAGE_CLOSED` when page with `lh-navigation-layout-page` is closed.
-   [B-360848](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16979928) Added ability to pass `eventName` parameter as string to `triggerEvent` method in `LivePersonApiService`. `LivePersonEventName` enum is deprecated and will be removed in the next major version.
-   [B-336582](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16006406) Added tracking support to `BrowserNotsupported` error page. Links to be tracked are marked with the `data`-attribute `tracking-label-event` on `App-v1.0/SupportedBrowsers/Info`.
-   Remove claims authentication from rememberme delete route.

### Vanilla 9.19.1

2020-02-28

-   [D-101333](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16956863) Clicking back button in inbox while on mobile will now correctly navigate back to the menu.
-   [D-101333](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16956863) Added native event `INBOX_CLOSED` when inbox is closed. Added native event `PAGE_CLOSED` when page with `lh-navigation-layout-page` is closed.
-   [B-360848](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16979928) Added ability to pass `eventName` parameter as string to `triggerEvent` method in `LivePersonApiService`. `LivePersonEventName` enum is deprecated and will be removed in the next major version.

### Vanilla 9.19.0

2020-02-19

-   [B-353622](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16685875) Added `DSL_NOT_READY` constant to client side `KycStatus` DSL provider to indicate that it does not yet have data to evaluate.
-   Deprecated `UserService.clientIP`. It was already returning `undefined`.
-   Fix ios native autofill issue on login. Incident INC444125.
-   `NavigationService.goTo` now returns a promise that is resolved after (client side) navigation.
-   Fix multiple redirects while keeping btag in querystring after getting trackerId.

### Vanilla 9.18.1

2020-02-21

-   [D-101333](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16956863) Clicking back button in inbox while on mobile will now correctly navigate back to the menu.
-   [D-101333](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16956863) Added native event `INBOX_CLOSED` when inbox is closed. Added native event `PAGE_CLOSED` when page with `lh-navigation-layout-page` is closed.

### Vanilla 9.18.0

2020-02-07

-   [B-356472](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16784941) Rewritten configured global [domain specific actions in DynaCon](https://admin.dynacon.prod.env.works/services/158727/features/158782) to DSL action syntax.
    -   Server-side redirect is indicated by response header `X-Redirect-Source` = `VanillaFramework.Features.DomainSpecificActions`.
    -   Executed server-side provider actions are logged when _tracing_ is enabled at `/health/log`.
    -   Executed client-side provider actions are logged to console.
-   Updated to DynaCon service version `VanillaFramework:5`.
-   [B-357232] Added `restoreFocus` to `ResponsiveLoginDialogOptions` (Whether the dialog should restore focus to the previously-focused element, after it's closed).
-   [D-100822](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16820522) Keep BTag parameter on querystring.
-   [B-357672](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16834074) Cookies written with client `CookieService` and server `ICookieHandler` will now set configured `SameSite` and `Secure` flags by default:
    -   This was done to comply with recent [cookie setting changes](https://blog.chromium.org/2019/10/developers-get-ready-for-new.html) in Chrome.
    -   **Corresponding [.NET Framework updates](https://devblogs.microsoft.com/dotnet/net-framework-november-2019-preview-of-quality-rollup/) from November 2019 must be installed on web server machines to write `SameSite=None`.** According to LeanOps they are already installed. Some developer machines may still lack them.
    -   `SameSite` is evaluated according to know browser bugs and it's configurable in [DynaCon](https://admin.dynacon.prod.env.works/services/158727/features/160506/keys/160508/valuematrix?_matchAncestors=true).
-   [B-355048](https://www52.v1host.com/GVCGroup/Default.aspx?menu=DetailTrackingPage) Added `SeonService` to asynchronously register a session key with the Seon fraud protection backend.
    -   The generated session key can be retrieved using `SeonService.getSessionKey()` for further usage.
    -   Options including the path to the seon agent.js script can be configured in Dynacon under `VanillaFramework.Web.Seon`.
-   Added optional parameter `authorize` to `AreaRegistrationContext.MapClientBootstrapRoute(...)`.
-   [B-358093](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16852882) Added ability to show login bonus overlay that is sent with RTMS
-   Updated account menu balance donut chart to use DSL formulas.
-   Opening account menu now refreshes third party bonus balance (if it's used).
-   Balance breakdown will no longer show infinity symbol when balance is loading.notification.
-   Bonus balance and third party bonus balance can now be refreshed independently.
-   [B-357518](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16828525) Improvements to remember-me:
    -   Related logged error messages start with _RememberMe:_.
    -   If platform/PosAPI returns no token on regular login with checked remember-me then corresponding error is logged.
    -   If platform/PosAPI returns no token on login by remember-me then corresponding error is logged and cookie with old token is deleted.
    -   If platform/PosAPI returns same token as the one used to login then corresponding error is logged and cookie with old token is deleted.
    -   Token cookies and other related ones are written directly in _POST_ request which does login. However subsequent _PUT_ is still made to guarantee correct behavior when products with different Vanilla versions are rolled out.

### Vanilla 9.17.0

2020-01-28

-   [B-352944](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16665101) Added CCB event `MENU_ITEM_NAVIGATION`. This will be triggered on menu items that have specified `ccb-navigation` parameter in sitecore instead of actual navigation. Value of this parameter should be a DSL expression that will indicate when to send the CCB event (e.g. `DSL:NativeApplication.IsNativeApp`) or `true`/`false`.
-   [B-355593](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16756905) Trigger live person event on abandoned cashier.
-   [B-355550](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16755236) Added configuration for setting badge css class. Configuration is [here](https://admin.dynacon.prod.env.works/services/158727/features/159289/keys/159291/valuematrix?_matchAncestors=true).
-   [BMA-50311](https://jira.egalacoral.com/browse/BMA-50311) Pass flag `rememberMe` to autologin for native wrapper.
-   [B-356647](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16792785) isEnabled method exposed in BottomNavService.
-   `lh-navigation-layout-page` exposes `(onClose)` for account menu navigation layout V1.
-   `suppressDefaultCloseBehaviour` input added to `NavigationLayoutPageComponent` to control when default close behaviour is triggred. Default value is `false`.

### Vanilla 9.16.0

2020-01-23

-   [B-354705](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16730082) Added infrastructure to support for micro-components (cross product components distributed via npm packages) - [docs](http://docs.vanilla.intranet/mobile/guide/micro-components).
-   [B-354705](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16730082) Client Config infrastructure was moved to `Bwin.Vanilla.Features`
    -   `Bwin.Vanilla.Mvc.Ng.ClientConfig.IClientConfigurationProvider` and `Bwin.Vanilla.Mvc.Ng.ClientConfig.LambdaClientConfigurationProvider` were deprecated. Use the ones from `Bwin.Vanilla.Features.ClientConfig` namespace instead.
    -   Added `Type` property to (new) `IClientConfigurationProvider`. Current behavior is type = `Product`. Other option is type = `MicroComponent` which will not be included in the client configs at startup (currently client-bootstrap-scripts), but can be loaded by name later.
    -   Client config providers can no longer return null
-   [B-354705](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16730082) Added client config support for micro-components.
-   Injecting a client config that wasn't loaded on client will now correctly throw rather then returning an empty object.
-   [B-354707](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16730185) Added `DslService.executeAction()`
-   [D-100491](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16742606) Fixed close action on new navigation layout in mobile view.
-   [B-354658](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16728783) Added `Time` DSL provider for representing minutes, hours, days, weeks and days in seconds.
-   Fixed redirect to routerModeReturnUrl on header bar close in router mode view.
-   [D-100517](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16728783) Fixed account menu carousel affecting other carousels on the page.
-   [D-100462] (https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16738332) Fixed menu and cards showing on new navigation layout in breakpoints smaller than 1280px.
-   [D-100482] (https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16741770) Fix navigation layout titles.
-   [B-354979](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16738509) Support for local variables in DSL actions. Syntax: `starship := 'USS Enterprise (NCC-1701)'`
-   Ensure that canonical url is lowercase.
-   Added `has-cashier-iframe` to `html` when cashier is opened in iframe.
-   Set `height` on cashier iframe in any case.

### Vanilla 9.15.0

2020-01-14

-   Removed nuget package `Bwin.LabelHost`. Uninstall it from solution prior to updating.
-   Add client side tracing for RTMS (is automatically enabled with `/health/log` tracing, or in [dynacon](https://admin.dynacon.prod.env.works/services/156882/features/122353/keys/157283/valuematrix?_matchAncestors=true) separately).
-   [B-279777](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14177426) Changed DSL internally to be executed asynchronously (according to `ExecutionMode`).
-   Added `Request.ClientIP` DSL provider.
-   [D-100209](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16672665) Fixed click on balance in header navigates to `/{culture}/account/balancebreakdown` when `v2` of account menu is used.
-   [BMA-49624](https://jira.egalacoral.com/browse/BMA-49624) Add configuration for register-button action on `LoginComponent`. The button fires the native event `openRegistrationScreen` if the dynacon key `LabelHost.LoginSettings` -> `UseOpenRegistrationEvent` is `true`, otherwise it navigates to the registration page.
-   [B-335327](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15960713) Extended DSL:
    -   Added `IDslCompiler.CompileAction()` which returns domain specific action to be executed on server or serialized to client.
    -   Support for void methods on DSL providers which can be used in domain specific actions.
    -   Added statements blocks which consist of multiple void statements. Usable in domain specific actions.
    -   Added _if-else_ statement with syntax `IF boolean-condition THEN body-statements ELSE alternative-statements END` or without _else_ branch.
    -   Added ternary conditional operation with syntax `boolean-condition ? consequent : alternative` where `consequent` and `alternative` can be either both numbers or strings.
    -   Reworked `/health/dsl` page accordingly and added section with supported syntax.
    -   Added `DslExpressionMetadata` exposed as a property on `IDslExpression<>` and `IDstAction`.
-   [D-100202](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16671610) Fixed text class rendering for menu items.
-   Updated _Microsoft.Net.Compilers_ 3.3.1 -> 3.4.0.
-   Added cashier iframe message listeners `RESIZE` and `OPEN` when cashier is used inside iframe for navigation layout.
-   [B-353860](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16693524) Added configurable update interval for `offers`. Configuration is [here](https://admin.dynacon.prod.env.works/services/151381/features/127162/keys/158353/valuematrix?_matchAncestors=true).
-   [B-352909](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16664385) Added native event `MENU_CLOSED` when account menu is closed.
-   [B-354608](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16727318) Added user's account balance to data layer in `user.profile.bal` variable.
-   [B-354652](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16728126) Added support for receiving CCB events when the app is loaded in an iframe (via `postMessage`).
-   Added `REMOVE_COOKIE` CCB events (this can be used to clean up after loading vanilla app in an iframe with native mode).

### Vanilla 9.14.2

2020-02-18

-   [B-359869](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16925856) Regenerated sitecore templates (Added `ISignposting`).

### Vanilla 9.14.1

2020-02-03

-   [B-357672](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16834074) Cookies written with client `CookieService` and server `ICookieHandler` will now set configured `SameSite` and `Secure` flags by default:
    -   This was done to comply with recent [cookie setting changes](https://blog.chromium.org/2019/10/developers-get-ready-for-new.html) in Chrome.
    -   **Corresponding [.NET Framework updates](https://devblogs.microsoft.com/dotnet/net-framework-november-2019-preview-of-quality-rollup/) from November 2019 must be installed on web server machines to write `SameSite=None`.** According to LeanOps they are already installed. Some developer machines may still lack them.
    -   `SameSite` is evaluated according to know browser bugs and it's configurable in [DynaCon](https://admin.dynacon.prod.env.works/services/158727/features/160506/keys/160508/valuematrix?_matchAncestors=true).

### Vanilla 9.14.0

2019-12-13

-   Updated to DynaCon service version `VanillaFramework:4`.
-   Removed change detection triggered by RTMS client (every 5 seconds).
-   `DSA` execution and other filters that redirect to modification of current request url should no longer redirect to `http` on `https` sites.
-   [B-349109](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16519330) Added `BonusBalance.ThirdParty` dsl provider.
-   `DslService.evaluateExpression` observable will now wait for async providers before emitting first result.
-   [D-99635](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16595797) Product menu header will now show title text even when there are no tabs.
-   [D-99681](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16604473) Fix close action on new navigation layout.
-   Exposed `AccountMenuService.v2` which indicates if version 2 is used.
-   Active item in account menu v2 can now be overriden by `active-item` parameter of the item that has `highlightable` = `true`.
-   **Revert** "Added `perfect scrollbar` to navigation layout left column."
-   [B-337337](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16040576) Added DSL operators `ROUND`, `FLOOR`, `CEIL` for handling decimal numbers.
-   [B-337337](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16040576) Changed `Balance` and `BonusBalance` DSL providers to return decimal values intead of int values when executed on server.
-   [D-98073](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16361289) Error in client-bootstrap-scripts will no longer return a document that would cause client-bootstrap-scripts to load again.
-   [B-351998](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16625140) [Login duration](https://admin.dynacon.prod.env.works/services/156882/features/156937/keys/156939/valuematrix?_matchAncestors=true) display mode can now be `Custom` and `<vn-login-duration>` component can be used in content.
-   `toggleBalanceBreakdown` menu action now navigates to `/{culture}/account/balancebreakdown` when `v2` of account menu is used.
-   [D-99948](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16640746) Disabled route reuse for navigation layout cashier.
-   [B-351101](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16594272) Added support for `vn-menu-item` to render text and description with html support. Use `render-html` parameter with value `true` on sitecore item.
-   [D-99842](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16629490) Fixed error in login flow when reCaptcha fails.
-   [B-351900](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16621453) Graceful handling on Vanilla for logout user:
    -   Authentication state is checked against PosAPI on each document request. If it fails then user is seamlesly logged out on web layer.
    -   This logic is executed for routes with `RouteDataTokenKeys.DocumentRequest`.
    -   In general use `MapClientBootstrapRoute()` instead of raw `MobileController` to register route serving client boostrap with necessary tokens and related logic.

### Vanilla 9.13.1

2019-12-12

-   [D-99842](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16629490) Fixed error in login flow when reCaptcha fails.

### Vanilla 9.13.0

2019-12-06

-   Added `perfect scrollbar` to navigation layout left column.
-   Fixed show post-acceptance description and manual terms and conditions on overlay.
-   Added `adobe-target-script` to the list of dependencies.

### Vanilla 9.12.0

2019-12-05

-   [VANO-729](https://jira.egalacoral.com/browse/VANO-729) Fetch fresh user values in case when URL referrer Host is in configured URL referrers Hosts [dynacon](https://admin.dynacon.prod.env.works/services/151286/features/122022/keys/154929/valuematrix?_matchAncestors=true).
-   Added `evasionDomain` and `vanillaVersion` to semantic logging JSON.
-   [B-336821](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16015808) Added `productId` querystring when navigating to cashier.
-   [VANO-920](https://jira.egalacoral.com/browse/VANO-920) Removed loging to console when `Live Person` is not enabled.
-   [VANO-855](https://jira.egalacoral.com/browse/VANO-855) Fixed VIP page issue when clicking on image reloads the page.
-   [B-343606](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16326686) Added offline screen ([config](https://admin.dynacon.prod.env.works/services/151286/features/155016), [content](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={0FC64841-9E7C-4D34-AAE1-93C89FB2427F}&la=)).
-   [VANO-812](https://jira.egalacoral.com/browse/VANO-812) Lazy load tag managers e.g GTM.
    -   The behavior can be activated on Dynacon using `VanillaFramework.Web.Tracking` -> `UseClientInjection`.
    -   Tag manager init scripts can be excluded by their tag manager renderer name from being injected on Dynacon using `VanillaFramework.Web.Tracking` -> `ClientInjectionExcludes`.
    -   Init scripts can then be loaded using `TagManagerService.load(rendererName: string)`.
-   Fix product menu link navigation.
-   [B-345906](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16412731) Added support for `recaptcha v3` on login page. Dynacon config is [here](https://admin.dynacon.prod.env.works/services/151381/features/133282/keys/155536/valuematrix?_matchAncestors=true).
-   Changed `HttpErrorInterceptor` registration so it can be correctly injected.
-   Implemented prevention of concurrent remember-me logins if multiple requests fail with 401 unauthorized within a short period.
-   [B-349276](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16526324) Added exact path match highlighting and optional `highlight-url-pattern` sitecore parameter to header product navigation. The logic for setting highlighted item is following and it's applied on each navigation (first one that matches will be highlighted):
    -   first item with `highlight-url-pattern` parameter that matches current location absolute path will be highlighted
    -   first item without `highlight-url-pattern` whose `url` is an exact match for current location absolute path will be highlighted
    -   if `HeaderService.highlightProduct(<product>)` is called, that product will be highlighted (if it exists) until `HeaderService.highlightProduct(null)` is called.
    -   the item corresponding to `Page.product` will be highlighted (if it exists)
    -   nothing will be highlighted
-   [D-99055](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16511703) Fixed Currency is not showing in terms and conditions text in myinbox.
-   Deposit prompt should no longer be hidden by navigation right after login
-   Deprecated `ICachableClientConfigurationProvider` and related infrastructure. You should have no usages of it anyway, and if that's the case, you can remove `CachedConfigurationScriptsBootstrapAsset` from your `BootstrapAssetProvider`.
-   Fixed semantic version logging by writing `@index and @datepattern` to file.
-   [B-351041](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16590498) Render Manual T&Cs in inbox messages.
-   Removing remember-me cookies if remember-me login fails. Reason is to avoid repeated failure which is more likely than success on the retry.
-   Fixed `cashier payment history` link in `account menu v2`.
-   Added `navigation-layout-open` class to `html` node when user is on navigation layout page and `UseV2` account menu is enabled.
-   Changed default DynaCon URLs in engine settings:
    -   API: http://api.dynacon.bwin.prod/ -> https://api.dynacon.bwin.prod/
    -   Admin web: http://admin.dynacon.bwin.corp/ -> https://admin.dynacon.prod.env.works/
-   [B-337337](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16040576) Support for `IDslExpression<decimal>`. Old `IDslExpression<int>` returns truncated value. It is deprecated (compilation warning) and usages should be replaced until next major Vanilla release.
-   [B-351325](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16602816) Enable chat bot using DSL Condition in Dynacon under `LabelHost.Chat` -> `IsChatBotEnabledConditionstring`.
-   [D-98715](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16460103) Prevent showing a technical error when rtms api method fails.
-   Add support for setting page to account menu v2 for mobile.
-   [B-338939](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16111543) Added `AdobeTargetService` to support adobe target integration.
-   Exported `DarkModeService`.
-   Added class `portal-center-wrapper` to navigation layout v2 version.
-   Added `RecaptchaService.GetVersionedVerificationMessageAsync` that returns version-specific recaptcha message.
-   Add support for setting page to account menu v2 for mobile
-   [D-99690](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16605149) Fix arrows being displayed in first and last slides on new account menu.

### Vanilla 9.11.0

2019-11-20

-   [VANO-844](https://jira.egalacoral.com/browse/VANO-844) Fixed: White screen post login on load-sports.coral.co.uk
-   Fixed build issue with `ProductMenuService`
-   [B-343454](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16322187) Changed Prerender.io logic to support _mobile-adaptive_ feature:
    -   If request comes with crawler `User-Agent` but header `X-Prerender: 1` then _Prerender.io_ service isn't called because this request comes from _Prerender.io_ itself and should render the page for corresponding `User-Agent`.
    -   Added `Request.IsPrerendered` and `RequestHeaders.UserAgent` DSL providers.
-   Added `Culture` dynamic variation context provider for DynaCon configuration engine.
-   [B-346950](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16445980) Introduced `LoginStore.LastAttemptedVisitor` which indicates last username entered on login page.
-   [B-349404](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16529871) Changed `Browser` DSL to use DeviceAtlas.
-   Added `/health/info/chat` diagnostic page which shows full trace how status of Genesys chat is determined.
-   [B-326883] (https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3a15679193) Login duration web analytics.

### Vanilla 9.10.2

2019-11-20

-   Fixed navigation layout error in non-responsive mode.

### Vanilla 9.10.1

2019-11-18

-   Fixed build issue with `ProductMenuService`.

### Vanilla 9.10.0

2019-11-15

-   `Dark mode` toggle ON writes value `2` to differentiate between `old desktop value 1`.
-   Failing to lazy load a stylesheet will no longer crash the application.
-   [D-98967](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16495016) Fixed: logged plugin versions on app startup aren't picked up by tool collecting logs because the file is not in correct format.
-   Fixed missing `pendingworkflow` registration.
-   [B-348562](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16499731) Extended _Origin_ header validation: if missing then we fallback to _Referrer_ validation.
-   [B-348765](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16505637) Requests to `client-bootstrap-scripts.js` validate _Referrer_ header to correspond to this the app to protect against anti-forgery attacks.
-   [B-342402](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16274395) Added night mode tracking.
-   [B-344277](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16351696) Added support for sub-folders in `SiteRootFiles`.
-   Change `AuthController.Check()` (server side) and `AuthService.isAuthenticated()` (client side) to return `true` if the user is authenticated or in a workflow. (VANO-732).
-   [D-99103](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16515028) Fixed: NotFound sign-up bonus not cached which causes more traffic on PosAPI and consumes more resources of the web server.
-   [D-99152](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16519335) Fixed productmenu service failing when tabs property is missing children property.
-   Expose `RememberMeStatusService` to check for the existence of remember-me tokens (BMA-48986).
-   [B-348025](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16481272) Adapted version logging to always append entries to file.

### Vanilla 9.9.0

2019-11-07

-   Updated _ng-lazyload-image_ to 7.0.1.
-   Updated _Microsoft.CodeAnalysis.CSharp_ 3.0.0 -> 3.3.1.
-   Added Account menu v2. Can be toggled on in [dynacon](https://admin.dynacon.prod.env.works/services/151286/features/123468/keys/140571/valuematrix?_matchAncestors=true).
-   [B-346670](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16437198) Added Navigation Layout v2. (Used when account menu v2 is used)
-   [B-346246](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16421820) Added Product menu v2. Can be toggled on in [dynacon](https://admin.dynacon.prod.env.works/services/151286/features/127151/keys/152908/valuematrix?_matchAncestors=true).
-   new [MenuItem](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={809F17F2-AAD7-4984-A840-4D8277E2B10D}&la=) template can now be used for menu items. It will replace `Menu Item Template` in the future.
-   `vn-menu-item` now only lazy loads images if `lazyLoadImage` input is specified.
-   `vn-menu-item` will not be lazy loaded for bots.
-   Added `Image` field to `MenuItemTemplate`.
-   [D-97994](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16346129) Open `Quick deposit` from inbox item without opening cashier page. Cashier link in sitecore item must have `btn-cashier` class.
-   Allow to override the value of the viewport meta tag for coral (VANO-580). Use `VanillaFramework.Web.UI -> Viewport`.
-   [B-344780](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16369246)
    -   Added client side Bonus Balance DSL provider (`BonusBalance.Get("PRODUCT")`).
    -   Added bonus balance items to balance breakdown page.
-   Fix route for product menu and open product tab when navigating by url.
-   Fix product menu link navigation when router mode enabled.
-   [B-341772](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16247872) Added `ngx-perfect-scrollbar` dependency (will be used for new account menu and is already used in sports).
-   Fixed: If `IClientUserValuesProvider` returns null then it fails. However you should return empty dictionary instead of a null in long term (next major Vanilla release).
-   `NativeApp`/`OperatingSystem` dynacon provider now return default value (`unknown`) when the value is null and no longer log error.
-   [D-98321](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16390913) Close menu on navigation.
-   [D-97924](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16324526) Fix post login redirect for native apps.
-   Added guid error ID to technical error page so that you can easily pair it with logged details.
-   Added `EmptyDictionary<TKey, TValue>.Singleton`.
-   Unused account menu avatar functionality was removed.
-   `AccountMenuService` routing related functionality was replaced by `AccountMenuRouter`.
-   `AccountMenuRouter` parameter was added to `AccountMenuItemBase`.
-   [B-346255](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16422084) Footer logos `Left` and `Right` items will no longer log errors when missing/filtered in sitecore.
-   [B-346307](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16424131) Added `LoginResponseHandler.registerConfigToReloadOnLogin`. Registered configs will be reloaded (and awaited) along with `UserConfig` and `ClaimsConfig` after login.
-   [B-342402](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16274395) `Dark mode` - When disabled, it will write cookie `dark-mode` with value `0`.
-   Support for deprecating fields in content templates by specifying `MapField(obsoleteMessage...)`.
-   Added nullable reference annotations to content templates.
-   [D-98460](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16413399) Allow to open account menu route on native.
-   [B-345847](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16410376) Allow custom tracking for login entry messages load. Parameters can be configured on sitecore items with `tracking.LoadedEvent` keys.
-   Fixed: Open `Quick deposit` from rtms overlay without opening cashier page. Cashier link in sitecore item must have `btn-cashier` class. [INC323047, INC323052]
-   Added `Origin` validation for POST/PUT/DELETE requests - it must be within current label. This helps to protect remember-me login.
-   Ensure that deposit prompt is not shown twice in a row after login.
-   Skip autofill fix for ios when native app.
-   Balance breakdown page now uses menu item resources.
-   Fixed issue with `parent.sendToNative` when site is running inside `iframe`. Transmitted event data with `parent.postMessage` instead. `Origin` parameter is configurable [here](https://admin.dynacon.prod.env.works/services/151381/features/88113/keys/153890/valuematrix?_matchAncestors=true).
-   Applied temporary fix for diagnostic health pages built using Angular.
-   Send open login dialog option on gotoLogin menu action (VANO-804, VANO-823).
-   [B-341432](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16230811) Overlay content messages are now evaluated on the client (if a dsl condition of a content message become truthy during the runtime of the application, the overlay will be shown and vice versa - if all messages are filtered out, the overlay will be hidden).
-   Show quick deposit header below breakpoints `gt-md`. Needs additional theme update.
-   [B-346671](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16437211) New `/health/config` page which:
    -   Provides better view of current configuration.
    -   Has direct links to DynaCon for editing the configuration.
    -   Allows editing of overrides. Legacy `/mocks/config` will be removed.
    -   Clearly pairs final configs with underlying data from DynaCon and local overrides.

### Vanilla 9.8.0

2019-10-21

-   [B-344280](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16351787) Support caching of CORS pre-flight requests. Set a TimeSpan on `VanillaFramework.Web.StaticFiles` -> `CorsPreflightMaxAge` e.g. 00:10:00.
-   Fix missing header on skipping same workflow on sequential logins (VANO-450)
-   Subscribe to `RCPU_ACTION_ACK` rtms notifications even though LabelHost.LoginDuration is not enabled in [dynacon](https://admin.dynacon.prod.env.works/services/151381/features/119990/keys/119992/valuematrix?_matchAncestors=true).
-   Fix missing AllowAnonymous registration for login route.
-   Value of `KycStatus.IsCommVerified` will return positive if any of communication channels is verified.
-   [B-341544](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16236317) `Balance` properties that are product-specific (`BalanceForGameType`, `CashoutRestrictedBalance`, `PayPalBalance`, `PayPalRestrictedBalance`) are cached per product in distributed cached. As a consumer you always receive complete balance object for your product.
-   Native event `messageToNative` will try to send event on `parent` object.
-   Changed `ContentParameters` to be case-insensitive on the server.
-   [B-342407](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16274776) `Dark mode` has arrived. Use `IBootstrapAssetsContext.Theme` instead `IUserInterfaceConfiguration.Theme` in `BootstrapAssetsProvider`. [Example](https://vie.git.bwinparty.com/vanilla/testweb/blob/master/source/Bwin.Vanilla.TestWeb.Playground/BootstrapAssetsProvider.cs#L22).
-   [B-344614](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16362751) Registered `Dark mode toggle` as embeddable component so it can be used with sitecore content (`<vn-dark-mode></vn-dark-mode>`).
-   [B-343862](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16338773) Add route to product menu. Router mode can be enabled in [dynacon](https://admin.dynacon.prod.env.works/services/151286/features/127151/keys/152226/valuematrix?_matchAncestors=true).
-   [B-337339](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16040590) Support for negative number literals in DSL.
-   Fix initial height of `QuickDepositResponsiveComponent`, needs additional theme update.

### Vanilla 9.7.0

2019-10-15

-   [B-311705](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15255060) Added link around Coral cashback image.
-   Exposed `KycStatusService.refresh()` that should be used whenever user's kyc status changes.
-   [B-335786](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15976268) Left header items are now configured from sitecore (http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={60D28AE9-6E1A-461A-9F2F-5AE8DF570F09}&la=).
    -   **NOTE: Logo was moved under left items.**
    -   **NOTE: Header html has changed and was cleaned up - this requires a theme update.**
-   [D-97312](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16189688) Use `vn-menu-item` for logout component (adds tracking from sitecore feature).
-   [D-97708](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16272885) Use `vn-menu-item` for cta component (adds tracking from sitecore feature).
-   Updated _Microsoft.Net.Compilers_ 3.0.0 -> 3.3.1 so using C# 8. We strongly recommend to enforce [nullable checks](https://devblogs.microsoft.com/dotnet/try-out-nullable-reference-types/) on your side.
-   [D-96818](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16106208) Fix blank slide displayed on slide change in loop
-   [B-342361](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16271638) Use `vnDynamicHtml` to render message queue (directives like `data-tracking`, `menu-action` and `plain-link`) can now be used.
-   [B-339339](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16127289)
    -   Support PcImage on products for Danskespil dropdown menu.
    -   Use dynamic components for Left Items.
-   [B-341359](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16227580) Fix for VANO-345: Allow remember me login/logout only on same top domain.
-   Added `workflowService.finalizeHandle()` method.
-   [B-342684](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16286117) Changed Danskespil header expanded menu content to load html from single sitecore item `MoreGames`.
-   [B-338694](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16101575) Trigger RCPU popup (login duration overlay) with RTMS message.
-   [B-332849](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15874440) Account menu v2 - cashback.
-   [B-343444](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15874440) Update number of new messages in account menu with RTMS notification.
-   [B-338079](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16066482) Account menu v2 - chat bubble.
-   Fixed rendering errors in account menu cashback
-   Improved deposit prompt tracking
-   Fixed Inbox is not showing up when one or more messages contain incorrect content item [INC325786].
-   [B-336849](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16017691) Add PlayerPriority for chat bot to VanillaClientUserValuesProvider.
-   Menu actions are now executed on server side (if available).
-   Added `RedirectToUrl` and `RedirectToLink` DSA
-   Upgraded peer dependency for `genesys-web-chat` to v1.7.0.
-   [B-335646](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15971790) Account menu v2 - inbox icon.
-   [B-335871](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15979013) Balance breakdown page.
    -   All Balance properties were added to Balance DSL provider.
    -   Sitecore items for balance now use DSL expressions as formula, prefixed with `DSL:`
-   [B-343185](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16309173) Added `LastKnownProduct` DSL.
-   [D-98199](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16371936) User should now be redirected to his account language after login.
-   If it is defined use offer id from inbox or rtms cta button to opt-in to campaign.

### Vanilla 9.6.3

2019-10-23

-   Fix product menu link navigation when router mode enabled.

### Vanilla 9.6.2

2019-10-22

-   Fix route for product menu and open product tab when navigating by url.

### Vanilla 9.6.1

2019-10-21

-   [B-343862](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16338773) Add route to product menu. Router mode can be enabled in [dynacon](https://admin.dynacon.prod.env.works/services/151286/features/127151/keys/152226/valuematrix?_matchAncestors=true).

### Vanilla 9.6.0

2019-09-20

-   [D-96775](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16092951) Append referrer to AccountUpgradeGuard navigation, to be used as return url.
-   [B-320045](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15442486) Added web tracking for tabbed login.
-   Fixed: If unable to write configuration fallback file(s) (e.g. because non-existent drive) then app fails with a stack overflow.
-   Reverts [B-336485](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16001817) that removes Paypal release funds code
    -   Added release funds dynacon toggle [PaypalReleaseFundsEnabled](https://admin.dynacon.prod.env.works/services/121971/features/123468/keys/146635/valuematrix?_matchAncestors=true)
-   [B-334866](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15942380) Changed DynaCon configuration engine:
    -   Replaced full past changesets with short info -> reduces memory footprint.
    -   Added to `/health/config`: _Configuration -> Overridden_ and _Multitenancy_.
    -   Simplified overrides internally, dropped support for file overrides during app startup.
-   [B-339205](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16121555) Added DSL enabled logic for setting up of `LastKnownProduct` cookie.
-   [B-339563](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16139524) Affiliates: Map incoming urls with a btag-querystring to a trackerId (aka wmid).
-   [B-339455](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16134085) Added Belgium split license feature (license compliance).
-   Isolated `vn-iframe` message events subscription only to events with same `origin`.
-   [D-97034](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16145637) Fixed call PosAPI endpoint `Loyalty/Cashback/V2` with default product id set as `CASINO`.
-   [D-96788](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16095524) Fixed open link in a new tab when `Ctrl Key + Left Mouse click` shortcut is used.
-   Exposed `ICampaignAssets` interface.
-   Added new event (`UserLoginFailedEvent`) on UserService for login failed.
-   [B-340019](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16164352) Added `autologin` filter for scenarios where autologin with username and password is required.
-   [D-96957](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16131485) Implement default back action on HeaderBarService.
-   Trigger `UserLoggingInEvent` on Autologin.
-   [D-97087](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16153203) Fix an issue that could cause evaluation DSL expression to use stale cached expression results (especially during login).
-   Do not trigger client side DSL cache invalidation on page load (when cache is empty).
-   [D-97302](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16186986) Fixed mobile specific Game Icons are not shown on BCM overlay and BalanceBreakdown.
-   [D-96926](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16127883) Add support for `hideOnNavigation` and `hideOnScroll` parameters for toastr queue toasts.
-   [B-339153](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16118242) Added `danskespil.dk` login integration.
-   [B-340518](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16191825) Added `danskespil.dk` logout integration.
-   Extended `/health/claims` page to show expiration time and issue time of authentication ticket and added _realod_ button.
-   [D-97325](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16196360) Fixed `log` api call will no longer prolong session timeout.
-   [B-340388](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16185366) Add support for custom placeholders in toastr queue toasts. See [docs](http://docs.vanilla.intranet/articles/features/toastr-queue.html).
-   [B-341029](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16213852) Added `cashierService` for passing query parameters to cashier (replaces `navigationService` cashier methods).
-   [D-97413](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16218455) Added handling for situation when someone clears resource timings before first page load is tracked (by returning NaN values).
-   Fixed RTMS messages are displayed in user language and not in default language [INC324196].
-   Reverted check on `RequiredString` for invalid (e.g. invisible) characters because there is too much content from Sitecore with such characters.
-   [B-339339](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16127289) Add Danskespil additional header with dropdown menu.
-   [D-97304](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16187291) Use device atlas `displayWidth` and `displayHeight` for tracking screenResolution.
-   Changed semantic logging JSON:
    -   Added `thread.culture` and `thread.id`.
    -   Replaced `username` with `user.name`, `user.isAuthenticated` and `user.workflowType`.
    -   Flattened `http` properties e.g. `http.hostname`.
-   Deprecated DSL provider `App.IsUnderMaintenance` because it was almost never used.
-   [B-339930](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16159104) Added event `LivePersonEventName.RegistrationAbandoned`.

### Vanilla 9.5.2

2019-09-09

-   [B-340112](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16169502) Added configuration _VanillaFramework.Features.Footer -> ShowLanguageSwitcher_ as a DSL expression which dynamically toggles language switcher according to business needs.
-   Add `AccountUpgradeGuard` to cashier routes.

### Vanilla 9.5.1

2019-08-30

-   Moved initialization of BrowserPerformanceService to bootstrapper to improve tracking consistency.
-   Changed link text to native lang name on seo-language-links.

### Vanilla 9.5.0

2019-08-27

-   [B-338346](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16080088) Raised GTM Event `Event.Balance_Refresh` on Balance Refresh.
-   Regenerated sitecore templates (Added `IEligibilityCriteria`).
-   [B-333575](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15902454) Improve lh-date and validation messages components to fix styling.
    -   `showSuccessValidation` input added to `FormFieldComponent` and `showOnSuccess` to `ValidationMessagesComponent` to control when to show validation message container for success.
-   [D-96594](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16061838) Fixed optin in rtms overlay to `promos` and 'eds` offers [INC321837].
-   [D-96617](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16064857) Add `loginMessageKey` parameter to be used to show messages on login page when calling `NavigationService.goToLogin({loginMessageKey: 'AutologinError'})`. The key is the sitecore item name within `LoginMessages`
-   [D-96400](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16019818) Changed `messages` slot to `multi` slot.
-   [D-96260](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15992545) Fixed set an initial delay on offers timer to fix race condition on remember-me login.
-   [D-96616](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16064795) Support showing account menu for authenticated users when directly navigating to `/{culture}/menu`.
-   [B-334494](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15927047) Added back old sending native event with schema `bwin://{username}/{ssoToken}` just with compatibility with old apps.
-   Added `cocoscasinow` to the list of legacy native routes.
-   [B-335611](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15970553) Add new native route navigation handler to deal with navigation and schema.
-   [B-322842](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15539421) Added deposit prompt feature.
    -   New DSL - `Balance.IsLow()`, `Balance.Format()` (client side only)
    -   Menu actions can be invoke from dynamic content (sitecore) by placing `menu-action="action"` attribute on any element
-   [D-96617](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16064857) Include check of isTouchIdEnabled or isFaceIdEnabled from loginParameters on loginFailed to display error message
-   Fixed KYC status api call when `AdditionalKycInfo` is null.
-   Whitelisted `registrationCompleted` claim.
-   [B-338243](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16074079) Exposed low-level content API so that products can modify all content e.g. Sports localize URLs. You are supposed to start by implementing `IPreCachingContentProcessor` and registering it with dependency injection. It can dynamically add `IJustInTimeContentProcessor`.
-   [D-96548](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16054714) Adding class d-flex to radio-tabs component on login since outdated flexbox class was removed from v6 themes
-   Updated html class to `fw-nine` to reflect framework version
-   [B-336649](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16008245) Added HintQueueService which can be used to show hints with content from sitecore.
-   [D-96242](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15990576) Adapted vnAuthstate directive to consider as authenticated also when workflowType is negative (happends when overriden by postLoginRedirect rule).

### Vanilla 9.4.0

2019-08-19

-   Optimized Roslyn Proxy to compile types in batches. This efffectively results in few (2 to 5) compilations in total). You can see it at `/health/info/roslyn-proxy`.
-   Fixed: Static assets aren't served (web server returns 401 Unauthorized) if app pool user has only read permissions.

### Vanilla 9.3.0

2019-08-14

-   [B-334707](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15935825) Post-Login url querystring on Login dialog to force trigger browser save password popup
-   [B-334890](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15943943) Added [GenericActionsService](http://docs.vanilla.intranet/mobile/api/vanilla/core/GenericActionsService). This can be used to register functions, and invoke them from various places. It servers as a base for [MenuActionsService](http://docs.vanilla.intranet/mobile/api/vanilla/core/MenuActionsService).
-   [B-334890](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15943943) Added `ExecuteFunction` DSA action. This will execute a function registered with [GenericActionsService](http://docs.vanilla.intranet/mobile/api/vanilla/core/GenericActionsService).
-   Deprecated `DynaConEngineSettings` which are meant only for Vanilla internal use.
-   [B-334867](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15942395) Added tracking parameters to toastr messages. You can put `tracking.LoadedEvent` and `tracking.ClosedEvent` (in sitecore) to specify the name of an event to track when taostr is shown to the user and/or closed. Added ability to swipe toastr to right.
-   [D-96021](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3a15943806) Fix missing DSL evaluated content on Toastr.
-   [B-334859](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15942267) Added login filter to login via querystring `username` and `temptoken`. Optionally, the querystring `clientPlatform` can be passed which will be mapped to a channelId using the mapping configured under `VanillaFramework.Web.Authentication.ClientPlatformToChannel`.
-   [B-334863](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15942302) Added support for login with `danish NemId`.
-   Upgraded peer dependency for `genesys-web-chat` to v1.6.7.
-   [B-334866](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15942380) Changed DynaCon configuration engine:
    -   Application can be run only in label-multitenant mode. Tenants are isolated and initialized lazily - _the force awakens_ feature. So if traffic only for a single label comes then the app acts similarly to single-tenant mode as in the past.
    -   Attribute `domain` in `system.web/authentication/forms` in `web.config` isn't allowed. Recommendations:
        -   In general `template.web.config` doesn't contain `system.web/authentication/forms` element so setting `domain` attribute by NuGet package _Bwin.Vanilla.WebConfigTransforms_ won't do anything.
        -   However the package should be uninstalled and `{Host}/Configuration/{Label}` folders deleted to avoid confusion but build targets and disme must be adapted first.
        -   Build targets should generate `web.config`-s only per environment. Disme should follow. Please consult it with B2D team. Make sure that new logic is backwards compatible.
    -   Command `Switch-Config` in NuGet console now support only one parameter - environment.
    -   Variation context hierarchy is fetched independently from changesets in dedicated scheduled job. Therefore there is dedicated fallback file.
    -   Replaced setting `FallbackFile` with `ChangesetFallbackFile` and `ContextHierarchyFallbackFile`. These are properties of `DynaConEngineSettingsBuilder` and also in `web.config`.
    -   Deprecated `DynaConEngineSettings` because they are meant for internal usage only. `DynaConEngineSettingsBuilder` is still public so that you can provide settings (if running outside Vanilla web app).
-   [D-96194](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15979230) Support multi product bonuses on bonus balance breakdown.
-   [B-330835](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15803803) Added [hook](http://docs.vanilla.intranet/mobile/api/vanilla/core/RouteProcessor) for processing routes.
-   Changed breakpoint values to end in `.9` rather than `.99` which caused 2 exclusive breakpoints to be active at the same time.
-   Added _DeviceAtlas_ health check which checks that the database is loaded and operational.
-   Reinitialize vn-carousel on carousel items change.
-   Changed `LanguageSwitcherUrlsProvider.getUrls` return type to `Observable<Map<string, string>>`
-   [B-336485](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16001817) PayPal Update germany:
    -   Removed release funds.
    -   Added properties on `Balance` from PosAPI: `PayPalRestrictedBalance`, `PayPalCashoutableBalance`.
    -   Added `Balance` DSL provider with properties `AccountBalance`, `PayPalBalance`, `PayPalRestrictedBalance`, `PayPalCashoutableBalance`. Deprecated `User.AccountBalance`.
-   [B-332850](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15874448), [B-323159](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15552395) Added content messages to account menu (and non-responsive menu).
-   [B-323159](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15552395) Added `KycStatus.IsCommVerified` DSL (based on whether all items of http://qa1.api.bwin.com/V3/#authentication-comm-verification-status are `verified`).
-   Fixed: made rtms call to `subdomainmsgcontainercontent` endpoint backward compatible with Vanilla version 8.
-   Fixed Anti-forgery to return _403 Forbidden_ if client header `X-XSRF-TOKEN` is missing. Before it was failing with _500 InternalServerError_.
-   Fixed: set correct HTTP method on `messages` method in RtmsController.
-   [D-96243](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15990621) Fix last session info toastr showing twice when there are post login redirects.
-   Rename PostLoginValue PartnerSessionId to PARTNER_SESSION_UID

### Vanilla 9.2.3

2019-08-27

-   Changed breakpoint values to end in `.9` rather than `.99` which caused 2 exclusive breakpoints to be active at the same time.

### Vanilla 9.2.2

2019-08-12

-   Fixed: Deserialization of `Balance` from distributed cache fails hence it decreases performance.
-   Fixed: `/health/dsl` fails to show current values of DSL providers with `ExecutionMode` on .NET API.
-   Fixed: set correct HTTP method on `messages` method in RtmsController.

### Vanilla 9.2.1

2019-08-09

-   [B-336485](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16001817) PayPal Update germany:
    -   Removed release funds.
    -   Added properties on `Balance` from PosAPI: `PayPalRestrictedBalance`, `PayPalCashoutableBalance`.
    -   Added `Balance` DSL provider with properties `AccountBalance`, `PayPalBalance`, `PayPalRestrictedBalance`, `PayPalCashoutableBalance`. Deprecated `User.AccountBalance`.
-   [B-334863](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15942302) Added support for login with `danish NemId`.
-   Fixed: made rtms call to `subdomainmsgcontainercontent` endpoint backward compatible with Vanilla version 8.
-   Dramatically improved performance (memory and CPU) of DynaCon engine which is generating configuration proxies during app startup.

### Vanilla 9.2.0

2019-07-22

-   [B-327350](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15691875) Integrate `@rtms/client` package
    -   rtms client developed by RTMS team
    -   install it as a new dependency `yarn add --dev @rtms/client`
    -   `rxjs` updated to `^6.5.2`
-   [B-331393](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15819454) Introduced new flex layout breakpoints
    -   `mw` - "Medium wide", 1280px - 1600px
    -   `wd` - "Wide", 1600px - 1920px
    -   respective `lt-` and `gt-` for the two above
-   [B-331674](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15831081) Expose `indexChangedEvent` and `endReachedEvent` from carousel
-   [B-326281](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15654564) Do not allow to store postlogin wokflow with invalid cache key
-   [B-330080](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15779833) Added support for implementing custom [LanguageSwitcherUrlsProvider](http://docs.vanilla.intranet/mobile/api/vanilla/features/LanguageSwitcherUrlsProvider) that will be used to get urls for language switcher.
-   Fix tracking related client side exception on public pages.
-   Added new `PreBootstrapAsset` which adds a link-tag in the head to allow preloading and prefetching assets in `IBootstrapAssetsProvider`.
-   [B-331383](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15819294) Added _domain specific rules/actions_ also as known as user journey. Read more in [docs](http://docs.vanilla.intranet/domain-specific-actions.html).
-   Removed _QueryStringToCookie_ feature as far as it's replaced with _domain specific actions_.
-   Removed usages of `addEventListener` on media queries because iOS safari doesn't support them.
-   [D-95113](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15785123) Fixed showing back button in header when close button is clicked in balance breakdown.
-   Changed `IDslCompiler`: replaced method `IDslExpression<T> Compile<T>(expression, out warnings)` with more convenient `WithWarnings<IDslExpression<T>> Compile<T>(expression)`. Same for `IPlaceholderCompiler`.
-   [D-95417](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15847623) Reinitialize vn-carousel on location change.
-   [B-320777](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15465854) Added new setting `validatableChangesetsNetworkTimeout` to dynacon config section to optionally specify a timeout for requesting validatable changesets from dynacon, defaults to 10s.
-   Removed first octet from server IP address at `/health` page because of security.
-   Fixed console log issue when call to posapi endpoint `Wallet.svc/BankAccountInfo` fails.
-   Deprecated `ITrackerIdsConfiguration` because it's legacy desktop feature.
-   [B-333240](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15889663) Adapted `Comp points` UI in account menu.
-   [D-95808](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15898563) Fix ImageLink mapping on InboxOffer messages
-   Added login.component extensions for Coral integration: optional output `onRegisterClick`, optional input `responseGotoOptions`.
-   Renamed methods of `RouteBuilder`: `WithoutClaimsAuthentication()` -> `DisableAuthentication()`, `WithoutAuthenticationExpirationRenewal()` -> `DisableAuthenticationExpirationRenewal()`.
-   Added `IServiceClientsBaseConfiguration.AccessId` to be used especially by Sports Bet Content Distribution service.
-   [B-333413](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15895421) Display comp points message in account menu to users that are not VIP level users. VIP levels can be configured in [dynacon](https://admin.dynacon.prod.env.works/services/87143/features/129396/keys/138354/valuematrix?_matchAncestors=true).
-   Added `User.TrackerId` DSL provider and deprecated `User.HasTracker`.
-   [B-333531](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15901295) Provide option to specify which injector to use for `*vnDynamicComponent` and use the current one by default.
-   Updated to DynaCon service version `VanillaFramework:2`.
-   [B-329364](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15755936) Culture based DateTime format on inbox
-   Fix DOM position of bonus balance title
-   [B-331486](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15822111) Minor change on the Password validation hints
-   Optimized refresh of user values (balance, loyalty profile, claims...) on bootstrap to be executed only once during SPA load.
-   Fixed: Polling requests (chat, offers, inbox...) prolong the session.
-   Fixed typo `client-chached-scripts-{id}.js` to `client-cached-scripts-{id}.js`.

### Vanilla 9.1.0

2019-06-25

-   [D-94377](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15667703) Fixed bug in the euconsent cookie validity [INC314865].
-   `IContentEndpointConfigurator` was deprecated. Use `IOptions` infrastructure instead (you can implement `IConfigureOptions<ContentEndpointOptions>` to set the same options as before).
-   [B-325051](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15620358) You can now set custom `IClientContentService` implementation for `/content` endpoint (you can configure it same way as the above). see [docs](http://docs.vanilla.intranet/client-side-page-matrix.html) with links to examples.
-   [B-327966](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15702981) Added `loginAndGoto` menu action which logs in user before navigating to url.
-   Reworked DynaCon engine to use our own Roslyn proxy instead of CastleCore. This brings better performance on each access to a config - no reflection is executed.
-   Removed dependency to `Castle.Core`.
-   `IWebpackManifestResolver.GetFileNames` was deprecated. Use `GetFileName` instead. (this method is anyway hidden in `IBootstrapAssetsContext` and this api may be made internal in the next major version).
-   You can now specify `Media` (alias like `xs`, `gt-md`, etc. or a normal media query) on `StylesheetBootstrapAsset`. The stylesheet will then be loaded when the media query matches. This can be used in combination with `LazyLoad`.
-   [B-326229](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15652665) Added rendering of language switcher links on the page (that bots can read).
-   Fixed deadlock in `IWorkflowIdFilter`.
-   [B-327353](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15692046) Add some device capabilities to data layer tracking.
-   [B-326534](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15668126) Use `ToastrQueueService` to show last session info message after the login.
-   [B-326533](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15668105) Added a feature that shows logout message to user after he is logged out. [dynacon](https://admin.dynacon.prod.env.works/services/133255/features/135997/keys/135999/valuematrix).
-   Extended domain specific language (DSL):
    -   Operator `STRING` to convert a numerical value to a string e.g. `STRING User.AccountBalance`.
    -   Operator `NUMBER` to convert a string value to a number and fail if not according to valid format e.g. `NUMBER Claims.Get('workflow')`.
    -   Operator `TRIM` to remove leading and trailing white-spaces from a string.
    -   Arithmetic operators `+` (addition or string concatenation), `-` (subtraction), `*` (multiplication), `/` (division), `%` (modulo).
    -   Operator `OR` now can be used between:
        -   Strings - returns the operand which isn't empty.
        -   Numbers - returns the operand greater or equal to zero because negative values are considered undefined e.g. `User.DaysRegistered` for anonymous user.
    -   Added _actually parsed expression_ to expression tester at `/health/dsl`.
-   [B-315071](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15355061) Added device model property to data layer tracking.
-   Use strong eTag format for static file routes. see [Strong and weak validation](https://en.wikipedia.org/wiki/HTTP_ETag#Strong_and_weak_validation)
-   [D-94286](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15650282) Fix redirect loop when setting culture via querystring
-   [B-313493](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15313026) Added api call to check user authentication status when receiving native events IS_LOGGED_IN and APP_FOREGRND.
-   [B-328764](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15733769) Added `login-page` class to `html` when standalone login page is opened.
-   [B-328958](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15740382) Live person - Username available in event data when user is in workflow.
-   [B-328232](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15712613) Added parameter MAC to the fingerprint.
-   [B-329790](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15768354) Added possibility to implement custom data providers for `pageView` events. Check [vanilla](https://vie.git.bwinparty.com/vanilla/monorepo/tree/master/Source/Bwin.Vanilla.PluginHost/Client/vanilla/common/src/browser) for examples. The data providers can be asynchronous - vanilla ensures correct order of page view events. If data from a provider is not returned within the [configured timeout](https://admin.dynacon.prod.env.works/services/121971/features/123228/keys/136708/valuematrix?_matchAncestors=true), the page view will be tracked without the data from the timed out providers.
    -   In addition, you can use `PageViewDataService` in combination with `@ProvidesPageViewData()` decorator in a component to supply custom page view data
-   [B-296326](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14686035) 404 pages (NotFound route and when public page is not found) no track `page.name` `Errorpage - Not Found`
-   [B-328972](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15740731) Passed `InvokersProductId` in auto login filter when running in native context.
-   [B-328964](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15740516) Added route guard `ConfirmPasswordGuard`. Check [usage](https://vie.git.bwinparty.com/vanilla/testweb/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/module.routes.ts#L348) and [configuration](https://admin.dynacon.prod.env.works/services/133255/features/136389).
-   [B-285603](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14329287) Carousel as background to display content from sitecore.
-   [B-329479](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15760065) Replace `#BRAT_INCLUDED_COUNTRIES#` placeholder in templates with language formated countries names.
-   [B-327350](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15691875) Added additional profile information during RTMS connection.
-   Added `keys()` method to `LocalStoreService` and `SessionStoreService` ([#7](https://vie.git.bwinparty.com/vanilla/monorepo/issues/7))
-   Fixed: When session expires then polling for offers fails with _400 Bad Request_ instead of _401 Unauthorized_.
-   [B-307744](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15113842) Added bonus restricted product specific balances to balance breakdown.
-   [D-95265](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15821725) Only load specific elements from `App-v1.0/Header/Elements` for non-responsive to avoid loading content with client side conditions (non-responsive header elements are evaluated fully on server) which resulted in spamming logs.

### Vanilla 9.0.0

2019-05-24

With this release, Angular 7 is now ready to be used with Vanilla - please see [migration guide](http://docs.vanilla.intranet/mobile/guide/migration-guide-6-7). This brings `typescript 3` support and possibility to build the app with `ng cli`. We also updated all other `npm`/`nuget` packages and dropped deprecated code including some desktop only DSL providers.

-   Updated to Angular 7, TypeScript 3.2
-   Updated nuget packages:
    -   _System.IO.Abstractions_ 2.1.0.256 -> 4.2.13.
    -   _System.Data.SqlClient_ 4.5.1 -> 4.6.1
    -   _HtmlAgilityPack_ 1.8.10 -> 1.11.4
    -   \*Microsoft.Extensions.\*\* to 2.2.0
    -   _Newtonsoft.Json_ 11.0.2 -> 12.0.2
    -   _Autofac_ 4.8.1 -> 4.9.2
    -   \*Microsoft.AspNet.\*\* 5.2.6 -> 5.2.7
    -   \*Microsoft.Owin.\*\* 4.0.0 -> 4.0.1
    -   _Serilog_ 2.7.1 -> 2.8.0
-   Renamed client side packages to `@frontend/vanilla` instead of `@vanilla/core` and `@labelhost/core`. This results in more meaningful subpackage names (`@frontend/vanilla/core`, `@frontend/vanilla/common`, etc.).
-   Removed `log4net`. Only semantic logging with `ILogger<T>` is supported from now on.
-   Merged nuget packages `Bwin.Vanilla.PluginHost.Base` and `Bwin.Vanilla.PluginHost.Ng` into `Bwin.Vanilla.PluginHost`. Uninstall `.Ng` and `.Base` and then install `Bwin.Vanilla.PluginHost`.
-   `NameValueCollection` was changed to a new type `ContentParameters` for content list fields.
    -   In unit tests, you can use new `Dictionary<string, string> { ... }.AsContentParameters()`
-   Server side `MessageQueue` was deprecated.
-   Registering a layer with `ApplicationBlueprintService` outside bootstrap methods will now throw an error.
-   Renamed `UserService.balanceProperties.currency` to `UserService.balanceProperties.accountCurrency` to match the pos api object.
-   `BettingApiRestRequest` is now in `Bwin.Vanilla.ServiceClients.Infrastructure.BettingApiRestRequest`.
-   `Bwin.LabelHost.ServiceClients.Authentication.IPosApiAuthenticationService` is now in `Bwin.Vanilla.ServiceClients.Authentication.IPosApiAuthenticationService`.
-   `ILabelHostClientContentService` is removed but all features are there. Create your interface similar to [this](https://vie.git.bwinparty.com/vanilla/labelhost/blob/master/Bwin.LabelHost/ClientContent/ILabelHostClientContentService.cs) and [register it](https://vie.git.bwinparty.com/vanilla/labelhost/blob/master/Bwin.LabelHost/ClientContent/ClientContentModule.cs#L15). No need to add additional mappers except the ones originating from your solution.
-   Removed `Welcome Layer` feature as part of performance improvements. It was used only on 3 non-responsive labels and same functionality can be achieved by using `header content messages` and/or `last session info` features.
-   Removed obsolete code
    -   Client
        -   `AfterConfigLoadInit` and related functionality has been removed. Use `OnAppInit` instead.
    -   Server
        -   `LogoutController` was removed.
        -   `IAppPlatform` was removed. Inject `IEnumerable<AreaRegistration>` instead if you need them.
        -   Classes for support of sitecore code generation between vanilla 7 and 8 were removed.
        -   Old anti forgery related classes were removed.
        -   `IWebAuthenticationService` was made internal.
        -   `IClaimsService` was made internal.
        -   Old `Content<T>` creation methods and obsolete fields in the base class were removed.
        -   Legacy `ReCaptcha` verification API was removed.
        -   `HttpMessageHandler` is no longer being registered.
        -   `BuildManagerWrapper` was removed.
        -   Obsolete DSL `Route.*`, `User.FirstVisit`, `User.HasNewSession`, `User.IsPullChatAvailable`, `DisplayedInterceptors.Contains()`, `Journal.HasMessages`, `LicenseInfo.AcceptanceNeeded` was removed
        -   `ITreeItem` and related code was removed.
        -   `Bwin.Vanilla.DomainSpecificLanguage.Placeholders.IPlaceholderCompiler` and related code was removed
-   [D-94154](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15632235) Fix upload action text showing on inbox message for verified user
-   Fixed: `IPosApiCommonService.GetClientInformation()` intermittently returns invalid product.
-   Removed _Bwin.Vanilla.Rest.Mocking_ nuget package.
-   Removed _Host_ from `/site/version` and `ISiteVersionProvider` isn't public anymore.
-   Changed `RestRequest.Url` from `Uri` to `HttpUri` which was anyway already enforced.
-   Changed `IDocumentMetadata.ChildIds` from `IEnumerable<>` to `IReadOnlyList<>`.
-   Renamed `Bwin.Vanilla.Core.System.Strings` namespace to `Bwin.Vanilla.Core.System.Text` and also moved `StringExtensions` to it.
-   Replaced public API of `ILoginResultHandler` with the one that is needed by consumers. Therefore related types aren't public anymore: `ILoginService`, `LoginInfo`, `PostLoginRedirect`, `PostLoginRedirectOptions`, `ErrorHandler`, `ErrorHandlerParameter`, `WorkflowIdUrlWhitelist`, `LoginParameters`, `CommonLoginParameters`, `LoginParametersBase`, `OptionalUsernameLoginParameters`, `AutoLoginParameters`, `BankIdLoginParameters`, .
-   Made DSL providers async with `ExecutionMode` if appropriate.
-   [B-325784](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15640526) Added Face ID authentication to Fast login options.
-   `LoginClaimsProvider` is now async.
-   Moved performance counters to `Bwin.Vanilla.Core.Diagnostics.PerformanceCounters` namespace and made all Vanilla counter types internal.
-   Added `IHttpActionResult` extension method `WithTechnicalErrorMessage()` which simplifies sending technical error to the client.
-   Added `InlineStylesheetBootstrapAsset` that can be used in `BootstrapAssetsProvider` to inline a css asset.
-   Removed `IBaseTracking` template.
-   [B-323271](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15556302) Added `BrowserNotSupportedFilter`. Displays the browser not supported view instead of the requested page when the filter conditon on `App-v1.0/SupportedBrowsers/Info` yields true.
-   Properties in `HttpContext.Request.Browser` aren't filled from _DeviceAtlas_ anymore. Please use `IDeviceDslProvider` instead.
-   Moved from `Bwin.Vanilla.Mvc` to new package `Bwin.Vanilla.Features`: `IBootTask`.
-   [D-93956](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15589786) Fixed showing technical error when message count request failed.
-   [B-327829](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15697956) Fixed semantic logging wrong entry log.

### Vanilla 8.104.0

2020-05-20

-   [VANO-1702](https://jira.egalacoral.com/browse/VANO-1702) Fixed multiple chatupdate requests after navigation.

### Vanilla 8.103.0

2020-05-19

-   Fixed datepicker error on mobile mode.
-   Increased `maxRequestLength` in `template.web.config` from `8192` to `15360` to be aligned with our consumers e.g. Mobile Portal.
-   Added `suppressDefaultCloseBehaviour` input added to NavigationLayoutPageComponent to control when default close behaviour is triggred. Default value is false.

### Vanilla 8.102.0

2020-05-08

-   [B-365918](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17196125) DatePicker for date and date range selection.
    -   Install dependency package `@ng-bootstrap/ng-bootstrap: "~3.3.1"`.
-   [D-103436](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:17416279) `suppressDefaultBackBehaviour` input added to NavigationLayoutPageComponent to control when default back behaviour is triggred. Default value is false.

### Vanilla 8.101.0

2020-04-30

-   [B-369100](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17357961) Fixed [UrlToPageIdentifiers](https://admin.dynacon.prod.env.works/services/151381/features/118206/keys/120822/valuematrix?_matchAncestors=true) in chat DynaCon configuration so that it's possible to send page identifier to Genesys when starting a chat or determining its availability.

### Vanilla 8.100.0

2020-04-30

-   [VANO-1480](https://jira.egalacoral.com/browse/VANO-1480) Fixed account of unread messages in account badge.
-   [VANO-1669](https://jira.egalacoral.com/browse/VANO-1669) Added configuration for disabling vanilla avatar counter badge. Configuration is [here](https://admin.dynacon.prod.env.works/services/198200/features/103702).
-   Changed casino games event name from `LobbyLoaded` to `FooterLobbyLoaded` to prevent widget collision.

### Vanilla 8.99.0

2020-04-29

-   [D-103339](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:17391406) Adapted casino games widget to use `footerCategoryName` from `LobbyLoaded` instead of `displayName` to show category name.
-   Added tracking on `See All` link in casino games iframe.
-   [D-103338](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:17391364) Reload casino games iframe on post login.

### Vanilla 8.98.0

2020-04-22

-   Fix balance breakdown page menu action origin.

### Vanilla 8.97.0

2020-04-22

-   [B-368533](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17336175) Standalone balance breakdown page at route`/balancebreakdown`.

### Vanilla 8.96.0

2020-04-16

-   [VANO-1486](https://jira.egalacoral.com/browse/VANO-1486) Fix password label overlapping and value no set on autofill.

### Vanilla 8.95.0

2020-04-16

-   Whitelisted `sofStatus` and `playerPriority` claims.

### Vanilla 8.94.0

2020-04-15

-   Added ability to add class to `See All` link in casino games iframe through Sitecore.
-   [VANO-1550](https://jira.egalacoral.com/browse/VANO-1550) Add `RememberMeLogin` to Features enum, to be used in [Disabled Features](https://admin.dynacon.prod.env.works/services/121971/features/202312/keys/202314/valuematrix?_matchAncestors=true).

### Vanilla 8.93.0

2020-04-07

-   [VANO-1486](https://jira.egalacoral.com/browse/VANO-1486) Fix label overlap on ios Password manager autofill.
-   [VANO-1528](https://jira.egalacoral.com/browse/VANO-1528) Fixed incorrect error message is displayed when user login by fingerprint.
-   [B-345903](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16412576) Added ability to display casino games iframe in footer. Configuration is [here](https://admin.dynacon.prod.env.works/services/121971/features/203670).
-   Remember-me logging improvements.
-   [VANO-1544](https://jira.egalacoral.com/browse/VANO-1544) Fix unauth items on header moving to the left before disappearing on login.
-   Added legacy remember-me migration iframe for ladbrokes.

### Vanilla 8.92.0

2020-04-02

-   Move LivePerson code out of not-coral and backport deposit abandoned trigger logic.
-   Fix balance not getting updated immediately after accepting bonus from Overlay.
-   [VANO-1306](https://jira.egalacoral.com/browse/VANO-1306) Fix user remains logged in on one tab after logout on another.
-   Fix `isRegistrationLogin` logic to work with workflows.

### Vanilla 8.91.0

2020-03-25

-   Revert change on login dialog service to run inside Angular zone.
-   [VANO-1465](https://jira.egalacoral.com/browse/VANO-1465) Added `isRegistrationLogin` parameter on `LoginResponse`, sent to native along with POSTLOGIN parameters.
-   [VANO-1411](https://jira.egalacoral.com/browse/VANO-1411) On autologin when login dialog is opened don't redirect to the standalone login page, just add login entry message to login dialog backported.

### Vanilla 8.90.0

2020-03-23

-   Rework fix for bullet point shown on inbox messages for Coral.
-   [B-363804](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A17100707) Disable global features (`ChatUpdates`, `RtmsConnection`, `OffersCountPolling`, `InboxPolling`) based on DSL expression set on dynacon [Disabled Features](https://admin.dynacon.prod.env.works/services/121971/features/202312/keys/202314/valuematrix?_matchAncestors=true).
-   Change on login dialog service to force opening inside of Angular zone.
-   Fix autofill issue on ios native.

### Vanilla 8.89.0

2020-03-16

-   Backported fix to keep btag parameter in querystring and fix multiple redirects.
-   [VANO-1407](https://jira.egalacoral.com/browse/VANO-1407) Backported SiteRoot file resolver changes to allow directory paths.

### Vanilla 8.88.0

2020-02-27

-   [VANO-1306](https://jira.egalacoral.com/browse/VANO-1306) Refresh balance when focusing the app window, triggers redirect to login if the user is not authenticated anymore.
-   [VANO-1317](https://jira.egalacoral.com/browse/VANO-1317) Native Wrapper: Removed legacy call to `bwin://{username}/sso` after login. (This was originally added to support cocos apps on USNJ markets.)
-   [VANO-1144](https://jira.egalacoral.com/browse/VANO-1144) Remove claims authentication from rememberme delete route.

### Vanilla 8.87.0

2020-02-13

-   Fix bullet point shown on inbox messages for Coral.
-   [VANO-1211](https://jira.egalacoral.com/browse/VANO-1211) Fix account menu disappearing on page resize.
-   [VANO-1223](https://jira.egalacoral.com/browse/VANO-1223) `ProfilingService`: include deep clientscript assets, ensure success even when no assets are captured.

### Vanilla 8.86.0

2020-01-27

-   [B-355550](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16755236) Added configuration for setting badge css class. Configuration is [here](https://admin.dynacon.prod.env.works/services/158727/features/159289/keys/159291/valuematrix?_matchAncestors=true).
-   [BMA-50311](https://jira.egalacoral.com/browse/BMA-50311) Pass flag `rememberMe` to autologin for native wrapper.

### Vanilla 8.85.0

2020-01-22

-   [B-355332](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16784977) Backported left header section implementation to allow custom logo/back button for Ladbrokes.

### Vanilla 8.84.0

2020-01-10

-   [B-352513](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16646911) Extended balance DSL provider with all properties.
-   [B-341544](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16236317) Balance properties that are product-specific () are cached per product in distributed cached. As a consumer you always receive complete balance object for your product.

### Vanilla 8.83.0

2020-01-08

-   [B-353860](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16693524) Added configurable update interval for `offers`. Configuration is [here](https://admin.dynacon.prod.env.works/services/151381/features/127162/keys/158353/valuematrix?_matchAncestors=true).

### Vanilla 8.82.0

2019-12-19

-   [BMA-49624](https://jira.egalacoral.com/browse/BMA-49624) Trigger registration button handller on `LoginComponent` on `mousedown` to mitigate timing issue.

### Vanilla 8.81.0

2019-12-17

-   [BMA-49624](https://jira.egalacoral.com/browse/BMA-49624) Add configuration for register-button action on `LoginComponent`. The button fires the native event `openRegistrationScreen` if the dynacon key `LabelHost.LoginSettings` -> `UseOpenRegistrationEvent` is `true`, otherwise it navigates to the registration page.

### Vanilla 8.80.0

2019-12-16

-   Fixed show post-acceptance description and manual terms and conditions on overlay.
-   Fixed `QuickDepositResponsiveComponent` shall not remove `cdk-global-scrollblock` if already present when opening.
-   Add client side tracing for RTMS (is automatically enabled with `/health/log` tracing, or in [dynacon](https://admin.dynacon.prod.env.works/services/116238/features/105612/keys/157299/valuematrix?_matchAncestors=true) separately).

### Vanilla 8.79.0

2019-12-04

-   [VANO-1022](https://jira.egalacoral.com/browse/VANO-1022) Fix: `IPosApiCommonService.GetClientInformation()` intermittently returns invalid product.

### Vanilla 8.78.0

2019-12-04

-   [VANO-1016](https://jira.egalacoral.com/browse/VANO-1016) Add/remove class `qd-open` on html tag on opening or closing `QuickDepositResponsiveComponent` in order to support styling.

### Vanilla 8.77.0

2019-11-29

-   [B-351041](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16590498) Render Manual T&Cs in inbox messages.
-   Removing remember-me cookies if remember-me login fails. Reason is to avoid repeated failure which is more likely than success on the retry.

### Vanilla 8.76.0

2019-11-28

-   Deposit prompt should no longer be hidden by navigation right after login

### Vanilla 8.75.0

2019-11-27

-   Fix remember me not clickable when connect card input focused and with less than 16 digits.

### Vanilla 8.74.0

2019-11-27

-   Remove isNative filter from ios keyboard dismissal fix.

### Vanilla 8.73.0

2019-11-27

-   Skip autofill fix for ios when native app in connect card option.

### Vanilla 8.72.0

2019-11-26

-   Implemented prevention of concurrent remember-me logins if multiple requests fail with 401 unauthorized within a short period.

### Vanilla 8.71.0

2019-11-26

-   Fix corner-case on layout issue in login page after keyboard dismissal on ios App.

### Vanilla 8.70.0

2019-11-26

-   Fix layout issue on login page after keyboard dismissal on ios App. VANO-941 / VANO-989 / VANO-977

### Vanilla 8.69.0

2019-11-26

-   [VANO-956](https://jira.egalacoral.com/browse/VANO-956) Fixed Quick deposit screen is not visible when page is scrolled.
-   [VANO-941](https://jira.egalacoral.com/browse/VANO-941) Fix layout issue on login page after keyboard dismissal on ios App.

### Vanilla 8.68.0

2019-11-25

-   [VANO-855](https://jira.egalacoral.com/browse/VANO-855) Fixed VIP page issue when clicking on image reloads the page.

### Vanilla 8.67.0

2019-11-22

-   [VANO-920](https://jira.egalacoral.com/browse/VANO-920) Removed logging to console when `Live Person` is not enabled.

### Vanilla 8.66.0

2019-11-21

-   [VANO-812](https://jira.egalacoral.com/browse/VANO-812) Updated lazy load tag managers e.g GTM.
    -   The behavior can be activated on Dynacon using `VanillaFramework.Web.Tracking` -> `UseClientInjection`.
    -   Tag manager init scripts can be excluded by their tag manager renderer name from being injected on Dynacon using `VanillaFramework.Web.Tracking` -> `ClientInjectionExcludes`.
    -   Init scripts can be added manually using the `TagManagerService.load(rendererName: string)`.

### Vanilla 8.65.0

2019-11-21

-   [VANO-898](https://jira.egalacoral.com/browse/VANO-898) Subscribed to RTMS inbox count only after user is authenticated. Solves Bad Performance on wrappers jira ticket.
-   [VANO-729](https://jira.egalacoral.com/browse/VANO-729) Added `IRefreshBalanceFilter` to refresh cached balance for authenticated user in cases when url referrer is not known or it is configured in [dynacon](https://admin.dynacon.prod.env.works/services/151286/features/122022/keys/154929/valuematrix?_matchAncestors=true).
-   [VANO-812](https://jira.egalacoral.com/browse/VANO-812) Lazy load tag managers e.g GTM.
    -   The behavior can be activated on Dynacon using `VanillaFramework.Web.Tracking` -> `UseClientInjection`.

### Vanilla 8.64.0

2019-11-15

-   [VANO-864](https://jira.egalacoral.com/browse/VANO-864) Fixed validation of _Referer_ header on `client-bootstrap-scripts.js`.
-   [VANO-844](https://jira.egalacoral.com/browse/VANO-844) Fixed: White screen post login on load-sports.coral.co.uk

### Vanilla 8.63.0

2019-11-14

-   Expose `RememberMeStatusService` to check for the existence of remember-me tokens (BMA-48986).

### Vanilla 8.62.0

2019-11-14

-   Block scrolling for all breakpoints on `QuickDepositResponsiveComponent`.
-   [B-348519](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16498412) Backported DeviceAtlas internal changes which should fixed related issues of `Device` DSL provider.
-   Also added DeviceAtlas health check.
-   [B-348562](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16499731) Extended _Origin_ header validation: if missing then we fallback to _Referer_ validation.
-   [B-348765](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16505637) Requests to `client-bootstrap-scripts.js` validate _Referer_ header to correpond to this the app to protect against anti-forgery attacks.
-   Change `AuthController.Check()` (server side) and `AuthService.isAuthenticated()` (client side) to return `true` if the user is authenticated or in a workflow. (VANO-732)
-   [D-99103](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16515028) Fixed: NotFound sign-up bonus not cached which causes more traffic on PosAPI and consumes more resources of the web server.

### Vanilla 8.61.0

2019-11-07

-   Fixed visibility (to hidden) of legacy remember-me iframe on _coral.co.uk_ and changed iframe URL to be without `nonce`.
-   [D-98909](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16486220) On clicking balance on header of a play money user it is redirecting to Cashier page instead of deposit page.

### Vanilla 8.60.0

2019-11-07

-   Ensure that deposit prompt is not shown twice in a row after login.
-   Show quick deposit header on ipad Pro. Needs additional theme update (VANO-730).
-   Send open login dialog option on gotoLogin menu action (VANO-804, VANO-823).

### Vanilla 8.59.0

2019-11-06

-   [B-347231](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16454335) Added support to login by legacy remember-me token on _coral.co.uk_ - it's migrated to regular remember-me token.
-   Fixed issue with `parent.sendToNative` when site is running inside `iframe`. Transmitted event data with `parent.postMessage` instead. `Origin` parameter is configurable [here](https://admin.dynacon.prod.env.works/services/151381/features/88113/keys/153890/valuematrix?_matchAncestors=true). [VANO-737]
-   Applied temporary fix for diagnostic health pages built using Angular.
-   Fix missing header/footer when redirecting from portal plugin to host app (VANO-688).

### Vanilla 8.58.0

2019-10-31

-   [D-98460](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16413399) Allow to open account menu route on native backported.
-   Fixed: Open `Quick deposit` from rtms overlay without opening cashier page. Cashier link in sitecore item must have `btn-cashier` class. Backported. [INC323047, INC323052]
-   [B-345847](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16410376) Allow custom tracking for login entry messages load. Parameters can be configured on sitecore items with `tracking.LoadedEvent` keys.
-   Added `Origin` validation for POST/PUT/DELETE requests - it must be within current label. This helps to protect remember-me login.
-   Skip autofill fix for ios when native app (VANO-645)
-   [D-98642](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16446532) Fixed bug in the euconsent cookie validity.
-   [D-98427](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16405034) Added ability to track click on header menu items.
-   Fix missing call to remove `cdk-block-scrolling` from html tag in responsive quickdeposit iframe (VANO-522).
-   Add css-class `chat-open` to html tag when chat is open. Needs additional theme changes. (VANO-662).

### Vanilla 8.57.0

2019-10-24

-   [D-97924](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16324526) Fix post login redirect for native apps.
-   [B-336849](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16017691) Add PlayerPriority for chat bot to VanillaClientUserValuesProvider. (VANO-628)
-   Upgraded peer dependency for `genesys-web-chat` to v1.7.1. (VANO-628)

### Vanilla 8.56.0

2019-10-23

-   BREAKING CHANGE: Moved `NavigationLayoutModule`, `NavigationItem`, `NavigationLayoutPageComponent`, `NavigationLayoutService`, `NavigationLayoutTopMenuComponent` from `@labelhost/core/not-coral` to `@labelhost/core/features`. Please adapt your imports accordingly.
-   Allow to override the value of the viewport meta tag for coral. Use `VanillaFramework.Web.UI -> Viewport`. (VANO-580)
-   Change initial height of responsive quickdeposit iframe, needs additional theme update. (VANO-522)
-   [D-97994](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16346129) Open `Quick deposit` from inbox item without opening cashier page. Cashier link in sitecore item must have `btn-cashier` class. Backported. (VANO-532)

### Vanilla 8.55.0

2019-10-18

-   Value of `KycStatus.IsCommVerified` will return positive if any of communication channels is verified.
-   Native event `messageToNative` will try to send event on `parent` object.

### Vanilla 8.54.0

2019-10-18

-   Fixed issue with `KycStatusDslProvider`.
-   [B-344280](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16351787) Support caching of CORS pre-flight requests. Set a TimeSpan on `VanillaFramework.Web.StaticFiles` -> `CorsPreflightMaxAge` e.g. 00:10:00.
-   Fix missing header on skipping same workflow on sequential logins (VANO-450)
-   Subscribe to `RCPU_ACTION_ACK` rtms notifications even though LabelHost.LoginDuration is not enabled in [dynacon](https://admin.dynacon.prod.env.works/services/151381/features/119990/keys/119992/valuematrix?_matchAncestors=true).

### Vanilla 8.53.0

2019-10-15

-   Exposed `KycStatusService.refresh()` that should be used whenever user's kyc status changes.
-   If it is defined use offer id from inbox or rtms cta button to opt-in to campaign backported.

### Vanilla 8.52.0

2019-10-10

-   [B-338694](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16101575) Trigger RCPU popup (login duration overlay) with RTMS message backported.
-   [B-342684](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16286117) Changed Danskespil header expanded menu content to load html from single sitecore item `MoreGames`.
-   [B-343444](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15874440) Update number of new messages in account menu with RTMS notification backported.

### Vanilla 8.51.0

2019-09-26

-   [B-339339](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16127289) Use dynamic components for Left Items on Danskespil dropdown menu.
-   [B-342562](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16281546) Danskespil.dk: V6 Login Styles.
-   [B-311705](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15255060) Added link around Coral cashback image.
-   [B-341359](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16227580) Fix for VANO-345: Allow remember me login/logout only on same top domain.

### Vanilla 8.50.0

2019-09-24

-   [D-97312](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16189688) Use `vn-menu-item` for logout component (adds tracking from sitecore feature).
-   [D-97708](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16272885) Use `vn-menu-item` for cta component (adds tracking from sitecore feature).
-   [D-96818](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16106208) Fix blank slide displayed on slide change in loop
-   [B-339339](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16127289) Support PcImage on products for Danskespil dropdown menu.
-   [B-342361](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16271638) Use `vnDynamicHtml` to render message queue (directives like `data-tracking`, `menu-action` and `plain-link`) can now be used.
-   Add `AccountUpgradeGuard` to cashier routes.

### Vanilla 8.49.0

2019-09-19

-   [B-339930](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16159104) Added `LivePersonEventName.RegistrationAbandoned`.
-   [B-341393](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16228747) Added method `finalizeWithoutRedirect` to `WorkflowService` to allow custom redirects after finalize workflow call.

### Vanilla 8.48.0

2019-09-18

-   [B-339153](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16118242) Added `danskespil.dk` login integration.
-   [B-340518](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16191825) Added `danskespil.dk` logout integration.
-   [B-341393](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16228747) Added method `finalizeWithoutRedirect` to `WorkflowService` to allow custom redirects after finalize workflow call.
-   [B-339339](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16127289) Add Danskespil additional header with dropdown menu.

### Vanilla 8.47.0

2019-09-17

-   [B-340388](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:16185366) Add support for custom placeholders in toastr queue toasts. See [docs](http://docs.vanilla.intranet/articles/features/toastr-queue.html)
-   [D-97325](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16196360) Fixed `log` api call will no longer prolong session timeout.
-   [B-339205](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16121555) Refined `LastKnownProduct` feature by adding `Enabled` DSL in dynacon.
-   [B-341029](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16213852) Added `CashierOptions.queryParameters` for passing query parameters to cashier.

### Vanilla 8.46.0

2019-09-11

-   [B-340019](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16164352) Added `autologin` filter for scenarios where autologin with username and password is required.
-   Trigger `UserLoggingInEvent` on Autologin.
-   [D-96957](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16131485) Implement default back action on HeaderBarService.
-   [D-97302](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16186986) Fixed mobile specific Game Icons are not shown on BCM overlay and BalanceBreakdown backported.
-   Add missing KYC DSL provider client side properties from `master`.
-   [D-97087](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16153203) Fix an issue that could cause evaluation DSL expression to use stale cached expression results (especially during login).
-   Do not trigger client side DSL cache invalidation on page load (when cache is empty).
-   [D-96926](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16127883) Add support for `hideOnNavigation` and `hideOnScroll` parameters for toastr queue toasts.
-   [D-97270](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16182697) Fix header not visible after closing workflow by forcing page reload on logout through header-bar close icon.

### Vanilla 8.45.0

2019-09-05

-   [B-320045](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15442486) Added web tracking for tabbed login backported.
-   [B-339205](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16121555) Exposed `LastKnownProductService.add` method.
-   [B-339563](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16139524) Affiliates: Map incoming urls with a btag-querystring to a trackerId (aka wmid).
-   [D-97034](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16145637) Fixed call PosAPI endpoint `Loyalty/Cashback/V2` with default product id set as `CASINO` backported.
-   Isolated `vn-iframe` message events subscription only to events with same `origin`.
-   [D-96788](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16095524) Fixed open link in a new tab when `Ctrl Key + Left Mouse click` shortcut is used backported.
-   Added new event (`UserLoginFailedEvent`) on UserService for login failed.

### Vanilla 8.44.0

2019-08-30

-   [D-96775](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16092951) Append referrer to AccountUpgradeGuard navigation, to be used as return url.
-   Reverts [B-336485](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16001817) that removes Paypal release funds code
    -   Added release funds dynacon toggle [PaypalReleaseFundsEnabled](https://admin.dynacon.prod.env.works/services/121971/features/123468/keys/146635/valuematrix?_matchAncestors=true)

### Vanilla 8.43.0

2019-08-26

-   [B-338346](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16080088) Raised GTM Event `Event.Balance_Refresh` on Balance Refresh.
-   [B-322842](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15539421) Added deposit prompt feature.
    -   New DSL - `Balance.IsLow()`, `Balance.Format()` (client side only)
    -   Menu actions can be invoked from dynamic content (sitecore) by placing `menu-action="action"` attribute on any element
-   [D-96548](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16054714) adding class d-flex to radio-tabs component on login since outdated flexbox class was removed from v6 themes
-   [D-96242](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15990576) Adapted vnAuthstate directive to consider as authenticated also when workflowType is negative (happends when overriden by postLoginRedirect rule).

### Vanilla 8.42.0

2019-08-23

-   [D-96617](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16064857) Include check of isTouchIdEnabled or isFaceIdEnabled from loginParameters on loginFailed to display error message
-   Regenerated Sitecore templates.
-   Added `http://api.bwin.com/v3/user/registrationCompleted` claim.

### Vanilla 8.41.0

2019-08-22

-   [B-333575](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15902454) Improve lh-date and validation messages components to fix styling.
    -   `showSuccessValidation` input added to `FormFieldComponent` and `showOnSuccess` to `ValidationMessagesComponent` to control when to show validation message container for success.
-   [D-96260](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15992545) Fixed set an initial delay on offers timer to fix race condition on remember-me login backported.
-   Allow `LabelHost.RememberMe` to be enabled on native wrappers.

### Vanilla 8.40.0

2019-08-20

-   [D-96594](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16061838) Fixed optin in rtms overlay to `promos` and 'eds` offers [INC321837].
-   [B-329364](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15755936) Culture based DateTime format on inbox. Backported from 9.2.0
-   [D-96617](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16064857) Add `loginMessageKey` parameter to be used to show messages on login page when calling `NavigationService.goToLogin({loginMessageKey: 'AutologinError'})`. The key is the sitecore item name within `LoginMessages`
-   [D-96400](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16019818) Changed `messages` slot to `multi` slot.
-   [D-96616](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A16064795) Support showing account menu for authenticated users when directly navigating to `/{culture}/menu`.

### Vanilla 8.39.0

2019-08-14

-   [D-96403](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:16020976) Fix inbox messages delete causing full page refresh.
-   [B-335611](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15970553) `PartnerSessionId`:
    -   Add schema on client native route.
    -   Rename PostLoginValue PartnerSessionId to PartnerSessionUid
-   Changed `IEnvironmentProvider.IsSingleDomainApp` to be based on `appSettings/vanilla:SingleDomainApp` from `web.config` also for single-tenant mode.

### Vanilla 8.38.0

2019-08-12

-   Fixed: Deserialization of `Balance` from distributed cache fails hence it decreases performance.
-   [D-96243](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15990621) Fix last session info toastr showing twice when there are post login redirects.

### Vanilla 8.37.0

2019-08-09

-   `NemId`- `PID` pairing dialog - send `password` to login.
-   [B-335611](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15970553) Added sending `PartnerSessionId` to native apps. For `bwin://` native schema added [config](https://admin.dynacon.prod.env.works/services/133255/features/88113/keys/143444/valuematrix?_matchAncestors=true) to enable/disable this behaviour.
-   [B-336485](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16001817) PayPal Update germany:
    -   Removed release funds.
    -   Added properties on `Balance` from PosAPI: `PayPalRestrictedBalance`, `PayPalCashoutableBalance`.
    -   Added `Balance` DSL provider with properties `AccountBalance`, `PayPalBalance`, `PayPalRestrictedBalance`, `PayPalCashoutableBalance`. Deprecated `User.AccountBalance`.
    -   Added `Balance.PayPalBalance` and `Balance.AccountBalance` DSL providers. Deprecated `User.AccountBalance`.
-   [B-332850](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15874448), [B-323159](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15552395) Added content messages to account menu (and non-responsive menu).
-   [B-323159](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15552395) Added `KycStatus.IsCommVerified` DSL (based on whether all items of http://qa1.api.bwin.com/V3/#authentication-comm-verification-status are `verified`).
-   Added scope `inboxgetmessagescount` to the messages returned from `inbox/getcount` api call.

### Vanilla 8.36.0

2019-08-06

-   Ported `NemId` feature from version 9.

### Vanilla 8.35.0

2019-08-05

-   Ported `NemId` feature from version 9.
-   Added `cocoscasinow` to the list of legacy native routes. This will not be supported in version 9.

### Vanilla 8.34.0

2019-08-02

-   Regenerated sitecore templates.
-   Reinitialize vn-carousel on carousel items change
-   [D-96194](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15979230) Support multi product bonuses on bonus balance breakdown.

### Vanilla 8.33.0

2019-07-30

-   Upgraded peer dependency for `genesys-web-chat` to v1.6.7.
-   [B-310305](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15203002) Add addional information to improve routing for `genesys-we-chat`:
    -   Add user's TierCode when starting a chat.
    -   Allow to optional pass identifier `triggerPoint`, either programmatically via `ChatClientService.open(options?: { triggerPoint: string })` or via input `chatStartOptions` on `ChatButtonComponent`.
-   [B-334494](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15927047) Changed native event name to `bwin://mobilelogin/login`. This is a temporary workaround for cocos apps.

### Vanilla 8.32.0

2019-07-26

-   [D-96021](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3a15943806) Fix missing DSL evaluated content on Toastr.
-   [B-334859](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15942267) Added login filter to login via querystring `username` and `temptoken`. Optionally, the querystring `clientPlatform` can be passed which will be mapped to a channelId using the mapping configured under `VanillaFramework.Web.Authentication.ClientPlatformToChannel`. NOTE: For VAN 9.x this will ONLY be available in versions equal or higher than version 9.3.0.
-   [B-334867](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15942395) Added tracking parameters to toastr messages. You can put `tracking.LoadedEvent` and `tracking.ClosedEvent` (in sitecore) to specify the name of an event to track when taostr is shown to the user and/or closed. Added ability to swipe toastr to right backported. NOTE: For VAN 9.x this will ONLY be available in versions equal or higher than version 9.3.0.
-   Updated npm packaged - `ngx-toastr` _9.1.1_ -> _10.0.2_
-   [B-334494](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15927047) Introduce [SendNativeLoginSchema](https://admin.dynacon.prod.env.works/services/133255/features/88113/keys/140733/valuematrix?_matchAncestors=true) to send native event `bwin://noSso/mobilelogin/login` instead opening login dialog. This is a temporary workaround for cocos apps.

### Vanilla 8.31.0

2019-07-23

-   Backport vn-carousel changes (missing navigation on location change, events exposed).

### Vanilla 8.30.0

2019-07-19

-   Fix DOM position of bonus balance title
-   Fix VIP level display in COMP POINTS.
-   [B-334494](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15927047) Added back old sending native event with schema `bwin://{username}/{ssoToken}` just with compatibility with old apps. This will not be included in vanilla version 9 and above, native apps should switch implementation to `ccb` events. (Use `POST_LOGIN` ccb event, it contains all info needed).

### Vanilla 8.29.0

2019-07-17

-   Export `HomePageComponent` and `HomePageModule`.

### Vanilla 8.28.0

2019-07-16

-   [B-333413](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15895421) Display comp points message in account menu to users that are not VIP level users backported. VIP levels can be configured in [dynacon](https://admin.dynacon.prod.env.works/services/87143/features/129396/keys/138354/valuematrix?_matchAncestors=true).
-   Added missing bonus balance endpoint (forgotten during backport!)
-   [B-333531](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15901295) Provide option to specify which injector to use for `*vnDynamicComponent` and use the current one by default.

### Vanilla 8.27.0

2019-07-12

-   [B-333240](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15889663) Adapted `Comp points` UI in account menu backported.
-   [D-95808](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15898563) Fix ImageLink mapping on InboxOffer messages.
-   [B-333383](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15894419) Added `RouteBuilder.RenewAuthenticationExpirationEachRequest()` to enforce authentication expiration on each request to particular route.

### Vanilla 8.26.0

2019-07-09

-   Added login.component extensions for Coral integration. NOTE: For VAN 9.x this will ONLY be available in versions equal or higher than version 9.2.0. (It is NOT included in versions 9.0.0 and 9.1.0.)

### Vanilla 8.25.0

2019-07-02

-   Added new `PreBootstrapAsset` which adds a `link` tag in the head to allow preloading and prefetching assets in `IBootstrapAssetsProvider`. NOTE: For VAN 9.x this will ONLY be available in versions equal or higher than version 9.2.0. (It is NOT included in versions 9.0.0 and 9.1.0.)
-   Restore lh-marquee for content on lh-header-bar markup in non-responsive

### Vanilla 8.24.0

2019-06-27

-   [D-95265](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15821725) Only load specific elements from `App-v1.0/Header/Elements` for non-responsive to avoid loading content with client side conditions (non-responsive header elements are evaluated fully on server) which resulted in spamming logs.
-   Fix PcMenuItemComponent missing on module EntryComponents declaration
-   [B-326281](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15654564) Do not allow to store postlogin wokflow with invalid cache key. NOTE: For VAN 9.x this will ONLY be available in versions equal or higher than version 9.2.0. (It is NOT included in versions 9.0.0 and 9.1.0.)

### Vanilla 8.23.0

2019-06-19

-   [B-329754](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15766812) IsRobot DSL backported.
-   [B-329479](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15760065) Replace `#BRAT_INCLUDED_COUNTRIES#` placeholder in templates with language formated countries names backported.
-   [B-328964](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15740516) Added route guard `ConfirmPasswordGuard`. Check [usage](https://vie.git.bwinparty.com/vanilla/testweb/blob/master/Bwin.Vanilla.TestWeb.Host/Client/testweb/src/module.routes.ts#L348) and [configuration](https://admin.dynacon.prod.env.works/services/117804/features/136389) backported.
-   Fixed: When session expires then polling for offers fails with _400 Bad Request_ instead of _401 Unauthorized_.
-   [B-328764](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15733769) Added `login-page` class to `html` when standalone login page is opened.
-   Removed `prerenderCrawler` query string for _Prerender.io_ because `User-Agent` header will be used for the detection instead.
-   Added _Rendered_ time to the end of HTM documentL. Useful for example to diagnose _Prerender.io_.

### Vanilla 8.22.0

2019-06-13

-   [B-326534](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15668126) Use `ToastrQueueService` to show last session info message after the login.
-   [B-326533](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15668105) Added a feature that shows logout message to user after he is logged out [dynacon](https://admin.dynacon.prod.env.works/services/117804/features/135997/keys/135999/valuematrix).
-   Use strong eTag format for static file routes. see [Strong and weak validation](https://en.wikipedia.org/wiki/HTTP_ETag#Strong_and_weak_validation).
-   [B-329796](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15768642) Reduced bundle size for Coral.

### Vanilla 8.21.0

2019-06-04

-   Fixed deadlock in `IWorkflowIdFilter` introduced in LabelHost version 8.17.0.

### Vanilla 8.20.0

2019-05-31

-   Downgrade ngx-popper in order to fix hide on scroll issue.

### Vanilla 8.19.0

2019-05-29

-   [B-323271](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15556302) Added `BrowserNotSupportedFilter`. Displays the browser not supported view instead of the requested page when the filter conditon on `App-v1.0/SupportedBrowsers/Info` yields true.
-   [B-325784](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15640526) Added Face ID authentication to Fast login options.
-   You can now specify `Media` (alias like `xs`, `gt-md`, etc. or a normal media query) on `StylesheetBootstrapAsset`. The stylesheet will then be loaded when the media query matches. This can be used in combination with `LazyLoad`.
-   [B-326229](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15652665) Added rendering of language switcher links on the page (that bots can read).
-   [B-328223](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15712027) Comeback request from _Prerender.io_ service gets appended query string parameter `prerenderCrawler` equal to _User-Agent_ header of initial crawler.

### Vanilla 8.18.0

2019-05-17

-   Fixed: Merging of JSON configuration from DynaCon doesn't overwrite a value with a `null` with higher priority e.g. `{ Value: "abc", Source: "default" }` for _any_ context merged with `{ Value: null, Source: "sports" }` for _product = sports_ results to `{ Value: "abc", Source: "sports" }`.
-   Added [ng-lazyload-image](https://github.com/tjoskar/ng-lazyload-image) library as a dependency.
-   Images used in `MenuItem` will now be loaded lazily when scrolled into view. If targeting Safari and/or IE, you need to additionally include this polyfill: https://github.com/w3c/IntersectionObserver/tree/master/polyfill.
-   Fixed: Preview date passed to Sitecore as sc_date parameter doesn't support time after 12:59:59 of a day.
-   Added `InlineStylesheetBootstrapAsset` that can be used in `BootstrapAssetsProvider` to inline a css asset.

### Vanilla 8.17.0

2019-05-10

-   Updated to .NET 4.7.2. Follow regular [.NET migration guide](https://docs.microsoft.com/en-us/dotnet/framework/migration-guide/).
-   Updated _Microsoft.Net.Compilers_ 2.10.0 -> 3.0.0.
-   [B-321353](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15489415) Added a check for public page version. If there is no language version on the root of public page in sitecore, then it will return 404. This behavior can be toggled in [dynacon](https://admin.dynacon.prod.env.works/services/121971/features/132679/keys/132681/valuematrix?_matchAncestors=true).
-   Handle case when sitecore returns empty document ids in `DocumentIdCollection`. These are now ignored instead of throwing an exception and marking content as invalid.
-   Removed `Glimpse`.
-   Login Entry Messages: Always clear before adding new ones
-   [B-319928](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15437683) In order to support lower case normalization of URLs you can register `LowerCaseUrlSerializer` in your `AppModule`'s providers:
    ```
    providers: [
        ...
        { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
        ...
    ]
    ```
-   [D-94088](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15620389) Fixed: Prevent rendering CTA button in inbox message if inbox message has no `detailCallToAction` defined.
-   [D-93076](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15406999) Fixed: Hide inbox close button in native apps.
-   Fixed: Device properties are incorrectly resolved for some devices. This is intermittent and was contributed to DeviceAtlas in the past. Now we found out it was because of ASP.NET cache is trimming user-agent used as a cache key.
-   Fixed: `PendingActions.HasActionWithReactionNeeded` DSL failed to evaluate.

### Vanilla 8.16.0

2019-05-06

-   Added `versionLogging` web.config section which is used when writing version metadata to a file. This leverages existing shipping logic of semantic logs to log vanilla and plugin versions used. Check `<versionLogging>` web.config section and update it for all configuration overrides in your solution(s).
-   [B-324199](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15590303) Implemented tracing for easier diagnostics. See more details at `/health/log` page of your app or at [Vanilla TestWeb](http://testweb.vanilla.intranet/health/log).
-   Fix return url sent to cashier on kyc redirect to be product home page.

### Vanilla 8.15.0

2019-05-02

-   `RegulatoryInfo.IsUkUser` dsl provider is deprecated. Use `Claims.Get('isUkGcPlayer') = 'true'` instead.
-   [B-322401](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15525322) Open chat via query string parameter `chat=open`
-   Fix carousel undefined slide while adding/removing slides after login
-   Fixed issue on startup with `lhAccountUpgrade` async client config which used sync way to fetch sitecore content.
-   Added _VanillaFramework.Web.ClientIP_ -> _IsInternalRequestOverride_ as second level of security if standard algorithm is broken.

### Vanilla 8.14.0

2019-04-30

-   [D-93583](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15506834) Fixed flickering issue on desktop view when opening `labelhost/navigation/*` route.
-   Fix user not able to select tabs on login
-   SiteRootFiles are now always loaded from `App-v1.0/SiteRootFiles/{product}` and fall back (if item is not found) to `App-v1.0/SiteRootFiles`. This should reduce some redundancy where the same files need to be copied to all products. Furthermore `App-v1.0/SiteRootFiles/{product}` is now deprecated and will be removed in the next major version. Only root folder with conditions/proxy items should be used.
    -   Dynacon key [VanillaFramework.Features.SiteRoot.RootFilesContentFolder](https://admin.dynacon.prod.env.works/services/121971/features/122467/keys/122471/valuematrix?_matchAncestors=true) is now deprecated and not used anymore.
-   [B-324190](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15589920) Favicon related meta tags are now rendered from [App-v1.0/WebAppMetadata/MetaTags](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={445B5EB7-A4DB-417E-9297-F5B2A0933FDC}&la=) instead of `HtmlHeadTags`.
-   [B-321327](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15488173) Added DSL `PostLoginValues.ShowMcUpgrade`.
-   [B-323979](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15581357) Added route guard `AccountUpgradeGuard`. Check [usage](https://vie.git.bwinparty.com/vanilla/TestWeb.M2/blob/master/source/Bwin.Vanilla-M2.TestWeb.Host/Client/testweb/src/module.routes.ts#L338) and [configuration](https://admin.dynacon.prod.env.works/services/117804/features/132633).
-   [B-323503](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15565258) Added data layer name `{ page.responsive: true/false }` based on whether responsive features are enabled or not.
-   [B-322498](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15529024) Header avatar and balance sections now support `class` parameter.
-   Fix kyc redirection after login when user in workflow

### Vanilla 8.13.0

2019-04-25

-   [B-322376](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15524956) Added new CssOverrides infrastructure that should be used in the future instead of `HtmlHeadTags` for css hotfixes. These are in sitecore (`App-v1.0/CssOverrides`) and are you can read more [here](http://docs.vanilla.intranet/css-overrides.html).
-   Fixed Inbox is not showing up when message is missing templateId property [INC313541].
-   B-322922](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15543338) Refactor RTMS handling for GBR KYC verified and implemented post login redirect action handler.

### Vanilla 8.12.0

2019-04-25

-   [D-93081](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15408863) Evaluate `User.AffiliateInfo` DSL filter on client side.
-   Fixed: Semantic log entries like `path`, `username` etc. can collide with ones added by enricher.
-   [D-93472](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15485047) Change Coral connect card empty credentials message validation
-   Fixed: custom error page fails when owin context not available.
-   [D-93746](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15551999) Removed converting of `PostLoginValues` to integer, they will be left the same as platform sends them.
-   Fix welcome message cta with no action [INC313246]
-   Changed IP resolution: if there is no public IP in `X-Forwarded-For` header or the value is gibberish then returning last internal IP from the header even though it's within company network as it is the only one present.
-   Logging of unhandled exceptions in WebAPI.
-   Added `touchMove` input to carousel component to enable/disable swipe with touch or mouse move.
-   [B-322923](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15543417) Added new DSL property on KycStatus provider to return uploaded document pending status (`KycStatus.DocsPendingWith`).
-   [B-322665](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15533222) Vary eTag by compression/encoding.
-   [D-93531](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15498599) Connect card tab login: Pre-populate card number when user uses auto-fill option.
-   [D-93475](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15485359) Connect card tab login: Prevent user from entering more then 4 digit for pin and 16 digit for connect card number.
-   [D-93474](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15485215) Connect card tab login: Allow user to enter only digits in pin and connect card number fields.
-   [B-322377](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15524973) Added a feature that allows to specify head tags to inject into the DOM from [dynacon](https://admin.dynacon.prod.env.works/services/121971/features/131900/keys/131904/valuematrix?_matchAncestors=true). This is one of the features that will replace sitecore `HtmlHeadTags` in the future.
-   [B-322374](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15524944) Added a toggle to disable features that inject into html with a query string/cookie. Open website with `_disableInject=<VALUE>` (this will write a cookie). `<VALUE>` is a comma separated list
    -   `SitecoreHtmlHeadTags` - disables `HtmlHeadTags` from sitecore
    -   `GTM` - disables Google Tag Manager
    -   `AbTesting` - disables maxymizer
    -   `HeadTags` - disables new HeadTags feature (see above)
    -   `All` - disables all of the above
    -   `None` - enables everything
-   [B-323730](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15571567) Send `OPEN_REGISTRATION_SCREEN` native event instead of opening registration page for download client app.
-   Implemented possibility to convert to user local timezone on Error Handlers using the `local` value on `ToTimeZoneId` parameter in dynacon.
-   [B-322922](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15543338) RTMS handling for GBR KYC verified.
-   [B-316070](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15387029) Added web analytics tracking for `remember-me`.
-   Added `LivePersonEventName.KycFailed`.
-   Modified `lh-monthly-view` to sync `itemsObj` fully and not only `.items` property.

### Vanilla 8.11.1

2019-04-16

-   Shared
    -   Bail out as soon as possible from malicious requests in `Bwin.Vanilla.Mvc.ApplicationErrorHandler.HandleApplicationError(...)`.
-   Desktop
-   Mobile

### Vanilla 8.11.0

2019-04-11

-   [B-321144](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15481159) `Bwin.LabelHost` nuget package and `@labelhost/core` npm package are part of the vanilla solution, and will be release with the same version from now on. There are no breaking changes between labelhost `3.x` and `8.x`.
-   Deprecated services which are meant to be referenced only by LabelHost: `IClaimsService`, `IWebAuthenticationService`.
-   Removed unused `@angular/http` dependency
-   Improved `/health/info/routes` to include attribute routes.
-   Fix error while formatting Date and Amount fields on InboxMessagesClientValuesProvider.
-   Fixed: Login gets stuck if remember-me token is assigned and ApiHost (usually app at www domain) fails e.g. it's down, inaccessible or some error.
-   ~~Logging of unhandled exceptions in WebAPI.~~
-   [B-314438](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15338734) Added back CTA to Player Inbox when navigated from Account menu.
-   [D-93585](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15507165) Fixed: Login dialog with session-expired message is displaying during remember-me login which is supposed to happen in the background.
-   [B-314590](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15343304) Exposed close method on HeaderBarService
-   [B-304507](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14988631): CS Message on Selections Screen

### Vanilla 8.10.0

2019-04-04

-   Removed `{context.label}` from dynacon `fallbackFile` section in web.config templates to support multitenant mode.
-   [B-320004](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15441074) Added even more options for lazy loading css
    -   `LazyLoad` property can have values `None`, `Preload`, `Important`, `Secondary`, `Custom`
        -   `None` - default, no lazy loading
        -   `Preload` - render link `rel=preload` (same as what `IsDeferred` did before)
        -   `Important` - load after app is bootstrapped and wait until it's loaded before starting the app
        -   `Secondary` - load after app started
        -   `Custom` - load manually with `StyleService.load()`
    -   new `Alias` property can be set to resolve the correct name when calling load (e.g. when using `Custom` strategy)
    -   Note: lazy loading is not supported for legacy asset system (except for `Preload`)
-   Add `skipLocationChange` option to `NavigationService`
-   [B-319916](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15437391) Introduced [permanent vs. temporary redirect configuration](https://admin.dynacon.prod.env.works/services/121971/features/122467/keys/131014/valuematrix?_matchAncestors=true) for site root.
-   Fix carousel arrows and navigation issue when there are multiple in same page
-   [B-304110](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14974162) Added image profiles configuration to [dynacon](https://admin.dynacon.prod.env.works/services/121971/features/123362/keys/131043/valuematrix?_matchAncestors=true) where breakpoints can be configured per set of image profiles.
    -   `vnProfiles` now accepts `vnProfilesSet` input which can be used to specify the set to use (default is `default`)
    -   On `PC Teaser` specifying `image-profiles-set` and/or `overlay-image-profiles-set` will use the specified set for the respective images
-   [B-310799](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15217756) Simplified anti-forgery to support CORS. XSRF token is posted only for authenticated user.
-   Added _VanillaFramework.Features.ClientBootstrap_ -> _FetchCachedUserValues_ in DynaCon.
-   [B-316893](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15415227) Added possibility to set subtitle and summary `tag` and `class` for `PC Teaser` with `subtitle-tag`, `subtitle-class`, `summary-tag` and `summary-class` parameters.

### Vanilla 8.9.0

2019-03-29

-   [D-93329](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15459140) `vnDynamicHtml` now correctly renders empty content when input is undefined.
-   Fix vn-carousel looped slides missing event bindings
-   [B-316900](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15415996) Added explicit configuration _TrackThisAppAsLastVisitedProduct_ in _VanillaFramework.Features.SiteRoot_ in DynaCon so that some apps (e.g. promo) aren't tracked as last visited product even if they don't redirect to last visited product.
-   [B-298430](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14765162) Added `correlationId` and `requestId` to semantic logging.
    -   IDs are according to [W3C TraceContext specification](https://www.w3.org/TR/trace-context/).
    -   They are automatically sent to PosAPI in `TraceParent` header.
    -   They are also sent in HTTP response in `TraceParent` header so that you can easily track them if the request comes from internal company network.
-   Fixed: `http.clientIP` and `http.userAgent` in semantic log are written without `http` prefix.
-   [B-320004](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15441074) Added more options for lazy loading css
    -   `StylesheetBootstrapAsset.IsDeferred` is now obsolete
    -   new `LazyLoad` property can have values `None`, `Important`, `Secondary`
        -   `None` - default, no lazy loading
        -   `Important` - render link `rel=preload` (same as what `IsDeferred` did before)
        -   `Secondary` - load with lowest priority
-   Loading of toast content is now delayed until after user logs in on premium labels

### Vanilla 8.8.0

2019-03-25

-   FIX: `generateSitecoreTemplates` function is now asynchronous and returns a Promise. Adapt your gulp task accordingly (in gulp 4 you can just return the result of this function from the task, otherwise call `.then(done)`).
-   Set `networkTimeout` for DynaCon configuration engine in `template.web.config` to 20 seconds compared to hard-coded default 10 seconds.
-   [D-93141](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15416227) Added checks if performance apis are supported by the browser.
-   DynaCon parameter `context.channel` must not be specified anymore because Vanilla 8.x is mobile only so without channel.
-   [B-314282](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15335052) Added [ToastrQueueService](http://docs.vanilla.intranet/mobile/api/core/common/ToastrQueueService) which can be used to show toasts with content from sitecore and with scheduling options (immediate or after next navigation). Most options of ngx-toastr are passed from the sitecore item `Parameters`. Also when site is loaded with `_showToast=toastname` in the url, it will show the toast on page load.
-   [B-317310](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15429866) Support display of rating for Android on smart banner.
-   [B-316605](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15404744) Added proxy item support for `MenuFactory` (used to get items for header, footer, account menu, bottom nav, bottom sheet etc.).
-   [B-316605](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15404744) The header logo now supports client side filtering (and proxy because of the above point), and render as `a` tag and maps following properties from the menu item:
    -   `href` from `LinkReference` url
    -   `alt` from `LinkText`
    -   `class` from `parameters['link-class']`
    -   inner `div` `class` from `parameters['class']`
    -   on click it will invoke `parameters['click-action']` - same as before
-   Added `Brotli` compression, quality can be configured on dynacon [BrotliCompressionQuality](https://admin.dynacon.prod.env.works/services/121971/features/130527/keys/130529/valuematrix?_matchAncestors=true#130530) **Release teams please monitor CPU impact as part of the rollout**

### Vanilla 8.7.0

**NOTE: broken sitecore template generator npm package.**

2019-03-18

-   Enforced new client IP resolution algorithm which could be enabled using `vanilla:NewClientIPResolution` setting in previous versions. Old algorithm is removed.
-   BottomSheet now correctly uses client side filtering.
-   Added `AuthService.isAuthenticated` which checks if is user is authenticated on the server (has a vauth cookie and his session is valid).
-   Added `show-badge` parameter to `avatar` header item.
-   [B-307415](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15100327) Added authentication by remember-me token.
-   `generateSitecoreTemplates` function is now asynchronous and returns node `ChildProcess`. Adapt your gulp task accordingly (in gulp 4 you can just return the result of this function from the task, otherwise subscribe to `exit` event and call `done` callback to signal task completion).
-   [D-92777](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15357603) Fix localization for login validation messages
-   Add `sports` and `casino` to the list of legacy native route apps.
-   Added common properties `http.clientIP` and `http.userAgent` to semantic logging.

### Vanilla 8.6.0

2019-03-08

-   Added client side filtering to header items
-   `MessageQueueConfig` is now emptied when messages are transferred to the message queue
-   Changed inner implementation of [facade](http://docs.vanilla.intranet/facade-pattern.html) to generate and compile the class dynamically using Roslyn. This brings optimal performance (no additional overhead because of facade).
-   Added `LoginParameters.Type`.
-   Deprecated `HealthCheckResult.Passed`. Instead `Error` should be changed to (not) be null e.g. in unit tests of a health check you get more details in failed assertion.
-   Added support for badge on avatar and products in the header (`HeaderService.setItemCounter()`).
-   Restore support for route parameters in legacy native routes.
-   [B-312555](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15284736) Added service for management of all menu item counter badges [MenuCountersService](http://docs.vanilla.intranet/mobile/api/core/common/MenuCountersService)

### Vanilla 8.5.1

2019-03-06

-   Restore support for route parameters in legacy native routes.

### Vanilla 8.5.0

2019-03-01

-   [B-313920](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15325389) Anti-forgery validation can now be disabled with a dynacon config (this is mostly for purposes of testing single domain app). In the future we are planning to remove Mantiforgery protection completely by using an authentication method that is not susceptible to CSRF attacks for WebAPI requests.
-   [B-313505](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15313478) Added an option to add text to header avatar
-   [B-311963](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15264340) Added more features to Carousel (to be able to be used instead of labelhost slider)
-   [D-92459](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15302848) Client side DSL providers can now return `DSL_NOT_READY` constant to indicate they don't yet have data to evaluate the expression (e.g. in case of ajax call). Expressions that contain any calls to providers that are not ready will be automatically return `undefined` as a result of the whole expression.
-   [B-314179](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15332229) Allowed redirect of site root to default language e.g. `/` to `/en` using config _Vanilla.Features.SiteRoot_ -> _RedirectToDefaultLanguage_.
-   Added `product-{currentProduct}` class to `html` node.
-   Registering a layer with `ApplicationBlueprintService` outside bootstrap methods will now throw an error.
-   [B-314363](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15337299) Release funds option for Paypal on account menu
-   Allowed authentication on `/health/content` page so that filtering and placeholders are evaluated for current user.
-   [B-312223](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15272974) Added smart banner.
-   Added support for proxy items within content messages.
-   Fixed: Generation Sitecore content template classes fails if they are inheriting from Vanilla templates.

### Vanilla 8.4.3

2019-02-27

-   add mime-types for static files: webp, woff, woff2, ttf, otf, ani

### Vanilla 8.4.2

2019-02-27

-   `NavigationService.goto()` falls back to `Page.lang` if culture cannot be result from the destination url to avoid unnecessary page reloads

### Vanilla 8.4.1

2019-02-13

-   Added `ResponsiveFooterContent`, `MessageQueueConfig` and `HeaderItemBase` to public api
-   `MessageQueueConfig` was deprecated

### Vanilla 8.4.0

2019-02-13

-   Added `HtmlAttributes` property to `IFormElementTemplate`.
-   Content templates are determined based on generated code instead of loading them from Sitecore in runtime:
    -   This avoids unnecessary request to Sitecore which could fail whole app to start.
    -   There is a new health check comparing local templates with those on Sitecore side.
    -   Templates generation ouput to console is much more verbose.
-   _BUILD UPDATE_ `@vanilla` angular npm packages now use the standard [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview). This is achieved by building the library with `ng` cli.
    -   As `ng` cli develops further, we will get the benefits and optimizations by default
    -   As we now publish flattened modules, this should reduce product build times (labelhost will also switch to this build)
    -   In the future this may allow us to use [bazel](https://github.com/angular/angular/issues/19058) for fast incremental compilation (based on dependencies) and other good stuff (bazel integration with cli/angular apps is now experimental)
-   Exposed `MenuContent.resources` on `AccountMenuService`
-   Deprecated `ITree<>`, `ITreeItem<>`, `Tree<>`, `TreeItem<>`.
-   Changed logged message about too long Hekaton cache key to _Error_ from _Warning_ because it means that there are key collisions just they are very hard to find.
-   Added _VanillaFramework.Services.Caching.Hekaton_ -> _MaxKeyLength_ configuration.
-   Added async wrapper around semantic logging file sinks and support for enabling bufferSize in web.config
-   Updated to better way of registering client configs on the client (check [updated docs](http://docs.vanilla.intranet/mobile/guide/client-config))
-   Added `IPosApiCommonService.GetLanguagesAsync()`.
-   Fixed JSON serialization of `ExtendResultBase` to be use common serializer so that it's camel-cased. This fixes `currency` properties from `WithRefreshedBalance()`.
-   Removed duplicate `<meta name="apple-mobile-web-app-title" ... />`.

### Vanilla 8.3.0

2019-02-06

-   [B-285602](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14329279) Added Carousel page matrix component on non responsive mode.
-   Fixed: If site root is configured to redirect to `App-v1.0/Links/Home` then `client-bootstrap-scripts.js` run into deadlock.
    -   Also added explicit handling to throw an exception to avoid async/sync deadlock. It's used in Content API.
-   Added new infrastructure for registering application structure functionality compatible with future single domain app concept. So far it includes registration of dynamic slots and menu actions. It is likely to be extended for other such "on init" registrations. Before everyone can start using it, **labelhost** needs to be adapted first.
    -   See docs for [ApplicationBlueprintService](http://docs.vanilla.intranet/mobile/api/core/ApplicationBlueprintService)
    -   See examples in vanilla [slots](https://vie.git.bwinparty.com/vanilla/monorepo4/blob/master/Source/Bwin.Vanilla.PluginHost.Ng/Client/core/src/wireup/dynamic-layout-bootstrap.service.ts), [menu actions](https://vie.git.bwinparty.com/vanilla/monorepo4/blob/master/Source/Bwin.Vanilla.PluginHost.Ng/Client/core/src/wireup/menu-actions-bootstrap.service.ts)
-   Added `FooterService`.
-   Added `isRobot` to `DeviceService`.
-   Deprecated old asset infrastructure.
-   [B-310563](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15210596) Different menu actions when clicking on Balance in header for play vs real money players.
-   [B-306846](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15081484) Added apps download section in product menu.
-   Support for `null` value in _CanonicalUrl_ of _VanillaFramework.Features.Seo.Canonical_ -> _UrlRules_ configuration in order to opt out from canonical link tag rendering at all.
-   [B-290059](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14452466) RenderAbTestingScript method was added to HtmlHeadTags section on MobileLayout.cshtml. [AbTestingIsEnabled](https://admin.dynacon.prod.env.works/services/121971/features/123228/keys/123246/valuematrix) and [AbTestingScriptSource](https://admin.dynacon.prod.env.works/services/121971/features/123228/keys/123252/valuematrix) can be configured on dynacon.
-   Fixed values from PosAPI in client config `vnUser` and `User` DSL provider if user has a workflow.

### Vanilla 8.2.0

2019-01-24

-   DSL expression must contain only letters, digits, punctuation, symbols or white-spaces. Otherwise (e.g. invisible or control chars) the compilation fails.
-   [B-310261](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15201669) Remove minimum-scale, maximum-scale and user-scalable attributes from viewport meta tag.
-   Exposing values from PosAPI in client config `vnUser` even if user is in workflow.
-   Changed `User` DSL provider to return data from PosAPI even if user is in workflow.
-   [B-285602](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14329279) Added new page matrix component and sitecore template `PC Carousel`.
-   [B-307052](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15088197) Added `BrandId` to `CommonLoginParameters`.
-   [B-307248](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15095028) Added support for atomic writes of semantic logging file sinks.
-   [B-307248](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15095028) Semantic logging - write exception info with inner exception.
-   Deprecated `IBuildManager`.
-   Added `service.Try(getValue, log)` convenience extension methods which call given delegate on the service. If it fails then the exception is written to given log and default value is returned.

### Vanilla 8.1.0

2019-01-18

-   [B-303169](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14941677) Replace embedded language in Indigo Notifications URL with the one that is send in native event `NAVIGATE_TO`.
-   [D-91055](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15066998) Close content message with close button even if it doesnt write close cookie.
-   Added diagnostic pages: `/health/info/http-request`, `/health/info/posapi/cached-data/user`, `/health/info/posapi/cached-data/static`, `/health/info/webconfig`.
-   Improved `/health/dsl`:
    -   Showing assembly where a provider comes from.
    -   Showing server and client evaluation results/errors at the same time.
    -   Fixed `expression` query parameter.
-   Added info about server environment and IP address in the top right corner on SPA diagnostic pages.
-   [B-305686](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:15036147) It is now possible to use reCAPTCHA v3 and invisible reCAPTCHA support is improved. Check the updated [docs](http://docs.vanilla.intranet/features-recaptcha.html).
-   Fixed: PosAPI user data are not being cached between requests at all.
-   Fixed: Logout call blows up if user is already logged out on PosAPI.
-   Changed `User.AffiliateInfo` to return null (empty string in DSL expression) for unauthenticated user.
-   Added support for string value for `parameters` of `NativeCallEntryProc`.
-   [D-91328](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15102260) Fixed anchor scrolling to gracefully handle invalid html selector.
-   [D-91000](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15051088) Added config DynaCon -> DeviceRecognition -> MaxApiCacheSize which may help to fix issue with some incorrectly identified devices especially Apple Macintosh laptop being identified as mobile.
-   Replaced factory methods `Content<TDocument>.CreateXYZ(...)` with concrete implementations `SuccessContent<T>`, `FilteredContent<T>`, `NotFoundContent<T>`, `InvalidContent<T>`. They expose only properties which make sense and can be nicely used with pattern-matching.
-   Fixed: deserializing `SignUpBonus` static PosAPI data from distributed cache fails because of incompatible JSON.
-   Fixed: Third party tracking fails with _missing security token_ error from PosAPI.
-   Fixed: `/health/restRequest` and _critical error page_ blow up.
-   Added health check for `reCAPTCHA` that checks whether the configures secret keys are valid.
-   Added `fw-eight` class to html node (this will increase with major releases of the framework).
-   [B-304114](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14974222) Caching data from PosAPI per matching custom headers from the configuration hence channel should be resolved according to device properties used in header DSL expressions.
-   Fixed domain of `ASP.NET_SessionId` cookie in multitenant mode.
-   Client config `__durations`: added `__total`, ordering entries descending to make it easier to spot which config takes too long.
-   Implemented deep equality on `IDslExpression<>`-s which is used for example in Content API to evaluate unique placeholder or filter only once.
-   Replaced `Bwin.Vanilla.DomainSpecificLanguage.Placeholders.IPlaceholderCompiler` with simpler `Bwin.Vanilla.DomainSpecificLanguage.IPlaceholderCompiler`.
-   Writing out `X-Vanilla-Prerendered` header if Prerender.io is executed instead of actual page. This can be used for diagnostics.
-   Added to Canonical link tag:
    -   Exception handling so that it can't fail the whole request because it's directly called from main layout.
    -   Strict validation of the configuration to avoid runtime errors: HostAndPathRegex must match whole input and CanonicalUrl must start with http(s) scheme.
    -   Diagnostic info written in following comment tag if current request is from company internal network.
-   [B-309719](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15183826) Included JSON serialization in duration measurements of `IClientConfigurationProvider` execution. This is especially useful to diagnose why `client-boostrap-scripts.js` take so long.
-   Added `X-Vanilla-App-Execution-Duration` response header with total time spent processing the request by your Vanilla app. It's useful to compare from client-side how much overhead is added by web server, CDN, network etc. It's automatically added to all responses with `BufferOutput`.
-   Static file handler disables `Response.BufferOutput` which is supposed to slightly improve performance for client.
-   Client configs will now always be available at startup.
-   Added support for CORS requests.
-   `AfterConfigLoadInit` is deprecated. Use `OnAppInit` instead.
-   `ClientConfigService.reload` method that can take string parameter was deprecated. Use the actual types of client configs instead.
-   `ApiServiceFactory.create` method with prefix parameter was deprecated. Use overload with options object, and specify product according to [this configuration](https://admin.dynacon.prod.env.works/services/121971/features/126782/keys/126784/valuematrix) to prepare for the future.
-   `BrowserUrlInterceptor` only add header if the requests goes to an endpoint with the same top domain.
-   `ResponsiveLanguageSwitcherComponent` is now exported from `VanillaLibModule`.
-   [B-285601](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15171489) Added [ngx-swiper-wrapper](https://www.npmjs.com/package/ngx-swiper-wrapper) library as a dependency.
    -   This is used for the generic carousel component.
-   `vnDynamicHtml` now updates html when input value changes.

### Vanilla 8.0.0

2018-12-03

With this release, Angular 6 is now ready to be used with Vanilla - please see [migration guide](http://docs.vanilla.intranet/mobile/guide/migration-guide-5-6). In addition to removing a lot of old deprecated code, we also removed the "desktop" part of `PluginHost` (desktop is going to stay on vanilla 7 until all labels are migrated to responsive mode) and `AngularJS` (only Angular 6+ applications are now supported). A lot of APIs were changed better support `async`. Vanilla libraries (except `Mvc` and `PluginHost`) now only target `netstandard2.0`.

-   `AngularJS` was REMOVED, hybrid support was removed
    -   `@vanilla/pure` was merged into `@vanilla/core`
    -   `@vanilla/upgrade` was removed
    -   `IMobileAppConfigurationBuilder` etc. was removed
    -   `IPrerenderPartialsList` etc. was removed
-   Desktop is no longer being updated in version 8+
    -   `Bwin.Vanilla.PluginHost.Desktop` was removed
    -   Helpers and features only useful for desktop were removed
        -   `SupportedBrowsers` feature was removed
        -   `IContentBinder` and related infrastructure was removed. Use `IContentService` instead.
        -   `InputModel` was removed. Use `ValidationMessagesPath` for the localized WebApi messages on model classes.
-   Updated to angular 6, rxjs 6, typescript 2.9
-   `IBootTask`-s must be explicitly registered in the container. This provider better control of the registration & dependencies.
-   Using new dynacon service `Vanilla Framework 8+` `(id:VanillaFramework)` which has no longer `Channel` as part of variation context. Make sure you keep new dynacon service in sync whenever making change in old `Vanilla` dynacon service.
-   Sitecore content templates **must be regenerated**.
    -   Recommended steps:
        1. Fully update to Vanilla 8 including `@vanilla/sitecore-template-generator`.
        2. Adapt the rest of your code so that it compiles. Old templates can still be compiled, just they are obsolete and don't work.
        3. Regenerate the templates.
        4. Adapt your code according to new templates.
    -   Additional mapping is included so that templates don't need to be loaded from Sitecore (will be implemented in the future).
    -   Replaced `ICollection<>` with `IReadOnlyList<>`, `IContentImage` with `ContentImage`, `IContentLink` with `ContentLink`, `IListItem` with `ListItem`, `IProxyRule` with `ProxyRule`.
    -   Replaced `IFieldConverter` with strongly-typed `IFieldConverter<TField>`. It should throw an exception in case of an error e.g. invalid value. Calling code records all field details.
    -   Hid implementations of content `IFieldConverter` because they are anyway added in `DefaultTemplateMappingProfile`.
    -   Moved and renamed `Bwin.Vanilla.Content.Model.BaseTemplateMappingProfile` to `Bwin.Vanilla.Content.Templates.Mapping.DefaultTemplateMappingProfile` and now it's not abstract so that you can use it directly if you don't have any additional mappings.
    -   Removed implicit `string` converter for all fields. Therefore you must register it for particular field type in order to be explicit how to map it.
    -   Removed default mapping for `bool?` field called `tristate` on Sitecore side.
    -   Refined fields of `ContentImage`, `ContentLink` e.g. added `ContentLink.Url` instead of `ContentLink.Attributes["href"]`.
    -   Vanilla classes have been moved between namespaces.
-   Client config infrastructure was changed to async interface
    -   `IClientConfigProvider` method was changed to `Task<object> GetClientConfigurationAsync(CancellationToken)`
    -   Helper class `LabmdaClientConfigurationProvider` was made public (this base class is very convenient for removing boilerplate code from client config providers and also accepts a synchronous callback in case nothing in the provider requires async).
-   `ISimpleMenuFactory` was renamed to `IMenuFactory` and changed to async
-   Moved `ISitecoreLinkUrlProvider` from `Bwin.Vanilla.Mvc.Content` to `Bwin.Vanilla.Content` and changed its parameter from `string` to `DocumentId`.
-   Json converters of content were removed, use `IClientContentService` instead
-   `IClientContentMessagesLoader` has been renamed to `IContentMessagesLoader` and changed to async
-   Legacy native route infrastructure was prefixed with `Legacy` and now supports multitenancy. Implement `ILegacyNativeRouteProvider` to register routes.
-   Menu items infrastructure (`vn-menu-item`, `MenuItemsService`) has been exported
-   Removed obsolete code (client):
    -   Removed `DatePipe`
    -   Removed `ContentDslService`
    -   Fixed typo in `GenericListItem`
    -   Removed `RemoteLogger` constructor
    -   Removed `IntlService.formatDate`
    -   Removed `ApiHeaderInterceptor` as only usage in Vanilla was refreshing balance which is now done differently
    -   Removed `EdsButtonComponent`
    -   Removed `BrowserUrlInterceptor` from public api
    -   Removed left over product switcher functionality
    -   Removed `DslService.evaluate`
    -   Fixed typo in `BalanceProperties.taxWithheldAmount`
    -   Removed deprecated `TrackingConfig` properties
    -   Removed `NativeAppSerivce.isNativeVC`
    -   Removed `RouteParamsService`
    -   Removed `PositioningService`
    -   Removed deprecated methods from `BottomNavService`
    -   Changed usage of deprecated `URLSearchParams` to `HttpParams` (this also changes api of `QuerySearchParams` - note that unlike `HttpParams` it's still a mutable object)
-   Removed obsolete code (server):
    -   Removed obsolete methods in `VanillaApiController`
    -   Removed forms authentication related code
    -   Removed obsolete methods in `IMobileAppBuilder`
    -   Removed obsolete methods from `NativeAppService`
    -   Removed DSL `NativeApplication.IsNativeVC`
    -   Removed obsolete overloads in `SimpleMenuFactory`
    -   Removed obsolete interface `IRegistrationDateResponse`
    -   Removed obsolete interface `ITrackingConfiguration`
    -   Removed obsolete class `ProductwiseMarketPointsDto`. Use `ProductwiseMarketPoints` instead.
    -   Removed obsolete class `GameWisePointDto`. Use `GameWisePoint` instead.
    -   Removed obsolete class `ProductGameWisePointsDto`.
    -   Removed obsolete class `ExpressionParser`.
    -   Removed obsolete class `ObjectValidator`.
    -   Removed obsolete class `IUserValuesResolver`
        -   Use method `IBalanceResolver.GetBalanceAsync` instead of 'GetBalance'
        -   Use method `ILoyaltyPointsResolver.GetLoyaltyPointsAsync` instead of 'GetLoyaltyPoints'
        -   Use method `ICashbackResolver.GetCashbackAmountAsync` instead of 'GetCashbackAmount'
        -   Use method `ILoyaltyCategoryResolver.GetLoyaltyCategoryAsync` instead of 'GetLoyaltyCategoryString'
        -   Use method `IValueSegmentResolver.GetValueSegmentAsync` instead of 'GetValueSegment'
    -   Removed obsolete legacy tracking.
    -   Removed `IRestRequestFactory` and related infrastructure (`(I)RestRequestFactory` `RestResponseExtensions`, etc ...). Use IRestClient and related API instead.
    -   Removed `IPosApiHttpClientFactory`, `PosApiServiceBase`, and ExposedHttpHandler. Use new API from Bwin.Vanilla.ServiceClients.Infrastructure namespace.
    -   Removed obsolete property `ISeoConfiguration.PageWithGlobalMetaTagsLocation`. Use `ISeoConfiguration.GlobalMetaTags` instead.
    -   Removed obsolete methods from `ICrmService`.
        -   `GetBonus(int trackerId, BonusStage bonusStage, string language = null)`: Use method `GetBonus(int trackerId, string bonusStage)` instead.
        -   `GetBonusAsync(int t	rackerId, BonusStage bonusStage, string language = null, CancellationToken cancellationToken = default)`: Use method `GetBonusAsync(int trackerId, string bonusStage, CancellationToken cancellationToken = default)` instead.
        -   `GetBonusParameters(int trackerId, BonusStage bonusStage, string language = null)`: Use method `GetBonusParameters(int trackerId, string bonusStage)` instead.
        -   `GetBonusParametersAsync(int trackerId, BonusStage bonusStage, string language = null, CancellationToken cancellationToken = default)`: Use method `GetBonusParametersAsync(int trackerId, string bonusStage, CancellationToken cancellationToken = default)` instead.
        -   `RefreshBasicLoyaltyProfile`: Use method `InvalidateCachedBasicLoyaltyProfile` instead.
        -   `RefreshLoyaltyProfile`: Use method `InvalidateCachedLoyaltyProfile` instead.
        -   `RefreshCashbackAmount`: Use method `InvalidateCachedCashbackStatus` instead.
        -   `RefreshValueSegment`: Use method `InvalidateCachedValueSegment` instead.
    -   Removed obsolete code from `Bwin.Vanilla.Testing`
        -   Removed `CompositeLogAppender`. Inject ILog (from Autofac) instead.
        -   Removed `FakeLogAppender`. Inject ILog (from Autofac) instead.
        -   Removed `RestRequestHelper` and `RestRequestData`. Use `IRestClient` and related API instead.
        -   Removed code for faking rest requests under `Bwin.Vanilla.Testing.Rest.*`. Use `IRestClient` and related API instead.
        -   Removed obsolete `BackupPrincipalAttribute`. Mock `HttpContextBase.User` or `ICurrentUserAccessor.User` instead.
        -   Removed obsolete `VanillaAssertionHelper`.
    -   Removed obsolete `PosApiWorkflowIdentity`. Detect workflow state based on claim for `PosApiClaimTypes.WorkflowTypeId`.
    -   Removed obsolete `ServiceException`. Use `PosApiException` instead.
    -   Removed obsolete `PosApiHttpExtensions`. Use new API from `Bwin.Vanilla.ServiceClients.Infrastructure` namespace..
    -   Change return values from `IEnumerable<T>` to `IReadOnlyList<T>` on `ICrmService`.
    -   `IDeviceRecognitionService` was made internal
-   Removed legacy logging done by Vanilla infrastructure. Please implement logging on your side.
    -   Decomissioned app setting `vanilla:DisableServiceClientsLogging` in web.config.
-   Changed `IClientContentService`:
    -   Mappers must implement `IClientContentMapper<TSource, TTarger>` directly.
    -   Mappers provided by Vanilla aka base mappers are not public anymore because they can be manipulated using mapping properties.
    -   Fixed namespaces.
-   Changed `IContentService`:
    -   Removed non-generic metods because you can just call generic ones with `IDocument`.
    -   Renamed `GetItem` methods to `GetContent` because they return `Content<>`.
-   Changed content placeholders:
    -   Added async API.
    -   Replaced `PlaceholderExpression` with `IPlaceholderExpression`.
    -   Warnings are returned as an `out` parameter so that people are encouraged to handle them and they are not stored in memory with expressions which have long lifetime.
-   Changed `IDslCompiler`: Warnings are returned as an `out` parameter so that people are encouraged to handle them and they are not stored in memory with expressions which have long lifetime.
-   Remove non-culture route for balance refresh (only `/{culture}/api/balance/refresh` is supported)
-   Added prefix `With` to all `IHttpActionResult` extensions
-   Removed `data-domain` from html node. Use `data-label` instead.
-   Removed `lastLoginTime` property from user
-   Removed `LoggingModule` - enabled injecting of `ILog` using DI.
-   Added `Bwin.Vanilla.Testing.Fakes.TestLogger<T>` which can be used to mock `Microsoft.Extensions.Logging.ILogger<T>`.
-   Removed DSL `Browser.IsSupported` as it is not used on mobile.
-   Most client configs were made internal.
-   Changed `Headers` of `RestRequest`, `RestResponse` and `PosApiRestRequest` to specialized dictionary which is easier to handle and doesn't allow invalid names.
-   Changed `ContentLoadOptions` from `class` with a constructor to `struct` with property setters.
-   Used `System.Enum` generic constraint instead of `struct` in various places.
-   Renamed `IAuthenticationService` to `IWebAuthenticationService`.
-   Replaces `IClaimsService` to `IPosApiAuthenticationService`.
-   Removed some methods on PosAPI services that are not needed for consumers. If you find out you need it then please let us know asap.
-   Removed `ObjectCacheTempDataProvider` as it was intended only for desktop use.
-   Removed `UserSignedInEvent`, `UserSignedOutEvent` and whole `IEventDescription<>` infrastructure as far as it was intended only for desktop use.
-   Moved corresponding logic to `Bwin.Vanilla.Core.Strings` and `Bwin.Vanilla.Core.Uris` namespaces.
-   Added more operators for `UtcDateTime` and removed implicit conversion to `DateTime` so that working with it is easier but casts are explicit to make developers aware.
-   Hid `IServiceClientsConfiguration`, `IContentConfiguraiton`, `IMailConfiguration`, `IDeviceRecognitionConfiguration` because they are meant to be consumed solely by Vanilla. You can still create them and register in DI using corresponding builders.
-   Moved `ServiceClientsConfigurationBuilder` to `Bwin.Vanilla.ServiceClients.Infrastructure` and added `ILegacyServiceClientsConfiguration`.
-   Removed `BwinHeaders` constants as far as they are handled by Vanilla as needed.
-   Globally removed `default` value for `CancellationToken` ton encourage its usage.
-   Replaced `PosApiRestClientExtensions` with direct methods on `IPosApiRestClient`. Same for `IPosApiDataCache`. This makes mocking easier according to your needs and removes overhead related to (un)wrapping returned data to `Task`-s.- Removed `first-time-visit` CSS class from `<html>`.
-   Replaced `InvalidateCachedFoo()` methods in PosAPI service clients with `cached` flag on get method.
-   Removed `first-time-visit` CSS class from `<html>`.
-   Data layer related interfaces were made internal
-   [B-302051](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14897022) Allow to override assets sections in `MobileLayout` (`BodyAssets`, `HeadAssets`, `HtmlHeadTags`)
-   [B-303265](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14946113) Account menu PayPal balance regulation changes
-   Added property `eventId` to `RtmsMessage` interface.
-   `*vnDynamicComponent` now bind directly to hosted component rather than to `model` property
-   Removed `SiteMapConfiguration` and `SeparateUrlsProvider` as it will not be longer used.
-   Removed `SeoHelperExtensions` and `SeoHtmlExtensions` as they are not used on mobile.
-   Renamed `ISeoHelper` to `ICanonicalUrl` and made it internal.
-   Added `/health/info/device` page.
-   [B-304537](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14989807) V6 header change

### Vanilla 7.48.0

2019-09-02

-   Shared
-   Desktop
-   Mobile
    -   Reverts [B-336485](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16001817) that removes Paypal release funds code
    -   Added release funds dynacon toggle [PaypalReleaseFundsEnabled](https://admin.dynacon.prod.env.works/services/121971/features/123468/keys/146635/valuematrix?_matchAncestors=true)

### Vanilla 7.47.1

2019-08-12

-   Shared
    -   Fixed: Deserialization of `Balance` from distributed cache fails hence it decreases performance.
-   Desktop
-   Mobile

### Vanilla 7.47.0

2019-08-09

-   Shared
    -   [B-336485](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A16001817) PayPal Update germany:
        -   Removed release funds.
        -   Added properties on `Balance` from PosAPI: `PayPalRestrictedBalance`, `PayPalCashoutableBalance`.
        -   Added `Balance` DSL provider with properties `AccountBalance`, `PayPalBalance`, `PayPalRestrictedBalance`, `PayPalCashoutableBalance`. Deprecated `User.AccountBalance`.
-   Desktop
-   Mobile

### Vanilla 7.46.2

2019-04-17

-   Shared
    -   Fixed: custom error page fails when owin context not available.
-   Desktop
-   Mobile

### Vanilla 7.46.1

2019-04-16

-   Shared
    -   Bail out as soon as possible from malicious requests in `Bwin.Vanilla.Mvc.ApplicationErrorHandler.HandleApplicationError(...)`.
-   Desktop
-   Mobile

### Vanilla 7.46.0

2019-04-08

-   Shared
-   Desktop
-   Mobile
    -   [B-320685](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15461990) Reverts "B-30971 Included JSON serialization in duration measurements of `IClientConfigurationProvider` execution". Reverts commit 5225e07f668a0f033cbe105408ff01f0ce14dbe1

### Vanilla 7.45.0

2019-03-08

-   Shared
-   Desktop
-   Mobile
    -   Fix Release funds issue (403 forbidden)

### Vanilla 7.44.0

2019-02-28

-   Shared
-   Desktop
-   Mobile
    -   [B-314363](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15337299) Release funds option for Paypal on account menu

### Vanilla 7.43.0

2019-02-20

-   Shared
    -   [B-314179](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15332229) Allowed redirect of site root to default language e.g. `/` to `/en` using config _Vanilla.Features.SiteRoot_ -> _RedirectToDefaultLanguage_.
-   Desktop
-   Mobile

### Vanilla 7.42.0

2019-01-22

-   Shared
    -   Added `X-Vanilla-App-Execution-Duration` response header with total time spent processing the request by your Vanilla app. It's useful to compare from client-side how much overhead is added by web server, CDN, network etc. It's automatically added to all responses with `BufferOutput`.
-   Desktop
-   Mobile
    -   [B-309719](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15183826) Included JSON serialization in duration measurements of `IClientConfigurationProvider` execution. This is especially useful to diagnose why `client-boostrap-scripts.js` take so long.

### Vanilla 7.41.0

2019-01-02

-   Shared
    -   Changed new client IP resolution algorithm (still disabled by default, see Vanilla 7.37.0): Removed check if request physical IP is within company internal subnets.
-   Desktop
-   Mobile

### Vanilla 7.40.0

2018-12-19

-   Shared
-   Desktop
-   Mobile
    -   [D-91384](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15106619) Added `DEPOSIT_BUTTON_ANCHOR` element. It is used for `Quick deposit` positioning.
    -   [D-91340](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15103220) Fix localization for IValidatableObject implementations

### Vanilla 7.39.0

2018-12-13

-   Shared
    -   [D-91000](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A15051088) Added config DynaCon -> DeviceRecognition -> MaxApiCacheSize which may help to fix issue with some incorrectly identified devices especially Apple Macintosh laptop being identified as mobile.
-   Desktop
    -   [B-306693](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A15077468) Cookie Consent Banner - Web Tracking
-   Mobile

### Vanilla 7.38.4

2018-12-13

-   Shared
-   Desktop
-   Mobile
    -   [D-91328](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15102260) Fixed anchor scrolling to gracefully handle invalid html selector.

### Vanilla 7.38.3

2018-12-11

-   Shared
-   Desktop
-   Mobile
    -   Added support for string value for `parameters` of `NativeCallEntryProc`.

### Vanilla 7.38.2

2018-12-10

-   Shared
    -   Fixed: Logout call blows up if user is already logged out on PosAPI.
-   Desktop
-   Mobile

### Vanilla 7.38.1

2018-12-06

-   Shared
-   Desktop
-   Mobile
    -   [D-91055](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:15066998) Close content message with close button even if it doesnt write close cookie.

### Vanilla 7.38.0

2018-12-04

-   Shared
-   Desktop
-   Mobile
    -   [B-303265](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14946113) Account menu PayPal balance regulation changes
    -   Added icon classes for offer button
    -   [B-303169](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14941677) Replace embedded language in Indigo Notifications URL with the one that is send in native event `NAVIGATE_TO`.

### Vanilla 7.37.0

2018-11-22

-   Shared
    -   [B-298799](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14782000) Exposed `/api/dsl/validity` internal endpoint that can be used to validate DSL expression including product specific providers. This will be available on all websites, so that Sitecore can query it when validating DSL expressions.
    -   [B-301363](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14873882) Added login with bank session ID.
    -   Added new client IP resolution algorithm. It's disabled by default. To enable it, add `vanilla:NewClientIPResolution` with value `true` to `appSettings` in `web.config`.
-   Desktop
-   Mobile
    -   Support `NativeCallEntryProc` for native integration (in addition to `messageToWeb`).

### Vanilla 7.36.0

2018-11-15

-   Shared
-   Desktop
-   Mobile
    -   [B-298113](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14753722) Added an output event on `vn-popper-content` when close link is clicked.
    -   [B-295950](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14674199) Added more options for calculation of balance items (account menu, header). A single parameter `formula` is now configured instead of `balance-type` and `multiplier`. This is a simple formula that supports `+`, `-`, `*`, `/`, parenthesis, constants and any of balance variables.
    -   Added `BalanceService`. It provides access to users balance and means to refresh it.
        -   `UserService.balance` was deprecated - instead use `balanceProperties` or `BalanceService`.
    -   [B-303338](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14948440) Added [ngx-toastr](https://github.com/scttcper/ngx-toastr)
    -   Exposed `UserService.lastLoginTimeFormatted` and `UserService.loginDuration`
    -   [B-303584](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14956191) Added login duration on Footer. To be used with [LoginDurationDisplayMode](https://admin.dynacon.prod.env.works/services/116238/features/94217/keys/94226/valuematrix?_matchAncestors=true#121143) set `FooterInline`
    -   [B-303587](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14956334) Added a new top content messages placeholder, that will stick with the header.
    -   [B-303689](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14959843) Added device dynacon variation property provider.
    -   [B-303000](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14932942) Added isTouch to datalayer
    -   [B-288098](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14400290) Improved tracking for cookie consent banner.
    -   [B-301365](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14873917) Bottom nav is now always visible and no longer hides when scrolling.
        -   class `bottom-nav-shown` was added to html node when the bottom nav is enabled and visible.

### Vanilla 7.35.0

**Warning: Wrong version - released with packages from the wrong build.**

2018-11-13

-   Shared
-   Desktop
-   Mobile

### Vanilla 7.34.1

2018-11-13

-   Shared
    -   HotFix - Added serializable attribute to PosApiException class
-   Desktop
-   Mobile

### Vanilla 7.34.0

2018-10-30

-   Shared
    -   Created new interfaces for PosAPI services which return POCO classes so that you can safely serialize them, use them easily and it reduces code too.
        -   `IPosApiCrmService` which replaces `ICrmService`.
    -   Changed `RestRequest.Url` and `RestResponse.Request` to be mandatory so that thses objects are always fully valid.
    -   Deprecated `ContentException` because it has no added value. Just catch regular `Exception` according to particular method of `IContentService` you are using.
    -   Replaced `AddRange()` methods (now deprecated) with `Add()` which can be nicely used with collection initializers.
    -   Added async methods on `IContentService` which execute requests to Sitecore asynchronously.
    -   Added async methods on `IDslExpression` for the future usage of async DSL providers.
    -   [B-297745](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14740701) Support DeviceAtlas client-side capabilities detection to identify iPhones models
        -   Needs nuget package `DeviceAtlas.2.1.2` or higher installed
        -   Include `deviceatlas-lite-1.6.min.js` from npm package `deviceatlas-clientside` 1.6.0 or higher (e.g. by adding `import 'deviceatlas-clientside/deviceatlas-lite-1.6.min';` in `polyfills.ts`)
    -   Added `/health/diagnostics` pages displaying client IP resolution, server-side routes, server info.
    -   Changed `IPosApiCrmService`: added `ValueSegment`, deprecated some related data interfaces/classes.
    -   Deprecated methods on `IPosApiNotificationService` related to _Inbox_ because they will be moved to _LabelHost_ in next major Vanilla release.
    -   Added `/health/info` pages with various useful diagnostic data.
    -   [B-293406](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14577586) Caching client information from PosAPI per matching headers from the configuration hence channel should be resolved according to device properties used in header DSL expressions.
    -   Removed obsolete properties from _Vanilla.Services.ServiceClients_ and _Vanilla.Services.Content_ in `/health/config`.
-   Desktop
    -   [B-301220](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14867708&RoomContext=TeamRoom%3A12280210) Allow Opt-in to a promotion from promotion/public pages for unauthenticated players
-   Mobile
    -   [B-289280](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14431502) Added an option to defer loading of css (see [docs](http://docs.vanilla.intranet/mobile/guide/deferred-css)).
    -   [B-299488](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14807510) Added `BottomNavService.events` that informs subscribers when the bottom nav is shown or hidden.
    -   Added `authenticated`/`unauthenticated` class to the splash screen.
    -   Added an option to add data to content message tracking
        -   e.g. parameters `tracking.LoadedEvent` - `Event.SomeEvent`, `tracking.LoadedEvent.page.referringAction` - `Some_Action` (same for the `ClosedEvent`)
    -   [B-299352](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14801099) Added nativeMode to datalayer.
    -   [B-301360](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14873842) Added `BottomNavService.setActiveItem`.
    -   [B-299449](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14805214) Added dynamic component support to bottom sheet (new type `button` is now available).
    -   [B-300780](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14852690) Allow Opt-in to a promotion from promotion/public pages for unauthenticated players.
    -   [B-298294](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14760028) Render canonical tag when `Vanilla.Web.SiteMap` isn't enabled or canonical url is not found in Sitemap.
        -   Extended native app routes to optionally grant access with invalid session key by setting `INativeRouteData.AllowInvalidSession` to `true`. See also [LabelHost.NativeAppRoutes](https://admin.dynacon.prod.env.works/services/117804/features/88044/keys/88062/valuematrix?_matchAncestors=true)

### Vanilla 7.33.0

2018-10-08

-   Shared
    -   Added utilities: `ClaimsPrincipal.FindValue()`, `IPrincipal.AsClaims()`.
    -   Replaced `PerformanceCounter<TEnum>` (now deprecated) by dependency-injected `IPerformanceCounter<TEnum>`.
    -   Replaced `VanillaServiceClientsModule` (now deprecated) by `IServiceCollection.AddVanillaServiceClients()`.
    -   Deprecated `IDeviceRecognitionService` as far as it's intended for internal use only.
-   Desktop
    -   [B-299671](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14814058) Fixed rendering issues for offer buttons
-   Mobile
    -   [B-298176](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14755293) Support anchor scrolling.
    -   [B-297742](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14740669) Support `title-tag` (h1-6) and `title-class` parameters on page matrix components
    -   Added `scope` parameter on `HttpActionResultExtensions` message methods to allow it to be set on server side. Message scope set on api calls via `ApiOptions` will override scope defined on server side. Available in methods (`WithSuccessMessage`, `WithInfoMessage`, `WithWarningMessage`, `WithErrorMessage`)
        -   Usage: `Ok(response).WithSuccessMessage("Success message", scope: "login")`
        -   Methods (`SuccessMessage`, `InfoMessage`, `WarningMessage`, `ErrorMessage`) are now obsolete.
    -   [B-297825](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14743622) Added tracking of user contactability status on login
    -   Added DSL condition for when to show the cookie consent overlay configurable in [dynacon](https://admin.dynacon.prod.env.works/services/116238/features/116110/keys/116692/valuematrix?_matchAncestors=true)

### Vanilla 7.32.0

2018-10-03

-   Shared
    -   [B-298012](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14749976) Implemented resilient Sitecore caching:
        -   Read about inner logic in [docs](http://docs.vanilla.intranet/content-infrastructure.html).
        -   Support for content files is removed and related public code deprecated.
        -   Consumed memory should decrease dramatically because content used to be cached multiple times.
    -   Semantic logging: added support to roll over log files by file size (`rollOnFileSizeLimit="true" fileSizeLimitBytes="524288000"`) and store only configured number of them (`retainedFileCountLimit="10"`).
    -   [B-298547](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14773001) Integrated dedicated Elasticsearch client (NEST) to handle the site metadata publishing.
    -   Added `IsRealMoneyPlayer()`, `GetWorkflowTypeId()`, `GetTimeZone()`, `ToUserLocalTime()` in `Bwin.Vanilla.ServiceClients.Security.Claims.PosApiUserExtensions`.
    -   Deprecated in assemblies:
        -   `Bwin.Vanilla.ServiceClients`: `Extensions` (with methods `ToUserLocalTime()` and `GetClaim()`), `PosApiClaimTypes` (moved to different namespace).
        -   `Bwin.Vanilla.Core`: `JsonWriterExtensions`, `BinaryFormatter`, `DataContractJsonFormatter`, default constructor of `NewtonsoftJsonFormatter` and `StringFormatter`.
        -   `Bwin.Vanilla.Core`: `JsonWriterExtensions`.
-   Desktop
-   Mobile
    -   [B-298503](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14769974) Added tracking options for plain link component. You can now set `data-tracking-event="eventName" data-tracking-keys='["propertyName"]' data-tracking-values='["value"]'` to a sitecore link (or other link that uses `PlainLinkComponent`) and the values will be tracked when the link is clicked.
    -   Fixed: Public pages don't prefetch children hence there are multiple calls to Sitecore.
    -   `RouteParamsService` was deprecated. Use `ActivatedRoute` from angular for pure apps.
    -   `HeaderService.getHeaderHeight` is calculated based on the header slot now when using sticky header.
    -   `PositioningService` is deprecated. Use `@angular/cdk/overlay` with flexible connected to with the next major version of angular.
    -   _(responsive)_ Added arrow to the account badge. Class is configurable via sitecore `arrow-class` parameter.
    -   [B-297723](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14740210) Added tracking of deviceId that is received from native wrapper via CCB event `TRACK_DEVICE_IDFA`.
        -   [B-298431](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14765195) Added "cookie consent" overlay. You can enable this functionality using this [dynacon flag](https://admin.dynacon.prod.env.works/services/112615/features/116110/keys/116112/valuematrix?_matchAncestors=true).
        -   [D-89434](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:14812329) Fixed an issue that caused public page title not to update when navigating between public pages (e.g. with PCMenu).
        -   Support multiple space separated classes to be set with `HtmlNode.setCssClass`.

### Vanilla 7.31.1

2018-10-03

-   Shared
    -   Fixed: If Prerender.io returns a redirect (301, 302) then Vanilla doesn't return it in HTTP response but follows it, then fails with 404 not-found which is incorrectly returned.
-   Desktop
-   Mobile
    -   _(responsive)_ Added arrow to the account badge. Class is configurable via sitecore `arrow-class` parameter.
    -   [D-89434](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:14812329) Fixed an issue that caused public page title not to update when navigating between public pages (e.g. with PCMenu).

### Vanilla 7.31.0

2018-09-20

-   Shared
    -   Introduced semantic logging support by using `Serilog` implementation of `Microsoft.Extensions.Logging.Abstractions.ILogger`. More info and documentation of this feature will follow up in next release(s).
-   Desktop
-   Mobile
    -   Merged fix released with version 7.29.1 (Native feature to keep session alive will in case of expiration redirect user to bwin://{username}/{sso} only for native apps and not wrapper apps.)
    -   Exported `AccountMenuItemBase` to public api.

### Vanilla 7.30.0

2018-09-19

-   Shared
    -   Created new interfaces for PosAPI services which return POCO classes so that you can safely serialize them, use them easily and it reduces code too.
        -   `IPosApiWalletService` which replaces `IWalletService`.
        -   `IPosApiAccountService` which replaces `IAccountInfoService`.
        -   `IPosApiNotificationService` which replaces `INotificationService`.
    -   [B-284921](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3a14313827) Created the new server-only DSL filter for a user group attribute received from the PosApi. Syntax: `User.GetGroupAttribute(string groupName, string attributeName)`.
    -   Changed assembly redirect of `System.Net.Http` from targer _4.2.0.0_ to _4.0.0.0_. This is supposed to get rid of related exception. If it doesn't help then please revert it on your side and let us know.
    -   [B-296153](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14678499) Time guard for dynacon changeset deserialization based on time defined in `DynaConEngineSettings.ChangesPollingInterval`.
    -   [B-289167](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14427642) Added `DateTime` DSL provider for checking and comparing date and time.
        -   Deprecated `IPCFaqItem`, `IServiceClientsConfiguration.UserDataExceptionCacheTime`.
-   Desktop
-   Mobile
    -   [D-89024](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:14752172) Adjusted markup for sticky header (to fix a safari issue)
        -   Added `slot slot-{single/multi} slot-{name}` classes to slots, `app-root` class to `vn-app`/`m2-app`
        -   Moved header content messages to new `messages` slot above the header slot
        -   Added `header_subnav` slot to put product specific navigation in (this will be sticky with the header)
        -   Added `HeaderService.show` and `HeaderService.hide` API (this will hide the header and the top content messages, **but still show** `header_subnav` slot)
    -   [B-297531](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14735364) _(responsive)_ Replace account menu close button with header bar.

### Vanilla 7.29.1

2018-09-14

-   Shared
-   Desktop
-   Mobile
    -   Native feature to keep session alive will in case of expiration redirect user to bwin://{username}/{sso} only for native apps and not wrapper apps.

### Vanilla 7.29.0

2018-09-07

-   Shared
    -   Changed check for mitmatch between requested Sitecore id and returned one in the response to not cause fallback to content files.
    -   Updated _Microsoft.Net.Compilers_ 2.8.2 -> 2.9.0
    -   Added _VanillaFramework_ entry to `/site/version` to make it obvious.
    -   Improved _Details_ in Prerender.io health check.
    -   [B-291361](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14495398) Extended `Vanilla.Features.Seo.Tracking.Wmids` dynacon configuration to allow also two letter country codes e.g. `Google|ru-RU|IT`. - **Note**: rules having a country but no culture take precedence over rules with culture but without country i.e. `Google|*|IT` will be chosen over `Google|ru-RU|*` or `Google|ru-RU`.
    -   Increase Vanilla's dynacon service version to `10` to allow for extended format of the WMID-rules (see above).
        -   [B-295160] (https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14639585) Async resolvers for User Values. `IUserValuesResolver` methods are now obsoletes.
        -   Deprecated `SystemTime.Now` because it is the time from server's timezone which doesn't make sense to use at all.
        -   Deprecated `IFileSystemInfo`, `IDirectoryInfo`, `IFileInfo`, `IHostingEnvironment`, `HostingEnvironmentFactory`, `SynchronousHealthCheck` and related logic.
    -   [B-295158](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14639569) Store static PosAPI data in distributed cache to decrease number of requesto on PosAPI side.
        -   Normalizing `DocumentId` passed to Vanilla Content API: if its `PathRelativity` is `AbsoluteRoot` and the path starts with current configured root node then a new `DocumentId` is used/returned with path without root node and `PathRelativity` set to `ConfiguredRootNode`.
        -   Removed optimization algorithm in DynaCon configuration engine which recently caused P01 incident [INC293599](https://gvcgroup.service-now.com/nav_to.do?uri=incident.do?sys_id=627a7d00dbd0e344a42618fe3b961906) because of too many resources (CPU, memory) consumed during changeset deserialization.
        -   Updated _JetBrains.Annotations_ 11.1.0 -> 2018.2.1
-   Desktop
    -   [D-88030](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A14629030) Fixed unhandled exception on whitespace title for @Html.RenderPMComponentTitle()
-   Mobile
    -   [B-293971](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14597092) Added filtering of when to retry an http request from `ApiBase` service when `retryCount` is specified. By default the retry will only be triggered for these HTTP codes: `0, 408, 502, 503, 504`.
    -   [D-85435](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:14356637) Use css `position: sticky` to resolve performance issue for the sticky header behavior where it becomes sticky after scrolling through content messages. **IMPORTANT**: This change may break your layout - please try to remove your overrides for the fixed positions of header/content messages and any related statically set margins. If necessary, you can revert to old vanilla behavior with a temporary [dynacon](https://admin.dynacon.prod.env.works/services/105573/features/105697/keys/112292/valuematrix?_matchAncestors=true) switch.
    -   Added `HtmlNode.blockScrolling` helper function that blocks scrolling in a standardized way and keeps the scroll position. Note that this is a low level function, and in general for overlays you should make use of `@angular/cdk/overlay` which provides the same functionality out of the box. It's still better to use this rather than just setting `no-scrolling` on the html node.
    -   [D-87402](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A14558361) Removed min-height-fix for iOS devices.
    -   [D-88149](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A14639848) Fix NativeApp value not configured in dynacon: throws only once and then removes native app cookie value
        -   Fixed an issue which prevented certain child items of PC Menu from being set as active.
    -   Fixed an issue with sending `LanguageUpdated` CCb event when 'usersettings' cookie is missing.

### Vanilla 7.28.0

2018-08-25

-   Shared
-   Desktop
-   Mobile
    -   `vn-header-bar` exposes `enabled` input. If not provided, it will fallback to [this config](https://admin.dynacon.prod.env.works/services/105573/features/111793/keys/111795/valuematrix?_matchAncestors=true)

### Vanilla 7.27.1

2018-08-24

-   Shared
    -   Fixed: If Prerender.io is disabled then its health check fails - error accessing disabled configuration.
-   Desktop
-   Mobile

### Vanilla 7.27.0

2018-08-24

-   Shared
    -   [B-293986](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14597788) Added support for [Prerender.IO](https://prerender.io/) service.
        -   It is used to serve optimized version of the website to crawlers e.g. Google search engine. Especially JavaScript is already executed, stripped and HTML changes applied.
        -   It can be configured in DynaCon [Vanilla.Features.Seo.Prerender](https://admin.dynacon.prod.env.works/services/105573/features/111817) feature.
    -   Adding `vanilla:SuppressConflictingSitecoreTemplates` to `<appSettings>` in `web.config` will temporarily suppress the error related to multiple content template classes mapped to a single Sitecore template.
-   Desktop
-   Mobile
    -   _(responsive)_ [B-295237](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14643254) PCMenu now supports multiple levels.
    -   _(responsive)_ [B-291150](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14486315) Fixed rendering of favicons - the condition was wrong again :-)
    -   [B-295559](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14657534) You can now specify the third parameter for `window.open` through `openInNewWindow` menu action. In sitecore add a new parameter `new-window-params` (example value: `width=300,height=400`).
    -   Added `UserService.displayName`. This uses configuration from [dynacon](https://admin.dynacon.prod.env.works/services/105573/features/105697/keys/112152/valuematrix?_matchAncestors=true) to calculate the value that should be used as user display name. It uses first non empty property that is defined in the configuration. This is used to display the name in account menu and header account badge.
    -   [B-295155](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14639465) Added possibility to set classes on avatar and account menu badge in sitecore - `avatar-class`, `avatar-icon-class`.
    -   Showing not-found page also to anonymous users including crawlers (e.g. search engines). So the redirect to home page is removed. Additionally added 404 meta tag for Prerender.io.

### Vanilla 7.26.0

2018-08-21

-   Shared
    -   Fixed background Sitecore content reload released in 7.25.0 version. It was failing because of missing `HttpContext`.
    -   Improved error message if there is a Sitecore content template mapped to multiple document classes.
-   Desktop
-   Mobile
    -   Added empty `m2.v2.bundle.css` to Themes\Mobile\Assets. This enables responsive consumers that are using npm themes to setup `Mobile` as [ActiveTheme](https://admin.dynacon.prod.env.works/services/105573/features/593/keys/595/valuematrix?_matchAncestors=true)
    -   Removed dependency on [FastClick](https://github.com/ftlabs/fastclick) library as it's not needed on modern browsers

### Vanilla 7.25.0

**Warning: Broken Sitecore content reload.**

2018-08-21

-   Shared
    -   If Sitecore content expired just recently then stale content is served immediatelly and background refresh of particular content is triggered. This is supposed to reduce HTTP request processing for users.
    -   Deprecated some unused API in `Bwin.Vanilla.Content`: `IEditorSettings`, `EditorViewModel`, `IDocumentMetadata.CacheTime`, `IFieldConversionContext.ContentService`, `IFieldPostProcessor`, `IFieldPostProcessor`, `FieldMappingBuilder<>`
    -   Changed severity of site map health check from critical to default.
    -   Added cache settings & details to `/health/distributedcache`.
-   Desktop
-   Mobile
    -   _(responsive)_ Fixed an issue that displays empty space when menu item does not have an icon class in the submenus of the account menu
    -   _(responsive)_ Header bar can now be hidden with a [dynacon configuration](https://admin.dynacon.prod.env.works/services/105573/features/111793/keys/111795/valuematrix?_matchAncestors=true)
    -   _(responsive)_ Allow account menu to be displayed without clicking an entry point in old style native apps.
    -   _(responsive)_ Made new [section in sitecore for unauth header items](http://cms.prod.env.works/sitecore/DirectLink.aspx?fo={52D5D44E-BC2D-4751-90E2-E7136B00B78F}&la=), so they can be removed/reordered.

### Vanilla 7.24.0

2018-08-10

-   Shared
    -   Improved `/health/content`:
        -   Added dropdowns culture and path relativity. Removed document type input.
        -   Fixed display of non-success content broken from previous version.
    -   Deprecated `IEditorSettings` and `EditorSettings` because they are meant only for Vanilla internal usage.
    -   Fixed DSL provider `NativeApplication.Name` and related services to return a lower-case string.
-   Desktop
-   Mobile
    -   [B-278042](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14132609) _(responsive)_ Added Bottom Sheet feature (see [API](http://docs.vanilla.intranet/mobile/api/core/BottomSheetService) also can be invoked via menu action `toggleBottomSheet`)
    -   _(responsive)_ The desktop/touch product switcher concept was removed, and replaced with header logo + nav
        -   `HeaderService.toggleProductSwitcher` was deprecated
        -   `HeaderService.productSwitcherVisible` was deprecated
        -   `HeaderService.hideProductSwitcher` was deprecated
        -   `toggleProductSwitcher` menu action is now a noop
    -   _(responsive)_ [B-291150](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14486315) Fixed rendering of favicons - the condition was vice versa :-)
    -   Fix error that happens when sending a message to native apps that do not have native bridge
    -   Added `IsDownloadClientApp` and `IsDownloadClientWrapper` to differentiate between different types of download clients
    -   _(responsive)_ Added classes `native-app`, `native-wrapper`, `native-download-client-app` and `native-download-client-wrapper` to html tag based on the type of native app
    -   `IntlService.formatDate` and `vnDate` pipe was deprecated, because it's pretty much impossible to have javascript `Date` fully work with timezones and daylight saving times. For now I don't see a way to easily add this, so we should stick to converting to user timezone/formatting on the server.

### Vanilla 7.23.0

2018-08-02

-   Shared
    -   Deprecated Autofac `VanillaContentModules` in favor of `IServiceCollection.AddVanillaSitecoreContent()` using _Microsoft.Extensions.DependencyInjection.Abstractions_
    -   Redirect to absolute login page URL now uses protocol-relative `ReturnUrl` query parameter in order to avoid useless `http` -> `https` redirect on _prod_. Example: https://www.partypremium.com/en/labelhost/login?**ReturnUrl=//**casino.partypremium.com/en/casino/lobby
    -   Improved `/health/content` to be more readable and include requested Sitecore URL, time when the content was loaded and editor settings.
-   Desktop
-   Mobile
    -   Changed `path` parameter of `ISimpleMenuFactory` methods to `DocumentId` instead of `string` (old methods are now obsolete)
        -   Note that this will require a cast to `DocumentId` until the obsolete methods are removed in the next major version
    -   Fixed domain and deserialization of `XSRF-AUTH` cookie which was broken in previous version.
    -   [B-291135](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14486107) _(responsive)_ Added support for `PCMenu` page matrix component.
    -   Adapted receiving events from wrapper so it supports stringified JSON in addition to a javascript object (needed for download clients).
    -   Added CCB events
        -   `CCB_INITIALIZED` - this event means that the CCB bride infrastructure has been bootstrapped (clients can answer to events sent by the web, by they shouldn't actively send events yet, because handlers may not have been registered yet).
        -   `APP_INITIALIZED` - this event is sent after all bootstrappers are run (clients can start to actively send events to the web)

### Vanilla 7.22.0

2018-07-31

-   Shared
-   Desktop
-   Mobile
    -   Enhanced Web API anti-forgery to renew tokens also if response code is 401 or 403 or user has changed from previous request. This covers the case of session expiration when first called operation bypassed anti-forgery validation.
    -   Added new parameter `routeValue` to the native event `LanguageUpdated`.
    -   Web Analytics: Fix account menu tracking for routerMode (i.e. for mobile phones).
        -   Renamed `IsNativeVC` to `IsDownloadClient` everywhere (since we also have mac clients, this will make it more clear)
            -   Old methods were deprecated
        -   `IsNativeWrapper` no longer returns true for `download client` apps. **Important**: Check your code for `isNativeWrapper` usages and consider if it should also apply to desktop download clients. For example there is no need to have `if (nativeApplication.isNativeWrapper)` condition around `nativeApplication.sendToNative` calls, as the function itself has a check inside.
        -   Fixed an issue where `page.referrer` was set to the datalayer immediately after page load, incorrectly overriding the original `document.referrer`.

### Vanilla 7.21.0

2018-07-27

-   Shared
    -   Optimized DynaCon configuration engine to not deserialize configs if there are other ones with higher priority covering same context states. Especially useful with multitenancy.
        -   For example if defined context values are: label = [bwin.es, party.com]; nativeApp = [sports, unknown] and actual configs with contexts are:
        -   Priority = 10, label = bwin.es, nativeApp = sports
        -   Priority = 10, label = bwin.es, nativeApp = unknown
        -   Priority = 8, label = bwin.es -> _useless b/c one of previous values will always match first_
-   Desktop
-   Mobile
    -   Fixed `NavigationService` to not restore message queue when `storeMessageQueue` was not specified
    -   Added support for VC apps
        -   new option in [dynacon](https://admin.dynacon.prod.env.works/services/105573/features/94231/keys/94260/valuematrix?_matchAncestors=true) to specify that app is a VC app (`isVC` property, later this will be changed to `mode: "VC"`, but this can't be used yet because Enums...)
        -   CCB events are now sent to `window.external.NativeDispatch` with `eventName` as first parameter and strigified `parameters` as second parameter in case the app is in VC mode
        -   `NativeAppService` on both client and server side has `IsNativeVC` property
        -   new DSL `NativeApplication.IsNativeVC`
    -   Fixed Showing 'NULL' in Edge browser in account menu
        -   _(responsive)_ [B-291150](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14486315) Disabled rendering of favicons and other app icons. Please get in touch with [Honey Badgers](mailto:d.dtp.honeybadgers@gvcgroup.com) once you start using it.
        -   Added a parameter to page matrix layouts to set class on the html node (add `htmlClass` parameter) (hopefully by the time you are reading this the Parameters field has been created)
        -   Updated _ngx-popper_ 2.7.0 -> 4.1.0 (fixes a popper display issue where it sometimes renders it's edge outside of the screen and is repositioned to correct position once scroll is triggered)

### Vanilla 7.20.0

2018-07-20

-   Shared
-   Desktop
-   Mobile
    -   [B-289329](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14432130) When language is changed then we send native event `LanguageUpdated`.

### Vanilla 7.19.0

2018-07-19

-   Shared
-   Desktop
-   Mobile
    -   Fix: correctly export `IntlModule` from `VanillaLibModule`
    -   Fix: `MonthInfo` interface now has correct property name `longName` instead of `name`
    -   _(responsive)_ Added possibility to set Avatar cta link class
    -   _(responsive)_ `no-scrolling` class is now applied also on desktop when account menu is open

### Vanilla 7.18.0

2018-07-19

-   Shared
    -   Refined `INativeAppService` to resolve all properties at once.
    -   Fixed: If culture is not passed in QueryString of RouteDate then it will not be updated in `usersettings` cookie
        -   Moved `AutofacExtensions` from `Bwin.Vanilla.Core.Configuration` to `Bwin.Vanilla.Mvc.AutofacIntegration`.
        -   Added `IHttpContextAccessor` with `GetRequiredHttpContext()` extension method to substitute `Func<HttpContextBase>` in more readable way. It's inspired by [similar interface in ASP.NET Core](https://docs.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.http.ihttpcontextaccessor.httpcontext).
        -   Replaced `DslValueProvider.Create(...)` with a new version which requires the service instance directly. It enforces the service to not have any circular dependencies with `IDslCompiler`.
        -   Deprecated `IClientUserValuesMerger` because it's supposed to be used only internally by Vanilla.
        -   Deprecated `ExpressionParser`.
-   Desktop
    -   [B-291242](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14490327) Created the affiliate tracking tag HTML helper `Html.RenderAffiliateTrackingTag()`.
    -   [B-291291](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14491892) Added `optin-disabled` class to disabled EDS and offer buttons.
-   Mobile
    -   Exported `ResponsiveLanguageSwitcherComponent` to public API
    -   _(responsive)_ Removed current product label from touch language switcher
    -   Added [`vnDate`](http://docs.vanilla.intranet/mobile/api/core/DatePipe) and [`vnCurrency`](http://docs.vanilla.intranet/mobile/api/core/CurrencyPipe) pipes for making date and currency formatting more consistent
        -   `vnDate` converts date to users timezone (this will correctly work for UTC `Date` object or UTC date string - which is by default returned from API controllers), and sets the default format to `short` ([see possible formats here](https://angular.io/api/common/DatePipe))
        -   `vnCurrency` will use the users currency by default and will set display (symbol/code etc.) from [dynacon](https://admin.dynacon.prod.env.works/services/105573/features/105697/keys/109562/valuematrix?_matchAncestors=true)
        -   Both are also available in [IntlService](http://docs.vanilla.intranet/mobile/api/core/IntlService) so you don't have to inject pipes into components and services
    -   Ported `LocaleService.getMonths()` from labelhost to vanilla as `IntlService.getMonths()`
    -   Added `totalBalance` to `BalanceProperties`.
    -   [B-291333](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14493914) Web Analytics: Add click tracking in Sitecore for Account Menu (a.k.a. MiniMenu) under `/App-v1.0/AccountMenu/Main/Menu`.
        -   configurable via HtmlAttribute using the following keys:
            -   tracking.eventName
            -   tracking.data.page.referringAction

### Vanilla 7.17.0

2018-07-13

-   Shared
    -   Changed DynaCon configuration engine to support concurrency e.g. parallel tasks processing same HTTP request.
    -   [B-290878](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14474592) Chat client configuration creation was parameterized to optionally exclude actual chat availability (and hence the related PosApi call). This was done in order to be able to optimize an initial load of mobile pages by excluding the `ChatAvailability` PosApi call.
    -   Improved exceptions from `IPosApiRestClient`: request details are always included (also when deserialization fails), requests headers are included too.
    -   Deprecated `ObjectValidator` and `IEnvironmentProvider.IsLabelMultitenant`.
    -   Fixed `IReCaptchaService.VerifyUsersResponse` throwing `ArgumentNullException` if `usersResponse` is `null`.
    -   Fixed: Some PosAPI user data can't be deserialized when fetched from distributed cache.
    -   Fixed: Retrieval of PosAPI user data sometimes fails (same key being written to local `HttpContext.Items`) because of concurrent calls.
-   Desktop
-   Mobile
    -   _(responsive)_ Added support for routed account menu in hybrid mode. You will need to add following routes if you are still using hybrid mode:
        ```
        .when('/{culture}/menu', {
            template: '<m2-account-menu-view></m2-account-menu-view>'
        })
        .when('/{culture}/menu/:path*', {
            template: '<m2-account-menu-view></m2-account-menu-view>'
        })
        ```
    -   Add `no-scrolling` to `<html>` tag on media query `lt-md` (tablet view also).

### Vanilla 7.16.0

2018-07-09

-   Shared
    -   Added `IAsyncClientConfigurationProvider` to optimize performance:
        -   These providers are executed in parallel hence client should receive the config faster.
        -   Async in general utilizes server resources better.
        -   Vanilla for now implements it for chat configuration.
-   Desktop
-   Mobile
    -   Utilized HTTP/2 Server Push by setting `Link` header to preload `client-bootstrap-scripts.js`.

### Vanilla 7.15.0

2018-07-06

-   Shared
    -   Fixed: Enabling fallback file in DynaCon configuration engine causes `StackOverflowException` hence the app is failing to start.
    -   Updated _Microsoft.Net.Compilers_ 2.7.0 -> 2.8.2.
    -   Moved `FacadeAutofacExtensions` from `Bwin.Vanilla.Core.Reflection.Facade` to `Bwin.Vanilla.Mvc.AutofacIntegration`.
-   Desktop
-   Mobile

### Vanilla 7.14.0

2018-07-05

-   Shared
    -   Multitenancy (serving multiple labels with a single web app):
        -   To enable it, comment out `<forms domain="XXX" />` in `web.config`.
        -   Theme view engine and old asset system are disabled.
        -   Icons in `MobileLayout.cshtml` are not supported. They will be moved to Sitecore.
        -   Native routes are not supported. Instead use e.g. `_nativeApp=sportsw` query string parameter.
        -   Deprecated `ICacheView`, `ObjectCacheExtensions` and `DistributedCache`.
        -   Placeholders `${dynacon:contextProperty}` are being replaced on Vanilla side.
        -   `/health/report` still executes checks only for a single configuration corresponding to HTTP request context (label). This will be addressed in next Vanilla versions.
        -   Steps for you:
            -   Replace usages of `MemoryCache` with `IMemoryCache` or `ILabelIsolatedMemoryCache`.
            -   Replace usages of `DistributedCache` with `IDistributedCache` or `ILabelIsolatedDistributedCache`.
            -   **Code changes must be followed also if you don't plan to support multitenancy because we will support only one code base.**
    -   Added _async_ reCAPTCHA API because it makes external (hence blocking) requests to Hekaton and Google service. Old API is deprecated. Also new `ILabelIsolatedDistributedCache` is used internally which means that failure counter is not in sync with previous Vanilla versions.
    -   Deprecated Autofac modules in favor of _Microsoft.Extensions.DependencyInjection.Abstractions_ in order to be independent from concrete container to allow usage of Vanilla libraries in other solutions e.g. Sitecore, PosAPI.
        -   `VanillaCoreModule` -> `IServiceCollection.AddVanillaCore()`
        -   `VanillaDslModule` -> `IServiceCollection.AddVanillaDomainSpecificLanguage()`
        -   `FakeDslProvidersModule` -> `IServiceCollection.AddFakeVanillaDslProviders()`
        -   `VanillaDynaConModule` -> `IServiceCollection.AddVanillaDynaConConfigurationEngine()`
        -   `HekatonModule` -> `IServiceCollection.AddVanillaHekatonDistributedCache()`
    -   Moved `RegisterDslValueProvider()` to `Bwin.Vanilla.Mvc.AutofacIntegration` and added `IServiceCollection.AddDslValueProvider()`.
    -   Moved `AutoLoadModuleAttribute` to `Bwin.Vanilla.Mvc.AutofacIntegration`.
    -   Changed `ISignUpBonusResolver` to not log an error if bonus is not found.
    -   [B-287521](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14384612) Changed web session timeout to use timeout from _Vanilla.Web.Authentication_ feature in DynaCon instead of `<sessionState timeout="..." />` in `web.config`.
        -   Added `__durations` client config containing execution durations of other `IClientConfigurationProvider`-s.
        -   Extended static asset handling to support and prefer _Deflate_ compression.
        -   Added logging of exception details to `/health/log`.
        -   Fixed merging of configuration JSON when there are dynamically evaluated variation context properties or their hierarchy is involved.
        -   Improved display of multiple configuration instances for a single _feature_ in `/health/config`.
-   Desktop
-   Mobile
    -   Added a new way to register bootstrap assets
        -   Replaces `IMobileAppConfigurationBuilder` methods like `SetScripts`, `SetAssetStyleSheets` etc. (which are now obsolete)
        -   Instead implement `IBootstrapAssetsProvider` ([example](https://vie.git.bwinparty.com/vanilla/TestWeb.M2/blob/master/source/Bwin.Vanilla-M2.TestWeb.Playground/BootstrapAssetsProvider.cs))
        -   Some useful helpers were added to vanilla accessible through `IBootstrapAssetsContext` which is passed to `IBootstrapAssetsProvider.GetAssets` method
    -   `html` node attribute `data-domain` is now deprecated. Instead you should make use of a new `data-label` attribute.
        -   While the `data-domain` has value like `.bwin.com`, `data-label` instead will have `bwin.com` (without the leading dot)
        -   This is to stay consistent with changes to `IEnvironmentProvider`
    -   Added a [helper directive for tracking](http://docs.vanilla.intranet/mobile/api/core/TrackingDirective) that can be added to any element
    -   Native Wrapper Apps - Keep session alive after user logs in
    -   _(responsive)_ [B-287699](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14389054) Menu now opens as a route on mobile devices
        -   To make this work, you need to add [VANILLA_ROUTES](http://dev.docs.vanilla.intranet/mobile/api/pure/VANILLA_ROUTES) to your routes
    -   _(responsive)_ Added classes `responsive`, `device-mobile` (tablet or mobile phone), `device-tablet`, `device-mobile-phone`, `device-touch` and `device-desktop` base on the type of device
    -   _(responsive)_ Added `isMobilePhone`, `isMobile`, `isTablet` and `isTouch` properties to `DeviceService`
    -   [B-273797](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14004832) Added the possibility to cache client configurations with a far future expiration header. Implement `Bwin.Vanilla.Mvc.Ng.ClientConfig.ICachableClientConfigurationProvider` instead of `IClientConfigurationProvider`. Use the Property `VaryBy` to version your configurations.
    -   [D-85833](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:14413038) Allow anonymous for logout calls => solves 401 error on interceptors of premium labels
    -   [B-289115](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14426372) Added tracking parameters to content messages. You can put `tracking.LoadedEvent` and `tracking.ClosedEvent` (in sitecore) to specify the name of an event to track when message is shown to the user and/or closed.
    -   [B-289626](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14441007) Throw an exception when autologin fails.

### Vanilla 7.13.0

2018-06-14

-   Shared
    -   Extended `IEnvironmentProvider` and `ICookieConfiguration` to be prepared for multitenancy - handling multiple labels by the website based on URL hostname of current HTTP request.
    -   Executing `IPosApiRestRequestBuilder`-s from Vanilla as first ones.
    -   Fixed: If configuration fallback file is enabled then app fails to start with circular reference error related to Hekaton cache.
-   Desktop
-   Mobile
    -   Disabled layout overrides using `_layout` query string parameter.

### Vanilla 7.12.0

2018-06-12

-   Shared
    -   Deprecated `Bwin.Vanilla.Core.Ioc.VanillaDecorator` as far as it wasn't used anywhere and it brings additional dependencies.
    -   Added `BonusStages` with constants for PosAPI CRM service.
    -   [B-275891](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14079201) Added support for customizing Vanilla application's culture format in Dynacon by specifying overrides (in the new `CultureOverrides` property). Technically the overrides customize the `CultureInfo` format properties so **it applies to the server-side rendering only, the Angular culture format is not affected by this functionality.**.
    -   [B-283384](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14268731) Changed the `QueryStringToCookie` configuration to a dictionary. Updated to dynacon service version `Vanilla:9`.
    -   [B-285257](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14322464) Service clients infrastructure is now entended and supports other services that are based on POSApi Foundation (i.e. Betting POS). Concrete BPOS support will be part of next labelhost release.
    -   Added _Vanilla.Services.Caching.Distributed_ -> _ActiveCache_ configuration in DynaCon.
        -   It's supposed to allow seamless switch between distributed cached.
        -   It replaces _Vanilla.Services.Caching.Hekaton_ -> _IsEnabled_ which isn't used anymore.
        -   Thus Hekaton configuration must be always valid when the package is installed.
    -   Updated **NUnit** 3.5.0 => 3.10.0
        -   `VanillaAssertionHelper` was deprecated (use `Assert.That`, [NUnit.ExpectStatic](https://github.com/fluffynuts/NUnit.StaticExpect), or [FluentAssertions](https://fluentassertions.com/))
    -   [D-84027](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A14204594) Make DSL fail on compilation when incompatible types are compared.
    -   [D-85413](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A14355209) Fixed: reload of DeviceAtlas data fails because of missing `HttpContexed`.
    -   Increased web session timeout to `<sessionState timeout="120" />` in `template.web.config`.
    -   Storing recaptcha result in `HttpContext.Items` for client IP and Area to guard against duplicate calls.
    -   [B-283805](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14278998) Added auto login action filter to handle requests with ssoToken of a valid session on query string.
        -   [B-286452](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14352612) Storing PosAPI user data in distributed cache in order to increate cache hits when user hits various servers behind load balancer.
            -   Make sure your user data classes can be correctly (de)serialzied using Netwonsoft.JSON.
            -   If you are developing shared plugin then make sure cache keys match between products on a label.
    -   [B-286420](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14352102) Added list of known environment prefixes [dynacon](https://admin.dynacon.prod.env.works/services/105573/features/94303/keys/106220/valuematrix?_matchAncestors=true)
        -   Made content property `PreviewHost` on `ContentConfigurationBuilder` obsolete. Property `PreviewHost` on `IContentConfiguration` is calculated from Host by removing known environment prefix and prepending `preview`.
        -   Registered `IFileProvider` from _Microsoft.Extensions.FileProviders.Abstractions_ as instance of `PhysicalFileProvider` initialized with ASP.NET root folder. This will replace usage of `System.IO.Abstractions` in Vanilla 8 so we recommend to refactor the code.
        -   Updated NuGet packages:
            -   _Microsoft.Extensions.Caching.Abstractions_ 2.0.1 -> 2.1.0
            -   _Microsoft.Extensions.Caching.Memory_ 2.0.1 -> 2.1.0
            -   _Microsoft.Extensions.DependencyInjection.Abstractions_ 2.0.1 -> 2.1.0
-   Desktop
-   Mobile
    -   [B-283884](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14286697) Support for specifying SEO page title and meta tags in DynaCon in [Vanilla.Features.Seo.MetaTags feature](https://admin.dynacon.prod.env.works/services/89887/features/103883).
        -   Added `MetaTagsService` which replaces deprecated `PageService`. Using `PageService` may lead to inconsistent title and meta tags.
    -   [B-284972](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14315061) Anti-Forgery improved. Vanilla adds new cookie 'XSRF-AUTH' which contains previous user details and last used session id. Meant for consumers to diagnose.
    -   Added possibility to run arbitrary client side DSL expression `window.vanillaApp.diagnostics.evaluateDsl(<expression>)` for debugging purposes.
    -   [B-285600](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14329197) Loading indicator will now be triggered after navigation to an external url
        -   delay before the indicator is show can be configured in [dynacon](https://admin.dynacon.prod.env.works/services/89887/features/94448/keys/105389/valuematrix?_matchAncestors=true)
        -   you can also configure the [default delay for loading indicator](https://admin.dynacon.prod.env.works/services/89887/features/94448/keys/105384/valuematrix?_matchAncestors=true), that is used for things like post ajax request and route navigation transitions
    -   Added request retry functionality to [ApiBase](http://docs.vanilla.intranet/mobile/api/core/ApiBase) (`retryCount` and `retryDelay` options).
    -   All scroll/touch events are now subscribed to outside of angular zone - change detection is only triggered when it's required.
    -   [B-285604](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14329292) _(responsive)_ Page background is now persisted with a cookie, and `body` styles can be specified with parameters `body.<css-style>`.

### Vanilla 7.11.6

2018-06-05

-   Shared
-   Desktop
-   Mobile
    -   Add `withCredentials` option to `ApiBase`. (This may be needed for external calls because of the cloudfare).
    -   Send cookies with `/log` requests
    -   Fix `error-handler.js` syntax error from previous patch

### Vanilla 7.11.5

2018-06-04

-   Shared
    -   Fixed: `PosApiException` does not get legacy properties initialized correctly - `HttpCode`, `ErrorCode`, `ErrorMessage`, `ErrorValues` of parent `ServiceException`. This causes for example some exceptions to be logged incorrectly.
    -   Fixed legacy logging of error from PosAPI from _error_ back to _info_ for session and user token expiration (PosAPI codes 207, 208) and not found _BankAccountInfo_ (PosAPI code 1454) called by LabelHost.
-   Desktop
-   Mobile
    -   Add [configurable](https://admin.dynacon.prod.env.works/services/89887/features/94448/keys/106226/valuematrix?_matchAncestors=true) delay before external navigation.

### Vanilla 7.11.4

2018-05-29

-   Shared
    -   Fix failure due to recaptcha validation being called twice
-   Desktop
-   Mobile

### Vanilla 7.11.3

2018-05-29

-   Shared
-   Desktop
-   Mobile
    -   Loading indicator triggered by external navigation is now closed after some time.

### Vanilla 7.11.2

2018-05-25

-   Shared
-   Desktop
-   Mobile
    -   Header is now always sticky when there are no content messages.
    -   All scroll/touch events are now subscribed to outside of angular zone - change detection is only triggered when it's required.

### Vanilla 7.11.1

2018-05-22

-   Shared
-   Desktop
-   Mobile
    -   [B-285600](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14329197) Loading indicator will now be triggered after navigation to an external url
        -   delay before the indicator is show can be configured in [dynacon](https://admin.dynacon.prod.env.works/services/89887/features/94448/keys/105389/valuematrix?_matchAncestors=true)
        -   you can also configure the [default delay for loading indicator](https://admin.dynacon.prod.env.works/services/89887/features/94448/keys/105384/valuematrix?_matchAncestors=true), that is used for things like post ajax request and route navigation transitions

### Vanilla 7.11.0

2018-05-08

-   Shared
    -   [B-283918](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14288099) Implemented content aware model state validations for web api. Read more in [docs](http://docs.vanilla.intranet/guides-localize-api-modelstate-errors.html).
    -   [B-283090](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14262299) Removed `user.profile.userID` from the data layer tracking (GDPR compliance requirement).
    -   Extension methods on `UriBuilder`:
        -   Added `GetRelativeUri()`, `AddQueryParametersIfValueNotWhiteSpace()`.
        -   Deprecated `GetRelativeUrl()`, `AddQueryParameters(IEnumerable<KeyValuePair>)`, `AddQueryParameter()`.
    -   Added `PosApiSerializationTester` for easier testing serialization of PosAPI data objects.
    -   Created `IPosApiCommonService` which replaces `ICommonDataService`. It returns POCO classes so that you can safely serialize them, use them easily and it reduces code too.
    -   Added `PosApiException` which is simpler version of `ServiceException` which was deprecated.
    -   Added more explicit `Bwin.Vanilla.ServiceClients.Security.Claims.Local.LocalClaimsProvider` instead of `Bwin.Vanilla.ServiceClients.Services.ILocalClaimsProvider` which was deprecated.
        -   If you change the name of the issuer of your claim (keeping its type) then during the rollout it won't match already cached claims from the previous version of your app resulting in failed client bootstrap and not working application. **So we suggest to set the issuer name to old value - type of particular LocalClaimsProvider.** (ie. Bwin.Plugins.MobileSports.Components.Claims.MobileSportsLocalClaimsProvider)
    -   [D-84546](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A14254871) Added `EligibleLoginNameClaimTypes` to feature `Vanilla.Web.Authentication`. Used to check if the user name provided for login is reflected in any claim. An error will be logged if it cannot be matched.
    -   [B-283792](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14278373) Added a new [dynacon switch](https://admin.dynacon.prod.env.works/services/89887/features/76369/keys/104397/valuematrix?_matchAncestors=true) to remove forms authentication style handling of authentication cookie. Once all products on a particular label are updated at least to this version of vanilla, the switch can be disabled, and the application will gracefully start using the owin cookie data format. Users that are currently logged in with the old cookie will still be logged in, and when their token is refreshed (half of timeout), the new cookie will be written with the new data format.
    -   [B-283792](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14278373) To accomodate the above change we changed to `<authentication mode="None">` in `template.web.config` (was `mode="Forms"` before). This whole section will later be removed.
    -   [B-283792](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14278373) `IFormsAuthentication` was made obsolete since we only use OWIN now.
        -   for `IFormsAuthentication.CookieDomain` => use `ICookieConfiguration.Domain`
        -   make sure to check your code for usages of static `FormsAuthentication` class and remove these usages
    -   [D-84046](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A14208882) Fix retrieving device data via PosAPI failed
-   Desktop
-   Mobile
    -   Added API to override highlighted product in the responsive header (`HeaderService.highlightProduct()`).
    -   Added performance optimization for `CookieDslValuesProvider` to only run code in zone when cookies change, because running code in zone (`zone.run`) triggers change detection/$digest.
    -   Correctly return 404 for not found public pages from the content rest API
    -   [B-283068](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14261748) Added `Theme` property to `IUserInterfaceConfiguration`. This will eventually replace the `ActiveTheme` property from the old asset system.
    -   Made `ApiResponse` and `ApiError` on `VanillaApiController` obsolete. `IHttpActionResult` related infreastructure should be used instead.

### Vanilla 7.10.1

2018-04-26

-   Shared
    -   Fixed diagnostic pages built using Angular from [CDN](https://unpkg.com) (`/healh/dsl`, `/health/claims`, `/health/log`) because [new major version of RxJS](https://www.npmjs.com/package/rxjs) has been released. It contains a breaking change in file structure (`operators.js` vs `operators/index.js`). Vanilla unfortunatelly referenced the latest version and automatically picked it up.
    -   Fixed bug with failing publication of the site metadata to the Elasticsearch introduced in the Vanilla `7.9.0`.
    -   Added `sortableVanillaVersion` to the site metadata that are published to the Elasticsearch.
-   Desktop
-   Mobile

### Vanilla 7.10.0

2018-04-23

-   Shared
    -   [B-277387](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14115707) Updated Hekaton implementation to use new Hekaton stored procedures that address the latches issue. **After an update to this or newer Vanilla version, it's strongly recommended to perform thorough functional testing of your applications to avoid any trouble with Hekaton during the World Cup!** Change request for related DB changes: [CHG066787](https://gvcgroup.service-now.com/nav_to.do?uri=change_request.do?sys_id=904d262adb959b48ee92d3ca4b9619ed%26sysparm_view=portal).
    -   [B-275805](https://www52.v1host.com/GVCGroup/story.mvc/summary?oidToken=Story%3A14076512) Added new DSL method on User provider to return users registration trackerId (`User.AffiliateInfo`).
    -   [B-282613](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14247605) Added new infrastructure for implementing PosAPI service clients. Read more in [docs](http://docs.vanilla.intranet/service-clients.html).
        -   Deprecated old infrastructure related to service clients: `PosApiServiceBase`, `IPosApiHttpClientFactory` and related classes.
            -   Please implement logging on your side and try out disabling legacy logging done by Vanilla infrastructure by adding `<add key="vanilla:DisableServiceClientsLogging" value="true" />` to `<appSettings>` in _web.config_ because it will be removed in Vanilla 8.
        -   Set flags in `IRestClient` to slightly optimize performance: `AutomaticDecompression`, `KeepAlive`, `AllowAutoRedirect`, `AllowWriteStreamBuffering`.
        -   Deprecated old REST infrastructure (`IRestRequestFactory` with related classes and extension methods). Use `IRestClient` instead.
        -   [D-84218](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:14228239) Fixed infinite loop on first request to device atlas when resolving of PosAPI request parameters required a DSL which again tried to fetch device atlas.
        -   Fixed issue with the `WebpageIdentifierProvider` throwing an error when the chat was disabled.
        -   Added `/health/log` diagnostic page.
-   Desktop

    -   [B-281609](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3a14224590) Added support for the callback in the `triggerEvent` tracking method that gets executed once the event is pushed and handled by a tag manager.

-   Mobile
    -   Updated npm packaged
        -   `@angular` _5.2.7_ -> _5.2.9_
        -   `@angular/flex-layout` _5.0.0-beta13_ -> _5.0.0-beta14_
        -   a few other dependencies (`zone.js`, `ngx-cookie`, `rxjs` etc...)
    -   [B-282298](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14239422) Added dependency on `@angular/material` (we will use the `dialog` module for the responsive modal dialogs)
    -   [D-84201](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:14224898) Added `{culture}` to `/api/{culture}/balance/refresh` call. Old endpoint is still available, but it's deprecated and will be removed in next major version.
    -   Moved `PlainLinkDirective` to `@vanilla/core`
    -   [B-281526](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14221465) Header will now become fixed after scrolling bellow last header content message.
        -   Header content messages were moved outside of the header
        -   Added new slot `header_bottom_items`
        -   Added new slot `header_top_items` - this replaces `header_items` which will be removed in the next major version
        -   Components that should be fixed as part of the header must be put into one of the header slots
        -   Added new service to easily access selected elements across the site (see [docs](http://docs.vanilla.intranet/mobile/api/core/ElementRepositoryService))
    -   [B-281526](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14221465) Content messages now support `closeIcon` parameter.
    -   [D-84426](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A14247378) Fixed: Email is not populated by default on contact page for a logged in user.
    -   [B-281609](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3a14224590) The `triggerEvent` tracking method now returns a promise that gets resolved once the event is pushed and handled by a tag manager.

### Vanilla 7.9.5

2018-05-04

-   Shared
-   Desktop
-   Mobile
    -   Added performance optimization for `CookieDslValuesProvider` to only run code in zone when cookies change, because running code in zone (`zone.run`) triggers change detection/$digest.

### Vanilla 7.9.4

2018-04-26

-   Shared
    -   Fixed diagnostic pages built using Angular from [CDN](https://unpkg.com) (`/healh/dsl`, `/health/claims`, `/health/log`) because [new major version of RxJS](https://www.npmjs.com/package/rxjs) has been released. It contains a breaking change in file structure (`operators.js` vs `operators/index.js`). Vanilla unfortunatelly referenced the latest version and automatically picked it up.
    -   Fixed bug with failing publication of the site metadata to the Elasticsearch introduced in the Vanilla `7.9.0`.
    -   Added `sortableVanillaVersion` to the site metadata that are published to the Elasticsearch.
-   Desktop
-   Mobile

### Vanilla 7.9.3

2018-04-19

-   Shared
    -   Fixed issue with the `WebpageIdentifierProvider` throwing an error when the chat was disabled.
-   Desktop
-   Mobile

### Vanilla 7.9.2

2018-04-18

-   Shared
-   Desktop
-   Mobile
    -   [D-84426](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A14247378) Fixed: Email is not populated by default on contact page for a logged in user.

### Vanilla 7.9.1

2018-04-18

-   Shared
    -   Fixed: Login fails if `LoginParameters.DateOfBirth` is specified (e.g. on _bwin.fr_) because it's serialized in incorrect format that PosAPI can't read.
-   Desktop
-   Mobile

### Vanilla 7.9.0

2018-04-06

-   Shared
    -   Fixed: POST REST requests (executed by `IRestClient`) with no content in body fail on destination server because `Content-Length` header is required. Example of such requests are _Logout_, _FinalizeWorkflow_ or _SkipWorkflow_ on PosAPI.
    -   Deprecated `BackupPrincipalAttribute` because user should be get from/set to `HttpContextBase.User` or `ICurrentUserAccessor.User` instead of static `Thread.CurrentPrincipal`.
    -   [B-281450](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14219813) Added property `Order` to `Bwin.Vanilla.Core.Configuration.AutoLoadModuleAttribute` to optionally specify the order in which autofac modules are registered (- higher means later).
    -   Added async methods on `IClientConfigurationMerger` in preparation for the future where client config providers will be async (the sync methods are now deprecated)
        -   For desktop this means that client config is no longer rendered directly on `DefaultLayout` but instead referred by a script tag `src`
    -   [B-280448](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14194337) Added `Bwin.Vanilla.DomainSpecificLanguage.Placeholders.IPlaceholderCompiler`.
        -   It's a replacement for `IPlaceholdersReplacer` from old Vanilla versions.
        -   Read [docs](http://docs.vanilla.intranet/domain-specific-language.html#placeholder-expression-usage) regarding the usage.
        -   **Don't forget to log warnings after compilation of placeholder expression.**
-   Desktop
    -   [B-280648](https://www52.v1host.com/GVCGroup/story.mvc/summary?oidToken=Story%3A14200879) Signup bonus dialog not displayed for trackers associated to campaigns
-   Mobile

### Vanilla 7.8.0

2018-03-30

-   Shared
    -   Fixed references in `template.web.confg` to ASP.NET MVC 5.2.4. This wasn't causing any issue anyway.
    -   Updated NuGet packages:
        -   _Microsoft.Net.Compilers_ 2.6.1 -> 2.7.0.
        -   _FluentAssertions_ 5.1.2 -> 5.2.0.
        -   _Microsoft.Extensions.Caching.Abstractions_ 2.0.0 -> 2.0.1.
        -   _HtmlAgilityPack_ 1.7.0 -> 1.7.1.
    -   [B-278738](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14151076) QueryStringToCookie can specify 00:00:00 expiration to expire when browser session ends
        -   Added `OfferStatuses` class with constants.
        -   Added `DeviceId` and `Fingerprint` to `Bwin.Vanilla.ServiceClients.Model.Authentication.PidLoginParameters`.
        -   Deprecated `UserName` in favor of `Username` on `LoginParameters` and `PidLoginParameters` to be consistent with PosAPI.
        -   Sitecore template generator is now console app distributed via `@vanilla/sitecore-template-generator` npm package.
            -   Using it will remove unnecessary dependency on `MSBuild` and `Vanilla.Build.targets`
            -   Old `MSBuild` task will still be supported for now
            -   See example [gulp usage](https://vie.git.bwinparty.com/snippets/72)
-   Desktop
    -   [B-278672](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14148397) Client-side remote logging is now throttled (same errors are grouped and has a maximum of errors sent per request in addition to debouncing of request)
    -   [B-280854](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14205014) The `RenderAffiliateTracking` helper method replaced with a dedicated client config `bwin.config.affiliateTracking`
-   Mobile
    -   [B-280643](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14200476) Title class can now be specified on `vn-header-bar` (`titleCssClass`)
    -   Added `PositioningService` that can be used to relatively position `HTML` elements dynamically

### Vanilla 7.7.0

2018-03-21

-   Shared
    -   [B-277552](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3a14120566) Genesys chat integration changes:
        -   Chat configuration moved to the `Bwin.Vanilla.Mvc` project.
        -   Added the `WebpageIdentifierProvider` that provides a website identifier used by the Genesys chat and the Genesys API.
        -   Added the `ChatAvailabilityProvider` that provides the pull/push chat availability, an agent availability and information whether the chat service is (or is not) currently operating within its service hours.
    -   Support for recursive loading of nested [proxy content items](http://docs.vanilla.intranet/guides-load-content-from-cms.html#proxy-items) (proxy with a rule targeting another proxy).
    -   Fixed: DSL expression with `NOT` operator in front of a comparison (which is anyway discouraged usage) breaks when serialized to client expression for client-side evaluation (filtering, proxy items, placeholders...) e.g. `NOT User.AccountBalance > 100`.
-   Desktop
-   Mobile
    -   [B-278307](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14138351) Client-side remote logging is now more throttled (groups similar errors and has a maximum of errors sent per request in addition to already present debouncing of request), and uses [dynacon configuration](https://admin.dynacon.prod.env.works/services/89887/features/92325).
    -   [B-271438](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13921568) Client-side DSL now supports [proxy items](http://docs.vanilla.intranet/guides-load-content-from-cms.html#proxy-items).
    -   [B-271437](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13921551) Client-side DSL now supports [placeholders](http://docs.vanilla.intranet/content-filtering-and-placeholders.html#content-placeholders).
    -   Added `active` observale and `isActive` boolean to `OverlayService` to indicate whether or not the overlay is currently shown.

### Vanilla 7.6.0

2018-03-15

-   Shared
    -   Renamed `Bwin.Vanilla.ServiceClients.Mocking` to `Bwin.Vanilla.Rest.Mocking` because it can be used to mock any REST requests.
    -   Exposed infrastructure in `Bwin.Vanilla.Rest.Mocking` so that you can use it too: implement `RestMocker` and register it in Autofac as `IRestMocker`.
    -   [D-83380](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A14133181) Fixed and improved error reporting in the Content Services health check
    -   [B-277625](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3a14122372) Added Device Atlas capabilities to identify search-engine crawler during language resolution
-   Desktop
-   Mobile
    -   [B-276909](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14102246) Added the @Input to set a scope on `vn-message-panel` so that it shows only messages with matching scope.
    -   [B-276909](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14102246) Added a property to set a messageQueueScope on api calls via `ApiOptions`. The given scope will then be set on the success and error messages returned in server's response.

### Vanilla 7.5.0

2018-03-09

-   Shared
    -   [D-83214](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A14110365) Fixed: Broken configuration proactive validation - missing `CommitId`.
    -   [B-278355](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14139566) Extended `IValueSegment` with additional parameters.
    -   Fixed duplicate `<defaultProxy>` in `template.web.config`.
    -   Deprecated `ICurrentPrincipalProvider` in favor of `ICurrentUserAccessor` within `Bwin.Vanilla.ServiceClients` assembly.
    -   [B-278355](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14139566) Deprecated `IUserDataService` in favor of `IWalletService` within `Bwin.Vanilla.ServiceClients` assembly.
    -   [B-278355](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14139566) Extended `IUserBalance` with additional parameters.
        -   Fixed: _Vanilla.Services.ServiceClients_ in `/health/config` contains irrelevant properties related to dynamic proxy object.
-   Desktop
-   Mobile
    -   [B-277952](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14129954) Added handling of `LOGOUT` native wrapper event (wrapper -> web)
    -   Update Angular _5.2.1_ -> _5.2.7_
    -   Update `@angular/flex-layout` _5.0.0-beta12-1_ -> _5.0.0-beta13_
    -   `ContentDslService` was deprecated, use `DslService` instead
        -   method `evaluate` was deprecated, use `evaluateContent` instead

### Vanilla 7.4.0

2018-03-02

-   Shared
    -   [B-277260](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14111900) Global meta tags migrated from Sitecore to DynaCon configuration `Vanilla.Web.Seo.GlobalMetaTags`
        -   `OfferStatus` enum was deprecated
        -   Deprecated `OfferStatus` methods of `INotificationService` in favor of `OfferStatusString` methods.
        -   Improved `/health/dsl`:
            -   Support for sharing a tested expression via URL automatically updated in browser.
            -   Added progress indicator during expression evaluation.
            -   Fixed: Initial load of available DSL providers may fail (especially on desktop) if the website wasn't accessed before.
            -   Fixed: Empty browser URL propagates to current values of available DSL providers therefore showing weird values.
-   Desktop
-   Mobile
    -   `OfferStatusType` was deprecated on `offer-button-component.ts` and `eds-button-component.ts`, since `OfferStatusController` methods now return raw string values from the Api
    -   [B-272428](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13957920) Made `IClientContentService` related infrastructure public (see [docs](http://docs.vanilla.intranet/guides-load-content-from-cms.html#client-content-service) about how to use it)
    -   [D-83308](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:14119360) Fixed an issue that prevented `NativeApp` cookie from being written when url would cause sign up bonus redirect

### Vanilla 7.3.0

2018-02-27

-   Shared
    -   [B-276571](https://www52.v1host.com/GVCGroup/story.mvc/summary?oidToken=Story%3A14093376) Added new Offer DSL providers `Offer.IsOffered(offerType, offerId)` and `Offer.GetStatus(offerType, offerId)`.
    -   Added library _Microsoft.Extensions.Caching.Abstractions_ to slowly start migration to .NET Standard and .NET Core.
    -   Updated NuGet packages:
        -   _Microsoft.AspNet.Mvc_ 5.2.3 -> 5.2.4.
        -   _Microsoft.AspNet.WebApi.WebHost_ 5.2.3 -> 5.2.4.
        -   _Microsoft.AspNet.WebApi.Client_ 5.2.3 -> 5.2.4.
        -   _HtmlAgilityPack_ 1.6.13 -> 1.7.0.
        -   _Moq_ 4.2.1409.1722 -> 4.8.2.
        -   _FluentAssertions_ 4.19.4 -> 5.1.2.
-   Desktop
-   Mobile

### Vanilla 7.2.0

2018-02-23

-   Shared
    -   Improved `/health/dsl`:
        -   Added selectable _Result Type_ of the expression.
        -   Fixed: mocked _Browser URL_ is not used in current provider values shown below.
    -   [B-268710](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13812155) Added `/health/claims` diagnostics page.
    -   [B-261892](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13542129) Updated UserDslProvider to throw if any exception occurs
    -   [B-274351](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14024905) Added possibility to specify `Timeout` for POS Api requests via [dynacon](https://admin.dynacon.prod.env.works/services/89887/features/202/keys/99642/valuematrix?_matchAncestors=true)
    -   Updated NuGet packages:
        -   _Autofac.Extras.DynamicProxy_ 4.2.1 -> 4.4.0
    -   Changed logic for the `WebSiteUrl` parameter of the chat configuration. Now it supports also the labels that have their names containing more than two substrings, e.g. `nj.partycasino.com` or `sportingbet.co.za`.
-   Desktop
    -   [B-261050](https://www52.v1host.com/GVCGroup/story.mvc/summary?oidToken=Story%3A13509926) Added `clientIP` to the `bwin.config.userInfo` object.
    -   [B-261050](https://www52.v1host.com/GVCGroup/story.mvc/summary?oidToken=Story%3A13509926) Added `ClientIP` to the user data that are sent to Genesys while starting a chat using the `genesysWebChat.js` library.
    -   Fixed inconsistent global HTML meta tags between languages.
-   Mobile
    -   [B-261050](https://www52.v1host.com/GVCGroup/story.mvc/summary?oidToken=Story%3A13509926) Added `clientIP` to the `UserService`.
    -   [B-276805](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14099529) Added `balanceProperties` to `UserService`
        -   These are used in the responsive menu
        -   There is a new way to refresh balance on the client - `return Ok().RefreshBalance()` - this will refresh `balanceProperties` and `balance`. This was previously done with `x-bwin-balance` header, which only updates `balance` => this approach is now deprecated.
        -   `ApiHeaderInterceptor` was deprecated since the balance refresh was it's main use
    -   `SimpleMenuFactory` now supports additional parameters from sitecore in `Parameters` property
    -   [B-276805](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14099529) Added [ngx-popper](https://github.com/MrFrankel/ngx-popper) library as a dependency
        -   This is used for info popovers for the responsive solution
    -   Background images will now be only set when responsive mode is enabled
    -   Updated `PlainLinkDirective` to have all features from labelhost version, and added handling of `target` attribute

### Vanilla 7.1.1

2018-02-20

-   Shared
    -   Fixed: Keys for distributed cache do not match with previous Vanilla versions (especially for cached claims).
-   Desktop
-   Mobile

### Vanilla 7.1.0

2018-02-14

-   Shared
    -   [B-273678](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13999284) Added timer to DynaCon configuration engine which periodically requests validatable changesets in order to protactively validate them and find errors. These are for examples changesets waiting for approval.
    -   Added listing of all HTTP calls to DynaCon service to `/health/config`.
    -   Added `DynamicVariationContextForThisRequest` to `/health/config`.
    -   [B-273912](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14008999) Replaced `core.bundle.css` with `core.v2.bundle.css`
    -   Fixed wrong culture during redirect to login page
    -   [B-271010](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13898184) Added `Warnings` to result from `IDslSyntaxValidator`.
    -   Changed `IContentConfiguration.RequestTimeout` to be greater than zero. Value in DynaCon is already aligned.
    -   Refined handling of `ReflectionTypeLoadException` in `VanillaPerformanceCounterInstaller` to always expose `LoaderExceptions`.
    -   [B-275501](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14068647) Forced two decimal digits in a currency for all cultures.
    -   [D-82757](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A14046180) Fixed: `/health/dsl` page completely fails to load if any provider fails to return current value.
    -   Showing warnings of tested DSL expression at `/health/dsl`.
-   Desktop
    -   [B-273911](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14008964) Updated teaser's display template
        -   [D-82662](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:14030667) Fixed assigning of `first` and `last` classes on personal button messages.
    -   Moved culture name to configuration value `bwin.config.language.cultureName`
    -   [B-275299](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14063351) Updated RTMS logging to be environment-dependent
-   Mobile
    -   [B-273918](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14009212) Added new version of page matrix templates that are meant to be responsive (they are used if `UseResponsiveFeatures` flag is `true`)
    -   [B-273918](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14009212) Added [ProfilesDirective](http://docs.vanilla.intranet/mobile/api/core/ProfilesDirective) which should replace `PictureWithProfilesComponent`
    -   [B-273747](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14002432) The `AppInfoConfig` added to the list of configs to be downgraded and registered in the `m2.config` so that it's usable in AngularJS.
    -   [B-274924](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14046617) Added possibility to set background image on any page (see [docs](http://docs.vanilla.intranet/mobile/guide/background-image))
    -   [B-273915](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14009129) Added new DSL providers `Media.isActive()` and `Media.Orientation`. They can only be evaluated by client side DSL.
    -   [B-274499](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14030691) Added decibel integration parameter `user.decibelID` into the DataLayer.

### Vanilla 7.0.1

2018-01-31

-   Shared
    -   Removed all fields of `IBaseTracking` content template and ignored them in `BaseTemplateMappingProfile` so that they are not again regenerated in templates. Reason is that these fields were related to old tracking which was removed.
-   Desktop
    -   Fix: the "link tracking" feature brought back after being removed by mistake in Vanilla `7.0.0`.
-   Mobile
    -   Expose property `isAnonymousAccessRestricted` on client config `Page` (i.e. `m2Page`) as `IAuthorizationConfiguration` is not accesible anymore in Vanilla `7.0.0`.
    -   Fix: re-add `IChatStateConfiguration` after being removed by mistake in Vanilla `7.0.0`.
    -   Added `superCookie` value to goToNativeApp url (if user is authenticated).

### Vanilla 7.0.0

2018-01-24

With this release, Angular 5 is now ready to be used with Vanilla - please see [migration guide](http://docs.vanilla.intranet/mobile/guide/migration-guide-4-5). We also removed a lot of old deprecated code.

-   Shared
    -   Removed obsolete code **BREAKING CHANGE**
        -   Content
            -   `ContentConfiguration` was removed, `ContentConfigurationBuilder` should be used instead
            -   `FieldPlacehodlersReplacer` was removed
            -   `FieldPlacehodlersReplacer` was removed
            -   `ContentModelAttribute.GetPrefetchDepth` method was removed
            -   `IContentBinder.BindContentModel` method was removed
            -   `IFieldConversionContext.ContentLoader` property was removed
            -   `IContentLoader` was removed
            -   `DocumentStatus.Error` was removed
            -   `IContentItem.ImplementationType` was removed
            -   `TreatAsError` enum was removed
            -   `ThrowOnDocumentStatus` enum was removed
            -   Obsolete constructors and properties of `ContentLoadOptions` were removed
            -   Removed useless `DocumentData.Errors`, changed constructor accordingly
            -   Renamed `DocumentData.Values` to `Fields`
            -   Removed `IContentBinderExtension` as far as it was used only for old tracking
        -   Core
            -   `ICacheProvider` was removed
            -   `CacheNames` were removed
            -   Old health check infrastructure was removed
            -   `RegisterConfiguration` without template parameters was removed
            -   `ConfigurationModules` was removed
            -   Obsolete constructor of `EnvironmentProvider` was removed
            -   `CodeContractsRewriter` was removed
            -   `Bwin.Vanilla.Core.Web.ClientIPResolver` was removed
            -   `HttpRequestExtensions` was removed
            -   `DynaConCounter` was removed
            -   `VanillaValidationAttribute` was removed
            -   `DefinedEnumValueAttribute` was removed
            -   `NotEmptyCollectionAttribute` was removed
            -   Old Vanilla DSL was removed: `IDslCompiler`, `IDslExpression<>`, `IFilterEvaluator`, `IPlaceholdersReplacer`, `DslValuesProvider`, providers in `Bwin.Vanilla.Core.Dsl.Providers`, related `AutofacExtensions`
        -   Mvc
            -   ReCaptcha now always requires an area (area `Default` was removed from code)
            -   `ContentHelper` was made internal
            -   `HostConfiguration` was removed
            -   `ClientBootstrapRouteProvider` was removed
            -   `MobileConfiguration` - TODO: WILL BE REMOVED and some properties moved to different configurations
            -   `ClientBootstrapRouteProvider` was removed
            -   `ITrackingFilterHandler` was removed, you should be using the data layer tracking instead.
            -   Old tracking (based on Sitecore and including Omniture, NetInsight and legacy GoogleTagManager integration) was removed
            -   Obsolete class `Bwin.Vanilla.Mvc.ClaimsAuthenticationModule` was removed (- replaced by `Owin` middleware).
            -   Obsolete class `Bwin.Vanilla.Mvc.Security.IRedirectToLoginPageHandler` was removed (- replaced by `Owin` middleware).
            -   Only `Owin` wireup supported. The possibility to switch back to the legacy wireup (i.e. prior to `Vanilla 6.0.0.3338`) has been removed. However, authentication cookies (`vauth` cookies) of old and new Vanilla applications are still compatible.
            -   Support for Legacy DSL using parameter `vanilla:UseLegacyDslCompilation` was removed
            -   Removed public API related to content messages: `IClosedContentMessage`, `IClosedContentMessagesCookie`, `IContentMessagesLoader`, `CookieConstants.ClosedMessagesForSession`, `CookieConstants.ClosedMessagesPersistent`
            -   Removed `IChatStateConfiguration` as far as it was used only by Vanilla itself.
        -   ServiceClients
            -   `LoyaltyCategory` enum was removed
            -   Obsolete constructor of `PidLoginParameters` was removed
            -   Obsolete EDS methods of `INotificationService` were removed
            -   Obsolete methods of `RestRequestBuilderExtensions` were removed
            -   Obsolete methods of `PosApiHttpExtensions` were removed
            -   Obsolete constructor of `DeviceFingerprint` was removed
            -   Changed `ServiceClientHeaderConfiguration` to be immutable
            -   `ServiceClientHeaderConfiguration` was removed, `ServiceClientHeaderConfigurationBuilder` should be used instead
            -   `MailConfiguration` was removed, `MailConfigurationBuilder` should be used instead
            -   `DeviceRecognitionConfiguration` was removed, `DeviceRecognitionConfigurationBuilder` should be used instead
            -   `PosApiClaimTypes.AccountId` was removed
        -   Testing
            -   `ContentBinderMockHelper` was removed
        -   Assembly `Bwin.Vanilla.Content.FilterValidation` was completely removed: `IFilterSyntaxValidator`, `FilterSyntaxValidatorProvider`
    -   Refined `IContentService` in order to express the contract of returned content item more explicitly:
        -   Added class `Content<TDocument>`.
        -   Added `GetItem(...)` methods
        -   Deprecated `GetContent(...)` methods
    -   Updated to dynacon service version `Vanilla:8`
        -   **BREAKING CHANGE** `IMobileConfiguration` was removed, and the properties were moved elsewhere (mostly to `IUserInterfaceConfiguration`). `ClientClaimsWhitelist` was moved to code (`IClientClaimsWhitelist`).
    -   **BREAKING CHANGE** in _DomainSpecificLanguage_ library
        -   Changed type of `expression` parameter on `IDslCompiler.Compile(...)` from `string` to `RequiredString`
        -   Changed type of `IDslExpression<T>.Warnings` from `IReadOnlyList<string>` to `IReadOnlyList<TrimmedRequiredString>`
    -   **BREAKING CHANGE** `IContentBinder.BindModelAndGetErrors(...)` changed return type from `IReadOnlyList<string>` to `IReadOnlyList<TrimmedRequiredString>`.
    -   **BREAKING CHANGE** `EnvironmentSequence` in `appSettings` in `web.config` is no longer used to determine app environment.
    -   **BREAKING CHANGE** Made some MVC configuration classes internal because they are supposed to be used only by Vanilla itself: `IThemingConfiguration`, `ThemingConfiguration`, `AssetsConfiguration`, `ISignUpBonusRedirectConfiguration`, `SignUpBonusRedirectConfiguration`, `IAuthorizationConfiguration`, `AuthorizationConfiguration`, `ILastVisitorConfiguration`, `LastVisitorConfiguration`, `TrackingConfiguration`
    -   **BREAKING CHANGE** Changed `IClaimsService.GetPostLoginValues` to a function (was a property before)
    -   Added helper method `IEnumerable<>.ToDebugString()` useful for writing items to log. Use it especially for `Content<>.Errors`, `IDslExpression<>.Warnings` and result from `IContentBinder.BindModelAndGetErrors(...)` because **these are supposed to be common collections without custom `ToString()`!**
    -   Added support for cancellation (optional `CancellationToken` parameter) to PosAPI service clients and related classes.
    -   Added `ITracker.IsEnabled()` to determine whether tracking (some data layer) is enabled.
    -   Added helpers for `IHttpActionResult` to set messages and errorCode. This can be extended by your own result types.
        -   Messages created this way are automatically added to message queue on the client
        -   Usage: `BadRequest().ErrorMessage("msg").ErrorCode("123");` (methods `SuccessMessage`, `InfoMessage`, `WarningMessage` and `Messages` are also available)
    -   Deprecated `ITrackingConfiguration` because it is Vanilla internal configuration. If you need something from it then let us know.
    -   Deprecated `FakeLogAppender` and `CompositeLogAppender`. Inject `ILog` from Autofac or manually and then use mock for testing.
    -   Deprecated methods on `INotificationService` that can be replaced with its Get/Update Offer methods.
    -   Removed support for Autofac configuration in `web.config` (NuGet package _Autofac.Configuration_) because [Autofac 4 removed this functionality](https://stackoverflow.com/questions/39364698/autofac-upgrade-to-version-4-0-0-is-missing-configurationsettingsreader). If you need still it then implement it on your side in new way according to [docs](http://autofaccn.readthedocs.io/en/latest/configuration/xml.html).
    -   Updated NuGet packages:
        -   _Newtonsoft.Json_ 8.0.3 -> 10.0.3
        -   _JetBrains.Annotations_ 10.0.0 -> 11.1.0
        -   _Microsoft.Net.Compilers_ 2.4.0 -> 2.6.1
        -   _log4net_ 2.0.5 -> 2.0.8
        -   _FluentAssertions_ 4.18.0 -> 4.19.4
        -   _System.IO.Abstractions_ 2.0.0.136 -> 2.1.0.178
        -   _HtmlAgilityPack_ 1.4.9 -> 1.6.13
        -   _Castle.Core_ 4.1.1 -> 4.2.1
        -   _Autofac_ 3.5.2 -> 4.6.2
        -   _Autofac.Extras.DynamicProxy2_ 3.0.7 -> _Autofac.Extras.DynamicProxy_ 4.2.1
        -   _Autofac.Mvc5_ 3.3.4 -> 4.0.2
        -   _Autofac.Owin_ 4.0.0 -> 4.1.0
        -   _Autofac.WebApi2_ 4.0.0 -> 4.1.0
    -   Removed NuGet packages:
        -   _ExpressionEvaluator_
        -   _Antlr_
        -   _System.Collections.Immutable_
        -   _Autofac.Configuration_
    -   [B-273536](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3a13992409) Added `page.culture` data layer property based on the `RouteValue` of the `Vanilla.Web.Globalization->CultureMapping` (Dynacon) to support cultures like e.g. 'pt-BR' or 'es-MX'.
-   Desktop
    -   **BREAKING CHANGE** Renamed application specific metadata of the `bwin.config.appInfo` client configuration (`brandId`->`brand`, `frontendId`->`frontend`, `channelId`->`channel` and `productId`->`product`).
    -   **BREAKING CHANGE** Removed application specific metadata (`brand`, `frontend`, `channel`, and `product`) from the chat client configuration `bwin.config.chat` as they are now in a dedicated configuration `bwin.config.appInfo`. The `getConfiguration()` function of the `jquery.bwin.chatData.js` plugin still returns those two configurations merged to avoid breaking all webs that use the `GenesysWebChat` client.
    -   **BREAKING CHANGE** Removed obsolete `Bwin.Vanilla.PluginHost.Desktop.PartialController.SiteHeader()` method, replaced by the `Bwin.Vanilla.PluginHost.Desktop.SiteHeaderController.Index()` method.
    -   **BREAKING CHANGE** Removed obsolete `Bwin.Vanilla.PluginHost.Desktop.PartialController.Dialogs()` method, replaced by the `Bwin.Vanilla.Mvc.Features.Dialogs.HtmlHelperExtensions.RenderDialog()` helper method callable via `Html.RenderDialog()`.
    -   **BREAKING CHANGE** Removed obsolete `Bwin.Vanilla.PluginHost.Desktop.Areas.App.Controllers.UserStateController.Index()` method which has been split into `Bwin.Vanilla.PluginHost.Desktop.SiteHeaderController` and multiple child controllers each handling part of user state.
    -   **BREAKING CHANGE** Removed obsolete `Bwin.Vanilla.PluginHost.Desktop.Areas.App.Models.PageBackground.BackgroundCarouselViewModel` class, replaced by `Bwin.Vanilla.PluginHost.Desktop.Areas.App.Models.PageBackground.Carousel` class.
    -   **BREAKING CHANGE** Removed obsolete `Bwin.Vanilla.PluginHost.Desktop.Areas.App.Models.PageBackground.HtmlHelperExtensions.GetPageBackgroundCarousel()` method, replaced by `Bwin.Vanilla.PluginHost.Desktop.Areas.App.Models.PageBackground.HtmlHelperExtensions.GetPageBackground()` method.
    -   **BREAKING CHANGE** Removed obsolete `Bwin.Vanilla.PluginHost.Desktop.Areas.App.Models.PageBackground.HtmlHelperExtensions.GetPageBackgroundImageUrl()` method, replaced by `Bwin.Vanilla.PluginHost.Desktop.Areas.App.Models.PageBackground.HtmlHelperExtensions.GetPageBackground()` method.
    -   **BREAKING CHANGE** Removed legacy rendering of the user state row inside a site header. The `app://userstate` application menu item is not supported anymore as it was split long ago into multiple elementary application menu items (such as `app://accountbalance`, `app://personalbutton`, `app://username`, etc.).
    -   **BREAKING CHANGE** [B-272281](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13951597) Removed the **old** Genesys chat integration that wasn't used anymore.
    -   [B-249342](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12936404) Added support for rendering fully localized links in the language switcher. Vanilla now provides a default/fallback logic that it was providing already before (localization of the `culture` route value only) but now the products can override this logic by implementing the `ILocalizedLinksProvider` interface and localizing other parts of the route as well.
    -   [B-272607](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13963780) Added decibel integration parameter `user.decibelID` into the DataLayer.
-   Mobile
    -   **BREAKING CHANGE (minor)** `IMobileConfigurationBuilder.SetPerRequestScripts` was split to `Top` and `Bottom` versions, and there are put either above or below the scripts registered by `SetScripts`
    -   **BREAKING CHANGE** Renamed application specific metadata of the `AppInfoConfig` client configuration (`brandId`->`brand`, `frontendId`->`frontend`, `channelId`->`channel` and `productId`->`product`).
    -   **BREAKING CHANGE** Removed application specific metadata (`brand`, `frontend`, `channel`, and `product`) from the chat client configuration `ChatConfig` as they are now in a dedicated configuration `AppInfoConfig`. The `ChatApiService` still invokes internally the `chatApi.configure(...)` with those two configurations merged to avoid breaking all webs that use the `genesys-web-chat` client.
    -   Updated to **Angular 5.2.x** **BREAKING CHANGE**
        -   `ApiBase` now uses `HttpClient` from `@angular/common/http`
            -   The types of response, response error, headers, http parameters are different (should have minimal impact, because this only matters when using `resolveWithFullResponse`)
            -   You can explicitly specify `responseType` (default is `json`)
            -   You can use `reportProgress` parameter (for file uploads etc.)
            -   Added `jsonp` method
            -   `ng-http-interceptor` dependency was removed, because `HttpClient` has a different way of implementing interceptors
                -   This means you need to convert all http interceptors to be compatible
        -   Vanilla is now using [pipeable operators](https://github.com/ReactiveX/rxjs/blob/master/doc/pipeable-operators.md) from rxjs 5.5.x
            -   Vanilla no longer imports a set of operators globaly via `import 'rxjs/add/operator/xxx';` as this will be possibly removed in rxjs 6.0
            -   To take advantage of this, you need to replace all operators in your code with lettable operators, and update your webpack build according to the link posted above
        -   Deprecated code was removed
            -   `UseNewMenu` was removed from both client side and server side
            -   `TrackingService.track()` was removed
        -   All current APIs were marked as stable
        -   Globalization changes
            -   Angular is no longer using browser `Intl` API, so you can remove the polyfill if you have it (in AreaRegistration)
            -   Localization files are now generated with webpack and loaded asynchronously on app init
        -   You can add [`@angular-devkit/build-optimizer`](https://www.npmjs.com/package/@angular-devkit/build-optimizer) to your webpack config
        -   Make sure to update related packages such as `zone.js`, `rxjs`, `@ngtools/webpack`, `webpack`, etc.
    -   [B-267541](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13765990) Refactored `SiteMap` health checks (`Uri` and `Sitecore`) to a single one.
    -   Added `GET_BALANCE` and `NAVIGATE_TO` native wrapper event handling
    -   Added `htmlTagClass` parameter to content messages

### Vanilla 6.14.14

2018-07-02

-   Shared
    -   [B-277387](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14115707) Updated Hekaton implementation to use new Hekaton stored procedures that address the latches issue.

### Vanilla 6.14.13

2018-05-17

-   Shared
    -   [B-276571](https://www52.v1host.com/GVCGroup/story.mvc/summary?oidToken=Story%3A14093376) Added new Offer DSL providers `Offer.IsOffered(offerType, offerId)` and `Offer.GetStatus(offerType, offerId)`.
    -   [B-275805](https://www52.v1host.com/GVCGroup/story.mvc/summary?oidToken=Story%3A14076512) Added new DSL method on User provider to return users registration trackerId (`User.AffiliateInfo`).
-   Desktop
-   Mobile

### Vanilla 6.14.12

2018-04-25

-   Shared
    -   Fixed diagnostic pages built using Angular from [CDN](https://unpkg.com) (`/healh/dsl`, `/health/claims`, `/health/log`) because [new major version of RxJS](https://www.npmjs.com/package/rxjs) has been released. It contains a breaking change in file structure (`operators.js` vs `operators/index.js`). Vanilla unfortunatelly referenced the latest version and automatically picked it up.
    -   Added `sortableVanillaVersion` to the site metadata that are published to the Elasticsearch.
-   Desktop
-   Mobile

### Vanilla 6.14.11

2018-04-24

-   Shared
    -   [B-283090](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14262299) Removed `user.profile.userID` from the data layer tracking (GDPR compliance requirement).
    -   [B-273536](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3a13992409) Added `page.culture` data layer property based on the `RouteValue` of the `Vanilla.Web.Globalization->CultureMapping` (Dynacon) to support cultures like e.g. 'pt-BR' or 'es-MX'.
-   Desktop
-   Mobile

### Vanilla 6.14.10

2018-04-19

-   Shared
    -   [B-266219](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13710490) Improved serialization in Offers API.
-   Desktop
-   Mobile

### Vanilla 6.14.9

2018-04-13

-   Shared
    -   [B-280648](https://www52.v1host.com/GVCGroup/story.mvc/summary?oidToken=Story%3A14200879) Signup bonus dialog not displayed for trackers associated to campaigns.
    -   Fixed wrong culture during redirect to login page
-   Desktop
-   Mobile

### Vanilla 6.14.8

2018-03-27

-   Shared
    -   [D-83380](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A14133181) Fixed and improved the error reporting in the Content Services health check
-   Desktop
-   Mobile

### Vanilla 6.14.7

2018-03-05

-   Shared
-   Desktop
-   Mobile
    -   [B-277952](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:14129954) Added handling of `LOGOUT` native wrapper event (wrapper -> web)

### Vanilla 6.14.6

2018-03-02

-   Shared
-   Desktop
-   Mobile
    -   [D-83308](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:14119360) Fixed an issue that prevented `NativeApp` cookie from being written when url would cause sign up bonus redirect

### Vanilla 6.14.5

2018-02-23

-   Shared
    -   Changed logic for the `WebSiteUrl` parameter of the chat configuration. Now it supports also the labels that have their names containing more than two substrings, e.g. `nj.partycasino.com` or `sportingbet.co.za`.
-   Desktop
-   Mobile

### Vanilla 6.14.4

2018-02-08

-   Shared
    -   [B-275501](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14068647) Forced two decimal digits in a currency for all cultures.
-   Desktop
-   Mobile

### Vanilla 6.14.3

2018-01-31

-   Shared
-   Desktop
-   Mobile
    -   Added `superCookie` value to goToNativeApp url (if user is authenticated).

### Vanilla 6.14.2

2018-01-18

-   Shared
    -   SuperCookie is now properly written to the client
-   Desktop
-   Mobile

### Vanilla 6.14.1

2018-01-16

-   Shared
-   Desktop
-   Mobile
    -   [B-272085](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13942351) Fix `DslPipe` import circular dependency

### Vanilla 6.14.0

2018-01-16

-   Shared
    -   [D-81896](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A13938947) Fixed undefined-culture error for footer clock
    -   [D-81690](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A13911304) Removed error logging for missing version of content for public pages
        -   [B-272106](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13943207) Vanilla sets and retrieves SuperCookie on login
        -   Fixed: `IContentBinder` bind null collection or tree if some item is `Invalid` or `NotFound`. It should bind the rest and return corresponding errors so that consumer can decide whether errors are critical.
-   Desktop
-   Mobile
    -   [B-271303](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13916648) Added parameter `showOnNextLogin` and support for client-side filtering for content messages in the header (aka ribbon) and the footer. Read more in [docs](http://docs.vanilla.intranet/content-messages.html).
        -   [B-251496](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13053836) Public pages now use client side filtering.
        -   [B-251496](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13053836) A few client DSL issues were fixed as well as some improvements and optimizations of this feature.
        -   [B-272085](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13942351) Removed chat. Chat is now in LabelHost.
        -   [B-272085](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13942351) In order to correctly maintain state of the main menu items (counters, highlighted item) after client side dsl is applied, these values were moved out from the item model and are now accessible on the `MenuItemComponentBase` class. Check the usage if you have any inherited menu items.

### Vanilla 6.13.3

2018-03-14

-   Shared
    -   [D-83380](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A14133181) Fixed and improved the error reporting in the Content Services health check
-   Desktop
-   Mobile

### Vanilla 6.13.2

2018-02-23

-   Shared
    -   Changed logic for the `WebSiteUrl` parameter of the chat configuration. Now it supports also the labels that have their names containing more than two substrings, e.g. `nj.partycasino.com` or `sportingbet.co.za`.
-   Desktop
-   Mobile

### Vanilla 6.13.1

2018-02-08

-   Shared
    -   [B-275501](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A14068647) Forced two decimal digits in a currency for all cultures.
-   Desktop
-   Mobile

### Vanilla 6.13.0

2018-01-05

-   Shared
    -   [D-81346](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A13866624) Fixed SwitchConfig target to write in the console the override file applied
    -   [B-271079](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13901727) Fixed binding error log for SignUpBonusLayerModel.ExpandTac
        -   [B-208141](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10737268) Exposed API for usage of DynaCon configuration engine without web app. Read more in [docs](http://docs.vanilla.intranet/configuration-system.html#usage-without-web-app).
        -   [D-81421](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:13881223) Made PostLoginValues available on subsequent requests after login
-   Desktop
    -   [B-271174](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13906199) Added parameter `showOnNextLogin` for content messages. Read more in [docs](http://docs.vanilla.intranet/content-messages.html).
    -   [B-270435](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13879401) Added option to enable/disable the global Javascript error handler.
-   Mobile
    -   [B-271094](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13902188) Added client side DSL engine (see [docs](http://docs.vanilla.intranet/mobile/guide/dsl))
    -   [B-251496](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13053836) Main menu now uses client side filtering

### Vanilla 6.12.0

2017-12-19

-   Shared
    -   [B-269741](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13851782) Support for dynamic configuration variation context aka extended context on DynaCon side.
        -   Configuration instance is picked dynamically based on matching context.
        -   Currently there are 2 new variation context properties available: _NativeApp_ and _OperatingSystem_. Feel free to ask for more.
        -   There is no change to existing variation context (_label_, _product_...) nor settings of configuration engine in general.
        -   Read [DynaCon docs](https://vie.git.bwinparty.com/dynamic-configuration/dynacon/wikis/release-v1.9.0) regarding usage of new context properties in [admin web](https://admin.dynacon.prod.env.works/) or reach DynaCon team via [email](mailto:d.dynacon@bwinparty.com).
        -   **Please test the functionality properly on your side too.**
            -   Session overrides work correctly only for _key_-s with a single _value_.
-   Desktop
    -   [B-266219](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13710490) Extended EDS buttons with new jquery api jquery.bwin.offerButtons.js
-   Mobile

### Vanilla 6.11.0

2017-12-12

-   Shared
    -   [D-72349](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A12133623) Fixed the not-supported server culture set for the health checks
    -   [B-231436](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12031098) Added configurable timeout to HTTP requests to Sitecore
        -   [B-266212](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13710163) Introduced new OfferStatus events on INotificationService, EdsEvents are marked obsolete.
        -   [B-266997](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13744887) Optimized data layer tracking to not calculate values when it's disabled.
        -   Fixed compatibility of cache keys for distributed cache done in Vanilla 6.7.0. Amount of data stored in Hekaton is still kept lower than prior to 6.7.0.
    -   [B-265251](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13674043) Added support for configurable Default Product redirection.
        -   Fixed: `HttpContext` is not propagated to `SynchronousHealthCheck`.
        -   Fixed: Thread culture (language) gets lost when executing `ErrorController` therefore it executes with server default culture which may be outside configured allowed ones. This breaks e.g. when loading content from Sitecore.
        -   [B-268188](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13790284) The `ITrackingFilterHandler` functionality made obsolete. This functionality will be removed in Vanilla 7, you should be using the data layer tracking instead.
        -   [B-260268](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13480878) web.config transforms files were moved from Vanilla Project to a separate Nuget package called `Bwin.Vanilla.WebConfigTransforms` in order to make label creation and updating label configurations easier.
            -   Installation in your Plugin.Host project via visual studio package manager console: `Install-Package Bwin.Vanilla.WebConfigTransforms`
            -   Note: Make sure that for 'template.web.config' and all 'transform.web.\*.config' files 'Build Action' value is 'Content'.
        -   New DSL compiler automatically removes trailing () after provider access in order to ease migration from unsupported syntax like Layout.IsWeb(). This means related expressions should be kept until all products update to new compatible DSL compiler. Then it should be replaced with supported syntax like Layout.IsWeb.
            -   Please check logs for DSL related errors on PROD as well as pre-PROD stages to catch issues asap. Vanilla Content API is graceful which means it log/returns an error instead of breaking/throwing an exception.
            -   Fixed string index bug in conversion of DSL expressions in order to support legacy syntax.
        -   Updated NuGet packages:
            -   _Microsoft.Net.Compilers_ 2.3.1 -> 2.4.0.
            -   _Microsoft.CodeDom.Providers.DotNetCompilerPlatform_ 1.0.7 -> 1.0.8
        -   Added `IGenericListItem` Json serializer
-   Desktop
    -   Fix for the `jquery.bwin.subMenuNavigation.js` to prevent bug in Firefox.
-   Mobile
    -   Updated angular to 4.4.6
    -   `vn-dynamic-component` was deprecated in favor of `*vnDynamicComponent`
    -   Added `UseResponsiveFeature` DynaCon configuration, that is accessible on the server as `IUserInterfaceConfiguration.UseResponsiveFeatures` and on the client as `Page.useResponsiveFeatures`. Use this flag to toggle experimental responsive features in vanilla as well as your product.
    -   [B-266212](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13710163) Introduced new [Offer Status](http://docs.vanilla.intranet/features-offer-buttons.html) button.

### Vanilla 6.10.1

2017-11-22

-   Shared
    -   Fixed compatibility of cache keys for distributed cache done in Vanilla 6.7.0. Amount of data stored in Hekaton is still kept lower than prior to 6.7.0.
-   Desktop
-   Mobile

### Vanilla 6.10.0

2017-11-21

-   Shared
    -   [B-258273](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13396155) Http connections optimization: disabled proxy and removed 100-continue header
        -   The `Balance` value is now cached when used for the Data layer tracking. This prevents making the `Balance` Posapi call during every single request to Vanilla, including the AJAX requests. **Important: As the balance is now cached teams are expected to update their code that changes the balance value to invalidate the respective cache (`IUserDataService.RefreshBalance()`) so that it doesn't contain the obsolete value anymore.**
        -   [B-264898](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13659114) The Data layer was decoupled from the Google Tag Manager script and the possibility to define alternative tag managers running at the same time was added. To add another tag manager, just implement the `ITagManagerRenderer` interface and register your implementation.
        -   Changed `PosApiClaimTypes` - added `AccountName`, `BwinAccountId`, `PGAccountId`, `GvcAccountId`, deprecated `AccountId`.
        -   Changed `DeviceFingerprint` in `LoginParameters` so that it doesn't require `SuperCookie`.
        -   [D-80010](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A13655127) Fixed: Loading of proxy item fails if condition is empty.
-   Desktop
    -   [B-263947](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13618141) Added configurable debug levels to RTMS Api
    -   Fixed wrong data-lazy attribute on carousel images
    -   [B-257705](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13369303) Domain retrieved by client config instead of html attribute 'data-domain'
        -   Fixed a generation of routing language identifier used in HTTP requests on a client side.
-   Mobile

### Vanilla 6.9.4

2017-12-05

-   Shared
    -   Fixed string index bug in conversion of DSL expressions in order to support legacy syntax.
-   Desktop
-   Mobile

### Vanilla 6.9.3

2017-12-05

-   Shared
    -   New DSL compiler automatically removes trailing parentheses `()` after provider access in order to ease migration from unsupported syntax like `Layout.IsWeb()`. This means related expressions should be kept until all products update to new compatible DSL compiler. Then it should be replaced with supported syntax like `Layout.IsWeb`.
    -   Please check logs for DSL related errors on PROD as well as pre-PROD stages to catch issues asap. Vanilla Content API is graceful which means it log/returns an error instead of breaking/throwing an exception.
-   Desktop
-   Mobile

### Vanilla 6.9.2

2017-12-04

-   Shared
    -   Fixed: Thread culture (language) gets lost when executing `ErrorController` therefore it executes with server default culture which may be outside configured allowed ones. This breaks e.g. when loading content from Sitecore.
-   Desktop
-   Mobile

### Vanilla 6.9.1

2017-11-22

-   Shared
    -   Fixed compatibility of cache keys for distributed cache done in Vanilla 6.7.0. Amount of data stored in Hekaton is still kept lower than prior to 6.7.0.
-   Desktop
-   Mobile

### Vanilla 6.9.0

2017-11-10

-   Shared
    -   [B-257709](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13369360) Added DSL providers: App.Label, App.Product and App.Channel
    -   [B-264800](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13655228) Sending machine name in `x-bwin-client-machine` HTTP header with all requests to Dynacon.
    -   [B-265977](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13700558) Make `IChatConfiguration` accessible. New generic interface `IChatStateConfiguration` has been introduced in `Bwin.Vanilla.Mvc` project.
-   Desktop
    -   Fixed wrong rendering of carousel Image tag
    -   [B-263707](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13608230) Excluded the `page.*` data layer properties from the AJAX requests tracking.
    -   [B-263182](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13589822) Added support for the submenu navigation (a.k.a. the "flyout" menu).
-   Mobile
    -   Made `NativeApp` cookie not `HttpOnly`
    -   Removed `EnabledApps` configuration. All native routes are registered now on all labels.

### Vanilla 6.8.1

2017-11-08

-   Shared
-   Desktop
-   Mobile
    -   Made `NativeApp` cookie not `HttpOnly`

### Vanilla 6.8.0

2017-11-07

-   Shared
    -   [B-265306](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13676463) Added device fingerprint to PosAPI `LoginParameters`.
    -   [B-264906](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13659401) Added `Bwin.Vanilla.ServiceClients.Services.PosApi.PosApiClaimTypes` with constants of claim types.
    -   Fixed the `SiteMetadataPublisher` to get `Dynacon` parameters from more reliable source.
    -   [D-78142](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A13328441) Fixed wrong username check in FormsAuthenticationService
    -   [B-256830](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13326152) Added possibility to add headers to PosAPI requests based on [dynacon configuration](https://admin.dynacon.prod.env.works/services/66373/features/202/keys/87022/valuematrix?_matchAncestors=true)
    -   Fixed combination of legacy DSL mode in case of some DSL expression is used in the configuration from DynaCon.
-   Desktop
-   Mobile

### Vanilla 6.7.0

2017-10-25

-   Shared
    -   [B-263343](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13596133) Moved Messages into App-v1.0/Resources/Messages. `IGenericListItem` is now a part of Vanilla Framework.
    -   [B-261338](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13522008) Changed client IP and interal request evaluation:
        -   Client IP evaluation now includes `X-Real-IP` HTTP header provided by evasion proxies e.g. [www.bwin10001.com](https://www.bwin10001.com).
        -   Internal request evaluation returns `true` if physical request IP is private. In case of evasion proxy (which also comes through private IP to Vanilla servers), IP address provided in `X-Real-IP` HTTP header must be private too.
    -   [B-261980](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13545239) Exposed basic details (health check name + passed) on `/health/report` when accessed from public internet.
    -   Removed old compatibility bridge of cache keys for distributed cache done in Vanilla 4.3.103.2634 from 2017-03-23. This reduces amount of data stored in Hekaton and slightly decreases traffic.
    -   [B-239807](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12464857) Added `NativeApplication.IsNativeWrapper` dsl provider
    -   [B-239807](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12464857) Added `NativeApplication.IsNative` dsl provider **WARNING:** This provider existed previously, and was deprecated and replaced with `IsNativeApp`. It's now back with a different functionality - `IsNativeApp OR IsNativeWrapper`. Please make sure to review usages of `NativeApplication.IsNative` in your application, and change them to `NativeApplication.IsNativeApp` where you don't want wrapper to be affected by this filter.
-   Desktop
    -   [B-255859](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13279020) Added javascript API $.bwin.recaptcha.render for rendering re-captcha by AJAX
    -   [B-250807](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13018750) Enhanced pc-toggle-component so it supports being expanded on page load
-   Mobile

### Vanilla 6.6.0

2017-10-10

-   Shared
    -   [B-233373](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12138475) Added /health/restRequest diagnostic page for making REST requests to specified URL
    -   [B-260139](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13476370) Added the site metadata publisher executed at the application start that publishes various site-related metadata including plugins versions to the Elasticsearch.
    -   [B-239807](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12464857) Extracted configuration engine to separate package `Bwin.Vanilla.Configuration.DynaCon`.
        -   Related classes have different namespace. Therefore **AppDynamics monitoring of requests to DynaCon must be adapted accordingly when doing a rollout**. On PROD environment please ask LeanOps for help:
        -   `Bwin.Vanilla.Core.Configuration.Dynamic.RestService.IConfigurationRestClient` -> `Bwin.Vanilla.Configuration.DynaCon.RestService.IConfigurationRestClient`
        -   `Bwin.Vanilla.Core.Configuration.Dynamic.RestService.IConfigurationRestService` -> `Bwin.Vanilla.Configuration.DynaCon.RestService.IConfigurationRestService`
    -   [B-262165](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13551448) Added possibility to define a fallback/default language in the Sitecore REST requests.
    -   [B-261715](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13536215) Added `JsonConverter` for `IHtmlString`-s to `JsonSerializerSettings` registered in Autofac.
    -   Allowed local configuration overrides to have same value as the one in active changeset.
    -   Improved caching of some PosAPI data (e.g. cities) to store final objects instead of low-level bytes therefore improving performance.
    -   Fixed: DSL provider with exposed method `Contains()` breaks the syntax.
    -   Fixed problem when the chat is `Disabled` (introduced in the `Vanilla 6.5.0`).
-   Desktop
    -   [B-251561](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13057006) Updated $.bwin.carousel.remove() to check css class slick-initialized
    -   [B-257728](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13369932) Update page-matrix.js to show .pc-banner, and .splash-teaser items
-   Mobile
    -   Updated angular to 4.4.3
    -   Remove native wrapper `LOGIN` event handling - should be moved to mobilelogin because some parameters are not know to vanilla

### Vanilla 6.5.0

2017-09-27

-   Shared
    -   [B-260418](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13486850) Removed UserSettings cookie setting for Ajax requests
    -   [B-214249](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11066591) Added `Device.Model` and `Device.Vendor` DSL providers.
    -   [D-78794](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A13459006) Fixed handling of failing Posapi reqests during client configuration generation.
    -   [D-70616](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A11770833) Fixed: Site root file resolver fails if there is folder at the path.
    -   Support for simulation of external request (from public internet) even if coming from company network by adding cookie `ExternalRequest` with value `true`.
    -   Removed support for opt out of internal languages by cookie `InternalLanguages`. This can be achieved by the feature describe above.
    -   Refined content API:
        -   Read [XML documentation of `IContentService`](https://vie.git.bwinparty.com/vanilla/monorepo4/blob/master/Source/Bwin.Vanilla.Content/ContentService.cs) carefully.
            -   Added new methods to `IContentService` in addition to `Get()` with various error handling. Choose the one which suits your needs.
            -   `GetRequired()` - throws if document is not sucessfully loaded.
            -   `TryGetRequired()` - log the error if document is not successfully loaded and returns null.
            -   `GetChildren(IDocument)` - same as calling `GetChildren(document.Metadata.ChildIds)`.
        -   Added `ContentLoadOptions.DslEvaluation` - a flag to specify how DSL expressions should be evaluated in loaded content.
        -   Added `ContentLoadOptions.RequireTranslation` - indicates of language translation is required. If content is untranslated then it's returned as an error (doesn't necessarily mean an exception).
        -   Deprecated `TreatAsError` and `ThrowOnError` on `ContentLoadOptions`.
        -   Removed type filtering done by `GetChildren()` and `Get(IEnumerable<DocumentId>)` methods. This doesn't change the result of the method anyhow, just write an error to log file. Use LINQ to achieve same functionality: `GetChildren<IPCText>()` -> `GetChildren<IDocument>().OfType<IPCText>()`.
        -   Deprecated `IContentLoader`.
        -   Sitecore outage or some network error will not trigger an expection (for methods that are not supposed to throw e.g. `Get()`, `GetContent()`).
        -   Changed methods of `IContentBinder`:
            -   Added `BindModel()` - logs errors if any and returns a flag indicating success.
            -   Added `BindModelAndGetErrors()` - doesn't log anything, errors are returned and whole handling is up to you.
            -   Deprecated `BindContentModel()`,
    -   Added `transform.web.config`-s for the new labels `br.betboo.com`, `theborgata.com` and `premiumbull.com`.
    -   [B-260418](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13491029) Added html helper `Html.RedirectKnownUsersToLastVisitedProduct()` to expose RedirectKnownUsersToLastVisitedProduct configuration value.
    -   Added `Bwin.Vanilla.Caching.Hekaton` as depdency of `Bwin.Vanilla.PluginHost.Base` so that it get' installed and updated automatically. This was missed during PluginHost split.
-   Desktop
    -   Added support for categories to carousel API
    -   [D-78985](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A13499812) Removed $(document).ajaxSuccess from jquery.bwin.ajaxauth to prevent requests loop
-   Mobile
    -   Added support for native events `LOGIN`, `LOGOUT`, `IS_LOGGED_IN` and `UPDATE_BALANCE`

### Vanilla 6.4.0

2017-09-18

-   Shared
    -   Added `transform.web.config` for the new label `cheekyslots.com`.
-   Desktop
-   Mobile

### Vanilla 6.3.0

2017-09-07

-   Shared
    -   [B-254463](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13209535) Added new API for Vanilla domain specific language (DSL) which enables client-side evaluation:
        -   Please test the feature deeply before releasing to production.
        -   You can switch to old DSL compiler by adding `<add key="vanilla:UseLegacyDslCompilation" value="true" />` to `<appSettings>` in `web.config`.
        -   Both new and old C# API can be used regardless of legacy setting.
        -   Custom DSL providers and field replacers must be adapted in order to fully use new DSL compiler. Shared plugins (e.g. MobileToolbox) should provide both implementations for transition period.
        -   Added operators `STARTS-WITH`, `ENDS-WITH`, `CONTAINS`, `LOWERCASE` and `UPPERCASE`.
        -   Added new `/health/dsl` page replacing `/health/contentfilters`.
        -   Find more info in [docs](http://docs.vanilla.intranet/domain-specific-language.html).
    -   [D-78437](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A13375797) Enabled caching of the `ValueSegment` property to avoid big amount of `CRM.svc/Loyalty/ValueSegment` PosApi calls.
    -   [B-258321](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13399002) Chat client improvements: added user's `FirstName` and `LastName` to the `userData` sent to Genesys during chat start.
    -   [B-257746](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13370882) Updated content templates to include recent changes to the `PCTeaser`. The `PCTeaserDocument.cshtml` was updated accordingly.
    -   Extended `Switch-Config` to be supported in Visual Studio 2017 console.
    -   Updated:
        -   `Microsoft.Net.Compilers` from 2.0.1 to 2.3.1.
        -   `System.ValueTuple` from 4.3.0 to 4.4.0.
        -   `Microsoft.CodeDom.Providers.DotNetCompilerPlatform` from 1.0.3 to 1.0.7.
        -   `Castle.Core` from 3.3.3 to 4.1.1
-   Desktop
    -   [B-251561](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13057006) Added API $.bwin.carousel.add and $.bwin.carousel.remove for adding and removing the carousel
    -   [B-257014](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13335333) Added full support for carousel lazy loading (content + background)
        -   [B-258031](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13387287) Added global javascript error reporter for Desktop.
-   Mobile
    -   Updated angular to _4.3.5_
    -   [B-257017](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13335421) Added API for communication between native app and web (see [docs](http://docs.vanilla.intranet/mobile/api/core/NativeAppService))
    -   Added `language-switcher-shown` class to html node when language switcher is open.
    -   [B-257984](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13385151) Genesys Web Chat improvements: add new events to ChatWidgetHostComponent (onStarted, onRegistered) and new properties to ChatUser: FirstName, LastName

### Vanilla 6.2.2

2017-09-11

-   Shared
-   Desktop
-   Mobile
    -   Genesys Web Chat improvements: add new events to ChatWidgetHostComponent (onStarted, onRegistered) and new properties to ChatUser: FirstName, LastName

### Vanilla 6.2.1

2017-08-29

-   Shared
    -   Added check for `ChatState` in _Genesys_ health check. It will pass if chat is disabled.
    -   Changed `Bwin.Vanilla.ServiceClients.Model.CommonData.ILanguage.Culture` to be created based on `cultureName` from PosAPI. This fixes the bug in _PosAPI Supported Languages_ health check.
-   Desktop
-   Mobile

### Vanilla 6.2.0

2017-08-10

-   Shared
    -   Added `Bwin.Vanilla.Core.Utils.Guard` for checking preconditions in order to replace code contracts.
    -   Added `source` key to `INotificationService.UpdateEdsEventStatus()`.
    -   [B-254314](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13200751) Fixed RTMS reconnect on focus to be executed only if connection had previously dropped with 4004 error code from the server.
    -   Fallback to default lannguage in native actions (instead of throwing exception)
    -   Increased `maxRequestLength` in `template.web.config` from `5223` to `8192` to be aligned with our consumers e.g. Mobile Portal.
    -   Restored constructor of `PosApiServiceBase` with `Bwin.Vanilla.Core.Web.IClientIPResolver` which caused **breaking change** in previous version.
-   Desktop
    -   [B-255546](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13262881) Added $.bwin.siteheader.refreshCashbackAmount method for refreshing cashback amount
    -   [B-256264](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13296328) Added configurable collapsible feature to desktop carousel
    -   [D-78134](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A13327828) Fixed the prefetch depth for InfoMessages
-   Mobile
    -   Added `RouteParamsService` that can be used by Angular components to access route params from both AngularJS and Angular

### Vanilla 6.1.0

**Unintentional breaking change in `PosApiServiceBase` constructor. Please use 6.2.0.**

2017-07-31

-   Shared
    -   [B-254314](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13200751) Only one RTMS connection per SSO, User, Front end, Brand, Product and Channel combination. Share connections between several tabs.
    -   [B-253123](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13136164) Replaced the null values inside the Datalayer
    -   [B-208201](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10740406) Denied public access to /health/report route
    -   [B-233034](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12119790) Added health check for supported languages in Vanilla
    -   [B-250353](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12997687) Updated page.name datalayer value with specific error messages for 40X status codes
    -   [B-178234](https://www52.v1host.com/GVCGroup/story.mvc/summary?oidToken=Story%3A8803144) Added support for web.config transformation overrides to `Vanilla.targets`. Read more in [docs](http://docs.vanilla.intranet/configuration-system.html#infrastructure-configuration-web-config).
    -   [B-254172](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13192931) `Bwin.Vanilla.Mvc.Html.JsonHelper` encodes HTML (<, >, &, ', ") and control characters now by default in order to prevent XSS attacks (see also [INC198013](https://gvcgroup.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D325e82ecdb3b3a4828ddf3ddae961965)). Note: As a result the mentioned characters will be replaced in JSON data rendered by Vanilla (i.e. in `Bwin.Vanilla.Mvc.Tracking.Renderers.IDataLayerRenderer` and `~/Themes/Mobile/Views/Shared/_ClientBootstrapScripts.cshtml` via `Html.ToRawJson(...)`.
    -   [B-245748](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12757020) `Bwin.PluginHost` was split into several projects
        -   `Bwin.PluginHost`, `Bwin.Themes.Desktop` and `Bwin.Themes.Mobile.M2` packages were removed (uninstall them)
        -   Instead, you should install `Bwin.Vanilla.PluginHost.Desktop` to Desktop products or `Bwin.Vanilla.PluginHost.Ng` to mobile products
    -   [B-251529](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13055068) Areas that should be registered are no longer configured in dynacon
        -   `HostConfiguration` is now obsolete an no longer used
        -   All areas are registered automatically
        -   If you need a list of registered `Areas` use `IAppPlatform`
    -   [B-254464](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13209556) New health check API which is less error-prone and provides more information (e.g. for monitoring team).
        -   Use `CancellationToken` in your code so that execution time of the health check can be limited according to [configured timeout](https://admin.dynacon.prod.env.works/services/66373/features/865/keys/867/valuematrix?_matchAncestors=true).
        -   If your code is synchronous or incompatible with `CancellationToken` then inherit `SynchronousHealthCheck`. However it brings a lot of overhead. So try to leverage `CancellationToken` in the first place.
        -   Separate health checks by Severity.
    -   [B-203663](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10414070) Added to all entries of the `FeaturesMetadata` section and its subkeys under `~/health/config` a direct link to the `DynaCon` configuration page.
    -   [B-254390](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13205255) Exposed `Bwin.Vanilla.Core.NetIInternalRequestEvaluator` which can be used to determine whether a request is made from a private IP address.
    -   [B-253766](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13171371) Added `remoteLoggerUrl` to the chat client config pointing to the Vanilla's `JsErrController`.
    -   [B-245113](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12728963) Added User.HasSignupBonus DSL provider
    -   [B-254422](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13207169) Added source parameter to the get bonus/offer API on INotificationService.
    -   Disabled (overridden) MVC filters on `/mocks/*` pages which may help with their access on premium labels.
-   Desktop

    -   [B-254984](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13234178) Added support for lazy loading for carousel images
    -   Fixed: Periodic appearing of loading spinner when RTMS connection was activated.
    -   Fixed bug on channel id for RTMS client.

-   Mobile
    -   [B-254316](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13200820) Added posibility to set page title and meta tags dynamically (see [docs](http://docs.vanilla.intranet/mobile/api/core/PageService)). This is set automatically for public pages.
    -   Updated angular to 4.3.0
    -   Renamed legacy AngularJS `m2ApiHeaderInterceptor` to `m2LegacyApiHeaderInterceptor` to avoid name collison with downgraded Angular interceptor
    -   Added `AllowAnonymous` to `NativeAppController` (should make the native routes accessible on premium labels)

### Vanilla 6.0.2

2017-08-01

-   Shared
    -   Added `AllowAnonymous` to `NativeAppController` (should make the native routes accessible on premium labels)
-   Desktop
-   M2
-   Vanilla 6

### Vanilla 6.0.1.3339

2017-07-11

-   Shared
    -   Fix `PosApiWorkflowIdentity` for Owin Apps: the login for users with a workflow was not handled correctly. Hence, the anyonymous user was used even if he was flagged for a login workflow.
-   Desktop
-   M2
-   Vanilla 6

### Vanilla 6.0.0.3338

2017-07-07

This release has some bigger changes inluding removal of m2 and introduction of OWIN pipeline, so we decided to make it a new major version. In the future we would like to stick to [semver](http://semver.org/), see [vanilla semver documentation](http://docs.vanilla.intranet/semantic-versioning.html).

We would like to thank **@mtheimer**, **@opaulicek**, **@zrekic** and **@akawar** especially as well as all others that were involved in upgrading mobile apps to hybrid mode.

#### What's next

Going forward you should write all new features using new Angular and upgrade the rest as soon as possible, so we can remove the rest of m2 and AngularJS.
From us, you can expect features like client side filtering (soon TM), support for running applications under a single domain (later, everyone that will want to use this will need to upgrade everything to Angular first) and more support for .net core (TBD).

-   Shared
    -   [B-247799](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12860422) OWIN - Vanilla uses now the [OWIN pipeline](https://www.asp.net/aspnet/overview/owin-and-katana) by default in order to open a migration path to future ASP.Net Core based applications. As this is major low level change please conduct full and thorough regression tests of your applications. Although we will eliminate the previous wireup in the future, we still support the legacy implementation in this version, if needed. - The CookieAuthentication middleware is compatible with the cookie format used by FormsAuthentication, hence single sign-on between old and new apps should work without any further changes. - For details please refer to the [Vanilla documentation](http://docs.vanilla.intranet/owin.html).
    -   [B-246366](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12788902) Added the user segmentation value to the Datalayer
    -   Fixed access to `/mocks/config` on production so that it's not found instead of error page.
    -   Added `web.config` transform for label `nj.playmgm.com`.
    -   Not allowing empty nor white-space keys in features in the configuration from DynaCon anymore.
        -   `Switch-Config` from Visual Studio NuGet console now implicitly uses `transform.web.dev.config` when no other environment is specified.
    -   [D-72374](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A12135732) Added failure and exception info for Sitecore HealthCheck in fallback mode.
    -   [B-217669](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11252066) Changed LoyaltyCategory to plain string instead of enum. This allows categories to be added/removed seamlessly. If you need to compare them to predefined values then create corresponding constants on your side.
    -   Descreased cache time of `ContactCapabilities` (chat) from `StaticDataCacheTime` to `UserDataCacheTime` for unauthenticated requests.
    -   Changed authentication to use timeout from _Vanilla.Web.Authentication_ feature in DynaCon instead of `<forms timeout="..." />` in `web.config`. This also applied for ASP.NET session timeout. Reason is to make it more flexible, testable and prepared for future OWIN changes.
    -   [D-64453](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A10584575) Fixed logging issue in proxy interceptor
    -   Fixed: requesting a content item with some path and `PathRelativity` = `ConfiguredRootNode` returns incorrectly same cached content as request for same path but `PathRelativity` = `AbsoluteRoot`.
    -   Changed `ToStringEquatable<T>` class, _breaking changes_:
        -   `ToString()` method must be implemented in inheriting classes.
        -   Comparison is by default case sensitive.
        -   Fixed setting of the comparison.
        -   Removed generic constraint.
        -   `CompareTo(T)` now throws if object is of different type according to specification of `IComparable`.
    -   [B-247843](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12861896) Set default prefetch depth to 0 and removed configuration value
    -   [B-238565](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12399868) Added sitemap health check
    -   [B-249008](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12919544) Removed "new" chat implementation (it was moved outside Vanilla into a separate project [GenesysWebChat](https://vie.git.bwinparty.com/vanilla/GenesysWebChat/blob/master/README.md)).
    -   [B-252571](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13110110) Position of login duration timer can be configurable by dynacon value Vanilla.Features.Login.LoginDurationDisplayMode
    -   The `Common` Theme has been removed as it is not needed anymore. Its only child - the Genesys Web Chat - has been moved from Vanilla into separate project.
    -   [D-77336](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A13129770) Fixed issue where DSL placeholders in the `SiteScripts` scripts could not be used effectively because of scripts caching.
    -   [B-253531](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13160698) Removed leading slash (`/`) from the `page.name` and the `page.pathQueryAndFragment` values in Data layer to prevent Googlebot from treating it as a link.
    -   [B-246366](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12788902) Added user segmentation data to datalayer.
-   Desktop
    -   [B-233805](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12160353) Added jquery.bwin.themeoverrides.js to override signup-bonus and personal button display settings
    -   [B-214193](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11062741) Added unique identifier for welcome message
    -   [B-251527](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13055007) Added component.cmsLinkZone to DataLayer
    -   [B-252925](https://www52.v1host.com/GVCGroup/assetdetail.v1?Number=B-252925) Added support for opting out from the default AjaxProgressIndicator behavior. Now you can skip the ProgressIndicator for your Ajax requests by seting the `noProgressIndicator` field to `true` on the `JQueryAjaxSettings` object. The change is backwards compatible, you don't need to change your code if you don't need this functionality.
-   M2
    -   [B-246389](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12790081) **BREAKING CHANGE** _(if you still use `m2`)_ Was decomissioned. Please follow [migration guide](http://docs.vanilla.intranet/mobile/guide/migration-guide) to switch to hybrid app.
-   Vanilla 6
    -   [B-249751](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12956389) Added core native app functionality (`NativeAppService` (server/client), native routes, native app actions, auto ping, `NativeApplication` dsl provider implementation, core dynacon configuration)
        -   design doc: https://docs.google.com/document/d/1LvWxTxkK_9ZJg8ze3HfWR_cNWJjoBNhaN6YQx9l2VOE/edit
        -   documentation: http://docs.vanilla.intranet/native-app.html
    -   [B-250296](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12994888) **BREAKING CHANGE** _(if you use other modules that `VanillaLibModule`, which you shouldn't do)_ Removed internal vanilla-lib.modules from public api. Always use `VanillaLibModule`.
    -   [B-251103](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13034346) **BREAKING CHANGE** _(if you implement `IStaticFileConfiguration`)_ Static file assets can be configured to only serve internal requests
        -   Source maps are by default served only for internal requests
    -   [B-250761](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:13016451) Marked many core vanilla features as `stable` from `experimental`
    -   [B-234345](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12189011) Added QueryString to Cookie feature on the client side (configurable in [dynacon](https://admin.dynacon.prod.env.works/services/66373/features/44458/keys/44460/valuematrix?_matchAncestors=true))
        -   Handles trackerIds in query string and converts them to cookies
        -   This will remove any matched parameters from the query string
    -   [B-253190](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13141544) Added ChatApiService which wraps the global [GenesysWebChat](https://vie.git.bwinparty.com/vanilla/GenesysWebChat) library
    -   Updated to angular **4.2.3**
    -   Added `MessageQueueService.count()`
    -   **BREAKING CHANGE** Renamed `TimerService.cancelInterval()` to `TimerService.clearInterval()` for consistency with `clearTimeout()`
    -   `NavigationService.location.search` is now case-insensitive and decodes uri components for keys and values when created

### Vanilla 4.9.5

2017-09-22

-   Shared
-   Desktop
    -   Added support for categories to carousel API
    -   [D-78985](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A13499812) Removed $(document).ajaxSuccess from jquery.bwin.ajaxauth to prevent requests loop
-   M2
-   Vanilla 6

### Vanilla 4.9.4

2017-08-31

-   Shared
    -   Fix for host and `sc_nocache` in `CachedDocumentDataSource`.
        -   [D-78437](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A13375797) Enabled caching of the `ValueSegment` property to avoid big amount of `CRM.svc/Loyalty/ValueSegment` PosApi calls.
        -   [B-258321](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13399002) Chat client improvements: added user's `FirstName` and `LastName` to the `userData` sent to Genesys during chat start.
        -   [B-257746](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13370882) Updated content templates to include recent changes to the `PCTeaser`. The `PCTeaserDocument.cshtml` was updated accordingly.
-   Desktop
    -   [B-251561](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13057006) Added API for adding and removing the carousel.
    -   [B-258031](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13387287) Added global javascript error reporter for Desktop.
    -   [B-257014](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13335333) Added lazy loading on carousel content.
-   M2
-   Vanilla 6

### Vanilla 4.9.3

2017-08-07

-   Shared
    -   Added `source` key to `INotificationService.UpdateEdsEventStatus()`.
-   Desktop
    -   [B-255546](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13262881) Added $.bwin.siteheader.refreshCashbackAmount method for refreshing cashback amount
    -   [B-256264](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13296328) Added configurable collapsible feature to desktop carousel
-   M2
-   Vanilla 6

### Vanilla 4.9.2

2017-08-03

-   Shared
    -   [B-254314](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13200751) Fixed RTMS reconnect on focus to be executed only if connection had previously dropped with 4004 error code from the server.
-   Desktop
-   M2
-   Vanilla 6

### Vanilla 4.9.1.3204

2017-07-31

-   Shared
    -   [B-254314](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13200751) Only one RTMS connection per SSO, User, Front end, Brand, Product and Channel combination. Share connections between several tabs.
    -   [B-246366](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12788902) Added user segmentation data to datalayer.
    -   [B-254422](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13207169) Added `source` parameter to the get bonus/offer API on `INotificationService`.
    -   [B-253766](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13171371) Backported `GenesysWebChat v1.1.0` functionality into Vanilla chat, including the support for remote logging of client errors.
    -   [B-253766](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13171371) Added `remoteLoggerUrl` to the chat client config pointing to the Vanilla's `JsErrController`.
-   Desktop
    -   [B-254984](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A13234178) Added support for lazy loading for carousel images.
    -   Fixed: Periodic appearing of loading spinner when RTMS connection was activated.
    -   Fixed bug on channel id for RTMS client.
-   M2
-   Vanilla 6

### Vanilla 4.9.0.3188

2017-06-01

-   Shared
    -   [B-192381](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:9882717) Update to .NET _4.6.2_
    -   `Login` and `LoginAsync` from `IAuthenticationService`/`FormsAuthenticationService` no longer sets `Thread.CurrentThread.CurrentCulture`. Both mobile and desktop apps have custom handling of this anyway, so the impact should be minimal
    -   [B-245782](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12760401) Preview mode enabled for internal requests. Added possibility to bypass the caching by querystring \_nocache parameter
    -   Added `web.config` transforms for new labels _sportingbet.gr_, _sportingbetgr.com_, _vistabet.gr_, _vistabet.com_.
    -   [B-224410](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11703629) Removed Kana chat support
    -   [B-247986](https://www52.v1host.com/GVCGroup/story.mvc/summary?oidToken=Story%3A12869303) Extended Inbox Endpoint For BRAT
    -   Added timeout for starting Genesys Tracker (chat API)
    -   Added the `bwin.chat.sendRawEvent()` function to the chat API that doesn't add any special data to those specified in the input parameter when sending the event to Genesys.
-   Desktop
    -   [D-75806](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A12845760) Fixed: AJAX requests don't trigger the `pageView` event in data layer tracking anymore.
    -   Fixed rendering of `SubNavigation` section: if it yields no HTML then wrapping markup in `DefaultLayout` is also not rendered.
    -   [B-248556](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12893766) Added $.bwin.rtms.Client() for RTMS consumers
-   M2
    -   Removed deprecated server side public page rendering support
-   Vanilla 6
    -   [B-249221](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12931388) Added `RtmsService` for subscribing to messages from Real-Time Messaging System. It can be configured in _Vanilla.Features.Rtms_ in DynaCon. See embedded docs for more details.
    -   [B-249145](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12928532) `UrlService` now uses the same style of encoding as `AngularJS` `m2Url`. This prevents an issue where history is written multiple times on hybrid apps when using `appendReferrer`.
    -   [B-249145](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12928532) `HeaderService.getHeaderHeight()` now returns 0 rather than throwing an error. This prevents an error from being thrown when adding message to message queue on native apps.

### Vanilla 4.8.1.3115 HOTFIX

2017-06-01

-   Shared

    -   Expire legacy top-level domain cookies for XSRF-TOKEN & XSRF-COOKIE-TOKEN

        The domain of the XSRF-TOKEN & XSRF-COOKIE-TOKEN has been changed to use the full domain (e.g. www. bwin.com) instead of the top level-domain (.bwin.com). This can lead to conflicts when a user with a legacy cookie arrives at an application that uses the new cookie. In the worst case the user is not able to log in unless manually deleting his cookies. The fix expires any legacy cookies on the top-level domain before adding the cookies under the full domain.

-   Desktop
-   M2
-   Vanilla 6

### Vanilla 4.8.0.3114

2017-05-24

-   Shared
    -   [B-249310](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12934648) Push and pull chat enablement made independent. Added the `isPushChatEnabled` property to the chat **client** configuration `bwin.config.chat`.
    -   Restructured properties of business events for chat + added customer's money category.
-   Desktop
    -   [D-74764](https://www52.v1host.com/GVCGroup/defect.mvc/summary?oidToken=Defect%3A12609281) Fixed: The `jquery.bwin.liveChat.js` uses invalid language route value.
    -   Vanilla's client configuration (desktop) moved from `$.bwin.config` to `bwin.config`. **BREAKING CHANGE for those who use it in JavaScript code**
-   M2

### Vanilla 4.7.1.3101 HOTFIX

2017-06-01

-   Shared

    -   Expire legacy top-level domain cookies for XSRF-TOKEN & XSRF-COOKIE-TOKEN

        The domain of the XSRF-TOKEN & XSRF-COOKIE-TOKEN has been changed to use the full domain (e.g. www. bwin.com) instead of the top level-domain (.bwin.com). This can lead to conflicts when a user with a legacy cookie arrives at an application that uses the new cookie. In the worst case the user is not able to log in unless manually deleting his cookies. The fix expires any legacy cookies on the top-level domain before adding the cookies under the full domain.

-   Desktop
-   M2
-   Vanilla 6

### Vanilla 4.7.0.3101

2017-05-19

-   Shared
    -   [B-244328](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12680397) Removed error for missing translations if the content has only shared fields (according to its template)
    -   We started using Visual Studio 2017 for development. So if you want to debug Vanilla you need it too.
    -   Fixed warning in `/health/config` in case config implementation class is dynamic object or dictionary.
    -   Changed assembly binding redirect of `Autofac.Integration.WebApi` to 4.0.0.0 in `template.web.config`.
    -   Decreased prefetch depth for loading public page content from 5 to 1 because requests for root public pages have been taking too long.
    -   Reduced amount of logged entries regarding obsolete `EnvironmnetSequence` in `web.config` or `machine.config` to single one.
    -   Added _System.ValueTuple 4.3.0_ to support C# 7 tuples. Version _4.3.1_ is incompatible with `Microsoft.Net.Compilers`.
    -   Reading application environment from `Environment` environment variable if it's not present in `web.config`. This is planned solution for comparny QA servers.
    -   Removed code obsolete for more than 3 months: `Bwin.Vanilla.Mvc.Security.IFormsAuthentication`, `ConfigurationModelAttribute`, `FrameworkConfigurationModelAttribute`, `WebConfigurationModelAttribute`, `ServiceConfigurationModelAttribute`, `AreaConfigurationModelAttribute`,
        `IConfigurationProvider`, `ConfigurationProviderExtensions`, `EnvironmentConfigurationProvider`, `JsonConfigurationProvider`, `MergingConfigurationProvider`, `ICultureResolvingStrategy`, `CookieConfiguration`, `IConfigurationEngine`, `IEnvironmentProvider.Environments`, `IBuildManager`,
        `BuildManagerFactory`, `IGlobalizationConfiguration`, `IUserLanguagesResolver`, `UserSettings`, `UserSettingsState`, `IUserSettingsProvider`, `ILanguageResolver.GetFromUserClaims()`, `IMobileRoutes`, `MobileRoute`, `MobileConfigurationBase`, `RoutingExtensions.MapClientRoutes()`.
    -   The chat configuration `IChatConfiguration` made public, other teams need to read it.
    -   [B-248645](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12899975) Added common set of properties to chat business events.
    -   Added mandatory `userDataResolver` (function) input parameter to the `bwin.chat.startGenesysTracker(userDataResolver)` function to be able to include some of the user data in the business events sent to Genesys. **BREAKING CHANGE**
    -   Added optional input parameter `extraData` (object) to the `bwin.chat.start(userData, extraData)` function (Chat API). The `extraData` is an arbitrary object and its properties together with the `userData` properties will be included in the request to start a chat.
    -   Additional optional property `extraData` in options for `bwin.chatUI.createChatWidget(options)` (Chat Widget) will be passed through to `bwin.chat.start(userData, extraData)`.
    -   Additional property `showUserError` (default: 'true') in the `options` for `bwin.chatUI.createChatWidget(options)` to switch on/off error messages shown to user on failing to start the chat or to send a message, the error message can be localized using `localization.generalError` on the object passed via the options.
    -   Fixed: posting expired reCAPTCHA response for verification throws an exception.
-   Desktop
    -   [B-231717](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12048114) Added an optional callback function called after the siteheader refresh
    -   [B-247834](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12861676) Updated siteheader to refresh only balance and loyalty points
    -   Disabled sections `HeaderMessages`, `FooterMessages` and `FooterDisclaimers` in `EmptyDialogLayout.cshtml`.
    -   [B-225877](https://www52.v1host.com/GVCGroup/story.mvc/summary?oidToken=Story%3A11787700) Background Carousel enhanced.
    -   Fixed: if reCAPTCHA challenge has expired then response sent to the server is not empty and it passes the validation on test environments because of Google test API which accepts any response.
-   M2
-   Vanilla 6
    -   Expose `PCComponent` base class
    -   Make user events inherit from `UserEvent` base class
    -   [B-247536](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12848550) Vanilla packages are now compilable with `strictNullChecks` (see [info](https://basarat.gitbooks.io/typescript/docs/options/strictNullChecks.html))
        -   This changed return types of some service methods to `null` from `undefined`, you shouldn't be affected if you don't explicitly check for `undefined`
        -   You can also enable this flag in `tsconfig.json` if you want to leverage this feature

### Vanilla 4.6.2.3031 HOTFIX

2017-06-01

-   Shared

    -   Expire legacy top-level domain cookies for XSRF-TOKEN & XSRF-COOKIE-TOKEN

        The domain of the XSRF-TOKEN & XSRF-COOKIE-TOKEN has been changed to use the full domain (e.g. www. bwin.com) instead of the top level-domain (.bwin.com). This can lead to conflicts when a user with a legacy cookie arrives at an application that uses the new cookie. In the worst case the user is not able to log in unless manually deleting his cookies. The fix expires any legacy cookies on the top-level domain before adding the cookies under the full domain.

-   Desktop
-   M2
-   Vanilla 6

### Vanilla 4.6.1.3030 HOTFIX

2017-05-24

-   Shared
-   Desktop
-   M2
-   Vanilla 6
    -   Fixed an issue where an exception was thrown when destroying `MessagePanelComponent`

### Vanilla 4.6.0.3029 HOTFIX

2017-05-10

-   Shared
    -   Ensure all AreaRegistrations are registered before running BootTasks.
-   Desktop
-   M2
-   Vanilla 6

### Vanilla 4.6.0.3028

2017-05-09

-   Shared
    -   HekatonCache logs a warning if explicitly specified expiration time is not within range from _MinExpirationTime_ to _MaxExpirationTime_ configured in _Vanilla.Services.Caching.Hekaton_ in DynaCon.
        -   [B-244094](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12666825) Added client ip to log information
        -   [B-245794](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12761623) Unified ShowFooterClock to use Vanilla.Features.Footer on both desktop and mobile
    -   Login duration timer is shown and autologout is enforced only for users that completed login workflow (it's a new condition to already present conditions required for these features).
    -   Extended default log4net layout pattern to include HTTP request details.
    -   [B-246050](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12770432) Extended `/mocks/config` to be able to edit simple file configuration overrides too.
    -   [B-245746](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12793656) Remove CodeContracts: With view to the the uncertain future and the lack of support in VS 2017 CodeContracts have been removed from Vanilla
        -   Arguments with that shall not be null have been flagged with JetBrains.Annotation.NotNull to provide intellisense feedback for R# users, (useful tooling: [CodeContracs R# Interop](https://marketplace.visualstudio.com/items?itemName=TomEnglert.CodeContracsRInterop))
        -   Arguments have been guarded with ArgumentException according to the orignal contract
        -   CodeContracts have been deactivated in all Vanilla project files
    -   [B-230595](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11986433) Canonical urls functionality moved from Sitecore to Dynacon and made more flexible by introducing regex matching of the host + path.
    -   Fixed problem with auto-logout race condition between Vanilla and PosApi by catching&logging the exception without rethrowing it.
        -   Removed obsolete code and dependency on the `IContentService` from the `SeoHelper`, inject it now via `ISeoHelper` and adapt your code accordingly. **BREAKING CHANGE**.
    -   Removed obsolete code `FilterAttributePropertyInjectorTask`. **BREAKING CHANGE**.
    -   Added extension method `ContainerBuilder.RegisterDslValuesProvider()` for registering DSL providers by convention.
        -   [B-201252](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10240980) Added filter to PCScript template and updated content templates
    -   Using client IP address resolved from headers to evaluate internal languages and to determine if request is internal in general.
    -   [B-247007](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12819187) Site-root redirects improvement: added option to persist query string from original request during redirects.
-   Desktop
-   M2
-   Vanilla 6
    -   [B-243916](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12656246) Updated to angular `4.1.1` using typescript `2.3.2`
        -   Changed (deprecated package) [`angular2-cookie`](https://github.com/salemdar/angular2-cookie/) to [`ngx-cookie`](https://github.com/salemdar/ngx-cookie)
        -   Removed `ts-helpers` dependency
        -   Added dependency on `@angular/animations`
            -   Requires importing `BrowserAnimationsModule` or `NoopAnimationModule` to your root module (updated in [migration guide](http://docs.vanilla.intranet/mobile/guide/migration-guide))
        -   `@ngtools/webpack` now reports more ts compilation errors, but generates code that doesn't pass `noUnusedParameters` check in `tsconfig.json`. Set this parameter to false if you use it. You can use `tslint` rule instead. Relevant issue - https://github.com/angular/angular/issues/11074.
    -   [B-246462](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12792706) Port `MessageQueue` from MobileToolbox
        -   `MessageQueueService` has a new API (see [docs](http://docs.vanilla.intranet/mobile/api/core/MessageQueueService))
        -   downgraded `m2MessageQueue` is available for hybrid apps for angular 1. Is has the same API as the old `MessageQueue` from MobileToolbox
        -   `touchTempData` is now private
        -   `storeMessages` is done as part of `goTo` in `NavigationService` (you can specify `storeMessageQueue` parameter) (in downgraded service this method is still usable directly, but not in angular service)
    -   [B-247450](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12843362) Improved webpack development experience
        -   Build can now be run without AoT (recommended for development https://github.com/angular/angular-cli/issues/5775#issuecomment-293228688)
        -   Source maps can now served from static files endpoint
        -   See testweb webpack config updates (https://vie.git.bwinparty.com/vanilla/TestWeb.M2/tree/master/source/Bwin.Vanilla-M2.TestWeb.Host/webpack). Most things were moved to common, vendor.ts was removed and is now automatically chucked from app, added option to enable AoT (disabled by default for development), used webpack-dev-server for live reload/HMR, removed children output which is too verbose for AoT, etc.

### Vanilla 4.5.0.2939

2017-04-24

-   Shared

    -   [B-243636](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12643258) Support for configuration session overrides useful for end-to-end testing and for product managers to try various configuration options. UI is available at `/mocks/config` of your application. Read more in [docs](http://docs.vanilla.intranet/configuration-system.html#session-overrides).
    -   [B-235949](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12268119) Automatically adding _DataType=dummy_ when merging configuration overrides from the file so that you don't need to specify it when introducing new features or keys just in overrides yet.
    -   Added `Bwin.Vanilla.Content.IDocument.Data` property to allow more flexible manipulation of underlying content (needed by Vanilla itself).
    -   [B-240045](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12475300) Support for automatic deserialization of [Vanilla DSL](http://docs.vanilla.intranet/dsl.html) expressions in DynaCon configuration classes. **This requires custom providers to be registered in Autofac using `DslValuesProvider.Create(string, Func<>)`** if their implementations have external dependencies (which need configuration). Then we can parse DSL syntax before the configuration is available.
    -   Added explicit check to guard that sliding expiration of forms authentication is disabled.
    -   Limiting absolute expiration time of items in distributed cache to 1 day. Configurable in _Vanilla.Services.Caching.Hekaton_ -> _MaxExpirationTime_.
    -   Updated:
        -   Autofac.WebApi2: 3.4.0 -> 4.0.0
            -   **BREAKING CHANGE** if you used it.
        -   Microsoft.Net.Compilers: 1.3.2 -> 2.0.1
            -   `ToolsVersion` in Visual Studio project files must be updated to `14.0` at least.
            -   Old Jenkins build servers don't support MSBuild v14 yet. B2D team is already working on it.
        -   System.Collections.Immutable: referenced from Microsoft.Net.Compilers -> 1.3.1
            -   Fixes the issue from `Vanilla 4.3.100`. Please update your references accordingly.
    -   Fixed serialization of chat's `UserData`.
    -   [B-202364](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10330486) Added support for using protocol relative url on sitecore
    -   [B-245092](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12727418) Added login duration counter for authenticated users shown in the page header. ([see docs](http://docs.vanilla.intranet/login-duration.html#login-duration))
    -   [B-241602](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12548044) Added support for automatic logout enforced on users with configured daily limit. ([see docs](http://docs.vanilla.intranet/login-duration.html#auto-logout-for-users-with-daily-limit))
    -   [B-244403](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12686632) Disabled EDS buttons for status different than OFFERED
    -   [B-241590](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12547660) Added builders for `IContentConfiguration`, `IServiceClientsConfiguration`, `IDeviceRecognitionConfiguration`, `IMailConfiguration` to guarantee that created instances are always valid including non-web apps running without DynaCon.
    -   [B-240007](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12472878) Set full domain for XSRF-TOKEN & XSRF-COOKIE-TOKEN to make testing easier.
    -   [B-243373] Visual Studio 2017

        -   Code Contracts: for Code Contracts a workaround is needed (see [CodeContracts Issue 451](https://github.com/Microsoft/CodeContracts/issues/451)): Copy `C:\Program Files (x86)\MSBuild\14.0\Microsoft.Common.Targets\ImportAfter\CodeContractsAfter.targets` to `C:\Program Files (x86)\MSBuild\15.0\Microsoft.Common.Targets\ImportAfter\CodeContractsAfter.targets`
        -   Typescript:

            -   If you do not want VS to build automatically, use `TypeScriptCompileBlocked` in the proj file to get editing support without automatic compilation. (see [Compiler Options in MSBuild](http://www.typescriptlang.org/docs/handbook/compiler-options-in-msbuild.html))
            -   Typescript errors TS2300 (duplicate identifier) and TS5055 (cannot write file ...) can be eliminated by adding a (basic) tsconfig.json to the root of your project. (see [Problem 2448](https://developercommunity.visualstudio.com/content/problem/2448/typescript-errors-ts2300-and-ts5055.html))

            Example:

            ```
            {
            "compilerOptions": {
            	"noImplicitAny": false,
            	"noEmitOnError": true,
            	"removeComments": false,
            	"target": "es5"
            }
            }
            ```

        -   Modeling Projects Installation: In order to open Modeling Projects, select `.NET desktop development` workload and add the optional `Architecture and Analysis Tools Component` when installing VS 2017
        -   Modeling Projects UML Diagrams: support for UML diagrams has been dropped, only LayerDiagrams and Directed Graph Documents are supported, (see [details](https://docs.microsoft.com/en-us/visualstudio/modeling/what-s-new-for-design-in-visual-studio#uml-designers-have-been-removed))

    -   [B-214249](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11066591) Added DSL providers: App.Environment, App.IsProduction, Request.IsInternal
    -   Added DSL providers: User.RegistrationDate, User.DaysRegistered

-   Desktop
    -   [B-234781](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12209860) Added $.bwin.siteheader.refreshBalance method to update balance only value (not the whole siteheader)
    -   Fixed: loading of filtered background images/teasers writes an error to the log despite that filtered is valid state.
-   M2
    -   `m2User` properties that are not defined now correctly return `null` (e.g. when `dateOfBirth` is not defined, it returns null instead of empty date)
    -   [B-243979](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12660044) Disabled WebAPI anti-forgery for _GET_, _HEAD_ and _OPTIONS_ requests.
    -   [B-241602](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12548044) Added support for automatic logout - you have to handle what happens after logout - [see docs](http://docs.vanilla.intranet/login-duration.html#auto-logout-for-users-with-daily-limit), [testweb example](https://vie.git.bwinparty.com/vanilla/TestWeb.M2/blob/master/source/Bwin.Vanilla-M2.TestWeb.Host/Client/src/bootstrapper.pure.ts#L26-30)
-   Vanilla 6
    -   Fixed values for `LANG_ID` and `LOCALE_ID` to use correct values (route value and culture name respectively) instead of `lang` attribute on `html` node (that serves a different purpose)
    -   `MenuService`: `highlightItem` and `setItemCounter` now take only item name as a way to address the target menu item, rather than item name and section name
    -   Downgraded `m2ApiBase` now returns `$q` promise instead of es6 `Promise`
    -   Custom properties defined via downgraded `m2User` service are now accessible on `m2User` (as well as `UserServiceCore`)
    -   `DynamicLayoutService.removeComponent` second parameter is now optional (it's not required for `single` slots)

### Vanilla 4.4.1.2787 HOTFIX

2017-04-05

-   Shared
    -   If `TreatAsError.MissingTranslation` is specified when loading the content then the error is just logged, content is returned as successful.
-   Desktop
-   M2
-   Vanilla 6

### Vanilla 4.4.1.2786 HOTFIX

2017-03-31

-   Shared
    -   Not executing content translation check (version > 0) in case of documents without any field e.g. `IFolder`
    -   Improved error message related to missing content translation.
    -   Fixed: `IContentService.GetChildren()` doesn't consider `DefaultPrefetchDepth` from the configuration.
-   Desktop
    -   Fixed: Loading of disclaimers fails if folders are not translated.
-   M2

### Vanilla 4.4.1.2782

2017-03-30

-   Shared
    -   Fixed handling of the `ChatConfiguration` when the `ChatState` is set to `Disabled`. Previously it prevented an application from starting up.
-   Desktop
-   M2
-   Vanilla 6

### Vanilla 4.4.0.2775

2017-03-28

We are making the first step to `Vanilla 6` release with this version. The `angular 2` version of vanilla is now available to be used (see more on how to get started below).
We encourage everyone that currently uses m2 to try to upgrade to this new version and provide feedback and report any issues so we can make the framework as well as the documentation
as good as it can be. We have [a new documentation site dedicated to Vanilla 6](http://docs.vanilla.intranet/mobile).

#### What's next

We will have a few versions that support both `Vanilla 6` and `m2`. After a few rounds of feedback we will release a new major version `6.0.0` which will remove the pure `m2` framework
and will only support hybrid applications (this does not affect desktop).

-   Shared
    -   [B-225260](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11759684) Removed logging for antiforgery token session expired. Added absolute URL to exception info.
    -   [B-205297](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10531642) Created 2 new DSL filter operators ToLower() and ToUpper().
    -   [B-240001](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12472400) Added "user.profile.accountID" to DataLayer
    -   Exposed logic for resolution of client IP address - `Bwin.Vanilla.Core.Web.IClientIPResolver`.
    -   [B-204706](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10495253) Skipping private IP address during client IP resolution if there is a public one found.
    -   Using client IP address resolved from headers to check access to diagnostic pages such health reports etc.
    -   [B-241961](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12564359) Added shared chat widget. Consider [Chat Widget Documentation](http://docs.vanilla.intranet/chat.html) to get started.
-   Desktop
    -   [B-232796](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12106774) - Added integration of Genesys chat (based on GMS v1)
    -   **BREAKING CHANGE for Desktop**: Replacement of $.bwin.spinner with $.bwin.progressIndicator in the Deskop-Theme's core.bundle.js (`~/Themes/Desktop/Scripts/core.bundle.js`)
        -   Replaced `Plugins/jquery.bwin.spinner.js` with `Plugins/jquery.bwin.progressIndicator.js`
        -   Replaced `Plugins/jquery.bwin.ajaxspinner.js` with `Plugins/jquery.bwin.ajaxProgressIndicator.js`
        -   The replaced scripts are still available in the plugins folder
-   M2
    -   [B-242097](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12570467) `PM2ColPage` is now supported for client side page matrix
    -   [B-232795](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12106762) - Added integration of Genesys chat (based on GMS v1)
    -   Bypassing anti-forgery check when retrieving Sitecore content and determining if reCAPTCHA should be enabled.
-   Vanilla 6
    -   `Anuglar 2` version of vanilla supporting hybrid applications is now avaible. See [Migration guide](http://docs.vanilla.intranet/mobile/guide/migration-guide) to get started.
        [API reference](http://docs.vanilla.intranet/mobile/api) is also avaiable.

### Vanilla 4.3.103.2637 HOTFIX

2017-04-05

-   Shared
    -   If `TreatAsError.MissingTranslation` is specified when loading the content then the error is just logged, content is returned as successful.
-   Desktop
-   M2
-   Vanilla 6

### Vanilla 4.3.103.2636 HOTFIX

2017-03-31

-   Shared
    -   Not executing content translation check (version > 0) in case of documents without any field e.g. `IFolder`
    -   Improved error message related to missing content translation.
    -   Fixed: `IContentService.GetChildren()` doesn't consider `DefaultPrefetchDepth` from the configuration.
-   Desktop
    -   Fixed: Loading of disclaimers fails if folders are not translated.
-   M2

### Vanilla 4.3.103.2634 HOTFIX

2017-03-23

-   Shared
    -   Fixed compatibility between ICacheProvider.GetCache(GeneralCache) and DistributedCache so that if you use same key then you get/set same entry.
-   Desktop
-   M2

### Vanilla 4.3.103.2632 HOTFIX

2017-03-17

-   Shared
-   Desktop
-   M2
    -   Fixed: reCAPTCHA component fails to obtain it's enablement state when anonymous access is restricted (like on _premium.com_).

### Vanilla 4.3.103.2631

2017-03-13

-   Shared

    -   [B-241876](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12560048), [B-233210](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12130090) Changed reCAPTCHA:
        -   Added support for areas. They must be specified in the code and match configuration _Vanilla.Features.ReCaptcha_ -> _Areas_. For legacy code there is _Default_ area.
        -   Added option to configure enablement after particular number of failures. They must be reported by app code.
        -   Read more in [docs](http://docs.vanilla.intranet/features-recaptcha.html).
    -   [B-237539](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12364901), [B-237540](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12364918) Support for rendering buttons for opting into to EDS events. Read more in [docs](http://docs.vanilla.intranet/features-eds-buttons.html).
    -   [B-241480](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12543536) Added `AddWorkflowData` endpoint to `IAuthenticationService` and `IClaimsService`, and added `WorkflowKeys` collection to `ILoginResult`.
    -   Switched to version _7_ of Vanilla service in DynaCon: removed feature `Vanilla.Services.Caching.AppFabric`, removed key `SeoTrackingConfigurationLocation` from `Vanilla.Web.Tracking`, removed keys `Routes`, `CashierUrl`, `TransactionHistoryUrl` from `Vanilla.Features.Mobile` and removed key `IsEnabled` from `Vanilla.Features.ReCaptcha`.
    -   [B-202560](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10341749) Added feature to configure downtime messages by DynaCon.
    -   Added `web.config.transform` for _hepsibahis.com_, _superbahis.com_ and _tr.betboo.com_.
    -   [B-225584](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11772327) Simplified usage of distributed cache:
        -   Replaced `ICacheProvider` (now deprecated) with simple `DistributedCache`.
        -   If you need to isolate entries by prefixing their keys then use `ObjectCache.IsolateByPrefix()` extension method.
        -   Replaced `Vanilla.Services.Caching` DynaCon feature with `Vanilla.Services.Caching.Hekaton` -> `IsEnabled` key.
        -   Read more in [docs](http://docs.vanilla.intranet/caching-infrastructure.html).
    -   Added client IP address info to health pages.

-   Desktop
    -   [B-238572](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12400740) Added possibility to disable closing popup via pressing ESC.
-   M2
    -   Added generic `request` method to `m2ApiBase`
    -   Deprecated tag `hgroup` in `PCTeaser` render template was changed to `section` _Theme update required_
    -   [B-233210](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12130090) `m2-re-captcha` now requires `area` parameter to be enabled by corresponding dynacon configuration (**in camel case**)
    -   [B-234133](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12177420) It is now possible to add content messages to the top of the page (special styling is required because of fixed header).

### Vanilla 4.3.102.2504

2017-02-23

-   Shared
    -   [B-237539](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12364901) Added PosAPI service clients for EDS opt-in.
    -   [B-238424](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12392188) Added `Route.Language` to the Route DSL provider.
    -   [B-226244](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11804499) Added configuration feature for the footer clock.
    -   Changed detection of mixed claims from PosAPI/platform on login to be case insensitive.
-   Desktop
-   M2
    -   Removed language from `base` tag (before: `<base href="/en" />` after: `<base href="/" />`)

### Vanilla 4.3.101.2481

2017-02-20

-   Shared
    -   [B-225584](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11772327) Removed AppFabric - package `Bwin.Vanilla.Caching.AppFabric` with associated configuration.
    -   Marked all dependencies of `LoginResult` as `[Serializable]`.
    -   Added support for injecting corresponding `ILog` using Autofac if your component is registered using reflection activator.
        Example: If you have a service with constructor: `public Foo(IBar bar, ILog log)` and register it: `builder.RegisterType<T>()` then it gets injected `LogManager.GetLogger(typeof(Foo))`.
-   Desktop
-   M2

### Vanilla 4.3.100.2470

2017-02-17

-   Shared
    -   [B-236604](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12315443) Added 301 redirection for SEO
    -   [B-238780](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12413413) Decommissioned _jsonconfigs_, related configuration engine and label config packages.
        -   Most likely you'll first have to uninstall label config packages manually.
        -   When switching `web.config` the prefix _mobile_ is not required anymore.
        -   Use just a single `Environment` instead of `EnvironmentSequence` in `appSettings` in `web.config`.
    -   Created _sportingbull.com_ config files.
    -   Marked `LoginResult` as `[Serializable]`.
    -   When sending feedback to DynaCon, only first part (first property of composite path) will be posted in order to match DynaCon key. Example: if `RootUrl.RenderView.View` of feature `Vanilla.Features.SiteRoot` is invalid then `RootUrl` will be posted as a key.
    -   Removed support for content overrides.
    -   Removed code toggles.
    -   Removed `ContentConfiguration.Label`. It must be replaced already in DynaCon.
    -   Introduced new `ICookieConfiguration` instead of old `CookieConfiguration`.
    -   Removed code obsolete for more than 3 months: `IContentSettingsConfiguration`, `EmptyNameValueCollection`, `FilterPrefixAttribute`, `IContentFilterProvider`,
        `Bwin.Vanilla.Core.Filters.IFilterEvaluator`, `CultureInfoExtensions`, `Bwin.Vanilla.Core.Globalization.LanguageInfo`, some properties of `IGlobalizationConfiguration`,
        `ICultureManager`, `IUserLanguageResolver`, `ICrmService.TryGetLoyaltyCategory()`, `NoContentPathAttribute`, `ContentPathAttribute`, `IMobileArea.CountryCode`,
        `ICrmService.RefreshThisWeeksPoints()`, `IVipService`, some constructors of `PosApiServiceBase`, `PosApiServiceBase.ServiceClientsConfiguration`, `JsonAssert`,
        `ContentModelAttribute.UseOverrides`, `IContentManager`, `IContentSession`.
    -   [B-222371](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11541434) Added dynamic configuration support for _Content Prefetch Depth_.
    -   Changed all configured site root redirects (`RedirectToUrl`, `RedirectToLink`, `RedirectToAction`) to 301 permanent for simplicity.
    -   Changed `IContentService`:
        -   Separated error treatment (`TreatAsError` enum) and throwing exceptions (`ThrowOnError` flag) on `ContentLoadOptions`.
        -   Added `ContentLoadOptions.Graceful`.
        -   This allows treating content which is not-found, filtered or missing translation as invalid but `IContentService` would write an error to log file thus you won't need to handle an exception.
        -   Added `GetRequiredString()` method.
    -   Added support for C# 6 syntax in Razor views by including package `Microsoft.CodeDom.Providers.DotNetCompilerPlatform`.
    -   Updated:
        -   _Microsoft.Net.Compilers_ 1.2.2 -> 1.3.2.
        -   _Microsoft.Bcl.Immutable_ 1.0.34 -> _System.Collections.Immutable_
            -   Please manually add a reference to _System.Collections.Immutable.dll_ in _tools_ folder of _Microsoft.Net.Compilers_ nuget package.
            -   There is a known incompatibility bug: [Microsoft.Net.Compilers is bundled with old version of System.Collections.Immutable](https://github.com/dotnet/roslyn/issues/12255).
-   Desktop
    -   Fixed handling of iframe-based dialogs on non-HTML5 browsers
-   M2
    -   Values returned by `IClientUserValuesProvider` now overwrite vanilla default values
    -   `workflowType` is now a user property rather than claims property
    -   `CashierUrl` and `TransactionHistoryUrl` were removed from `Vanilla.Features.Mobile` configuration
    -   Fixed the `NotTrackedQueryStrings` feature that was not working on M2. The feature is about excluding preconfigured query strings from being tracked.

### Vanilla 4.3.99.2372

2017-02-03

-   Shared
    -   Changed site root redirect (if configured in the `Action` field) from temporary (302) to permanent (301)
        for user who comes to absolute root `/` and his language is resolved to default one. This is also applies for search engines e.g. Googlebot.
-   Desktop
-   M2

### Vanilla 4.3.99.2371

2017-02-01

-   Shared
    -   [B-234912](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12217251) Removed internal server name ("page.server" item in the data layer) from data layer tracking (both desktop and mobile) due to security reasons. Based on the incident [INC171689](https://bwinparty.service-now.com/nav_to.do?uri=incident.do?sys_id=103f68734fe26a805dd634828110c791).
    -   Created `Common` Theme inside `Bwin.PluginHost` with frontend files shared between both Desktop and M2.
    -   **BREAKING CHANGE for Desktop** The content of the `Default` Theme folder in the `Bwin.PluginHost` has been moved to the **newly created `Bwin.Themes.Desktop` Nuget package that has to be included in every Desktop project(!)**. This way the Desktop frontend files will be included in the `*Host` folder in the Desktop products only and not also M2 (as it was before). Now the `ThemeManifest.json` of the `Default` Theme refers to `Desktop` Theme as its parent in order to be able to still use non-updated Themes from FCS team. Once all of the Desktop products will be updated to use the `Bwin.Themes.Desktop` package, we will remove the `Default` Theme from `Bwin.PluginHost`.
    -   Fixed `switch-config` if you have only Visual Studio 2015 installed.
    -   Changed SEO tracking:
        -   [B-198126](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10080870) Moved configuration to DynaCon to feature: _Vanilla.Features.Seo.Tracking_.
        -   [B-231816](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12053552) Added support for assigning different WMID-s per resolved language.
        -   [B-232028](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12067251&RoomContext=TeamRoom%3A3089623) Writing separate cookie with landing page URL.
        -   Removed support for keywords because they haven't been used.
        -   Find more info in [docs](http://docs.vanilla.intranet/seo-features.html#seo-tracking).
    -   Extended the session-expiry for bwin.dk from 20 to 60 minutes (desktop and mobile).
-   Desktop
-   M2

    -   **BREAKING CHANGE** You can now set properties like ng app name, script and style urls for `ClientBootstrap` page using `IMobileAppConfigurationBuilder` in your `AreaRegistration`.

        Example:

        ```
        mobileAppConfigurationBuilder
            .SetNgAppName("yourApp");
            .SetAssetScripts("yourPlugin/scripts/yourPlugin.bundle.js")
            .SetAssetStyleSheets("yourPlugin/styles/yourPlugin.bundle.css");
        ```

    -   [B-235449](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12245041) Added `m2RouteProvider` helper to register routes with `{culture}` placeholder (see [code](https://vie.git.bwinparty.com/vanilla/monorepo4/tree/master/Source/Bwin.PluginHost/Themes/Mobile/Assets/js/features/route/route.provider.js) for usage)
    -   [B-198135](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10081304) Refactor MobileConfiguration and MobileRoutes

        -   Default server-side configuration of client-side routes is discouraged in favour of configuring client-side routes directly in javascript
        -   Therefore `Bwin.Vanilla.Mvc.Routing.MapClientRoutes(..)` (used to register `MobileRoutes` in your `PluginAreaRegistration`) is deprecated, and we plan to decommission `IMobileConfigration.Routes` and all related code in one of the next sprint(s).

            -   **Steps to refactor**

                -   **Step 1**: Remove ` Bwin.Vanilla.Mvc.Routing.MapClientRoutes(…)` from your PluginAreaRegistration (, you might want to backup the current route registration issued as part of `/{culture}/client-bootstrap-scripts.js `, as this will result in Vanilla rendering only the `otherwise` route.

                -   **Step 2**: Add the client side routing configuration from the previously backed up routes (without the `otherwise` route) to your plugin bundle using the route provider from [B-235449](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12245041)

                -   **Step 3**: Setup server side routing (to handle reload of page without client side redirect to SPA home)

                    -   Constrain the generic route (`{controller}/{action}`) to match only white-listed controllers and add as the last route a catch all route for the plugin (`{*path}`) e.g.

                    ```
                    context.MapRoute("{controller}/{action}", r =>
                        r.WithDefault(RouteValueKeys.Action, "Index")
                        .WithConstraint(RouteValueKeys.Controller, ConstrainedTo.AllowedValues(new[]
                            {
                                GetControllerName<...>(),
                            }
                        )));

                    context.MapRoute("{*path}", builder => builder
                        .DefaultsTo<MobileController>(mobile => mobile.ClientBootstrap()));
                    ```

                    -   configure anonymous access if necessary (corresponds to MobileRoute.AllowAnonymous = true)

                    ```
                    context.MapRoute("...", builder => builder
                        .DefaultsTo<MobileController>(mobile => mobile.ClientBootstrap())
                        .WithDataToken(RouteDataTokenKeys.MobileRouteAllowAnonymous));
                    ```

                    -   configure authorized access if necessary (corresponds to MobileRoute.Authorize = true)

                    ```
                    context.MapRoute("...", builder => builder
                        .DefaultsTo<MobileController>(mobile => mobile.ClientBootstrap())
                        .WithDataToken(RouteDataTokenKeys.MobileRouteAuthorize));
                    ```

                    -   configure public page route for server-side 404 checking if necessary

                    ```
                    context.MapRoute("p/{*path}",
                        builder => builder
                            .DefaultsTo<MobileController>(mobile => mobile.ClientBootstrap())
                            .WithConstraint(RouteValueKeys.Path, ConstrainedTo.NotEmpty())
                            .WithDataToken(RouteDataTokenKeys.PublicPagesRoot, PlaygroundPlugin.PublicPagePath)
                            .WithoutAreaPrefix());
                    ```

                -   **Step 4**: Consider to implement server-side 404 handling for specific routes
                    -   Vanilla provides out-of-the-box 404 handling for public pages wired up using the MobileController (see above) by checking on the server side if the requested content exists
                    -   In order to implement 404 checks for other routes you need to implement and register `Bwin.Vanilla.Mvc.Ng.StatusCodeInspection.INotFoundInspector` and use a the key of a data token present on the route as your inspector's Name property value.

        -   [B-198135](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10081304) Routes now support `canActivate` property (similar to angular 2 [example](http://www.sparkbit.pl/angular-2-route-guards-real-life-example/)) - you can specify array of services that either implement canActivate function or are a function itself. If the function returns false, the route activation is prevented. You can also redirect to another location within the fucntion (and then return false to stop futher canActivate handler resolution)
        -   Fixed random behavior of canonical tag pointing to desktop.
        -   [B-231743](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12049816) SiteRoot redirect is now also applied on the client side. Register this functionality by specifying `canActivate` property on site root routes.

        ```
        when('/', {
            template: '<some-component></some-component>',
            canActivate: ['m2SiteRootRedirect']
        })
        ```

        -   Added `m2Navigation.goTo` method (based on `m2Toolbox`)
        -   Added `m2Url.isAbsolute` method
        -   Default `otherwise` route no longer has `topnav` property. Override this route if you need it.

### Vanilla 4.3.98.2276

2017-01-12

-   Shared
    -   [B-231605](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12041067) Enable web api attribute routing
        -   Supports `{culture}`-token (i.e. sets the culture for the current thread with falling back to the configured default culture)
    -   [B-234300](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12186818) Moved `IContentMessagesLoader` to `Bwin.Vanilla.Mvc`
    -   [B-235073](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12223659) **BREAKING CHANGE (for unit tests)** Updated NUnit 2.6.4 -> 3.5.0
    -   Added detection of error if message queue mixes up messages or PosAPI/platform mixes up claims on login. This should help to investigate welcome message
        incidents [INC168001](https://bwinparty.service-now.com/nav_to.do?uri=incident.do%3Fsys_id=43f95f734f7d6e005dd634828110c79b%26sysparm_stack=incident_list.do%3Fsysparm_query=active=true)
        and [INC177300](https://bwinparty.service-now.com/nav_to.do?uri=incident.do%3Fsys_id=020fa4354f3f66405dd634828110c7fe%26sysparm_stack=incident_list.do%3Fsysparm_query=active=true).
-   Desktop
-   M2
    -   [B-192248](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12187145) Updated AngularJS 1.5.8 -> 1.6.1. (see changes for [1.6.0](https://github.com/angular/angular.js/blob/master/CHANGELOG.md#160-rainbow-tsunami-2016-12-08))
    -   Added label config for _bwin.fr_ containing only `web.config.transform` assuming DynaCon is used.
    -   [B-234300](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12186818) `m2-referrer` directive was removed
    -   [B-235026](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12186818) Client side page matrix fixes
        -   `PCComponentFolder` now correctly renders items according to set `MaxItems` property
        -   `PCContainer` template is now supported
    -   [D-72802](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:12230571) `m2ApiBase` will now correctly call https absolute urls (fixes issue where public pages return not found on https hosted sites)

### Vanilla 4.3.97.2241

**Warning: Broken public page api call with `m2-public-page-loader` or `m2PublicPage` service on https sites (D-72802).**

2017-01-04

-   Shared
    -   [D-71346](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A11947291) Fixed: Local configuration overrides are not applied during application start. Thus non-volatile values (e.g. routes, theme) can't be overridden and features/keys can't be added/removed locally.
    -   Added support for removing properties in DynaCon local overrides by setting a value to `undefined`.
    -   Added `/mocks/config/` demo page for easy editing of DynaCon local configuration overrides from UI. If you like it then let us know so that we can improve it.
    -   [B-226348](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11810691) Added DSL provider `RequestHeaders.Get('headerName')` to be usable e.g. in content filters.
    -   [B-223635](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11629653) Added support for internal language available only if a request is made from company network. You can opt out from this logic by adding a cookie `InternalLanguages` with value `false`. They can be configured in `Vanilla.Web.Globalization` -> `InternalCultureNames` in DynaCon.
    -   [B-223635](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11629653) Dynamically resolving allowed languages thus `ILanguageResolver.GetAllowed()` should be used instead of `IGlobalizationConfiguration.AllowedLanguages`.
    -   Removed obsolete code: `IOfflineLanguagesRedirectManager`, `IHiddenLanguagesRedirectManager`.
-   Desktop
    -   [B-219554](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11388531) move theme overrides to Framework
        -   DefaultLayout markup changes
            -   removed depreceated IE conditional comments for IE7/8/9 since not supported anymore, please refer to [browser policy](http://themepark.bwin.com/en/p/themepark/developer-pages/browserpolicy)
            -   removed deprecated `<a name="top"></a>` and set id="top" on `<div id="top" class="container"></div>`
            -   changed `CarouselBackground` section to be inside `main-wrap` container
            -   added class on `main-wrap` when `backgroundCarousel` is used
            -   moved `@bodyClass` and `style="@bodyStyle"` from `body` to `main-wrap` container
            -   moved `sub-navigation` outside `main-wrap`, just before that container and wrapped it in `sub-header-row`
            -   DisclaimerTop, InfoMessages, HeaderMessages, TopBanner are wrapped in "preheader"
            -   added plugin wrapper div around `sub-navigation` and `main-wrap` to bootstrap livebook angular app
        -   \_SiteHeader.cshtml markup changes
            -   wrapping `meta-navigation` and `user-state` in `header-row` container
            -   wrapping `header-logo` and `header-bar` in `header-row` container
        -   jquery.bwin.personalbutton.js
            -   added funtionality to keep message-viewer position on window resize
            -   added class first, for the first item in the message-viewer
            -   added position functionality depending if personal button exists or not
        -   jquery.bwin.signupbonus.js
            -   since all new flat themes have a bigger bonus dialog the width was changed to 418 (was 336); this will be overwritten for old themes (eg partypremium) on theme level
        -   page-matrix.js
            -   add class to `#header` when `sub-header-row` is shown to make styling of header border-bottom more flexible
-   M2

    -   The static `Bwin.PluginHost.Areas.App.Models.SeoHelper` is now deprecated and will be removed, use `Bwin.Vanilla.Mvc.Seo.ISeoHelper` via the container instead.
    -   [B-208573](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10768104) Added m2ServerError component that displays content from `App-v1.0/Partials/InternalServerError`
    -   [B-233199](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12129261) Default `IClientConfigurationProvider` instances for mobile apps are now only registered if the HostConfiguration has a plugin named `AppNg`
    -   Added `menu-section`, `menu-section-subtitle`, `menu-sections-title` and `menu-item` to the new main menu for easier styling
    -   [B-233164](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12127489) You can now optionally specify a `delay` for `m2LoadingIndicator` (example: `m2LoadingIndicator.start({ delay: 0 })`)
    -   [B-233220](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12130783) Injecting `m2User` into `$http` interceptor should no longer cause circular reference error
    -   Modified structure of `Header.cshtml` and `LoginBar.cshtml`. Should be updated in concert with the next Theme version after 4.0.1.190.
    -   [B-231868](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12057304) Added **client side page matrix**. _Theme update required_ (see [docs](http://docs.vanilla.intranet/client-side-page-matrix.html))

        -   Server side page matrix rendering is now deprecated for M2 (it will still work for a period of time)
        -   Migrate public page route to use this feature:

        BEFORE:

        ```
        "YourModule_PublicPage": {
            "path": "/{culture}/p/:path*",
            "template": "<m2-public-page-loader></m2-public-page-loader>",
            "PublicPagesRoot": "YourModule-v1.0/PublicPages/"
        }
        ```

        AFTER:

        ```
        "YourModule_PublicPage": {
            "path": "/{culture}/p/:path*",
            "template": "<m2-client-side-public-page-loader public-page-root="YourModule-v1.0/PublicPages/"></m2-client-side-public-page-loader>"
        }
        ```

        -   Use `m2-page-matrix` component to render any supported public page or pc component on the client (see [code](https://vie.git.bwinparty.com/vanilla/monorepo4/tree/master/Source/Bwin.PluginHost/Themes/Mobile/Assets/js/features/page-matrix/pageMatrix.component.js) for usage)
            -   You can use `m2PageMatrix` service to specify which component to render by template name if you need to override or render custom templates (see [code](https://vie.git.bwinparty.com/vanilla/monorepo4/tree/master/Source/Bwin.PluginHost/Themes/Mobile/Assets/js/features/page-matrix/pageMatrix.service.js) for usage)
        -   Content is retrieved from `ContentController` (api controller) with `m2Content.getJson()`

            -   To use this, you need to specify which content paths are allowed with `IContentEndpointConfigurator` in your area registration

            ```
            contentEndpointConfigurator.AddAllowedPath("MobilePortal-v1.0/PublicPages/*")
            ```

    -   Menu items now support `target` attribute. (When specified without `clickAction`, it will act as `a` with `target`, with `clickAction` it will pass target as parameter and `openInNewWindow` will use it as `$window.open(<url>, <target>)`)
    -   Refactored footer client configuration provider
        -   Links in the footer now behave like menu items (they support menu actions etc.)
        -   Legal warnings are rendered with client side page matrix
        -   **BREAKING CHANGE** `m2Footer` service has been removed. Instead use `m2ClientConfig.reload(['m2FooterContent'])`
    -   [B-233221](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12130796) Main component can now be easily replaced on products
        -   Due to some heavy customization of main component on some products, we decided to extract the functionality from it so you can easily implement your own version of a main component and register it in `main` dynamic layout slot
            -   `m2-min-height-fix` is now an attribute directive. It can be turned off by setting the attribute to `false`.
            -   `isHistoryNavigation` is now a method of `m2Navigation` service
        -   _Angular2 note:_ In the future similar component might be used as starting point to load a product application into labelhost layout
    -   [B-233785](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12159142) Header menu actions are now configurable. See [docs](http://docs.vanilla.intranet/guides-m2-extensions.html#header) for more info.
        -   **BREAKING CHANGE** Register button no longer appends rurl to the link. Instead `gotoRegistration` menu action should be overriden by mobile toolbox/login. You can use `m2Url.appendReferrer()` to add return url.
    -   [B-224568](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11717721) Refactored content messages (see [docs](http://docs.vanilla.intranet/client-side-page-matrix.html#content-messages))
        -   Render content messages with `m2-content-messages` component (see [code](https://vie.git.bwinparty.com/vanilla/monorepo4/tree/master/Source/Bwin.PluginHost/Themes/Mobile/Assets/js/features/content-message/contentMessages.component.js) for usage) instead of `ContentMessagesController`
        -   Inline javascript in content messages is no longer supported

### Vanilla 4.3.96.2166

**Warning: Broken public page api call with `m2-public-page-loader` or `m2PublicPage` service on https sites (D-72802).**

2016-12-14

-   Shared
    -   `DocumentId` now has property `ItemName` that returns the part of path after the last `/` (always lower case) (e.g. DocumentId: `/App-v1.0/Folder/SomeItem` - ItemName: `someitem`)
-   Desktop
-   M2
    -   Dynamic component `attr` are now passed as inputs (always use `<` binding instead of `@` for dynamic slot component attributes)
    -   [B-231817](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12053560) Added new main menu (see [docs](http://docs.vanilla.intranet/guides-m2-extensions.html#main-menu-new))

### Vanilla 4.3.95.2160

**Warning: Broken public page api call with `m2-public-page-loader` or `m2PublicPage` service on https sites (D-72802).**

2016-12-13

-   Shared
    -   Removed `Bwin.Vanilla.Mvc.Touch` NuGet package. **Please remove all references from your projects too.**
    -   Made dependencies between Vanilla packages strict so that you can't install incompatible versions.
    -   Changed `GetChildren()` and `Get<T>(IEnumerable<DocumentId>)` methods of `IContentService` to skip documents of different type than requested one also for invalid items thus no error is logged.
    -   Disposing Autofac container on disposal of `HttpApplication`. This is meant to fix concurrent DynaCon fallback file writes aka zombie apps after rollout.
    -   Removed custom handling for site-root file `robots.txt`. Generic one is used from now on.
    -   Removed code obsolete for more than 3 months:
        -   `Bwin.Vanilla.Mvc.Content.ContentFilterProviders`
    -   [B-226205](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11803022) Added possibility to exclude defined query string keys (e.g. the `sessionKey`) from tracking to avoid sending sensitive data to thirdy-party tracking providers. Blacklisted query string keys are defined in the Dynacon.
    -   [B-231815](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12053538) Name of the SEO tracking cookie made configurable.
    -   [B-232388](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12085188) Extended the existing language DTO with a new parameter _platformId_.
    -   Disabled session state for asset requests to improve performance.
    -   Deprecated method `ILanguageResolver.GetFromUserClaims()` and changed it to return default language in case of an error instead of throwing an exception.
    -   Added method `ILanguageResolver.FindByUserClaims()` which in case of an error logs it and returns `null`.
-   Desktop
    -   Added `jquery.bwin.url.js` plugin for making parsing of urls easier (the same functionality as in the already existing `url.service.js` for M2).
-   M2

    -   [B-211839](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:10884834) Added `eventEmitter` service(ported from mobile toolbox) (see [code](https://vie.git.bwinparty.com/vanilla/monorepo4/tree/master/Source/Bwin.PluginHost/Themes/Mobile/Assets/js/features/browser/eventEmitter.service.js) for usage)
        -   **BREAKING CHANGE** Custom `$rootScope` events were change to event emitter services
            -   `m2-apidata-<header_name>` => `m2ApiHeaderInterceptor.on('<header_name>', function() {})`
            -   `m2-user-loggingOut` => `m2User.on('loggingOut', ...)`
            -   `m2-user-loggedOut` => `m2User.on('logout', function() {...})`, the same should be done for login events in mobile login
    -   [B-224770](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11730167) Added `m2ApiBase` service (ported from mobile toolbox) (see [code](https://vie.git.bwinparty.com/vanilla/monorepo4/tree/master/Source/Bwin.PluginHost/Themes/Mobile/Assets/js/features/http/apiBase.service.js) for usage)
    -   [B-224577](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11717900) Cleaned up `m2.js`
        -   `$rootScope` property `user` was removed
        -   `html` node now sets following classes based on user state (this is not a new functionality, just a clarification of how exactly it works):
            -   `unauthenticated` when `isAuthenticated === false`
            -   `unauthenticated has-workflow` when `isAuthenticated === false && workflowType !== 0` (previously did `unauthenticated` was removed, but it makes sense that it is there)
            -   `authenticated` when `isAuthenticated === true`
        -   **BREAKING CHANGE** `$rootScope` property `showTopNav` is no longer set
        -   **BREAKING CHANGE** deprecated `m2.PublicPageCtrl` was removed
        -   unused function `window.bwin.webapp.initFullScreen` was removed
    -   [B-231456](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12032611) **BREAKING CHANGE** Refactored m2 client configuration

        -   Server side provider interface `IClientConfigurationProvider` was changed

        BEFORE:

        ```
        public class Provider: IClientConfigurationProvider
        {
            public IEnumerable<ClientConfiguration> GetClientConfiguration()
            {
                return new[]
                {
                    new ClientConfiguration
                    {
                        {
                            "someConfig", new {
                                prop1 = "val"
                            }
                        }
                    }
                };
            }
        }
        ```

        AFTER:

        ```
        public class Provider: IClientConfigurationProvider
        {
            public string Name => "someConfig"

            public object GetClientConfiguration()
            {
                return new  {
                    prop1 = "val"
                };
            }
        }
        ```

        -   It is no longer possible to specify more than one of each provider (`Name` has to be unique)
        -   `m2UserConfig` can now be extended by implementing `IClientUserValuesProvider`
        -   `m2UserConfig` can be also retrieved from `IClientUserValuesMerger`
        -   Claims are now sent to the client
            -   The claims sent are defined by dynacon key `ClientClaimsWhitelist` in `Vanilla.Features.Mobile`
            -   Claims can be accessed on the client by `m2User.claims.get()`, `m2Claims.get()`
        -   `m2User` is now a service (see [code](https://vie.git.bwinparty.com/vanilla/monorepo4/tree/master/Source/Bwin.PluginHost/Themes/Mobile/Assets/js/features/client-config/user.service.js) for usage)
            -   Exposes claims as properties for easier usability
            -   Allows to define custom properties
        -   new `m2ClientConfig` service can be used to reload/update parts of client config (see [code](https://vie.git.bwinparty.com/vanilla/monorepo4/tree/master/Source/Bwin.PluginHost/Themes/Mobile/Assets/js/features/client-config/clientConfig.service.js) for usage)

    -   [B-229912](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11946980) Client bootstrap cleanup (ongoing)
        -   Moved components to `m2-app` components
    -   [B-231843](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12054946) Brand logo in the header now invokes menu action `gotoHome()`. By default (if that action is not defined) is will go to the home page
    -   [B-232029](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12067284) Added m2 dynamic layout extension slots
        -   This can be configured with `m2DynamicLayout` service in a run block
        -   **BREAKING CHANGE** `m2Header` extension functionality was moved to this service:
            -   `m2Header.setTopbarComponent('<slot>', 'my-component', args)` => `m2DynamicLayout.setComponent('header_topbar_<slot>', 'my-component', args)`
            -   `m2Header.setMenuButtonInnerComponent('my-component', args)` => `m2DynamicLayout.setComponent('header_menubutton_inner', 'my-component', args)`
        -   You can use this service to remove header/footer (ex. for native apps), replace menu (will be used for the new menu), replace `m2-main` component with your own (more support for this will be available in the future).
        -   Check [docs](http://docs.vanilla.intranet/guides-m2-extensions.html) for more info
    -   [B-231211](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12017789) Added dynamic layout extension point on app level (slot `app`)

### Vanilla 4.3.94.2087 HOTFIX

2017-02-03

-   Shared
    -   Changed site root redirect (if configured in the `Action` field) from temporary (302) to permanent (301)
        for user who comes to absolute root `/` and his language is resolved to default one. This is also applies for search engines e.g. Googlebot.
-   Desktop
-   M2

### Vanilla 4.3.94.2086 HOTFIX

2016-12-13

-   Shared
    -   Deprecated method `ILanguageResolver.GetFromUserClaims()` and changed it to return default language in case of an error instead of throwing an exception.
    -   Added method `ILanguageResolver.FindByUserClaims()` which in case of an error logs it and returns `null`.
-   Desktop
-   M2

### Vanilla 4.3.94.2085

**`ILanguageResolver.GetFromUserClaims()` throws an exception if user has unsupported language which breaks his login.**

2016-11-29

-   Shared
    -   Added method `IContentService.Get<TDocument>(IEnumerable<DocumentId>, ContentLoadOptions)` for easier loading of items especially by `ChildIds`.
-   Desktop
-   M2
    -   Fixed: duplicate inclusion of `SiteScriptsPosition.Bottom` on Mobile Layout
    -   [D-71817](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:12044125) Regulatory logo no longer throws an exception if not found in sitecore
    -   [B-211839](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:10884834) Added `header` and `loginbar` view to prerender partials

### Vanilla 4.3.93.2077

**`ILanguageResolver.GetFromUserClaims()` throws an exception if user has unsupported language which breaks his login.**

2016-11-28

-   Shared
    -   Added `MessageType` property to `IInboxMessage` returned by `INotificationService`.
-   Desktop
-   M2

### Vanilla 4.3.92.2069

**`ILanguageResolver.GetFromUserClaims()` throws an exception if user has unsupported language which breaks his login.**

2016-11-25

-   Shared
    -   [B-227271](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11858197) Added ServiceClients for Inbox API
    -   [B-224955](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11741397) Added configurable redirect of known users to last visited product. See [docs](http://docs.vanilla.intranet/site-root.html) for more info.
    -   Deprecated `UserSettings`, `IUserSettingsProvider`, `IUserSettingsPersister`.
    -   Removed code obsolete for more than 3 months:
        -   `Bwin.Vanilla.ServiceClients.Services.IContentService`, `Bwin.Vanilla.ServiceClients.WireupModule`, `Bwin.Vanilla.Content.WireupModule`, `Bwin.Vanilla.Core.Caching.CachingModule`, `Bwin.Vanilla.Core.IO.IOAbstractionsModule`, `Bwin.Vanilla.Core.Utils.UtilsModule`.
-   Desktop
    -   [D-71636](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A12006043) Fixed: Background image loading fails if:
        -   There are multiple images in the same folder with exclusive filter conditions.
        -   Filter condition for previous image stored in the cookie doesn't match anymore.
    -   [B-226967](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11841331) Dialog (pre-login, post-login, etc.) handling was refactored and made extensible. Now Vanilla applications can define their own dialog providers by implementing the `IDialogProvider` interface, registering the implementation in `Autofac` and add the new dialog provider to the configuration. For more details, please refer to the [Vanilla documentation](http://docs.vanilla.intranet/dialogs.html#server-side-dialog-providers).
    -   [B-230874](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A12000472) Refactored rendering of menus in order to support adding own custom items e.g. _Inbox_ button to user-state-row. See [docs](http://docs.vanilla.intranet/menus.html) for more details.
-   M2
    -   [B-231108](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:12011846) Moved the following ClientConfigurations from \_m2Config.cshtml to `IClientConfigurationProvider` registrations in Autofac
        -   m2User
        -   m2Page
        -   m2StaticContent
        -   m2MenuContent
        -   m2TrackingConfig
        -   m2ReCaptchaConfig
        -   m2FooterContent
        -   =>The \_m2Config.cshtml view is now obsolete and will be removed in future versions. Add `ClientConfiguration` by registering 'IClientConfigurationProvider' implementations in Autofac instead.
    -   [B-224570](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11717748) Added `m2-main` component
        -   **BREAKING CHANGE** As a side effect, any `$scope` inside of `ng-view` will no longer inherit from `$rootScope`. `$rootScope` properties and functions are still accessible through `$root`. As there will be no `$rootScope`-like functionality in angular 2, you should try to refactor most `$rootScope` usages (especially in views).
        -   `$rootScope` property `m2.isHistoryNavigation` was removed, and is now a property on `m2-main` component
        -   `html` node will no longer have `unauthenticated` class when user is in limbo state (workflow). It will still have `has-workflow` class
    -   [B-224575](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11717829) **BREAKING CHANGE** Refactored `m2-header` to a component _(NOTE: with this refactor, you should be able to remove overrides of the vanilla header on most labels)_
        -   When login bar is visible, a css class `login-bar-shown` will be added to `html` node. _Theme update required_
        -   Header will no longer have `authenticated` or `unauthenticated` class (these are already on `html` node)
        -   Product icons have been redesigned and are configurable via Sitecore (see [example](http://cms.bwin.prod/sitecore/DirectLink.aspx?fo={CB2465CF-9628-4E13-9E8B-1A7F4FC556B8}&la=)) with menu actions, or custom components (see [code](https://vie.git.bwinparty.com/vanilla/monorepo4/tree/master/Source/Bwin.PluginHost/Themes/Mobile/Assets/js/features/header/header.service.js)) _Theme update required_
        -   Added a slot for player inbox icon
        -   Regulatory logo has been added (it's renders if user is not authenticated and the sitecore node exists - Header/Regulatory/RegulatoryLogo)
        -   `m2Page` properties `hideLoginBar` and `hideMenuButton` are no longer used, use `m2Header` service functions instead
        -   `m2Header` can be used service to set a callback that returns user balance class(es)
        -   unfixed header fix was removed (as it is fixed on iOS 8 and up)
        -   `m2DeviceRecognition` service was ported from m2 casino
    -   [B-211839](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:10884834) Misc
        -   Sitecore menu item attributes for menu actions were renamed: `data-m2-authstate` => `authstate`, `data-ng-click` => `click-action` (old versions still work for backwards compatibility, but new names make more sense)
        -   `authstate` menu item attribute now works correcly with the JSON syntax when used from sitecore
        -   `m2Tracker.track()` now returns a promise (resolved after the tracking image is loaded)
        -   Changed `m2User.lang` to route value of user's language instead of language claim value
        -   Replacing `{culture}` placeholder in `redirectTo` property of mobile routes to current language route value.

### Vanilla 4.3.91.2021 HOTFIX

**Warning: Broken background images feature for desktop.**

2016-12-13

-   Shared
    -   Deprecated method `ILanguageResolver.GetFromUserClaims()` and changed it to return default language in case of an error instead of throwing an exception.
    -   Added method `ILanguageResolver.FindByUserClaims()` which in case of an error logs it and returns `null`.
-   Desktop
-   M2

### Vanilla 4.3.91.2021

**Warning: Broken background images feature for desktop.**
**`ILanguageResolver.GetFromUserClaims()` throws an exception if user has unsupported language which breaks his login.**

2016-11-18

-   Shared
    -   [B-223538](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11622656) Sending full culture name as language token to PosAPI.
    -   Added rendering of `HtmlLangAttribute` in main layouts for SEO purposes. It's configurable as another property of existing languages in `Vanilla.Web.Globalization` -> `CultureMapping`.
    -   The `PidLoginParameters` constructor with more parameters has been made obsolete and a new one with only the `string pid` parameter has been added. Use the `UserName` and `Password` properties for specifying user name and password.
    -   Added both desktop and mobile label configs for _partypoker.cz_. They contain only `web.config.transform` assuming DynaCon is used.
    -   Added useful method `ILanguageResolver.GetFromUserClaims()`.
    -   Fixed logging of recipients in `IMailService` in case of an error.
    -   Fixed deserialization of `ReCaptchaConfiguration`.
    -   Included more details in exception thrown by `IReCaptchaService`.
    -   Removed code obsolete for more than 3 months:
        -   `RegisterConfiguration<TImplementation>()` and related methods.
        -   `Bwin.Vanilla.Core.Extensions`.
-   Desktop
    -   [B-225592](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11772522) Allowed different value from claim to be displayed in user-state row instead of user name. It can be configured in `Vanilla.Features.UserStateRow` -> `UserNameClaimType`.
    -   Improved logging of content errors when rendering footer.
-   M2

    -   [B-228456](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11870246) Added support to disable the showing of the bonus notification in the header (configurable).
    -   [B-224564](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11717620) Refactored `m2Overlay` to a component
        -   ClientBootstrap now has `<m2-overlay></m2-overlay>`
        -   **BREAKING CHANGE** `m2Overlay` service api was changed
            -   Renamed from `m2OverlayFactory`
            -   It is no longer a function, rather an object with `getHandler()` method (see [code](https://vie.git.bwinparty.com/vanilla/monorepo4/tree/master/Source/Bwin.PluginHost/Themes/Mobile/Assets/js/features/overlay/overlay.service.js) for usage)
    -   [B-224572](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11717802) Refactored `m2LanguageSwitch` to component
        -   There is now `m2-language-switcher` component in the footer
    -   [B-224556](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11717351) Refactored `m2LoadingIndicator` to a component

        -   ClientBootstrap now has `m2-loading-indicator` component
        -   **BREAKING CHANGE** `m2LoadingIndicator` service now works similarly as on desktop

            -   `m2LoadingIndicator.start()` now returns a handler, with `done()` method. When `done` is called on all currently started handlers, the loading indicator is hidden

            BEFORE:

            ```
            m2LoadingIndicator.start();
            m2LoadingIndicator.done();
            ```

            AFTER:

            ```
            var loadingIndicator = m2LoadingIndicator.start();
            loadingIndicator.done();
            ```

    -   [B-229291](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11915027) Unused `Scope.safeApply` library was removed
    -   [B-229291](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11915027) Unused `fast-bind` library was removed
    -   [B-229798](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11939475) **BREAKING CHANGE** Preload partials registration is no longer done in dynacon

        BEFORE:

        ```
        public class AreaRegistration
        {
            private readonly IMobileConfiguration _configuration;
            private readonly IPrerenderPartialsList _prerenderPartialsList;

            public AreaRegistration(IMobileConfiguration configuration)
            {
                _configuration = configuration
            }

            public override void RegisterArea(AreaRegistrationContext context)
            {
                PrerenderPartialsList.Add(_configuration);
            }
        }
        ```

        AFTER:

        ```
        public class AreaRegistration
        {
            private readonly IMobileConfiguration _configuration;
            private readonly IPrerenderPartialsList _prerenderPartialsList;

            public AreaRegistration(IMobileConfiguration configuration, IPrerenderPartialsList prerenderPartialsList)
            {
                _configuration = configuration
                _prerenderPartialsList = prerenderPartialsList;
            }

            public override void RegisterArea(AreaRegistrationContext context)
            {
                _prerenderPartialsList.Add(
                    "/{culture}/partials/page1",
                    "/{culture}/partials/page2");
            }
        }
        ```

    -   [B-224574](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11717820) Refactored footer to a component

        -   ClientBootstrap now has `m2-footer` component
        -   **BREAKING CHANGE** Refresh of the footer is now triggered in `m2Footer` service by calling `refresh()` method

        BEFORE:

        ```
        $rootScope.$broadcast('m2-footer-refresh');
        ```

        AFTER

        ```
        m2Footer.refresh()
        ```

    -   [B-229850](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11942889) `trustAsHtml` filter was added to vanilla (ported from MobileToolbox)
    -   [B-224571](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11717793) **BREAKING CHANGE** Main menu was refactored to a component `m2Menu`
        -   `$rootScope` propery `mainMenuVisible` was removed. See `m2Menu` service and `m2HtmlNode` service
        -   New service `m2Menu` can be used to toggle the menu (see [doc](https://vie.git.bwinparty.com/vanilla/monorepo4/tree/master/Source/Bwin.PluginHost/Themes/Mobile/Assets/js/features/main-menu/menu.service.js) (previously this was `$rootScope` variable `m2.mainMenuVisible`)
        -   New service `m2MenuActions` can be used to hook into vanilla and add or overide function to execute (see [doc](https://vie.git.bwinparty.com/vanilla/monorepo4/tree/master/Source/Bwin.PluginHost/Themes/Mobile/Assets/js/features/menu-actions/menuActions.service.js)
            -   `gotoCashier` method is no longer supported by vanilla, and should be implemented in MobileToolbox
            -   `gotoTransactionHistory` method is no longer supported by vanilla, and should be implemented in MobileToolbox
            -   `$rootScope.m2.toggleMainMenu` was removed. Use `m2Menu` service to control the menu or register your own implementation of `toggleMainMenu` menu action to override the base functionality
            -   fix for a defect `D-37432` was removed (issue could not be reproduced), if you find that you still need this fix, use [this code](https://vie.git.bwinparty.com/snippets/35) to register it and contact the Vanilla team)
    -   [B-224571](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11717793) New service `m2HtmlNode` can be used to set css classes on `html` node
        -   **BREAKING CHANGE** `$rootScope` property `m2.disablePageScrolling` that added class `no-scrolling` to `html` node is no longer supported. Use `m2HtmlNode.setCssClass('no-scrolling', true/false)` instead
        -   **BREAKING CHANGE** `$rootScope` property `m2.welcomeLayerVisible` that added class `welcome-layer-visible` to `html` node is no longer supported. Use `m2HtmlNode.setCssClass('welcome-layer-visible', true/false)` instead
        -   `$rootScope` property `m2.mainMenuVisible` that added class `mainmenu_on` to `html` node is no longer supported. `m2HtmlNode.setCssClass('mainmenu_on', true/false)` is used internaly instead
    -   [B-229912](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11946980) ClientBootstrap cleanup (ongoing)
        -   added `m2StaticContent` client-side constant with vanilla links and messages (rather than using razor)
        -   `m2Menu` client-side constant was renamed to `m2MenuContent`
    -   [B-211839](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:10884834) Fixed DI declaration
        -   for `m2Url` service (manualy update the file with `m2Url.$inject = ['$location', 'm2Page'];` if you are updating to an older version)
        -   for `m2Currency` filter (manualy update the file with `m2Currency.$inject = ['$filter']` if you are updating to an older version)
        -   Added `ng-strict-di` on `MobileLayout.cshtml` so it doesn't happen anymore
    -   [B-211839](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:10884834) Fix `m2-authstate` when switching to hidden from disabled
    -   [B-229393](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11919873) Refactored NotFound page
    -   Switched to version _6_ of Vanilla service in DynaCon: (`Vanilla.Features.Mobile` was changed) removed `PreloadPartials` key, removed old mobile routes, updated to new NotFound route, added `AllowBonusNotificationInHeader` key

### Vanilla 4.3.90.1953

**Warning: Broken angular DI for minified version of `m2Url` and `m2Currency`, broken `m2-authstate`. See above for fixes.**

2016-11-22

-   Shared
-   Desktop
    -   [D-71636](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A12006043) Fixed: Background image loading fails if:
        -   There are multiple images in the same folder with exclusive filter conditions.
        -   Filter condition for previous image stored in the cookie doesn't match anymore.
-   M2

### Vanilla 4.3.90.1952

**Warning: Broken angular DI for minified version of `m2Url` and `m2Currency`, broken `m2-authstate`. See above for fixes.**

2016-11-16

-   Shared
    -   Fixed deserialization of `GlobalizationConfiguration` and `ReCaptchaConfiguration` which fixes polling for a new configuration.
-   Desktop
-   M2

### Vanilla 4.3.89.1951

**Warning: Broken polling for a new configuration because of `GlobalizationConfiguration` deserialization.**

**Warning: Broken angular DI for minified version of `m2Url` and `m2Currency`, broken `m2-authstate`. See above for fixes.**

2016-11-08

-   Shared
    -   [B-227078](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11847033) Extended PID login parameters to include `ChannelId` and `ProductId`.
-   Desktop
    -   [B-228434](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11868877) Added "scrolling" option to modal dialog handling and fixed handling of multiple "open" requests for dialog.
-   M2

### Vanilla 4.3.88.1945

**Warning: Broken polling for a new configuration because of `GlobalizationConfiguration` deserialization.**

**Warning: Broken angular DI for minified version of `m2Url` and `m2Currency`, broken `m2-authstate`. See above for fixes.**

2016-11-03

-   Shared
    -   [B-223538](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11622656) Extended culture handling to support language-country codes in URLs e.g. `es-xl` for Latin American Spanish:
        -   Culture `es-419` should be configured in `AllowedCultureNames` for Latin American Spanish.
        -   However `es-419` is not supported on Windows 7 thus as a workaround you need to [create custom culture](<https://msdn.microsoft.com/en-us/library/ms172469(v=vs.100).aspx>) on your dev machine:
            -   Put file [VanillaGitRepository/Tools/es-419.nlp](https://vie.git.bwinparty.com/vanilla/monorepo4/raw/master/Tools/es-419.nlp) to `C:\Windows\Globalization`.
            -   Run `regedit.exe` and add new string value with name `es-419` and data `es-419` at path `[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Nls\CustomLocale]`.
            -   Restart your machine.
        -   Added configuration `Vanilla.Web.Globalization` -> `CultureMapping` which configures theses properties:
            -   `RouteValue` - the token used in URLs for routing for ASP.NET MVC ang Angular regardless of actual culture e.g. `en`, `es-xl`.
            -   `NativeName` - the native language name used in language switcher e.g. `English, `español (Latinoamérica)`.
            -   `SitecoreContentLanguage` - the token identifying particular Sitecore content translation e.g. `en`, `es-419`.
        -   Extended Angular to use language-country localization files e.g. `angular-locale_en-us.js`.
        -   Removed `hreflang` tag from language switcher according to recommendations from our SEO analysts.
        -   Deprecated `ICultureManager`, `LanguageInfo`, `CultureInfoExtensions` etc. They are replaced with new API. Removed public class `GlobalizationConfiguration`.
    -   Changed `IContentLoader` to execute content filtering before requiring positive content item version so that it's possible to filter out untranslated items.
    -   Locking access to DynaCon fallback file also when reading its attributes for config report.
    -   Fixed `culture` parameter on `/health/content` page.
-   Desktop
    -   [B-225660] (https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11776030) Added possibility to hide user state in `_SiteHeader.cshtml` by setting a flag to HTTP context. This can be set from a controller/view.
    -   Added `PostHeadAssets` section in `DefaultLayout.cshtml`.
-   M2

    -   [B-224549](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11716671) **BREAKING CHANGE** Refactored `m2Url` service
        -   `m2Url` has a new public API that is more developer friendly (see [code](https://vie.git.bwinparty.com/vanilla/monorepo4/tree/master/Source/Bwin.PluginHost/Themes/Mobile/Assets/js/features/browser/url.service.js))
        -   methods for stringifying the parsed url are now on the object returned from `m2Url.parse()` (`url()`, `absUrl()`, `baseUrl()`, `host()`), use these instead of `toUrl()` or `url` property
        -   `changeCulture()` method is now also on returned object
        -   `m2Url.sameTopDomain()` was removed, there is still a property `isSameTopDomain` on the parsed url object
        -   `m2Url.getCulture()` was removed, there is still a property `culture` on the parsed url object
        -   `search` is now parsed to object by default, you no longer have to manually use `parseQuery()` and `toQuery()`
        -   There are 2 new methods on `m2Url`
            -   `current()` - parses current browser url
            -   `appendReferrer(url, options)` - appends return url (`rurl` parameter) to the url, optionaly the return url can be specified to be absolute by passing `{ absolute: true }` as options
        -   `m2Url.updateUrl()` was removed (it was very untransparent and had side effects)
        -   `m2Url.currentHref()` was removed
        -   culture token is now automatically prepended for parsed relative urls (if not already present)
        -   `{culture}` placeholder is now supported (will be replaced to culture token before url is parsed - `m2Url.parse('/x/{culture}/y').url() === '/x/en/y'`)
    -   [B-226397](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11813252) - Added `m2TemplateUrl` global function to help with dynamic partial urls for components (see [code](https://vie.git.bwinparty.com/vanilla/monorepo4/tree/master/Source/Bwin.PluginHost/Themes/Mobile/Assets/js/features/browser/templateUrl.global.js) for angular2 solution)

        BEFORE:

        ```
        angular
            .module('x')
            .component('y', {
                templateUrl: ['m2Page', function(m2Page) {
                    return '/' + m2Page.lang + '/area/partials/template';
                }]
            });
        ```

        AFTER:

        ```
        angular
            .module('x')
            .component('y', {
                templateUrl: m2TemplateUrl('/{culture}/area/partials/template')
            });
        ```

    -   [B-224543](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11716115) - **BREAKING CHANGE** Refactored `m2Auth` service

        -   You no longer have to specify `m2User` and `m2Page` (they will be injected)
        -   `waitContext` parameter was removed, use promises to set state outside of `m2Auth` service
        -   Only parameter for `logout` method is now object of `options`
        -   `doNotRedirectAfterSuccess` parameter was changed to property `redirectAfterLogout` of `options` object which is `true` if not specified

        BEFORE:

        ```
        m2Auth.logout(m2User, m2Page, ctrl);
        m2Auth.logout(m2User, m2Page, ctrl, true); // do not redirect after logout is completed
        ```

        AFTER:

        ```
        ctrl.wait = true;

        m2Auth.logout()
            .then(function() {
                ctrl.wait = false;
            });

        /* optionaly do not redirect after logout */
        m2Auth.logout({ redirectAfterLogout: false })
            .then(function() {
                ctrl.wait = false;

                // do other things, like custom redirect, etc.
            });
        ```

    -   [B-224562](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11717588) **BREAKING CHANGE** Refactored `m2SessionStore` and `m2BrowserStore` service

        -   `m2BrowserStore` was renamed to `m2LocalStore`
        -   You no longer have to wrap this service in another service
        -   The prefix for the keys is now configured with `m2StoreProvider.setPrefix()` in config phase
        -   Added `remove` method (in addition to removing by setting value to null or undefined)

        BEFORE:

        ```
        // declaration
        angular
            .module('mobileToolbox')
            .service('MobilePortalSessionStore', [
                'm2SessionStore', function (m2SessionStore) {
                    return m2SessionStore('mobilePortal.');
                }
            ]);

        // usage
        function ComponentCtrl(MobilePortalSessionStore){
            MobilePortalSessionStore.set('key', 'value');
        }
        ```

        AFTER:

        ```
        // in config phase
        m2StoreProvider.setPrefix('mobilePortal.');

        // usage
        function ComponentCtrl(m2SessionStore){
            m2SessionStore.set('key', 'value');
        }
        ```

    -   [B-224547](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11716560) Unused service `m2Location` was removed
    -   [B-224538](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11715976) Refactored `m2Authstate`

        -   `m2-authstate-user` is no longer needed, `m2User` is injected instead
        -   It no longer wraps `ngClick` in a custom handler, instead it relies on css `pointer-events: none` on `.disabled` class (this is already the case on the only usage in main menu)
        -   It has a new syntax, (old syntax is still supported, because it is used in sitecore, but please prefer the new one)

        BEFORE:

        ```
        <a href="/page" m2-authstate="'authenticated-show unauthenticated-hide workflow-disable'">Link</a>
        ```

        AFTER:

        ```
        <a href="/page" m2-authstate="{ authenticated: 'show', unauthenticated: 'hide', workflow: 'disable' }">Link</a>
        ```

### Vanilla 4.3.87.1888 HOTFIX

2016-10-25

-   Shared
    -   [B-227078](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11847033) Extended PID login to accept password (optional).
-   Desktop
-   M2

### Vanilla 4.3.86.1886

2016-10-20

-   Shared
    -   Changed `IContentService.GetChildren()` to skip documents of different type than requested one.
    -   [B-226232](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11803924) **Breaking change** Added `SubChannel` property to the `NativeApplication` content filter. Before products can start to use the new `NativeApplication.SubChannel` content filter on Sitecore documents, they have to wait until the shared plugins that contain actual implementation of `NativeApplication` content filter (such as `Bwin.M2.Common`) update to this Vanilla version and then obviously the products have to be updated to use latest shared plugins. Premature use of the `NativeApplication.SubChannel` content filter in Sitecore would make your filter expression fail to evaluate and thus always return `false` which can cause difficult-to-spot problems, especially on Sitecore documents shared across many products.
    -   Updated `System.IO.Abstractions` 2.0.0.124 -> 2.0.0.136
    -   [B-226328](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11809723) Added `username` as an optional parameter to `PID` based login.
-   Desktop
    -   Changed header model to allow content `App-v1.0/Header/Authentication/State/BInsideLink` to be not-found.
-   M2
    -   [D-70734](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:11810945) Fixed deprecated public page route

### Vanilla 4.3.85.1877

2016-10-11

-   Shared
    -   [B-221848](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11507925) Added a way to indicate to `IContentBinder` that not-found content should not be treated as an error. This solves error related to `OwedMoneyLink` which was flooding logs.
    -   Removed `GlobalizationCulture`. Use `IGlobalizationCulture` instead.
    -   Removed code obsolete for more than 3 months:
        -   `IContentItem.IsValid`, `ContentItem<T>`
    -   [B-225186](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11755606) Added `PID`-based login methods to `IAuthenticationService`:
        -   `ILoginResult Login(PidLoginParameters parameters)`
        -   `Task<ILoginResult> LoginAsync(PidLoginParameters parameters)`
-   Desktop
-   M2

    -   [B-224288](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11691607) **BREAKING CHANGE** Refactored `m2Picture` and `m2PictureWithProfiles` to components

        -   **m2PictureWithProfiles**
            -   There is a change in the dom, where `m2-picture` is wrapped in `m2-picutre-with-profiles`
            -   Html attributes on the component are no longer propagated to `img` element (except `alt` attribute)
            -   `m2-src` and `alt` attributes are now inputs (that means they have to be expressions)

        USAGE BEFORE:

        ```
        <m2-picture-with-profiles class="my-image-class" m2-src="{{$ctrl.image}}" alt="{{$ctrl.altText}}" width="750"></m2-picture-with-profiles>
        ```

        RENDERED DOM BEFORE:

        ```
        <m2-picture class="my-image-class">
            <!-- some m2-source elements -->
            <img src="http://example.com/image.jpg" class="my-image-class" alt="alt text" />
        </m2-picture>
        ```

        USAGE AFTER:

        ```
        <m2-picture-with-profiles class="my-image-class" m2-src="$ctrl.image" alt="$ctrl.altText" width="750"></m2-picture-with-profiles>
        ```

        RENDERED DOM AFTER:

        ```
        <m2-picture-with-profiles class="my-image-class" m2-src="$ctrl.image" alt="$ctrl.altText" width="750">
            <m2-picture>
                <img src="http://example.com/image.jpg" alt="alt-text" />
            </m2-picture>
        </m2-picture-with-profiles>
        ```

        -   **m2Picture**
            -   _afaik not used anywhere, only as a dependency of `m2PictureWithProfiles`_
            -   Is now a single component, image is selected based on first matching media query in the array.

        BEFORE:

        ```
        <m2-picture>
            <m2-source media="(max-width: 500px)" m2-src="http://bwin.com/image-small.jpg"></m2-source>
            <m2-source media="(min-resolution: 200dpi)" m2-src="http://bwin.com/image-retina.jpg"></m2-source>
            <m2-img m2-src="http://bwin.com/image-default.jpg"></m2-img>
        </m2-picture>
        ```

        AFTER:

        ```
        <m2-picture default-src="'http://bwin.com/image-default.jpg'" sources="[{ media: '(min-resolution: 200dpi)', src: 'http://bwin.com/image-retina.jpg' }, { media: '(max-width: 500px)', src: 'http://bwin.com/image-small.jpg' }]"></m2-picture>
        ```

    -   [B-224526](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11715529) Refactored public page related directives/controllers to components

        -   **m2PublicPageContent**

            -   **BREAKING CHANGE**: `m2-public-page-bind-html` attribute directive was changed to `m2-public-page-content` component

                BEFORE:

                ```
                <div m2-public-page-bind-html="$ctrl.content"></div>
                ```

                AFTER:

                ```
                <m2-public-page-content html="$ctrl.content"></m2-public-page-content>
                ```

            -   Now requires the content to be trusted with `$sce.trustAsHtml` (which is always the case anyway)
            -   You (@mobileportal) can now remove `m2-public-page-bind-html` override and use `m2PublicPageProvider` to specify additional components to compile (see changes bellow)

        -   **m2PublicPage**

            -   **BREAKING CHANGE**: renamed from `m2PublicPages` to `m2PublicPage`
            -   You can now use `m2PublicPageProvider` to specify which components should be compiled in public pages

                BEFORE: (overriden `m2PublicPageBindHtml.js` file)

                ```
                var allowedDirectives = ['m2-picture-with-profiles', 'm2-back-to-product', 'm2-header-bar'];
                ```

                AFTER: (in config phase)

                ```
                m2PublicPageProvider.addAllowedDeclaration('m2-back-to-product');
                m2PublicPageProvider.addAllowedDeclaration('m2-header-bar');
                ```

        -   **m2.PublicPageCtrl**

            -   Is **deprecated** as well as `PublicPage.cshtml` view
            -   Replaced with `m2PublicPageLoader` component
            -   Update your routes:

                BEFORE:

                ```
                "YourModule_PublicPage": {
                    "path": "/{culture}/p/:path*",
                    "controller": "m2.PublicPageCtrl",
                    "templateUrl": "/{culture}/partials/publicpage",
                    "PublicPagesRoot": "YourModule-v1.0/PublicPages/"
                }
                ```

                AFTER:

                ```
                "YourModule_PublicPage": {
                    "path": "/{culture}/p/:path*",
                    "template": "<m2-public-page-loader></m2-public-page-loader>",
                    "PublicPagesRoot": "YourModule-v1.0/PublicPages/"
                }
                ```

    -   [B-224540](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11715997) `m2ThirdPartyTracker` was refactored to a component (behavior should be same as before)
        -   If source (what comes from third party tracking endpoint) is url, the inner content of the component is same as before
        -   If source is html, it is additionaly wrapped in a div

### Vanilla 4.3.84.1844

2016-10-03

-   Shared
    -   [B-217130](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11206562) Added support for reCAPTCHA. Read more in [docs](http://docs.vanilla.intranet/recaptcha.html). **Content message `ReCaptchaVerification` in `/<label>/App-v1.0` must be created**.
    -   Deprecated `IContentManager` and `IContentSession`.
    -   Removed code obsolete for more than 3 months:
        -   Code in `Bwin.Vanilla.Content` meant to be internal.
        -   `ICultureTokenResolver`, members of `LanguageInfo`
        -   `RegisterServiceAttribute` and related Autofac component registration.
        -   Some `Login()` overloads on `IAuthenticationService` and `IClaimsService`.
        -   `ContentConfiguration.TemplatePathsList`, `ServiceClientsConfiguration.Host` (changed type), `MailConfiguration.EndpointAddressUri`.
-   Desktop

    -   [B-213644](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11020117) The `jquery.bwin.progressIndicator` (new implementation of the `jquery.bwin.spinner`) and the `jquery.bwin.ajaxProgressIndicator` (new implementation of the `jquery.bwin.ajaxspinner`) have been added to support multiple concurrent requests to show the progress indicator. The old 'spinner' plugins are still part of Vanilla and they will be removed once all products will use the new ones. Please replace the old `jquery.bwin.spinner` resp. `jquery.bwin.ajaxspinner` plugins with their new counterparts in product bundles **only when you are ready to adapt the code that uses them** (see example below) because these **new plugins use a new approach for handling progress indication** and therefore they cannot be used simultaneously with the old ones. The mutual exclusivity of the old vs new plugins is enforced by Vanilla. Usage example:

              var indicatorA, indicatorB;
              function startOfActivityA() {
                  indicatorA = $.bwin.progressIndicator.show();
                  ...
              }
              function endOfActivityA() {
                  indicatorA.hide();
                  ...
              }
              function startOfActivityB() {
                  indicatorB = $.bwin.progressIndicator.show();
                  ...
              }
              function endOfActivityB() {
                  indicatorB.hide();
                  ...
              }

-   M2
    -   [B-210242](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10818041) Updated AngularJS 1.5.0 -> 1.5.8.
    -   Added [ocLazyLoad](https://oclazyload.readme.io/) library for lazy loading of external resources e.g. reCAPTCHA.
    -   [B-222137](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:11525577) Added possibility to change logout behaviour so that on logout the user is not redirected but instead stays on the same page and the same page gets reloaded. To apply this behavior, add `true` parameter to the `logout` function call in `ClientBoostrap.cshtml`.

### Vanilla 4.3.83.1800 HOTFIX

2016-09-27

-   Shared
    -   Fixed loading of menus if root content item is not translated.
-   Desktop
-   M2

### Vanilla 4.3.82.1797

2016-09-22

-   Shared
    -   [B-222882](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11579048) Added both desktop and mobile label configs for _bwin.cz_, _bwin.ru_, _sportingbet.cz_ and _sportingbet.ro_. They contain only `web.config.transform` assuming DynaCon is used.
    -   Slightly changed behavior of `IContentService.GetChildren()` related to parent content item:
        -   _NotFound_: considered to be an error because we can't load any children.
        -   _Filtered_: we assume that all children should be filtered thus empty result.
        -   _Invalid_: treated same as _Success_ because children were requested, not parent with its errors.
    -   Fixed loading of HTML head tags if parent folder `App-v1.0/HtmlHeadTags` has content item version equal to 0.
    -   Added `ContentLoadOptions.Strict`.
-   Desktop
    -   [B-217433](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11232965) Added `slick.css` (background carousel) to the `Default` theme.
    -   [B-223463](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11616627) Live chat button enablement functionality has been made more flexible.
-   M2
    -   Fixed loading of messages in `ClientBootstrap.cshtml`.
    -   Fixed data layer initialization on the client - now also the user values for anonymous user are filled in.

### Vanilla 4.3.81.1787

2016-09-14

-   Shared
    -   [B-216627](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11171520) Extended feedback to DynaCon with the names of features and keys those deserialization failed a changeset.
    -   Fixed: If a rule of content proxy item is matched but has no target an exception is thrown. Instead filtered content bwinitem should be returned.
-   Desktop
    -   [B-217433](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11232965) Added support for background carousel for desktop. **Note**: `DefaultLayout.cshtml`, `EmptyLayout.cshtml` and `EmptyDialogLayout.cshml` have been updated.
-   M2
    -   [B-218102](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11280067) Added clock to the footer which can be configured using _Vanilla.Features.Mobile -> ShowFooterClock_.
    -   Fixed `m2Tracking` to avoid adding initial data to the data layer on the client when the data layer tracking is disabled.

### Vanilla 4.3.80.1760

2016-09-08

-   Shared
    -   [B-210411](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10828104) Support for raw ZIP format used in countries returned from PosAPI. Example: `RAW(123, 456, /regex/)` where 123 is min length and 456 is max length.
    -   [B-210411](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10828104) Support for expanded ZIP format object returned from PosAPI.
    -   [D-68763](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A11303220) Fixed: Evaluation of DSL expression (used in content filters) `User.IsInGroup('group')` fails for unauthenticated user.
    -   [B-208536](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10765186) Added `LocalOverridesFilePattern` to DynaCon settings just for info.
    -   [B-208536](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10765186) Added `sendFeedback` DynaCon setting in `web.config` which allows disabling unnecessary feedback from developers' machines.
    -   Fixed: When loading of content messages fails error message logged is missing crucial information.
    -   Shortened error message written to log file when `IUserValuesResolver` fails to retrieve some value.
-   Desktop
-   M2

### Vanilla 4.3.79.1744

2016-08-26

-   Shared
    -   [B-212542](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10930192) Extended DynaCon features and settings:
        -   Added `changesetId` which causes particular changeset to be loaded explicitly.
        -   Made file fallback and polling for changes optional. They are disabled by not providing corresponding settings.
        -   Made `host` setting was optional with reasonable default value.
        -   Changed `dynaCon` section in `web.config` to be uncommented by default.
        -   Added `skipDelay` parameter posted to DynaCon.
        -   Find more info in [docs](http://docs.vanilla.intranet/configuration-system.html#dynacon-service-settings).
        -   Fixed: Invalid local overrides fail next poll request for changes and block up access to `/health/config`.
        -   Added warnings to `/health/config` report.
    -   Added new API for loading content: `IContentService` and `IContentLoader`. It replaces `IContentManager` with `IContentSession`.
    -   Removed `ITrackingConfiguration.TrackerIds` which was replaced by `Bwin.Vanilla.Mvc.Tracking.ITrackerIdsConfiguration.TrackerIds`.
-   Desktop
-   M2

### Vanilla 4.3.78.1719

2016-08-18

-   Shared
    -   [B-200154](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10155665) Changed DSL placeholder syntax because of conflict with existing M2 placeholders from `__Some.Placeholder__` to `_|Some.Placeholder|_`.
    -   [B-208863](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10789119) Log level for Hekaton concurrency exceptions has been decreased to INFO as they don't pose a real threat to application's functionality.
    -   [D-67835](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A11066625) Fixed: Failed to write DynaCon fallback file because of concurrent reads.
    -   [D-67835](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A11066625) Writing DynaCon parameters to fallback file in order to validate that single file is not used by multiple apps.
    -   [B-212546](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10930228) Environment parameter for Sitecore has been made configurable (`Vanilla.Services.Content/Environment` in `Dynacon` and `Environment` property in the `Content.jsonconfig`).
-   Desktop
    -   [B-214982](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11112711) Added support for monitoring the Live Chat availability based on the contact center service hours and the availability of contact center agents and enabling/disabling the Live Chat button accordingly.
-   M2

    -   [D-68275](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A11155265) Fixed defect with user context values not being correctly updated in data layer. Make sure to invoke `m2Tracker.updateUserValues()` whenever you detect a user context change in your product (e.g. user login, user balance update, etc.). Example:

              function loginSucceeded() {
                  ...
                  m2Tracker.updateUserValues(); // make sure to call this BEFORE you trigger the 'Event.Login' event
                  m2Tracker.triggerEvent('Event.Login');
              }

### Vanilla 4.3.77.1706

2016-08-11

-   Shared
    -   [B-204266](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10455439) Changed behavior of resolving site root files. Not-found and filtered files return 404 HTTP response and log a warning. Invalid files return 500 and log an error.
    -   [B-211726](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10872814) Added link from `/health/config` report to changeset history on DynaCon admin web.
    -   Added both desktop and mobile label config for _partycasino.net_. They contain only `web.config.transform` assuming DynaCon is used.
    -   Moved methods from `Bwin.Vanilla.Core.Extensions` to their respective namespaces.
    -   Deprecated `EmptyNameValueCollection`.
-   Desktop
    -   [B-214487](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11074837) Adapted Chat widget to deal with different pages
-   M2
    -   Replaced all remaining usages of `Html.ContentField()` with `Html.Content()`.

### Vanilla 4.3.76.1652

2016-07-29

-   Shared
    -   [B-215130](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A11124286) Added `User.LoyaltyPoints` DSL value.
    -   Improved API for retrieving account balance, loyalty points and loyalty category.
    -   Switched to version _5_ of Vanilla service in DynaCon: added feature `Vanilla.Features.UserStateRow` and removed a key from `Vanilla.Features.UserStateRow`.
    -   [D-67873](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A11075089) Fixed: `IContentBinder` does not return any error if root document doesn't exist or is filtered out. Rather it fails silently. This also causes internal server error on desktop public pages.
    -   Added new REST infrastructure in `Bwin.Vanilla.Core.Rest` which is easier to unit test and mock: `IRestClient`, `RestRequest`, `RestResponse` etc.
    -   Added `Bwin.Vanilla.Core.System.UriBuilderExtensions` for easier building of URL addresses.
    -   Added `Bwin.Vanilla.Core.Ioc.VanillaDecorator` to allow easy decoration of some Vanilla services e.g. `IContentManager`, `IRestClient`.
    -   Deprecated `ICrmService.TryGetLoyaltyCategory()`, removed `ICrmService.GetLoyaltyCategoryString()` which was obsolete for more than 3 months.
-   Desktop
-   M2
    -   Replaced `Html.ContentField()` utility method with `Html.Content()` which throws exceptions because these errors were very difficult to find.

### Vanilla 4.3.75.1631

2016-07-25

-   Shared
    -   [B-200154](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10155665) Added support for replacing placeholders written in [Vanilla DSL](http://docs.vanilla.intranet/dsl.html) especially in the content. Read [docs](http://docs.vanilla.intranet/content-filtering-and-placeholders.html#content-placeholders) because you may want to extend it.
-   Desktop
    -   [B-212217](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10914193) Rendering of tracking in the `DefaultLayout.cshtml` has been made optional. In the `EmptyDialogLayout.cshtml` layout the tracking rendering is disabled by default.
-   M2

### Vanilla 4.3.74.1624

2016-07-21

-   Shared
    -   [B-200154](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10155665) Changed (content) filter providers to more generic DSL infrastructure:
        -   Replaced `Bwin.Vanilla.Core.Filters.IContentFilterProvider` with `Bwin.Vanilla.Core.Dsl.DslValuesProvider` with inner instances.
        -   Replaced Vanilla providers from `Bwin.Vanilla.Mvc.Content.ContentFilterProviders` with `Bwin.Vanilla.Core.Dsl.Providers`.
        -   Replaced `Bwin.Vanilla.Core.Filters.IFilterEvaluator` with `Bwin.Vanilla.Core.Dsl.Filters.IFilterEvaluator` which **throws an exception** if the evaluation fails.
        -   Added `Bwin.Vanilla.Core.Dsl.Providers.FakeDslProvidersModule` if you just need to validate the syntax.
        -   Read more in [docs](http://docs.vanilla.intranet/dsl.html).
    -   Deprecated `ContainerBuilder.RegisterConfiguration<TImplementation>()` extension method because it brings confusion and ambiguity.
    -   [B-200154](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10155665) Updated `ExpressionEvaluator` 2.0.1.0 -> 2.0.4.0
    -   Removed code obsolete for more than 3 months: `IMessageQueue.GetMessages()`, `PrerenderPartialsList.Add(MobileConfigurationBase)`, `DateTime.ToUserLocalTime()`, `ClientBootstrapExtensions.HasTrackerIdCookie`, `CreateVersionedAssets`, `ServiceClientsConfigurationFactory`.
    -   Added `Bwin.Vanilla.Testing.FakeConfigurationFactory` for easier unit testing of DynaCon configurations.
    -   [B-206464](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10624058) Added "tcp" prefix for DB connectionStrings
    -   Renamed label configs _totesport`s`.com_ to _totesport.com_ thus fixing the typo.
    -   [B-95654](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A3477458) **Breaking change for Desktop** "UserState" part of the site header has been split into multiple items (`LoginLogoutForm`, `UserName`, `AccountBalance`, `LoyaltyPoints`, `Reminder`, `PersonalButton`) so that they can now be re-arranged (or even put into other menu) in Sitecore. Moreover, users can now set HTML attributes to these items individually (in Sitecore). To correctly migrate from old to new user state, take the following steps during Vanilla update:
        -   Include all new `.cshtml` views in the solution
        -   Include the new `jquery.bwin.siteheader.js` in the solution and remove reference to the `jquery.bwin.userstaterow.js`
        -   Update `jquery.bwin.personalbutton.js` wherever needed (`Themes`, etc.)
        -   Rename `$.bwin.userstaterow` to `$.bwin.siteheader` in the javascript code
        -   Rename `jquery.bwin.userstaterow.js` to `jquery.bwin.siteheader.js` in the bundles
        -   Change registering of click handlers on the personal button, e.g. `$('#header').find('li.personal-button').click(clickHandler)` to `$.bwin.personalbutton.click(clickHandler)`
        -   Rename `refreshBalance` to `refreshValues` parameter in the `refresh()` method, i.e. `$.bwin.userstaterow.refresh({ refreshBalance: true })` to `$.bwin.siteheader.refresh({ refreshValues: true })`
        -   Stop using `Index` action of the `UserStateController` and use now the `Index` action in the `SiteHeaderController` instead. This includes all HTTP requests to that controller from javascript code.
        -   Update all customized/overwritten `_SiteHeader.cshtml` views (in `Themes`, `Plugins`, etc.)
        -   As the `_LoggedIn.cshtml` and `_LoggedOut.cshtml` have been broken up into multiple views (`AccountBalance`, `LoyaltyPoints`, `UserName`, `LoginLogoutForm`, `Reminder/PostLogin`, `Reminder/SignUpBonus`), move your custom logic from `_LoggedIn.cshtml` and `_LoggedOut.cshtml` into these new views wherever applicable.
        -   Change calls to `Html.RenderAction<PartialController>(c => c.SiteHeader())` to `Html.RenderAction<SiteHeaderController>(c => c.Index(false))` (e.g. in the `DefaultLayout.cshtml`)
        -   Change calls to `RenderAppMenu()` to `Html.RenderPartial("_AppMenu", CreateAppMenuViewModel(...));` similarly how the `_SiteHeader.cshtml` has been changed
-   Desktop
-   M2

### Vanilla 4.3.73.1577

2016-07-08

-   Shared
    -   Switched to version _4_ of Vanilla service in DynaCon: removed `TrackerIds` key from the `Vanilla.Web.Tracking` feature as this property is covered by the `Vanilla.Features.QueryStringToCookie` feature from now on.
    -   Added `Bwin.Vanilla.Testing.VanillaAssertionHelper`, deprecated `Bwin.Vanilla.Testing.JsonAssert`.
    -   Removed `Bwin.Vanilla.CQ5Content` nuget package. If you still need it, use old version or incorporate the code to your project.
    -   [B-192246](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9871835) Updated third-party libraries:
        -   `Microsoft.Net.Compilers` 1.0.0 -> 1.2.2
        -   `Autofac.Mvc5` 3.3.3 -> 3.3.4
        -   `Autofac.Extras.DynamicProxy2` 3.0.5 -> 3.0.7
        -   `Microsoft.ApplicationServer.Caching.Client` 1.0.4632 -> 1.0.4657.2
        -   `Mono.Cecil` 0.9.5.4 -> 0.9.6.1
        -   `JetBrains.Annotations` 8.0.5.0 -> 10.0.0
    -   [B-211411](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10850111) Added `ITrackerIdsConfiguration` for accessing `TrackerIds` collection (it will be removed from `TrackingConiguration` soon).
-   Desktop
-   M2

### Vanilla 4.3.72.1553

2016-07-06

-   Shared
    -   [B-211790](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10878549) Added service clients to obtain login history: `IClaimsService.GetLoginHistory()`.
    -   Added both desktop and mobile label configs for _bwin.dk_, _betfred.com_ and _totesports.com_. They contain only `web.config.transform` assuming DynaCon is used.
    -   [B-211411](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10850111) Added BTAG affiliate tracking support.
    -   Reverted minor change in `IContentSession.GetContent(IEnumerable<DocumentId>...)` which caused filtered items to be included if `includeFaultedItems=true`.
-   Desktop
    -   Removed Italian language from _partypoker.com_ label config.
-   M2

### Vanilla 4.3.71.1507

2016-06-29

-   Shared
    -   [B-206484](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10626429) Improved merging of DynaCon configuration with local overrides:
        -   Corresponding values are matched based on same context.
        -   JSON values are merged deepely.
    -   [B-209873](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10790902) Added `ICrmService` methods to get weekly, today's and this week's loyalty points.
    -   Improved rendering of exception stack traces in health pages.
    -   Minor changes in `/health/config`: moved `Source` and `Url` properties from dto directly tosportingbet changeset for better visibility.
    -   Updated `Bwin.DynaCon.Api.Contracts` from _0.1.0.414_ to _1.1.0.1203_.
    -   Deprecated content overrides feature. Please use proxy items instead. See previous version for more info.
    -   Switched to version _3_ of Vanilla service in DynaCon: replaced feature `Vanilla.Features.ContentSettings` with extended `Vanilla.Features.UserStateRow`.
    -   Added `Bwin.Vanilla.Testing.IntegrationCategoryAttribute`.
    -   Minor alignments of `ICommonDataService.GetMobileOperators()` with PosAPI.
-   Desktop
    -   [B-209873](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10790902) Displaying this week's loyalty points in user state row on `sportingbet.com`.
    -   Added pass-through rendering of `PageHead` and `PageBottom` sections in `EmptyDialogLayout`.
-   M2

### Vanilla 4.3.70.1468

2016-06-17

-   Shared
    -   [B-205804](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10568393) Support for proxy content items: if an item is a proxy, target item is loaded instead. Target is determined based on first rule which matches its condition.
    -   Introduced `IContentItem.ContentStatus` with values `Success`, `Invalid`, `NotFound`, `Filtered`. It replaces `IContentItem.IsValid` which was deprecated.
    -   Deprecated `Bwin.Vanilla.ServiceClients.Services.IContentService`, `Bwin.Vanilla.Core.Extensions.DisposableExtensions.DisposeSafely()`, `Bwin.Vanilla.Content.ContentItem<TDocument>`.
    -   Deprecated `RegisterServiceAttribute` because it breaks separation of services into modules and hides too many details.
    -   Deprecated some classes in `Bwin.Vanilla.Content` that will not be `public` in future releases.
    -   Removed deprecated `IDocumentPathConverter`, constructor `DocumentId(string, CultureInfo)`.
    -   Changed `VerifyWithAnyArgs()` test support method to accept `Times` instead of `Func<Times>`
    -   [B-207928](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10726841) Enabled Hekaton for all environments on all labels (except on NJ prod labels)
    -   Added rethrowing of the `SerializationException` in the `ObjectCacheTempDataProvider`.
    -   Updated Hekaton configuration for preview environment.
-   Desktop
    -   Added PostLogin configuration for SportingBet.
-   M2

### Vanilla 4.3.69.1426-0c0f763a

2016-06-08

-   Shared
    -   [B-204312](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10459244) Added possibility to mock client IP for testing purposes. Non-production only.
    -   [B-203637](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10412481) Improved DynaCon health check:
        -   It shows explicit messages what has failed with suggestions what to do.
        -   It checks state of fallback file.
        -   It does not fail if there is an invalid future changeset with another valid newer one.
    -   [B-203637](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10412481) Improved DynaCon `/health/config`:
        -   Added info about fallback file, past and future changesets, calls to DynaCon service, metadata of configuration models, URLs to DynaCon, local overrides etc.
        -   It shows same errors and fails in the same way as DynaCon health check does.
        -   Simplified rendering of exceptions.
        -   Added optional `web.config` parameters `pastChangesetsMaxCount` and `pastServiceCallsMaxCount`.
        -   Fixed link to `/health/config` from other diagnostic pages if DynaCon is enabled.
    -   Set dependency `Bwin.DynaCon.Api.Contracts` explicitly to version `0.1.0.414`.
-   Desktop
-   M2

### Vanilla 4.3.68.1388-469ce0ba

2016-05-31

-   Shared
    -   [B-200103](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10151846) Increased log level for Hekaton exceptions to ERROR.
-   Desktop
-   M2

### Vanilla 4.3.67.1382

2016-05-30

-   Shared
    -   [B-193101](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9930048) Optimized PosApi-health check to minimize PosApi health check calls by taking advantage of actual calls. Also added caching of health status.
    -   [B-203817](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10423698) Sending feedback info about validity of configuration changesets to DynaCon.
    -   Removed unnecessary write of configuration to fallback file if it was loaded from the file itself.
    -   [B-200103](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10151846) Configuration for Hekaton for _lltb2c_ was updated
    -   [B-200103](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10151846) Added Hekaton configurations to remaining FR & NJ labels
    -   [B-206606](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10638892) Genesys configuration: change _Host_ property to require a protocol (_http://_, _https://_).
    -   Removed Bulgarian language from _sportingbet.com_ globalization configuration.
    -   Fixed: Binary assets have different size than actual files on the disk. They contain lots of empty bytes at the end.
    -   Added/updated Google Tag Manager configuration for `partycasino.com`.
-   Desktop
-   M2

### Vanilla 4.3.66.1349-2ffc3c0d

2016-05-18

-   Shared
    -   [B-200103](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10151846) Configurations for Hekaton were updated
-   Desktop
-   M2

### Vanilla 4.3.65.1346

2016-05-17

-   Shared
    -   [D-64530](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A10599106) Fixed: User IP address resolution always returns _127.0.0.1_ for anonymous user therefore it breaks GEO location functionality.
    -   [B-205260](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10529808) Configuration changes for Genesys pull chat.
    -   Consolidated resolution of language tokens and other stuff related to `LanguageInfo`.
-   Desktop
-   M2

### Vanilla 4.3.64.1334-2aeb30cd

2016-05-13

-   Shared
    -   [B-202526](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10339549) Fixed serialization of AdaptedCultureInfo
-   Desktop
    -   Fixed variable declaration scope in the jquery.bwin.fileuploader.js
-   M2

### Vanilla 4.3.63.1328-d0619718

2016-05-12

-   Shared
    -   [B-205751](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10564426) Fixed PosApi-based distributed cache runtime switcher to take the environment setting into account.

### Vanilla 4.3.62.1322-3541b3bc

2016-05-12

-   Shared
    -   [B-192361](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9881232) Added support for file with local overrides to DynaCon configuration to ease the development. See [docs](http://docs.vanilla.intranet/configuration-system.html).
    -   [B-203848](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10425008) Introduced `{label}` placeholder in `ContentConfiguration.Host` in order to support new Sitecore DNS names. Changed `.jsonconfig` files accordingly.
    -   [B-202526](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10339549) Overwritten PL culture with custom date format dd.MM.yyyy.
    -   [B-205260](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10529808) Configuration changes for Genesys pull chat (giocodigitale, partycasino, partypremium).
    -   [B-205751](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10564426) Added PosApi-based distributed cache runtime switcher.
    -   Fixed evaluation of content filters on the Content Filters health page.
    -   Updated _log4net_ from version _2.0.3_ to _2.0.5_.
    -   Switched to version _2_ of Vanilla service in DynaCon.
    -   Removed obsolete properties `TrackingConfiguration.EnabledRenderers`, `TrackingConfiguration.IsOmnitureEnabled`, `ServiceClientsConfiguration.TokenCacheTime`, `ServiceClientsConfiguration.V5LegacyTokenCacheName`, `ServiceClientsConfiguration.SecurityTokenCacheName`, `MobileConfiguration.ProductMenuLocation`,
        `CacheNames.V5LegacyTokenCache`, `ContentConfiguration.AccessId`, `AppFabricConfiguration.UseDistributedCache`.
    -   Changed type of obsolete `ContentConfiguration.TemplatePaths`, `MailConfiguration.EndpointAddress`, `TrackingConfiguration.TrackerIds`.
    -   Displaying not-found page at `/health/config/{search}` if no configuration is found.
-   Desktop
    -   Enabled DataLayer configuration on _partycasino.com_ and _sportingbet.com_.
-   M1
    -   **Please customize `ContentConfiguration.Host` according to new [Sitecore DNS names](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10425008)!**
-   M2

### Vanilla 4.3.61.1275-f717b4d

2016-05-04

-   Shared
    -   Removed obsolete `EnumerableExtensions.ToDictionary<TKey, TValue>(this IEnumerable<KeyValuePair<TKey, TValue>>)` and `EnumerableExtensions.Join(this IEnumerable<object>, string)` methods.
-   Desktop
    -   [B-203191](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10382359) Use new POSAPI endpoint to retrieve label prefix (e.g. _bz_ for _bwin.com_) instead of reading from configuration.
        Use two-letter language codes for Web_site_Language instead of five-letter culture name (e.g. _EN_ instead of _en-US_). Add label configuration for _partypremium_, _partycasino_.
-   M2

### Vanilla 4.3.60.1258-afd0160e

2016-05-02

-   Shared
    -   [B-200103](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10151846) **Breaking change:** Added implementation of Hekaton-based distributed caching. See [the documentation](http://docs.vanilla.intranet/caching-infrastructure.html#guide-to-upgrade-to-vanilla-with-hekaton) for details about breaking changes and how to deal with them.

### Vanilla 4.3.59.1250

2016-04-28

-   Shared
    -   [D-64161](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A10472871) Fixed missing AccountName property on userData property being passed to Genesys live chat
    -   [D-64130](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A10456505) Fixed: DynaCon performance counters are not discovered by Vanilla installer thus cannot be installed.
    -   Fixed: SiteMap feature throws an exception if disabled and running with DynaCon.
-   Desktop
    -   [D-63962](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A10423300&RoomContext=TeamRoom%3A3089623) Fixed stale cache data (language change not hoored) when requesting contact capabilities.
        Removed `ContactClaimsProvider` - chat availability for content filters is now exposed on the `UserFilterProvider`, i.e. `User.IsPullChatAvailable` - **breaking change**
        Removed `ContactCapabilitesController` - **breaking change**
-   M2

### Vanilla 4.3.58.1042-6e340f2

2016-04-21

-   Shared
-   Desktop
    -   [D-63935](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A10418542) Remove properties FirstName, EmailAddress from userData JavaScript object when opening the chat for an anonymous user.
-   M2

### Vanilla 4.3.57.1032-a52bb6c

2016-04-19

-   Shared
-   Desktop
    -   [B-200768](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10199337) Added [Genesys LiveChat integration](http://faq.vanilla.intranet/2241/Genesys-pull-chat-integration-HOWTO).
-   M2

### Vanilla 4.3.56.1029-6333b4c

2016-04-15

-   Shared
    -   There is a new documentaion of [DynaCon configuration engine in Vanilla](http://docs.vanilla.intranet/configuration-system.html).
    -   Hid class `Bwin.Vanilla.Mvc.Tracking.Renderers.CustomTrackingRendererBase<>` which is meant for Vanilla internal use.
    -   [D-62324](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect:10266751) Fixed health checks so that they are executed with supported culture.
-   Desktop
    -   [D-63752](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A10372735) Fixed trackers (serialization of the configuration to script tag) if DynaCon is enabled.
    -   [D-63752](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A10372735) Fixed rendering of tracking markup if some trackers are disabled and DynaCon is enabled.
    -   Deprecated `TrackingConfiguration.EnabledRenderers` and started using `IsEnabled` in respective renderers' configurations instead.
-   M2
    -   Deprecated `TrackingConfiguration.IsOmnitureEnabled` and started using `OmnitureTrackingConfiguration.IsEnabled` instead.

### Vanilla 4.3.55.1019-3cfa6aa

2016-04-13

-   Shared
    -   [B-201254](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10241032) Added support for site root files without an extension.
    -   [B-202227](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10319951) Allowed DynaCon to be enabled on _PROD_.
    -   [B-202227](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10319951) Fixed random behavior of `/health/config/legacy` if _DynaCon_ is enabled.
    -   [B-202227](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10319951) Improved formatting and styling of `/health/config` report.
    -   [B-202227](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10319951) Randomized time of initial DynaCon poll request to achieve uniform traffic on the service side.
    -   [B-202227](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10319951) Added support for placeholders in DynaCon `fallbackFile` in `web.config` based on DynaCon parameters e.g. `{context.label}` or `{context.environment}`.
    -   [B-202227](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10319951) Added DynaCon performance counters.
    -   Updated _Newtonsoft.Json_ from version _6.0.8_ to _8.0.3_.
-   Desktop
    -   [B-202227](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10319951) Fixed trackers (serialization of their configurations to script tags) if _DynaCon_ is enabled.

### Vanilla 4.3.54.1000-99ca6ab

2016-04-04

-   [B-192362](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9881308) Added background task which is updating the configuration at runtime. It periodically polls DynaCon REST service to determine changes and swaps values transparently for you. No additional changes on your side except [existing guide](http://faq.vanilla.intranet/2177/How-to-leverage-dynamic-configurations) are needed.
-   [B-192362](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9881308) Support for providing DynaCon parameters from the code using `Bwin.Vanilla.Core.Configuration.DynaConParameter` registered in Autofac container. This can be used to specify name and version of shared plugins distributed as NuGet packages e.g. `Authentication` or `BetSlip`.
-   Updated affiliate tracking configuration for _partycasino.com_.
-   Included `flexbox.less` and `flexbox-mixins.less` files in the _Default_ theme.
-   Updated and fixed previous committed files `PCTeaserDocument.cshtml` and `PCTextDocument.cshtml` in _Mobile_ theme.

### Vanilla 4.3.53.978-c6d84c0

2016-03-22

-   [B-199504](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10107710) Added new Basic Loyalty Profile API to `PosApiCrmService`. Product teams are encouraged to change their code to use the **`ICrmService->GetBasicLoyaltyProfile()`** method instead of the `ICrmService->GetLoyaltyProfile()` when they need to get only basic loyalty information (loyalty category, points, isOptInEnabled). This solves performance problems caused by `GetLoyaltyProfile()` calls.
-   [B-190793](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9762313) Message Viewer - fix message-viewer position to stay within header, sometimes offset when outside viewport
-   [B-193171](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9935471) Default and Mobile Theme:
    -   updated normalise.css, added flexbox-mixins.less and flexbox.less to /lib/ folder
    -   added and updated Mobile Views:PCImageTextDocument.cshtml, PCTeaserDocument.cshtml, PCTextDocument.cshtml - these views have been used in the themes ever since, in order to avoid copying them each time for a new theme and reduce maintenance effort we have moved them to Framework/Mobile Theme folder
-   [B-200104](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10151894) Added `sportingbet.com`, `mobile-sportingbet.com` label configuration packages.
-   Changed default location of DynaCon fallback file in `template.web.config` according to the request from LeanOps.

### Vanilla 4.3.52.970-a84ccbe

2016-03-18

-   [B-192358](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9881166) Added support for loading configuration from DynaCon. Please follow [the guide](http://faq.vanilla.intranet/2177/How-to-leverage-dynamic-configurations).
-   [B-190271](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9714608) Added new local claims value to the user claims containing information about availability of Genesys chat channel for a user.

### Vanilla 4.3.51.951-6a044625

2016-03-15

-   [B-192363](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9881339) Changes related to configuration classes and DynaCon:
    -   Interfaces are used instead of classes in general. Please do the same according to the [guide](http://faq.vanilla.intranet/2177/How-to-leverage-dynamic-configurations).
    -   We would like to make config property types consistent. That's why in few cases interface already has the target type, but config class has obsolete property of the old type in order not to introduce breaking change. Example: `ServiceClientsConfiguration.Host` is changing from `string` to `Uri`.
    -   Changed `SiteMapConfiguration.FetchTimeout` from type `int` to `TimeSpan`.
    -   `ServiceClientsConfiguration` was made `sealed`.
    -   PosAPI accessId is not being sent to Sitecore anymore. This [will be addressed](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10068589) in future Vanilla releases.
    -   Renamed `HealthFilesConfiguration.AllowedFileRegexPatterns` to `AllowedFileRegexes`.
    -   Deprecated some unused config properties and cleaned `.jsonconfig` files.
-   [D-61188](https://www52.v1host.com/GVCGroup/Search.mvc/Advanced?q=D-61188) Added class to fix CSS issue: Sports Login Page X button is hidden under the login header.
-   Deprecated Code Toggles, CQ5 library and `Bwin.Vanilla.Mvc.Assets.CreateVersionedAssets`.
-   [B-197191](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A10013382) Added Data layer tracking for AJAX requests on Desktop.

### Vanilla 4.3.50.888-15c74a0

2016-03-04

-   [D-60171](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A9752825) Fixed bug where wrong content template URL was requested. Note, however, that even though the content template URL was wrong it returned correct content template.
-   [B-192248](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9871894) Update AngularJS 1.4.2 -> 1.5.0.
    -   This introduces a number of **breaking changes**. Please study the [migration guide](https://docs.angularjs.org/guide/migration#migrating-from-1-4-to-1-5) carefully and validate your application against the [AngularJS changelog 1.4.3 - 1.5.0](https://github.com/angular/angular.js/blob/master/CHANGELOG.md).
    -   Added [FastClick](https://github.com/ftlabs/fastclick) to overcome the 300ms on (some) mobile devices that was angular's ng-click override dealt with in versions prior to 1.5.0.
-   Enabled new data layer tracking for m.bwin.it.
-   Added reference to `System.IO.Abstractions` NuGet package and registered corresponding services in Autofac.

### Vanilla 4.3.49.881-c24bc4d9

2016-03-02

-   [B-192358](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9881166) Added API to support dynamic configuration from the new service. Service itself is not ready yet, but you can [prepare your code already now](http://faq.vanilla.intranet/2177/How-to-leverage-dynamic-configurations).
-   Deprecated optional configs in favor `IDisableableConfiguration` because of [future dynamic configurations](http://faq.vanilla.intranet/2177/How-to-leverage-dynamic-configurations).
-   Refactored `m2ContentMessages` towards better testability.
-   Added optional prefix for `hover` class set by `jquery.bwin.hover` to use it in BEM css. This functionality is backwards compatible.
-   Disabled caching of user data obtained from `UserDataController`.
-   Added reference to `Microsoft.Net.Compilers` package in order to support C# 6.0 syntax in `.cs` files.

### Vanilla 4.3.48.852-ec1ece16

2016-02-19

-   Added `SetupWithAnyArgs(...)` and `VerifyWithAnyArgs(...)` extension methods for mocks.
-   Added ServiceClients.jsonconfig for mobile-bwin.it, mobile.giocodigitale.it and bwin.it.
-   Added `Bwin.Vanilla.Core.Utils.CodeContractsRewriter` for rewriting preconditions to throw `ArgumentException`.
-   [B-193128](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9932246) Added `UserDataController` and `jquery.bwin.userData.js` plugin to provide access to specific user data to frontend code. This serves mainly as an integration point for Genesys pull chat functionality where the pull chat should be started with user specific data as chat parameters.
-   [B-186807](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9448937) Removed code related to the soon-to-be-decommissioned PosApi `Vip.svc`.
-   Added sorting of content filters on content filters health page.
-   Set `slidingExpiration="false"` in `template.web.config` because forms authentication is prolonged by Vanilla custom mechanism.
-   Fixed placement of Data layer and GTM scripts for Desktop products pages.
-   [B-116213](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A4278778) Added `Browser.IsSupported` content filter which [needs to be configured](http://docs.vanilla.intranet/supported-browsers.html).
-   [B-192866](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9912265) Added `partycasino.com` label configuration package.
-   Added `Browser.Name` nad `Browser.Version` content filters which should be used instead of `Device.BrowserName` and `Device.BrowserVersion`.
-   Changed `IJson` content template to inherit from `IFilterTemplate`.

### Vanilla 4.3.47.814-58d3b11a

2016-02-12

-   [B-174257](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8440726) Updated OmnitureTracking.jsonconfig for gamebookers.com.
-   [B-188351](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9568671) Added `ZipFormat` property to `CountryDto`.
-   [B-176560](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8639285) Added possibility to evaluate content filter expressions on content filters health check page `/health/contentfilters`. **Please note that we have also changed current URL structure for recently introduced content filters health page:**
    -   specific content filter: `health/contentfilters/Prefix.Name` changed to **`health/contentfilters?filter=Prefix.Name`** (e.g. `health/contentfilters?filter=User.IsKnown`)
    -   group of content filters (by prefix): `health/contentfilters/Prefix` changed to **`health/contentfilters?group=Prefix`** (e.g. `health/contentfilters?group=User`)
    -   all content filters: no change, the url is `health/contentfilters`
-   [B-190566](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9742904) Added configurable timeout for health check execution. When multiple health checks are requested, the timeout value applies to execution of every particular health check separately, it's not cumulative. By default the 60 seconds timeout is used and if you need other value for some label, just create the [`HealthReport.jsonconfig`](https://vie.git.bwinparty.com/vanilla/monorepo4/blob/master/Source/Bwin.PluginHost/Configuration/Defaults/Areas/App/HealthReport.jsonconfig) file for that label with desired timeout value. **We've also made the multiple health checks run in parallel** to reduce total health check time. Please make sure you don't use `HttpContext.Current` in custom health checks, because the health checks are now running in separate threads that are not aware of `HttpContext` so the `HttpContext.Current` will always be `null` for these threads.
-   [B-187034](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9466682) Removed high-density-screen image handling in `m2PictureWithProfiles` used on public pages.
-   [B-187034](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9466682) Fix in `m2PictureWithProfiles`: if the screen fits precisely one of the profiles (e.g. screen is 320px and there is 320px profile), larger profile is used (480px). After the fix, appropriate profile is used (320px).
-   Fixed `Tracking.jsonconfig` configuration for `sh.bwin.de` for `qa2` environment.

### Vanilla 4.3.46.794-91126e75

2016-01-28

-   [D-60254](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A9781907) Fixed issue when Content health check has treated 404 responses from Sitecore as errors.

### Vanilla <s>4.3.45.787-8bff0310</s>

**Warning: Broken Content health check - treats returned 404s from Sitecore as errors.**

2016-01-27

-   Reverted the `ZipFormat` story [B-188351](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9568671) because of the broken implementation.

### Vanilla <s>4.3.44.783-2aac18e2</s>

**Warning: Broken serialization of `Bwin.Vanilla.ServiceClients.Model.CommonData.ZipFormat`.**

2016-01-26

-   [B-187359](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9485744) **Breaking change** Enabled side-by-side co-existence of the old and new Data layer tracking. The configuration properties for the new Data layer tracking have been moved to `Tracking.jsonconfig`. For more detailed info about breaking changes see the Management summary [in the story](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9485744).
-   [B-188351](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9568671) Added `ZipFormat` property to `CountryDto`.
-   [D-59600](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A9629716) [M2] Fixed bug when user with Dutch language gets an error when logging in.
-   [B-180953](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9029349) Reduced number of HealthCheck Sitecore requests. FYI: in this version we introduced Autofac registration of `MemoryCache` type with the `MemoryCache.Default` instance.
-   [B-190563](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9742612) Configured nginx-proxy address for Sitecore url on `gamebookers.com` (both Desktop & M2). With this change (new rest-url for sitecore for gamebookers.com), the content loading from sitecore has been changed to use a reverse proxy for sitecore (nginx). This should not have any impact to vanilla applications. **Please make sure to apply a regression test for content related features for gamebookers using this new version. Please make sure to inform the following persons when rolling out the change to gamebookers web servers, so we can monitor nginx after the release.**
    -   Alexander.Zima@bwinparty.com
    -   Tamas.Molnar@bwinparty.com
    -   Peter.Alberer@bwinparty.com

### Vanilla 4.3.43.763-67cd58f

2016-01-12

-   [B-179465](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8909908) [Desktop] Implemented unified encoding of messages trasported in the header of Ajax responses. This change was done in a non-breaking fashion by storing encoded messages in a new dedicated HTTP header `X-bwin-message-queue` and providing a JavaScript API (in the `jquery.bwin.httptools` plugin) for centralized retrieval and decoding of such messages. Desktop teams are encouraged to update their source code to use this new approach asap. For more details please see the Management summary [in the story](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8909908). Related incident: [INC134015](https://bwinparty.service-now.com/nav_to.do?uri=incident.do?sys_id=069295820f8a02002ac385ece1050e50).
-   [B-186292](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9411342) Changed log level of `SqSaBlocked` `PosApi` error to `Info`.
-   [B-186768](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9444335) [Desktop] Fixed alignment of personal button.
-   [B-105232](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A3847693) [Desktop] Added support for linking to other tabs from within tabs.
-   [B-187360](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9485751) **Breaking change** Removed support for legacy redirects including "V5 legacy redirects" health check. For more info about breaking changes see the Management summary [in the story](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9485751).
-   Fixed behavior when multiple implementation types for the same content template were used in the Vanilla application.

### Vanilla 4.3.42.751-45eb7999

2015-12-14

-   [B-185810](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9379325) Changed sort order in language switcher for `partypremium.com` (both M2 and Desktop).
-   [B-181370](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9062641) [M2] Changed log level to `Warning` for all errors related to public pages fetching.
-   Fixed `Theming.jsonconfig` for `bwin.fr` to refer the correct theme: "bwinfr".
-   [B-176258](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8612079) Added Content Filters Diagnostics page `/health/contentfilters` for evaluating Content filters values in the context of Vanilla application.
-   [D-58848](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A9429869) Added `jquery.bwin.fileuploader.js` to `core.bundle.js` in `Default` desktop theme.
-   [B-185255](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9350382) Added configuration for `qa3` environment in general.
-   [TK-554677](https://www52.v1host.com/GVCGroup/Task.mvc/Summary?oidToken=Task%3A9420194) Changed log level _Player is temporarily blocked_ error.
-   [B-171217](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8179868) Optimized `User.FirstLogin` content filter to skip PosApi request when user is not authenticated and return `false` immediately.
-   Updated Omniture configuration for desktop `partypremium.com`.

### Vanilla 4.3.41.731-25a2a324

2015-11-27

-   [B-181320](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9058091) Modified PosApi exception logging to take the eror code into account when choosing logging level.
-   [B-179928](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8946696) Added `IJson` content template model for mapping to `Json` template in Sitecore.
-   [B-184851](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9318670) Removed `autofac.config` for `partypremium.com` because it contained only a reference to the `GlobalAuthorizeModule` - not needed anymore.
-   [B-185149](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9343779) Added `BonusRestriction` property to `BonusLayer` and `BonusLayerParameters` objects obtained from PosApi CRM service.
-   [D-55134](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A8580817) Reverted the D-55134 fix as it has caused other issues. Related incident: [INC134015](https://bwinparty.service-now.com/nav_to.do?uri=incident.do?sys_id=069295820f8a02002ac385ece1050e50).
-   [B-178394](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8817445) [M2] Fixed issue with Commission image in M2 footer.

### <s>Vanilla 4.3.40.714-daaf0c57</s>

**Warning: Broken for Desktop - error messages encoding for full page requests doesn't work correctly**

2015-11-19

-   [B-179272](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8886426) [M2] **Breaking change for those who overwrite the ClientBootstrap.cshtml view.** The `m2ThirdPartyTracker` functionality ported from M2 Portal to Vanilla. See details about the change [in the story](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8886426).
-   [B-182812](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9179056) [M2] **Breaking change for M2.** Changed animation of register/bonus button. **Themes >= 3.1.1585 are required for this to work**!
-   [B-171217](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8179868) Added `User.FirstLogin` - new content filter.
-   [D-55134](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A8580817) [Desktop] **Possible breaking change.** Fixed encoding of messages in the ajax error response. Related incident: [INC134015](https://bwinparty.service-now.com/nav_to.do?uri=incident.do?sys_id=069295820f8a02002ac385ece1050e50). It could be a breaking change only in very specific scenarios, please see the Management summary [in the story](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A8580817).

### Vanilla 4.3.39.702-9ad67e65

2015-11-11

-   [B-174597](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8468355) [Desktop] Added Data layer tracking for Desktop
-   [B-174597](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8468355) [M2] **Breaking change for M2** The ClientBoostrap.cshtml view was updated due to the change how the Data layer is rendered on server. Please see the M2 part in the Management summary [in the story](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8468355) for details.
-   [B-178355](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8813230) - [M2] Fixed showing of sign-up bonus indication.
-   [D-58026](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A9214688) [M2] **Breaking change for M2 applications that use Vanilla >= 4.3.36** Fixed handling of mobile footer refresh. Please see the Management summary [in the story](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A9214688) for details.
-   [B-178289](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8807424) Added link to Redirex health report link from Vanilla health pages.
-   [B-180939](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9027338) Fixed multiple logging scenarios in PosApi
-   [M2] Fixed reporting of browser orientation for both Data layer and legacy tracking
-   Disabled post login handling for `bwin.gr` (by removing `PostLogin.jsonconfig`)
-   Added label config for `danskespil.dk`

### Vanilla 4.3.38.677-92a422f9

**Warning: Don't use for M2, on some browsers the footer is reloaded with an error after user country changes.**

2015-10-23

-   [B-179605](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8919408) **Breaking change for products that use Desktop Portal plugins (you will have to use Portal that uses at least Vanilla version 4.3.38, see the Management summary in the story for details**) `ContentModel` now has an optional `UseOverrides` argument that switches content binding to overrides.
-   [D-56481](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A8867856) Health config page now correctly renders all of the items even if some of the referenced assemblies throw exception during the evaluation cycle.
-   [D-55740](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A8703411) Fix - registration page on native doesn't have unneeded space, that was caused by wrong min height calculation.
-   [B-180939](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A9027338) Fixed multiple logging scenarios in PosApi

### Vanilla 4.3.37.661-cec18b74

**Warning: Don't use for M2, on some browsers the footer is reloaded with an error after user country changes.**

2015-10-15

-   [B-158114](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7244590) [M2] SiteMap feature disabled in **default** `SiteMap.jsonconfig`. Previously the SiteMap feature had to be disabled in the label-specific `SiteMap.jsonconfig`, now the label-specific `SiteMap.jsonconfig` file can simply be removed for labels that don't use SiteMap-based canonical links rendering. Additionally, the `MediaQuery` configuration property in the `SiteMap.jsonconfig` isn't required when the SiteMap is `Disabled`.
-   [D-42058](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A5922751) [M2] Added `m2Location` service to wrap some of the `$location` service's functionality. It provides `m2Location.url()` function that merges multiple quick navigation events so that only the last one is added into history. This function should be used istead of `$location.url()` wherever such "merging" behavior is desired.
-   [B-179340](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8896922) Added `Delete` and `Put` methods to `PosApiServiceBase`.
-   [B-178394](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8817445) [M2] **Breaking change for those who overwrite `_Footer.cshtml` view** - Mobile footer refactored into separate controller.
-   [B-180298](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8973533) [Desktop] Removed caching of footer.

### Vanilla 4.3.36.651-14b69b3f

**Warning: Don't use for M2, on some browsers the footer is reloaded with an error after user country changes.**

2015-10-09

-   [B-173080](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8339668) Added `GetContentOverrideOrDefault` to `IContentSession` to load overrides
-   [B-178394](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8817445) [M2] **Breaking change for those who overwrite `_Footer.cshtml` view** Footer is now rendered on client side and is automatically refreshed when user country has changed. See the story for details.

### Vanilla 4.3.35.641-a6f355db

2015-10-02

-   [D-56044](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A8770522) `ContentHealthCheck` now correctly fails when templates load failed or no templates were loaded. Related incidents: [INC133889](https://bwinparty.service-now.com/nav_to.do?uri=incident.do?sys_id=c4646ba50f0602002645fa6ce1050e6c), [INC133592](https://bwinparty.service-now.com/nav_to.do?uri=incident.do?sys_id=52b3765c0fca82043e89fe6362050e52), [INC136151](https://bwinparty.service-now.com/nav_to.do?uri=incident.do?sys_id=7285a3110fee86002ac385ece1050e6b), [INC136010](https://bwinparty.service-now.com/nav_to.do?uri=incident.do?sys_id=deea1a4d0fa286002ac385ece1050e5d).
-   [B-178008](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8784331) [M2] **Breaking change** Suppressed annoying effect of scrolling to top of the current page during navigation to different page. For details what has been changed, see the "Management summary" in the story.
-   [B-179068](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8868479) If content templates could not be loaded from the rest service they fallback to the file system.
-   [B-177510](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8735730) [M2] Added the `data-country` attribute to `html` element with the information about user's country. For an unauthenticated user this attribute is not present.

### Vanilla 4.3.34.629-6c55fac8

2015-09-25

-   **Hotfix** - Reverted the change of messages encoding that caused messages being encoded twice and thus being incorrectly displayed in some scenarios.

### Vanilla <s>4.3.33.626-36b89b0f</s>

**Warning: Broken messages encoding.**

2015-09-24

-   **Hotfix** - Temporarily removed checking for domain embedded in the authentication cookie. After all products will be updated to Vanilla version >= 4.3.33 the check will be returned back.
-   Changed StartUrlTemplate for test environment in PostLogin.jsonconfig

### Vanilla <s> 4.3.32.622-3cff827</s>

**Warning: Broken authentication cookie handling.**

2015-09-21

-   [B-174994](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8506542) Fix: Health report page showed error for the `ContentSettingsConfiguration.json` when it should not.
-   [B-177125](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8700770) Added check for correct application domain in authentication cookie. Correct domain is now stored by Vanilla inside encrypted value of authentication cookie after successful login.
-   [B-175740](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8566271) [Themes] - uniform removal
-   [D-55725](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A8699932) Removed support for `uni` buttons in `jquery.bwin.dialog.js`
-   [D-55134](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A8580817) **Breaking change** Fixed issue with enconding messages inside custom HTTP header. Now you shouldn’t encode or escape such messages in your server side code before adding them to the message queue in any way, you should just add them as they are (even with international characters) to the message queue. In the JavaScript code such messages should be decoded after they been received using the `decodeURIComponent()` function.
-   [B-176102](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8598404) Fixed behavior when SiteMap fetching is disabled
-   [B-176102](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8598404) Malfunction of SiteMap fetching does not stop the application from starting anymore. The errors are only being logged now.
-   [B-173080](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8339668) `GetContentOverrideOrDefault` method was added to `IContentSession` to load overridden content for any content item in Sitecore.
-   [B-170132](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8086713) Fixed closing of client-side dialogs and showing/hiding the bonus reminder button.
-   [bwin.gr & mobile-bwin.gr]: Set `el-GR` as the default language on PROD.
-   Fixed reference to `System.Net.Http.Formatting` in `Bwin.Vanilla.ServiceClients`
-   Replaced `ShallNotThrow` property of `ConfigurationModelAttribute` with `IsOptional` property.
-   Changed log level of missing optional JSON configuration from warning to info.
-   Removed Dutch from `partypremium.com` mobile config.
-   Set theme to `M2Gamebookers` in `gamebookers.com` mobile config.

### Vanilla 4.3.31.598-ba016f0c

2015-09-07

-   [B-174383](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8452102) [Premium & Partypremium] Vanilla now redirects users to default culture once they request a hidden culture (e.g. `NL`) that doesn't match the language in their account settings.
-   [B-176102](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8598404) - [**Breaking change for the SiteMap.jsonconfig files (M2 only)**] Added support for loading the sitemap (for rendering canonical links) from **Sitecore** using the Sitecore specific path. To make sitemap fetching working, it is now required to add the `SiteMapSource` property in `SiteMap.jsonconfig`. This property defines the source of the sitemap - be it the `Uri` or the `Sitecore`.
-   [B-176744](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8663128) - Removed `NL` & `PT` languages in partypremium jsonconfigs.
-   [B-175763](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8569004) - [bwin.gr] `Globalization.jsonconfig` updated: Added `EN` language for `FVT` and `PROD`.
-   [D-43346](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A6207916) Added `angular-touch-fixed.js` which fixes issue: [`ng-click-active` remains stuck](https://github.com/angular/angular.js/issues/10918) and also Sports issue: the icons from the breadcrumb navigation bar sometimes look inactive.
-   Modified `ICookieHandler` to directly set/remove a cookie without any checks for existing ones.

### Vanilla 4.3.30.579- 4338191

2015-08-26

-   [B-170954](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8164695) Added support for triggering a full-screen dialog with specified content by the `#` fragment in the URL
-   [B-170954](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8164695) The `fullscreen` option has been added for modal dialogs
-   [B-170132](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8086713) Fixed adding the `useHtml5Api=true` querystring into iframe's url for the iframe based dialog.
-   Set Dutch language as hidden in `partypremium.com` label configs.
-   Updated cashier URLs to actually correct prod URLs, added cashier URLs for common test environments.
-   Updated `TrackingImageFormat` in `bwin.com` mobile config.
-   Corrected PosAPI endpoint and tracking config in `gamebookers.com` mobile config.

### Vanilla 4.3.29.568-3553345

2015-08-18

-   [B-172776](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:8318030) Improved cross-browser Flash version recognition. `The jquery.bwin.flash.js` now returns complete Flash version, including the build number for all browsers.
-   [B-164159](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:7703180) ContentBinder doesnt stop content binding if one of the documents was not found in the CMS.
-   [B-163788](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:7675200) **Breaking change!**: The `DataLayerName` property in the `GoogleTagManagerTrackingConfiguration` made `Required`.
    Fixed issue with missing `ContainerID` in the `GoogleTagManagerConfiguration`.
-   [B-173762](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:8401526) SiteMap fetching made more robust.
-   [B-170132](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:8086713) Implemented generic post login popup functionality.
-   [B-173005](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:8336150) `IUserBalance` updated to contain `TaxWithheldAmount` property.
-   [B-173508](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story:8372223) Remove NL language from the language dropdowns on UI for non NL users. To get the list of UI visible languages one should use `IUserLanguageResolver.GetUIAllowedLanguages` method, instead of `ICultureManager.SupportedLanguages`.
-   Fixed Omniture tracking configuration for mobile `partycasino.com`.

### Vanilla 4.3.28.543-1979d7c

2015-08-04

-   [B-172674](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8306953) Providing `referer` query string parameter for sign-up bonus redirect.
-   [B-170776](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8150079) If user is authenticated `user-authenticated` class is added to the html tag in `DefaultLayout.cshtml`.
-   [B-160857](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7466114) Added List.Contains - new content filter. See content filtering vanilla documentation for more information.
-   [B-170434](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8113129) Modified CSS classes on M2 language switcher.
-   [B-170772](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8149856) Removed duplicated `X-Frame-Origin` header and only one is preserved. .box parameter allow to remove the X-Frame-Origin header completely.
-   [B-158114](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7244590) `SeparateUrlsMap` (canonical urls obtained from Sitemap) caching changed to use the `MemoryCache` to be able to clear it using the `/health/cache` page.
-   Removed obsolete `GlobalAuthorizeModule` which was replaced by `Authorization.jsonconfig`
-   Explicitly specified order for global filters:
    -   Authorization filters:
        -   10 - ClaimRedirectFilter
        -   20 - ValidateAntiForgeryTokenFilter
        -   30 - GlobalRestrictAnonymousAccessFilter
    -   Action and result filters
        -   10 - QueryStringFilter
        -   20 - LayoutOverrideFilter
        -   30 - MessageQueueFilter
        -   40 - TrackingFilter
        -   50 - UserSettingsFilter
        -   60 - SignUpBonusRedirectFilter
        -   70 - SeoTrackingFilter

### Vanilla 4.3.27.529-645c5cc

2015-07-22

-   [B-170651](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8139735) Added possibility to load content outside of configured `RootNodePath` in `Content.jsonconfig`. It can be used with `IContentManager` by specifying `DocumentId` with additional relativity flag. _This feature will not work when using `Files` as content source._
-   [B-171293](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8186343) `BrowserName` and `BrowserVersion` are now available as content filters.
-   [B-170620](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8135863) Created `gamebookers.com` M2 label config.
-   [B-166271](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7873371) Updated `PostLogin.jsonconfig`, `Tracking.jsonconfig`, `LegacyRedirects.jsonconfig`, 'ServiceClients.jsonconfig' and 'Caching.jsonconfig' files.
-   [B-169675](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8051448) Updated Omniture tracking for M2.
-   [D-51210](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A7858621) Fixed: Dialog with personal message blinks when switching between pages.
-   [B-163788](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7675200) Fixed bug in `m2Config` when the Google Tag Manager's `ContainerId` has been handled incorrectly in the case the Google Tag Manager tracking was turned off.
-   [B-171341](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8189435) Fixed registration of invalid configuration models so that they do not return null on second request, but still throw validation exception.
-   Added `If()` extension method of `IRestRequestBuilder` to make code more readable.
-   Removed useless `UseLocalCache` property from `CachingConfiguration`
-   Removed obsolete code deprecated for more than 3 months.

### Vanilla 4.3.26.505-c5b14cb

2015-07-07

-   [B-163788](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7675200) Added tracking Data layer for M2. For details about the procedure to upgrade from legacy tracking to the Data layer based tracking, see please the [Vanilla documentation](http://docs.vanilla.intranet/web-analytics.html#tracking-data-layer).
-   [B-168203](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7953022) Removed Portuguese in `partypremium.com` mobile config.
-   [B-166485](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7891608) Updated jQuery UI to the latest version 1.11.4.
-   [B-169432](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A8032779) Updated AngularJS 1.3.15 -> 1.4.2.
-   [B-164923](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7763669) Added config setting to render balance as a link to deposit or as a plain text.
-   [TK-503147](https://www52.v1host.com/GVCGroup/Task.mvc/Summary?oidToken=Task%3A8059203) Modified default language to Italian for IT labels.
-   [D-49874](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A7473913) Fixed: on a Nexus phone native browser toolbars messed up the correct height measurements
-   [B-154851](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A6930781) Updated Omniture Tracking URL in `bwin.com` label config.
-   [B-169052](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7995989) Not-found page on m2 is setting `topnav` flag to `true` now. `.showTopNav` is set by Vanilla now.
-   Added class to `MobileLayout.cshtml` for disabling scrolling on the page when there is an overlay displayed.
-   Updated m2 `_Footer.cshtml`.
-   Added missing `Authorization.jsonconfig` in `partypremium.com` label config.
-   Fixed missing trailing slashes in PosAPI urls.
-   Removed `PostLogin.jsonconfig` for `partypremium.com` because new PLP is used.

### Vanilla 4.3.25.472-a790073

2015-06-23

-   [B-159092](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7326325) Added `data-env={current_environment_name}` attribute to the main `<html>` node.
-   [D-50239](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A7580386 'D-50239') Fixed internal server error on request to invalid URLs e.g. [https://www.bwin.com/\*](https://www.bwin.com/*), changed to not found.
-   [B-161997](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7549865) Fixed: when no teaser was specified for the language, empty placeholder was shown. Fix changes rendering of `PCImageTextDocument`.

### Vanilla 4.3.24.464-9c2188cf

2015-06-12

-   [B-163938](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7688214) Integrated Kana chat JavaScript library into Vanilla M2
-   [B-165702](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7829163) Add turkish language to supported gamebookers languages
-   [B-159845](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7384234) Additional languages for partypremium.com
-   [D-49985](https://www52.v1host.com/GVCGroup/defect.mvc/Summary?oidToken=Defect%3A7502849) Content type was not set in case of `HttpException`
-   [B-166328](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7878398) Updated post login endpoint for gamebookers.com
-   [B-166126](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7861370) New properties `TodayPoints` and `ProductGameWisePoints` has been added to the `ILoyaltyProfile`
-   Changed view path to simple names in default `SiteRoot.jsonconfig` for M2 so that they can be easily overridden in themes.
-   Updated Omniture tracking in `bwin.gr` label config.

### Vanilla 4.3.23.447-e2d27554

2015-06-02

-   Reverted `m2Url.toUrl` changes because of the issues with `https` urls.

###<s>Vanilla 4.3.23.446-74eaa7b</s>
**Warning: Broken m2Url.toUrl.**

2015-05-29

-   [B-162069](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7550417) and [B-164507](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7731625) Secure cookie handling was added. Now all the cookies are secure by default. Its managed by the requireSSL flag in httpCookies section in the web.config. RequireSSL is true now, by default (on the production environment).

**Note:** Cookies that are manually created with secure set to false will still remain insecure.

### <s>Vanilla 4.3.22.422-cbe3a27</s>

**Warning: Broken m2Url.toUrl.**

2015-05-28

-   [B-163584](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7661667) Add `DefaultCurrency` to `ICountry`.
-   [B-163461](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7652010) Fixed: Icon for expanding/collapsing Terms and Conditions of sign-up bonus dialog in case it is initially expanded.
-   [B-156545](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7102538) **Breaking change!** Any `ContentFilterProvider` should use `FilterPrefixAttribute` to register its prefix. All `IContentFilterProvider.Prefix` implementations should be substituted with FilterPrefixAttribute.

### Vanilla 4.3.21.437-6b7d291

2015-05-27

-   Reverted `requireSSL="true"` in `transform.web.prod.config` because it breaks FormsAuthentication and blocks user from logging in. Issuing secure cookies will be addressed in future Vanilla versions.

### <s>Vanilla 4.3.21.436-f9481e8</s>

**Warning: Broken requireSSL="true".**

2015-05-22

-   [B-163938](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7688214) Integrated Kana chat JavaScript library into Vanilla.
-   [B-163461](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7652010) Expanding terms and conditions of sign-up bonus depending on existence and filtering of content `App-v1.0/Header/Marketing/SignUpBonus/ExpandTac`.
-   [B-163761](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7671598) M2 footer populated with multiple MinimumAge fields and a new Commission field.
-   [B-162069](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7550417) Set `requireSSL="true"` in `transform.web.prod.config` to make production cookie secure by default.
-   [B-139079](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A5738641) All configs are being returned by `/health/config`.
-   [B-158115](https://www52.v1host.com/GVCGroup/story.mvc/Summary?oidToken=Story%3A7244622) Disabled sign-up bonus redirect in configs for mobile `premium.com` and `partypremium.com`.
-   Changed PosAPI host in `bwin.gr` label config.
-   Changed AppFabric endpoints in `bwin.be` mobile config
-   Fixed: New PLP breaks because of HTML 5 mode for old PLP.

### Vanilla 4.3.20.422-ff1ade2

2015-05-07

-   **Breaking change: removed device redirects and nice URL redirects. Now they are handled by Redirex.**
-   Added new `RedirectToLink` action in `SiteRoot.jsonconfig` which redirects to URL from a Sitecore link specified by `RedirectLinkLocation` property.
-   Moved landing page URL for sing-up bonus redirect from `Tracking.jsonconfig` to Sitecore link at path configured in `SignUpBonusRedirect.jsonconfig`. Currently this feature is used only on M2. **Content `App-v1.0/Links/SignUpBonus` has to be created.**
-   Tracking of cashier navigation from `m2HeaderCtrl`.
-   Added cache health page with possibility to clear `MemoryCache`.
-   Added `Authorize` property to `MobileRoute`
-   Changed Omniture tracking for mobile `bwin.be`.
-   Merged in sign-up bonus handling to `ClientBootstrap` on m2.
-   Changed logging of exceptions if remote host closed the connection while downloading an asset.
-   Fixed:
    -   Whitespaces in `Omniture.jsonconfig` for partypoker.com
    -   Fixed unauthorized response for Ajax requests for non-premium labels (`UnauthorizedResponse` set to `CustomErrorPage` in `Authorization.jsonconfig`).
    -   Internet Explorer issues related to Uniform JS.
    -   `m2MainMenu` and `m2LanguageSwitcher` on initial page load are visible and collapse with an animation. They shall be hidden.
    -   Language resolution from scratch (`lc=1` query string parameter) does not work on m2.

### Vanilla 4.3.18.363-325b570c & 4.3.19.385-a122c5f0

2015-04-30

-   Change intended to fix asset handling issues. Refer to [INC122193](https://bwinparty.service-now.com/incident.do?sys_id=5fbdaa5c0f37f14052fb0eece1050ea4&sysparm_record_target=incident&sysparm_record_row=1&sysparm_record_rows=1&sysparm_record_list=active%3Dtrue%5Estate%21%3D9%5Epriority%3D1%5EORDERBYpriority). Please update to corresponding Vanilla version (4.3.18.363 and 4.3.19.385 respectively).

### <s>Vanilla 4.3.19.384-b083697</s>

**Warning: Broken asset handling.**

2015-04-21

-   Rendering canonical tag links on mobile pages based on `sitemap.xml`.
-   Moved login page url from `web.config` to link item in Sitecore at location specified by `Authorization.jsonconfig`. This config also configures global authorization used on premium labels. **Particular link item (e.g. `App-v1.0/Links/SignIn`) has to be created!**
-   Setting temporary claims principal before executing `ILocalClaimsProvider` providers during login or claims refresh. **As described before, current principal shall be obtained using `ICurrentPrincipalProvider`, `Func<IPrincipal>`, `Func<IIdentity>` or `HttpContext.User`, but not `Thread.CurrentPrincipal` because of async issues**
-   Serializing `AllowAnonymous` property of mobile routes on m2
-   Added HTML5 support for `jquery.bwin.postlogin.js`.
-   Created mobile config for `bwin.be`.
-   Created label config for desktop and mobile `bwin.gr`.
-   Fixed:
    -   Mobile routes in `/health/config` do not correspond to actual values in `jsonconfig` files.
    -   Typo in `LegacyRedirects.jsonconfig` in `giocodigitale.it` label config.
    -   Mobile routes can't be removed by setting them to `null` in jsonconfigs.

### <s>Vanilla 4.3.18.362-5c9d8e3</s>

**Warning: Broken asset handling.**

2015-04-14

-   Added more authentication changes for Premium.
-   Created labelconfig for party premium webs (desktop and m2).
-   Converted `jsonconfig` files to actual JSON.
-   Consolidated redirect handling in the `SiteController`. Multiple redirects issued in the `SiteController` are now being combined to issue just one final redirect when `RootUrl->Action` in the `SiteRoot.jsonconfig` has been set to `RedirectToAction`.
-   Added support for the `resolve` property in `MobileRoute` configuration. Its value should be stored as a `string` but is converted to raw JavaScript object when serialized.
-   Removed `PostLogin.jsonconfig` from `bwin.it`, `bwin.fr` and `giocodigitale.it` label configs because new PLP is enabled on these labels.
-   Changed campaign from `giocodigitale` to `bwingiocodigitale` in Omniture tracking in `giocodigitale.it` label config.
-   Updated `partypremium.com` mobile config.
-   Changed Omniture tracking in `partypoker.com` label config.
-   Minor changes in `m2.js` regarding unfixed header and added iOS variable to header in `ClientBootstrap.cshtml`.
-   Increased `maxRequestLength` in `web.config` because of regulatory rules for document upload.
-   Included more details in exception thrown if public page has invalid content.
-   Changed log level of not found errors received by `ICrmService.GetTrackerId()`.
-   Fixed:
    -   When user goes to another page, then logs in and hits the back button he got the page from the cache and remains in unlogged state.
    -   Error causing connection closed by the host exception. Error logging mechanism was also changed to ignore this error.
    -   Serialization of `IMessageQueue` to AppFabric and refactored one of its methods.

### Vanilla 4.3.17.9045

2015-03-24

-   Changed startup behavior so that web can startup even without fallback files when configured to `ServiceAndFiles` content source. Content health checks changed, now there are two content health checks, one for content files and one for the content rest service.
-   Fixed `NativeApplicationFilterProvider` Autofac registration so that it can be overridden in products.
    Added check for multiple `ContentFilterProvider` registrations with the same `Prefix`.
-   Fixed configuration overrides order of precedence.
-   Enabled new device redirects (by adding `DeviceRedirectFilter.jsonconfig`) in `bwin.it` and `giocodigitale.it` label configs.
-   Updated `Mobile.jsonconfig` in `MobileConfig.premium.com`.
-   Updated third-party libraries:
    -   `AngularJS` 1.3.8 -> 1.3.15
    -   `Microsoft.AspNet.Mvc` 5.2.2 -> 5.2.3
    -   `Microsoft.AspNetRazor` 3.2.2 -> 3.2.3
    -   `Microsoft.AspNet.WebPages` 3.2.2 -> 3.2.3
    -   `Microsoft.AspNet.WebApi.Client` 5.2.2 -> 5.2.3
    -   `Microsoft.AspNet.WebApi.Core` 5.2.2 -> 5.2.3
    -   `Microsoft.AspNet.WebApi.WebHost` 5.2.2 -> 5.2.3
    -   `AjaxMin` 5.11.5295.12309 -> 5.14.5506.26202
    -   `Microsoft.Net.Http` 2.2.28 -> 2.2.29
    -   `Microsoft.Bcl` 1.1.9 -> 1.1.10
    -   `Autofac.Extras.DynamicProxy2` 3.0.4 -> 3.0.5
    -   `Newtonsoft.Json` 6.0.6 -> 6.0.8
    -   `JetBrains.Annotations` 7.0 -> 8.0.5.0
    -   `NUnit` 2.6.3 -> 2.6.4

### Vanilla 4.3.16.9032

2015-03-23

-   Fixed in `jquery.bwin.postlogin`:
    -   If user has a minimized bonus (`pl-min` cookie), but missing `new-plp` cookie, all scripts on the page are broken e.g. unable to play any game on Casino.
    -   Bonus reminder button doesn't work after user state section gets refreshed

### Vanilla 4.3.15.8998

2015-03-18

-   Extended `Request` and `QueryString` content filters to work also on M2. This is achieved by sending additional query string parameter `browserUrl` or header `x-bwin-browser-url` implemented in an `$http` interceptor.
-   Unified serialization of `NameValueCollection` to JSON in `ApiControllers` and `JsonHelper`.
-   Restored favicon meta tags in `DefaultLayout` and `MobileLayout`.
-   Updated favicons for `Mobile` theme.
-   Removed source map references from angular files.
-   Caching and compiling regular expressions used in content filters.

### Vanilla 4.3.14.8972

2015-03-16

-   Added support for config overrides. The Vanilla applications developers are encouraged to create the "override" version of jsonconfig files for those parts of configuration(s) that are not meant to be overwritten by Vanilla framework updates. The naming convention is` {ConfigName}.override.jsonconfig`, e.g. `Host.override.jsonconfig`. During merging the overrides take precedence over their common counterparts.
-   The key of the `Route` under which was the `Route` configured is used as a route name. The convention for such key is `{PluginName}.{RouteName}`, e.g. `App.Otherwise`. All products using client-side routing should be updated (M2Portal, etc.)
-   Added content filter providers `Device.OSVersion` and `Device.GetCapability(name)`.
-   Added `doNotRedirectAfterSuccess` optional parameter to `m2Auth` directive.
-   Changed localized short month names to have only 3 characters.
-   Removed useless `GoogleTagManagerTracking.jsonconfig` from mobile configs.
-   Changed `https` to `http` in `Tracking.jsonconfig` in `bwin.it` mobile config and removed `Caching.jsonconfig` from `bwin.es` mobile config.
-   Added `LegacyRedirects.jsonconfig` to `bwin.it` and `giocodigitale.it` label configs.
-   Implementation of native application filtering has changed. The new filter `NativeApplication` was created with these properties: `NativeApplication.IsNative` (returns by default `false`) and `NativeApplication.Product` (returns by default `""`). The filter's implementation can be overriden in Vanilla applications using IoC.
-   Removed `GoogleTagManager` from `EnabledRenderers` for `giocodigitale.it` as far as there is no `GoogleTagManagerTracking.jsonconfig` anyway.
-   Fixed: `m2CurrencyFilter` fails if input is `null` or `undefined`.

### Vanilla 4.3.13.8949

2015-03-09

-   Changed servers in Omniture tracking configuration for `giocodigitale.it`, both desktop and m2.
-   Added rendering of tags in HTML `<head>` loaded from Sitecore `App-v1.0/HtmlHeadTags` folder.
-   The `redirex-original` URL is now being passed to the Omniture for both desktop and m2 apps.
-   Updated Sitecore templates: added filter condition field to `IStaticFileTemplate` and `IFormElementTemplate`.
-   Method `IsFromNativeApplication` of the `RequestFilterProvider` changed to property according to the convention.
-   Added `Product` property to the `INativeApplicationResolver`.
-   Added nuget packages `Bwin.LabelConfig.Defaults` and `Bwin.MobileConfig.Defaults` and moved specific `jsonconfig` files into them. They will be automatically installed as dependencies of label config packages.
-   Set `ActiveTheme` to `M2Black` in `bwin.com` mobile config.
-   Removed useless empty `SelectedMainMenuTabName` and `ProductTopbarLocation` from `Mobile.jsonconfig` files.
-   Removed empty useless `AccessId`-s from `ServiceClients` in `Defaults` label config.
-   Removed code which was obsolete for more than half year: `CultureInfoExtensions.ParentLanguageCode`, `TemplateAttribute.ctor(string)`, `IDeviceRecognitionService.GetRedirectGroup()`, `ITrackingRenderer.AddNavigationEvent()`, `ITrackingRenderer.AddEvent()`, `RouteValueKeys.Area`, `RouteBuilder.DisableClaimsAuthentication`.

### Vanilla 4.3.12.8926

2015-03-03

-   The login page is now the first load page for mobile premium.
-   Enabled Omniture tracking in `giocodigitale.it` mobile and label configs.
-   Minor changes of promise handling in `m2PublicPageCtrl`.
-   Replaced `SingleValueCachingInterceptor` with `SingleValueCache`.
-   Fixed: `m2LoadingIndicator` is not closed when Angular fires multiple `RouteChangeStart` events, but only one `RouteChangeSuccess`.

### Vanilla 4.3.11.8905

2015-02-23

-   Changed order of merging jsonconfigs: first we merge them by files, then by environments. For example if `~/Configuraiton/Defaults/Demo.jsonconfig` is:

          {
              prod: { Value: 'Defaults-prod' },
              dev: { Value: 'Defaults-dev' },
          }

    and `~/Configuration/bwin.com/Demo.jsonconfig` is:

          {
              prod: { Value: 'bwin.com-prod' }
          }

    then `DemoConfiguration.Value` for environment sequence

    -   `dev,prod` will be `Defaults-dev`
    -   `prod` will be `bwin.com-prod`

-   Changed order of area configuration locations. Thus configs are loaded and merged in this order:
    1. `~/Areas/{area}/Configuration/{name}.jsonconfig`
    2. `~/Configuration/Defaults/Areas/{area}/{name}.jsonconfig`
    3. `~/Configuration/{label}/Areas/{area}/{name}.jsonconfig`
-   Changed constructor parameter `shallNotThrow` on `ConfigurationModelAttribute` to property.
-   Registering `RegistrationByAttributeModule` as the first one so that other modules can override registered components.
-   Removed `nb-NO` and `ca-ES` languages in `bwin.com` mobile config.

### Vanilla 4.3.10.8890

2015-02-16

-   Changed M2 language switcher to support styling on M2 Premium
-   `m2Referrer` rurl was pointing to wrong url if there was a redirect between subdomains.
-   Added `ICurrentPrincipalProvider`, `Func<IPrincipal>` and `Func<IIdentity>` to be able to handle current user correctly also in async code.
-   Disabled Omniture tracking in `giocodigitale.it` mobile config.
-   Fixed HTML attributes on links in M2 footer.

### Vanilla 4.3.9.8877

Feb 10 2015

-   Added possibility for clients to define external filter providers via `FilterSyntaxValidatorProvider.CreateValidator(...)`. Also, the `IsFromNativeApplication` method was added to the `RequestFilterProvider`. By default it returns false but can be overriden by externally injected implementation of `INativeApplicationResolver`.
-   m2: Added `authenticated`, `unauthenticated` and `has-workflow` CSS classes for M2 pages. They can be used to show or hide parts of the page according to label specification (e.g. hide header on `premium.com`).
-   m2: Added changes to controllers and services for the common part between casino and portal. The state of the overlay is in `$rootScope.overlayActive` variable now .
-   In case of critical error on the client side, users are redirected to the critical error page. Page can be customized by changing the view in `Views/CriticalError/Index.cshtml`, or one can set an other page by providing `criticalErrorPage` to `configureModule` function. **NOTE:** errors are handled globally by default now. So unhandled errors outside of angular app will be caught too.
-   Added trailing slash to all URL paths requested from `ICommonDataService`
-   m2: Title for an M2 page is taken from label root node in Sitecore (DefaultPageTitle) and if empty, falls back to hostname
-   m2: If OmnitureTracking.jsonconfig is missing or `Campaign` or `TrackingImageFormat` values are empty omniture tracking is disabled.
-   Refreshing whole user state row including related menu on unauthorized ajax request.
-   Included `jquery.bwin.ajaxauth.js` in `core.bundle.js`.

### Vanilla 4.3.8.8838

2015-01-30

-   Moved cigarette pack warning to footer. Header cigarette pack warning was removed . **Italian labels should be updated and styled accordingly.**
-   Displaying language native name instead of ISO code in m2 language switcher. Also shuffled HTML elements a little bit to ease styling.
-   Use alphabetical sequence for languages in switcher on `premium.com`.
-   Bonus post login popup improvements and fixes were moved to Vanilla.
-   Changed order of device redirect filters (old and new) to run as authorize filter.
-   Improved `ServiceException.Wrap()` method so that it can read same `WebException` multiple times correctly.
-   Routes property type on `MobileConfigurationBase` changed to `Dictionary`.
-   Critical javascript errors are now handled so that user cant stuck in an error loop. Redirect page can be set to be redirected to in case of a critical error.
-   Allowed cross-site requests to diagnostic pages (e.g. `/health/report`) so that they can be accessed from monitoring tools.

### Vanilla 4.3.7.8771

2015-01-14

-   Upgraded AngularJS 1.3.2 -> 1.3.8
-   Diagnostic page for displaying contents of the website file was added e.g. `/health/file?path=srvadm/version.xml`. Only files whitelisted in the `label/Areas/App/HealthFiles.jsonconfig` will be served.
-   Info provided by PosAPI HealthCheck was improved to include more details (error code and message).
-   Remove portugues langauge from `partypoker.com` - Also set as offline culture for `partypoker` and `bwin.com`
-   LastVisitor cookie used to store last login name can be configured to take its value from a claim instead of `User.Identity.Name`. This makes sense on some labels e.g. `giocodigitale.it` where email is used for users to login. Configuration is located at `label/Framework/Web/LastVisitor.jsonconfig`.
-   Client side errors now include the "cause" field.
-   Changed m2 language switcher to support multiple languages. It displays them in a popup as a list. **Styling is required.**
-   Created `Defaults` label configuration which contains all jsonconfigs and values shared between labels.
-   Removed `m2.LanguageCtrl` with everything related because it was not used anywhere.
-   Added `Bwin.MobileConfig.premium.com`.
-   Updated endpoints in `Caching.jsonconfig`.

### Vanilla 4.3.6.8710

2014-12-23

-   m2: Added placeholder to show "cigarette warning" in the header(`ClientBootstrap.cshtml`). Content should be added to `Header/TopmostMessages` folder.
-   Removed validation of country code parameter in `Bwin.Vanilla.ServiceClients.Services.ICommonDataService`
-   Fixed: - Language switcher wrong url generation for public pages. - User doesnt stuck in limbo state, if `user` is `null` or `undefined` ( happens during platform maintenance issues ). - `ErrorData` format on both client and server match to prevent serialization errors with `argument` property (chrome 15 specific)

### Vanilla 4.3.5.8685

2014-12-12

-   Added new nuget package `Bwin.Vanilla.Content.FilterValidation` to be used by Sitecore team to validate content filters. Entry point is property `FilterSyntaxValidatorProvider.Validator`.
-   Fixed:
    -   Wrong escaping of string literals (especially regular expressions) in Sitecore content filters.
    -   Serialization of `ServiceException` with empty `ErrorValues` to distributed cache.

###Vanilla 4.3.4.8665

2014-12-04

-   Portuguese language was removed from bwin.com for desktop and mobile.
-   Removed or hidden classes related to old content filter infrastructure.
-   Configuration defaults can be put into `Configuration/Defaults` folder. This will allow to have defaults, taht can be overriden in label specific configuration. For more info refer to our [documentation](http://docs.vanilla.intranet/configuration-system.html)

### Vanilla 4.3.3.8640

2014-11-26

-   Fixed:
    -   Post login dialog causes redirect loop on premium
    -   In case of wrong username or password `IClaimsService.Login()` throws `ServiceException.ErrorCode = 0` instead of `600`.
-   Logging _security token expiration_ only as info.

### Vanilla 4.3.2.8636

2014-11-19

-   Upgraded angular 1.2.24 -> 1.3.2. Read [Angular release notes](http://angularjs.blogspot.co.at/2014/10/angularjs-130-superluminal-nudge.html) and follow [migration instructions](https://docs.angularjs.org/guide/migration#migrating-from-1-2-to-1-3).
-   Extended Sitecore content generator to support loading of templates from multiple paths.
    -   You can specify multiple paths in your `.buildproj` separated by semicolon e.g. `<TemplatePath>/Vanilla/Framework;/Vanilla/Portal</TemplatePath>`
    -   `ContentConfiguration.TemplatePath` was changed to `TemplatePaths`. Thus `Content.jsonconfig` files were adapted.
-   Added `m2Currency` filter for formatting numbers as currency according to Vanilla conventions.
-   Handling `TimeoutException` in `IMailService`.
-   Updated:
    -   Castle.Core 3.3.1 -> 3.3.3
    -   Glimpe.AspNet 1.9.1 -> 1.9.2

### Vanilla 4.3.1.8606

2014-11-11

-   m2: Added conditional class `first-time-visit` on `<html>` element. Can be used to emphasis some parts (e.g. register button) on first visit.
-   Fixed conflict between content dialog and post-login popup which is more important.
-   Changed formatting of negative currency numbers in English culture. For `-123` and Euro method `FormatCurrency()` now returns `-123.00 Eur` instead of previous `(123.00 Eur)`.
-   Added placeholders for content messages in `DefaultLayout.cshtml`:
    -   App-v1.0/Header/Messages
    -   App-v1.0/Footer/Messages
    -   App-v1.0/Footer/Disclaimers
-   Currently no support for https for partypoker.com tracking images, thus it was disabled.
-   Fixed: After removing a cookie (setting its expiration to the past), `ICookieHandler.GetValue()` still returns previous value.
-   Extended `ICookieHandler` to take default values from `CookieConfiguration`. **Original behavior is slightly broken.**
-   Added `RegisterServiceAttribute` for easier registration of singleton services to Autofac.
-   Changed AppFabric implementation of `ObjectCache` so that it does not throw an exception in case of timeout
-   Changed log levels for various exceptions so that logs are not flooded with useless information.
-   Added `ServiceException.HttpCode` property
-   Deprecated `ServiceException(Exception)` constructor. Extended `ServiceException.Wrap()` methods which should be used instead.

### Version 4.3.0.8571

2014-11-04

**BREAKING CHANGES:**

-   Upgrade from .NET 4.5 to .NET 4.5.2.8571
-   Upgrade from MVC4 to MVC5

For more details on how to upgrade follow [this guide](http://faq.vanilla.intranet/1857/How-to-upgrade-to-MVC5)
