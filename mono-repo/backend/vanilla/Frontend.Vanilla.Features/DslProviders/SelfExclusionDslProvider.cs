using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class SelfExclusionDslProvider(ICurrentUserAccessor currentUserAccessor, IPosApiResponsibleGamingServiceInternal posApiResponsibleGamingServiceInternal)
    : ISelfExclusionDslProvider
{
    public async Task<string> GetCategoryAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
            return string.Empty;

        var result = await posApiResponsibleGamingServiceInternal.GetSelfExclusionDetailsAsync(mode);

        return result.CategoryId ?? string.Empty;
    }

    public async Task<string> GetStartDateAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
            return string.Empty;

        var result = await posApiResponsibleGamingServiceInternal.GetSelfExclusionDetailsAsync(mode);

        var startDate = result.StartDate?.ToUserLocalTime(currentUserAccessor.User).ToString("g");

        return startDate ?? string.Empty;
    }

    public async Task<string> GetEndDateAsync(ExecutionMode mode)
    {
        if (currentUserAccessor.User.Identity.IsNotLoggedIn())
            return string.Empty;

        var result = await posApiResponsibleGamingServiceInternal.GetSelfExclusionDetailsAsync(mode);

        var startDate = result.EndDate?.ToUserLocalTime(currentUserAccessor.User).ToString("g");

        return startDate ?? string.Empty;
    }
}
