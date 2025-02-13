using System;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Login;

internal static class RememberMeLoggerExtensions
{
    private const string MessagePrefix = "RememberMe: Platform via PosAPI ";

    public static void LogRememberMePlatformError(this ILogger log, Exception? exception, string howPlatformFailed, params object[] args)
        => log.LogError(exception, MessagePrefix + howPlatformFailed, args);
}
