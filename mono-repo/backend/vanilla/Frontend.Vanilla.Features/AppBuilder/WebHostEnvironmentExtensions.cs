using System;
using Microsoft.AspNetCore.Hosting;

namespace Frontend.Vanilla.Features.AppBuilder;

/// <summary>Provides utility methods over IWebHostEnvironment.</summary>
public static class WebHostEnvironmentExtensions
{
    /// <summary>
    /// Provides information if current environment is development environment (dev).
    /// </summary>
    /// <param name="webHostEnvironment"></param>
    /// <returns>Information if current environment is production environment (prod).</returns>
    public static bool IsProd(this IWebHostEnvironment webHostEnvironment) =>
        webHostEnvironment.EnvironmentName.Equals("prod", StringComparison.InvariantCultureIgnoreCase);
}
