using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Authentication;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.Globalization;
using Frontend.Vanilla.Features.Login;
using Frontend.Vanilla.Features.NativeApp;
using Frontend.Vanilla.Features.ReCaptcha;
using Frontend.Vanilla.ServiceClients.Security;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Login;

public class LoginServiceTests
{
    private readonly ILoginService target;
    private readonly Mock<IWebAuthenticationService> authenticationServiceMock;
    private readonly Mock<ILanguageService> languageServiceMock;
    private readonly Mock<IContentService> contentServiceMock;
    private readonly Mock<ILoginSettingsConfiguration> loginSettingsConfigurationMock;
    private readonly Mock<IReCaptchaService> reCaptchaServiceMock;
    private readonly Mock<ILogger<LoginService>> logMock;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessorMock;
    private readonly Mock<ILabelIsolatedDistributedCache> distributedCacheMock;
    private readonly Mock<IRememberMeTokenStorage> rememberMeTokenStorageMock;
    private readonly Mock<IServiceProvider> serviceProviderMock;
    private readonly Mock<ILastKnownProductDslProvider> lastKnownProductDslProviderMock;
    private readonly Mock<INativeAppService> nativeAppServiceMock;
    private readonly Mock<ICookieHandler> cookieHandlerMock;
    private readonly Mock<ILoginConfiguration> loginConfiguration;

    public LoginServiceTests()
    {
        loginConfiguration = new Mock<ILoginConfiguration>();
        authenticationServiceMock = new Mock<IWebAuthenticationService>();
        languageServiceMock = new Mock<ILanguageService>();
        contentServiceMock = new Mock<IContentService>();
        loginSettingsConfigurationMock = new Mock<ILoginSettingsConfiguration>();
        reCaptchaServiceMock = new Mock<IReCaptchaService>();
        logMock = new Mock<ILogger<LoginService>>();
        currentUserAccessorMock = new Mock<ICurrentUserAccessor>();
        distributedCacheMock = new Mock<ILabelIsolatedDistributedCache>();
        rememberMeTokenStorageMock = new Mock<IRememberMeTokenStorage>();
        serviceProviderMock = new Mock<IServiceProvider>();
        lastKnownProductDslProviderMock = new Mock<ILastKnownProductDslProvider>();
        nativeAppServiceMock = new Mock<INativeAppService>();
        cookieHandlerMock = new Mock<ICookieHandler>();

        loginSettingsConfigurationMock.SetupGet(c => c.PostLoginRedirects).Returns(
            new Dictionary<string, PostLoginRedirect>()
            {
                {
                    "redirectTerms", new PostLoginRedirect()
                    {
                        Url = "testweb.com",
                        Enabled = Mock.Of<IDslExpression<bool>>(c => c.EvaluateAsync(It.IsAny<ExecutionMode>()) == Task.FromResult(true)),
                    }
                },
            });

        target = new LoginService(
            loginConfiguration.Object,
            authenticationServiceMock.Object,
            languageServiceMock.Object,
            contentServiceMock.Object,
            loginSettingsConfigurationMock.Object,
            reCaptchaServiceMock.Object,
            logMock.Object,
            currentUserAccessorMock.Object,
            distributedCacheMock.Object,
            rememberMeTokenStorageMock.Object,
            serviceProviderMock.Object,
            lastKnownProductDslProviderMock.Object,
            nativeAppServiceMock.Object,
            cookieHandlerMock.Object);
    }

    [Fact]
    public void GetNextPostLoginRedirectAsync_ShouldSave_WhenCookieNull()
    {
        target.GetNextPostLoginRedirectAsync(It.IsAny<ExecutionMode>());

        cookieHandlerMock.Verify(c => c.Set(LoginCookies.DisplayedInterceptors, "redirectTerms", It.IsAny<CookieSetOptions>()));
    }

    [Fact]
    public void GetNextPostLoginRedirectAsync_ShouldSave_WhenRedirectKeyNotInCookie()
    {
        cookieHandlerMock.Setup(c => c.GetValue(LoginCookies.DisplayedInterceptors)).Returns("condition");
        target.GetNextPostLoginRedirectAsync(It.IsAny<ExecutionMode>());

        cookieHandlerMock.Verify(c => c.Set(LoginCookies.DisplayedInterceptors, "condition,redirectTerms", It.IsAny<CookieSetOptions>()));
    }

    [Fact]
    public void GetNextPostLoginRedirectAsync_NotSave_WhenRedirectKeyInCookie()
    {
        cookieHandlerMock.Setup(c => c.GetValue(LoginCookies.DisplayedInterceptors)).Returns("redirectTerms");
        target.GetNextPostLoginRedirectAsync(It.IsAny<ExecutionMode>());

        cookieHandlerMock.Verify(c => c.Set(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CookieSetOptions>()), Times.Never);
    }
}
