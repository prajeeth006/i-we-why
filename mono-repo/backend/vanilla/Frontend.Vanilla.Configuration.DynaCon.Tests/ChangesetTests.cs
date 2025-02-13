using System;
using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests;

public sealed class ChangesetTests
{
    public class ValidChangesetParameters
    {
        internal Func<IValidChangeset> GetTarget => () => new ValidChangeset(Dto, ContextHierarchy, Source, Url, Features, Warnings);

        public ConfigurationResponse Dto { get; set; } = TestConfigDto.Create();
        internal ConfigurationSource Source { get; set; } = ConfigurationSource.Service;
        public HttpUri Url { get; set; } = new HttpUri("http://dynacon/configs/123");

        public VariationHierarchyResponse ContextHierarchy { get; set; } = new VariationHierarchyResponse(
            new Dictionary<string, IReadOnlyDictionary<string, string>>
            {
                ["Label"] = new Dictionary<string, string>
                {
                    { "bwin.com", "bwin" },
                    { "bwin.es", "bwin" },
                    { "bwin", null },
                    { "cheekysluts.com", null },
                },
                ["Product"] = new Dictionary<string, string>
                {
                    { "Sports", null },
                    { "Casino", null },
                },
            });

        internal IDictionary<TrimmedRequiredString, FeatureConfigurationList> Features { get; set; } = new Dictionary<TrimmedRequiredString, FeatureConfigurationList>
        {
            { "Vanilla.Foo", new FeatureConfigurationList(new[] { new FeatureConfiguration("Foo", TestVarCtx.Get()) }) },
            { "Vanilla.Bar", new FeatureConfigurationList(new[] { new FeatureConfiguration("Bar", TestVarCtx.Get()) }) },
        };

        public IEnumerable<TrimmedRequiredString> Warnings { get; set; } = TrimmedStrs.Empty;
    }

    [Theory]
    [InlineData(ConfigurationSource.FallbackFile, false)]
    [InlineData(ConfigurationSource.FallbackFile, true)]
    [InlineData(ConfigurationSource.LocalOverrides, false)]
    [InlineData(ConfigurationSource.LocalOverrides, true)]
    [InlineData(ConfigurationSource.Service, false)]
    [InlineData(ConfigurationSource.Service, true)]
    internal void ValidChangeset_ShouldCreateCorrectly(
        ConfigurationSource source,
        bool hasWarnings)
    {
        var args = new ValidChangesetParameters { Source = source };
        if (hasWarnings) args.Warnings = new TrimmedRequiredString[] { "hic", "sunt", "leones" };

        // Act
        var target = args.GetTarget();

        target.Id.Should().Be(args.Dto.ChangesetId);
        target.ValidFrom.Value.Should().Be(args.Dto.ValidFrom);
        target.Dto.Should().BeSameAs(args.Dto);
        target.ContextHierarchy.Should().BeSameAs(args.ContextHierarchy);
        target.Source.Should().Be(source);
        target.Url.Should().Be(args.Url);
        target.Features.Should().Equal(args.Features);
        target.Warnings.Should().Equal(args.Warnings);
        target.DefinedContextValues.Should().ContainKeys("Label", "Product");
        target.DefinedContextValues["Label"].Should()
            .BeEquivalentTo<TrimmedRequiredString>(new TrimmedRequiredString[] { "bwin", "bwin.com", "bwin.es", "cheekysluts.com" });
        target.DefinedContextValues["Product"].Should().BeEquivalentTo<TrimmedRequiredString>(new TrimmedRequiredString[] { "Sports", "Casino" });
    }

    public class FailedChangesetParameters
    {
        internal Func<IFailedChangeset> GetTarget => () => new FailedChangeset(Dto, ContextHierarchy, Source, Url, Errors);

        public ConfigurationResponse Dto { get; set; } = TestConfigDto.Create();
        public VariationHierarchyResponse ContextHierarchy { get; set; } = TestCtxHierarchy.Get();
        internal ConfigurationSource Source { get; set; } = ConfigurationSource.Service;
        public HttpUri Url { get; set; } = new HttpUri("http://dynacon/configs/123");
        public IReadOnlyList<Exception> Errors { get; set; } = new[] { new Exception("Oups") };
    }

    [Theory, EnumData(typeof(ConfigurationSource))]
    internal void FailedChangeset_ShouldCreateCorrectly(ConfigurationSource source)
    {
        var args = new FailedChangesetParameters { Source = source };

        // Act
        var target = args.GetTarget();

        target.Id.Should().Be(args.Dto.ChangesetId);
        target.ValidFrom.Value.Should().Be(args.Dto.ValidFrom);
        target.Dto.Should().BeSameAs(args.Dto);
        target.Source.Should().Be(source);
        target.Url.Should().Be(args.Url);
        target.Errors.Should().Equal(args.Errors);
    }

    [Fact]
    public void FeatureConfiguration_ShouldCreateCorrectly()
    {
        var instance = new object();
        var ctx = TestVarCtx.Get(product: new[] { "porn" }, label: new[] { "cheekysluts.com" });

        // Act
        var target = new FeatureConfiguration(instance, ctx);

        target.Instance.Should().BeSameAs(instance);
        target.Context.Should().BeSameAs(ctx);
    }

    [Fact]
    public void FeatureConfigurationList_ShouldCreateCorrectly()
    {
        var config1 = new FeatureConfiguration("Config 1", TestVarCtx.Get(priority: 1));
        var config2 = new FeatureConfiguration("Config 2", TestVarCtx.Get(priority: 6, product: new[] { "sports" }));
        var config3 = new FeatureConfiguration("Config 3", TestVarCtx.Get(priority: 3, label: new[] { "bwin.com" }));

        // Act
        var target = new FeatureConfigurationList(new[] { config1, config2, config3 });

        target.Should().HaveCount(3).And.Equal(new[] { config2, config3, config1 }, "Should be ordered by priority.");
    }
}
