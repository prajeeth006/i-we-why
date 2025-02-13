using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.ContentMessages;

internal static class ContentMessagesServices
{
    public static void AddContentMessagesFeature(this IServiceCollection services)
    {
        services.AddSingleton<IClosedContentMessagesCookie, ClosedContentMessagesCookie>();
        services.AddSingleton<IContentMessagesLoader, ContentMessagesLoader>();
    }

    public static void AddContentMessagesFeatureSfapi(this IServiceCollection services)
    {
        services.AddSingleton<IContentMessagesService, ContentMessagesService>();
    }
}
