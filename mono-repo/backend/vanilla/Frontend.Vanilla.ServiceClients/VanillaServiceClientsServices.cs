using System;
using System.Linq;
using System.ServiceModel;
using Frontend.Vanilla.Core;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.DependencyInjection.Decorator;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Frontend.Vanilla.ServiceClients.Infrastructure.Diagnostics;
using Frontend.Vanilla.ServiceClients.Infrastructure.Execution;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Security.Claims;
using Frontend.Vanilla.ServiceClients.Security.Claims.Local;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Account.AbuserInformation;
using Frontend.Vanilla.ServiceClients.Services.Account.AssociatedAccounts;
using Frontend.Vanilla.ServiceClients.Services.Account.CashierStatuses;
using Frontend.Vanilla.ServiceClients.Services.Account.CommunicationSettings;
using Frontend.Vanilla.ServiceClients.Services.Account.ConnectedAccounts;
using Frontend.Vanilla.ServiceClients.Services.Account.MohDetails;
using Frontend.Vanilla.ServiceClients.Services.Account.Password;
using Frontend.Vanilla.ServiceClients.Services.Account.ProductLicenseInfos;
using Frontend.Vanilla.ServiceClients.Services.Account.RegistrationDates;
using Frontend.Vanilla.ServiceClients.Services.Account.SegmentationGroups;
using Frontend.Vanilla.ServiceClients.Services.Account.SofStatus;
using Frontend.Vanilla.ServiceClients.Services.Account.ValidateEmailVerificationCode;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Authentication.AddWorkflowData;
using Frontend.Vanilla.ServiceClients.Services.Authentication.ArcSessionSummary;
using Frontend.Vanilla.ServiceClients.Services.Authentication.CurrentSessions;
using Frontend.Vanilla.ServiceClients.Services.Authentication.LastSessions;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Execution;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Logout;
using Frontend.Vanilla.ServiceClients.Services.Authentication.OTP;
using Frontend.Vanilla.ServiceClients.Services.Authentication.PendingActions;
using Frontend.Vanilla.ServiceClients.Services.Authentication.SessionLimits;
using Frontend.Vanilla.ServiceClients.Services.Authentication.ValidateTokens;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Common.ApplicationInfo;
using Frontend.Vanilla.ServiceClients.Services.Common.Cities;
using Frontend.Vanilla.ServiceClients.Services.Common.ClientInfo;
using Frontend.Vanilla.ServiceClients.Services.Common.Countries;
using Frontend.Vanilla.ServiceClients.Services.Common.CountryAreas;
using Frontend.Vanilla.ServiceClients.Services.Common.CountryMobilePredials;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;
using Frontend.Vanilla.ServiceClients.Services.Common.HistoricalCountries;
using Frontend.Vanilla.ServiceClients.Services.Common.Inventory;
using Frontend.Vanilla.ServiceClients.Services.Common.Languages;
using Frontend.Vanilla.ServiceClients.Services.Common.List;
using Frontend.Vanilla.ServiceClients.Services.Common.SecurityQuestions;
using Frontend.Vanilla.ServiceClients.Services.Common.Timezones;
using Frontend.Vanilla.ServiceClients.Services.Content;
using Frontend.Vanilla.ServiceClients.Services.Content.BettingTranslations;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.BonusBalance;
using Frontend.Vanilla.ServiceClients.Services.Crm.CampaignDatas;
using Frontend.Vanilla.ServiceClients.Services.Crm.Gamification;
using Frontend.Vanilla.ServiceClients.Services.Crm.InvitationUrl;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyPoint;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyWeeklyPoint;
using Frontend.Vanilla.ServiceClients.Services.Crm.MappedQuery;
using Frontend.Vanilla.ServiceClients.Services.Crm.PlayerAttributes;
using Frontend.Vanilla.ServiceClients.Services.Crm.PlayerGamingDeclaration;
using Frontend.Vanilla.ServiceClients.Services.Crm.ReferredFriends;
using Frontend.Vanilla.ServiceClients.Services.Crm.SignUpBonuses;
using Frontend.Vanilla.ServiceClients.Services.Crm.TrackerUrl;
using Frontend.Vanilla.ServiceClients.Services.Crm.UserFlags;
using Frontend.Vanilla.ServiceClients.Services.Crm.UserScrub;
using Frontend.Vanilla.ServiceClients.Services.Crm.ValueSegments;
using Frontend.Vanilla.ServiceClients.Services.Crm2;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation;
using Frontend.Vanilla.ServiceClients.Services.GeoLocation.MappedLocations;
using Frontend.Vanilla.ServiceClients.Services.Kyc;
using Frontend.Vanilla.ServiceClients.Services.Kyc.Document;
using Frontend.Vanilla.ServiceClients.Services.Mail;
using Frontend.Vanilla.ServiceClients.Services.Manager;
using Frontend.Vanilla.ServiceClients.Services.MyBets;
using Frontend.Vanilla.ServiceClients.Services.MyBets.CustomerHasBets;
using Frontend.Vanilla.ServiceClients.Services.Notification;
using Frontend.Vanilla.ServiceClients.Services.Notification.EdsGroup;
using Frontend.Vanilla.ServiceClients.Services.Notification.InboxMessages;
using Frontend.Vanilla.ServiceClients.Services.Notification.OfferStatuses;
using Frontend.Vanilla.ServiceClients.Services.Offers;
using Frontend.Vanilla.ServiceClients.Services.Promohub;
using Frontend.Vanilla.ServiceClients.Services.Promohub.BonusAward;
using Frontend.Vanilla.ServiceClients.Services.Registration.MobileAvailability;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.Affordability;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ArcPlayBreaks;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.DepositLimits;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerArea;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.PlayerLimits;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.RealityCheck;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ScreenTime;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.SelfExclusion;
using Frontend.Vanilla.ServiceClients.Services.Retail;
using Frontend.Vanilla.ServiceClients.Services.Retail.PayoutValueTicket;
using Frontend.Vanilla.ServiceClients.Services.Retail.TerminalSession;
using Frontend.Vanilla.ServiceClients.Services.Retail.ValueTicket;
using Frontend.Vanilla.ServiceClients.Services.Upload;
using Frontend.Vanilla.ServiceClients.Services.Upload.CustomerDocDetails;
using Frontend.Vanilla.ServiceClients.Services.Upload.DocumentUploadStatus;
using Frontend.Vanilla.ServiceClients.Services.Wallet;
using Frontend.Vanilla.ServiceClients.Services.Wallet.AverageDeposit;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Frontend.Vanilla.ServiceClients.Services.Wallet.BankAccountInfo;
using Frontend.Vanilla.ServiceClients.Services.Wallet.CustomerNetDeposit;
using Frontend.Vanilla.ServiceClients.Services.Wallet.GetCurfewStatus;
using Frontend.Vanilla.ServiceClients.Services.Wallet.NetLossInfo;
using Frontend.Vanilla.ServiceClients.Services.Wallet.PlayerActivitySummary;
using Frontend.Vanilla.ServiceClients.Services.Wallet.PlayerWagerSession;
using Frontend.Vanilla.ServiceClients.Services.Wallet.ProfitLossSummary;
using Frontend.Vanilla.ServiceClients.Services.Wallet.QuickDeposit;
using Frontend.Vanilla.ServiceClients.Services.Wallet.TransactionHistory;
using Frontend.Vanilla.ServiceClients.Services.Wallet.UserSessionFundSummary;
using Frontend.Vanilla.ServiceClients.Services.Wallet.UserTransactionSummary;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Frontend.Vanilla.ServiceClients;

