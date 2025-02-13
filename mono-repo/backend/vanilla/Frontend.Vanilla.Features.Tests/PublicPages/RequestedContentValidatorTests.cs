using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.PublicPages;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.PublicPages;

public class RequestedContentValidatorTests
{
    private IRequestedContentValidator validator;
    private PublicPagesConfiguration publicPagesConfiguration;

    private Mock<IDocument> document;
    private Mock<IDocumentMetadata> metadata;

    public RequestedContentValidatorTests()
    {
        publicPagesConfiguration = new PublicPagesConfiguration();

        validator = new RequestedContentValidator(publicPagesConfiguration);

        document = new Mock<IDocument>();
        metadata = new Mock<IDocumentMetadata>();
        metadata.SetupGet(m => m.Id).Returns("test");

        document.SetupGet(d => d.Metadata).Returns(metadata.Object);
    }

    [Fact]
    public void Validate_ShouldReturnOkWithDocumentIfSuccess()
    {
        var content = new SuccessContent<IDocument>(document.Object);

        var result = validator.Validate(content);

        result.Should().BeOfType<OkRequestedContentValidationResult>().Which.Document.Should().Be(document.Object);
    }

    [Fact]
    public void Validate_ShouldReturnNotFoundIfNotFound()
    {
        var content = new NotFoundContent<IDocument>(metadata.Object.Id);

        var result = validator.Validate(content);

        result.Should().BeOfType<NotFoundRequestedContentValidationResult>();
    }

    [Fact]
    public void Validate_ShouldReturnNotFoundIfFiltered()
    {
        var content = new FilteredContent<IDocument>(metadata.Object);

        var result = validator.Validate(content);

        result.Should().BeOfType<NotFoundRequestedContentValidationResult>();
    }

    [Fact]
    public void Validate_ShouldReturnErrorIfInvalid()
    {
        var errors = new List<TrimmedRequiredString> { "err1", "err2" };
        var content = new InvalidContent<IDocument>(metadata.Object.Id, metadata.Object, errors);

        var result = validator.Validate(content);

        result.Should().BeOfType<ErrorRequestedContentValidationResult>().Which.Errors.Should().BeEquivalentTo(errors);
    }

    [Fact]
    public void Validate_Strict404_ShouldReturnNotFoundIfDocumentIsPublicPageAndHasNoVersion()
    {
        publicPagesConfiguration.UseStrict404Checking = true;
        var publicPage = new Mock<IPMBasePage>();

        publicPage.SetupGet(p => p.Metadata).Returns(metadata.Object);
        metadata.SetupGet(v => v.Version).Returns(0);

        var content = new SuccessContent<IDocument>(publicPage.Object);

        var result = validator.Validate(content);

        result.Should().BeOfType<NotFoundRequestedContentValidationResult>();
    }

    [Fact]
    public void Validate_Strict404_ShouldReturnOkIfDocumentIsNotPublicPageAndHasNoVersion()
    {
        publicPagesConfiguration.UseStrict404Checking = true;
        metadata.SetupGet(v => v.Version).Returns(0);

        var content = new SuccessContent<IDocument>(document.Object);

        var result = validator.Validate(content);

        result.Should().BeOfType<OkRequestedContentValidationResult>();
    }
}
