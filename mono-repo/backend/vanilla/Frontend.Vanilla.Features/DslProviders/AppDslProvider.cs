using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Theming;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Frontend.Vanilla.ServiceClients.Services.Common;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="IAppDslProvider" /> for ASP.NET 4 apps.
/// </summary>
internal sealed class AppDslProvider(
    IEnvironmentProvider envProvider,
    ICurrentProductResolver currentProductResolver,
    ILanguageService languageService,
    IHttpContextAccessor httpContextAccessor,
    IThemeResolver themeResolver,
    IPosApiCommonService posApiCommonService)
    : IAppDslProvider
{
    public string Environment => envProvider.Environment;
    public bool IsProduction => envProvider.IsProduction;
    public string Label => envProvider.CurrentLabel;
    public string Product => currentProductResolver.Product;
    public string DefaultCulture => languageService.Default.Culture.Name;
    public string DefaultCultureToken => languageService.Default.RouteValue;

    public string Context()
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        var value = httpContext.Request.Headers.GetValue(HttpHeaders.XAppContext).ToString();

        return value.IsNullOrEmpty() ? "default" : value;
    }

    public string Theme => themeResolver.GetTheme();

    public async Task<string> GetPlatformProductNameAsync(ExecutionMode mode)
    {
        var info = await posApiCommonService.GetClientInformationAsync(mode.AsyncCancellationToken ?? CancellationToken.None);

        return info?.ProductId ?? string.Empty;
    }
}
