using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Login;

internal sealed class AutoLoginWithTempTokenHandler(
    IWebAuthenticationService webAuthenticationService,
    IAuthenticationConfiguration authConfiguration,
    ILogger<AutoLoginWithTempTokenHandler> logger)
    : IAutoLoginHandler
{
    public const string LoginType = "tempSession";
    public const string TempTokenKey = "AUTH_SESSION";

    public static class QueryKeys
    {
        public const string Username = "username";
        public const string TempToken = "temptoken";
        public const string ClientPlatform = "clientPlatform";
    }

    public IReadOnlyList<TrimmedRequiredString> UsedQueryKeys { get; }
        = new TrimmedRequiredString[] { QueryKeys.Username, QueryKeys.TempToken, QueryKeys.ClientPlatform };

    public Task? TryLoginAsync(HttpRequest request, CancellationToken cancellationToken)
    {
        var urlQuery = request.Query;
        var username = urlQuery[QueryKeys.Username].ToString();
        var tempToken = urlQuery[QueryKeys.TempToken].ToString();

        return !username.IsNullOrWhiteSpace() && !tempToken.IsNullOrWhiteSpace() ? LoginAsync() : null;

        async Task LoginAsync() // Avoid async overhead if possible
        {
            try
            {
                var platform = urlQuery[QueryKeys.ClientPlatform].ToString();
                var parameters = new LoginParameters(username, " ")
                {
                    LoginType = LoginType,
                    RequestData = { { TempTokenKey, tempToken } },
                    ChannelId = authConfiguration.ClientPlatformToChannel.GetValue(platform),
                };

                await webAuthenticationService.LoginAsync(parameters, cancellationToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex,
                    "Failed to login with URL query parameters '{QueryKeysUsername}' = '{Username}' and '{QueryKeysTempToken}' = '{TempToken}'",
                    QueryKeys.Username,
                    username,
                    QueryKeys.TempToken,
                    tempToken);
            }
        }
    }
}
