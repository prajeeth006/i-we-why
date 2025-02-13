using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Login;

internal sealed class AutoLoginWithUsernameAndPasswordHandler(
    IWebAuthenticationService webAuthenticationService,
    IAuthenticationConfiguration authenticationConfig,
    ILogger<AutoLoginWithUsernameAndPasswordHandler> logger)
    : IAutoLoginHandler
{
    public IReadOnlyList<TrimmedRequiredString> UsedQueryKeys
    {
        get
        {
            var keys = authenticationConfig.AutoLoginQueryParameters;

            return new[] { keys.Username, keys.Password };
        }
    }

    public Task? TryLoginAsync(HttpRequest request, CancellationToken cancellationToken)
    {
        var urlQuery = request.Query;
        var keys = authenticationConfig.AutoLoginQueryParameters;
        var username = urlQuery[keys.Username].ToString();
        var password = urlQuery[keys.Password].ToString();

        return !username.IsNullOrWhiteSpace() && !password.IsNullOrWhiteSpace() ? LoginAsync() : null;

        async Task LoginAsync() // Avoid async overhead if possible
        {
            try
            {
                var parameters = new LoginParameters(username, password);
                await webAuthenticationService.LoginAsync(parameters, cancellationToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex,
                    "Failed to login with configured URL query parameters '{KeysUsername}' (username) = '{Username}'",
                    keys.Username.Value,
                    username);
            }
        }
    }
}
