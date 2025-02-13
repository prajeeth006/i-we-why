using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Features.LicenseInfo;

/// <summary>
/// Provides licence compliance info.
/// </summary>
public interface ILicenseInfoService
{
    /// <summary>
    /// Provides available licences.
    /// </summary>
    /// <param name="product"></param>
    /// <returns>Collection of available licences per product.</returns>
    IReadOnlyList<string> GetAvailableLicences(string product);
}

internal sealed class LicenseInfoService(ILicenseInfoConfiguration config) : ILicenseInfoService
{
    public IReadOnlyList<string> GetAvailableLicences(string product)
    {
        Guard.NotNull(product, nameof(product));

        return config.LicenceInfo.Where(l => l.Value.Any(p => p.Equals(product, StringComparison.InvariantCultureIgnoreCase))).Select(o => o.Key).ToList();
    }
}
