using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.LoginDuration;

internal interface ILoginDurationProvider
{
    string SlotName { get; }
    string TimeFormat { get; }
    Task<RequiredString?> GetTextAsync(CancellationToken cancellationToken);
}

internal class LoginDurationProvider(ILoginDurationConfiguration loginConfig, IContentService contentService) : ILoginDurationProvider
{
    public const string ContentPath = "App-v1.0/Resources/Messages";
    public const string ListItem = "LoginDuration";

    public string SlotName => loginConfig.SlotName;
    public string TimeFormat => loginConfig.TimeFormat;

    public Task<RequiredString?> GetTextAsync(CancellationToken cancellationToken)
        => contentService
            .GetRequiredStringAsync<IGenericListItem>(ContentPath, r => r.VersionedList[ListItem], cancellationToken).AsNullableResult();
}
