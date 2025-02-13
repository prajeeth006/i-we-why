namespace Frontend.Vanilla.Features.LicenseInfo;

internal sealed class LicenseInfoModel
{
    public bool AcceptanceNeeded { get; set; }
    public string Licenses { get; set; } = "";
    public string RedirectUrl { get; set; } = "";
}
