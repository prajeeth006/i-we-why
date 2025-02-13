using Frontend.Vanilla.Core.DependencyInjection.Decorator;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.RestMocks.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.RestMocks;

public static class RestMocksServices
{
    public static IServiceCollection AddRestMocks(this IServiceCollection services)
    {
        services.AddSingleton<RestResponseMocker>();
        services.AddSingleton<IRestMocker, RestMocker>();
        services.AddSingletonWithDecorators<IRestClient, RestClient>(b => b
            .DecorateBy<MockedRestClient>()
            .DecorateBy<TracedRestClient>());

        return services;
    }
}
