using System;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.Reflection.Delegator;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Affordability;
using Frontend.Vanilla.Features.DeviceAtlas;
using Frontend.Vanilla.Features.DslProviders.Time;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Frontend.Vanilla.ServiceClients.Services.Common.Countries;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.DslProviders;

internal static class DslProvidersServices
{
    public static void AddDslProvidersFeature(this IServiceCollection services)
    {
        services.AddSingleton<IAssemblyDslProvider, AssemblyDslProvider>();
        services.AddSingleton<IAuthenticationDslProvider, AuthenticationDslProvider>();
        services.AddSingleton<IBalanceDslExecutor, BalanceDslExecutor>();
        services.AddSingleton<IBalanceDslProvider, BalanceDslProvider>();
        services.AddSingleton<IBettingStatusDslProvider, BettingStatusDslProvider>();
        services.AddSingleton<IBonusBalanceDslProvider, BonusBalanceDslProvider>();
        services.AddSingleton<ITourneyTokenBalanceDslProvider, TourneyTokenBalanceDslProvider>();
        services.AddSingleton<IBrowserDslProvider, BrowserDslProvider>();
        services.AddSingleton<IClaimsDslProvider, ClaimsDslProvider>();
        services.AddSingleton<ICultureDslProvider, CultureDslProvider>();
        services.AddSingleton<ICurrencyDslProvider, CurrencyDslProvider>();
        services.AddSingleton<IBonusAbuserInformationDslProvider, BonusAbuserInformationDslProvider>();
        services.AddSingleton<ICookiesDslProvider, CookiesDslProvider>();
        services.AddSingleton<ICounterDslProvider, CounterDslProvider>();
        services.AddSingleton<IDateTimeDslProvider, DateTimeDslProvider>();
        services.AddSingleton<IDateTimeDslCalculator, DateTimeDslCalculator>();
        services.AddSingleton<ISessionFundSummaryDslExecutor, SessionFundSummaryDslExecutor>();
        services.AddSingleton<ISessionFundSummaryDslProvider, SessionFundSummaryDslProvider>();
        services.AddSingleton<IGamificationDslProvider, GamificationDslProvider>();

        services.AddSingleton<IGeoIPDslProvider, GeoIpDslProvider>(
            new InjectedArgument(p => new Func<ICountriesServiceClient>(p.GetRequiredService<ICountriesServiceClient>)));

        services.AddSingleton<ILastKnownProductDslProvider, LastKnownProductDslProvider>(
            new InjectedArgument(p => new Func<IContentService>(p.GetRequiredService<IContentService>)));

        services.AddSingleton<ILicenseInfoDslProvider, LicenseInfoDslProvider>();
        services.AddSingleton<IAffordabilityDslProvider, AffordabilityDslProvider>(
            InjectedArgument.CreateFuncArgument<IAffordabilityConfiguration>(),
            InjectedArgument.CreateFuncArgument<IPosApiResponsibleGamingServiceInternal>());

        services.AddSingleton<IListDslProvider, ListDslProvider>();

        services.AddSingleton<ILoyalityProfileDslProvider, LoyalityProfileDslProvider>();
        services.AddSingleton<IOfferDslProvider, OfferDslProvider>();
        services.AddSingleton<IBonusAwardDslProvider, BonusAwardDslProvider>();
        services.AddSingleton<IPendingActionsDslProvider, PendingActionsDslProvider>();
        services.AddSingleton<IPlayerLimitsDslProvider, PlayerLimitsDslProvider>();
        services.AddSingleton<IQueryStringDslProvider, QueryStringDslProvider>();
        services.AddSingleton<IRequestDslRedirector, RequestDslRedirector>();
        services.AddSingleton<IRequestHeadersDslProvider, RequestHeadersDslProvider>();
        services.AddSingleton<IShopDslProvider, ShopDslProvider>(
            InjectedArgument.CreateFuncArgument<IPosApiCommonServiceInternal>());
        services.AddSingleton<ITerminalDslProvider, TerminalDslProvider>();
        services.AddSingleton<IKycStatusDslProvider, KycStatusDslProvider>();
        services.AddSingleton<IDocumentUploadStatusDslProvider, DocumentUploadStatusDslProvider>();
        services.AddSingleton<IConnectedAccountsDslProvider, ConnectedAccountsDslProvider>();
        services.AddSingleton<ICurfewStatusDslProvider, CurfewStatusDslProvider>();
        services.AddSingleton<IPostLoginValuesDslProvider, PostLoginValuesDslProvider>();
        services.AddSingleton<INativeApplicationDslProvider, NativeApplicationDslProvider>();
        services.AddSingleton<ITimeDslProvider, TimeDslProvider>();
        services.AddSingleton<IUserDslProvider, UserDslProvider>();
        services.AddSingleton<IUserScrubDslProvider, UserScrubDslProvider>();
        services.AddSingleton<IUserSummaryDslProvider, UserSummaryDslProvider>();
        services.AddSingleton<IRegistrationDslProvider, RegistrationDslProvider>();
        services.AddSingleton<IRequestDslProvider, RequestDslProvider>();
        services.AddSingleton<IAppDslProvider, AppDslProvider>();
        services.AddSingleton<IDeviceDslProvider, DeviceDslProvider>();
        services.AddSingleton<IUserFlagsDslProvider, UserFlagsDslProvider>();
        services.AddSingleton<IMohDetailsDslProvider, MohDetailsDslProvider>();
        services.AddSingleton<ISelfExclusionDslProvider, SelfExclusionDslProvider>();
        services.AddSingleton<IDepositLimitsDslProvider, DepositLimitsDslProvider>();
        services.AddSingleton<IPlayBreakDslProvider, PlayBreakDslProvider>();
        services.AddSingleton<ISofStatusDetailsDslProvider, SofStatusDetailsDslProvider>();
        services.AddSingleton<IEpcotDslProvider, EpcotDslProvider>();
        services.AddSingleton<ISitecoreDslProvider, SitecoreDslProvider>(
            new InjectedArgument(p => new Func<ISitecoreLinkUrlProvider>(p.GetRequiredService<ISitecoreLinkUrlProvider>)));
        services.AddSingleton<IReferredFriendsDslProvider, ReferredFriendsDslProvider>();
        services.AddSingleton<IPlayerAttributesDslProvider, PlayerAttributesDslProvider>();

        // Helpers
        services.AddSingleton<IDslTimeConverter, DslTimeConverter>();

        // Run compilation on the background to start up the app faster
        var getProxyType = RoslynProxy.EnqueueClassGeneration(new DelegatorProxyBuilder(typeof(IMediaDslProvider)));
        services.AddSingleton(typeof(IMediaDslProvider), _ =>
        {
            var delegator = new LambdaProxyDelegator(_ => throw new NotSupportedException("This can't be called on server."));

            return Activator.CreateInstance(getProxyType(), delegator)!;
        });
    }
}
