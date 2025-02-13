using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Execution;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Authentication;

public class LoginServiceClientTests
{
    private readonly ILoginServiceClient target;
    private readonly Mock<ILoginExecutor> loginExecutor;

    private readonly LoginResult loginResult;
    private readonly ExecutionMode testMode;
    private PosApiRestRequest receivedRequest;

    public LoginServiceClientTests()
    {
        loginExecutor = new Mock<ILoginExecutor>();
        target = new LoginServiceClient(loginExecutor.Object);

        loginResult = new LoginResult();
        testMode = TestExecutionMode.Get();
        receivedRequest = null;

        loginExecutor.Setup(e => e.ExecuteAsync(testMode, It.IsAny<PosApiRestRequest>()))
            .Callback<ExecutionMode, PosApiRestRequest>((_, r) => receivedRequest = r)
            .ReturnsAsync(loginResult);
    }

    internal class CommonParameterTestCase(string channelId, string productId, string brandId, RestRequestHeaders expectedHeaders)
    {
        public string ChannelId { get; } = channelId;
        public string ProductId { get; } = productId;
        public string BrandId { get; } = brandId;
        public RestRequestHeaders ExpectedHeaders { get; } = expectedHeaders;
    }

    public static IEnumerable<object[]> CommonParameterTestCases => new[]
    {
        new object[] { new CommonParameterTestCase(null, null, null, new RestRequestHeaders()) },
        new object[] { new CommonParameterTestCase("mobile", null, null, new RestRequestHeaders { { PosApiHeaders.ChannelId, "mobile" } }) },
        new object[] { new CommonParameterTestCase(null, "sports", null, new RestRequestHeaders { { PosApiHeaders.ProductId, "sports" } }) },
        new object[] { new CommonParameterTestCase(null, null, "bwin", new RestRequestHeaders { { PosApiHeaders.BrandId, "bwin" } }) },
        new object[]
        {
            new CommonParameterTestCase(
                "mobile",
                "sports",
                "bwin",
                new RestRequestHeaders
                {
                    { PosApiHeaders.ChannelId, "mobile" },
                    { PosApiHeaders.ProductId, "sports" },
                    { PosApiHeaders.BrandId, "bwin" },
                }),
        },
    };

    public class CommonParametersTests : LoginServiceClientTests
    {
        private async Task RunTest<TParams>(TParams args, Func<TParams, Task<ILoginResult>> act, CommonParameterTestCase testCase, string expectedRequestUrl)
            where TParams : CommonLoginParameters
        {
            args.ChannelId = testCase.ChannelId;
            args.ProductId = testCase.ProductId;
            args.BrandId = testCase.BrandId;

            var result = await act(args); // Act

            result.Should().BeSameAs(loginResult);
            receivedRequest.Verify(expectedRequestUrl, HttpMethod.Post, content: args, headers: testCase.ExpectedHeaders);
        }

        [Theory, MemberData(nameof(CommonParameterTestCases))]
        internal async Task LoginByUserName_ShouldLoginCorrectly(CommonParameterTestCase testCase)
            => await RunTest(
                args: new LoginParameters("Chuck Norris", "Hail to the King, Baby!"),
                act: a => target.LoginByUsernameAsync(testMode, a),
                testCase,
                expectedRequestUrl: "Authentication.svc/Login");

        [Theory, MemberData(nameof(CommonParameterTestCases))]
        internal async Task LoginByPid_ShouldLoginCorrectly(CommonParameterTestCase testCase)
            => await RunTest(
                args: new PidLoginParameters("abc"),
                act: a => target.LoginByPidAsync(testMode, a),
                testCase,
                expectedRequestUrl: "Authentication.svc/Login/PID");

        [Theory, MemberData(nameof(CommonParameterTestCases))]
        internal async Task LoginByRememberMeTokenAsync_ShouldLoginCorrectly(CommonParameterTestCase testCase)
            => await RunTest(
                args: new RememberMeLoginParameters("tkn"),
                act: a => target.LoginByRememberMeTokenAsync(testMode, a),
                testCase,
                expectedRequestUrl: "Authentication.svc/Login/RememberMe");
    }

    [Fact]
    public async Task AutoLogin_ShouldLoginCorrectly()
    {
        var args = new AutoLoginParameters("test-sso");

        var result = await target.AutoLoginAsync(testMode, args); // Act

        result.Should().BeSameAs(loginResult);
        receivedRequest.Verify("Authentication.svc/AutoLogin", HttpMethod.Post, content: args);
    }

    [Fact]
    public async Task LoginByTokens_ShouldLoginCorrectly()
    {
        var result = await target.LoginByAuthTokensAsync(testMode, "user-token", "session-token", "productId"); // Act

        result.Should().BeSameAs(loginResult);
        receivedRequest.Verify(
            "Authentication.svc/WorkflowLoginResponse",
            headers: new RestRequestHeaders
            {
                { PosApiHeaders.UserToken, "user-token" },
                { PosApiHeaders.SessionToken, "session-token" },
                { PosApiHeaders.ProductId, "productId" },
            });
    }

    [Fact]
    public async Task LoginByTokens_CallWithoutProductIdHeader()
    {
        var result = await target.LoginByAuthTokensAsync(testMode, "user-token", "session-token", ""); // Act

        result.Should().BeSameAs(loginResult);
        receivedRequest.Verify(
            "Authentication.svc/WorkflowLoginResponse",
            headers: new RestRequestHeaders
            {
                { PosApiHeaders.UserToken, "user-token" },
                { PosApiHeaders.SessionToken, "session-token" },
            });
    }

    [Fact]
    public async Task SkipWorkflowAsync_ShouldLoginCorrectly()
    {
        var result = await target.SkipWorkflowAsync(testMode, new WorkflowParameters("oauth"), "productId"); // Act

        result.Should().BeSameAs(loginResult);
        receivedRequest.Verify("Authentication.svc/SkipWorkflow?LoginType=oauth", HttpMethod.Post, authenticate: true, headers: new RestRequestHeaders
        {
            { PosApiHeaders.ProductId, "productId" },
        });
    }

    [Fact]
    public async Task SkipWorkflowAsync_CallWithoutProductIdHeader()
    {
        var result = await target.SkipWorkflowAsync(testMode, new WorkflowParameters("oauth"), ""); // Act

        result.Should().BeSameAs(loginResult);
        receivedRequest.Verify("Authentication.svc/SkipWorkflow?LoginType=oauth", HttpMethod.Post, authenticate: true);
    }

    [Fact]
    public async Task FinalizeWorkflowAsync_ShouldLoginCorrectly()
    {
        var result = await target.FinalizeWorkflowAsync(testMode, new WorkflowParameters(), "productId"); // Act

        result.Should().BeSameAs(loginResult);
        receivedRequest.Verify("Authentication.svc/FinalizeWorkflow?LoginType=", HttpMethod.Post, authenticate: true, headers: new RestRequestHeaders
        {
            { PosApiHeaders.ProductId, "productId" },
        });
    }

    [Fact]
    public async Task FinalizeWorkflowAsync_CallWithoutProductIdHeader()
    {
        var result = await target.FinalizeWorkflowAsync(testMode, new WorkflowParameters(), ""); // Act

        result.Should().BeSameAs(loginResult);
        receivedRequest.Verify("Authentication.svc/FinalizeWorkflow?LoginType=", HttpMethod.Post, authenticate: true);
    }
}
