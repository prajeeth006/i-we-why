using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Features.ClientConfig;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.UserDocuments;

internal static class UserDocumentsService
{
    public static void AddUserDocumentsFeature(this IServiceCollection services)
    {
        services.AddConfiguration<IUserDocumentsConfiguration, UserDocumentsConfiguration>(UserDocumentsConfiguration.FeatureName);
        services.AddSingleton<IClientConfigProvider, UserDocumentsClientConfigProvider>();
    }
}