/// <summary>
/// Vanilla service clients.
/// </summary>
public static class VanillaServiceClientsServices
{
    /// <summary>
    /// Adds services related to Vanilla service clients.
    /// Also adds dependency <see cref="VanillaCoreServices.AddVanillaCore" />.
    /// </summary>
    public static IServiceCollection AddVanillaServiceClients(this IServiceCollection services)
    {
        if (!services.TryMarkAsLoaded("Vanilla.ServiceClients"))
            return services;

        // Dependencies
        services.AddVanillaCore();

        // Infrastructure
        services.AddConfigurationWithBuilder<IServiceClientsConfiguration, ServiceClientsConfigurationBuilder>(ServiceClientsConfigurationBuilder.FeatureName);
        services.AddConfiguration<IBettingServiceClientsConfiguration, BettingServiceClientsConfiguration>(BettingServiceClientsConfiguration.FeatureName);
        services.AddConfiguration<IExtendedServiceClientsConfiguration, ExtendedServiceClientsConfiguration>(ExtendedServiceClientsConfiguration.FeatureName);
        services.AddSingleton<IServiceClientsBaseConfiguration>(p => p.GetRequiredService<IServiceClientsConfiguration>());
        services.AddSingletonWithDecorators<IPosApiRestClient, PosApiRestClient>(p => p.DecorateBy<DisabledPosApiRestClient>());
        services.AddSingleton<IPosApiRestRequestFactory, PosApiRestRequestFactory>();
        services.AddSingleton<IPosApiRestRequestBuilder, PosApiRestRequestBuilder>();
        services.AddSingleton<IPosApiRestRequestBuilder, BettingApiRestRequestBuilder>();
        services.AddSingleton<IPosApiRestRequestBuilder, ExtendedApiRestRequestBuilder>();
        services.AddSingleton<IGetDataServiceClient, GetDataServiceClient>();
        services.AddSingleton<IPosApiRequestSemaphores, PosApiRequestSemaphores>();

        // Caching infrastructure
        services.AddSingleton<IPosApiDataCache>(p =>
        {
            var cache = p.GetRequiredService<PosApiDataCache>();
            var interceptedCache = p.Create<PosApiDataCacheCallsInterceptor>(cache);

            return p.Create<PosApiDataCacheIsolation>(interceptedCache);
        });
        services.AddSingleton<PosApiDataCache>(); // No decoration b/c we use it for diagnostics below
        services.AddSingleton<IStaticDataCache, StaticDataCache>();
        services.AddSingleton<IUserDataCache, UserDataCache>();
        services.AddSingleton<UserDataContainerManager>();
        services.AddSingleton<IUserDataContainerManager>(p => p.GetRequiredService<UserDataContainerManager>());
        services.AddSingleton<ICurrentContextSwitchHandler>(p => p.GetRequiredService<UserDataContainerManager>());
        services.TryAddSingleton<IPosApiCacheDiagnostics, PosApiCacheDiagnostics>();
        services.AddSingleton<InterceptedCacheCalls>();

        // Security
        services.TryAddSingleton<ICurrentUserAccessor, SingleThreadedCurrentUserAccessor>();
        services.AddSingleton<IClaimsCache, ClaimsCache>();
        services.TryAddSingleton<IClaimsCacheTime, ClaimsCacheTime>();
        services.AddSingleton<IUserTimeTransformer, ClaimsUserTimeTransformer>();

        // Diagnostics
        services.AddSingleton<ITrafficHealthState, TrafficHealthState>();
        services.AddSingleton<IHealthCheck, PosApiHealthCheck>();
        services.AddSingleton<IDiagnosticInfoProvider, PosApiParametersDiagnosticProvider>();

        foreach (var dataType in Enum<PosApiDataType>.Values)
            services.AddSingleton<IDiagnosticInfoProvider>(p => p.Create<PosApiCachedDataDiagnosticProvider>(dataType, p.GetRequiredService<PosApiDataCache>()));

        // Authentication service
        services.AddFacadeFor<IClaimsService>();
        services.AddSingleton<IPosApiAuthenticationService>(p => p.GetRequiredService<IPosApiAuthenticationServiceInternal>());
        services.AddFacadeFor<IPosApiAuthenticationServiceInternal>();
        services.AddSingleton<ILoginServiceClient, LoginServiceClient>();
        services.AddSingleton<IPosApiClaimsServiceClient, PosApiClaimsServiceClient>();
        services.AddSingleton<IClaimsServiceClient, ClaimsServiceClient>();
        services.AddSingleton<IRefreshTokenServiceClient, RefreshTokenServiceClient>();
        services.AddSingleton<ICurrentSessionServiceClient, CurrentSessionServiceClient>();
        services.AddSingleton<ILogoutServiceClient, LogoutServiceClient>();
        services.AddSingleton<ILastSessionServiceClient, LastSessionServiceClient>();
        services.AddSingleton<IAddWorkflowDataServiceClient, AddWorkflowDataServiceClient>();
        services.AddSingleton<IPendingActionsServiceClient, PendingActionsServiceClient>();
        services.AddSingleton<IVerificationStatusServiceClient, VerificationStatusServiceClient>();
        services.AddSingleton<IValidateTokensServiceClient, ValidateTokensServiceClient>();
        services.AddSingleton<ISessionSummaryServiceClient, SessionSummaryServiceClient>();
        services.AddSingleton<ISessionLimitsServiceClient, SessionLimitsServiceClient>();

        // Promohub Service
        services.AddSingleton<IPosApiBonusAwardServiceClient, PosApiBonusAwardServiceClient>();
        services.AddFacadeFor<IPosApiPromohubServiceInternal>();

        // Authentication service utilities
        services.AddSingleton<ILoginExecutor, LoginExecutor>();
        services.AddSingleton(p => p.GetServices<LocalClaimsProvider>().Cast<ILocalClaimsProvider>());
        services.AddSingleton<ILocalClaimsProviders, LocalClaimsProviders>();
        services.AddSingleton<ILocalClaimsResolver, LocalClaimsResolver>();
        services.AddSingleton<IGlobalClaimInfos, GlobalClaimInfos>();
        services.AddSingleton<IPostLoginValuesManager, PostLoginValuesManager>();
        services.AddSingleton<IPosApiClaimsDeserializer, PosApiClaimsDeserializer>();
        services.AddSingleton<IClaimsUserManager, ClaimsUserManager>();
        services.AddSingleton<IClaimsUserFactory, ClaimsUserFactory>();
        services.AddSingleton<ILoginFilter, CacheBalanceLoginFilter>();
        services.AddSingleton<ILoginFilter, CacheLoyalyProfileLoginFilter>();

        // Wallet service
        services.AddSingleton<IPosApiWalletService>(p => p.GetRequiredService<IPosApiWalletServiceInternal>());
        services.AddFacadeFor<IPosApiWalletServiceInternal>();
        services.AddSingleton<IBalanceServiceClient, BalanceServiceClient>();
        services.AddSingleton<ITransferBalanceServiceClient, TransferBalanceServiceClient>();
        services.AddSingleton<IBankAccountInfoServiceClient, BankAccountInfoServiceClient>();
        services.AddSingleton<IPlayerActivitySummaryServiceClient, PlayerActivitySummaryServiceClient>();
        services.AddSingleton<IGetCurfewStatusServiceClient, GetCurfewStatusServiceClient>();
        services.AddSingleton<IQuickDepositServiceClient, QuickDepositServiceClient>();
        services.AddSingleton<ITransactionHistoryServiceClient, TransactionHistoryServiceClient>();
        services.AddSingleton<IUserTransactionSummaryServiceClient, UserTransactionSummaryServiceClient>();
        services.AddSingleton<ICustomerNetDepositServiceClient, CustomerNetDepositServiceClient>();
        services.AddSingleton<INetLossInfoServiceClient, NetLossInfoServiceClient>();
        services.AddSingleton<IAverageDepositServiceClient, AverageDepositServiceClient>();
        services.AddSingleton<INetLossInfoV2ServiceClient, NetLossInfoV2ServiceClient>();
        services.AddSingleton<IProfitLossSummaryServiceClient, ProfitLossSummaryServiceClient>();
        services.AddSingleton<ISessionFundSummaryServiceClient, SessionFundSummaryServiceClient>();
        services.AddSingleton<ITourneyTokenBalanceServiceClient, TourneyTokenBalanceServiceClient>();
        services.AddSingleton<IPlayerActiveWagerServiceClient, PlayerActiveWagerServiceClient>();

        // CRM service
        services.AddSingleton<IPosApiCrmService>(p => p.GetRequiredService<IPosApiCrmServiceInternal>());
        services.AddFacadeFor<IPosApiCrmServiceInternal>();
        services.AddSingleton<ISignUpBonusServiceClient, SignUpBonusServiceClient>();
        services.AddSingleton<ILoyaltyProfileServiceClient, LoyaltyProfileServiceClient>();
        services.AddSingleton<IBasicLoyaltyProfileServiceClient, BasicLoyaltyProfileServiceClient>();
        services.AddSingleton<IFutureLoyaltyProfileServiceClient, FutureLoyaltyProfileServiceClient>();
        services.AddSingleton<ITrackerUrlServiceClient, TrackerUrlServiceClient>();
        services.AddSingleton<IMappedQueryServiceClient, MappedQueryServiceClient>();
        services.AddSingleton<IUserScrubServiceClient, UserScrubServiceClient>();
        services.AddSingleton<IGamificationServiceClient, GamificationServiceClient>();
        services.AddSingleton<ILoyaltyWeeklyPointsServiceClient, LoyaltyWeeklyPointsServiceClient>();

        services.AddSingleton<IValueSegmentServiceClient, ValueSegmentServiceClient>();
        services.AddSingleton<ICampaignDataServiceClient, CampaignDataServiceClient>();
        services.AddSingleton<ILoyaltyPointsServiceClient, LoyaltyPointsServiceClient>();
        services.AddSingleton<IBonusBalanceServiceClient, BonusBalanceServiceClient>();
        services.AddSingleton<IUserFlagsServiceClient, UserFlagsServiceClient>();
        services.AddSingleton<IPlayerGamingDeclarationServiceClient, PlayerGamingDeclarationServiceClient>();
        services.AddSingleton<IInvitationUrlServiceClient, InvitationUrlServiceClient>();
        services.AddSingleton<IReferredFriendsServiceClient, ReferredFriendsServiceClient>();
        services.AddSingleton<IPlayerAttributesServiceClient, PlayerAttributesServiceClient>();
        services.AddConfiguration<ILoyaltyConfiguration, LoyaltyConfiguration>(featureName: "VanillaFramework.Features.Loyalty");

        // Account service
        services.AddSingleton<IPosApiAccountService>(p => p.GetRequiredService<IPosApiAccountServiceInternal>());
        services.AddFacadeFor<IPosApiAccountServiceInternal>();
        services.AddSingleton<ISegmentationGroupsServiceClient, SegmentationGroupsServiceClient>();
        services.AddSingleton<IAssociatedAccountsServiceClient, AssociatedAccountsServiceClient>();
        services.AddSingleton<IConnectedAccountsServiceClient, ConnectedAccountsServiceClient>();
        services.AddSingleton<IRegistrationDateServiceClient, RegistrationDateServiceClient>();
        services.AddSingleton<ICommunicationSettingsServiceClient, CommunicationSettingsServiceClient>();
        services.AddSingleton<ICashierStatusServiceClient, CashierStatusServiceClient>();
        services.AddSingleton<IPasswordServiceClient, PasswordServiceClient>();
        services.AddSingleton<IValidateEmailVerificationCodeServiceClient, ValidateEmailVerificationCodeServiceClient>();
        services.AddSingleton<IProductLicenseInfosServiceClient, ProductLicenseInfosServiceClient>();
        services.AddSingleton<IMohDetailsServiceClient, MohDetailsServiceClient>();
        services.AddSingleton<IBonusAbuserInformationServiceClient, BonusAbuserInformationServiceClient>();
        services.AddSingleton<ISofStatusDetailsServiceClient, SofStatusDetailsServiceClient>();

        // Common service
        services.AddSingleton<IPosApiCommonService>(p => p.GetRequiredService<IPosApiCommonServiceInternal>());
        services.AddFacadeFor<IPosApiCommonServiceInternal>();
        services.AddSingleton<ICitiesServiceClient, CitiesServiceClient>();
        services.AddSingleton<IClientInformationServiceClient, ClientInformationServiceClient>();
        services.AddSingleton<ICountriesServiceClient, CountriesServiceClient>();
        services.AddSingleton<ICountryAreasServiceClient, CountryAreasServiceClient>();
        services.AddSingleton<ICurrenciesServiceClient, CurrenciesServiceClient>();
        services.AddSingleton<ILanguagesServiceClient, LanguagesServiceClient>();
        services.AddSingleton<IListServiceClient, ListServiceClient>();
        services.AddSingleton<ICountryMobilePredialsServiceClient, CountryMobilePredialsServiceClient>();
        services.AddSingleton<ITimezonesServiceClient, TimezonesServiceClient>();
        services.AddSingleton<ISecurityQuestionsServiceClient, SecurityQuestionsServiceClient>();
        services.AddSingleton<IHistoricalCountriesServiceClient, HistoricalCountriesServiceClient>();
        services.AddSingleton<IApplicationInformationServiceClient, ApplicationInformationServiceClient>();
        services.AddSingleton<IInventoryServiceClient, InventoryServiceClient>();

        // Notification service
        services.AddSingleton<IPosApiNotificationService>(p => p.GetRequiredService<IPosApiNotificationServiceInternal>());
        services.AddFacadeFor<IPosApiNotificationServiceInternal>();
        services.AddSingleton<IOfferStatusServiceClient, OfferStatusServiceClient>();
        services.AddSingleton<IInboxMessageCountServiceClient, InboxMessageCountServiceClient>();
        services.AddSingleton<IInboxMessagesServiceClient, InboxMessagesServiceClient>();
        services.AddSingleton<ISingleInboxMessageServiceClient, SingleInboxMessageServiceClient>();
        services.AddSingleton<IInboxMessageStatusServiceClient, InboxMessageStatusServiceClient>();
        services.AddSingleton<IEdsGroupStatusServiceClient, EdsGroupStatusServiceClient>();

        // Content service
        services.AddSingleton<IPosApiContentService, PosApiContentService>();
        services.AddSingleton<IBettingTranslationsServiceClient, BettingTranslationsServiceClient>();

        // Responsible gaming service
        services.AddSingleton<IPosApiResponsibleGamingService>(p => p.GetRequiredService<IPosApiResponsibleGamingServiceInternal>());
        services.AddFacadeFor<IPosApiResponsibleGamingServiceInternal>();
        services.AddSingleton<IRealityCheckServiceClient, RealityCheckServiceClient>();
        services.AddSingleton<IPlayerLimitsServiceClient, PlayerLimitsServiceClient>();
        services.AddSingleton<IAffordabilityServiceClient, AffordabilityServiceClient>();
        services.AddSingleton<IScreenTimeServiceClient, ScreenTimeServiceClient>();
        services.AddSingleton<ISelfExclusionServiceClient, SelfExclusionServiceClient>();
        services.AddSingleton<IDepositLimitsServiceClient, DepositLimitsServiceClient>();
        services.AddSingleton<IPlayerAreaServiceClient, PlayerAreaServiceClient>();
        services.AddSingleton<IPlayBreakServiceClient, PlayBreakServiceClient>();

        // Registration service
        services.AddSingleton<IMobileAvailabilityServiceClient, MobileAvailabilityServiceClient>();

        // Retail service
        services.AddFacadeFor<IPosApiRetailServiceInternal>();
        services.AddSingleton<IValueTicketServiceClient, ValueTicketServiceClient>();
        services.AddSingleton<IPayoutValueTicketServiceClient, PayoutValueTicketServiceClient>();
        services.AddSingleton<ITerminalSessionServiceClient, TerminalSessionServiceClient>();

        // Upload service
        services.AddFacadeFor<IPosApiUploadServiceInternal>();
        services.AddSingleton<ICustomerDocDetailsServiceClient, CustomerDocDetailsServiceClient>();
        services.AddSingleton<IDocumentUploadStatusServiceClient, DocumentUploadStatusServiceClient>();

        // GeoLocation
        services.AddFacadeFor<IPosApiGeoLocationService>();
        services.AddSingleton<IMappedLocationServiceClient, MappedLocationServiceClient>();

        // Kyc service
        services.AddFacadeFor<IPosApiKycServiceInternal>();
        services.AddSingleton<IDocumentVerificationOptionsServiceClient, DocumentVerificationOptionsServiceClient>();

        // LABELHOST TODO update to same style as in vanilla
        services.AddSingleton<IPosApiOffersServiceClient, PosApiOffersServiceClient>();
        services.AddSingleton<IKycServiceClient, PosApiKycServiceClient>();
        services.AddSingleton<IKycService, PosApiKycService>();
        services.AddSingleton<ICrmServiceClient, PosApiCrmServiceClient>();
        services.AddSingleton<ICrmService, PosApiCrmService>();

        // Kyc service
        services.AddFacadeFor<IPosApiMyBetsService>();
        services.AddSingleton<ICustomerHasBetsServiceClient, CustomerHasBetsServiceClient>();

        // Mail service
        services.AddSingleton<IMailService>(p => p.Create<MailService<EmailServicePortClient>>());
        services.AddSingleton<Func<EmailServicePortClient>>(p =>
        {
            var mailConfig = p.GetRequiredService<IMailConfiguration>();

            return () => new EmailServicePortClient(new BasicHttpBinding(), new EndpointAddress(mailConfig.EndpointAddress));
        });
        services.AddConfigurationWithBuilder<IMailConfiguration, MailConfigurationBuilder>(featureName: "VanillaFramework.Services.Mail");

        return services;
    }
}
