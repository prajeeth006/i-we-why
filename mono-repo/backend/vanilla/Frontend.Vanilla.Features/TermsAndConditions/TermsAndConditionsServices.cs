using Frontend.Vanilla.Core.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.TermsAndConditions;

internal static class TermsAndConditionsServices
{
    public static void AddTermsAndConditionsFeature(this IServiceCollection services)
    {
        services.AddSingleton<ITermsAndConditionsContentProvider, TermsAndConditionsContentProvider>();
        services.AddConfiguration<ITermsAndConditionsConfiguration, TermsAndConditionsConfiguration>(TermsAndConditionsConfiguration.FeatureName);
    }
}
