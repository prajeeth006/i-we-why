using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.ReCaptcha;

/// <summary>
/// Resolves reCAPTCHA message which indicates verification failure because of invalid value or sudden enablement of reCAPTCHA protection.
/// Throws if the message is missing or invalid.
/// </summary>
internal interface IVerificationMessageProvider
{
    Task<RequiredString> GetAsync(CancellationToken cancellationToken);
    Task<RequiredString> GetVersionedAsync(ReCaptchaVersion version, CancellationToken cancellationToken);
}

internal sealed class VerificationMessageProvider(IContentService contentService, ILogger<VerificationMessageProvider> log) : IVerificationMessageProvider
{
    private const string ContentPath = "App-v1.0/Resources/Messages";
    private const string ListItem = "ReCaptchaVerification";

    public Task<RequiredString> GetAsync(CancellationToken cancellationToken)
        => GetMessageAsync(null, cancellationToken);

    public Task<RequiredString> GetVersionedAsync(ReCaptchaVersion version, CancellationToken cancellationToken)
        => GetMessageAsync(version, cancellationToken);

    private async Task<RequiredString> GetMessageAsync(ReCaptchaVersion? version, CancellationToken cancellationToken)
    {
        var messages = await contentService.GetRequiredAsync<IGenericListItem>(ContentPath, cancellationToken);

        var versionedMessage = messages.VersionedList.GetValue($"{ListItem}.{version}");
        var defaultMessage = messages.VersionedList.GetValue(ListItem);

        if (version != null && string.IsNullOrEmpty(versionedMessage))
        {
            log.LogError("Versioned reCaptcha message for {version} was requested, but is missing in sitecore {content}. Falling back to default message",
                version,
                ContentPath);
        }
        else if (string.IsNullOrEmpty(defaultMessage))
        {
            log.LogError("Default reCaptcha message is missing in sitecore {content}", ContentPath);
        }

        return versionedMessage ?? defaultMessage ?? "ReCaptcha verification failed.";
    }
}
