#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
#pragma warning disable SA1602 // Enumeration items should be documented
namespace Frontend.Vanilla.Features.Login;

public enum LoginStatus
{
    None,
    Error,
    Success,
    Redirect,
}
