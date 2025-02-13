using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Features.Login.ErrorFormatters;

internal static class LoginErrorConverterServices
{
    public static void AddLoginErrorConvertersFeature(this IServiceCollection services)
    {
        services.AddSingleton<ILoginErrorConverter>(p => p.GetRequiredService<IDefaultLoginErrorConverter>());
        services.AddSingleton<IDefaultLoginErrorConverter, DefaultLoginErrorConverter>();
        services.AddSingleton<ITimeSpanLoginErrorConverter, TimeSpanLoginErrorConverter>();
    }
}
