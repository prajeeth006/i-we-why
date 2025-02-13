using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Reflection.Delegator;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers;

/// <summary>
/// Fake DSL providers.
/// </summary>
public static class FakeDslProviders
{
    private static readonly IReadOnlyList<Type> ProviderInterfaces =
    [
        typeof(IAppDslProvider),
        typeof(IAssemblyDslProvider),
        typeof(IAuthenticationDslProvider),
        typeof(IBalanceDslProvider),
        typeof(IBettingStatusDslProvider),
        typeof(IBonusBalanceDslProvider),
        typeof(IBonusAwardDslProvider),
        typeof(IDateTimeDslProvider),
        typeof(IBrowserDslProvider),
        typeof(IClaimsDslProvider),
        typeof(ICookiesDslProvider),
        typeof(ICounterDslProvider),
        typeof(ICultureDslProvider),
        typeof(IDeviceDslProvider),
        typeof(IGeoIPDslProvider),
        typeof(IGeolocationDslProvider),
        typeof(IGamificationDslProvider),
        typeof(IKycStatusDslProvider),
        typeof(IDocumentUploadStatusDslProvider),
        typeof(IAffordabilityDslProvider),
        typeof(ILastKnownProductDslProvider),
        typeof(ILicenseInfoDslProvider),
        typeof(IListDslProvider),
        typeof(ILoyalityProfileDslProvider),
        typeof(IMediaDslProvider),
        typeof(INativeApplicationDslProvider),
        typeof(IOfferDslProvider),
        typeof(IPendingActionsDslProvider),
        typeof(IPlayerLimitsDslProvider),
        typeof(IPostLoginValuesDslProvider),
        typeof(IQueryStringDslProvider),
        typeof(IRegistrationDslProvider),
        typeof(IRequestDslProvider),
        typeof(IRequestHeadersDslProvider),
        typeof(IShopDslProvider),
        typeof(ISitecoreDslProvider),
        typeof(ITerminalDslProvider),
        typeof(IUserDslProvider),
        typeof(IUserScrubDslProvider),
        typeof(IUserSummaryDslProvider),
        typeof(ISessionFundSummaryDslProvider),
        typeof(IUserFlagsDslProvider),
        typeof(ITimeDslProvider),
        typeof(ICurrencyDslProvider),
        typeof(IBonusAbuserInformationDslProvider),
        typeof(IMohDetailsDslProvider),
        typeof(ISelfExclusionDslProvider),
        typeof(IDepositLimitsDslProvider),
        typeof(IConnectedAccountsDslProvider),
        typeof(ICurfewStatusDslProvider),
        typeof(IPlayBreakDslProvider),
        typeof(IPlayerAttributesDslProvider),
        typeof(ISofStatusDetailsDslProvider),
        typeof(ITourneyTokenBalanceDslProvider),
        typeof(IEpcotDslProvider),
        typeof(IReferredFriendsDslProvider),
    ];

    /// <summary>
    /// Adds fake implementations of DSL providers.
    /// Useful when you need to validate DSL syntax, but don't need to evaluate it.
    /// This module is not run automatically in Vanilla app.
    /// </summary>
    public static IServiceCollection AddFakeVanillaDslProviders(this IServiceCollection services)
    {
        foreach (var providerInterface in ProviderInterfaces)
            services.TryAddSingleton(providerInterface, _ => FakeProviders.Value[providerInterface]);

        return services;
    }

    private static readonly Lazy<IReadOnlyDictionary<Type, object>> FakeProviders = new (() =>
    {
        var builders = ProviderInterfaces.Select(i => new DelegatorProxyBuilder(i));
        var fakeProxyClasses = RoslynProxy.GenerateClasses(builders);

        return ProviderInterfaces.ToDictionary(i => i, providerInterface =>
        {
            var fakeProxyClass = fakeProxyClasses.Single(providerInterface.IsAssignableFrom);
            var delegator = new LambdaProxyDelegator(m =>
                throw new NotSupportedException($"Fake DSL provider can't evaluate '{m}'. You must add your own implementation of {providerInterface}."));

            return Activator.CreateInstance(fakeProxyClass, delegator)!;
        });
    });
}
