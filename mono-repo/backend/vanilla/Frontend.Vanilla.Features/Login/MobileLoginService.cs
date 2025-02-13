using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.ServiceClients.Services.Registration.MobileAvailability;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Login;

internal interface IMobilePhoneLoginService
{
    Task ValidateDuplicateMobileNumber(string mobileNumber, CancellationToken cancellationToken);
    Task<string> GetMobilePhoneMessageAsync(CancellationToken cancellationToken);
}

internal sealed class MobilePhoneLoginService(
    IMobileAvailabilityServiceClient mobileAvailabilityServiceClient,
    IContentService contentService,
    ILogger<MobilePhoneLoginService> log)
    : IMobilePhoneLoginService
{
    private const string ContentPath = "App-v1.0/Resources/Messages";

    public async Task ValidateDuplicateMobileNumber(string mobileNumber, CancellationToken cancellationToken)
    {
        var (countryCode, mobile) = ParseMobileNumber(mobileNumber);

        if (!string.IsNullOrWhiteSpace(countryCode) && !string.IsNullOrWhiteSpace(mobile))
        {
            await mobileAvailabilityServiceClient.VerifyAsync(cancellationToken, countryCode, mobile);
        }
    }

    private static (string, string) ParseMobileNumber(string mobileNumber)
    {
        var match = Regex.Match(mobileNumber, @"([+]\d+)?-(\d+)");

        if (match.Success)
        {
            var parts = mobileNumber.Replace("+", string.Empty).Split('-');

            return (parts[0], parts[1]);
        }

        return (string.Empty, string.Empty);
    }

    public async Task<string> GetMobilePhoneMessageAsync(CancellationToken cancellationToken)
    {
        var messages = await contentService.GetRequiredAsync<IGenericListItem>(ContentPath, cancellationToken);

        var message = messages.VersionedList.GetValue("MobilePhoneDuplicate");

        if (string.IsNullOrEmpty(message))
        {
            log.LogError("Versioned message for MobilePhoneDuplicate is missing in sitecore {content}. Falling back to default message", ContentPath);
        }

        return message ?? "Mobile phone verification failed. Please login with your username.";
    }
}
