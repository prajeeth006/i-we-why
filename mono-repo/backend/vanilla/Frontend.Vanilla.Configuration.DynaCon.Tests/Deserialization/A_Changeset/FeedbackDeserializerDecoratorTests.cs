using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.E_Context;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Logging;
using Moq;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Deserialization.A_Changeset;

[SuppressMessage("ReSharper", "SA1117", Justification = "Visualization of exception nesting.")]
public sealed class FeedbackDeserializerDecoratorTests
{
    private Mock<IChangesetDeserializer> inner;
    private DynaConEngineSettingsBuilder settings;
    private Mock<IConfigurationRestService> restService;
    private Mock<IContextHierarchyExpander> contextExpander;
    private TestLogger<FeedbackDeserializerDecorator> log;
    private ConfigurationResponse configDto;
    private VariationHierarchyResponse ctxHierarchy;
    private IEnumerable<ProblemDetail> postedProblems;

    public FeedbackDeserializerDecoratorTests()
    {
        inner = new Mock<IChangesetDeserializer>();
        settings = TestSettings.GetBuilder(s => s.SendFeedback = true);
        restService = new Mock<IConfigurationRestService>();
        contextExpander = new Mock<IContextHierarchyExpander>();
        log = new TestLogger<FeedbackDeserializerDecorator>();
        configDto = TestConfigDto.Create();
        ctxHierarchy = TestCtxHierarchy.Get();

        restService.SetupWithAnyArgs(s => s.PostInvalidChangesetFeedback(default, default, null, null))
            .Callback<long, long?, TrimmedRequiredString, IEnumerable<ProblemDetail>>((i, v, m, p) => postedProblems = p);
    }

    private IChangesetDeserializer GetTarget() => new FeedbackDeserializerDecorator(inner.Object, settings.Build(), restService.Object, contextExpander.Object, log);

