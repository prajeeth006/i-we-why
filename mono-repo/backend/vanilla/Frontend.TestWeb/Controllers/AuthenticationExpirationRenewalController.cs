using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.TestWeb.Controllers;

public class AuthenticationExpirationRenewalController : Controller
{
    [HttpGet]
    [Route("{culture}/playground/authenticationexpirationrenewal")]
    public ActionResult Enabled()
        => GetContent("prolongs");

    [HttpGet]
    [Route("{culture}/playground/authenticationexpirationrenewal/disabled")]
    [NeverRenewAuthentication]
    [DisableExpirationRenewal]
    public ActionResult Disabled()
        => GetContent("doesn't prolong");

    private ActionResult GetContent(string action)
    {
        var message = User.Identity!.IsAuthenticated
            ? $"User is authenticated. So this endpoints {action} the authentication."
            : "Use must be authenticated for this endpoint to complete the test but he isn't.";

        var html = $@"<html>
                <head>
                    <link rel=""shortcut icon"" href=""data:image/x-icon;,"" type=""image/x-icon"">
                </head>
                <body>
                    {message}
                </body>
            </html>";

        return Content(html, "text/html");
    }
}
