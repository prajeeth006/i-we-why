namespace Frontend.Host.Features.Assets;

/// <summary>
/// Provides a list of assets that should be rendered on the entry page.
/// </summary>
public interface IBootstrapAssetsProvider
{
    /// <summary>
    /// Gets assets to render on the entry page.
    /// </summary>
    IAsyncEnumerable<BootstrapAsset> GetAssets(IBootstrapAssetsContext context, CancellationToken cancellationToken);
}
