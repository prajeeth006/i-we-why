using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.Crypto;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.Crypto;

public class CryptoControllerTests
{
    private readonly CryptoController target;
    private readonly Mock<IDataProtectionProvider> dataProtectionProviderMock;
    private readonly Mock<IDataProtector> dataProtectorMock;
    private readonly TestLogger<CryptoController> log;

    public CryptoControllerTests()
    {
        dataProtectionProviderMock = new Mock<IDataProtectionProvider>();
        dataProtectorMock = new Mock<IDataProtector>();
        log = new TestLogger<CryptoController>();

        target = new CryptoController(dataProtectionProviderMock.Object, log);
    }

    [Fact]
    public void Encrypt_ShouldEncryptData()
    {
        // Setup
        var purpose = "test";
        var protectedData = new byte[] { 1, 2, 3 };
        dataProtectorMock.Setup(s => s.Protect(It.IsAny<byte[]>())).Returns(protectedData);
        dataProtectionProviderMock.Setup(s => s.CreateProtector(purpose)).Returns(dataProtectorMock.Object);

        // Act
        var result = (OkObjectResult)target.Encrypt("data", purpose);

        // Assert
        result.Value.Should().BeEquivalentTo(new { result = protectedData });
    }

    [Fact]
    public void Encrypt_ShouldReturnTechnicalError_OnGeneralException()
    {
        // Setup
        var purpose = "test";
        var exception = new Exception(message: "error");
        dataProtectionProviderMock.Setup(s => s.CreateProtector(It.IsAny<string>())).Throws(exception);

        // Act
        var result = target.Encrypt("data", purpose);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception, ("Scope", purpose), ("Exception", exception));
    }

    [Fact]
    public void Decrypt_ShouldDecryptData()
    {
        // Setup
        var data = new byte[] { 1, 2, 3 };
        var purpose = "test";
        dataProtectorMock.Setup(s => s.Unprotect(It.IsAny<byte[]>())).Returns(data);
        dataProtectionProviderMock.Setup(s => s.CreateProtector(purpose)).Returns(dataProtectorMock.Object);

        // Act
        var result = (OkObjectResult)target.Decrypt(data, purpose);

        // Assert
        result.Value.Should().BeEquivalentTo(new { result = data.DecodeToString() });
    }

    [Fact]
    public void Decrypt_ShouldReturnTechnicalError_OnGeneralException()
    {
        // Setup
        var data = new byte[] { 1, 2, 3 };
        var purpose = "test";
        var exception = new Exception(message: "error");
        dataProtectionProviderMock.Setup(s => s.CreateProtector(It.IsAny<string>())).Throws(exception);

        // Act
        var result = target.Decrypt(data, purpose);

        // Assert
        result.Should().BeOfType<TechnicalErrorMessageResult>();
        log.Logged.Single().Verify(LogLevel.Error, exception, ("Scope", purpose), ("Exception", exception));
    }
}
