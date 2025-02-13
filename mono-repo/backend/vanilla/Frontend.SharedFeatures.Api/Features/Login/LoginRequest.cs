using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;

namespace Frontend.SharedFeatures.Api.Features.Login;

public sealed class LoginRequest
{
    private DeviceFingerprint? fingerprint;
    public string? LoginType { get; set; }
    public string? Username { get; init; }
    public string? Password { get; init; }
    public string? SsoToken { get; init; }
    public string? ConnectCardNumber { get; set; }
    public string? Pin { get; set; }

    public DateTime? DateOfBirth { get; set; }
    public string? CaptchaResponse { get; set; }

    public bool RememberMe { get; set; }
    public string? ProductId { get; init; }
    public string? Pid { get; set; }
    public string? AuthorizationCode { get; set; }
    public string? OAuthProvider { get; set; }
    public string? OAuthUserId { get; set; }
    public IDictionary<string, string>? RequestData { get; init; }

    public DeviceFingerprint Fingerprint
    {
        get => fingerprint ??= new DeviceFingerprint();
        init => fingerprint = value;
    }
}
