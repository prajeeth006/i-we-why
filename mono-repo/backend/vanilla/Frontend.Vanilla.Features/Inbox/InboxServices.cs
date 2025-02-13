using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.Inbox.ContentProviders;
using Frontend.Vanilla.Features.LazyFeatures;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Inbox;

internal static class InboxServices
{
    public static void AddInboxFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IInboxConfiguration, InboxConfiguration>(InboxConfiguration.FeatureName);
        services.AddSingleton<IInboxContentProvider, InboxOfferContentProvider>();
        services.AddSingleton<IInboxContentProvider, InboxAccountContentProvider>();
        services.AddSingleton<IClientConfigProvider, InboxClientConfigProvider>();
        services.AddSingleton<IInboxMessagesClientValuesProvider, InboxMessagesClientValuesProvider>();
        services.AddSingleton<IHealthCheck, InboxHealthCheck>();
        services.AddSingleton<IFeatureEnablementProvider, InboxFeatureEnablementProvider>();
    }
}
