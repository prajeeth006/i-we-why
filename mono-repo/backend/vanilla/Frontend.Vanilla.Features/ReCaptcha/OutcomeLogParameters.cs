using System.Collections.Generic;
using System.Net;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.ReCaptcha;

internal class OutcomeLogParameters
{
    public bool IsEnterprise { get; set; }
    public ReCaptchaVersion Version { get; set; }
    public string? UsersResponse { get; set; }
    public TrimmedRequiredString? Area { get; set; }
    public IPAddress? ClientIp { get; set; }
    public List<string>? Errors { get; set; }
    public string? Action { get; set; }
    public double Score { get; set; }
    public double? Threshold { get; set; }
    public Dictionary<string, object>? AdditionalParameters { get; set; }
    public IEnumerable<ClassificationReasons>? Reasons { get; set; }
    public IEnumerable<string>? ExtendedVerdictReasons { get; set; }
    public string? HostName { get; set; }
}
