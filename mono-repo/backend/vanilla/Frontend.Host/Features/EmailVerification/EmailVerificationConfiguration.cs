#nullable disable
namespace Frontend.Host.Features.EmailVerification;

internal interface IEmailVerificationConfiguration
{
    string RedirectUrl { get; }
}

internal sealed class EmailVerificationConfiguration : IEmailVerificationConfiguration
{
    public const string FeatureName = "Host.Features.EmailVerification";

    public string RedirectUrl { get; set; }
}
