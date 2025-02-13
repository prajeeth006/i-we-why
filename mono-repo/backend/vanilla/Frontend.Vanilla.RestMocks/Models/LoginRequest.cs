using System;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;

namespace Frontend.Vanilla.RestMocks.Models;

public sealed class LoginRequest
{
    private DeviceFingerprint fingerprint;

    public string LoginType { get; set; }

    public string BankSessionId { get; set; }

    public string Username { get; set; }

    public string Password { get; set; }

    public string ConnectCardNumber { get; set; }

    public string Pin { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public string CaptchaResponse { get; set; }

    public bool RememberMe { get; set; }

    public string ProductId { get; set; }

    public string Pid { get; set; }

    public DeviceFingerprint Fingerprint
    {
        get => fingerprint ?? (fingerprint = new DeviceFingerprint());
        set => fingerprint = value;
    }
}