    [Theory, ValuesData(null, 999L)]
    public void ShouldExtractAllErrorDetails(long? commitId)
    {
        contextExpander.SetupWithAnyArgs(e => e.GetChildren(null, null, null)).Returns(TrimmedStrs.Empty);
        contextExpander.Setup(e => e.GetChildren(ctxHierarchy, "label", "bwin")).Returns(new TrimmedRequiredString[] { "bwin.es" });

        configDto = TestConfigDto.Create(
            lastCommitId: commitId,
            configs: new Dictionary<string, IReadOnlyDictionary<string, KeyConfiguration>>
            {
                ["Feature2"] = new Dictionary<string, KeyConfiguration>
                {
                    ["Property1"] = new KeyConfiguration("dummy", new[]
                    {
                        new ValueConfiguration(111, new Dictionary<string, string> { { "product", "casino" } }),
                    }),
                    ["Property2"] = new KeyConfiguration("dummy", new[]
                    {
                        new ValueConfiguration(222, new Dictionary<string, string> { { "label", "bwin" } }),
                        new ValueConfiguration(333, new Dictionary<string, string> { { "label", "bwin.es" } }),
                        new ValueConfiguration(444, new Dictionary<string, string> { { "channel", "mobile" } }),
                    }),
                },
            });

        RunChangesetFailedWithDetailsTest(
            changesetErrors: new[]
            {
                // Should output exception directly b/c no validation/keys to match
                new Exception("Wrapped", new FeatureDeserializationException("Feature1", "ShitMsg", new Exception("HappensMsg"))),

                // Context should be reduced to qa, only first member should be outputed
                new FeatureDeserializationException("Feature2", "IgnoredMsg", new InstanceDeserializationException(
                    TestVarCtx.Get(label: new[] { "bwin.es", "bwin" }),
                    new Exception("IgnoredMsg",
                        new InvalidConfigurationException(new ValidationResult("Validation 1"),
                            new ValidationResult("Validation 2", new[] { "Property1", "Property2" }))))),

                // Context should be merged with first
                new FeatureDeserializationException("Feature2", "IgnoredMsg", new InstanceDeserializationException(
                    TestVarCtx.Get(product: new[] { "casino" }),
                    new InvalidConfigurationException(new ValidationResult("Validation 2", new[] { "Property1", "Property2" })))),

                // Should filter context because same message as above but outside input DTO contexts
                new FeatureDeserializationException("Feature2", "IgnoredMsg", new InstanceDeserializationException(
                    TestVarCtx.Get(product: new[] { "sports" }, channel: new[] { "mobile" }),
                    new InvalidConfigurationException(new ValidationResult("Validation 2", new[] { "Property1", "Property2" })))),

                // Should log error because key is not in input DTO
                new FeatureDeserializationException("Feature2", "IgnoredMsg", new InstanceDeserializationException(
                    TestVarCtx.Get(product: new[] { "sports" }),
                    new InvalidConfigurationException(new ValidationResult("Validation 3", new[] { "Property3.Lol" })))),

                // Should log error because feature is not in input DTO
                new FeatureDeserializationException(
                    "Feature3",
                    "IgnoredMsg",
                    new InstanceDeserializationException(
                        TestVarCtx.Get(product: new[] { "sports" }),
                        new InvalidConfigurationException(new ValidationResult("Validation 4", new[] { "Property1['Inner']", "Property2" })))),
            },
            expectedProblems: new[]
            {
                new ProblemDetail { Feature = "Feature1", Description = $"ShitMsg{Environment.NewLine}--> HappensMsg" },
                new ProblemDetail
                {
                    Feature = "Feature2", Description = "Validation 1", AdditionalContexts = new[]
                    {
                        new Dictionary<string, string> { ["label"] = "bwin" },
                    },
                },
                new ProblemDetail
                {
                    Feature = "Feature2", Key = "Property1", Description = "Validation 2", AdditionalContexts = new[]
                    {
                        new Dictionary<string, string> { ["label"] = "bwin" },
                        new Dictionary<string, string> { ["product"] = "casino" },
                        new Dictionary<string, string> { ["channel"] = "mobile" },
                    },
                },
                new ProblemDetail
                {
                    Feature = "Feature2", Key = "Property3", Description = "Validation 3", AdditionalContexts = new[]
                    {
                        new Dictionary<string, string> { ["product"] = "sports" },
                    },
                },
                new ProblemDetail
                {
                    Feature = "Feature3", Key = "Property1", Description = "Validation 4", AdditionalContexts = new[]
                    {
                        new Dictionary<string, string> { ["product"] = "sports" },
                    },
                },
            });

        log.Logged.Should().HaveCount(2);
        log.Logged[0].Verify(
            LogLevel.Error,
            ("featureName", "Feature2"),
            ("keys", "[\"Property3\"]"),
            ("membersNames", "[\"Property3.Lol\"]"));
        log.Logged[1].Verify(
            LogLevel.Error,
            ("featureName", "Feature3"),
            ("keys", "[\"Property1\",\"Property2\"]"),
            ("membersNames", "[\"Property1[\'Inner\']\",\"Property2\"]"));
    }

    [Fact]
    public void ShouldSendOnlyFirstProperty_IfCompositeMemberName()
        => RunChangesetFailedWithDetailsTest(
            changesetErrors: new[]
            {
                new FeatureDeserializationException("FooFeature", "Msg", new InstanceDeserializationException(
                    TestVarCtx.Get(),
                    new InvalidConfigurationException(
                        new ValidationResult("Valid 1", new[] { "First.Second.Third" }),
                        new ValidationResult("Valid 2", new[] { "Item['key'].Value" })))),
            },
            expectedProblems: new[]
            {
                new ProblemDetail { Feature = "FooFeature", Description = "Valid 1", Key = "First" },
                new ProblemDetail { Feature = "FooFeature", Description = "Valid 2", Key = "Item" },
            });

    private void RunChangesetFailedWithDetailsTest(IReadOnlyList<Exception> changesetErrors, ProblemDetail[] expectedProblems)
    {
        var changeset = Mock.Of<IFailedChangeset>(c => c.Errors == changesetErrors);
        var ex = new ChangesetDeserializationException("Oups", changeset);
        inner.Setup(i => i.Deserialize(configDto, ctxHierarchy, ConfigurationSource.Service)).Throws(ex);
        var target = GetTarget();

        Action act = () => target.Deserialize(configDto, ctxHierarchy, ConfigurationSource.Service);

        act.Should().Throw<ChangesetDeserializationException>().SameAs(ex);
        restService.Verify(s => s.PostInvalidChangesetFeedback(configDto.ChangesetId, configDto.LastCommitId, "Oups", postedProblems));

        var problems = postedProblems.ToList();
        problems.Should().HaveCount(expectedProblems.Length);
        problems.Each((p, i) => VerifyProblem(p, expectedProblems[i]));
    }

