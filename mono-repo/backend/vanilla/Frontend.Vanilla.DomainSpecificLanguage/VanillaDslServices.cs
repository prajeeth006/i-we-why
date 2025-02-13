using Frontend.Vanilla.Core;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.DependencyInjection;
using Frontend.Vanilla.Core.DependencyInjection.Decorator;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;
using Frontend.Vanilla.DomainSpecificLanguage.Json;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Lexical;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing.Syntactical;
using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.DomainSpecificLanguage.Tracing;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.DomainSpecificLanguage;

/// <summary>
/// Vanilla DSL infrastructure.
/// </summary>
public static class VanillaDslServices
{
    /// <summary>
    /// Adds services related to Vanilla domain specific language.
    /// Also adds dependency <see cref="VanillaCoreServices.AddVanillaCore" />.
    /// </summary>
    public static IServiceCollection AddVanillaDomainSpecificLanguage(this IServiceCollection services)
    {
        if (!services.TryMarkAsLoaded("Vanilla.Dsl"))
            return services;

        // Dependencies
        services.AddVanillaCore();

        // Main API
        services.AddSingletonWithDecorators<IDslCompiler, DslCompiler>(b => b
            .DecorateBy<TracedDslCompiler>()
            .DecorateBy<CachedDslCompiler>());
        services.AddSingleton<IDslSyntaxValidator, DslSyntaxValidator>();
        services.AddSingleton<IPlaceholderCompiler, PlaceholderCompiler>();
        services.AddSingleton<IProviderMembers, ProviderMembers>();
        services.AddSingleton<IProviderMemberAccessorFactory, ProviderMemberAccessorFactory>();

        // Integration with Configuration.DynaCon so that DSL expressions can be used in config
        services.AddSingleton(p => new ConfigurationInstanceJsonConverter(new DslExpressionJsonConverter(p.GetRequiredService<IDslCompiler>)));

        // Providers
        services.AddDslValueProvider<IAppDslProvider>();
        services.AddDslValueProvider<IAssemblyDslProvider>();
        services.AddDslValueProvider<IAuthenticationDslProvider>();
        services.AddDslValueProvider<IBalanceDslProvider>();
        services.AddDslValueProvider<IBettingStatusDslProvider>();
        services.AddDslValueProvider<IBonusBalanceDslProvider>();
        services.AddDslValueProvider<IBonusAwardDslProvider>();
        services.AddDslValueProvider<IDateTimeDslProvider>();
        services.AddDslValueProvider<IBrowserDslProvider>();
        services.AddDslValueProvider<IClaimsDslProvider>();
        services.AddDslValueProvider<ICookiesDslProvider>();
        services.AddDslValueProvider<ICultureDslProvider>();
        services.AddDslValueProvider<ICurrencyDslProvider>();
        services.AddDslValueProvider<IBonusAbuserInformationDslProvider>();
        services.AddDslValueProvider<IDeviceDslProvider>();
        services.AddDslValueProvider<IGamificationDslProvider>();
        services.AddDslValueProvider<IGeoIPDslProvider>();
        services.AddDslValueProvider<IGeolocationDslProvider>();
        services.AddDslValueProvider<IKycStatusDslProvider>();
        services.AddDslValueProvider<IDocumentUploadStatusDslProvider>();
        services.AddDslValueProvider<ILastKnownProductDslProvider>();
        services.AddDslValueProvider<ILicenseInfoDslProvider>();
        services.AddDslValueProvider<IListDslProvider>();
        services.AddDslValueProvider<ILoyalityProfileDslProvider>();
        services.AddDslValueProvider<IMediaDslProvider>();
        services.AddDslValueProvider<INativeApplicationDslProvider>();
        services.AddDslValueProvider<IOfferDslProvider>();
        services.AddDslValueProvider<IPendingActionsDslProvider>();
        services.AddDslValueProvider<IPlayerLimitsDslProvider>();
        services.AddDslValueProvider<IPostLoginValuesDslProvider>();
        services.AddDslValueProvider<IQueryStringDslProvider>();
        services.AddDslValueProvider<IRegistrationDslProvider>();
        services.AddDslValueProvider<IRequestDslProvider>();
        services.AddDslValueProvider<IRequestHeadersDslProvider>();
        services.AddDslValueProvider<IShopDslProvider>();
        services.AddDslValueProvider<ISitecoreDslProvider>();
        services.AddDslValueProvider<ITerminalDslProvider>();
        services.AddDslValueProvider<IUserDslProvider>();
        services.AddDslValueProvider<IUserScrubDslProvider>();
        services.AddDslValueProvider<IUserSummaryDslProvider>();
        services.AddDslValueProvider<ISessionFundSummaryDslProvider>();
        services.AddDslValueProvider<ITimeDslProvider>();
        services.AddDslValueProvider<ICounterDslProvider>();
        services.AddDslValueProvider<IUserFlagsDslProvider>();
        services.AddDslValueProvider<IAffordabilityDslProvider>();
        services.AddDslValueProvider<IMohDetailsDslProvider>();
        services.AddDslValueProvider<ISelfExclusionDslProvider>();
        services.AddDslValueProvider<IDepositLimitsDslProvider>();
        services.AddDslValueProvider<IConnectedAccountsDslProvider>();
        services.AddDslValueProvider<ICurfewStatusDslProvider>();
        services.AddDslValueProvider<IPlayBreakDslProvider>();
        services.AddDslValueProvider<ISofStatusDetailsDslProvider>();
        services.AddDslValueProvider<ITourneyTokenBalanceDslProvider>();
        services.AddDslValueProvider<IEpcotDslProvider>();
        services.AddDslValueProvider<IReferredFriendsDslProvider>();
        services.AddDslValueProvider<IPlayerAttributesDslProvider>();

        // Parsing
        services.AddSingleton<IExpressionTreeParser, ExpressionTreeParser>();
        services.AddSingleton<ILexicalParser, LexicalParser>();
        services.AddSingleton<ISyntaxParser, SyntaxParser>();
        services.AddSingleton<IProviderAccessFactory, ProviderAccessFactory>();
        services.AddSingleton<ILegacySyntaxConverter, LegacySyntaxConverter>();

        return services;
    }
}
