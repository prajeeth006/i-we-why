using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.RestService;

public sealed class ConfigurationRestServiceTests
{
    private readonly IConfigurationRestService target;
    private readonly Mock<IConfigurationRestClient> restClient;
    private readonly Mock<IConfigurationServiceUrls> urlBuilder;
    private readonly TestLogger<ConfigurationRestService> log;
    private readonly DynaConEngineSettings settings;
    private readonly HttpUri testUrl;

    public ConfigurationRestServiceTests()
    {
        restClient = new Mock<IConfigurationRestClient>();
        urlBuilder = new Mock<IConfigurationServiceUrls>();
        settings = TestSettings.Get(s => s.ValidatableChangesetsNetworkTimeout = TimeSpan.FromSeconds(20));
        var environment = Mock.Of<IEnvironment>(e => e.MachineName == "Skynet");
        log = new TestLogger<ConfigurationRestService>();
        testUrl = new HttpUri("http://dynacon/test");
        target = new ConfigurationRestService(restClient.Object, urlBuilder.Object, settings, environment, log);
    }

    [Fact]
    public void GetCurrentConfiguration_Test()
    {
        var dto = TestConfigDto.Create();
        urlBuilder.SetupGet(b => b.CurrentChangeset).Returns(testUrl);
        restClient.SetupWithAnyArgs(c => c.Execute<ConfigurationResponse>(null, null)).Returns(dto);

        var result = target.GetCurrentConfiguration(); // Act

        result.Should().BeSameAs(dto);
        VerifyGetRequestToTestUrl<ConfigurationResponse>();
    }

    [Fact]
    public void GetConfiguration_Test()
    {
        var dto = TestConfigDto.Create();
        urlBuilder.Setup(b => b.Changeset(2667)).Returns(testUrl);
        restClient.SetupWithAnyArgs(c => c.Execute<ConfigurationResponse>(null, null)).Returns(dto);

        var result = target.GetConfiguration(2667); // Act

        result.Should().BeSameAs(dto);
        VerifyGetRequestToTestUrl<ConfigurationResponse>();
    }

    [Fact]
    public void GetConfigurationChanges_Test()
    {
        var dto = new[]
        {
            TestConfigDto.Create(222),
            TestConfigDto.Create(333),
        };
        urlBuilder.Setup(b => b.ConfigurationChanges(123)).Returns(testUrl);
        restClient.SetupWithAnyArgs(c => c.Execute<IReadOnlyList<ConfigurationResponse>>(null, null)).Returns(dto);

        var result = target.GetConfigurationChanges(123); // Act

        result.Should().BeSameAs(dto);
        VerifyGetRequestToTestUrl<IReadOnlyList<ConfigurationResponse>>();
    }

    [Fact]
    public void GetValidatableChangesetIds_Test()
    {
        urlBuilder.SetupGet(b => b.ValidatableChangesets).Returns(testUrl);
        restClient.SetupWithAnyArgs(c => c.Execute<IReadOnlyList<ValidatableChangesetResponse>>(null, null)).Returns(
            new[]
            {
                new ValidatableChangesetResponse { ChangesetId = 1111, CommitId = 100 },
                new ValidatableChangesetResponse { ChangesetId = 2222, CommitId = 200 },
            });

        var result = target.GetValidatableChangesetIds(); // Act

        result.Should().Equal(1111, 2222);
        VerifyGetRequestToTestUrl<IReadOnlyList<ValidatableChangesetResponse>>(settings.ValidatableChangesetsNetworkTimeout);
    }

    [Theory]
    [InlineData(false, null)]
    [InlineData(true, null)]
    [InlineData(false, 222L)]
    [InlineData(true, 222L)]
    public void PostChangesetFeedback_ShouldPostFeedback(
        bool isValid,
        long? commitId)
    {
        RestRequest receivedRequest = null;
        restClient.SetupWithAnyArgs(c => c.Execute<VoidDto>(null, null)).Callback((RestRequest r, TimeSpan? t) => receivedRequest = r);
        var details = !isValid ? new[] { new ProblemDetail(), new ProblemDetail() } : Array.Empty<ProblemDetail>();
        urlBuilder.SetupWithAnyArgs(b => b.Feedback(default, null)).Returns(testUrl);

        // Act
        if (isValid)
            target.PostValidChangesetFeedback(111, commitId);
        else
            target.PostInvalidChangesetFeedback(111, commitId, "Problem desc", details);

        urlBuilder.Verify(b => b.Feedback(111, commitId));
        receivedRequest.Method.Should().Be(HttpMethod.Post);
        receivedRequest.Url.Should().Be(testUrl);
        receivedRequest.Content.Formatter.Should().BeSameAs(ConfigurationRestClient.Formatter);

        var dto = (FeedbackRequest)receivedRequest.Content.Value;
        dto.MachineName.Should().Be("Skynet");
        dto.IsValid.Should().Be(isValid);
        dto.ProblemDescription.Should().Be(isValid ? null : "Problem desc");
        dto.ProblemDetails.Should().Equal(details);
    }

    [Theory, BooleanData]
    public void PostChangesetFeedback_ShouldHandleExceptions(bool isValid)
    {
        var problemDesc = isValid ? null : (TrimmedRequiredString)"Problem desc";
        var ex = new Exception("Service failure");
        restClient.SetupWithAnyArgs(c => c.Execute<VoidDto>(null, null)).Throws(ex);
        urlBuilder.SetupWithAnyArgs(b => b.Feedback(default, null)).Returns(testUrl);

        // Act
        if (isValid)
            target.PostValidChangesetFeedback(111, null);
        else
            target.PostInvalidChangesetFeedback(111, null, problemDesc, Array.Empty<ProblemDetail>());

        log.Logged.Single().Verify(
            LogLevel.Error,
            ex,
            ("ChangesetId", 111),
            ("IsValid", isValid),
            ("ProblemDescription", problemDesc),
            ("Url", testUrl));
    }

    private void VerifyGetRequestToTestUrl<T>(TimeSpan? timeout = null)
        where T : class
        => restClient.Verify(c => c.Execute<T>(It.Is<RestRequest>(r => r.Method == HttpMethod.Get && r.Url.ToString().Contains(testUrl.ToString())), timeout));
}
