using System.Collections.Generic;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Messages;

namespace Frontend.Vanilla.Features.Login;

internal sealed class LoginInfo
{
    public LoginStatus Status { get; set; }
    public KeyValuePair<string, PostLoginRedirect> PostLoginRedirect { get; set; }
    public string? NewLanguage { get; set; }

    public string? OriginalLanguage { get; set; }

    // error
    public string? RedirectUrl { get; set; }
    public string? ErrorMessage { get; set; }
    public string? ErrorCode { get; set; }
    public MessageType? MessageType { get; set; }
    public IReadOnlyDictionary<string, string?>? ErrorValues { get; set; }
    public TrimmedRequiredString? RememberMeToken { get; set; }
    public string? PosApiErrorMessage { get; set; }
}
