using Newtonsoft.Json;

namespace Frontend.Vanilla.Features.ReCaptcha;

internal class ReCaptchaResponse
{
    public bool Success { get; set; }
    public double Score { get; set; }
    public string? Action { get; set; }

    [JsonProperty("error-codes")]
    public string[]? ErrorCodes { get; set; }
}