    [Fact]
    public void ShouldPostPositiveFeedback_IfChangesetSuccessful_ForServiceSource()
    {
        RunSuccessfulDeserialization(ConfigurationSource.Service);
        restService.Verify(s => s.PostValidChangesetFeedback(configDto.ChangesetId, configDto.LastCommitId));
    }

    private void RunSuccessfulDeserialization(ConfigurationSource source)
    {
        var changeset = Mock.Of<IValidChangeset>();
        inner.Setup(i => i.Deserialize(configDto, ctxHierarchy, source)).Returns(changeset);

        var result = GetTarget().Deserialize(configDto, ctxHierarchy, source); // Act

        result.Should().BeSameAs(changeset);
    }

    [Theory]
    [InlineData(ConfigurationSource.FallbackFile, false)]
    [InlineData(ConfigurationSource.FallbackFile, true)]
    [InlineData(ConfigurationSource.LocalOverrides, false)]
    [InlineData(ConfigurationSource.LocalOverrides, true)]
    internal void ShouldNotPostAnyFeedback_IfOtherSources(
        ConfigurationSource source,
        bool isDeserializationSuccess)
        => RunNoFeedbackTest(source, isDeserializationSuccess);

    [Theory, BooleanData]
    public void ShouldNotPostAnyFeedback_IfDisabledInSettings(bool isDeserializationSuccess)
    {
        settings.SendFeedback = false;
        RunNoFeedbackTest(ConfigurationSource.Service, isDeserializationSuccess);
    }

    private void RunNoFeedbackTest(ConfigurationSource source, bool isDeserializationSuccess)
    {
        if (isDeserializationSuccess)
            RunSuccessfulDeserialization(source);
        else
            RunChangesetFailedTest(source);

        restService.VerifyWithAnyArgs(s => s.PostValidChangesetFeedback(default, null), Times.Never);
        restService.VerifyWithAnyArgs(s => s.PostInvalidChangesetFeedback(default, null, null, null), Times.Never);
    }

    [Fact]
    public void ShouldPostNegativeFeedbackIfChangesetFailedForServiceSource()
    {
        RunChangesetFailedTest(ConfigurationSource.Service);

        restService.Verify(s => s.PostInvalidChangesetFeedback(configDto.ChangesetId, configDto.LastCommitId, "Oups", postedProblems));
        VerifyProblem(postedProblems.Single(), new ProblemDetail { Feature = "Foo", Description = $"Shit{Environment.NewLine}--> happens" });
    }

    private void RunChangesetFailedTest(ConfigurationSource source)
    {
        var featureEx = new FeatureDeserializationException("Foo", "Shit", new Exception("happens"));
        var ex = new ChangesetDeserializationException("Oups", Mock.Of<IFailedChangeset>(c => c.Errors == new[] { featureEx }));
        inner.Setup(i => i.Deserialize(configDto, ctxHierarchy, source)).Throws(ex);
        var target = GetTarget();

        Action act = () => target.Deserialize(configDto, ctxHierarchy, source);

        act.Should().Throw<ChangesetDeserializationException>().SameAs(ex);
    }

    private static void VerifyProblem(ProblemDetail actual, ProblemDetail expected)
    {
        actual.Feature.Should().Be(expected.Feature);
        actual.Key.Should().Be(expected.Key);
        actual.Description.Should().Be(expected.Description);

        var actualContexts = JsonConvert.SerializeObject(actual.AdditionalContexts.NullToEmpty());
        var expectedContexts = JsonConvert.SerializeObject(expected.AdditionalContexts.NullToEmpty());
        actualContexts.Should().BeJson(expectedContexts);
    }
}
