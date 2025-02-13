using System.Runtime.CompilerServices;
using FluentAssertions;
using Frontend.Host.Features.Assets;
using Frontend.Host.Features.Assets.AssetTypes;
using Frontend.Host.Features.Assets.Renderers;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.Assets;

internal class FakeAsset1() : BootstrapAsset(string.Empty) { }

internal class FakeAsset2() : BootstrapAsset(string.Empty) { }

internal class FakeAsset3() : BootstrapAsset(string.Empty) { }

public class BootstrapAssetsRendererTests
{
    private readonly IBootstrapAssetsRenderer bootstrapAssetsRenderer;
    private readonly Mock<IBootstrapAssetsContext> bootstrapAssetsContext;
    private readonly Mock<IBootstrapAssetsProvider> bootstrapAssetProvider;
    private readonly Mock<IBootstrapAssetRenderer> renderer1;
    private readonly Mock<IBootstrapAssetRenderer> renderer2;
    private readonly Mock<ILogger<BootstrapAssetsRenderer>> logger;
    private readonly FakeAsset1 asset1;
    private readonly FakeAsset2 asset2;
    private CancellationToken cancellationToken = CancellationToken.None;

    public BootstrapAssetsRendererTests()
    {
        bootstrapAssetsContext = new Mock<IBootstrapAssetsContext>();
        bootstrapAssetProvider = new Mock<IBootstrapAssetsProvider>();
        renderer1 = new Mock<IBootstrapAssetRenderer>();
        renderer2 = new Mock<IBootstrapAssetRenderer>();
        logger = new Mock<ILogger<BootstrapAssetsRenderer>>();
        asset1 = new FakeAsset1();
        asset2 = new FakeAsset2();

        renderer1.SetupGet(r => r.AssetType).Returns(asset1.GetType());
        renderer2.SetupGet(r => r.AssetType).Returns(asset2.GetType());

        bootstrapAssetsRenderer = new BootstrapAssetsRenderer(
            bootstrapAssetProvider.Object,
            bootstrapAssetsContext.Object,
            new[] { renderer1.Object, renderer2.Object },
            logger.Object);

        bootstrapAssetProvider.Setup(p => p.GetAssets(bootstrapAssetsContext.Object, cancellationToken)).Returns(new BootstrapAsset[]
        {
            asset1,
            asset2,
        }.ToAsyncEnumerable());

        renderer1.Setup(r => r.Render(asset1, BootstrapAssetSection.Head)).Returns("asset1 h");
        renderer1.Setup(r => r.Render(asset1, BootstrapAssetSection.Body)).Returns("asset1 b");
        renderer2.Setup(r => r.Render(asset2, BootstrapAssetSection.Head)).Returns("asset2 h");
    }

    [Theory]
    [InlineData(BootstrapAssetSection.Head, "asset1 hasset2 h")]
    [InlineData(BootstrapAssetSection.Body, "asset1 b")]
    public async Task ShouldReturnConcatenatedStringFromRenderersForSpecifiedSection(BootstrapAssetSection section, string expected)
    {
        var result = await bootstrapAssetsRenderer.RenderAsync(section, cancellationToken);

        result.Should().Be(expected);
    }

    [Fact]
    public async Task ShouldReturnEmptyStringIfRendererIsNotFound()
    {
        bootstrapAssetProvider.Setup(p => p.GetAssets(bootstrapAssetsContext.Object, cancellationToken)).Returns(new[]
        {
            new FakeAsset3(),
        }.ToAsyncEnumerable());

        var act = () => bootstrapAssetsRenderer.RenderAsync(BootstrapAssetSection.Head, cancellationToken);

        (await act.Invoke()).Equals(string.Empty);
    }

    [Fact]
    public async Task ShouldReturnEmptyStringIfCustomLazyLoadStyleSheetDoesNotSpecifyAlias()
    {
        bootstrapAssetProvider.Setup(p => p.GetAssets(bootstrapAssetsContext.Object, cancellationToken)).Returns(new[]
        {
            new StylesheetBootstrapAsset("a") { LazyLoad = AssetLazyLoadStrategy.Custom },
        }.ToAsyncEnumerable());

        var act = () => bootstrapAssetsRenderer.RenderAsync(BootstrapAssetSection.Head, cancellationToken);

        (await act()).Equals(string.Empty);
    }
}
